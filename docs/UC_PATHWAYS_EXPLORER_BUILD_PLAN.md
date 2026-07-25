# UC Pathways Explorer

## Product Requirements and Engineering Handoff

**Document version:** 2.2  
**Prepared:** July 23, 2026  
**Working product name:** UC Pathways Explorer  
**Primary user:** A student entering 11th grade in fall 2026  
**Expected UC application cycle:** Fall 2027 for fall 2028 enrollment  
**Initial runtime:** Local computer only; no hosting, accounts, or cloud database  
**Expansion model:** UC-first content on a nationwide, institution-neutral architecture  
**Current content status:** Version 1.1.0 JSON package integrated, including a complete Fall 2026 official UC major-finder directory snapshot and nine detailed program guides

---

## 1. Purpose of this document

This document is the authoritative product and engineering plan for a coding agent building a local-first undergraduate program and career exploration website.

The coding agent must use the pre-generated, locally available `content/**/*.json` package as the authoritative version 1 editorial content. It must not recreate program, career, UC, medical, preparation, or journey content from this plan, hard-code those records in components, or replace researched records with sample copy. The plan governs product behavior and architecture; the JSON package governs version 1 factual and editorial content.

The coding agent should be able to use this document without needing the original conversation. When a product decision is not explicitly covered, prefer the following principles, in order:

1. Keep the experience inviting and low-pressure for the student.
2. Explain rather than pronounce: never tell the student that she is or is not suited to a career.
3. Use official, current sources for admissions, curricula, medical training, and labor data.
4. Separate facts, projections, and interpretations.
5. Preserve student privacy and store progress locally.
6. Build one complete, polished vertical slice before expanding the content library.

This is not an admissions predictor, medical aptitude test, or substitute for a school counselor, pre-health advisor, physician, or admissions office.

---

## 2. Product vision

Build a calm, intelligent companion organized around two equal product pillars:

1. **Discover:** Help the student understand programs, careers, and the work behind them.
2. **Prepare:** Turn her academic record, school opportunities, interests, and responsibilities into a concrete 11th–12th grade UC preparation plan.

Together, the two pillars help a high-school student answer four questions over time:

1. What kinds of problems and activities genuinely hold my attention?
2. Which undergraduate programs would let me study those things?
3. What careers could those programs open, and how may those careers change?
4. What should I do during 11th and 12th grade to explore further and prepare for UC admission?

The student is analytical, enjoys mathematics and biology, has completed high-school biology and chemistry, did not find programming particularly interesting, does not want to be a full-time programmer, and is seriously considering medicine.

The site must therefore give unusually strong coverage to:

- Medicine and the complete physician-training path
- Biology, chemistry, biochemistry, physiology, and neuroscience
- Premed-compatible undergraduate majors
- Data science and statistics, with an honest portrayal of coding requirements
- Biostatistics, bioinformatics, epidemiology, and health data
- Operations research, analytics, quantitative economics, and applied mathematics
- Bioengineering and medical technology
- Cognitive science, psychology, and human-computer interaction
- Public health, healthcare operations, and technology policy
- Alternative health professions

The content database may be comprehensive, but the student-facing experience must never feel comprehensive all at once.

UC is the initial editorial scope, not the permanent technical boundary. The architecture must support adding other California institutions, out-of-state public university systems, and private universities without changing the core program, career, journey, recommendation, comparison, or roadmap models.

---

## 3. Product goals

### 3.1 Primary goals

- Let the student begin exploring in under five minutes.
- Learn gradually from her choices, reactions, and completed activities.
- Help her distinguish an appealing career image from enjoyment of the underlying work.
- Let her experience small samples of biological, chemical, quantitative, and clinical reasoning.
- Explain that “premed” is usually a preparation pathway, not an undergraduate major.
- Show the full physician timeline, including college, medical school, residency, and optional fellowship.
- Compare UC campuses and programs using fit and opportunity factors rather than a simplistic ranking.
- Create a personalized UC Readiness Snapshot from the student’s courses, grades, school opportunities, and constraints.
- Audit A–G progress and explain the UC GPA calculation without predicting admission.
- Generate an age-appropriate junior- and senior-year course, exploration, activity, and application roadmap.
- Produce concrete counselor questions, a PIQ story bank, and a campus-major application portfolio.
- Provide transparent sources and “last verified” dates.
- Preserve all personal progress on the local device.

### 3.2 Success signals

The first usable release succeeds if the student can:

- Complete onboarding and one sampler in no more than 8 minutes.
- Stop at any time and resume after closing the browser.
- Mark an activity as interesting, neutral, or draining.
- Discover at least three plausible paths she had not understood before.
- Compare three programs side by side.
- Explain the difference between undergraduate admission, premed preparation, medical-school admission, medical school, and residency.
- See why a recommendation appeared.
- Leave with one or two reasonable next exploration actions rather than a final career verdict.
- Complete a UC Readiness Snapshot that clearly separates verified facts, student-entered information, and items needing counselor confirmation.
- Identify three to five program families, test at least two through an activity or experience, and save approximately six UC campus-major combinations for later review.
- Produce a preliminary senior-year course plan and counselor discussion sheet by spring of 11th grade.
- Produce a campus-major application portfolio, activity inventory, and PIQ story bank before the fall 2027 application period.

### 3.2.1 Concrete milestone artifacts

By spring of 11th grade, the site should help the student create:

- Three to five program families worth deeper exploration
- Two or three paths tested through a sampler, project, conversation, course, or supervised experience
- Approximately six UC campus-major combinations
- A preliminary senior-year course plan
- One meaningful summer exploration plan
- A record of sustained activities, contributions, responsibilities, and projects
- A counselor discussion sheet
- An initial medicine-versus-adjacent-health-path reflection

By fall of 12th grade, the site should help the student create:

- A final campus-major application portfolio
- Primary and alternate-major choices where relevant
- A date-aware application calendar
- An activity and award inventory
- A PIQ story bank, while preserving the student’s own authorship
- A financial-aid and cost checklist
- A final course-reporting verification checklist

### 3.3 Non-goals

Do not:

- Predict a UC admission decision.
- Estimate a percentage chance of admission.
- Rank students against one another.
- Produce a single “career fit score.”
- Diagnose learning ability, personality, or medical suitability.
- Give clinical or personal medical advice.
- Claim that one undergraduate major is required for medical school.
- Claim that a career is “AI-proof.”
- Rank UCs using unverifiable premed acceptance-rate claims.
- Require account creation, email, or personally identifying information.
- Add social features, leaderboards, streaks, or guilt-inducing reminders.
- Host the initial version.
- Replace counselor verification of the student’s school-specific course plan.
- Recommend an unsustainable course load solely to appear more competitive.
- Infer or manufacture a major-level admission rate when UC does not publish comparable data.

---

## 4. Core experience principles

### 4.1 Five minutes to something interesting

The default session should take 3–10 minutes. Deeper 15–20 minute activities are optional invitations.

### 4.2 One decision at a time

Use progressive disclosure. Avoid long forms and large walls of cards. Present one question, scenario, or decision per screen whenever practical.

### 4.3 Exploration, not examination

Science activities may track understanding for difficulty adaptation, but the interface must emphasize curiosity, persistence, and enjoyment. Never show grades or red failure states.

### 4.4 Evidence, not identity labels

Use language such as:

- “You seemed energized by…”
- “You have explored this only once.”
- “This may be worth another experiment.”
- “You enjoyed interpreting evidence more than memorizing terminology.”

Do not use:

- “You are a data scientist.”
- “You are not suited to medicine.”
- “Your ideal career is…”
- “You scored 82% premed fit.”

### 4.5 Explain recommendations

Every recommendation must include two to four human-readable reasons and at least one uncertainty or unexplored factor.

### 4.6 Comprehensive underneath, curated on top

The libraries may contain many programs, careers, and UC offerings. The home and journey pages should expose only the next three useful choices.

### 4.7 Student autonomy

Include “I’m not sure,” “Skip,” “Not for me,” “Save for later,” and “Surprise me.” Never require a written reflection.

### 4.8 Sustainable preparation

Academic rigor must always be presented alongside wellbeing, mastery, and the student’s actual school and life context. The product may surface questions and tradeoffs but must not prescribe the maximum possible AP, IB, honors, or dual-enrollment load.

### 4.9 Balanced discovery

Do not let the student’s first answers permanently narrow the experience. Every recommendation set must contain:

- One evidence-supported match
- One adjacent path
- One contrasting or unfamiliar path

Always provide an unpersonalized browse mode.

---

## 5. Users and roles

### 5.1 Student

Primary user. Explores interests, completes samplers, saves favorites, compares paths, and builds a roadmap.

### 5.2 Parent

Secondary user. Reads the program, UC, admissions, cost, and training information. Parent-oriented information should not interrupt the student journey.

For the initial local release, do not build authentication or separate profiles. Instead, provide a “Family reference” area with factual resources and a “My journey” area for the student.

Parent-entered priorities must never silently alter the student’s evidence profile or recommendations. Shared planning items such as affordability, distance, and logistics should be visibly labeled as family considerations.

### 5.3 Content maintainer

Updates program facts, UC offerings, admissions policies, labor projections, and sources. Content should be editable without changing application logic.

---

## 6. Information architecture

Recommended routes:

| Route | Purpose |
|---|---|
| `/` | Student-first home: continue, explore something new, discoveries |
| `/discover` | Entry to program, career, and medical exploration |
| `/prepare` | UC Readiness Snapshot and next preparation actions |
| `/prepare/baseline` | Student academic and school-opportunity baseline |
| `/prepare/ag` | A–G course audit |
| `/prepare/gpa` | UC GPA explanation and estimate |
| `/prepare/courses` | Junior/senior course-plan builder |
| `/prepare/activities` | Activities, contributions, responsibilities, and project log |
| `/prepare/piq` | PIQ story bank and authorship guidance |
| `/prepare/counselor` | Counselor discussion sheet |
| `/prepare/application-portfolio` | Campus, primary major, and alternate-major planning |
| `/prepare/affordability` | Cost, financial-aid, housing, and commute considerations |
| `/journey` | Guided question and activity flow |
| `/discoveries` | Evidence summary, favorites, unexplored dimensions |
| `/explore` | Browse program families, programs, and careers |
| `/majors` | Search the complete official UC major-directory snapshot by interest gateway, campus, or name |
| `/programs/[slug]` | Undergraduate program detail |
| `/careers/[slug]` | Career detail and future outlook |
| `/medical` | Medical-track hub |
| `/medical/is-medicine-for-me` | Physician-work and training reality |
| `/medical/path` | Interactive physician-training timeline |
| `/medical/premed` | Premed preparation and major compatibility |
| `/medical/challenges/[slug]` | Biology, chemistry, and integrated cases |
| `/medical/alternatives` | Other health professions |
| `/colleges` | Institution explorer across enabled collections and regions |
| `/colleges/[institutionSlug]` | Institution-specific comparison page |
| `/collections/[collectionSlug]` | Curated collection such as the UC system or western public universities |
| `/uc` | Convenience entry that resolves to the UC collection, not a separate data model |
| `/compare` | Compare up to three programs, careers, or campuses |
| `/roadmap` | Personalized high-school action plan |
| `/journal` | Optional saved notes and reflections |
| `/sources` | Source index and freshness information |
| `/settings` | Export, import, reset, accessibility preferences |

