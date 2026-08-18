# EEE MCQ Vault

A simple, mobile-friendly MCQ practice website for Electrical & Electronics Engineering (EEE) job preparation.

The main goal of this project is not to build a feature-heavy learning platform. It is a lightweight personal question bank that allows EEE MCQs collected from books to be converted into a standard JSON format and practiced quickly on a phone or PC.

## 1. Project Philosophy

The project follows a simple principle:

> Build the engine once. Keep adding questions.

The website logic and UI should rarely need to change.

Most future work should only involve:

1. Scanning MCQs from books.
2. Converting them into the standard JSON format using AI.
3. Adding the JSON questions to the appropriate question-bank file.
4. Adding a new taxonomy entry in `config.js` when a new topic/subtopic is introduced.


# 2. Main Features

## Dashboard

- Website title
- Topic cards
- Total number of questions
- Number of bookmarked questions
- Automatically generated topic/subtopic buttons

## Practice

- Practice an entire topic
- Practice a specific subtopic
- Practice bookmarked questions
- Questions are shuffled for every new session
- Restart reshuffles the session
- Compact mobile-friendly question cards
- Instant answer checking
- Correct answer shown in green
- Wrong selected answer shown in red
- Correct/wrong counters
- Progress counter
- Progress bar
- Collapsed explanation
- Bookmark questions
- Browser/phone Back button returns to dashboard

## Question Data

Questions are stored separately as JSON files.

The website logic does not contain the actual questions.

This means the question bank can grow without modifying the application engine.


# 3. Project Architecture

The project is intentionally simple.

