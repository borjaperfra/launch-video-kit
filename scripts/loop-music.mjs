#!/usr/bin/env node
/**
 * Alarga un track hasta la duración que necesites, sin costura audible.
 *
 *   node scripts/loop-music.mjs --file track.mp3
 *   node scripts/loop-music.mjs --file track.mp3 --loop 12.227,19.846 --target 88 --out largo.mp3
 *
 * Por qué existe
 * -------------
 * Lo obvio es duplicar compases: calculas el BPM, cortas en un compás exacto y
 * empalmas. No funciona. Probamos con 6 compases (rompe la métrica de la frase)
 * y con 16 (una frase entera, en compás exacto, con micro-fundidos) y las dos
 * veces se oía. Y no era un clic: era que la música REBOBINA a un punto con otra
 * energía. Un crossfade no arregla eso, porque el problema no es la transición,
 * es el salto de arreglo.
 *
 * Lo que sí funciona es olvidarse de la rejilla de compases y buscar los HUECOS
 * naturales del track. La mayoría de la música producida tiene micro-silencios
 * periódicos en el mismo punto de la frase. Si cortas en medio de un hueco y
 * entras en medio de otro hueco del mismo periodo, el bucle es inaudible: no hay
 * nada que interrumpir.
 *
 * En el track con el que se desarrolló esto había huecos de 0.41 s cada 7.619 s
 * exactos. Las cuatro costuras del resultado midieron -53 dB, o sea silencio.
 *
 * Sin --loop el script solo analiza: lista los huecos, deduce el periodo y
 * propone puntos de corte. Elegir QUÉ tramo se repite es una decisión musical,
 * así que la toma una persona.
 */

import { execFile } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);

const arg = (name, fallback = null) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : fallback;
};

const file = arg('file');
if (!file) {
  console.error('Falta --file <track.mp3>. Usa --help para ver el resto.');
  process.exit(1);
}
const noise = arg('noise', '-32dB');
const minGap = Number(arg('min-gap', '0.06'));
const loopArg = arg('loop');
const target = Number(arg('target', '0'));
const out = arg('out', 'looped.mp3');
const bitrate = arg('bitrate', '192k');

const duration = async (f) => {
  const { stdout } = await run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]);
  return Number(stdout.trim());
};

/** Nivel medio de una ventana, en dBFS. Sirve para verificar las costuras. */
const meanDb = async (f, at, len) => {
  const { stderr } = await run(
    'ffmpeg',
    ['-hide_banner', '-ss', String(Math.max(0, at)), '-t', String(len), '-i', f, '-af', 'volumedetect', '-f', 'null', '-'],
    { encoding: 'utf8' }
  ).catch((e) => ({ stderr: e.stderr ?? '' }));
  const m = /mean_volume:\s*(-?[\d.]+) dB/.exec(stderr);
  return m ? Number(m[1]) : NaN;
};

/** Huecos por debajo del umbral: [{start, end, mid, dur}] */
const findGaps = async (f) => {
  const { stderr } = await run(
    'ffmpeg',
    ['-hide_banner', '-i', f, '-af', `silencedetect=noise=${noise}:d=${minGap}`, '-f', 'null', '-'],
    { encoding: 'utf8', maxBuffer: 1 << 26 }
  ).catch((e) => ({ stderr: e.stderr ?? '' }));

  const gaps = [];
  let open = null;
  for (const line of stderr.split('\n')) {
    const s = /silence_start:\s*(-?[\d.]+)/.exec(line);
    const e = /silence_end:\s*([\d.]+)/.exec(line);
    if (s) open = Number(s[1]);
    if (e && open !== null) {
      const start = open;
      const end = Number(e[1]);
      gaps.push({ start, end, mid: (start + end) / 2, dur: end - start });
      open = null;
    }
  }
  return gaps;
};

/**
 * Periodo dominante entre huecos. Se agrupan las diferencias entre puntos
 * medios y se queda la que más se repite: ese es el largo de la frase.
 */
const dominantPeriod = (gaps) => {
  const diffs = [];
  for (let i = 0; i < gaps.length; i++) {
    for (let j = i + 1; j < gaps.length; j++) {
      const d = gaps[j].mid - gaps[i].mid;
      if (d > 2 && d < 40) diffs.push(d);
    }
  }
  if (!diffs.length) return null;

  const tol = 0.06; // 60 ms: por debajo de eso nadie oye la diferencia

  // Todos los grupos de diferencias parecidas.
  const clusters = [];
  for (const d of diffs) {
    if (clusters.some((c) => Math.abs(c.period - d) <= tol)) continue;
    const members = diffs.filter((x) => Math.abs(x - d) <= tol);
    clusters.push({ period: members.reduce((a, b) => a + b, 0) / members.length, hits: members.length });
  }
  if (!clusters.length) return null;

  // Un múltiplo del periodo real también aparece como grupo fuerte, así que de
  // entre los que tienen soporte suficiente se elige el MÁS CORTO: un bucle
  // corto da más granularidad para ajustar la duración final.
  const maxHits = Math.max(...clusters.map((c) => c.hits));
  const strong = clusters.filter((c) => c.hits >= maxHits * 0.6).sort((a, b) => a.period - b.period);
  return strong[0];
};

