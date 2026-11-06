# LSR Student Voice Platform Specification (`lsr.chrysalis.world/student/`)

## 1. Overview & Architectural Role

The **LSR Student Voice Platform** (`https://lsr.chrysalis.world/student/`) is the dedicated web-based speech and language learning environment for learners. While teachers manage curriculum and administrative workflows on `learning.chrysalis.world`, students use `lsr.chrysalis.world` for **high-fidelity Speech AI, Audio Comprehension, Oral Reading Fluency (ORF), and Vocabulary Mastery**.

---

## 2. Real-Time Inspection & Verified Payloads

### 2.1 Student Session Profile
- **Candidate ID**: `377431` (mapped to student Anup Sharma)
- **Tenant ID**: `chrysalis-fresh` (Achariya School tenant scope)
- **Grade**: `G5` (Grade 5 - "Confident Reader")
- **Blurb**: *"Reading on their own and explaining their thinking"*

---

## 3. The 5 Activity Formats in LSR Level Test

The Grade 5 Diagnostic Level Test consists of **10 sequential activities** structured according to a balanced psychometric blueprint:

| # | Activity Type | Template Type | Format | Skill Assessed | Media & Input Assets |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **01** | **Listening Comprehension** | `listening-lsr` | `mcq` | Listening | Pre-recorded high-fidelity audio story; multiple-choice question options. |
| **02** | **Speech Response** | `speaking-lsr` | `speaking` | Speaking & Pronunciation | Prompt audio (`prompt.mp3`); microphone capture via WebAudio (`.webm` 16kHz mono). |
| **03** | **Reading Comprehension** | `reading-comprehension-lsr` | `mcq` | Comprehension | Passage text (e.g. *"Aisha loved her mornings..."*); 4-choice MCQ options. |
| **04** | **Oral Reading Fluency (ORF)** | `reading-fluency-lsr` | `read_aloud` | Fluency & WCPM | Target passage (e.g. *"The evening was dark and quiet..."*); real-time ASR alignment. |
| **05** | **Picture-Prompt Speaking** | `picture-describe-speak-lsr` | `speaking` | Expressive Speaking | Scene image + audio prompt; student speaks to describe the visual scene. |
| **06** | **Reading Comprehension** | `reading-comprehension-lsr` | `mcq` | Comprehension | Narrative text (e.g. *"Meenakshi loved her job at the village library..."*); factual comprehension. |
| **07** | **Oral Reading Fluency (ORF)** | `reading-fluency-lsr` | `read_aloud` | Fluency & WCPM | Science passage (e.g. *"The large planet turns..."*); phoneme accuracy scoring. |
| **08** | **Speech Response** | `speaking-lsr` | `speaking` | Speaking & Articulation | Conversational prompt audio; student records personal response. |
| **09** | **Oral Reading Fluency (ORF)** | `reading-fluency-lsr` | `read_aloud` | Fluency & WCPM | Informational passage (e.g. *"The big blue planet spins around..."*); speed & prosody tracking. |
| **10** | **Vocabulary Mastery** | `vocab-mcq-lsr` | `vocab_mcq` | Lexical Knowledge | Curated vocabulary items with contextual images from LSR Dictionary Manifest. |

---

## 4. Backend API Contract & Data Payloads

### 4.1 Diagnostic Test Blueprint (`GET /api/activity/lsr/level-test/G5`)
```json
{
  "grade": "G5",
  "gradeId": 15,
  "gradeLabel": "Grade 5",
  "label": "Confident Reader",
  "labelBlurb": "reading on their own and explaining their thinking",
  "blueprint": {
    "vocab": 2,
    "speaking": 3,
    "listening": 1,
    "reading_fluency": 3,
    "reading_comprehension": 2
  },
  "total": 10,
  "counts": {
    "listening": 1,
    "speaking": 3,
    "reading_comprehension": 2,
    "reading_fluency": 3
  },
  "themes": [
    { "number": 1, "title": "Learning/Work: Work" },
    { "number": 2, "title": "Self: Identity" },
    { "number": 3, "title": "Stories/Comms: Media" },
    { "number": 4, "title": "Home: Society" },
    { "number": 5, "title": "Nature: Planet" },
    { "number": 6, "title": "Play: Leisure" }
  ]
}
```

### 4.2 Speech Evaluation & Audio Recording Storage (`GET /api/activity/lsr/result`)
```json
{
  "results": [
    {
      "taskId": "14546",
      "score": 53,
      "format": "speaking",
      "submittedAt": "2026-11-06T06:44:59.619Z",
      "details": {
        "activityType": "speaking",
        "template_type": "speaking-lsr",
        "feedback": "Nice try — keep practising your speaking.",
        "publicUrl": "https://66e44600806a002436a2c5b4a7fddd26.r2.cloudflarestorage.com/chrysalis-recordings/audio/lsr/chrysalis-fresh/377431/14546/2026-11-06T06-44-51-326128Z.webm"
      }
    }
  ]
}
```

### 4.3 Longitudinal Level Test Diagnostic Card (`GET /api/activity/lsr/level-test-result`)
```json
{
  "status": "ok",
  "candidateId": "377431",
  "grade": "G5",
  "snapshot": null,
  "sittings": 0,
  "wordsReadWell": [],
  "phonemicAccuracy": null,
  "percentiles": null
}
```

### 4.4 Vocabulary Dictionary Manifest (`GET /api/lsr-dictionary/manifest`)
- Contains thousands of mapped words across elementary grades (PP1 to Grade 5).
- Each word entry includes:
  - Canonical spelling and grade level
  - Real-world photographic WebP images (hosted on Cloudflare R2: `https://pub-d0ad8fe87fcc43b1884b8f5f5d070ed3.r2.dev/lsr-dictionary/{word}.webp`)
  - Attribution metadata (Pexels / Unsplash licenses)
  - Phonetic pronunciation guides

---

## 5. Storage & Streaming Infrastructure

- **Audio Asset Delivery**: Cloudflare R2 public distribution bucket (`https://pub-87c286c308d64a72a9cbe93ee95f7696.r2.dev/audio/`).
- **Student Audio Uploads**: Secured S3-compatible presigned upload pipeline storing student `.webm` microphone recordings directly to Cloudflare R2 storage under tenant paths:
  `/chrysalis-recordings/audio/lsr/{tenantId}/{candidateId}/{taskId}/{timestamp}.webm`.
- **Speech Processing Pipeline**:
  1. Student records audio via WebAudio MediaStream API.
  2. Audio is streamed to storage with presigned credentials.
  3. Cloud acoustic worker evaluates recording against phoneme model and speech rate.
  4. Returns quantitative score (0–100), phonetic breakdown, and qualitative feedback within 2 seconds.

