#!/usr/bin/env node
// Analiza public/music.mp3 y propone dónde empezar el vídeo y dónde caen los
// cortes: estima BPM por autocorrelación de la envolvente de onsets y
// localiza los saltos de energía (entradas de sección / drop).
//
//   node scripts/analyze-music.mjs [--file public/track.mp3]
//   node scripts/analyze-music.mjs --file public/track.mp3 --beats 40,88
//
// --beats <from>,<to> imprime los frames de vídeo (30 fps, con el inicio en
// <from>) de cada golpe detectado en esa ventana: cópialos a MONTAGE/BURST
// para cortar sobre el beat. --file por defecto es public/music.mp3.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const run = promisify(execFile);
const ROOT = path.join(import.meta.dirname, '..');
const SR = 22050;
const HOP = 512;
const FPS_ENV = SR / HOP; // ~43 frames de análisis por segundo

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i === -1 ? d : Number(process.argv[i + 1]);
};

// --- fichero de audio (--file, por defecto public/music.mp3) --------------
const fileArgI = process.argv.indexOf('--file');
const fileRel = fileArgI === -1 ? 'public/music.mp3' : process.argv[fileArgI + 1];
const audioPath = path.isAbsolute(fileRel) ? fileRel : path.join(ROOT, fileRel);

// --- decodifica a PCM mono 16 bit -----------------------------------------
const { stdout } = await run(
  'ffmpeg',
  ['-hide_banner', '-loglevel', 'error', '-i', audioPath,
   '-ac', '1', '-ar', String(SR), '-f', 's16le', '-'],
  { encoding: 'buffer', maxBuffer: 1 << 28 }
);
const pcm = new Int16Array(stdout.buffer, stdout.byteOffset, Math.floor(stdout.length / 2));
const totalSec = pcm.length / SR;

// --- envolvente de energía ------------------------------------------------
const nFrames = Math.floor((pcm.length - 1024) / HOP);
const energy = new Float64Array(nFrames);
for (let f = 0; f < nFrames; f++) {
  let sum = 0;
  const start = f * HOP;
  for (let i = 0; i < 1024; i++) {
    const v = pcm[start + i] / 32768;
    sum += v * v;
  }
  energy[f] = Math.sqrt(sum / 1024);
}

// Onsets = sólo los aumentos de energía (half-wave rectified flux).
const onset = new Float64Array(nFrames);
for (let f = 1; f < nFrames; f++) onset[f] = Math.max(0, energy[f] - energy[f - 1]);

// --- BPM por autocorrelación ---------------------------------------------
const mean = onset.reduce((a, b) => a + b, 0) / nFrames;
const centered = Float64Array.from(onset, (v) => v - mean);

const lagFor = (bpm) => Math.round((60 / bpm) * FPS_ENV);
let best = { bpm: 0, score: -Infinity };
for (let bpm = 70; bpm <= 180; bpm += 0.25) {
  const lag = lagFor(bpm);
  let s = 0;
  for (let f = 0; f + lag < nFrames; f++) s += centered[f] * centered[f + lag];
  s /= nFrames - lag;
  if (s > best.score) best = { bpm, score: s };
}

// --- fase: qué offset maximiza la energía en las posiciones de beat -------
const beatLag = (60 / best.bpm) * FPS_ENV;
let bestPhase = { offset: 0, score: -Infinity };
for (let o = 0; o < beatLag; o += 0.25) {
  let s = 0;
  for (let b = 0; ; b++) {
    const f = Math.round(o + b * beatLag);
    if (f >= nFrames) break;
    s += onset[f];
  }
  if (s > bestPhase.score) bestPhase = { offset: o, score: s };
}
const firstBeatSec = bestPhase.offset / FPS_ENV;
const beatSec = 60 / best.bpm;

// --- secciones: saltos de energía media por segundo ----------------------
const perSec = [];
for (let s = 0; s < Math.floor(totalSec); s++) {
  let sum = 0;
  let count = 0;
  for (let f = Math.floor(s * FPS_ENV); f < (s + 1) * FPS_ENV && f < nFrames; f++) {
    sum += energy[f];
    count++;
  }
  perSec.push(sum / count);
}
const maxE = Math.max(...perSec);

