# Ejemplo de brief: "You Don't Need 56 GPUs"

El segundo vídeo hecho con este kit. Es un explainer de 1:47 sobre la charla de
Revolut en AI Engineer NYC 2026 (bajaron un 90% la factura de IA para
programar pasándose a modelos abiertos) que acaba en Helmcode como forma de
usar esos modelos sin montar el clúster.

Abajo está el prompt entero, **tal cual se le pasó al agente**. Va en inglés
porque el vídeo va en inglés. Es mucho más largo que el de Knowledge porque
aquí hay cifras de un tercero, y la mitad del brief son reglas sobre qué no se
puede afirmar con ellas.

## Qué cambió por el camino

- **Duración**: 107,6 segundos, dentro del rango que pedía.
- **Escenas 08 a 11** acabaron siendo un solo componente. La compresión del
  clúster en un endpoint funciona porque es la misma geometría (56 losas que se
  convierten en 56 franjas), y partirla en cuatro escenas la rompía.
- **El 60/70**: la diapositiva de Revolut dice "60% lead time", pero el
  ponente dice 60% en coding time y 70% en lead time. Se usaron las cifras
  habladas, con la etiqueta "as stated in the talk".
- **El gráfico de productividad** se redibujó en código con los puntos trazados
  de la diapositiva publicada, en vez de animar la captura como permitía el
  brief. La imagen se veía pixelada. En pantalla dice que está redibujado.
- **Música y efectos** sintetizados por código: no había música con licencia
  clara a mano.
- **La frase final hablada** quedó en "Open models, without the infrastructure
  headache."

## El prompt

---

# HELMCODE — REVOLUT: YOU DON'T NEED 56 GPUs

## MASTER VIDEO PRODUCTION BRIEF

**Project:** Revolut Open Models — Animated Explainer  
**Working title:** You Don't Need 56 GPUs  
**Brand:** Helmcode  
**Language:** English  
**Target duration:** 100–110 seconds  
**Primary format:** 1920 × 1080, 16:9  
**Social format:** 1080 × 1920, 9:16  
**Frame rate:** 30 fps  
**Production stack:** Remotion, React, TypeScript, SVG, CSS  
**Deliverable:** Finished animated video, editable source project, narration, subtitles and poster.

---

# 1. Your mission

Create a professionally art-directed animated explainer based on Revolut's presentation at AI Engineer NYC 2026.

Revolut reduced its reported AI coding costs by approximately 90% after adopting self-hosted open-weight models, primarily GLM.

The company also reported significant improvements in engineering productivity.

But Revolut operates a substantial GPU infrastructure to achieve this.

Most companies cannot or do not want to build, operate, optimize and secure their own inference clusters.

That's where Helmcode comes in.

We provide managed access to open models through an OpenAI-compatible API, including flat-rate pricing options that make AI spending more predictable.

**The central thesis:**

Revolut shows what companies can achieve with open models at scale.

Other businesses can adopt a similar model strategy without building their own inference infrastructure.

The video should make the viewer understand why open models are becoming an attractive option for production workloads and why managed inference makes their adoption more accessible.

This is a technology story first and a Helmcode video second.

The opening should be interesting even to viewers who have never heard of Helmcode.

Do not reveal Helmcode too early.

---

# 2. Creative concept

## YOU DON'T NEED 56 GPUs

The entire video should revolve around one visual metaphor:

**Complexity being compressed into simplicity.**

At the beginning, everything multiplies:

- Engineers.
- Agent sessions.
- Token consumption.
- Invoices.
- GPU servers.
- Infrastructure layers.
- Operational responsibilities.

These elements accumulate until the screen becomes visually dense.

At the midpoint, the viewer discovers what Revolut needed to operate its models: 56 NVIDIA B200 GPUs and significant operational infrastructure.

Then everything freezes.

We ask:

**DO YOU REALLY NEED 56 GPUs?**

The entire cluster collapses into a single API endpoint.

From that point onwards, the visual language becomes cleaner, more spacious and easier to follow.

Helmcode appears as the layer that simplifies access to open-weight inference.

This transformation is the visual heart of the film.

