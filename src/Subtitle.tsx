import React from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';

/**
 * Subtítulo para vídeo de producto que se va a ver SIN SONIDO.
 *
 * La primera versión de esto era texto de 38 px con una sombra y no se leía
 * nada, porque compite contra una interfaz que ya está llena de texto. Lo que
 * funciona es apagar el fondo con un degradado y subir el texto a 54 px en peso
 * medio. Se comprobó sobre UI oscura y sobre UI clara.
 *
 * Y una regla de guion que ahorra ruido: subtitula solo las líneas que NO están
 * ya escritas en pantalla. Si la frase aparece en un rótulo a pantalla completa,
 * subtitularla es poner el mismo texto dos veces en el mismo sitio.
 */
export const Subtitle: React.FC<{
  text: string;
  opacity: number;
  fontFamily?: string;
  /** Altura del degradado, como fracción del alto del lienzo. */
  scrim?: number;
  fontSize?: number;
  color?: string;
  /** Color base del degradado, en rgb sin alfa. */
  scrimColor?: string;
}> = ({
  text,
  opacity,
  fontFamily = 'system-ui, sans-serif',
  scrim = 0.32,
  fontSize = 54,
  color = '#ffffff',
  scrimColor = '5,7,12',
}) => (
  <AbsoluteFill style={{ opacity, zIndex: 90 }}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: `${scrim * 100}%`,
        background: `linear-gradient(to top, rgba(${scrimColor},0.94) 0%, rgba(${scrimColor},0.86) 38%, rgba(${scrimColor},0.55) 68%, rgba(${scrimColor},0) 100%)`,
      }}
    />
    <div style={{ position: 'absolute', left: '8%', right: '8%', bottom: '6.4%', textAlign: 'center' }}>
      <div
        style={{
          fontFamily,
          fontSize,
          fontWeight: 500,
          lineHeight: 1.24,
          color,
          letterSpacing: '-0.018em',
          textShadow: '0 2px 22px rgba(0,0,0,0.9)',
        }}
      >
        {text}
      </div>
    </div>
  </AbsoluteFill>
);

export type SubtitleCue = {
  /** Frame en el que aparece. */
  at: number;
  /** Frames EN PANTALLA, no la duración de la voz: entra antes y se queda después. */
  dur: number;
  text: string;
};

/**
 * Pinta una lista de subtítulos. Recorta los rangos a mano para que ninguno pise
 * al siguiente ni al rótulo que venga detrás: es el error más fácil de cometer.
 */
export const Subtitles: React.FC<{
  cues: readonly SubtitleCue[];
  fontFamily?: string;
}> = ({ cues, fontFamily }) => (
  <>
    {cues.map((c) => (
      <Sequence key={`${c.at}-${c.text}`} from={c.at} durationInFrames={c.dur} layout="none">
        <Cue frames={c.dur} text={c.text} fontFamily={fontFamily} />
      </Sequence>
    ))}
  </>
);

const Cue: React.FC<{ frames: number; text: string; fontFamily?: string }> = ({ frames, text, fontFamily }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 6, frames - 10, frames - 2], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <Subtitle text={text} opacity={opacity} fontFamily={fontFamily} />;
};