```text
EEE-MCQ-Vault/
│
├── index.html
├── style.css
├── app.js
├── config.js
├── README.md
│
└── data/
    │
    ├── electronics/
    │   ├── bjt.json
    │   ├── diode.json
    │   ├── fet.json
    │   ├── mosfet.json
    │   └── opamp.json
    │
    ├── machines/
    │   ├── transformer.json
    │   ├── dc_generator.json
    │   ├── dc_motor.json
    │   ├── induction_motor.json
    │   ├── synchronous_motor.json
    │   └── synchronous_generator.json
    │
    ├── control/
    │   └── basic.json
    │
    └── images/
        ├── ET-BJT-087.png
        ├── ET-DIO-041.png
        └── ...
````

# 4. File Responsibilities

## `index.html`

Contains the basic website structure.
Normally this file should NOT need to be edited when adding new topics or questions.
Topic cards and subtopic buttons are generated dynamically from `config.js`.

## `style.css`

Contains the visual design.
The website is designed primarily for mobile screens, while still supporting PC browsers.
The UI uses a dark, eye-friendly theme with compact spacing so that more questions can be viewed with less scrolling.
Normally, this file should not need to be edited when adding questions.

## `app.js`

The main application and practice engine.

Responsibilities include:

* Loading question JSON files
* Generating the dashboard
* Counting questions
* Starting practice sessions
* Shuffling questions
* Rendering questions
* Checking answers
* Updating progress
* Restarting practice
* Bookmark handling
* Bookmarked-question practice
* Browser navigation
* Image handling

Question data should NOT be hardcoded into `app.js`.

## `config.js`

The configuration and taxonomy file.

This is the main file to edit when introducing new topics or subtopics.

Example:

```javascript
const MCQ_CONFIG = {
    app: {
        name: "EEE MCQ Vault",
        version: "1.0"
    },

    topics: [

        {
            id: "ET",
            name: "Electronics",
            icon: "⚡",
            folder: "electronics",

            subtopics: [
                {
                    id: "BJT",
                    name: "BJT",
                    file: "bjt.json"
                }
            ]
        }

    ]
};
```

# 5. Taxonomy

Taxonomy is used to create permanent question IDs.

The basic ID format is:

```text
TOPIC-SUBTOPIC-NUMBER
```

Example:

```text
ET-BJT-001
ET-BJT-002
ET-OA-001
EM-TR-001
CS-BASIC-001
```

## Current Topic Codes

| Topic               | Code |
| ------------------- | ---- |
| Electronics         | ET   |
| Electrical Machines | EM   |
| Control Systems     | CS   |

Future topics may include:

| Topic               | Suggested Code |
| ------------------- | -------------- |
| Power Systems       | PS             |
| Digital Electronics | DE             |
| Power Electronics   | PE             |

Topic codes should remain short and stable.

# 6. Current Subtopic Codes

## Electronics — `ET`

| Subtopic              | Code |
| --------------------- | ---- |
| BJT                   | BJT  |
| Diode & Semiconductor | DIO  |
| FET                   | FET  |
| MOSFET                | MOS  |
| Operational Amplifier | OA   |

Examples:

```text
ET-BJT-001
ET-DIO-001
ET-FET-001
ET-MOS-001
ET-OA-001
```

## Electrical Machines — `EM`

| Subtopic              | Code |
| --------------------- | ---- |
| Transformer           | TR   |
| DC Generator          | DCG  |
| DC Motor              | DCM  |
| Induction Motor       | IM   |
| Synchronous Motor     | SM   |
| Synchronous Generator | SG   |

Examples:

```text
EM-TR-001
EM-DCG-001
EM-DCM-001
EM-IM-001
EM-SM-001
EM-SG-001
```

## Control Systems — `CS`

| Subtopic       | Code  |
| -------------- | ----- |
| Basic Concepts | BASIC |

Example:

```text
CS-BASIC-001
```

# 7. Adding a New Subtopic

Suppose a new subtopic called `Transistor Biasing` is required under Electronics.

First create:

```text
data/electronics/biasing.json
```

Then add it to `config.js`:

```javascript
{
    id: "BIAS",
    name: "Transistor Biasing",
    file: "biasing.json"
}
```

The website will automatically generate the new subtopic button.

No changes to `index.html` are required.

# 8. Adding a New Topic

Suppose Power Systems is being added.

Create:

```text
data/power/
```

Then create the required JSON files.

Add a topic to `config.js`:

```javascript
{
    id: "PS",
    name: "Power Systems",
    icon: "🔌",
    folder: "power",

    subtopics: [
        {
            id: "TL",
            name: "Transmission Line",
            file: "transmission.json"
        }
    ]
}
```

The dashboard will automatically generate the Power Systems card.

# 9. Standard Question JSON Format

Every question must follow this structure:

```json
{
    "id": "ET-BJT-001",
    "question": "Which region of a BJT is used for amplification?",
    "options": [
        "Cut-off",
        "Active",
        "Saturation",
        "Breakdown"
    ],
    "answer": 1,
    "explanation": "A BJT is normally operated in the active region for amplification.",
    "image": null
}
```

# 10. JSON Field Specification

Each question contains exactly six fields.

| Field         | Type        | Description                  |
| ------------- | ----------- | ---------------------------- |
| `id`          | String      | Permanent unique question ID |
| `question`    | String      | Question text                |
| `options`     | Array       | Exactly four options         |
| `answer`      | Number      | Correct option index, 0–3    |
| `explanation` | String      | Explanation of the answer    |
| `image`       | String/null | Image path or `null`         |

# 11. Answer Indexing

The answer uses zero-based indexing.

```text
Option A → 0
Option B → 1
Option C → 2
Option D → 3
```

Example:

```json
"options": [
    "10 V",
    "20 V",
    "30 V",
    "40 V"
],
"answer": 2
```

This means:

```text
Correct answer = Option C
```



# 12. Images

The `image` field is reserved for circuit diagrams, graphs, figures, or other images required to understand a question.

For questions without an image:

```json
"image": null
```

Images should be stored in:

```text
data/images/
```

Use the question ID as the image filename whenever possible.

Example:

```text
data/images/ET-BJT-087.png
```

The JSON should contain:

```json
"image": "data/images/ET-BJT-087.png"
```

This keeps image management simple and prevents broken references when questions are reorganized.



# 13. Permanent Question IDs

Question IDs must be unique and permanent.

Example:

```text
ET-BJT-001
ET-BJT-002
ET-BJT-003
```

If a question is deleted later, DO NOT renumber the remaining questions.

For example, if `ET-BJT-002` is removed:

```text
ET-BJT-001
ET-BJT-003
ET-BJT-004
```

is perfectly acceptable.

The ID identifies the question permanently.



# 14. Question Bank Workflow

The intended workflow is:

```text
Book
  ↓