Use route-level pages for durable destinations, but keep the guided journey as an immersive, minimal-chrome flow.

---

## 7. Home page requirements

The first viewport should not look like a generic administrative dashboard.

Show:

1. A warm, concise greeting.
2. One prominent “Continue” card if progress exists.
3. Two equal primary pillars:
   - **Discover my options**
   - **Prepare for UC**
4. One secondary action:
   - See what I’ve discovered and planned
5. A small “Family reference” link for UC, affordability, and premed facts.

For a new user, offer either “Start with a 4-minute exploration” or “Create my UC Readiness Snapshot.” Neither pillar should appear more important.

Do not show:

- A huge program directory
- Percent complete
- Deadlines before the student has expressed interest
- Admissions statistics in the first viewport
- A long onboarding form
- Medicine as the default path before the student selects it

---

## 8. Onboarding and guided journey

### 8.1 Onboarding budget

Maximum of four required questions before the first interactive sampler. All answers must be editable later.

Suggested opening questions:

1. “Which kinds of questions sound most interesting today?”
   - How the body works
   - Why people behave as they do
   - What patterns data can reveal
   - How to improve a system
   - How to design or build something
   - Surprise me

2. “Which school subjects do you currently enjoy?”
   - Mathematics
   - Biology
   - Chemistry
   - Psychology/social science
   - Writing/humanities
   - Physics/engineering

3. “How do you feel about using code as a tool?”
   - I would rather avoid it
   - I can use some if the problem is interesting
   - I might enjoy data-oriented coding
   - I want to explore before deciding

4. “Where should we begin?”
   - Could medicine be right for me?
   - Math + biology careers
   - Technology without full-time programming
   - Surprise me

### 8.2 Journey node types

The journey engine must support:

- Single-choice question
- Multi-choice question
- Preference slider with explicit labels
- Scenario choice
- Short lesson
- Data or diagram interpretation
- Prediction followed by explanation
- Optional text note
- One-tap reflection
- Recommendation reveal
- Call to try another activity

### 8.3 Session shape

A normal session:

1. Re-entry message: 10–20 seconds
2. Scenario or short content: 1–2 minutes
3. Three to five interactions: 3–6 minutes
4. Explanation: 1 minute
5. Two-tap reflection: 20–40 seconds
6. One next-step invitation

### 8.4 Reflection questions

Required:

1. “How did this feel?”
   - Interesting
   - Okay
   - Draining

2. “What part did you like most?”
   - Understanding the science
   - Solving the problem
   - Interpreting evidence
   - Helping or understanding people
   - Designing a solution
   - None of these

Optional:

- “Anything you want to remember?”
- “Want a harder example?”

---

## 9. Exploration dimensions

Maintain a private, explainable evidence profile. Suggested dimensions:

| Dimension | Meaning |
|---|---|
| `bioMechanisms` | Interest in how living systems work |
| `chemMechanisms` | Interest in molecular and chemical explanations |
| `quantReasoning` | Enjoyment of mathematical reasoning |
| `dataInterpretation` | Enjoyment of patterns, evidence, and uncertainty |
| `systemsOptimization` | Interest in improving complex systems |
| `humanBehavior` | Interest in cognition, behavior, and social factors |
| `patientInteraction` | Interest in direct care and human contact |
| `serviceOrientation` | Motivation to help people and communities |
| `buildingDesigning` | Interest in creating physical or digital solutions |
| `codingTolerance` | Willingness to use programming as a tool |
| `abstractTheory` | Comfort with conceptual and theoretical work |
| `labWork` | Interest in experiments and laboratory processes |
| `memorizationTolerance` | Willingness to retain dense terminology and facts |
| `learningPersistence` | Willingness to revisit difficult material |
| `uncertaintyTolerance` | Comfort reasoning without a single certain answer |
| `communication` | Interest in explaining findings to others |
| `longTrainingTolerance` | Openness to extended education and supervised training |
| `emotionalLoadTolerance` | Openness to illness, distress, and responsibility |

Do not infer sensitive psychological traits. These dimensions represent observed exploration preferences, not stable personality.

---

## 10. Recommendation model

### 10.1 Evidence event

Every meaningful interaction may create an evidence event:

```ts
type EvidenceEvent = {
  id: string;
  createdAt: string;
  sourceType: "question" | "activity" | "reflection" | "favorite" | "comparison";
  sourceId: string;
  dimension: ExplorationDimension;
  direction: -2 | -1 | 0 | 1 | 2;
  confidence: 0.25 | 0.5 | 0.75 | 1;
  note?: string;
};
```

Examples:

- Selecting “I can use code if the problem is interesting” adds a small positive `codingTolerance` signal with low confidence.
- Completing two data activities and selecting “interesting” adds stronger `dataInterpretation` evidence.
- Marking one chemistry module “draining” adds only a medium negative signal; it must not eliminate chemistry-related paths.

### 10.2 Path profiles

Each program and career has a transparent dimension profile from 0–5. Recommendation strength is based on similarity between accumulated evidence and the profile, but the numeric result is never shown as an aptitude score.

### 10.3 Confidence rules

- One signal: “early clue”
- Two independent signals: “worth exploring”
- Three or more signals from at least two interaction types: “strong pattern”
- Contradictory signals: explicitly label as mixed
- Never hide a path solely because of negative evidence

### 10.4 Explanation generation

Generate explanations from deterministic templates, not an opaque model:

> “This may be worth exploring because you enjoyed biological mechanisms, quantitative reasoning, and interpreting evidence. We still do not know how you feel about laboratory work or the amount of programming this path can require.”

### 10.5 Correctness versus enjoyment

Science-question accuracy may adapt difficulty, but must not directly determine career recommendation strength.

Use:

- Accuracy and help use → future question difficulty
- Enjoyment and desire to continue → interest evidence
- Revising an answer after new evidence → learning persistence and scientific reasoning evidence

### 10.6 Recommendation diversity and anti-confirmation-loop rules

Every three-path recommendation set must include:

1. **Evidence-supported:** the strongest current match
2. **Adjacent:** a path sharing some interests but differing in work or training
3. **Discovery:** a credible unfamiliar or contrasting option

Additional rules:

- Do not recommend only health paths because the student selected medicine once.
- Do not recommend only quantitative paths because the student enjoys math.
- Do not suppress humanities, social sciences, design, policy, or service paths.
- Provide “Browse without using my answers.”
- Provide “Show me something different.”
- Let the student remove or revise earlier answers.
- Label recommendations based on fewer than three independent signals as early clues.
- Never use negative evidence from one sampler to eliminate a family.

---

## 11. Program-family taxonomy

Seed the system with these 12 families:

1. Computing, data, and AI
2. Engineering and physical systems
3. Biology and life sciences
4. Medicine, health, and public health
5. Psychology, neuroscience, and cognitive science
6. Mathematics, statistics, and physical sciences
7. Economics, business, and operations
8. Environment, climate, and agriculture
9. Social sciences, government, and public policy
10. Humanities, languages, and philosophy
11. Design, media, and the arts
12. Education and human development

The experience should initially foreground analytical and health-related families but permit exploration of all families.

---

## 12. Priority program list

### 12.1 First vertical-slice programs

Create complete content for these six before expanding:

1. Biology
2. Data Science
3. Statistics
4. Neuroscience/Cognitive Science
5. Public Health
6. Operations Research/Industrial Engineering

### 12.2 Version 1 program set

Expand to at least:

- Molecular and Cell Biology
- Biochemistry
- Human Biology/Physiology
- Microbiology
- Genetics/Genomics
- Neuroscience
- Cognitive Science
- Psychology
- Public Health
- Epidemiology
- Bioengineering/Biomedical Engineering
- Bioinformatics/Computational Biology
- Data Science
- Statistics
- Biostatistics
- Applied Mathematics
- Mathematics
- Actuarial Science
- Industrial Engineering and Operations Research
- Quantitative Economics/Econometrics
- Economics
- Informatics/Information Systems
- Environmental Science
- Chemistry
- Physics/Biophysics
- Health Policy/Health Services
- Science, Technology, and Society
- Philosophy/Bioethics
- Sociology
- Anthropology

### 12.3 Long-term completeness

First map every first-year undergraduate major offered by the nine undergraduate UC campuses into a canonical program or program-family record, preserving the institution’s exact official major name. Later providers must use the same canonical program model so equivalent or adjacent programs can be compared across institutions.

---

## 13. Program detail specification

Every program page must answer:

- What is this field trying to understand or improve?
- What do students actually do in introductory and advanced courses?
- What are representative required courses?
- What types of assignments are common?
- How much math, coding, lab work, writing, and teamwork are involved?
- What tends to be rewarding?
- What tends to be frustrating?
- Who may enjoy it?
- Which adjacent majors are commonly confused with it?
- Which careers does it directly and indirectly support?
- Which careers require graduate or professional school?
- How compatible is it with premed preparation?
- Which UCs offer it or closely related programs?
- Is direct admission or later switching constrained?
- Which high-school courses are UC requirements versus merely useful preparation for this field?
- What 11th- and 12th-grade course choices may strengthen readiness if offered and sustainable?
- What can a high-school student try now?

Every preparation statement must be labeled as one of:

- **UC eligibility requirement**
- **Published institution/program requirement**
- **Recommended academic preparation**
- **Optional exploration**
- **Verify with counselor or institution**

Never present useful preparation, such as calculus for a quantitative field, as a UC admission requirement unless an official institution source says so.

Required intensity fields, each 1–5:

- Mathematics
- Coding
- Laboratory work
- Writing
- Memorization
- Abstract theory
- Teamwork
- People interaction

Include a “coding reality” note. For example, Data Science must not be described as a no-code alternative to Computer Science.

---

## 14. Career detail specification

Every career page must include:

- Plain-language summary
- Representative day or week
- Common tasks
- Work environment
- People interaction
- Quantitative, coding, writing, and laboratory intensity
- Typical entry education
- Whether graduate or professional education is common
- Related undergraduate programs
- Adjacent careers
- Current national employment and earnings data
- California-specific data when reliable
- Projected growth and projection period
- AI and technology impact:
  - Routine tasks likely to be automated
  - Tasks likely to be augmented
  - Human judgment and accountability
  - Domain expertise
  - Transferable skills
- Confidence and limitations
- “Try it now” activity
- Sources and last-verified date

Do not reduce future outlook to “good” or “bad.” Use:

- Growing demand
- Stable/variable
- Transformation likely
- Advanced degree often important
- High uncertainty

---

## 15. Priority career pathways

Seed at least these pathways:

- Physician
- Physician-scientist
- Physician assistant
- Nurse practitioner
- Dentist
- Pharmacist
- Physical therapist
- Occupational therapist
- Genetic counselor
- Clinical psychologist
- Biomedical researcher
- Epidemiologist
- Biostatistician
- Bioinformatics analyst/scientist
- Clinical data scientist
- Data scientist
- Product/data analyst
- Operations research analyst
- Healthcare operations analyst
- Actuary
- Quantitative economic or policy analyst
- UX researcher/human-factors specialist
- Biomedical engineer
- Medical-device specialist
- Public-health professional
- Health-policy analyst
- Cybersecurity/privacy analyst in healthcare

---

## 16. Medical-track product requirements

The medical track is a first-class product area, not one program page.

### 16.1 Medical hub

Offer four starting choices:

