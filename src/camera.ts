import { Easing, interpolate } from 'remotion';

/**
 * Cámara virtual sobre una UI reconstruida en HTML.
 *
 * La idea: compones la interfaz en un espacio de diseño fijo (por ejemplo
 * 1920x1080) y luego mueves una "cámara" que centra un punto (fx, fy) a una
 * escala s. Eso te deja hacer primeros planos de una zona concreta sin tocar el
 * layout.
 *
 * Sobre el estilo de movimiento, que costó tres iteraciones con una persona
 * mirando el resultado:
 *
 *  - Paneos y zooms CONTINUOS dentro de una escena se leen como cámara en mano
 *    y distraen de lo que está pasando en la interfaz.
 *  - Cortes SECOS entre encuadres se leen como saltos, sobre todo al cambiar de
 *    escena.
 *
 * Lo que funciona es `moves()`: la cámara está quieta casi todo el rato y solo
 * viaja unos frames justo antes de llegar al siguiente encuadre. Y una regla que
 * importa más que el propio helper: cada escena debe EMPEZAR en el encuadre
 * donde acabó la anterior. Eso es lo que hace que un cambio de escena no se lea
 * como un corte.
 */
export type Cam = { f: number[]; fx: number[]; fy: number[]; s: number[] };

export type Framing = { at: number; fx: number; fy: number; s: number };

/** Un encuadre fijo, sin movimiento. */
export const fixed = (fx: number, fy: number, s: number): Cam => ({
  f: [0, 1],
  fx: [fx, fx],
  fy: [fy, fy],
  s: [s, s],
});

/**
 * Encuadres enlazados con un viaje corto. Cada uno aguanta quieto y la cámara
 * se desplaza `ease` frames antes de llegar al siguiente.
 */
export const moves = (list: readonly Framing[], ease = 24): Cam => {
  const f: number[] = [];
  const fx: number[] = [];
  const fy: number[] = [];
  const s: number[] = [];
  list.forEach((k, i) => {
    if (i > 0) {
      const prev = list[i - 1];
      f.push(Math.max(prev.at + 1, k.at - ease));
      fx.push(prev.fx);
      fy.push(prev.fy);
      s.push(prev.s);
    }
    f.push(k.at);
    fx.push(k.fx);
    fy.push(k.fy);
    s.push(k.s);
  });
  return { f, fx, fy, s };
};

/** Encuadres con corte seco. Úsalo solo cuando el corte sea intencionado. */
export const cuts = (list: readonly Framing[]): Cam => {
  const f: number[] = [];
  const fx: number[] = [];
  const fy: number[] = [];
  const s: number[] = [];
  list.forEach((k, i) => {
    const next = list[i + 1];
    f.push(k.at);
    fx.push(k.fx);
    fy.push(k.fy);
    s.push(k.s);
    if (next) {
      f.push(next.at - 1);
      fx.push(k.fx);
      fy.push(k.fy);
      s.push(k.s);
    }
  });
  return { f, fx, fy, s };
};

/**
 * Devuelve el transform que hay que aplicar al contenedor del espacio de diseño.
 * El punto de foco se recorta para que el lienzo nunca muestre vacío fuera del
 * diseño: sin esto, un primer plano cerca de un borde deja media pantalla negra.
 *
 *   const cam = useCamera(moves([...]), frame, { width: 1920, height: 1080 });
 *   <div style={{ width: 1920, height: 1080, transform: cam.transform,
 *                 transformOrigin: '0 0' }}>
 */
export const useCamera = (
  cam: Cam,
  frame: number,
  design: { width: number; height: number }
) => {
  const o = {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  } as const;

  const s = interpolate(frame, cam.f, cam.s, o);
  const hw = design.width / 2 / s;
  const hh = design.height / 2 / s;
  const clamp = (v: number, lo: number, hi: number) =>
    lo > hi ? (lo + hi) / 2 : Math.min(Math.max(v, lo), hi);

  const x = clamp(interpolate(frame, cam.f, cam.fx, o), hw, design.width - hw);
  const y = clamp(interpolate(frame, cam.f, cam.fy, o), hh, design.height - hh);

  return {
    s,
    transform: `translate(${design.width / 2 - x * s}px, ${design.height / 2 - y * s}px) scale(${s})`,
  };
};

/**
 * Escala el espacio de diseño al lienzo real. El cursor y otros elementos que
 * vivan dentro del espacio UI tienen que compensar `cam.s` para no crecer con
 * el zoom: `transform: scale(1 / camScale)`.
 */
export const fitScale = (
  canvas: { width: number; height: number },
  design: { width: number; height: number }
) => Math.min(canvas.width / design.width, canvas.height / design.height);
