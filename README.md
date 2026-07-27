# launch-video-kit

Locución, música y cámara para vídeos de producto renderizados con
[Remotion](https://www.remotion.dev/).

Esto no es un framework ni una plantilla de vídeo. Son las cuatro piezas de
fontanería que costaron nueve renders y seis rondas de correcciones al hacer un
vídeo de lanzamiento de 88 segundos, extraídas para no volver a resolverlas:

| | Qué resuelve |
|---|---|
| `scripts/gen-voice.mjs` | locución por líneas contra un endpoint TTS compatible con OpenAI, normalizada |
| `scripts/analyze-music.mjs` | BPM, fase, arco de energía y rejilla de compases de un track |
| `scripts/loop-music.mjs` | alargar un track hasta la duración que necesites sin costura audible |
| `src/audio.ts` | ducking de música bajo la voz, con un criterio medible |
| `src/Subtitle.tsx` | subtítulos legibles sobre una interfaz, para ver el vídeo sin sonido |
| `src/camera.ts` | cámara virtual sobre una UI reconstruida en HTML |

Los scripts funcionan solos, sin instalar nada del repo. Los helpers de
`src/` los copias a tu proyecto de Remotion o los importas.

## Requisitos

- Node 20 o superior (se usa `fetch` y `--env-file-if-exists`)
- `ffmpeg` y `ffprobe` en el PATH
- Para la voz, una API TTS compatible con OpenAI. Por defecto apunta a
  [Helmcode](https://helmcode.com), que sirve Kokoro.

```bash
cp .env.example .env      # y pon tu clave
cp voiceover.example.json voiceover.json
```

---

## 1. Locución

```bash
node --env-file-if-exists=.env scripts/gen-voice.mjs
node --env-file-if-exists=.env scripts/gen-voice.mjs --only 03,09 --force
node --env-file-if-exists=.env scripts/gen-voice.mjs --voice bf_emma --force
```

El texto vive en `voiceover.json`. La salida son ficheros sueltos en
`public/vo/vo-NN.wav`.

Tres cosas que parecen detalles y no lo son:

**Un fichero por línea, nunca una toma larga.** Con ficheros sueltos colocas cada
frase en un frame exacto. Con una sola toma, mover una frase te obliga a rehacer
el montaje entero.

**Normalizar.** Kokoro entrega a unos -25 dB de media. Una pista de música de
librería está sobre -14. Doce decibelios de diferencia: sin normalizar, la voz no
se impone ni bajando la música. El script aplica `loudnorm=I=-16:TP=-1.5`, que
además iguala unas líneas con otras.

**Recortar silencios** de cabeza y cola, para que el frame en el que colocas la
línea sea el inicio real de la frase.

El script imprime la duración real de cada línea en segundos y en frames:

```
id   dur      frames  estado      texto
01   1.91s      58   generada    Every company already has knowledge.
02   1.47s      45   generada    But knowledge used to be trapped.
03   0.78s      24   generada    Until now.
```

Esa columna de frames es la que fija el montaje. **Escribe la voz antes de
montar**, no al revés: si montas primero, cada toma real te descuadra la escena.

El límite: un TTS es habla, no respiración. Suspiros, risas y efectos hay que
grabarlos o sintetizarlos aparte. Los blips de notificación, por ejemplo, salen
de ffmpeg sin buscar assets:

```bash
ffmpeg -f lavfi -i "aevalsrc='0.55*sin(2*PI*880*t)*exp(-24*t)+0.45*gt(t,0.052)*sin(2*PI*1318.5*(t-0.052))*exp(-24*(t-0.052))':d=0.34:s=48000" \
  -af "highpass=f=300,afade=t=out:st=0.28:d=0.06,loudnorm=I=-26:TP=-8" -ac 1 notify.wav
```

---

## 2. Música

### Analizar

```bash
node scripts/analyze-music.mjs --file public/track.mp3
node scripts/analyze-music.mjs --file public/track.mp3 --beats 40,88
node scripts/analyze-music.mjs --file public/track.mp3 --range 74,86
```

Estima el BPM por autocorrelación de la envolvente de onsets, encuentra la fase
(dónde cae el primer beat), dibuja el arco de energía por segundo y lista los
saltos grandes, que son los candidatos a drop.

Sirve para lo que más se nota en un vídeo de producto: **mapear la historia al
arco del track** en lugar de al revés. El drop sobre el momento en que algo se
crea, la parte tranquila sobre la escena densa de leer, el drop final sobre el
clímax. Y con la rejilla de compases, poner todos los cortes en compás.

### Alargar sin que se oiga

```bash
node scripts/loop-music.mjs --file public/track.mp3                       # analiza
node scripts/loop-music.mjs --file public/track.mp3 \
  --loop 12.227,19.846 --target 88 --out public/largo.mp3                 # construye
```

Esta es la parte interesante, porque lo obvio no funciona.

Necesitábamos 88 segundos de un track de 65. Lo obvio es duplicar compases:
calculas el BPM, cortas en un compás exacto y empalmas.

- **6 compases**: se oye. Rompe la métrica de la frase, que en música electrónica
  va en grupos de 4, 8 o 16.
- **16 compases**, una frase entera, en compás exacto, con micro-fundidos en la
  costura: se sigue oyendo. Y aquí está la lección, porque tardamos en verla:
  **no era un clic, era que la música rebobinaba a un punto con otra energía.**
  Un crossfade no arregla eso. El problema no es la transición, es el salto de
  arreglo.

Lo que funciona es olvidarse de la rejilla de compases y mirar el material:

```bash
ffmpeg -i track.mp3 -af "silencedetect=noise=-32dB:d=0.06" -f null /dev/null
```

La mayoría de la música producida tiene micro-silencios periódicos en el mismo
punto de la frase. En el track del vídeo eran huecos de 0.41 s **cada 7.619 s
exactos**. Si cortas en medio de un hueco y entras en medio de otro hueco del
mismo periodo, el bucle es inaudible: no hay nada que interrumpir.

`loop-music.mjs` hace ese análisis, deduce el periodo dominante (y se queda con
el más corto que tenga soporte, porque un múltiplo también aparece como
candidato), propone puntos de corte y construye el resultado. Elegir **qué** tramo
se repite sigue siendo una decisión musical, así que la toma una persona.

Y verifica lo que ha hecho, que es la parte que da confianza:

```
bucle de 7.619 s x 4  ->  95.34 s

nivel en cada costura (debe ser casi silencio):
  19.846s  -53.0 dB  ok
  27.465s  -53.3 dB  ok
  35.084s  -53.8 dB  ok
  42.703s  -53.1 dB  ok
```

La moraleja no es sobre música: cuando la teoría no te da el resultado, mide el
material en vez de refinar la teoría.

---

## 3. Ducking

```tsx
import { Audio, staticFile } from 'remotion';
import { duckVolume, DEFAULT_DUCK } from './audio';

const VO = [
  { at: 4, frames: 58 },
  { at: 244, frames: 45 },
];

<Audio
  src={staticFile('music.mp3')}
  volume={(f) => duckVolume(f, VO, DEFAULT_DUCK, { total: DURATION_IN_FRAMES })}
/>;
```

Dos cosas que se aprendieron midiendo y no a oído.

**`base` por encima de ~0.85 clipea.** Los tracks de librería vienen
masterizados a 0 dB y cualquier efecto encima llega al techo. En una pasada el
pico estaba en 0.0 dB exactos.

**El criterio para saber si el ducking es suficiente es objetivo**: la voz sobre
música debe medir aproximadamente lo mismo que la voz sola. Si mide más, la
música sigue sumando energía y se come la locución.

```bash
ffmpeg -hide_banner -ss 27 -t 4 -i out.mp4 -af volumedetect -f null /dev/null
```

Del vídeo con el que se desarrolló esto:

| Tramo | Media | Pico |
|---|---|---|
| Voz sin música | -22.6 dB | -4.5 dB |
| Solo música | -16.5 dB | -1.4 dB |
| **Voz sobre música** | **-22.4 dB** | -4.6 dB |
| Total | -17.8 dB | -0.9 dB |

Los -22.4 frente a -22.6 son la prueba de que funciona.

`hush` sirve para bajones que no vienen de la voz: un silencio antes de una frase
clave. Que la música se retire y vuelva con la frase es lo que hace que la frase
pese.

---

## 4. Subtítulos

```tsx
import { Subtitles } from './Subtitle';

<Subtitles
  cues={[
    { at: 575, dur: 78, text: 'Upload your documents once.' },
    { at: 740, dur: 96, text: 'And everyone in the company can chat with them.' },
  ]}
  fontFamily={SANS}
/>;
```

Si el vídeo va a redes, se va a ver en silencio. Los subtítulos no son un extra
de accesibilidad, son el canal principal.

La primera versión eran 38 px con una sombra y no se leía nada, porque compite
contra una interfaz que ya está llena de texto. Lo que funciona es **apagar el
fondo con un degradado** (el 32 % inferior del fotograma) y subir el texto a
**54 px en peso medio**. Comprobado sobre UI oscura y sobre UI clara.

Dos reglas de guion:

- **`dur` es tiempo en pantalla, no duración de la voz.** Entra antes y se queda
  después, para poder leerlo.
- **Subtitula solo lo que no está ya escrito en pantalla.** Si la frase aparece
  en un rótulo a pantalla completa, subtitularla es poner el mismo texto dos
  veces en el mismo sitio. Y recorta los rangos a mano para que ningún subtítulo
  pise al siguiente ni al rótulo que venga detrás.

---

## 5. Cámara

```tsx
import { moves, useCamera } from './camera';

const DESIGN = { width: 1920, height: 1080 };
const cam = useCamera(
  moves([
    { at: 0, fx: 960, fy: 540, s: 1.0 },
    { at: 62, fx: 1275, fy: 660, s: 1.24 },
    { at: 152, fx: 1275, fy: 470, s: 1.06 },
  ]),
  frame,
  DESIGN
);

<div style={{ ...DESIGN, transform: cam.transform, transformOrigin: '0 0' }}>
  {/* la UI compuesta en el espacio de diseño */}
</div>;
```

Compones la interfaz en un espacio de diseño fijo y mueves una cámara que centra
un punto a una escala. Así haces primeros planos de una zona concreta sin tocar
el layout, y el texto sigue siendo texto: nítido a cualquier escala.

El estilo de movimiento costó tres iteraciones **con una persona mirando el
resultado**, y las dos primeras fueron rechazadas:

1. Paneos y zooms **continuos** dentro de una escena. Se leen como cámara en
   mano y distraen de lo que pasa en la interfaz.
2. **Cortes secos** entre encuadres. Se leen como saltos, sobre todo al cambiar
   de escena.
3. Lo que funciona: la cámara está quieta casi todo el rato y **solo viaja unos
   24 frames justo antes de llegar al siguiente encuadre**.

Y una regla que importa más que el propio helper: **cada escena debe empezar en
el encuadre donde acabó la anterior.** Eso es lo que hace que un cambio de escena
no se lea como un corte.

Corolario, por si ahorra a alguien un rato de desconcierto: cuando dos escenas
adyacentes muestran la misma interfaz, usa **el mismo componente** a los dos
lados de la costura. Si una de ellas la pinta a mano, va a diferir en algún
detalle (a nosotros nos faltaba la caja de mensaje) y ese detalle aparece de
golpe al cambiar de escena.

`useCamera` recorta el punto de foco para que el lienzo nunca muestre vacío
fuera del espacio de diseño: sin eso, un primer plano cerca de un borde deja
media pantalla en negro.

---

## Verificar antes de mostrar nada

Un agente no puede ver el vídeo ni oírlo, y una persona no quiere revisar 2.634
fotogramas. Las dos cosas se resuelven midiendo:

```bash
# contact sheet de fotogramas clave
for fr in 40 260 480 700; do
  ffmpeg -v error -i out.mp4 -vf "select=eq(n\,$fr),scale=560:-1" -vframes 1 -y f_$fr.png
done
ffmpeg -v error -i f_%d.png -vf "tile=2x2" -frames:v 1 sheet.png

# la mezcla, por tramos
ffmpeg -hide_banner -ss 27 -t 4 -i out.mp4 -af volumedetect -f null /dev/null
```

Nota para quien trabaje en Git Bash sobre Windows: aquí `ffmpeg` no soporta
patrones `glob` y `drawtext` se cae por falta de fontconfig. Usa secuencias
numeradas y etiqueta los fotogramas fuera de ffmpeg.

---

## De dónde sale esto

Del vídeo de lanzamiento de Knowledge, la función de
[Helmcode](https://helmcode.com) que convierte tus documentos y repositorios en
un chat. 88 segundos, interfaz reconstruida en HTML, voz generada con Kokoro
corriendo en la propia plataforma.

MIT. Si lo usas y algo no encaja, abre un issue.
