---
name: launch-video-kit
description: Añade locución, música, subtítulos o movimiento de cámara a un vídeo hecho con Remotion, usando las piezas de este repo. Úsala cuando haya que generar voz en off con un TTS, elegir o alargar una pista de música, mezclar voz sobre música, poner subtítulos legibles sobre una interfaz, o mover una cámara virtual sobre una UI reconstruida en HTML.
---

# launch-video-kit

Seis piezas para la parte del vídeo que no es el diseño: audio, subtítulos y
cámara. El **README es la referencia** (el porqué de cada decisión y los números
que la respaldan). Esto es el orden de trabajo y las reglas que es fácil saltarse.

## El orden importa

1. **La voz primero, el montaje después.** `gen-voice.mjs` imprime la duración
   real de cada línea en frames. Esos números fijan los tiempos de escena. Si
   montas primero, cada toma real te descuadra el montaje y hay que rehacerlo.
2. **Después la música**, eligiendo la ventana por su arco de energía
   (`analyze-music.mjs`) y alargándola si hace falta (`loop-music.mjs`).
3. **Luego los cortes**, atados a la rejilla de compases que imprime el análisis.
4. **Los subtítulos al final**, cuando ya sabes qué frases tienen rótulo en
   pantalla y cuáles no.

## Reglas que se saltan solas

- **Un fichero de voz por línea.** Nunca una toma larga.
- **Subtitula solo lo que no está escrito en pantalla.** Si la frase ya aparece
  en un rótulo, subtitularla duplica el texto en el mismo sitio.
- **`dur` de un subtítulo es tiempo de lectura**, no la duración de la voz.
  Recorta los rangos a mano para que ninguno pise al siguiente ni al rótulo que
  venga detrás.
- **`DUCK.base` no pasa de ~0.85.** Los tracks de librería vienen a 0 dB y
  cualquier efecto encima clipea.
- **Cámara: quieta, con viajes cortos.** Ni deriva continua (distrae) ni cortes
  secos (saltan). Y cada escena empieza en el encuadre donde acabó la anterior.
- **Misma interfaz a los dos lados de una costura, mismo componente.** Si una
  escena la pinta a mano, va a diferir en un detalle y ese detalle aparece de
  golpe al cambiar de bloque.
- **Itera sobre los tiempos, no sobre el contenido.** Un bucle sobre el array de
  contenido que indexe un array de tiempos más corto tumba el render en cuanto
  quitas un beat.

## Verificar en vez de opinar

Un agente no ve el vídeo ni lo oye. Todo lo que parece subjetivo tiene un número:

```bash
# la mezcla, por tramos: la voz sobre música debe medir como la voz sola
ffmpeg -hide_banner -ss 27 -t 4 -i out.mp4 -af volumedetect -f null /dev/null

# el pico global tiene que quedar por debajo de -1 dB
ffmpeg -hide_banner -i out.mp4 -af volumedetect -f null /dev/null

# contact sheet en vez de revisar fotogramas de uno en uno
ffmpeg -v error -i f_%d.png -vf "scale=560:-1,tile=5x4" -frames:v 1 sheet.png
```

`loop-music.mjs` ya verifica sus propias costuras: si alguna no cae en silencio,
lo dice y hay que elegir otros dos huecos.

## Entorno

- Hacen falta `ffmpeg` y `ffprobe` en el PATH, y Node 20 o superior.
- En Git Bash sobre Windows: `ffmpeg` no soporta patrones `glob` y `drawtext` se
  cae por falta de fontconfig. Usa secuencias numeradas. Tampoco hay `bc`.
- `staticFile()` de Remotion no lleva bien espacios ni acentos: renombra los
  assets a ASCII.
- `useVideoConfig().durationInFrames` dentro de un `<Sequence>` es la duración de
  la SECUENCIA, no del vídeo. No lo mezcles con frames absolutos.

## Lo que no puede hacer

Un TTS es habla, no respiración. Suspiros, risas y efectos hay que grabarlos.
Los blips sintéticos sí salen de ffmpeg, hay un ejemplo en el README.
