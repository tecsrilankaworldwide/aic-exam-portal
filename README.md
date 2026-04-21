# AIC Exam Portal — AI Generation Programme 2026

> **Live URL:** https://tecsrilankaworldwide.github.io/aic-exam-portal/  
> **Marketing Site:** https://aigeneration.uk  
> **Certificate Authority:** TWL (The Worldwide Learning), United Kingdom

Sri Lanka's aptitude-based AI curriculum portal for children aged 5–17. Students register, sit a free online MCQ exam, and unlock scholarships of up to 70% off their course fee based on their score.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Age Groups & Fee Tiers](#age-groups--fee-tiers)
3. [Discount Logic](#discount-logic)
4. [OTP & SMS Setup (Notify.lk)](#otp--sms-setup-notifylk)
5. [Cloudflare Worker Proxy](#cloudflare-worker-proxy)
6. [Deploying to GitHub Pages](#deploying-to-github-pages)
7. [Admin Dashboard](#admin-dashboard)
8. [Trilingual Support](#trilingual-support)
9. [Updating the Portal](#updating-the-portal)

---

## Project Structure

```
aic-exam-portal/
├── index.html          # Step 1 — Student registration form
├── otp.html            # Step 2 — SMS OTP verification
├── exam.html           # Step 3 — MCQ aptitude exam (30-min timer)
├── pending.html        # Step 4 — Submission receipt
├── results.html        # Step 5 — Results, discount tier, fee breakdown
├── admin.html          # Admin dashboard (password protected)
├── css/
│   └── style.css       # All styles — light/dark mode, responsive
└── js/
    ├── app.js          # Core logic — validation, OTP, fees, discount
    ├── questions.js    # MCQ question banks for all 5 age groups
    └── i18n.js         # Trilingual strings — English, Sinhala, Tamil
```

---

## Age Groups & Fee Tiers

Five age groups, each with a dedicated question bank and base course fee:

| Key | Age Range | Group Name | Base Fee (LKR) | Questions |
|-----|-----------|------------|----------------|-----------|
| `56` | 5–6 years | Tiny Explorers | 25,000 | 15 MCQs |
| `79` | 7–9 years | Little Explorers | 40,000 | 20 MCQs |
| `1012` | 10–12 years | AI Builders | 50,000 | 30 MCQs |
| `1315` | 13–15 years | AI Innovators | 65,000 | 40 MCQs |
| `1617` | 16–17 years | AI Pioneers | 80,000 | 40 MCQs |

These values are defined in `js/app.js`:

```js
const AGE_GROUP_FEES = {
  '56':   25000,
  '79':   40000,
  '1012': 50000,
  '1315': 65000,
  '1617': 80000
};
```

To update a fee, change the value here and push. GitHub Pages auto-deploys within 2 minutes.

---

## Discount Logic

Scholarships are awarded automatically based on exam score percentage:

| Score | Tier | Discount |
|-------|------|----------|
| 80% and above | 🥇 Gold | 70% off |
| 70% – 79% | 🥈 Silver | 60% off |
| 60% – 69% | 🥉 Bronze | 50% off |
| Below 60% | — | No discount |

**Example:** AI Builders (LKR 50,000) scoring 85% pays **LKR 15,000** (70% off).

Logic in `js/app.js`:

```js
function getDiscount(scorePercent) {
  if (scorePercent >= 80) return 70;
  if (scorePercent >= 70) return 60;
  if (scorePercent >= 60) return 50;
  return 0;
}
```

---

## OTP & SMS Setup (Notify.lk)

OTP is delivered via real SMS to Sri Lanka mobile numbers (+94) using [Notify.lk](https://app.notify.lk).

### Credentials (stored in Cloudflare — never in browser code)

| Field | Value |
|-------|-------|
| User ID | `31549` |
| API Key | Set as Cloudflare Secret `NOTIFY_API_KEY` |
| Service ID | `NotifyDEMO` (upgrade to custom sender after approval) |

### Getting Your Credentials
1. Log in at [app.notify.lk](https://app.notify.lk)
2. Click your name (top right) → **Settings**
3. **API Keys** tab → copy **User ID** and **API Key**
4. **Sender IDs** tab → note your active Sender ID

### Topping Up Credits
- Go to **Payments** in Notify.lk dashboard
- Each SMS costs ~LKR 0.50
- LKR 500 = ~1,000 OTP messages

### Custom Sender ID (for launch)
1. Notify.lk → Settings → Sender IDs → **Request New**
2. Suggested name: `AICPROG` or `AIGENPROG`
3. After approval (~1–2 days), update `NOTIFY_SERVICE_ID` secret in Cloudflare

---

## Cloudflare Worker Proxy

API credentials are **never stored in browser-side code**. They live as encrypted Cloudflare Secrets. The portal calls the Worker proxy, which forwards to Notify.lk server-side.

### Architecture

```
Browser (exam portal)
    ↓  POST { to, message }
Cloudflare Worker (otp-proxy)      ← secrets stored here
    ↓  POST with user_id + api_key
Notify.lk API
    ↓  SMS delivered
Student's phone (+94 XXXXXXXXX)
```

### Deploy the Worker

**Step 1 — Create Cloudflare account**  
Sign up free at [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)

**Step 2 — Create the Worker**
1. Go to **Workers & Pages** → **Create** → **Create Worker**
2. Name: `otp-proxy`
3. Click **Deploy**
4. Click **Edit code** → replace all code with contents of [`worker.js`](https://github.com/tecsrilankaworldwide/otp-proxy/blob/main/worker.js)
5. Click **Deploy** again

**Step 3 — Add Secrets**  
Workers & Pages → `otp-proxy` → **Settings** → **Variables** → **Add secret**:

| Secret Name | Value |
|-------------|-------|
| `NOTIFY_USER_ID` | `31549` |
| `NOTIFY_API_KEY` | your Notify.lk API key |
| `NOTIFY_SERVICE_ID` | `NotifyDEMO` |

**Step 4 — Get your Worker URL**  
It will look like: `https://otp-proxy.YOUR-SUBDOMAIN.workers.dev`

**Step 5 — Update app.js**  
In `js/app.js`, update this line:

```js
const NOTIFY_CONFIG = {
  PROXY_ENDPOINT: 'https://otp-proxy.YOUR-SUBDOMAIN.workers.dev'
};
```

Replace `YOUR-SUBDOMAIN` with your actual Cloudflare subdomain, push, and OTP is live.

### Security Features Built Into the Proxy
- ✅ Only allows requests from `aigeneration.uk` and `tecsrilankaworldwide.github.io`
- ✅ Validates Sri Lanka phone format (`94XXXXXXXXX`)
- ✅ Enforces 6-digit OTP pattern in message (prevents bulk SMS abuse)
- ✅ Message capped at 160 characters

---

## Deploying to GitHub Pages

The portal is hosted free on GitHub Pages from this repo.

**Automatic:** Every `git push` to `main` triggers a rebuild. GitHub Pages updates within 1–2 minutes.

**Manual enable (one time):**
1. Repo → **Settings** → **Pages**
2. Branch: `main`, folder: `/`
3. Save → live at `https://tecsrilankaworldwide.github.io/aic-exam-portal/`

**Custom domain (future):**  
To serve at `exam.aigeneration.uk`, add a CNAME record in Namecheap:

| Type | Host | Value |
|------|------|-------|
| CNAME | exam | `tecsrilankaworldwide.github.io` |

Then set Custom Domain in GitHub Pages settings.

---

## Admin Dashboard

**URL:** `/admin.html`  
**Password:** `AIC@2026`

### Features
- KPI cards — total registrations, exams taken, scholarships awarded
- Bar charts — registrations by age group
- Full registrations table with search
- Results table with scores and discount tiers
- Fee summary — total revenue breakdown
- CSV export for registrations and results

### Changing the Password
In `admin.html`, search for `AIC@2026` and replace with your new password. Push to update.

---

## Trilingual Support

The portal supports **English**, **සිංහල (Sinhala)**, and **தமிழ் (Tamil)**.

Language strings are in `js/i18n.js`. The student selects their language on the registration page — the choice is stored in `localStorage('aic_lang')` and applied across all pages.

To add or update a translation, edit the relevant key in `i18n.js`:

```js
const TRANSLATIONS = {
  en: { welcome: 'Welcome', ... },
  si: { welcome: 'සාදරයෙන් පිළිගනිමු', ... },
  ta: { welcome: 'வரவேற்கிறோம்', ... }
};
```

---

## Updating the Portal

All updates are done by editing files locally and pushing to GitHub. GitHub Pages auto-deploys.

### Common Updates

**Change a course fee:**  
Edit `AGE_GROUP_FEES` in `js/app.js` → push

**Add/edit exam questions:**  
Edit `js/questions.js` → push

**Update discount tiers:**  
Edit `getDiscount()` in `js/app.js` → push

**Change admin password:**  
Find `AIC@2026` in `admin.html` → replace → push

**Update Notify.lk sender name:**  
Update `NOTIFY_SERVICE_ID` secret in Cloudflare dashboard (no code change needed)

---

## Index Number Format

Every registered student receives a unique index number:

```
AIC-2026-0001
AIC-2026-0002
...
```

Generated in `js/app.js` → `generateIndexNumber()`.

---

## Support

- **Programme:** AI Generation Programme 2026
- **Certificate:** TWL (The Worldwide Learning), United Kingdom  
- **Website:** [aigeneration.uk](https://aigeneration.uk)
- **Admin email:** ontransitions@gmail.com
- **GitHub Org:** [github.com/tecsrilankaworldwide](https://github.com/tecsrilankaworldwide)
