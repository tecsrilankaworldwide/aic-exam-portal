# AIC Exam Portal — AI Generation Programme 2026

> **Live URL:** https://aigeneration.uk/exam/
> **Staging (GitHub Pages):** https://tecsrilankaworldwide.github.io/aic-exam-portal/
> **Marketing Site:** https://aigeneration.uk
> **Certificate Authority:** TWL (The Worldwide Learning), United Kingdom

Sri Lanka's aptitude-based AI curriculum portal for children aged 5–17. Students register, sit a free online MCQ exam, and unlock scholarships of up to 70% off their course fee based on their score.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Age Groups & Fee Tiers](#age-groups--fee-tiers)
3. [Discount Logic](#discount-logic)
4. [OTP & SMS Setup (Notify.lk)](#otp--sms-setup-notifylk)
5. [PHP Proxy — Namecheap Hosting](#php-proxy--namecheap-hosting)
6. [Activating Your Custom Sender ID](#activating-your-custom-sender-id)
7. [Deploying to Namecheap](#deploying-to-namecheap)
8. [Deploying to GitHub Pages (Staging)](#deploying-to-github-pages-staging)
9. [Admin Dashboard](#admin-dashboard)
10. [Trilingual Support](#trilingual-support)
11. [Updating the Portal](#updating-the-portal)

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
├── otp-proxy.php       # Server-side SMS proxy (Notify.lk credentials live here)
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

To update a fee, change the value here and push. GitHub Pages staging auto-deploys within 2 minutes. For the live site, re-upload `app.js` to Namecheap via cPanel File Manager or FTP.

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

### Account Credentials

| Field | Value |
|-------|-------|
| Account email | `ontransitions@gmail.com` |
| User ID | `31549` |
| API Key | `qBrNNQ2qe7iPvqQRphWi` |
| Service ID (current) | `NotifyDEMO` — free demo sender |
| Service ID (after launch) | `AICPROG` — custom sender (see activation below) |

> ⚠️ **Security:** These credentials are stored only in `otp-proxy.php` on the Namecheap server. They are **never** in any browser-side JavaScript file. Do not paste them into `app.js` or commit them to a public repo.

### How the OTP Flow Works

```
Student's browser
    ↓  POST { to: "947XXXXXXXX", message: "Your OTP is 483921" }
otp-proxy.php  (on Namecheap — credentials stored here)
    ↓  POST with user_id + api_key to api.notify.lk
Notify.lk API
    ↓  SMS dispatched
Student's mobile phone (Sri Lanka — Dialog / Mobitel / Hutch)
```

Credentials never touch the browser. The PHP file is the only place they exist.

### Phone Number Format

Notify.lk requires the international format without the `+`:

| Student enters | Sent to Notify.lk |
|----------------|-------------------|
| `0771234567` | `94771234567` |
| `0711234567` | `94711234567` |

This conversion is handled automatically in `otp-proxy.php` and `js/app.js`.

### Sri Lanka Network Coverage

Notify.lk supports all three major networks:

| Network | Number prefix |
|---------|--------------|
| Dialog | `077`, `076`, `075` |
| Mobitel | `071`, `072` |
| Hutch | `078` |

### Getting Your API Credentials (if rotating keys)

1. Log in at [app.notify.lk](https://app.notify.lk) with `ontransitions@gmail.com`
2. Click your name (top right) → **Settings**
3. **API Keys** tab → copy **User ID** and **API Key**
4. Open `otp-proxy.php` on the Namecheap server and update the values there
5. Do **not** put the new values in any `.js` file or commit to GitHub

### Topping Up SMS Credits

- Go to **Payments** in the Notify.lk dashboard
- Minimum top-up: **LKR 500**
- Each OTP SMS costs approximately **LKR 0.50**
- LKR 500 ≈ 1,000 OTP messages
- Current balance: 10 free demo credits (sufficient for initial testing only)

> ✅ **Top up before going live.** The 10 demo credits will be exhausted within the first few student registrations.

### Simulation Mode (Offline Testing)

If `PROXY_ENDPOINT` in `js/app.js` contains `__PROXY` or `YOUR-SUBDOMAIN`, the portal automatically enters simulation mode — OTP delivery is faked in-browser without calling Notify.lk. Useful for UI testing without spending SMS credits.

---

## PHP Proxy — Namecheap Hosting

The production OTP proxy is `otp-proxy.php`, hosted on Namecheap shared hosting at:

```
https://aigeneration.uk/exam/otp-proxy.php
```

### What the File Contains

```php
<?php
// Notify.lk credentials — stored server-side only
$user_id    = '31549';
$api_key    = 'qBrNNQ2qe7iPvqQRphWi';
$service_id = 'NotifyDEMO';   // Change to 'AICPROG' after Sender ID approval

// ... forwards POST { to, message } from browser to Notify.lk API
```

### Namecheap Hosting Details

| Field | Value |
|-------|-------|
| Namecheap username | `TECNINA` |
| cPanel URL | `https://server310.web-hosting.com/cpanel` |
| cPanel username | `aigegnld` |
| Hosting server | `server310.web-hosting.com` |
| FTP host | `server310.web-hosting.com` |
| Portal upload path | `public_html/exam/` |
| Plan | Stellar (shared hosting) |

> 💡 **cPanel access tip:** Log in directly at `https://server310.web-hosting.com/cpanel` from your own browser — cloud-based browser tools may be blocked by IP.

### Uploading Files via cPanel File Manager

1. Go to `https://server310.web-hosting.com/cpanel`
2. Open **File Manager** → navigate to `public_html/exam/`
3. Click **Upload** → select the file(s) to update
4. Confirm overwrite when prompted

### Uploading via FTP

```bash
curl -T otp-proxy.php \
  ftp://server310.web-hosting.com/public_html/exam/otp-proxy.php \
  --user "aigegnld:YOUR_CPANEL_PASSWORD"
```

### Security Features Built Into the Proxy

- ✅ Credentials stored server-side — never visible to the browser
- ✅ Validates Sri Lanka phone format (`94XXXXXXXXX`)
- ✅ Enforces 6-digit OTP pattern in message (prevents bulk SMS abuse)
- ✅ Message capped at 160 characters
- ✅ CORS restricted to `aigeneration.uk` and `tecsrilankaworldwide.github.io`

---

## Activating Your Custom Sender ID

Currently the portal uses `NotifyDEMO` as the SMS sender name. Students see **NOTIFY** on their phone. Before public launch, upgrade to a custom branded sender so students see **AICPROG**.

### Step 1 — Request the Sender ID

1. Log in to [app.notify.lk](https://app.notify.lk)
2. Go to **Settings** → **Sender IDs** → click **Request New Sender ID**
3. Enter `AICPROG` (max 11 characters, letters only)
4. Submit the request

Approval typically takes **1–2 business days**. Notify.lk may ask for a brief description — use:
> "OTP delivery for an AI education programme exam portal in Sri Lanka"

### Step 2 — Update otp-proxy.php

Once approved, open `otp-proxy.php` on the Namecheap server and change this line:

```php
$service_id = 'NotifyDEMO';   // ← change this
```

to:

```php
$service_id = 'AICPROG';      // ← approved custom sender
```

Save the file. No other code changes are needed.

### Step 3 — Verify

Send a test OTP to your own phone. The sender name should now read **AICPROG** instead of NOTIFY.

---

## Deploying to Namecheap

The **live production site** runs on Namecheap shared hosting.

### Full Upload (all files)

Upload every file in this repo into `public_html/exam/` via cPanel File Manager or FTP. Preserve the folder structure:

```
public_html/
└── exam/
    ├── index.html
    ├── otp.html
    ├── exam.html
    ├── pending.html
    ├── results.html
    ├── admin.html
    ├── otp-proxy.php      ← must be here for OTP to work
    ├── css/
    │   └── style.css
    └── js/
        ├── app.js
        ├── questions.js
        └── i18n.js
```

### Single File Update

To update one file (e.g., after a fee change):
1. Edit the file locally
2. Upload only that file via cPanel File Manager → overwrite

### DNS Status

Nameservers are set to `dns1.namecheaphosting.com` / `dns2.namecheaphosting.com`. Full propagation takes 1–24 hours after domain registration. Once live, `https://aigeneration.uk` loads the marketing site and `https://aigeneration.uk/exam/` loads the portal.

---

## Deploying to GitHub Pages (Staging)

The staging URL mirrors the live portal for testing before uploading to production.

**Staging URL:** `https://tecsrilankaworldwide.github.io/aic-exam-portal/`

> ⚠️ OTP on the staging URL will call `otp-proxy.php` on `aigeneration.uk`. If DNS has not propagated yet, OTP will fall back to simulation mode.

**Automatic:** Every `git push` to `main` triggers a rebuild via `.github/workflows/deploy.yml`. Staging updates within 1–2 minutes.

**Manual enable (one time):**
1. Repo → **Settings** → **Pages**
2. Branch: `main`, folder: `/`
3. Save → live at the staging URL above

---

## Admin Dashboard

**Live URL:** https://aigeneration.uk/exam/admin.html
**Staging URL:** https://tecsrilankaworldwide.github.io/aic-exam-portal/admin.html
**Password:** `AIC@2026`

### Features

- KPI cards — total registrations, exams taken, scholarships awarded
- Bar charts — registrations by age group
- Full registrations table with search
- Results table with scores and discount tiers
- Fee summary — total revenue breakdown
- CSV export for registrations and results

### Changing the Password

In `admin.html`, search for `AIC@2026` and replace with your new password. Upload the updated file to Namecheap and push to GitHub.

---

## Trilingual Support

The portal supports **English**, **සිංහල (Sinhala)**, and **தமிழ் (Tamil)**.

Language strings are in `js/i18n.js`. The student selects their language on the registration page — the choice persists across all pages.

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

All code updates follow this pattern:
1. Edit the file locally (or directly in cPanel)
2. Upload the changed file to `public_html/exam/` on Namecheap
3. Push the same change to GitHub (keeps repo in sync as backup)

### Common Updates

**Change a course fee:**
Edit `AGE_GROUP_FEES` in `js/app.js` → upload to Namecheap → push to GitHub

**Add/edit exam questions:**
Edit `js/questions.js` → upload to Namecheap → push to GitHub

**Update discount tiers:**
Edit `getDiscount()` in `js/app.js` → upload to Namecheap → push to GitHub

**Change admin password:**
Find `AIC@2026` in `admin.html` → replace → upload to Namecheap → push to GitHub

**Activate custom Sender ID after approval:**
Edit `$service_id` in `otp-proxy.php` on Namecheap → change `NotifyDEMO` to `AICPROG`
(No GitHub push needed — `otp-proxy.php` must not be committed with live credentials)

**Rotate Notify.lk API key:**
Edit `$api_key` in `otp-proxy.php` on Namecheap only — do not commit to GitHub

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

## Pre-Launch Checklist

See **[GitHub Issue #1](https://github.com/tecsrilankaworldwide/aic-exam-portal/issues/1)** — 35-item testing checklist covering registration, OTP, exam, results, admin, and mobile responsiveness.

See **[GitHub Issue #2](https://github.com/tecsrilankaworldwide/aic-exam-portal/issues/2)** — Notify.lk SMS integration testing across all three Sri Lanka networks.

---

## Support

- **Programme:** AI Generation Programme 2026
- **Certificate:** TWL (The Worldwide Learning), United Kingdom
- **Website:** [aigeneration.uk](https://aigeneration.uk)
- **Director:** Gamage Niranjan Nanayakkara, TECSRILANKA WORLDWIDE PVT LTD
- **Admin email:** ontransitions@gmail.com
- **GitHub Org:** [github.com/tecsrilankaworldwide](https://github.com/tecsrilankaworldwide)
