import { interpolate } from 'remotion';

export type VoLine = { at: number; frames: number };
export type Hush = { at: number; frames: number; level: number };

export type DuckConfig = {
  /** Nivel de la música cuando no hay voz. */
  base: number;
  /** Nivel debajo de la voz. */
  under: number;
  /** Frames de rampa al entrar y salir del ducking. */
  ramp: number;
  /** Margen antes y después de cada línea, en frames. */
  pad: number;
};

export const DEFAULT_DUCK: DuckConfig = { base: 0.85, under: 0.24, ramp: 9, pad: 6 };

/**
 * Curva de volumen de la música: baja debajo de cada línea de voz y vuelve
 * arriba en cuanto calla.
 *
 *   <Audio src={music} volume={(f) => duckVolume(f, VO, DEFAULT_DUCK, {
 *     musicAt: 0, total: DURATION_IN_FRAMES, hush: HUSH,
 *   })} />
 *
 * Dos cosas que se aprendieron midiendo y no a oído:
 *
 *  - `base` por encima de ~0.85 clipea. Los tracks de librería vienen
 *    masterizados a 0 dB y cualquier efecto encima llega al techo.
 *  - El criterio para saber si el ducking es suficiente es objetivo: la voz
 *    sobre música debe medir aproximadamente lo mismo que la voz sola. Si mide
 *    más, la música sigue sumando energía y se come la locución.
 *
 *      ffmpeg -hide_banner -ss 27 -t 4 -i out.mp4 -af volumedetect -f null -
 *
 * `hush` es para bajones deliberados que no vienen de la voz: un silencio antes
 * de una frase clave, por ejemplo. Que la música se retire y vuelva con la frase
 * es lo que hace que la frase pese.
 */
export const duckVolume = (
  frame: number,
  vo: readonly VoLine[],
  cfg: DuckConfig = DEFAULT_DUCK,
  opts: { musicAt?: number; total: number; hush?: readonly Hush[]; fadeOut?: number } = { total: 0 }
) => {
  const { musicAt = 0, total, hush = [], fadeOut = 45 } = opts;

  const env = interpolate(frame, [musicAt, musicAt + 10, total - fadeOut, total - 2], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  let level = cfg.base;

  for (const line of vo) {
    const a = line.at - cfg.pad;
    const b = line.at + line.frames + cfg.pad;
    level = Math.min(
      level,
      interpolate(frame, [a - cfg.ramp, a, b, b + cfg.ramp], [cfg.base, cfg.under, cfg.under, cfg.base], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    );
  }

  for (const h of hush) {
    level = Math.min(
      level,
      interpolate(frame, [h.at - 14, h.at, h.at + h.frames, h.at + h.frames + 8], [cfg.base, h.level, h.level, cfg.base], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    );
  }

  return level * env;
};