1. Could medicine be right for me?
2. What does the full path require?
3. Which undergraduate majors work with premed?
4. Try a biology or chemistry medical challenge

Also link to alternative health professions.

### 16.2 Physician-training timeline

Build an interactive timeline covering:

1. High school exploration
2. Four-year undergraduate degree
3. Premed courses and experiences
4. MCAT and medical-school application
5. Four-year medical school
6. Three-to-eight-year residency, varying by specialty
7. Optional fellowship
8. Licensure and continuing education

Let the user toggle:

- No gap year / one gap year / two gap years
- Broad specialty category
- Optional fellowship

Show total training years, not a predicted age unless the student voluntarily enters an age. Do not store date of birth.

### 16.3 Premed explanation

Explicitly explain:

- Premed is generally a preparation pathway, not a major.
- Students may major in a science or non-science field.
- Medical-school prerequisites vary.
- Common preparation includes biology, chemistry through organic chemistry, physics, mathematics/statistics, writing, and often biochemistry, psychology, and sociology.
- Medical schools evaluate academics, MCAT, experiences, recommendations, communication, service, and competencies.
- Clinical exposure helps a student decide whether patient care is truly appealing.
- Medical-school admissions are separate from UC undergraduate admissions.

### 16.4 Premed-compatible major comparison

Compare at least:

- Biology
- Biochemistry
- Neuroscience
- Psychology/Cognitive Science
- Public Health
- Bioengineering
- Data Science/Statistics
- Mathematics
- Humanities or Social Science plus prerequisites

For each, show:

- Prerequisite overlap
- Additional scheduling burden
- Typical workload
- GPA/workload considerations without implying an “easy major” strategy
- Backup and adjacent careers
- Research and clinical relevance
- Coding and laboratory requirements

### 16.5 Medical-school admissions readiness

Present as a future roadmap, not a high-school checklist:

- Overall and science academic performance
- MCAT
- Clinical experience
- Service
- Shadowing
- Research where meaningful
- Leadership and teamwork
- Faculty relationships and recommendations
- Personal statement and interviews
- AAMC premed competencies

Do not encourage résumé padding or prescribe hour counts not supported by an official source.

### 16.6 Alternative healthcare explorer

Provide side-by-side comparisons of physicians and other health professions by:

- Scope of work
- Patient interaction
- Training length
- Autonomy
- Work setting
- Science intensity
- Typical education
- Lifestyle variability
- Career outlook

---

## 17. Medical science challenge system

### 17.1 Purpose

Let the student sample the cognitive and learning experience of premedical science without turning the site into schoolwork.

Each challenge must:

- Take 7–10 minutes by default
- Offer a 15–20 minute optional deep dive
- Begin from high-school biology or chemistry
- Teach at least one new concept
- Ask for a prediction
- Introduce evidence
- Allow answer revision
- Explain the reasoning
- End with two one-tap reflections
- Clearly state that it is exploratory, not diagnostic

### 17.2 Biology challenge set

1. **Cells and homeostasis**
   - Membranes, osmosis, ions, and stable internal conditions
2. **Genetics and proteins**
   - How a DNA change can alter a protein and produce disease
3. **Enzymes and metabolism**
   - Catalysis, saturation, regulation, and cellular energy
4. **Immunology**
   - Pathogen recognition, immune response, and memory
5. **Cardiovascular and respiratory physiology**
   - Oxygen delivery and interacting organ systems
6. **Neuroscience**
   - Neuronal signaling and chemical interference

Later additions:

- Microbiology and antibiotics
- Cancer and cell-cycle control
- Endocrine feedback
- Experimental design and causal claims

### 17.3 Chemistry and biochemistry challenge set

1. **Acids, bases, and buffers**
   - Blood pH and carbon dioxide
2. **Molecular structure and drug binding**
   - Shape, charge, and interaction
3. **Equilibrium in living systems**
   - Response to changed conditions
4. **Reaction rates and enzymes**
   - Temperature, concentration, and catalysts
5. **Energy and metabolism**
   - Energy storage and transfer

Later additions:

- Protein folding
- Solubility and membranes
- Concentration and dosage reasoning
- Laboratory measurement limitations

### 17.4 Integrated medical cases

Create three initial cases:

1. **Shortness of breath**
   - Integrates respiration, circulation, diffusion, and evidence selection
2. **Infection and immune response**
   - Integrates microbiology, immunology, treatment reasoning, and uncertainty
3. **Medication concentration**
   - Integrates chemistry, metabolism, quantitative reasoning, and risk

Do not ask the student to diagnose or treat a real person. Use fictional, age-appropriate scenarios and educational disclaimers.

### 17.5 Challenge data captured

```ts
type ChallengeResult = {
  challengeId: string;
  startedAt: string;
  completedAt?: string;
  attemptedQuestionIds: string[];
  correctCount?: number;
  revisedAnswerCount: number;
  hintsUsed: number;
  perceivedDifficulty?: "too_easy" | "about_right" | "too_hard";
  experience?: "interesting" | "okay" | "draining";
  favoriteAspect?: ExplorationDimension | "none";
  wantsMore?: boolean;
  optionalNote?: string;
};
```

Never display `correctCount` as a grade. Use it only for selecting future challenge difficulty.

---

## 18. Low-pressure interaction requirements

- Normal activity: 3–10 minutes
- Deep dive: optional, 15–20 minutes
- One interaction per screen when possible
- Autosave after every meaningful response
- Resume exactly where the user left off
- No timers
- No streaks
- No required text
- No “overdue”
- No red incorrect-state styling
- Explanations immediately after a response or short sequence
- Celebrate curiosity and completion, not correctness
- Show “Discovered” rather than “Completed”
- Never show a global percentage-complete indicator

---

## 19. UC explorer requirements

### 19.1 Campus coverage

Cover all nine undergraduate campuses:

- UC Berkeley
- UC Davis
- UC Irvine
- UCLA
- UC Merced
- UC Riverside
- UC San Diego
- UC Santa Barbara
- UC Santa Cruz

UCSF is not an undergraduate campus. It may appear only in medical/health-system context.

### 19.2 Campus comparison dimensions

- Relevant majors
- College/school structure
- Direct-to-major or broader admission context
- Selective or capacity-constrained majors
- Alternate-major policies where published
- Ease/restrictions of changing into relevant majors
- Pre-health advising model
- Undergraduate research access
- Nearby hospitals, clinics, and service opportunities
- Medical-school or health-system connections
- Campus size and setting
- Academic calendar
- Cost and financial-aid links
- Graduation and outcome data
- Source freshness
- Availability and comparability of major-level admission data

Do not infer that a campus with a medical school is automatically better for premed.

### 19.3 “Good UC for premed” presentation

Do not publish a single ranking. Create a fit-based comparison:

- Strong advising/resources
- Relevant majors and flexibility
- Clinical/service environment
- Research environment
- Learning environment
- Affordability
- Personal campus fit

Explain that success can come from any UC and that undergraduate fit, academic support, meaningful experiences, and cost matter.

### 19.4 Institution-neutral major-offering records

Store the exact institution major name separately from the canonical program. UC pages are filtered views of this general record:

```ts
type ProgramOffering = {
  id: string;
  institutionId: string;
  canonicalProgramId: string;
  officialMajorName: string;
  degreeType: "BA" | "BS" | "BFA" | "other";
  schoolOrCollege?: string;
  department?: string;
  firstYearAvailable: boolean;
  admissionContext?: "campus" | "college" | "direct_major" | "unknown";
  capacityStatus?: "selective" | "capacity_constrained" | "not_identified" | "unknown";
  publishedMajorAdmitData?: "available" | "not_published" | "not_comparable" | "unknown";
  selectivityNote?: string;
  alternateMajorNote?: string;
  changeMajorNote?: string;
  officialUrl: string;
  effectiveTerm: string;
  lastVerified: string;
};
```

Never silently treat similarly named majors as identical.

Do not add UC-specific foreign keys to canonical program, career, recommendation, comparison, or user-progress records.

Do not estimate an offering’s admission rate from campus-level or grouped college data. When comparable major-level data are unavailable, display that limitation directly.

---

## 20. UC admissions planner

The Prepare pillar is a primary workflow beginning in version 1. It must not wait until the campus explorer is complete.

### 20.1 Student academic and opportunity baseline

Collect progressively and allow “unknown”:

- California residency: resident / nonresident / unsure
- Expected high-school graduation year
- Completed, current, and planned courses by term
- Semester or trimester grades
- A–G category when known
- Honors type: UC-certified honors, AP, IB, transferable college course, school honors, none, or unknown
- Current mathematics level
- Completed biology, chemistry, physics, and interdisciplinary science
- School schedule type
- Advanced courses actually available at the school
- Dual-enrollment access
- Schedule, employment, caregiving, transportation, health, or other constraints the student chooses to record
- Existing activities, responsibilities, service, employment, awards, and projects

Do not require school name. If the student provides an official school A–G course-list URL, store the URL without attempting to infer identity-sensitive information.

### 20.2 UC Readiness Snapshot

Generate a snapshot with four evidence states:

- **Verified from an official source**
- **Student entered**
- **Calculated from student-entered data**
- **Needs counselor/institution verification**

The snapshot must show:

- A–G progress and possible gaps
- UC GPA estimate with included terms and honors-point assumptions
- Academic-strength observations without admission prediction
- Senior-course planning questions
- School-opportunity context
- Program-related preparation questions
- Current exploration and activity evidence
- Affordability or logistical factors not yet considered
- At most three immediate next actions

### 20.3 A–G audit

- Support all A–G categories.
- Track the 15-course total and the requirement that at least 11 be completed before senior year.
- Permit manual classification and official-link verification.
- Treat unknown classifications as unresolved, not failed.
- Distinguish minimum completion from courses beyond the minimum.
- Generate a counselor verification list.

### 20.4 UC GPA estimate

- Implement the official UC calculation rules as versioned logic.
- Show which courses and terms are included.
- Show how honors points were applied and capped.
- Support California-resident and nonresident differences.
- Label the result an estimate until UC calculates it from the application.
- Never turn GPA into an admission probability or campus recommendation.

### 20.5 Course-plan builder

Support:

- Current junior-year schedule
- Proposed senior-year schedule
- Alternative course combinations
- A–G coverage
- Program-related preparation
- Workload and wellbeing reflection
- School availability and prerequisites
- Counselor verification state

For each proposed schedule, show:

- What requirement or preparation purpose a course serves
- Whether the course is actually available
- Possible workload concentration
- Questions to verify

Never label the most advanced schedule as automatically best.

### 20.6 Activities, contributions, and project log

Track substance rather than résumé count:

- Activity or responsibility
- Dates and continuity
- Time range, optionally
- Role and actual contribution
- What changed or was learned
- Leadership without requiring a title
- Employment and family responsibilities
- Service and community context
- Academic or independent projects
- Recognition or awards
- Possible PIQ story connections

Do not assign admissions points.

### 20.7 PIQ story bank

Provide a private idea organizer for:

- Experience
- Challenge or opportunity
- Actions taken
- Growth or impact
- Why it matters
- Possible PIQ themes

The site may offer official prompts and brainstorming structure but must not write the student’s final response. Clearly preserve student authorship.

### 20.8 Counselor discussion sheet

Generate a printable/exportable one-page sheet containing:

