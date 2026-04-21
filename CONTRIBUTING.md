# Contributing to AIC Exam Portal

This guide covers the three areas most likely to need extension: the **admin CSV export format**, the **fee tier constants**, and the **question bank structure**. Read this before touching any of those areas — the portal's pages share a common data contract through `localStorage` and if you break the schema, the admin dashboard and results page will silently show wrong data.

---

## Table of Contents

1. [Data Contract — localStorage](#data-contract--localstorage)
2. [CSV Export Format](#csv-export-format)
   - [Registrations CSV](#registrations-csv)
   - [Exam Results CSV](#exam-results-csv)
   - [Discount-Filtered CSV](#discount-filtered-csv)
   - [Combined Report CSV](#combined-report-csv)
3. [Fee Tier Constants](#fee-tier-constants)
   - [Adding a New Age Group](#adding-a-new-age-group)
   - [Changing a Fee](#changing-a-fee)
   - [Changing a Discount Tier](#changing-a-discount-tier)
4. [Question Bank Structure](#question-bank-structure)
   - [Question Object Schema](#question-object-schema)
   - [Adding Questions to an Existing Group](#adding-questions-to-an-existing-group)
   - [Adding a Brand-New Age Group](#adding-a-brand-new-age-group)
   - [Question Writing Rules](#question-writing-rules)
5. [Safe Change Checklist](#safe-change-checklist)

---

## Data Contract — localStorage

All portal data is stored in the browser's `localStorage` under two keys, defined in `js/app.js`:

```js
const AIC_KEYS = {
  REGISTRATIONS: 'aic_registrations',   // Array of registration objects
  RESULTS:       'aic_exam_results',     // Array of result objects
  SESSION:       'aic_current_session'   // Object for active exam session
};
```

Every page — `otp.html`, `exam.html`, `results.html`, and `admin.html` — reads and writes these same keys. **Never rename them.** If you add a field to either array's objects, it is additive and safe. If you remove or rename a field, every page that reads it must be updated at the same time.

---

## CSV Export Format

The admin dashboard exports four CSV files. The column order is fixed — do not reorder columns without updating `admin.html`'s export functions simultaneously.

### Registrations CSV

**Filename:** `registrations_all.csv` (or `registrations_<GroupName>.csv` for a filtered export)

| # | Column | Source field | Notes |
|---|--------|-------------|-------|
| 1 | Index Number | `r.indexNumber` | Format: `AIC-2026-XXXX` |
| 2 | First Name | `r.firstName` | Student's first name |
| 3 | Last Name | `r.lastName` | Student's last name |
| 4 | DOB | `r.dob` | ISO date string `YYYY-MM-DD` |
| 5 | Gender | `r.gender` | `"Male"` or `"Female"` |
| 6 | Age Group | `GROUP_NAMES[r.ageGroup]` | Human-readable label (e.g. `"AI Builders (Ages 10–12)"`) |
| 7 | School | `r.school` | Student's school name |
| 8 | Grade | `r.grade` | e.g. `"Grade 6"` |
| 9 | Parent Name | `r.parentName` | Full name of parent/guardian |
| 10 | Relation | `r.parentRelation` | e.g. `"Father"`, `"Mother"`, `"Guardian"` |
| 11 | Parent NIC | `r.parentNIC` | Validated Sri Lanka NIC (old or new format) |
| 12 | Mobile | `r.parentPhone` | 10-digit local format `07XXXXXXXX` |
| 13 | Email | `r.parentEmail` | Parent/guardian email |
| 14 | Address | `r.address` | Street address |
| 15 | City | `r.city` | City name |
| 16 | District | `r.district` | Sri Lanka district |
| 17 | Exam Status | `r.examStatus` | `"pending"` or `"completed"` |
| 18 | Registered At | `r.registeredAt` | ISO datetime string (UTC) |

**Registration object shape (as stored in `aic_registrations`):**

```json
{
  "indexNumber":   "AIC-2026-0001",
  "firstName":     "Kavinda",
  "lastName":      "Perera",
  "dob":           "2020-03-15",
  "gender":        "Male",
  "ageGroup":      "56",
  "grade":         "Grade 1",
  "school":        "Richmond College",
  "parentName":    "Nimal Perera",
  "parentRelation": "Father",
  "parentNIC":     "815234567V",
  "parentPhone":   "0771234567",
  "parentEmail":   "nimal.perera@gmail.com",
  "address":       "No. 12 Galle Rd",
  "city":          "Colombo",
  "district":      "Colombo",
  "examStatus":    "pending",
  "registeredAt":  "2026-04-21T15:30:00.000Z"
}
```

---

### Exam Results CSV

**Filename:** `exam_results.csv`

| # | Column | Source field | Notes |
|---|--------|-------------|-------|
| 1 | Index Number | `r.indexNumber` | Links to registration record |
| 2 | Student Name | `r.name` | `firstName + ' ' + lastName` |
| 3 | Age Group | `GROUP_NAMES[r.ageGroup]` | Human-readable label |
| 4 | Score % | `r.score` | Integer 0–100 |
| 5 | Correct | `r.correct` | Number of correct answers |
| 6 | Total Questions | `r.total` | Total questions in that group's bank |
| 7 | Time Taken (s) | `r.timeTaken` | Seconds elapsed (max 1800 = 30 min) |
| 8 | Scholarship Tier | `tierLabel(r.discount)` | `"Gold"`, `"Silver"`, `"Bronze"`, or `"No Discount"` |
| 9 | Base Fee (LKR) | `r.baseFee` | Integer, from `AGE_GROUP_FEES` at time of exam |
| 10 | Discount % | `r.discount` | Integer: `70`, `60`, `50`, or `0` |
| 11 | Discount Amount (LKR) | `r.discountAmt` | `Math.round(baseFee * discount / 100)` |
| 12 | Payable Fee (LKR) | `r.payableFee` | `baseFee - discountAmt` |
| 13 | Submitted At | `r.submittedAt` | ISO datetime string (UTC) |

**Result object shape (as stored in `aic_exam_results`):**

```json
{
  "indexNumber":  "AIC-2026-0001",
  "name":         "Kavinda Perera",
  "ageGroup":     "56",
  "score":        85,
  "correct":      13,
  "total":        15,
  "timeTaken":    742,
  "discount":     70,
  "baseFee":      25000,
  "discountAmt":  17500,
  "payableFee":   7500,
  "submittedAt":  "2026-04-21T16:05:00.000Z"
}
```

> ⚠️ `baseFee` is snapshotted at exam submission time — it reflects the fee that was active when the student sat the exam. Do not recalculate it from the current `AGE_GROUP_FEES` constant after the fact.

---

### Discount-Filtered CSV

**Filename:** `results_Gold.csv` / `results_Silver.csv` / `results_Bronze.csv`

Subset of the Results CSV with 7 columns: Index Number, Student Name, Age Group, Score %, Base Fee (LKR), Discount %, Payable Fee (LKR).

---

### Combined Report CSV

**Filename:** `combined_report.csv`

Merges registration + result data, joined on `indexNumber`. Contains 18 columns:

Index Number, Student Name, Age Group, DOB, Gender, School, District, Parent Name, Parent NIC, Mobile, Email, Exam Status, Score %, Scholarship Tier, Base Fee (LKR), Discount %, Payable Fee (LKR), Submitted At.

Students who registered but have not yet sat the exam will have empty values for the last six columns.

---

## Fee Tier Constants

All fee and group data lives in **`js/app.js`**. There are three objects and one function — they must always be kept in sync with each other.

```js
// 1. The canonical fee map — keyed by age group identifier
const AGE_GROUP_FEES = {
  '56':   25000,  // Ages 5–6  : Tiny Explorers
  '79':   40000,  // Ages 7–9  : Little Explorers
  '1012': 50000,  // Ages 10–12: AI Builders
  '1315': 65000,  // Ages 13–15: AI Innovators
  '1617': 80000   // Ages 16–17: AI Pioneers
};

// 2. Full display names — used in CSV exports and result page
const AGE_GROUP_NAMES = {
  '56':   'Tiny Explorers (Ages 5–6)',
  '79':   'Little Explorers (Ages 7–9)',
  '1012': 'AI Builders (Ages 10–12)',
  '1315': 'AI Innovators (Ages 13–15)',
  '1617': 'AI Pioneers (Ages 16–17)'
};

// 3. Short labels — used in charts and UI badges
const AGE_GROUP_LABELS = {
  '56':   'Tiny Explorers',
  '79':   'Little Explorers',
  '1012': 'AI Builders',
  '1315': 'AI Innovators',
  '1617': 'AI Pioneers'
};

// 4. Discount logic
function getDiscount(scorePercent) {
  if (scorePercent >= 80) return 70;   // Gold
  if (scorePercent >= 70) return 60;   // Silver
  if (scorePercent >= 60) return 50;   // Bronze
  return 0;                            // No discount
}
```

`admin.html` also has its own local copies named `GROUP_FEES` and `GROUP_NAMES` — **if you change `AGE_GROUP_FEES` or names in `app.js`, you must make the identical change in `admin.html`** or the admin dashboard will show stale values.

---

### Changing a Fee

1. Update the value in `AGE_GROUP_FEES` in `js/app.js`
2. Find `GROUP_FEES` in `admin.html` and update the same key there
3. Upload both files to Namecheap (`public_html/exam/`) and push to GitHub
4. Students who already submitted results will retain their snapshotted `baseFee` — only new exam submissions will use the updated fee

---

### Adding a New Age Group

A new age group touches **six files**. Do all of these or the portal will break:

| File | What to add |
|------|-------------|
| `js/app.js` | New key in `AGE_GROUP_FEES`, `AGE_GROUP_NAMES`, `AGE_GROUP_LABELS` |
| `js/questions.js` | New key in `QUESTION_BANK` with an array of question objects |
| `js/i18n.js` | New group label translations in all three languages (EN / SI / TA) |
| `index.html` | New `<option>` in the age group `<select>` element |
| `exam.html` | Ensure the question count for the new key is handled (it reads from `QUESTION_BANK`) |
| `admin.html` | New key in `GROUP_FEES` and `GROUP_NAMES`; add the group to any hardcoded chart labels |

**Age group key format:** Concatenate the two age boundary numbers. Examples: `56` (5–6), `1012` (10–12), `1820` (18–20). Keep it short — this key is stored in every registration and result record permanently.

---

### Changing a Discount Tier

Edit `getDiscount()` in `js/app.js`. The function must always return an integer (0, 50, 60, or 70 by default). If you add a new tier value (e.g. 40% for a new band), also update:

- `tierLabel()` in `admin.html` — maps the integer to a display string (`"Gold"`, `"Silver"`, etc.)
- The fee summary panel in `admin.html` which lists tiers by their hardcoded discount values
- `js/i18n.js` if tier names are translated and displayed to students

---

## Question Bank Structure

All questions live in `js/questions.js` in a single object `QUESTION_BANK`, keyed by age group identifier.

### Question Object Schema

Every question is a plain object with exactly four fields:

```js
{
  q:    "What does a robot use to move?",           // Question text (string)
  opts: ["Wings","Motors and wheels","Pencils","Water"], // Exactly 4 answer options (array of 4 strings)
  ans:  "B",                                        // Correct answer: "A", "B", "C", or "D"
  topic:"Robotics"                                  // Topic label (string) — used for analytics
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `q` | string | ✅ | Question text. No trailing `?` inconsistency — pick a style and be consistent within a group. |
| `opts` | array[4] | ✅ | **Always exactly 4 strings.** Index 0 = A, 1 = B, 2 = C, 3 = D. Never 3, never 5. |
| `ans` | string | ✅ | Must be `"A"`, `"B"`, `"C"`, or `"D"` — uppercase, single character. Never the answer text itself. |
| `topic` | string | ✅ | Used to group questions in future analytics. Match existing topic names where possible (see below). |

**`ans` refers to position, not content.** If `opts[1]` is the correct answer, `ans` is `"B"` (index 1 = letter B). Double-check this — it is the most common source of bugs when adding questions.

---

### Existing Topic Labels

Use these exact strings when adding questions to maintain clean analytics grouping:

| Topic | Used in groups |
|-------|---------------|
| `AI Basics` | All groups |
| `AI in Life` | All groups |
| `Coding` | All groups |
| `Computers` | 5–6, 7–9, 10–12 |
| `Data` | 7–9, 10–12, 13–15, 16–17 |
| `Ethics` | 10–12, 13–15, 16–17 |
| `Machine Learning` | 10–12, 13–15, 16–17 |
| `Technology` | All groups |
| `Patterns` | 5–6 |
| `Robotics` | 5–6, 7–9 |
| `AI History` | 13–15, 16–17 |

Only introduce a new topic label if the content genuinely cannot be mapped to an existing one.

---

### Question Counts Per Group

The exam timer and scoring logic derive total question count from `QUESTION_BANK[ageGroup].length`. The current counts are:

| Group key | Age range | Group name | Questions |
|-----------|-----------|------------|-----------|
| `56` | 5–6 | Tiny Explorers | 15 |
| `79` | 7–9 | Little Explorers | 20 |
| `1012` | 10–12 | AI Builders | 30 |
| `1315` | 13–15 | AI Innovators | 40 |
| `1617` | 16–17 | AI Pioneers | 40 |

The exam randomly selects **all questions** from the bank and shuffles them — there is no subsampling. If you add 5 questions to the `1012` bank, students in that group will now sit 35 questions. **Adjust the count only intentionally** and update `admin.html`'s sample data generator (`qTotal` map) to match.

---

### Adding Questions to an Existing Group

1. Open `js/questions.js`
2. Find the correct group array (e.g. `QUESTION_BANK["1012"]`)
3. Append new question objects to the end of the array — do not insert in the middle (makes diffs harder to review)
4. Verify: `opts` has exactly 4 items, `ans` is `"A"`/`"B"`/`"C"`/`"D"`, the letter maps to the correct `opts` index
5. Test in browser — open `exam.html` with that age group selected and confirm the new questions appear and score correctly

---

### Adding a Brand-New Age Group

1. Add the new key to `QUESTION_BANK` in `js/questions.js`:

```js
QUESTION_BANK["1820"] = [
  {
    q:    "Your question here?",
    opts: ["Option A", "Option B", "Option C", "Option D"],
    ans:  "B",
    topic:"AI Basics"
  },
  // ... more questions
];
```

2. Follow the **six-file checklist** in [Adding a New Age Group](#adding-a-new-age-group) above.

---

### Question Writing Rules

These rules exist to prevent scoring bugs and keep exams fair across the three languages (English, Sinhala, Tamil):

- **One unambiguously correct answer.** The other three options must be clearly incorrect — no trick questions or near-synonyms that could be argued correct.
- **No answer-position bias.** Distribute correct answers across A, B, C, and D. If you write 10 questions and all answers are `"B"`, that is wrong.
- **Age-appropriate language.** Ages 5–6 use simple vocabulary and concrete examples. Ages 16–17 use technical terminology. Do not mix levels within a group.
- **Options must be parallel.** If one option is a noun phrase, all four should be noun phrases. Mixed grammatical forms confuse translators and students.
- **Keep `opts` short.** Aim for under 10 words per option. Long options break the mobile layout.
- **No Sri Lanka-specific cultural references** in technical questions — the programme issues certificates from TWL UK and aims for international-standard content.
- **Topic coverage.** Each group's question bank should cover at least 4 different topics. Avoid 80% of questions from a single topic.

---

## Safe Change Checklist

Before submitting any change, verify:

- [ ] `AGE_GROUP_FEES` in `app.js` and `GROUP_FEES` in `admin.html` are identical
- [ ] `AGE_GROUP_NAMES` in `app.js` and `GROUP_NAMES` in `admin.html` are identical
- [ ] Every question object has exactly 4 `opts` and `ans` is `"A"/"B"/"C"/"D"`
- [ ] `ans` letter correctly maps to the right option (A=index 0, B=index 1, C=index 2, D=index 3)
- [ ] No Notify.lk credentials (`qBrNNQ2qe7iPvqQRphWi`, `31549`) appear in any `.js` or `.html` file
- [ ] `otp-proxy.php` is **not** committed to GitHub (credentials live on Namecheap only)
- [ ] CSV column order in `admin.html` matches the field order documented above
- [ ] If a new age group was added, all six files were updated
- [ ] Files uploaded to Namecheap `public_html/exam/` AND pushed to GitHub (keeps both in sync)

---

## Questions

- **Programme:** AI Generation Programme 2026
- **Director:** Gamage Niranjan Nanayakkara, TECSRILANKA WORLDWIDE PVT LTD
- **Email:** ontransitions@gmail.com
- **GitHub Org:** [github.com/tecsrilankaworldwide](https://github.com/tecsrilankaworldwide)