Invest significant creative effort in it.

## Visual references

Use the visual language of premium editorial motion design, engineering documentaries, kinetic typography and high-end information graphics.

The result should feel closer to a carefully art-directed technology documentary than a conventional SaaS advertisement.

Characteristics:

- Strong compositions.
- Large, beautifully animated typography.
- Confident use of negative space.
- Precise geometric illustration.
- Technical but elegant diagrams.
- Data visualizations.
- Clean 2.5D server representations.
- Purposeful camera movements.
- Carefully timed match cuts.
- Meaningful transitions.
- Restrained but impactful sound design.

Avoid:

- Generic AI robots.
- Glowing digital brains.
- Stock footage of people using laptops.
- Fake futuristic holographic interfaces.
- Unnecessary particles.
- Random floating 3D elements.
- Excessive gradients.
- Generic corporate illustration.
- Animated PowerPoint aesthetics.
- Overly complex charts.
- Large paragraphs of text on screen.

The video needs to work visually even with the sound muted.

---

# 3. Research and factual accuracy

## Primary sources

Revolut presentation:

https://www.youtube.com/watch?v=Ok6QdZHCcI8

Official AI Engineer talk:

https://ai.engineer/nyc/2026/talks/revolut

Helmcode:

https://helmcode.com/

Documentation:

https://helmcode.com/docs

Pricing:

https://helmcode.com/pricing

Model catalog:

https://helmcode.com/docs/models

Rate limits:

https://helmcode.com/docs/rate-limits

## Original Revolut slides

Three screenshots have been provided with this project:

1. **AI adoption & impact**
2. **Metrics that matter for happy engineers**
3. **For the CIO in the room**

Find these assets in the project or request their exact location if unavailable.

Use them as factual references.

Do not simply paste full slide screenshots into the video.

Rebuild the information as original animated graphics while preserving the underlying meaning.

If precise numerical data are missing, use the original image with animated reveals rather than fabricating values.

## Revolut facts

The following figures come from Revolut's presentation:

**Scale**

- Approximately 2,000 engineers using the system.
- GLM 5.3 as the open-weight coding model referenced in the presentation.
- 56 NVIDIA B200 GPUs.
- Infrastructure operated with Together AI.

**Economics**

- Approximately 90% reduction in AI spending compared with the previous Anthropic/OpenAI setup.
- Reported blended inference cost of approximately $0.30 per million input/output tokens.
- The presentation describes prompt caching as free within the referenced deployment economics.

**Engineering**

- Revolut reports approximately 60% improvement in coding time.
- Approximately 70% improvement in engineering lead time over the observed period.
- The chart covers a sample of 2,031.
- The presentation tracks the introduction of Gemini, Claude/Codex and self-hosted GLM.

**Inference performance targets**

- Time to first token: below 3 seconds.
- Generation speed: above 200 tokens per second.
- The speaker explains that Slack messages begin increasing after approximately five seconds without a response.

**Strategy**

- Open-weight models became the default.
- Frontier models remain available for tasks where their additional capabilities are needed.
- Predictable inference spending is an important part of the decision.

## Critical accuracy rules

Do not suggest that Revolut's productivity improvements are exclusively caused by GLM.

The graph shows internal trends over time. It does not isolate causality.

Do not claim that Helmcode customers will automatically achieve Revolut's 90% reduction.

Do not apply Revolut's reported $0.30 per million tokens to Helmcode's pricing.

Do not imply that all models available through Helmcode have unlimited usage.

Verify current plan quotas and rate limits.

Do not conflate self-hosting with simply using a model developed by another company.

Do not imply that Helmcode provides exactly the same deployment, controls or guarantees as Revolut.

Do not claim that the security measures in Revolut's slide automatically guarantee regulatory compliance.

Always distinguish:

1. Revolut's reported results.
2. Revolut's infrastructure.
3. The broader architectural lesson.
4. Helmcode's actual product capabilities.

---

# 4. Brand and design system

Before implementing any animation:

1. Inspect the existing Helmcode website or repository.
2. Identify official logos.
3. Find actual brand colors.
4. Inspect typography.
5. Reuse existing fonts where legally and technically permitted.
6. Review spacing, visual language and iconography.
7. Build a small video-specific design system from those findings.

Do not invent a separate brand identity.

The design should be recognizable as Helmcode without placing the logo everywhere.

## Typography

Use a strong typographic hierarchy.

Create three levels:

**Display**

Large numbers, important statements and questions.

**Editorial**

Scene titles and narrative phrases.

**Technical**

Charts, metrics, API details, annotations and source attribution.

Keep text minimal.

Use kinetic typography selectively.

## Color

Use official Helmcode colors.

Assign functional roles:

- Brand accent for important information.
- Neutral colors for context.
- Warning color for spending limits.
- Distinct colors for the two productivity metrics.
- Muted colors for background infrastructure.

Keep color meaning consistent between scenes.

## Motion

Animations should be purposeful.

Preferred techniques:

- Mask reveals.
- Shared-element transitions.
- Scale morphs.
- Staggered typography.
- Animated counters.
- Path drawing.
- Simple 2.5D perspective.
- Controlled camera movement.
- Motion matched to sound effects.

Avoid animating every element continuously.

Use stillness deliberately.

---

# 5. Complete storyboard and narration

Build the film as 14 connected scenes.

The durations below are editorial targets. Adjust them to natural narration timing while keeping the finished video between approximately 100 and 110 seconds.

Maintain a master timeline with frames, narration segments, scene transitions and subtitle cues.

## SCENE 01 — THE NUMBER

**Time:** 0–6 seconds  
**Purpose:** Hook the viewer immediately.

### Visual

Start on a close-up of an AI invoice.

Numbers increase rapidly.

A token counter accelerates.

The invoice becomes too long for the screen.

Suddenly, the motion stops.

Hard cut to:

**90%**

A giant number occupying most of the frame.

Below:

LOWER AI BILL

Small attribution:

REVOLUT · AI ENGINEER NYC 2026

### Narration

"Revolut cut its AI coding bill by ninety percent."

### Sound

Rapid digital counting.

One strong impact when 90% appears.

Brief silence after the impact.

### Direction

Do not show the Helmcode logo.

Do not start with an animated brand introduction.

The story starts with the claim.

---

## SCENE 02 — THE SCALE

**Time:** 6–13 seconds  
**Purpose:** Establish the magnitude of Revolut's operation.

### Visual

One developer workspace appears.

It multiplies into dozens of small workstations.

The camera pulls back.

The workstations form a large geometric matrix.

A label appears:

**2,000 ENGINEERS**

Token counters and bills appear across the matrix.

One counter becomes prominent:

**UP TO $10K / MONTH**

### Narration

"With around two thousand engineers, some were spending up to ten thousand dollars a month on AI coding tools."

### Direction

Use abstraction rather than drawing 2,000 individual people.

Represent scale through repetition.

Use a consistent visual unit for each developer.

---

## SCENE 03 — TOKEN RATIONING

**Time:** 13–20 seconds  
**Purpose:** Explain why high costs affected adoption.

### Visual

A developer submits a task.

An agent begins working.

A token budget meter starts draining.

A warning appears:

BUDGET LIMIT

Behind the active task, several smaller tasks accumulate.

Some remain unattended.

The visual becomes increasingly constrained.

### Narration

"Spending limits followed. And engineers started thinking twice before using AI."

### Sound

Restrained warning sound.

Reduce the musical energy.

### Direction

Make this feel like workflow friction.

Do not imply that every Revolut engineer experienced the same spending limit.

---

## SCENE 04 — THE SWITCH

**Time:** 20–27 seconds  
**Purpose:** Introduce open-weight models.

### Visual

A model selector appears.

Initially:

FRONTIER API — DEFAULT

The interface changes.

GLM 5.3 moves into the primary position.

The layout becomes:

OPEN-WEIGHT — DEFAULT

FRONTIER — WHEN NEEDED

The budget warning fades.

Tasks begin moving through the system.

### Narration

"Then Revolut made GLM, an open-weight model, its default for coding."

### Direction