- Unresolved A–G classifications
- UC GPA calculation questions
- Senior schedule options
- Advanced-course availability
- Dual-enrollment questions
- ELC status question when relevant
- Program-related preparation questions
- School-specific opportunities

Mark counselor-confirmed answers with date and optional note.

### 20.9 Campus-major application portfolio

For each candidate entry, store:

- Institution
- Primary major
- Alternate major where offered
- Why the program and campus fit
- Admission context: campus, college, major, or unknown
- Capacity/selectivity status and data limitations
- Change-of-major constraints
- High-school preparation considerations
- Affordability, housing, commute, and distance considerations
- Application term
- Source verification date

Encourage applying across multiple UC campuses without manufacturing reach/target/safety probabilities. The student may use qualitative labels such as “highly selective overall,” “broader-access UC,” and “needs more research,” only when grounded in current official data and accompanied by a no-prediction disclaimer.

### 20.10 Affordability and practical fit

Make these first-class comparison dimensions:

- Published cost of attendance
- Official net-price and financial-aid estimator links
- California residency
- Housing and commute
- Graduation-rate context
- Undergraduate debt data where comparable
- Expected postgraduate training for the selected path
- Family-entered budget or geographic constraints, clearly labeled

Do not calculate a personalized financial-aid award.

### 20.11 Guardrails

- Explain that minimum eligibility is not a competitive target.
- Do not predict admission.
- Do not tell the student to select a supposedly easier major to game admission.
- Explain that major selectivity and change-of-major policies can differ by campus.
- Date-stamp all policies.
- Highlight that rules may change before fall 2027.
- Never infer major-level admission rates from campus or grouped-college data.
- Never interpret ELC status unless confirmed through the appropriate school/UC process.
- Separate undergraduate UC preparation from future medical-school preparation.
- Require counselor or official-institution verification for school-specific course decisions.

### 20.12 Roadmap periods

Generate tasks under:

- Now / summer before 11th grade
- Fall of 11th grade
- Winter of 11th grade
- Spring of 11th grade
- Summer before 12th grade
- Fall of 12th grade / application season
- After application

Tasks should distinguish:

- Required
- Recommended
- Exploration
- Optional

Avoid long task lists. Show at most three next actions by default.

### 20.13 Roadmap outputs by milestone

By spring of 11th grade:

- A–G and UC GPA review completed or unresolved items identified
- Three to five program families
- Two paths tested through experiences
- Approximately six campus-major combinations
- Preliminary senior schedule
- Summer exploration plan
- Counselor discussion sheet

By fall of 12th grade:

- Final course-reporting review
- Campus-major portfolio
- Alternate-major review
- Activity and award inventory
- PIQ story bank
- Application calendar
- Affordability checklist

---

## 21. Data and content architecture

Use content files rather than hard-coding long descriptions into React components.

The following version 1 structure already exists locally and must be consumed as checked in:

```text
content/
  manifest.json
  program-families.json
  programs.json
  careers.json
  sources.json
  data-contracts.json
  institutions/
    collections.json
    institutions.json
    offerings.json
    admissions.json
    metrics.json
  providers/
    uc/
      provider.json
    fixtures/
      out-of-state-institution.json
  medical/
    path.json
    professions.json
    premed.json
    challenges/
      bio-genetics.json
      chem-buffers.json
      integrated-shortness-of-breath.json
  journey/
    onboarding.json
    nodes.json
    path-profiles.json
  preparation/
    ag-rules.json
    gpa-rules.json
    comprehensive-review.json
    roadmap-templates.json
    application-milestones.json
    piq.json
  schemas/
    record-collection.schema.json
    source-registry.schema.json
scripts/
  content/
    generate-v1-content.mjs
  import/
    provider-types.ts
    import-uc.ts
    import-ipeds.ts
    import-college-scorecard.ts
  validate/
    validate-provider.ts
    validate-crosswalks.ts
outputs/
  uc-pathways-content-v1.0.0.zip
lib/
  content/
    schemas.ts
    load-content.ts
    validate-content.ts
  recommendations/
    evidence.ts
    recommend.ts
    explain.ts
  storage/
    model.ts
    local-store.ts
    migrations.ts
  roadmap/
    generate-roadmap.ts
  preparation/
    academic-baseline.ts
    ag-audit.ts
    uc-gpa.ts
    readiness-snapshot.ts
    counselor-sheet.ts
    application-portfolio.ts
```

Prefer TypeScript validation at build time. A malformed content record should fail the build with a useful message.

Provider files are build-time inputs. The browser should consume normalized, validated content and should not call institutional APIs at runtime.

### 21.0 Pre-generated version 1 content package

The version 1.0.0 package was generated and validated on July 23, 2026. `content/manifest.json` is the machine-readable inventory and must be the first file read during implementation.

The package currently contains:

- 30 JSON files
- 13 interest-gateway records, explicitly presented as navigation rather than an exhaustive list of majors
- 9 detailed program records, including Computer Science
- A complete Fall 2026 official UC major-finder snapshot with 634 named majors and 920 campus-major entries; preserve its future-cycle verification caveat
- 13 career records, including one supporting clinical-data-scientist record
- 9 UC undergraduate-campus records
- 67 initial UC program-offering mappings
- 9 Fall 2025 campus-wide admission metric records
- 53 source records
- 3 medical exploration challenges
- One synthetic out-of-state institution fixture

Content authority and editing rules:

1. Checked-in `content/**/*.json` files are the application’s version 1 content source of truth.
2. `scripts/content/generate-v1-content.mjs` is a reproducible bootstrap and provenance tool. Do not run it automatically during installation, development, testing, or builds.
3. The generator may overwrite direct JSON edits. Run it only when intentionally rebuilding the entire version 1 package from its embedded source snapshot.
4. Normal editorial maintenance happens in the JSON files, followed by schema, source-reference, cross-reference, and freshness validation.
5. `outputs/uc-pathways-content-v1.0.0.zip` is a transfer artifact only. The application must read the unpacked `content/` directory, never the ZIP.
6. Do not fetch UC, AAMC, BLS, O*NET, or other content at browser runtime. Updates are an explicit editorial and validation workflow.
7. Preserve IDs once application state can reference them. A rename requires an alias or migration.
8. Preserve `schemaVersion`, `contentVersion`, `lastVerified`, `nextReviewDue`, and `maintenanceOwnerRole`.

Implementation bootstrap:

1. Read `content/manifest.json`.
2. Confirm every manifest path exists and every JSON file parses.
3. Confirm manifest counts match the loaded records.
4. Implement executable TypeScript/Zod schemas from `content/data-contracts.json` and the supplied JSON Schemas.
5. Validate all records and cross-file references at build time.
6. Normalize the validated records into institution-neutral runtime types.
7. Import content through `lib/content/load-content.ts`; React components must never import isolated JSON records directly.
8. Surface source and verification metadata wherever factual claims appear.

Required build failures include:

- Missing manifest file or listed path
- Duplicate stable ID
- Unknown source, family, program, career, institution, or offering reference
- Missing maintenance owner or review date
- A major offering containing `admitRate`, `estimatedAdmitRate`, or `chanceOfAdmission`
- A future application milestone displaying a date whose status is still `awaiting_official_cycle`
- A source-dependent factual record with no resolvable source

The supplied JSON Schemas validate common package envelopes and the source registry. They do not replace the executable TypeScript domain schemas required in Stage 1.

### 21.1 Common source metadata

Every factual record should support:

```ts
type SourceRef = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  sourceType:
    | "official_uc"
    | "campus_catalog"
    | "government"
    | "professional_association"
    | "research"
    | "forecast";
  publishedOrUpdated?: string;
  lastVerified: string;
  effectiveTerm?: string;
  maintenanceOwnerRole: string;
  nextReviewDue: string;
  notes?: string;
};
```

The source registry must also expose a maintenance view with counts for current, due-soon, stale, conflicted, and unassigned records. A factual record without a maintenance owner role is invalid.

### 21.2 Fact versus interpretation

Keep these separate:

- `facts`: direct source-supported details
- `outlook`: projections with projection period
- `interpretation`: editorial explanation
- `confidence`: high / medium / low

### 21.3 Student preparation data contracts

```ts
type VerificationState =
  | "official_source"
  | "student_entered"
  | "calculated"
  | "needs_verification"
  | "counselor_confirmed";

type HighSchoolCourseRecord = {
  id: string;
  title: string;
  academicYear: string;
  term: "semester_1" | "semester_2" | "trimester_1" | "trimester_2" | "trimester_3" | "summer";
  grade?: string;
  status: "completed" | "current" | "planned";
  agCategory?: "a" | "b" | "c" | "d" | "e" | "f" | "g" | "unknown";
  honorsType?:
    | "uc_certified"
    | "ap"
    | "ib"
    | "transferable_college"
    | "school_honors"
    | "none"
    | "unknown";
  officialCourseListUrl?: string;
  verificationState: VerificationState;
  counselorNote?: string;
};

type SchoolOpportunityContext = {
  scheduleType?: "semester" | "trimester" | "other" | "unknown";
  availableAdvancedSubjects: string[];
  dualEnrollmentAvailable?: boolean;
  constraints: {
    category:
      | "schedule"
      | "employment"
      | "caregiving"
      | "transportation"
      | "health"
      | "financial"
      | "other";
    optionalNote?: string;
  }[];
  lastReviewed?: string;
};

type AcademicBaseline = {
  graduationYear: number;
  residency: "california" | "nonresident" | "unsure";
  courses: HighSchoolCourseRecord[];
  opportunityContext: SchoolOpportunityContext;
  studentEnteredAt: string;
  lastUpdated: string;
};

type ReadinessFinding = {
  id: string;
  area: "ag" | "gpa" | "courses" | "exploration" | "activities" | "application" | "affordability";
  status: "on_track" | "question" | "possible_gap" | "not_explored";
  verificationState: VerificationState;
  summary: string;
  sourceIds: string[];
  nextActionId?: string;
};

type ReadinessSnapshot = {
  generatedAt: string;
  ruleVersion: string;
  findings: ReadinessFinding[];
  immediateNextActionIds: string[];
  disclaimer: string;
};

type RoadmapAction = {
  id: string;
  period:
    | "summer_before_11"
    | "fall_11"
    | "winter_11"
    | "spring_11"
    | "summer_before_12"
    | "fall_12"
    | "after_application";
  category: "required" | "recommended" | "exploration" | "optional";
  title: string;
  rationale: string;
  verificationNeeded?: boolean;
  status: "not_started" | "considering" | "done" | "not_applicable";
};

type ApplicationPortfolioEntry = {
  id: string;
  institutionId: string;
  primaryOfferingId: string;
  alternateOfferingId?: string;
  fitNotes?: string;
  affordabilityNotes?: string;
  admissionContext: "campus" | "college" | "direct_major" | "unknown";
  dataLimitationNote?: string;
  sourceIds: string[];
  lastVerified: string;
};
```

UC GPA and A–G calculations must be pure, versioned functions with unit tests. They must accept student-entered data and return assumptions and unresolved classifications alongside any result.

---

## 22. Local persistence and privacy

### 22.1 Storage

Use browser `localStorage` for the initial release with a versioned root key:

```text
uc-pathways-explorer:v1
```

Persist:

