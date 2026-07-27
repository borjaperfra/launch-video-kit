#!/usr/bin/env node
/**
 * Genera la locución de un vídeo contra cualquier endpoint TTS compatible con
 * OpenAI (`POST /audio/speech`). Se desarrolló contra Kokoro servido por
 * Helmcode, pero sirve igual con otro proveedor: cambian TTS_BASE_URL y el
 * nombre del modelo.
 *
 *   node --env-file-if-exists=.env scripts/gen-voice.mjs
 *   node --env-file-if-exists=.env scripts/gen-voice.mjs --force
 *   node --env-file-if-exists=.env scripts/gen-voice.mjs --only 03,09
 *   node --env-file-if-exists=.env scripts/gen-voice.mjs --voice bf_emma --force
 *   node --env-file-if-exists=.env scripts/gen-voice.mjs --config voz.json --out public/vo
 *
 * Tres decisiones que parecen detalles y no lo son:
 *
 * 1. UN FICHERO POR LÍNEA, nunca una toma larga. Con ficheros sueltos colocas
 *    cada frase en un frame exacto. Con una sola toma, mover una frase obliga a
 *    rehacer el montaje entero.
 *
 * 2. NORMALIZAR. Kokoro entrega a unos -25 dB de media y una pista de música de
 *    librería está sobre -14. Doce decibelios de diferencia: sin normalizar, la
 *    voz no se impone ni bajando la música. Se aplica loudnorm, que además
 *    iguala unas líneas con otras.
 *
 * 3. RECORTAR SILENCIOS de cabeza y cola, para que el frame en el que colocas la
 *    línea sea el inicio real de la frase y no un silencio variable.
 *
 * Al terminar imprime la duración real de cada línea en segundos y en frames.
 * Esos números son los que fijan el montaje: escribe la voz ANTES de montar.
 */

import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { promisify } from 'node:util';

const run = promisify(execFile);

const BASE_URL = process.env.TTS_BASE_URL ?? 'https://api.helmcode.com/v1';
const API_KEY = process.env.TTS_API_KEY ?? process.env.HELMCODE_API_KEY;

const argv = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : fallback;
};
const force = argv.includes('--force');
const only = flag('only');
const configPath = flag('config', 'voiceover.json');
const outDir = flag('out', 'public/vo');
const fps = Number(flag('fps', '30'));

if (!existsSync(configPath)) {
  console.error(`No encuentro ${configPath}. Copia voiceover.example.json y edítalo.`);
  process.exit(1);
}
if (!API_KEY) {
  console.error('Falta TTS_API_KEY (o HELMCODE_API_KEY). Ponla en .env, ver .env.example.');
  process.exit(1);
}

const cfg = JSON.parse(readFileSync(configPath, 'utf8'));
const voice = flag('voice', cfg.voice);
const speed = Number(flag('speed', String(cfg.speed ?? 1)));

mkdirSync(outDir, { recursive: true });

const wanted = only ? new Set(only.split(',').map((s) => s.trim())) : null;
const lines = cfg.lines.filter((l) => !wanted || wanted.has(l.id));

/**
 * La API devuelve un RIFF con tamaño 0xFFFFFFFF (escritura en streaming), así
 * que hay que reenvasarlo. De paso se recortan silencios y se normaliza.
 */
const normalize = async (raw, out) =>
  run('ffmpeg', [
    '-v', 'error', '-y', '-i', raw,
    '-af',
    'silenceremove=start_periods=1:start_silence=0.03:start_threshold=-50dB,' +
      'areverse,silenceremove=start_periods=1:start_silence=0.06:start_threshold=-50dB,areverse,' +
      `loudnorm=I=${cfg.loudnorm?.I ?? -16}:TP=${cfg.loudnorm?.TP ?? -1.5}:LRA=${cfg.loudnorm?.LRA ?? 11}`,
    '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le',
    out,
  ]);

const duration = async (file) => {
  const { stdout } = await run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]);
  return Number(stdout.trim());
};

console.log(`\n${cfg.model} · voz ${voice} · speed ${speed} · ${BASE_URL}\n`);

const report = [];
for (const line of lines) {
  const out = `${outDir}/vo-${line.id}.wav`;

  if (existsSync(out) && !force) {
    report.push([line.id, await duration(out), line.text, 'ya existía']);
    continue;
  }

  const res = await fetch(`${BASE_URL}/audio/speech`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: cfg.model, input: line.text, voice, speed, response_format: 'wav' }),
  });

  if (!res.ok) {
    console.error(`vo-${line.id}: HTTP ${res.status} ${await res.text()}`);
    process.exit(1);
  }

  const raw = `${outDir}/.raw-${line.id}.wav`;
  writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
  await normalize(raw, out);
  unlinkSync(raw);

  report.push([line.id, await duration(out), line.text, 'generada']);
}

console.log('id   dur      frames  estado      texto');
for (const [id, dur, text, state] of report) {
  console.log(`${id}   ${dur.toFixed(2)}s   ${String(Math.ceil(dur * fps)).padStart(4)}   ${state.padEnd(10)}  ${text}`);
}
console.log(`\ntotal de voz: ${report.reduce((a, [, d]) => a + d, 0).toFixed(2)}s`);
console.log('\nCopia la columna de frames a tu módulo de timing: son las duraciones reales.\n');