Do not suggest that Revolut stopped using Claude or GPT entirely.

This is a change in the default strategy.

---

## SCENE 05 — THE RESULTS

**Time:** 27–35 seconds  
**Purpose:** Present Revolut's reported outcomes.

### Visual

Three figures appear one after another.

**90%**

LOWER AI BILL

**60%**

LOWER CODING TIME

**70%**

LOWER ENGINEERING LEAD TIME

Animate the numbers with different but related transitions.

Keep a persistent, small source attribution.

### Narration

"Revolut reports a bill about ninety percent lower, alongside major improvements in coding time and engineering lead time."

### Accuracy

Use:

"Revolut-reported outcomes"

Do not use:

"GLM caused a 70% productivity improvement."

---

## SCENE 06 — THE PRODUCTIVITY TIMELINE

**Time:** 35–45 seconds  
**Purpose:** Give context to the productivity numbers.

### Visual

Transition from the numerical cards into Revolut's original engineering productivity chart.

The chart has two lines:

- Engineering lead time, measured in days.
- Coding time, measured in hours.

Preserve the source chart's actual axes.

Animate the timeline from January 2025 through the final reported observation.

Introduce the three milestones:

1. Gemini chatbot.
2. Claude/Codex with spending limits.
3. Self-hosted GLM.

Use subtle background highlights around milestone dates.

### Narration

"Their productivity data tracks several AI rollouts over time, with both coding time and engineering lead time trending down."

### Technical requirement

Do not invent intermediate numerical observations.

If raw data are unavailable, use the original chart screenshot and animate its reveal.

Do not manually approximate each data point.

### Annotation

Source: Revolut, AI Engineer NYC 2026.

Sample: 2,031.

Observational data; not an isolated causal experiment.

---

## SCENE 07 — THE ENGINEERING EXPERIENCE

**Time:** 45–53 seconds  
**Purpose:** Explain why inference performance matters.

### Visual

Show an abstract code editor.

An engineer submits a request.

The interface displays a response quickly.

Two large performance indicators appear:

**<3s**

TIME TO FIRST TOKEN TARGET

**>200**

TOKENS / SECOND TARGET

A token stream animates rapidly.

A stopwatch briefly appears and disappears.

### Narration

"For two thousand engineers, cheap inference also needs to feel fast: under three seconds to the first token, and a target above two hundred tokens per second."

### Accuracy

These are targets stated in Revolut's presentation.

Do not represent them as universal benchmarks or guarantees achieved under every workload.

### Direction

This scene should feel responsive and precise.

Avoid excessive terminal text.

---

## SCENE 08 — THE INFRASTRUCTURE REVEAL

**Time:** 53–62 seconds  
**Purpose:** Show what sits behind Revolut's results.

### Visual

Start inside the code editor from Scene 07.

Pull the camera backwards.

Reveal the inference system behind it.

Layers appear progressively:

- GLM 5.3.
- Inference serving.
- GPU memory and caching.
- Model execution.
- 56 NVIDIA B200 GPUs.

The individual server units assemble into a large cluster.

Main text:

**56 × NVIDIA B200**

Smaller annotation:

WITH TOGETHER AI

### Narration

"Behind that experience are fifty-six NVIDIA B200 GPUs, running GLM with an inference stack tuned for performance."

### Direction

Use an elegant, geometric representation of compute infrastructure.

No photorealistic GPU renders are necessary.

Give the cluster physical weight through scale, depth and sound.

---

## SCENE 09 — THE OPERATIONAL STACK

**Time:** 62–70 seconds  
**Purpose:** Explain the enterprise responsibilities beyond GPUs.

### Visual

The cluster expands into a layered architectural diagram.

Reveal three areas:

**EXECUTION**

- Sandboxes.
- Human oversight.
- Guardrails against unauthorized use.

**DATA**

- Privacy.
- Retention policies.
- Processing location.

**OPERATIONS**

- Analytics.
- Logs.
- Auditing.

Animate each layer as a set of connected systems.

### Narration

"And the GPUs are only part of the job. There are sandboxes, privacy controls, logs, and operational safeguards to manage."