Scan
  ↓
PDF
  ↓
AI conversion
  ↓
JSON validation
  ↓
Question bank
  ↓
Practice
```

Recommended workflow:

1. Scan a small section of a book.
2. Convert it using the master AI prompt below.
3. Check the generated JSON.
4. Add it to the appropriate JSON file.
5. Open the website.
6. Practice the questions.

Small batches are recommended because they make errors easier to find.

# 15. Master PDF → JSON Conversion Prompt

The following prompt is the standard conversion prompt for EEE MCQ Vault.

It can be used with Gemini, ChatGPT, or another capable AI model.

## MASTER PROMPT

```text
# EEE MCQ Vault PDF → JSON Converter

Convert the uploaded Electrical & Electronics Engineering MCQs into the standard EEE MCQ Vault JSON format.

The uploaded document may contain scanned book pages, OCR text, MCQs, answer keys, explanations, diagrams, equations, or other textbook material.

Your task is to extract the MCQs and convert them into valid JSON.

--------------------------------------------------
OUTPUT FORMAT
--------------------------------------------------

Return ONLY valid JSON.

The output must be a JSON array.

Do not include:

- Markdown
- Code fences
- Comments
- Explanations outside the JSON
- Introductory text
- Closing text

Each question must contain exactly these six fields:

- id
- question
- options
- answer
- explanation
- image

Use this structure:

{
    "id": "ET-BJT-001",
    "question": "Question text",
    "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
    ],
    "answer": 0,
    "explanation": "Explanation.",
    "image": null
}

--------------------------------------------------
QUESTION ID
--------------------------------------------------

I will provide the topic/subtopic and starting question ID.

Example:

Topic/Subtopic:
BJT

Starting ID:
ET-BJT-001

Continue the numbering sequentially:

ET-BJT-001
ET-BJT-002
ET-BJT-003
ET-BJT-004

Never skip a number unless I explicitly instruct you to do so.

Question IDs must be unique.

--------------------------------------------------
QUESTION TEXT
--------------------------------------------------

Preserve the original question wording as closely as possible.

Correct obvious OCR errors when the intended meaning is clear.

Preserve:

- Engineering terminology
- Mathematical notation
- Units
- Symbols
- Greek letters
- Subscripts
- Superscripts
- Variables
- Circuit terminology

Examples:

Ω
μ
β
α
V_BE
I_C
R_L

Do not unnecessarily rewrite or simplify the question.

--------------------------------------------------
OPTIONS
--------------------------------------------------

Every question must contain exactly four options.

Use this structure:

"options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
]

Remove option labels such as:

A.
B.
C.
D.

from the actual option text unless they are genuinely part of the answer.

--------------------------------------------------
ANSWER
--------------------------------------------------

The "answer" field must contain the zero-based index of the correct option.

Use:

Option A → 0
Option B → 1
Option C → 2
Option D → 3

Example:

"answer": 1

means Option B is correct.

Determine the correct answer using the source material whenever possible.

If the answer cannot be determined reliably, DO NOT guess.

Flag the question for review instead.

--------------------------------------------------
EXPLANATION
--------------------------------------------------

Provide a concise explanation of why the correct answer is correct.

The explanation should be as long as necessary to properly explain the answer, but MUST NOT exceed 5 sentences.

For simple factual questions, one sentence is enough.

For numerical, conceptual, or calculation-based questions, use additional sentences when necessary.

Do not add unnecessary information.

Do not invent facts that are not supported by the question or established engineering knowledge.

--------------------------------------------------
IMAGES
--------------------------------------------------

Set:

"image": null

for questions that do not require an image.

If a question genuinely depends on a diagram, circuit, graph, waveform, or other visual information, identify it clearly for later extraction.

Do not invent an image path.

If the source image is available and can be extracted, use the future image filename based on the question ID:

"image": "data/images/ET-BJT-001.png"

If the image cannot be extracted automatically, use:

"image": null

and add a review note outside the JSON is NOT allowed.

In that situation, the question should instead be flagged for manual review before final JSON generation.