- Onboarding answers
- Journey position
- Evidence events
- Challenge results
- Favorites
- Comparisons
- Roadmap choices
- Academic baseline and course records
- A–G audit and UC GPA calculation assumptions
- UC Readiness Snapshot
- Activities, contributions, responsibilities, and projects
- Counselor questions and confirmation notes
- PIQ story-bank entries
- Campus-major application portfolio
- Family affordability and geographic considerations, visibly labeled
- Optional notes
- Accessibility preferences

### 22.2 Export and import

Provide:

- Export progress as JSON
- Import progress from JSON with schema validation
- Clear all progress with explicit confirmation

This allows moving the local profile between computers without an account.

### 22.3 Privacy rules

- Do not request legal name, date of birth, school name, address, email, race, health information, or immigration information.
- Residency may be recorded only as the minimum needed for UC requirement explanations: California / nonresident / unsure.
- Course names, terms, and grades remain on-device and must be optional to export.
- Life-context or constraint notes are optional, locally stored, and never used to score admission likelihood.
- No analytics or telemetry in the local release.
- No external API calls at runtime.
- No advertising or third-party trackers.

---

## 23. Suggested technical architecture

### 23.1 Framework

Use the existing Sites-compatible Vinext/Next.js starter when working in the current workspace.

The selected version 1 stack is:

| Layer | Selection | Notes |
|---|---|---|
| Runtime | Node.js 22 LTS or the version pinned by the starter | Respect `package.json` and lockfile |
| Language | TypeScript with strict mode | Shared types for content, providers, state, and tests |
| UI | React 19 | Functional components and hooks |
| Application framework | Next.js App Router-compatible structure | File-based routes, layouts, server/static rendering |
| Local/build runner | Vinext on Vite when using the Codex Sites starter | Keeps the project compatible with later Sites/Cloudflare deployment |
| Styling | Tailwind CSS 4 plus CSS custom properties | Tokens in CSS; avoid a heavy component framework |
| Content | Version-controlled JSON files | Human-editable, source-linked, and build-time validated |
| Validation | Zod or an equivalent small schema library | One source for runtime validation and inferred TypeScript types |
| User state | React Context plus `useReducer` | No Redux or other global state library initially |
| Persistence | Browser `localStorage` | Versioned, exportable, importable, and migratable |
| Data imports | Node/TypeScript build-time scripts | Normalize UC, IPEDS, and Scorecard data; no runtime API dependency |
| Unit tests | Vitest | Recommendation, schemas, providers, roadmap, migrations |
| Component tests | React Testing Library | Student journeys and interaction behavior |
| Accessibility checks | `axe-core` integration where practical plus manual keyboard testing | WCAG 2.2 AA intent |
| Icons | A small established icon package such as Lucide React | No custom icon system or model-authored SVG illustrations |
| Formatting/linting | ESLint plus the starter’s formatting conventions | Do not introduce multiple competing formatters |

Application code should remain ordinary React and Next-compatible code. Vinext is a build/runtime adapter, not a domain dependency; no exploration, medical, institution, recommendation, or content logic may import Vinext-specific APIs.

Do not add D1, R2, authentication, or an API unless a later requirement explicitly calls for them.

### 23.1.1 Dependency policy

- Preserve exact versions in the lockfile.
- Add only small dependencies with clear value.
- Do not add a UI component framework, charting library, form framework, or state-management library until a concrete requirement justifies it.
- Prefer platform APIs for storage, export/import, dates, and URL state.
- Keep content and domain logic framework-independent so it can be tested without rendering React.
- If the project is built outside Codex Sites, standard Next.js may replace Vinext without changing application or domain code.

### 23.1.2 Rendering model

- Program, career, medical-reference, source, and institution pages should be statically rendered from validated content.
- Guided journeys, comparisons, favorites, reflections, challenges, and local progress should use client components.
- Keep client-component boundaries narrow; do not mark the whole application as client-rendered.
- Generate normalized content during the build rather than fetching official sources from the browser.
- The local application must remain usable after the first install when offline.

### 23.2 Component families

```text
components/
  shell/
    StudentHeader
    FamilyReferenceNav
    MobileBottomNav
  journey/
    JourneyFrame
    QuestionCard
    ScenarioCard
    ChoiceList
    ReflectionPrompt
    RecommendationReveal
  discoveries/
    EvidenceSummary
    DiscoveryCard
    UnexploredCard
  programs/
    ProgramCard
    IntensityMeter
    CodingReality
    PremedCompatibility
    RelatedCareers
  medical/
    TrainingTimeline
    TimelineCalculator
    ScienceChallenge
    EvidencePanel
    ProfessionComparison
  uc/
    CampusCard
    UCOfferingTable
    CampusComparison
    AdmissionContext
  shared/
    SourceList
    FreshnessBadge
    EmptyState
    SaveButton
    SkipButton
```

### 23.3 State management

React context plus small reducer modules is sufficient. Do not introduce a global state library for the initial release.

Separate:

- Content state: static and read-only
- Journey state: current navigation
- User evidence state: persisted
- UI state: ephemeral

### 23.4 Runtime behavior

- Must work after initial install without internet.
- All routes should render meaningful static content even before local storage hydrates.
- Avoid hydration flashes that reveal the wrong state.
- Use an explicit loading state only for local progress restoration.

### 23.5 Nationwide institution domain model

Treat the following as distinct entities:

```ts
type InstitutionCollection = {
  id: string;
  slug: string;
  name: string;
  description: string;
  kind:
    | "university_system"
    | "state_publics"
    | "regional_peers"
    | "private_peers"
    | "custom";
  institutionIds: string[];
  sourceIds: string[];
};

type Institution = {
  id: string;
  slug: string;
  officialName: string;
  shortName?: string;
  collectionIds: string[];
  stateCode: string;
  city: string;
  control: "public" | "private_nonprofit" | "private_for_profit";
  undergraduateLevel: boolean;
  ipedsUnitId?: string;
  opeId?: string;
  officialUrl: string;
  admissionsUrl?: string;
  catalogUrl?: string;
  calendarSystem?: "semester" | "quarter" | "other";
  sourceIds: string[];
  lastVerified: string;
};

type CanonicalProgram = {
  id: string;
  slug: string;
  name: string;
  familyId: string;
  cipCodes: string[];
  adjacentProgramIds: string[];
  dimensions: Record<ExplorationDimension, number>;
  sourceIds: string[];
};

type AdmissionsPolicy = {
  id: string;
  institutionId: string;
  applicantType: "first_year" | "transfer";
  entryTerm: string;
  residencyCategory?: "resident" | "nonresident" | "international" | "all";
  applicationPlatform?: string;
  testPolicy?: string;
  minimumCoursework?: string[];
  reviewModel?: string;
  majorSelectionContext?: string;
  officialUrl: string;
  lastVerified: string;
};

type MetricObservation = {
  id: string;
  institutionId: string;
  metric:
    | "admit_rate"
    | "net_price"
    | "graduation_rate"
    | "retention_rate"
    | "median_earnings"
    | "enrollment";
  value: number;
  unit: "percent" | "usd" | "count";
  cohortOrYear: string;
  populationNote: string;
  sourceId: string;
};
```

Use stable internal IDs as primary keys. IPEDS UnitID, OPE ID, provider IDs, and campus catalog codes are external identifiers and may not be one-to-one.

### 23.6 Canonical program taxonomy

Use the site’s student-friendly canonical programs for explanation and comparison. Attach one or more optional NCES CIP 2020 codes for national cross-institution matching.

CIP codes must not replace editorial review:

- One institution’s interdisciplinary program may map to multiple CIP concepts.
- Two offerings with the same CIP code can still have materially different curricula.
- A campus’s exact program name and requirements remain authoritative.
- Crosswalk confidence should be stored as `high`, `medium`, or `low`.

The NCES Classification of Instructional Programs is the standard taxonomy for tracking fields of study and completions. Use it as a crosswalk layer, not as the student-facing information architecture.

### 23.7 Provider adapter contract

Every new institution source should normalize into the domain model through a build-time provider:

```ts
type ProviderResult = {
  collections: InstitutionCollection[];
  institutions: Institution[];
  offerings: ProgramOffering[];
  admissionsPolicies: AdmissionsPolicy[];
  metrics: MetricObservation[];
  sources: SourceRef[];
  warnings: string[];
};

interface InstitutionDataProvider {
  id: string;
  label: string;
  load(): Promise<ProviderResult>;
  validate(result: ProviderResult): string[];
}
```

Initial providers:

1. `uc-editorial`: manually verified UC institutions, offerings, advising, and admissions details
2. `ipeds-national`: institution identity and broad institutional metrics
3. `college-scorecard`: cost, completion, debt, earnings, and field-of-study observations where available

Institution-specific catalogs remain the source of truth for current major names, curricula, and admission-to-major details.

### 23.8 Provider precedence and conflicts

Use field-level provenance and deterministic precedence:

1. Current official institution or system page
2. Current official catalog
3. IPEDS/NCES
4. College Scorecard
5. Editorial interpretation

Never overwrite one source silently. When values disagree:

- Preserve both observations when they measure different cohorts or populations.
- Select one display value using documented precedence.
- Add a validation warning.
- Show cohort, population, and data year in the interface.

### 23.9 Institution-neutral user state

Favorites, comparisons, and recommendations must use generic entity references:

```ts
type EntityRef = {
  entityType: "program" | "career" | "institution" | "collection";
  entityId: string;
};
```

Store target scope as collection IDs:

```ts
type CollegeScopePreference = {
  selectedCollectionIds: string[];
  selectedStateCodes: string[];
  publicPrivatePreference?: "public" | "private" | "either";
  distancePreference?: "local" | "regional" | "national" | "unsure";
};
```

Default scope is the UC collection. Expanding scope must not require a local-storage migration beyond adding optional preference fields.

### 23.10 Architecture boundaries

The coding agent must maintain these boundaries:

- **Exploration domain:** programs, careers, dimensions, activities
- **Institution domain:** institutions, collections, offerings, admissions, metrics
- **Medical domain:** training, challenges, professions, premed compatibility
- **User domain:** evidence, favorites, comparisons, roadmap, preferences
- **Source domain:** provenance, freshness, effective dates, confidence

Dependencies should point inward:

- Institutions reference canonical programs.
- User records reference generic entity IDs.
- Recommendations can filter by institution availability but must not be defined by it.
- UC-specific content cannot be imported into the exploration or medical core.

This boundary is the primary safeguard against a UC-only rewrite later.

---

## 24. Visual direction

Use a calm “field guide for the future” visual language:

- Warm off-white background
- Deep navy text
- Teal for progress and exploration
- Muted coral or amber for highlights
- Soft green for biology/health
- Rounded cards, but not childish bubbles
- Strong typography and generous spacing
- Minimal decorative imagery
- Simple CSS diagrams and established icons only when useful
- No model-authored SVG illustrations
- No stock-photo-heavy admissions aesthetic

The student experience should feel:

- Curious
- Capable
- Contemporary
- Warm
- Unhurried

Avoid:

- Corporate dashboard chrome
- Cartoon gamification
- Hospital-blue visual monotony
- Dense academic catalog styling
- Neon “AI product” visuals

### 24.1 Responsive design

Design mobile-first but optimize for a student using a laptop.

Required widths:

- 375px
- 768px
- 1024px
- 1440px

Text lines should remain readable, and interactive controls should be at least 44px high.

---

## 25. Accessibility

Meet WCAG 2.2 AA intent:

- Full keyboard navigation
- Visible focus states
- Semantic headings and landmarks
- Proper labels and descriptions
- Minimum color contrast
- No information conveyed by color alone
- Reduced-motion support
- Screen-reader-friendly progress language
- Accessible dialogs
- Touch-friendly targets
- Plain-language explanations
- Charts and diagrams must have textual alternatives

Do not use timed interactions.

---

## 26. Content research standards

### 26.1 Source hierarchy

Use sources in this order:

1. UC system admissions and information-center pages
2. Official campus catalogs, departments, and advising offices
3. AAMC and other official professional bodies
4. U.S. Bureau of Labor Statistics and O*NET
5. California government labor data
6. Peer-reviewed or institutional research
7. Broad future-of-work reports, clearly labeled as forecasts

Do not use commercial ranking sites as authoritative sources.

### 26.2 Required UC sources

- [UC campuses and majors](https://admission.universityofcalifornia.edu/campuses-majors/)
- [UC major checker](https://admission.universityofcalifornia.edu/campuses-majors/majors/)
- [UC first-year requirements](https://admission.universityofcalifornia.edu/admission-requirements/first-year-requirements/)
- [UC A–G subject requirements](https://admission.universityofcalifornia.edu/admission-requirements/first-year-requirements/subject-requirement-a-g.html)
- [UC GPA requirement](https://admission.universityofcalifornia.edu/admission-requirements/first-year-requirements/gpa-requirement.html)
- [UC comprehensive review](https://admission.universityofcalifornia.edu/counselors/preparing-freshman-students/comprehensive-review.html)
- [UC first-year admit data](https://admission.universityofcalifornia.edu/campuses-majors/first-year-admit-data.html)
- [UC Personal Insight Questions](https://admission.universityofcalifornia.edu/how-to-apply/applying-as-a-first-year/personal-insight-questions.html)
- [UC undergraduate outcomes](https://accountability.universityofcalifornia.edu/2026/chapters/chapter-4.html)
- Each campus’s current official catalog

### 26.3 Required medical sources

- [AAMC high-school medicine exploration](https://students-residents.aamc.org/resources-k-12-community/explore-medicine-high-school-students)
- [AAMC deciding on medicine](https://students-residents.aamc.org/choosing-medical-career/what-consider-you-decide-career-medicine)
- [AAMC medical-school expectations](https://students-residents.aamc.org/choosing-medical-career/what-expect-medical-school)
- [AAMC medical-school application timeline](https://students-residents.aamc.org/applying-medical-school/timeline-application-and-admission-medical-school)
- [AAMC admission requirements](https://students-residents.aamc.org/medical-school-admission-requirements/admission-requirements)
- [AAMC premed competencies](https://students-residents.aamc.org/real-stories-demonstrating-premed-competencies/premed-competencies-entering-medical-students)
- [AAMC MCAT content outline](https://students-residents.aamc.org/prepare-mcat-exam/whats-mcat-exam-pdf-outline)

### 26.4 Required career sources

- [BLS Occupational Outlook Handbook](https://www.bls.gov/ooh/)
- [BLS fastest-growing occupations](https://www.bls.gov/ooh/fastest-growing.htm)
- [O*NET](https://www.onetonline.org/)
- [UC alumni outcomes](https://www.universityofcalifornia.edu/about-us/information-center/uc-alumni-earnings)
- [World Economic Forum Future of Jobs 2025](https://www.weforum.org/publications/the-future-of-jobs-report-2025/digest/) only as a labeled employer forecast, never as certainty

### 26.5 Freshness policy

- Every admissions fact: verify annually and again before the student applies.
- Every campus offering: include effective academic term.
- Labor projections: include base year and projection year.
- Salary: include data year, geography, and population limitations.
- Forecast statements: include source date and confidence.
- Display a warning when a record has not been verified in more than 12 months.
- Assign every factual content area to a maintenance owner role, even if one parent fills all roles in the local version.
- Schedule a full UC admissions and offering review each July, plus a final policy and deadline check 60–90 days before the application is submitted.
- Treat unassigned, overdue, or conflicted records as visible maintenance failures; do not silently publish them as current.

### 26.6 National expansion sources

For non-UC institutions, use:

- [NCES IPEDS](https://nces.ed.gov/ipeds/) for institutional identity, characteristics, admissions, enrollment, cost, financial aid, completions, and graduation data
- [NCES CIP 2020](https://nces.ed.gov/ipeds/cipcode/Default.aspx) for program taxonomy and crosswalks
- [College Navigator](https://nces.ed.gov/ipeds/find-your-college) for institution lookup and official IPEDS-linked profiles
- [U.S. Department of Education College Scorecard dataset](https://catalog.data.gov/dataset/college-scorecard) for comparable cost, completion, debt, earnings, and field-of-study observations
- Each institution’s official admissions site, catalog, departmental pages, and Common Data Set when available

Do not assume that institutional statistics are directly comparable merely because they share a field name. Preserve cohort, population, reporting year, and methodology.

---

## 27. Build stages

### Stage 0: Workspace and setup

Current workspace note:

- A Sites-compatible starter was partially copied into the current folder during an interrupted setup.
- Product implementation has not begun.
- The complete version 1.0.0 content package is already present under `content/`.
- The content archive is present at `outputs/uc-pathways-content-v1.0.0.zip`.
- The deterministic bootstrap generator is present at `scripts/content/generate-v1-content.mjs`.
- `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `.openai/hosting.json`, and starter files exist.
- Dependency installation was interrupted and `node_modules` may be partial.
- Do not rerun the initializer in this same non-empty directory.
- On this computer, run a clean `npm ci` using a writable npm cache if necessary.
- On a different computer, create a new empty project directory and run the Sites initializer exactly once, then copy this specification into the project.
- Keep the project local; do not deploy.

Exit criteria:

- Dependencies install successfully.
- Development server opens locally.
- Existing starter structure is understood.
- `content/manifest.json` is read successfully and all 30 listed JSON files are present.
- Running the content generator is not part of normal setup.

### Stage 1: Product foundation

Build:

- Final metadata and app shell
- Visual tokens
- Local-storage model and migrations
- Content loader, executable TypeScript schemas, cross-reference validation, and useful build errors for the pre-generated package
- Institution-neutral domain entities and provider contract
- UC collection loaded from the existing normalized institution files and provider descriptor
- Academic baseline, A–G, UC GPA, readiness, roadmap, and application-portfolio schemas
- Versioned UC preparation rules loaded from the existing preparation JSON files
- Home page
- Settings export/import/reset

Exit criteria:

- Local progress survives refresh.
- Invalid content fails validation.
- All manifest paths, record counts, stable IDs, source references, and entity cross-references validate.
- No production component contains duplicated long-form content from the JSON package.
- A clean build requires no network access for content.
- Home works at mobile and desktop widths.
- Discover and Prepare appear as equal pillars.
- UC GPA and A–G functions pass fixture tests, including unresolved course classifications.

### Stage 2: Two-pillar vertical slice

Build two linked, resumable short sessions that collectively span both goals:

- Four-question onboarding
- One guided scenario
- One reflection
- Evidence creation
- A diverse three-path recommendation reveal
- Discoveries page
- Lightweight academic baseline
- A–G progress review
- UC GPA estimate with assumptions
- UC Readiness Snapshot
- At most three next preparation actions
- Counselor-verification list

Exit criteria:

- New user reaches an interesting result in under 8 minutes.
- Skip and unsure paths work.
- Recommendation includes evidence-supported, adjacent, and discovery paths.
- Student can create a readiness snapshot without entering school name or other PII.
- Snapshot separates verified, entered, calculated, and unresolved information.
- No admission probability or major-level estimate is generated.

### Stage 3: UC preparation core

Build:

- Full course-plan builder
- School-opportunity context
- Activities, contributions, responsibilities, and project log
- Counselor discussion sheet
- PIQ story bank
- Date-aware roadmap through application
- Affordability and geographic considerations
- Campus-major application portfolio shell

Exit criteria:

- Preliminary senior-course plan can be created and marked for verification.
- Counselor sheet exports cleanly.
- PIQ tool preserves student authorship.
- Roadmap produces milestone artifacts rather than a generic checklist.
- Family considerations are visibly separated from student evidence.

### Stage 4: Focused program and career exploration

Build:

- Pages for all 12 pre-generated program-family summaries
- Pages for all 8 pre-generated detailed programs
- Pages for all 13 pre-generated career records
- Program-family browse mode that can ignore personalization
- Favorites
- Related program/career links
- Three-item comparison
- High-school preparation labels on program pages
- The 67 pre-generated UC offering mappings for the initial program set

Exit criteria:

- Compare works across three programs.
- Every factual claim has source metadata.
- Coding, graduate-education, high-school preparation, and premed implications are explicit.
- Recommendations do not collapse into only medicine or quantitative paths.
- No preparation recommendation is misrepresented as an admission requirement.

### Stage 5: Medical vertical slice

Build:

- Medical hub
- Training timeline
- Premed explanation
- Major compatibility comparison
- The pre-generated genetics-and-proteins biology challenge
- The pre-generated acids-and-buffers chemistry challenge
- The pre-generated shortness-of-breath integrated medical case
- Alternative health professions overview

Exit criteria:

- Student can explain the full physician path.
- Challenge captures engagement separately from correctness.
- No challenge feels like a graded exam.
- Medicine is presented beside clinical, research, data, engineering, policy, and other health paths.

### Stage 6: UC campus and application portfolio

Build:

- All nine campus overview pages
- UC comparison
- Verified offering map for the initial eight-to-ten program set
- Admission-context and data-availability states
- Alternate-major and change-of-major notes where officially published
- Application portfolio integration
- Official cost and financial-aid links

Exit criteria:

- The site avoids a single “best premed UC” ranking.
- Offering records use exact official major names.
- Admissions facts show source and effective date.
- Missing major-level admit data are displayed as unavailable, not estimated.
- Portfolio supports multiple campuses and different majors without assigning admission probabilities.

### Stage 7: Validation, usability, and selective content expansion

Perform:

- Production build
- Content validation
- Unit and integration tests
- Keyboard and responsive testing
- Local-storage migration testing
- Export/import round trip
- Link validation
- Copy review
- Student usability testing on both pillars
- Parent factual-reference review
- Counselor review of generated discussion sheet if available
- Selective content expansion only after the vertical slice is validated

Exit criteria:

- All acceptance criteria in Section 30 pass.
- No runtime network calls are required.
- A fresh user and a returning user both work.
- Student completes a short session without explanation and is willing to return.
- Readiness Snapshot and counselor sheet are understandable and do not imply prediction.
- Content expansion priorities are based on observed student use.

### Post-version-1 content expansion

Only after Stage 7:

- Expand beyond ten detailed programs
- Expand beyond fifteen careers
- Add more than three medical challenges
- Complete all-UC major mapping
- Add out-of-state editorial content
- Add automated national data imports

The architecture remains nationwide-ready, but nationwide content is not a version 1 delivery requirement.

---

## 28. Testing strategy

### 28.1 Unit tests

- Evidence aggregation
- Confidence labels
- Mixed-evidence handling
- Recommendation explanation
- Challenge difficulty selection
- Roadmap date logic
- Local-storage migrations
- Export/import validation
- Content schema validation
- Provider normalization
- External-identifier crosswalks
- Source-precedence conflict handling
- Canonical-program mapping confidence
- A–G category totals and unresolved classifications
- Resident and nonresident UC GPA rules
- Honors-point caps and term inclusion
- Readiness finding verification states
- Counselor-sheet generation
- Application-portfolio data limitations
- Recommendation diversity rules

### 28.2 Integration tests

- New user onboarding → sampler → reflection → discovery
- Academic baseline → A–G audit → GPA estimate → Readiness Snapshot
- Discovery reveal → readiness snapshot → three combined next actions
- Returning user resumes at exact prior node
- Skip and “not sure” paths
- Favorite and compare
- Complete science challenge
- Export → clear → import → restore
- Route loads with empty local storage
- Route loads with migrated older storage
- Course-plan alternative → counselor verification → roadmap update
- Campus-major portfolio with different primary majors at different UCs
- PIQ story-bank export without generated essay text

### 28.3 Content tests

- Unique IDs and slugs
- Valid relationships
- No missing source references
- No stale admissions data beyond threshold
- Intensity ratings in range
- Every UC offering has official URL and effective term
- Every labor projection has a period
- No medical challenge uses a real person or gives treatment advice
- No offering derives a major-level admit rate from campus or grouped-college data
- Every preparation statement has a requirement/recommendation/verification label
- Every UC GPA rule has a source and effective date
- Every application deadline has an application term

### 28.4 Accessibility tests

- Complete key flow using keyboard only
- Focus never becomes trapped
- Screen reader labels for all choices
- Dialog announcements
- Reduced-motion mode
- High zoom and narrow viewport
- Contrast checks

### 28.5 Manual usability script

Ask a tester to:

1. Start without instruction.
2. Complete one exploration.
3. Stop midway through the second.
4. Refresh and resume.
5. Find a program.
6. Compare it with two others.
7. Locate the physician timeline.
8. Explain why a recommendation appeared.
9. Export progress.
10. Create a partial academic baseline.
11. Identify one item requiring counselor verification.
12. Explain what the UC GPA estimate does and does not mean.

Record confusion and hesitation, not just bugs.

### 28.6 Pre-code paper-prototype test

Before product implementation, test two short, linked paper or lightweight clickable sessions. Do not require both in one sitting.

**Session A — Discover:**

1. Home with Discover and Prepare
2. Three onboarding questions
3. One short biology scenario
4. One reflection
5. Three-path discovery reveal
6. Save-and-return point

**Session B — Prepare:**

1. Home with Discover and Prepare
2. One academic-baseline question at a time
3. A sample A–G or UC GPA finding
4. A sample UC Readiness Snapshot
5. At most three next actions
6. Save-and-return point

Observe whether the student:

- Understands that the sampler is not a test
- Finds the session length acceptable
- Understands the two pillars
- Can distinguish a recommendation from a verdict
- Understands the difference between an admission requirement and useful preparation
- Wants to continue or return
- Can finish either session in 3–8 minutes without feeling obligated to complete the other

Revise copy and flow before building the full vertical slice.

---

## 29. Editorial style

Voice:

- Warm
- Direct
- Curious
- Respectful
- Never patronizing

Prefer:

> “Data science uses programming, statistics, and domain knowledge to draw defensible conclusions from data.”

Avoid:

> “Love numbers? Data science is the perfect major for you!”

Prefer:

> “This activity is one small sample. Finding it difficult does not mean the field is wrong for you.”

Avoid:

> “Your score shows you are not ready for premed.”

Use “student,” “you,” and concrete actions. Define unfamiliar terms on first use.

---

## 30. Product acceptance criteria

The first full local release is acceptable only when:

1. A new user can begin without creating an account.
2. Onboarding has no more than four required questions before the first sampler.
3. A normal sampler takes no more than 10 minutes.
4. The user can stop and resume after refresh.
5. Every question provides skip or unsure where appropriate.
6. No screen displays a career-fit percentage.
7. Science correctness is not displayed as a grade.
8. Recommendations show reasons and unexplored factors.
9. At least six programs have complete, sourced pages.
10. At least ten careers have complete, sourced pages.
11. The medical timeline includes undergraduate study, medical school, residency, and optional fellowship.
12. The site clearly states that premed is generally not a major.
13. Premed major comparison includes non-biology options.
14. At least one biology, one chemistry, and one integrated medical activity work end to end.
15. All nine undergraduate UC campuses have overview records.
16. UC comparisons do not declare a universal “best UC for premed.”
17. Major selectivity claims include an official source and effective term.
18. Admissions pages warn that policies can change.
19. Career outlook includes projection periods and uncertainty.
20. Data Science pages disclose meaningful programming requirements.
21. No user PII is required.
22. No analytics or third-party tracking is present.
23. Export, reset, and import work.
24. The application works without runtime internet access.
25. Core flows are keyboard accessible.
26. Layout works from 375px through 1440px.
27. Production build and automated tests pass.
28. Core program, career, medical, recommendation, and user-state types contain no UC-specific foreign keys.
29. A fixture for one out-of-state institution can be added through a provider without modifying page components or recommendation logic.
30. The UC experience is rendered by filtering the general institution model through the UC collection.
31. Discover and Prepare are equal top-level product pillars.
32. The first vertical slice produces both a discovery result and a UC Readiness Snapshot.
33. Academic baseline entry permits unknown values and does not require school name.
34. A–G audit distinguishes unresolved classification from missing coursework.
35. UC GPA estimate displays included courses, honors assumptions, rule version, and no-prediction disclaimer.
36. A proposed senior schedule includes workload reflection and counselor-verification state.
37. The student can export a concise counselor discussion sheet.
38. Preparation statements distinguish requirements, recommendations, optional exploration, and verification needs.
39. Recommendations include evidence-supported, adjacent, and discovery paths.
40. The student can browse programs without personalization.
41. The site never infers a major-level admission rate from campus or grouped-college data.
42. An offering explicitly indicates whether comparable major-level data are available.
43. The application portfolio supports different majors at different UC campuses.
44. The application portfolio records alternate-major policy and data limitations where available.
45. Affordability, housing, commute, and postgraduate-training considerations appear in comparison.
46. PIQ support stores ideas and experiences but does not generate final student responses.
47. Activities and responsibilities are represented by contribution and continuity, not an admissions score.
48. The roadmap produces the spring-of-11th and fall-of-12th milestone artifacts in Section 20.13.
49. The first release contains no more than ten detailed programs, fifteen detailed careers, and three medical challenges unless student testing justifies expansion.
50. A pre-code paper-prototype session has been completed and findings recorded.
51. Every factual content area has a maintenance owner role, next-review date, and visible freshness status.

---

## 31. Definition of done for each content record

A program, career, campus, or medical page is not done until it has:

- Plain-language introduction
- Concrete “what you actually do” content
- Intensity or commitment information
- At least one adjacent alternative
- At least one “try it” activity
- Source references
- Last-verified date
- Maintenance owner role and next-review date
- Uncertainty or limitation note when appropriate
- Mobile-readable layout
- Accessibility review
- No unsupported superlatives

---

## 32. Recommended first implementation slice

If the coding agent needs one precise starting target, implement this:

### Content

- Program families: all 12 summaries
- Complete programs: Biology, Biochemistry, Data Science, Statistics, Cognitive Science, Public Health, Bioengineering, Operations Research
- Complete careers: Physician, Physician Assistant, Epidemiologist, Biostatistician, Bioinformatics Scientist, Data Scientist, Operations Research Analyst, UX Researcher, Biomedical Engineer, Public Health Analyst, Genetic Counselor, Healthcare Operations Analyst
- UC campuses: all nine summary records
- UC offerings: verified mappings for the detailed program set, plus a separately labeled complete official major-directory snapshot
- Preparation rules: current A–G, UC GPA, comprehensive-review factors, PIQ structure, and application-cycle milestones
- Medical activities:
  - Genetics and proteins
  - Acids, bases, and blood buffers
  - Shortness-of-breath integrated case

### Interactions

- Four-question onboarding
- Diverse three-path recommendation reveal
- Academic baseline
- A–G audit
- UC GPA estimate with assumptions
- UC Readiness Snapshot
- Senior-course-plan draft
- Counselor discussion sheet
- Favorites
- Three-item compare
- Campus-major portfolio shell
- Activities and project log
- PIQ story bank
- Affordability checklist
- Training timeline calculator
- Local progress
- Export/import/reset

### Recommended first student flow

```text
Home
→ Choose Discover or Prepare

Discover branch — 3–8 minutes:
  → 4-question exploration onboarding
  → “How can one DNA change affect the body?” sampler
  → 2-tap reflection
  → Three-path discovery reveal:
     Evidence-supported path
     Adjacent path
     Discovery path
  → Save and return
  → Optional invitation to Prepare on this or a later visit

Prepare branch — 3–8 minutes for the first pass:
  → One lightweight academic-baseline question at a time
  → A–G or UC GPA review with assumptions
  → Partial UC Readiness Snapshot
  → At most three next actions:
     Explore one program
     Verify one academic question
     Plan one real-world experience
  → Save and return
  → Optional invitation to Discover on this or a later visit

Across later visits:
  → Combine discovery evidence and preparation findings
  → Refine the roadmap, counselor sheet, and campus-major portfolio
```

This slice proves both product pillars before large-scale content authoring without forcing both into one sitting.

---

## 33. Future enhancements

Not part of the initial build:

- Optional parent and student profiles
- Cloud sync
- Counselor collaboration
- Calendar reminders
- Automated annual data refresh
- Live UC APIs
- Additional national and institution-specific provider adapters
- Medical-school comparison
- Scholarship search
- AI conversation interface
- Rich data visualizations
- College visit planner

If later adding AI, constrain it to grounded explanation using the site’s curated sources. Do not let it invent admissions policy, medical requirements, or career projections.

---

## 34. Open assumptions to confirm later

The product can proceed without these answers, but expose them in settings or later journey questions:

- California residency
- Current math course and planned senior math
- Whether she prefers laboratory, patient-facing, data, or systems problems
- Which aspects of programming she disliked
- Campus geography and size preferences
- Financial constraints
- Willingness to pursue extended postgraduate training
- Interest in health professions other than physician

Do not block first use on these questions.

---

## 35. Final instruction to the coding agent

Build the smallest experience that feels complete, not the largest database that feels unfinished.

The product should leave the student thinking:

> “I learned something about a field and about myself, and I know what I want to try next.”

It should not leave her thinking:

> “I have been assigned another long college-preparation task.”

---

## 36. Pre-implementation readiness gate

The architecture is implementation-ready, but completing the following small planning package before full coding will materially reduce rework.

### 36.1 Freeze the first student journey

Write the exact copy and branching for two linked, resumable sessions. Each session must stand alone and take approximately 3–8 minutes:

**Discover session:**

1. Welcome and Discover/Prepare choice
2. Four exploration-onboarding questions
3. Genetics-and-proteins sampler
4. Two-tap reflection
5. Three-path discovery reveal
6. Optional invitation to Prepare
7. Save and exit

**Prepare session:**

1. Welcome or returning-user entry
2. One academic-baseline step at a time
3. Sample A–G/GPA review
4. Partial UC Readiness Snapshot
5. At most three next actions
6. Optional invitation to Discover
7. Save and exit

For every interaction, specify:

- Prompt
- Answer choices
- Skip/unsure behavior
- Evidence events created
- Next-node rule
- Explanation
- Accessibility label

Do not author the entire journey library before this one flow is tested.

### 36.2 Validate and integrate the pre-generated content

Do not re-author the initial program, career, institution, admission, medical, preparation, or journey records. They are already present in the version 1.0.0 JSON package.

Before building student-facing pages:

- Verify all files and counts against `content/manifest.json`.
- Validate the 13 interest gateways, 9 detailed programs, 13 careers, 9 UC campuses, 77 detailed-program offerings, the 634-name UC directory snapshot, 9 campus metrics, 53 sources, and 3 medical challenges.
- Validate the synthetic out-of-state fixture through the same institution-neutral provider contract used for UC content.
- Confirm Fall 2025 campus-wide metrics cannot be presented as major-level admission statistics.
- Confirm future-cycle application dates remain hidden while their status is `awaiting_official_cycle`.
- Confirm every factual page can resolve and display its sources and verification date.
- Confirm medical challenges preserve their non-diagnostic, non-aptitude-test disclaimer.

The following user-state and calculation fixtures are not editorial content and still need to be created in tests:

- One academic baseline with unresolved A–G classifications
- One UC GPA fixture for a California resident
- One UC GPA fixture for a nonresident
- One counselor discussion sheet
- One campus-major application portfolio

Each supplied content record and new test fixture must satisfy the definition of done in Section 31.

### 36.3 Freeze version 1 data contracts

Translate the pre-generated `content/data-contracts.json` requirements into executable TypeScript schemas and fixture tests for:

- `CanonicalProgram`
- `Career`
- `InstitutionCollection`
- `Institution`
- `ProgramOffering`
- `AdmissionsPolicy`
- `MetricObservation`
- `SourceRef`
- `JourneyNode`
- `EvidenceEvent`
- `ChallengeResult`
- `AcademicBaseline`
- `HighSchoolCourseRecord`
- `SchoolOpportunityContext`
- `ReadinessSnapshot`
- `RoadmapAction`
- `ApplicationPortfolioEntry`
- Versioned local user state

After fixtures pass, changes to these contracts require a migration note.

Do not make editorial changes merely to simplify a schema. When a supplied record exposes a legitimate shape not yet covered by the schema, update the schema or document an intentional migration.

### 36.4 Choose one visual direction

Prepare three comparable first-screen and journey-screen mockups, then select one direction.

The options should vary in:

- Information density
- Typography
- Card and navigation treatment
- Use of color
- Degree of “field guide” versus “modern learning app”

They must use identical realistic content so the choice is visual, not editorial.

If no stakeholder is available to choose, use the default visual direction in Section 24.

### 36.5 Create the implementation backlog

Convert Stages 0–7 into small tickets. Every ticket should include:

- User-visible outcome
- In-scope files or domain
- Dependencies
- Acceptance criteria
- Required tests
- Content dependencies
- Explicit non-goals

The first backlog should stop at the vertical slice. Do not create hundreds of content-entry tickets until the content schema and first student flow have been validated.

### 36.6 Establish source and content workflow

The source registry, owner roles, review dates, and version 1 content records already exist. Before adding or materially revising content:

- Define the stale-data threshold.
- Validate that every factual content area retains a maintenance owner role and next-review date.
- Create a July annual-review checklist and a 60–90-day pre-application verification checklist.
- Add a maintenance dashboard or report for current, due-soon, stale, conflicted, and unassigned records.
- Implement the build-time content validator.
- Add a “last verified” field to visible factual pages.
- Create one example of a source conflict and verify that precedence rules work.
- Document how an editor updates a program, institution, or admissions record.
- Document that normal content edits happen in JSON and that the bootstrap generator is never run automatically.

### 36.7 Test with the student before and after the vertical slice

Run the paper-prototype test in Section 28.6 before implementation. Run a second usability session after the coded vertical slice and before content expansion.

Observe:

- Whether she starts without explanation
- Whether she understands that the experience is not a test
- Whether any question feels taxing
- Whether she reads the explanation
- Whether the recommendation makes sense
- Whether she voluntarily selects another path
- Whether she returns on another day

Success is behavioral, not a satisfaction rating: she completes a short session and is willing to return.

### 36.8 Risk register

| Risk | Mitigation |
|---|---|
| Content breadth delays a usable product | Build and test one vertical slice first |
| Student experiences the site as homework | Maintain strict session budgets and optional depth |
| Recommendations create false certainty | Use evidence explanations, confidence language, and unexplored factors |
| Admissions facts become stale | Source registry, effective terms, annual verification |
| Nobody owns factual updates | Required maintenance owner roles, review dates, and a visible maintenance report |
| Institution data appear comparable when they are not | Preserve cohort, population, year, and methodology |
| UC assumptions leak into core code | Enforce institution-neutral acceptance tests |
| Medical activities overemphasize academic correctness | Separate understanding from engagement |
| Parent priorities dominate the student journey | Keep student-facing questions neutral and preserve skip options |
| Local progress is lost when changing computers | Export/import with versioned validation |
| Future expansion requires a rewrite | Provider adapters, canonical programs, and generic entity references |
| Career exploration overshadows time-sensitive UC preparation | Equal Discover and Prepare pillars in the first vertical slice |
| Generic advice ignores school opportunities | Academic baseline, opportunity context, and counselor verification |
| Recommendations reinforce only current interests | Required adjacent and discovery paths plus unpersonalized browse |
| Campus data are misread as major-level selectivity | Explicit data-availability states and prohibition on inferred rates |
| Student is pushed toward an unsustainable schedule | Workload reflection and no “maximum rigor” recommendation |
| Premed becomes the default identity | Equal presentation of clinical, research, analytical, engineering, policy, and other paths |
| Cost is considered too late | First-class affordability and postgraduate-training considerations |

### 36.9 Definition of ready

Full implementation may begin when:

1. The two-pillar first student journey is scripted.
2. The pre-generated content package validates against executable TypeScript schemas and cross-reference rules.
3. The synthetic out-of-state fixture validates through the same provider contract as the UC collection.
4. Preparation fixtures include A–G, resident/nonresident UC GPA, readiness, counselor, and portfolio records.
5. Version 1 TypeScript schemas are executable.
6. A visual direction is selected or the default is explicitly accepted.
7. The vertical-slice backlog has acceptance criteria.
8. The supplied source registry validates and freshness rules are active.
9. The pre-code paper prototype has been tested with the student and findings recorded.
10. Every initial factual content area retains its supplied maintenance owner role and next-review date.

The editorial-content portion of items 2, 3, 8, and 10 is already supplied. The coding agent must implement the validation and runtime integration; it must not repeat the original research as a prerequisite. Exhaustive UC research and nationwide content expansion happen after the vertical slice proves both Discover and Prepare.

---

## 37. Critical-review incorporation audit

This audit was completed against the saved version 2.2 plan after an interrupted network session and the generation of the version 1.0.0 content package. Each previously identified major gap is explicitly resolved below.

| Previously identified gap | Incorporated resolution | Primary sections |
|---|---|---|
| Career discovery could overshadow time-sensitive UC preparation | Discover and Prepare are equal top-level pillars and both appear in the first vertical slice. | 2, 6, 7, 27 |
| Advice could remain generic without the student’s actual academic context | Academic baseline captures courses, grades, residency uncertainty, school opportunities, responsibilities, and constraints without requiring school name. | 20.1, 21.3 |
| UC admissions criteria were described but not operationalized | The product includes an A–G audit, versioned UC GPA estimate, course planner, activities log, PIQ story bank, counselor sheet, and roadmap. | 20.2–20.13 |
| Success could be measured only by engagement rather than useful preparation | Spring-of-11th and fall-of-12th milestone artifacts are explicit product outputs. | 3.2.1, 20.13, 30 |
| Campus-level data could create false major-level precision | Major-level rates may never be inferred; availability, source, effective term, and limitations must be shown. | 3.3, 19.4, 20.9, 28.3 |
| The family lacked a concrete campus-major application strategy | A portfolio supports multiple UC campuses, different majors, alternate majors, policy notes, and qualitative context without probabilities. | 20.9, 21.3, 27 Stage 6 |
| Version 1 was too broad to finish and validate well | Detailed content is capped at ten programs, fifteen careers, and three medical challenges; nationwide editorial expansion is post-version-1. | 27, 30.49, 32 |
| Personalization could reinforce only current interests | Each recommendation set requires an evidence-supported, adjacent, and discovery path, plus unpersonalized browse. | 4.9, 10.6 |
| Premed could become the default identity | Medicine is one option among clinical, research, analytical, engineering, policy, and alternative-health paths. | 4.9, 16, 27 Stage 5 |
| Affordability and the cost of long training were too peripheral | Cost, aid, housing, commute, and postgraduate training are first-class comparison and planning factors. | 20.10, 30.45 |
| School-specific advice needed human verification | Unresolved course classifications and ELC or school-policy questions flow to a dated counselor discussion sheet. | 20.2–20.8 |
| Academic rigor advice could encourage an unsustainable load | Course planning must consider mastery, wellbeing, opportunity, and life constraints and may not prescribe maximum rigor. | 4.8, 20.5, 20.11 |
| “Recommended preparation” could be mistaken for an admission requirement | Content labels distinguish official eligibility, institution/program requirements, recommended preparation, optional exploration, and verification needs. | 13, 20.11, 30.38 |
| The student might experience the product as one long assessment | Discover and Prepare are separate 3–8 minute resumable sessions with skip, unsure, and save points. | 4, 18, 28.6, 32, 36.1 |
| The design could be coded before proving that the daughter finds it useful | A pre-code paper prototype and a post-vertical-slice usability session are readiness gates. | 28.6, 30.50, 36.7 |
| Future out-of-state expansion could require a rewrite | Core entities are institution-neutral, UC is a provider/collection, and an out-of-state fixture is an acceptance test. | 23.5–23.10, 30.28–30.30 |
| Accurate content could become stale without clear ownership | Every factual area requires a maintenance owner role, review date, annual July review, pre-application check, and visible maintenance status. | 21.1, 26.5, 36.6 |
| A coding agent could ignore or overwrite the researched local JSON package | The manifest-first bootstrap, JSON source-of-truth rule, non-automatic generator policy, validation failures, and build-stage integration requirements are explicit. | 1, 21.0, 27, 36.2–36.3 |
| Local-only storage could make work fragile | Versioned persistence, migration, export/import, and round-trip tests are required; no runtime network is needed. | 22, 27 Stage 7, 30.23–30.24 |

No previously identified major gap remains unassigned. Implementation should not begin until the readiness conditions in Section 36.9 are satisfied.

---

## 38. Version 2.2 content-integration update

Version 2.2 incorporates the completed local content package into the implementation handoff.

Changes from version 2.1:

- Declares `content/**/*.json` as the authoritative version 1 editorial content.
- Adds a manifest-first implementation bootstrap and concrete package counts.
- Replaces the hypothetical content tree with the files actually generated.
- Prevents automatic generator execution and accidental overwriting of maintained JSON.
- Requires offline build-time parsing, schema validation, and cross-reference validation.
- Updates Stages 0, 1, 4, and 5 to load existing content rather than author it.
- Replaces the pre-code content-authoring gate with content-integration and validation work.
- Separates supplied editorial fixtures from user-state and calculation fixtures that still require tests.
- Preserves the nationwide expansion strategy through the supplied out-of-state provider fixture.