### Accuracy

This scene represents requirements discussed by Revolut.

Do not claim that its security mechanisms completely prevent prompt injection or guarantee compliance.

### Direction

Avoid a generic security checklist.

Make the infrastructure feel like a growing set of operational responsibilities.

---

## SCENE 10 — THE QUESTION

**Time:** 70–78 seconds  
**Purpose:** Create the film's strongest turning point.

### Visual

The entire architecture is now visible.

GPU clusters.

Serving infrastructure.

Security controls.

Logs.

Operational layers.

The camera slowly pulls back.

Everything freezes.

Music cuts.

A single question replaces the entire system:

**DO YOU REALLY NEED 56 GPUs?**

Hold the question long enough to read.

### Narration

"But does your company really need to operate all of that?"

### Sound

Brief silence.

One subtle low-frequency hit.

### Direction

This is the most important dramatic pause.

Don't rush it.

---

## SCENE 11 — THE COMPRESSION

**Time:** 78–88 seconds  
**Purpose:** Introduce managed inference.

### Visual

The question fades.

The entire infrastructure diagram begins compressing.

Server racks become geometric blocks.

Security and operations layers collapse into simple lines.

All the elements transform into one small API endpoint.

The screen becomes spacious and minimal.

Reveal:

**MANAGED OPEN-MODEL INFERENCE**

A subtle Helmcode identifier appears.

Several developer applications connect to the endpoint.

### Narration

"You can use open models through managed inference, without building and operating the GPU infrastructure yourself."

### Direction

This should be the most memorable animation in the video.

Use shared geometry between the complex infrastructure and the final API endpoint.

It should feel like one coherent transformation, not a cut between unrelated scenes.

The simplification is the product story.

---

## SCENE 12 — THE IMPLEMENTATION

**Time:** 88–96 seconds  
**Purpose:** Make Helmcode's offering concrete.

### Visual

Show a clean code example.

A model request travels from an application to Helmcode.

Display:

`https://api.helmcode.com/v1`

Then display model choices:

GLM

DEEPSEEK

QWEN

Additional families may appear only if supported by the current Helmcode model catalog.

Illustrate a successful response.

### Narration

"Helmcode provides an OpenAI-compatible API, so teams can start testing open models without managing the serving stack."

### Accuracy

Verify the API base URL and model availability in the current documentation.

Avoid implying that every application can migrate without code changes or evaluation.

### Direction

Keep the code correct but minimal.

The goal is to communicate a simple integration, not show a full tutorial.

---

## SCENE 13 — PREDICTABLE SPENDING

**Time:** 96–103 seconds  
**Purpose:** Connect the technical story to Helmcode's pricing.

### Visual

Show two simplified spending curves.

The first is variable:

USAGE-BASED SPENDING

The second is a horizontal, stable subscription band:

FLAT-RATE PLAN

The variable line moves unpredictably.

The subscription line remains stable within its defined usage conditions.

Then show:

**PREDICTABLE AI SPENDING**

### Narration

"With flat-rate plans and defined usage limits, AI spending becomes easier to predict."

### Accuracy

Do not claim unlimited usage of every model.

Do not fabricate specific prices.

Include a small label:

"Plan quotas and rate limits apply."

---

## SCENE 14 — FINAL THESIS AND BRAND

**Time:** 103–110 seconds  
**Purpose:** Close with a memorable idea.

### Visual

Show two simple model paths.

OPEN MODELS

For suitable everyday workloads.

FRONTIER MODELS

For tasks that need their additional capabilities.

The paths resolve into one statement:

**RIGHT MODEL. RIGHT WORKLOAD.**

Then the Helmcode logo appears.

Final screen:

**OPEN MODELS.  
WITHOUT THE INFRASTRUCTURE HEADACHE.**

helmcode.com

### Narration

"Start with open models. Use frontier models where they make sense. Without the infrastructure headache."

### Sound

A restrained musical resolution.

No exaggerated commercial ending.

---

# 6. Transitions and visual continuity

Avoid creating 14 isolated clips connected by generic fades.

The scenes should belong to one visual world.