const total = await duration(file);
const gaps = await findGaps(file);

console.log(`\n${path.basename(file)}  ${total.toFixed(2)} s`);
console.log(`huecos por debajo de ${noise} y de al menos ${minGap} s: ${gaps.length}\n`);

if (!gaps.length) {
  console.error('No hay huecos. Prueba a subir el umbral: --noise -28dB');
  process.exit(1);
}

const wide = gaps.filter((g) => g.dur >= 0.2);
console.log('  inicio     fin      dur    centro');
for (const g of gaps) {
  const mark = g.dur >= 0.2 ? ' <-' : '';
  console.log(
    `  ${g.start.toFixed(3).padStart(7)}  ${g.end.toFixed(3).padStart(7)}  ${g.dur.toFixed(3)}  ${g.mid.toFixed(3)}${mark}`
  );
}

const dom = dominantPeriod(wide.length >= 3 ? wide : gaps);
if (dom) {
  console.log(`\nperiodo dominante entre huecos: ${dom.period.toFixed(3)} s  (${dom.hits} coincidencias)`);
  const usable = (wide.length >= 3 ? wide : gaps).filter((g, i, a) =>
    a.some((h) => Math.abs(h.mid - g.mid - dom.period) <= 0.06)
  );
  if (usable.length) {
    const a = usable[Math.floor(usable.length / 3)];
    const b = (wide.length >= 3 ? wide : gaps).find((h) => Math.abs(h.mid - a.mid - dom.period) <= 0.06);
    if (b) {
      console.log(`sugerencia:  --loop ${a.mid.toFixed(3)},${b.mid.toFixed(3)}`);
      if (target) {
        const need = Math.ceil((target - total) / dom.period);
        console.log(`para llegar a ${target} s hacen falta ${need} repeticiones`);
      }
    }
  }
}

if (!loopArg) {
  console.log('\nPasa --loop <centroA>,<centroB> --target <segundos> --out <fichero> para construirlo.\n');
  process.exit(0);
}

// ---------------------------------------------------------------- construir

const [loopFrom, loopTo] = loopArg.split(',').map(Number);
if (!(loopTo > loopFrom)) {
  console.error('--loop necesita dos tiempos crecientes, en segundos.');
  process.exit(1);
}
const loopLen = loopTo - loopFrom;
if (!target) {
  console.error('Falta --target <segundos>.');
  process.exit(1);
}

const repeats = Math.max(1, Math.ceil((target - total) / loopLen));
const finalLen = total + repeats * loopLen;

console.log(`\nbucle de ${loopLen.toFixed(3)} s x ${repeats}  ->  ${finalLen.toFixed(2)} s`);

const tmp = mkdtempSync(path.join(tmpdir(), 'loopmusic-'));
try {
  const A = path.join(tmp, 'a.wav');
  const B = path.join(tmp, 'b.wav');
  const Cc = path.join(tmp, 'c.wav');

  // Sin fundidos: los cortes caen en silencio, así que no hay clic que tapar.
  // Y así la duración es exacta, que es lo que permite atar el vídeo a compás.
  await run('ffmpeg', ['-v', 'error', '-y', '-i', file, '-t', String(loopTo), '-ar', '44100', '-c:a', 'pcm_s16le', A]);
  await run('ffmpeg', ['-v', 'error', '-y', '-ss', String(loopFrom), '-i', file, '-t', String(loopLen), '-ar', '44100', '-c:a', 'pcm_s16le', B]);
  await run('ffmpeg', ['-v', 'error', '-y', '-ss', String(loopTo), '-i', file, '-ar', '44100', '-c:a', 'pcm_s16le', Cc]);

  const list = path.join(tmp, 'list.txt');
  writeFileSync(list, [`file '${A}'`, ...Array(repeats).fill(`file '${B}'`), `file '${Cc}'`].join('\n').replace(/\\/g, '/'));

  await run('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c:a', 'libmp3lame', '-b:a', bitrate, out]);

  const got = await duration(out);
  console.log(`\n${out}  ${got.toFixed(3)} s`);

  // Verificación: cada costura debe caer en silencio.
  console.log('\nnivel en cada costura (debe ser casi silencio):');
  let ok = true;
  for (let i = 0; i <= repeats; i++) {
    const at = loopTo + i * loopLen;
    const db = await meanDb(out, at - 0.1, 0.2);
    const good = db < -40;
    ok = ok && good;
    console.log(`  ${at.toFixed(3)}s  ${db.toFixed(1)} dB  ${good ? 'ok' : 'ATENCION: se va a oir'}`);
  }
  if (!ok) {
    console.log('\nAlguna costura no cae en silencio. Prueba otros dos centros de hueco,');
    console.log('o baja el umbral con --noise -36dB para quedarte solo con los huecos limpios.');
  }
  console.log();
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
