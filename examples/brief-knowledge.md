# Ejemplo de brief: "Chat with your knowledge"

Este es el brief real con el que arrancó el vídeo del que salen las piezas de
este repo. Se publica **tal cual se escribió**, antes de tocar código, porque la
mitad del valor de un brief así está en lo que fija: el tono, lo que no se
explica, y la frase que el espectador tiene que pensar al acabar.

Va en inglés porque el vídeo va en inglés. El texto de abajo no está retocado.

## Qué sobrevivió y qué no

Conviene leerlo sabiendo en qué acabó, porque un brief no es un guion técnico y
la distancia entre los dos es información útil:

**Se cumplió**

- **No explicar RAG.** Ni una vez se nombra en pantalla. Es la restricción más
  valiosa del brief.
- Tipografía a pantalla completa en vez de rótulos sobre la interfaz.
- El cierre, casi literal: *Your AI now knows your company* / *Your knowledge is
  now chat*.
- Interfaz oscura, cursor con intención, música que construye.

**Cambió al montarlo**

- **Duración: 45-60 s en el brief, 88 s en el render final.** Las escenas de
  producto necesitaban aire. Un upload de 3 segundos no se lee como un upload,
  se lee como un corte; el final duró 11,5 s.
- **Casi sin narración → con locución.** El brief pedía que el producto se
  explicase solo. En pantalla, la interfaz sin voz obligaba a leer y a mirar a la
  vez. Once líneas de voz generadas con Kokoro, más subtítulos.
- **Apertura distinta.** El brief abría en negro con una frase. El montaje abre
  con un cold open en Slack, en claro, con la misma pregunta repetida seis veces
  sobre el mismo PDF y sin música. El corte a negro pega más fuerte, y esa
  pregunta se responde luego dentro del producto: el cold open se cobra.
- **La escena de cambiar de knowledge se recortó.** Cuatro cambios seguidos
  (Handbook, Marketing, Frontend, Legal) leían como una lista de features, que es
  justo lo que el brief prohibía. Quedaron menos, y una escena de Integrations
  que el brief no contemplaba.
- El brief pedía respuestas *citando ficheros*. El producto cita el fichero, no
  la línea; las citas con número de línea se habían inventado y hubo que
  quitarlas.

La lección para el siguiente: el brief debe pelear por el tono y por lo que está
prohibido decir. Los segundos por escena se deciden con el render delante.

---

# Product Launch — "Chat with your knowledge"

> **Objective**
>
> Create a premium 45–60 second product launch video introducing Helmcode's new **Knowledge** feature.
>
> The video should feel like an Apple/OpenAI/Linear launch: minimal, elegant, product-first and fast-paced.
>
> **Do not explain RAG.**
>
> The audience should never think "they built a RAG".
>
> They should finish the video thinking:
>
> > **"I want to talk to my documentation and repositories like that."**

---

# Creative Direction

The entire video is a continuous product demo.

There is almost no narration.

The product explains itself.

Every scene should feel effortless.

Transitions should be smooth, premium and quick.

No feature lists.

No technical explanations.

No talking-head.

Just the product.

---

# Visual Style

- Dark interface
- Minimal UI
- Elegant animations
- Cursor movements feel intentional
- Fast but readable
- Premium typography
- Subtle motion
- Clean transitions
- Calm electronic music that gradually builds

---

# Opening (0–4s)

Black screen.

A single sentence fades in.

> **Stop copying documentation into prompts.**

Pause.

It changes to:

> **Upload it once.**
>
> **Chat with it forever.**

Music begins.

Cut immediately into the product.

---

# Scene 1 — Upload Documents (4–10s)

Open Helmcode.

User drags multiple files into the interface.

```
employee-handbook.pdf
architecture.md
onboarding.docx
pricing.pdf
roadmap.md
```

A clean upload animation begins.

Files are indexed.

A new Knowledge appears automatically.

```
Knowledge

✓ Company Docs
```

### Voice over

> Every company already has knowledge.
>
> It's just trapped inside documents.

---

# Scene 2 — First Conversation (10–17s)

The Chat interface opens.

Model selector.

```
Model

GPT-5
```

Knowledge selector.

```
Knowledge

None

✓ Company Docs
```

The cursor clicks inside the chat.

Question:

> What's our remote work policy?

The answer appears almost instantly.

No need to read the whole answer.

The audience only needs to understand:

**The AI knows the documentation.**

---

# Scene 3 — Upload Repository (17–26s)

Transition.

User drags a GitHub repository.

```
github.com/acme/payment-service
```

Repository imports.

Processing animation.

New Knowledge appears.

```
Knowledge

✓ payment-service
```

### Voice over

> Documentation.
>
> Repositories.
>
> Wikis.
>
> Bring your knowledge.

---

# Scene 4 — Chat with Code (26–36s)

Same chat.

Knowledge selector.

```
Knowledge

Company Docs

Marketing

Payment Service

Frontend

None
```

User selects:

```
✓ Payment Service
```

Questions appear one after another.

Question:

> Explain the authentication flow.

Answer.

Question:

> Where is rate limiting implemented?

Answer citing source files.

Question:

> Why is this endpoint failing?

Answer begins explaining the issue.

No pauses.

Everything feels instant.

---

# Scene 5 — Switch Knowledge (36–45s)

Without leaving the chat, the user changes the selected Knowledge several times.

```
Knowledge

Employee Handbook
```

Question:

> How many vacation days do new employees have?

Instant answer.

Transition.

```
Knowledge

Marketing
```

Question:

> Summarize our positioning.

Instant answer.

Transition.

```
Knowledge

Frontend
```

Question:

> Where is dashboard state managed?

Instant answer.

Transition.

```
Knowledge

Legal
```

Question:

> Which clause covers contract renewals?

Instant answer.

The viewer immediately understands:

The model is always the same.

Only the knowledge changes.

---

# Scene 6 — Final Product Shot (45–58s)

Close-up of the chat.

Minimal UI.

```
Model

GPT-5

Knowledge

✓ Payment Service
```

Cursor asks:

> Why is this endpoint failing?

The AI immediately starts answering.

No need to show the full response.

Cut before it finishes.

---

# Ending (58–60s)

Fade to black.

Helmcode logo appears.

Large text.

> **Your AI knows your company.**

Pause.

Then:

> **Upload once.**
>
> **Chat forever.**

Final line.

> **Your knowledge is now chat.**

Music fades.

End.

---

# Key Messages

The video should communicate these ideas without ever explaining them explicitly:

- You no longer need to copy documentation into prompts.
- The same AI can become an expert simply by changing its Knowledge.
- Documentation becomes conversational.
- Repositories become conversational.
- Company knowledge becomes conversational.
- Context is persistent.
- Upload once.
- Chat forever.

---

# What the viewer should think

Not:

> "Interesting RAG implementation."

Instead:

> "I need this."

And more specifically:

> **"I want to talk to every repository and every document in my company exactly like this."**