Design transitions before polishing individual scenes.

Important transitions:

**Invoice → 90%**

The invoice's numbers merge into the giant numerical reveal.

**Engineer matrix → Budget meter**

The repeated workstations collapse into a single workflow interface.

**Model selector → Outcome metrics**

The open-weight model label transforms into the first results card.

**Outcome metrics → Productivity chart**

The percentage figures become chart labels, introducing the underlying trend.

**Code editor → GPU infrastructure**

The editor pulls backwards to reveal the infrastructure serving it.

**GPU cluster → Operational layers**

The cluster expands into infrastructure and compliance components.

**Operational complexity → API endpoint**

The entire system compresses into one simple interface.

**API endpoint → Predictable spending**

Requests become usage measurements, then a predictable billing representation.

Use match cuts and shared visual elements whenever possible.

---

# 7. Sound and narration direction

## Voiceover

Natural English narration.

Technically confident.

Calm and clear.

Avoid:

- Excessive excitement.
- Commercial announcer delivery.
- Dramatic pauses after every sentence.
- Synthetic-sounding enthusiasm.
- Overly fast narration.

The speaker should sound like an engineer explaining an interesting case study.

## Recording and synthesis

If a professional TTS provider is available and configured, use it.

Otherwise, implement the production with:

- A narration script.
- Timestamped audio placeholders.
- Subtitle cues.
- An easily replaceable narration track.

Never claim synthetic or placeholder narration is a final professional recording if quality has not been validated.

## Music

Use a restrained electronic soundtrack.

Opening:

Tension, movement and rhythm.

Infrastructure:

Mechanical weight and a deeper sound palette.

The question:

Brief silence.

Managed inference:

Simpler, lighter and more spacious.

Ending:

Confident but understated resolution.

Use only licensed or original audio assets.

## Sound effects

Suggested:

- Digital counting.
- UI clicks.
- Short error tones.
- Model-switch sound.
- Typographic impacts.
- GPU cluster assembly.
- Mechanical compression.
- API request pulse.
- Soft ending.

Do not overwhelm the narration.

---

# 8. Technical production

Use Remotion unless the existing project has a suitable equivalent video rendering system.

Technology:

- React.
- TypeScript.
- Remotion.
- SVG.
- CSS.
- Existing brand tokens.

Avoid unnecessary third-party dependencies.

## Component architecture

Build reusable primitives such as:

- `AnimatedNumber`
- `KineticText`
- `InvoiceCounter`
- `DeveloperGrid`
- `BudgetMeter`
- `ModelSelector`
- `MetricCard`
- `ProductivityChart`
- `LatencyIndicator`
- `GPUCluster`
- `InfrastructureLayer`
- `APIEndpoint`
- `ModelRoutingDiagram`
- `SpendingComparison`
- `BrandEndCard`

Use deterministic frame-based animation.

Do not rely on random runtime values that change between renders.

Centralize:

- Scene timing.
- Color tokens.
- Typography.
- Motion presets.
- Research data.
- Subtitle segments.

## Video formats

Produce:

**Landscape**

1920 × 1080, 30 fps.

**Vertical**

1080 × 1920, 30 fps.

Do not simply crop the landscape composition.

Recompose scenes where necessary.

For example:

- Developer matrices can become tall grids.
- Diagrams can become vertical flows.
- Metrics can stack.
- The GPU cluster can build vertically.
- The API endpoint can occupy the central safe area.

Preserve the visual narrative in both formats.

---

# 9. Subtitles

Create an English subtitle track.

Export SRT.

For social versions, also create burnt-in captions.

Requirements:

- Short readable phrases.
- Strong contrast.
- Mobile-safe positioning.
- Consistent font and size.
- No excessive words per frame.
- No overlap with important visuals.
- Synchronization with narration.

Highlight important terms selectively.

Examples:

OPEN MODELS

56 GPUs

90%

PREDICTABLE SPENDING

Do not use karaoke-style highlighting on every word unless it genuinely improves the composition.

---

# 10. Source attribution

The film includes third-party research and Revolut's reported results.

Create small, legible attribution where necessary.