--------------------------------------------------
OCR HANDLING
--------------------------------------------------

The source may contain OCR errors.

Correct obvious errors when the intended text is clear.

Examples:

"translstor" → "transistor"

"10 kO" → "10 kΩ"

"VBE" → "V_BE" when appropriate

Do NOT guess when the source is genuinely unreadable.

If a critical part of the question, option, equation, or answer is unclear, flag the question for review rather than inventing information.

--------------------------------------------------
DUPLICATES
--------------------------------------------------

Do not intentionally create duplicate questions from the same source passage.

However, do not remove questions merely because they test a similar concept.

Different questions testing the same engineering concept may be retained.

--------------------------------------------------
VALIDATION BEFORE OUTPUT
--------------------------------------------------

Before returning the JSON, internally verify every question.

Check:

1. The JSON is valid.
2. Every question has exactly six required fields.
3. Every question has a unique ID.
4. IDs are sequential.
5. Every question has exactly four options.
6. Every answer value is between 0 and 3.
7. The answer index corresponds to the correct option.
8. No required field is missing.
9. The explanation is no more than 5 sentences.
10. Obvious OCR errors have been corrected.
11. Engineering symbols and units are preserved.
12. No information has been invented.
13. Image references are valid or null.
14. The question is actually an MCQ.

--------------------------------------------------
FINAL OUTPUT
--------------------------------------------------

Return ONLY the JSON array.

Do not return anything before or after the JSON.

If the source contains questions that cannot be reliably converted, stop and identify those questions for manual review rather than silently generating incorrect data.
```

# 16. Recommended Conversion Instructions

When using the master prompt, provide the AI with:

```text
Subtopic: BJT
Starting ID: ET-BJT-006
```

Then upload the PDF.

For example:

```text
Subtopic: BJT
Starting ID: ET-BJT-006

Convert the uploaded PDF using the EEE MCQ Vault master prompt.
```

# 17. JSON Quality Checklist

Before adding a generated JSON batch to the project, verify:

* [ ] Valid JSON
* [ ] Correct topic/subtopic ID
* [ ] IDs are unique
* [ ] IDs continue from the previous batch
* [ ] Exactly four options per question
* [ ] `answer` is 0–3
* [ ] Correct answer matches the answer index
* [ ] Explanation is ≤5 sentences
* [ ] `image` is present
* [ ] `image` is `null` when no image is required
* [ ] No obvious OCR errors
* [ ] No invented information

# 18. Example Question Bank

Example `data/electronics/bjt.json`:

```json
[
    {
        "id": "ET-BJT-001",
        "question": "Which region of a BJT is used for amplification?",
        "options": [
            "Cut-off",
            "Active",
            "Saturation",
            "Breakdown"
        ],
        "answer": 1,
        "explanation": "A BJT is normally operated in the active region for signal amplification.",
        "image": null
    }
]
```

More questions are simply added to the same JSON array.

# 19. Maintenance Rules

The project intentionally has very low maintenance requirements.

### Adding questions

Usually only add or modify:

```text
data/<topic>/<subtopic>.json
```

### Adding a new subtopic

Modify:

```text
config.js
```

and create the corresponding JSON file.

### Adding a new topic

Modify:

```text
config.js
```

and create the required data folder and JSON files.

### Normal question additions should NOT require changes to:

```text
index.html
style.css
app.js
```

# 20. Design Principle

The website is the engine.

The JSON files are the question bank.

The configuration file is the taxonomy.

The AI conversion prompt is the content pipeline.

Together:

```text
                 EEE MCQ VAULT
                       │
          ┌────────────┼────────────┐
          │            │            │
       Engine       Taxonomy      Content
       app.js       config.js     JSON
          │            │            │
          └────────────┼────────────┘
                       │
                   Practice
```

The goal is to spend time building the question bank and preparing for EEE jobs, not maintaining the website.

# 21. Version

Current project version:

```text
EEE MCQ Vault v1.0.1
```

Status:

```text
Core functionality: Stable
Mobile UI: Stable
Question format: Stable
Taxonomy system: Stable
Content pipeline: Established
```

Future development should prioritize the question bank over adding unnecessary application features.