// Un "salto" = la media de los 4 s siguientes sube mucho sobre los 4 previos.
const jumps = [];
for (let s = 4; s < perSec.length - 4; s++) {
  const before = perSec.slice(s - 4, s).reduce((a, b) => a + b, 0) / 4;
  const after = perSec.slice(s, s + 4).reduce((a, b) => a + b, 0) / 4;
  if (before > 0.001) jumps.push({ sec: s, ratio: after / before, after });
}
jumps.sort((a, b) => b.ratio - a.ratio);

// --- salida ---------------------------------------------------------------
console.log(`\nduración: ${totalSec.toFixed(1)} s`);
console.log(`BPM estimado: ${best.bpm.toFixed(2)}  (1 beat = ${beatSec.toFixed(3)} s)`);
console.log(`primer beat en: ${firstBeatSec.toFixed(3)} s`);
console.log(`1 compás (4 beats) = ${(beatSec * 4).toFixed(3)} s`);

console.log('\nenergía por segundo (track completo):');
for (let s = 0; s < perSec.length; s += 2) {
  const bars = '#'.repeat(Math.round((perSec[s] / maxE) * 42));
  console.log(`${String(s).padStart(3)}s |${bars}`);
}

console.log('\nmayores saltos de energía (candidatos a drop):');
for (const j of jumps.slice(0, 8).sort((a, b) => a.sec - b.sec)) {
  console.log(`  ${String(j.sec).padStart(3)}s  x${j.ratio.toFixed(2)}`);
}

// --range 74,86 -> energía a 0,25 s para localizar el golpe exacto
const range = process.argv.indexOf('--range');
if (range !== -1) {
  const [a, b] = process.argv[range + 1].split(',').map(Number);
  console.log(`\ndetalle ${a}-${b} s (resolución 0,25 s):`);
  const step = 0.25;
  const vals = [];
  for (let t = a; t < b; t += step) {
    let sum = 0;
    let c = 0;
    for (let f = Math.floor(t * FPS_ENV); f < (t + step) * FPS_ENV && f < nFrames; f++) {
      sum += energy[f];
      c++;
    }
    vals.push({ t, e: sum / c });
  }
  const m = Math.max(...vals.map((v) => v.e));
  for (const v of vals) {
    const onBar = Math.abs(((v.t - firstBeatSec) % (beatSec * 4))) < step ? ' <- compás' : '';
    console.log(
      `  ${v.t.toFixed(2)}s |${'#'.repeat(Math.round((v.e / m) * 40))}${onBar}`
    );
  }
}

// --- frames de beat de una ventana (--beats from,to) ----------------------
// Picos de onset sobre umbral, separación mínima, mapeados a frames de vídeo
// (30 fps) con el origen en `from`. Para colocar cortes a beat.
const beatsArg = process.argv.indexOf('--beats');
if (beatsArg !== -1) {
  const [w0, w1] = process.argv[beatsArg + 1].split(',').map(Number);
  const f0 = Math.floor(w0 * FPS_ENV);
  const f1 = Math.floor(w1 * FPS_ENV);
  let m = 0;
  for (let i = f0; i < f1; i++) m += onset[i];
  m /= f1 - f0;
  let v = 0;
  for (let i = f0; i < f1; i++) v += (onset[i] - m) ** 2;
  const thr = m + 0.6 * Math.sqrt(v / (f1 - f0));
  const minGap = Math.floor(0.28 * FPS_ENV);
  const frames = [];
  let last = -1e9;
  for (let i = f0 + 1; i < f1 - 1; i++) {
    if (onset[i] > thr && onset[i] >= onset[i - 1] && onset[i] > onset[i + 1] && i - last >= minGap) {
      frames.push(Math.round((i / FPS_ENV - w0) * 30));
      last = i;
    }
  }
  console.log(`\ngolpes en ventana ${w0}-${w1}s -> frames de vídeo (origen en ${w0}s):`);
  console.log('  ' + frames.join(', '));
}

console.log('\nrejilla de compases desde el primer beat:');
for (let bar = 0; bar < 20; bar++) {
  const t = firstBeatSec + bar * beatSec * 4;
  if (t > 60) break;
  console.log(`  compás ${String(bar + 1).padStart(2)}: ${t.toFixed(3)} s  (frame ${Math.round(t * 30)})`);
}
console.log();