For numerical claims:

"Source: Revolut, AI Engineer NYC 2026."

For productivity charts:

"Sample n = 2,031. Observational results."

For inference targets:

"Revolut operational targets."

Do not overwhelm the screen with citations, but ensure the source can be identified.

In the project documentation, record the source for each numerical claim.

---

# 11. Production workflow

Complete the work in stages.

## Phase A — Discovery

Inspect:

- Repository structure.
- Existing brand assets.
- Video tooling.
- Fonts.
- Color system.
- Source slides.
- Audio capabilities.

Record findings.

## Phase B — Design system

Create:

- Typography scale.
- Color mapping.
- Layout grid.
- Motion presets.
- Transitions.
- Caption style.
- Chart style.

## Phase C — Animatic

Implement all 14 scenes with:

- Final narration script.
- Approximate timing.
- Basic geometry.
- Transitions.
- Placeholder audio where needed.

Check the complete story before polishing.

## Phase D — Visual production

Replace animatic placeholders with finished graphics.

Prioritize:

1. The 90% opening.
2. The productivity chart.
3. The GPU cluster.
4. The operational architecture.
5. The infrastructure-to-API transformation.
6. The ending.

## Phase E — Sound and subtitles

Add narration when available.

Synchronize all scene transitions.

Produce subtitle files.

Add licensed or original sound effects.

Mix music beneath narration.

## Phase F — Render and review

Render representative frames from every scene.

Inspect desktop and vertical compositions.

Review:

- Visual hierarchy.
- Transition continuity.
- Typography.
- Chart accuracy.
- Technical labels.
- Caption legibility.
- Pacing.
- Audio synchronization.
- Brand consistency.

Fix problems before exporting final versions.

---

# 12. Quality assurance

Before considering the project complete:

- Run TypeScript checks.
- Run the relevant build.
- Verify every scene can render.
- Verify both aspect ratios.
- Verify every figure against source material.
- Check scene boundaries and transitions.
- Check all labels and captions.
- Check the productivity chart axes.
- Check that no invented data points appear.
- Verify the GPU model is B200, not H200.
- Verify the Helmcode API endpoint.
- Verify current pricing claims.
- Verify subtitles.
- Verify audio licensing.
- Inspect representative frames.
- Check for clipping and overflow.
- Check that no background elements obscure captions.

The video must be understandable with muted audio.

The narration must also make sense independently of the visuals.

---

# 13. Deliverables

Deliver the following files:

`revolut-open-models-landscape.mp4`

1920 × 1080 finished video.

`revolut-open-models-vertical.mp4`

1080 × 1920 finished video.

`revolut-open-models-poster.png`

Social thumbnail or cover.

`narration.md`

Final spoken script with timestamps.

`subtitles.srt`

English subtitles.

`creative-decisions.md`

Document:

- Major creative choices.
- Visual references.
- Design system.
- Research sources.
- Numerical claims.
- Implementation compromises.
- Audio licensing.
- Any unresolved limitations.

Retain the complete editable Remotion project.

Do not deliver only source code or a storyboard.

Render the video whenever the environment supports it.

If an external service or asset is unavailable, complete everything else and state exactly what remains blocked.

---

# 14. Final creative quality bar

We are not producing a conventional corporate product explainer.

We are producing a short visual story about an important shift in AI infrastructure.

The viewer should remember:

**1. Revolut achieved substantial AI cost savings with open-weight models.**

**2. Operating those models at scale required serious infrastructure, performance engineering and operational controls.**

**3. Companies can begin adopting open models through managed inference instead of building the infrastructure themselves.**

The first half should feel like a compelling engineering case study.

The second half should explain the opportunity for other companies.

The Helmcode reveal should feel like the natural conclusion of the story.

No forced sales language.

No artificial drama.

No unnecessary technical complexity.

Build something that engineers will find interesting and that a CTO can understand without a detailed explanation.

The strongest visual moment should be the transition from Revolut's GPU cluster and operational stack into a simple API endpoint.

**Revolut showed what's possible. Helmcode makes it easier to get started.**

Implement, render, inspect and refine the complete film.
