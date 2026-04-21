// ── AIC Exam Portal — Core Logic ─────────────────────────────────────────────
// Handles: NIC validation, phone/email validation, OTP generation + Notify.lk send,
//          index number generation, localStorage helpers, discount calculation

// ── CONFIGURATION ─────────────────────────────────────────────────────────────
// OTP is sent via a server-side PHP proxy on Namecheap hosting.
// Notify.lk credentials are stored in otp-proxy.php — never in browser JS.
const NOTIFY_CONFIG = {
  PROXY_ENDPOINT: 'https://aigeneration.uk/otp-proxy.php'
};

// ── NIC VALIDATION ─────────────────────────────────────────────────────────────
/**
 * Validates Sri Lanka NIC numbers
 * Old format: 9 digits + V or X  (e.g. 800123456V)
 * New format: 12 digits           (e.g. 199812345678)
 */
function validateNIC(nic) {
  if (!nic) return { valid: false, format: null };
  const clean = nic.trim().toUpperCase();
  // Old NIC: 9 digits + V or X
  if (/^\d{9}[VX]$/.test(clean)) {
    return { valid: true, format: 'old', nic: clean };
  }
  // New NIC: 12 digits
  if (/^\d{12}$/.test(clean)) {
    return { valid: true, format: 'new', nic: clean };
  }
  return { valid: false, format: null };
}

// ── PHONE VALIDATION ──────────────────────────────────────────────────────────
/**
 * Validates Sri Lanka mobile number (10 digits starting with 07)
 */
function validatePhone(phone) {
  const clean = phone.replace(/[\s\-]/g, '');
  return /^07[0-9]{8}$/.test(clean);
}

// ── EMAIL VALIDATION ──────────────────────────────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── OTP GENERATION ────────────────────────────────────────────────────────────
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── INDEX NUMBER GENERATION ───────────────────────────────────────────────────
/**
 * Generates AIC-2026-XXXX format index number
 * @param {number} count — current registration count (0-based)
 */
function generateIndexNumber(count) {
  const num = (count + 1).toString().padStart(4, '0');
  return `AIC-2026-${num}`;
}

// ── NOTIFY.LK SMS SEND ────────────────────────────────────────────────────────
/**
 * Sends OTP via Notify.lk SMS API
 * Falls back to simulation mode if API credentials not configured.
 * Returns { ok: boolean, msg: string, simulated: boolean }
 */
async function sendOTP(phone, otp, studentName) {
  const message = `Dear Parent/Guardian, Your AIC Aptitude Exam OTP for ${studentName} is: ${otp}. Valid for 10 minutes. Do not share. - AI Generation Programme`;

  // Convert SL phone 07XXXXXXXX → 947XXXXXXXX for Notify.lk
  const toNumber = '94' + phone.replace(/^0/, '');

  const proxyEndpoint = NOTIFY_CONFIG.PROXY_ENDPOINT;

  // Simulation mode — if proxy not yet deployed
  if (!proxyEndpoint || proxyEndpoint.includes('YOUR-SUBDOMAIN') || proxyEndpoint.includes('__PROXY')) {
    console.info('[AIC OTP SIMULATION] OTP:', otp, '| Phone:', phone);
    sessionStorage.setItem('aic_otp_simulated', 'true');
    return { ok: true, msg: 'OTP simulated (proxy not yet deployed)', simulated: true };
  }

  try {
    const response = await fetch(proxyEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: toNumber, message })
    });

    const data = await response.json();

    if (data.status === 'success' || data.status === 1 || data.status === '1') {
      return { ok: true, msg: 'OTP sent successfully', simulated: false };
    } else {
      return { ok: false, msg: data.message || 'Failed to send OTP', simulated: false };
    }
  } catch (err) {
    console.error('[AIC OTP ERROR]', err);
    sessionStorage.setItem('aic_otp_simulated', 'true');
    return { ok: true, msg: 'OTP simulated (proxy unreachable)', simulated: true };
  }
}

// ── AGE GROUP BASE FEES ───────────────────────────────────────────────────────
// Ages 5–6: LKR 25,000 | Ages 7–9: LKR 40,000 | Ages 10–12: LKR 50,000 | Ages 13–15: LKR 65,000 | Ages 16–17: LKR 80,000
const AGE_GROUP_FEES = {
  '56':   25000,  // Ages 5–6  : LKR 25,000
  '79':   40000,  // Ages 7–9  : LKR 40,000
  '1012': 50000,  // Ages 10–12: LKR 50,000
  '1315': 65000,  // Ages 13–15: LKR 65,000
  '1617': 80000   // Ages 16–17: LKR 80,000
};

const AGE_GROUP_NAMES = {
  '56':   'Tiny Explorers (Ages 5–6)',
  '79':   'Little Explorers (Ages 7–9)',
  '1012': 'AI Builders (Ages 10–12)',
  '1315': 'AI Innovators (Ages 13–15)',
  '1617': 'AI Pioneers (Ages 16–17)'
};

const AGE_GROUP_LABELS = {
  '56':   'Tiny Explorers',
  '79':   'Little Explorers',
  '1012': 'AI Builders',
  '1315': 'AI Innovators',
  '1617': 'AI Pioneers'
};

function getBaseFee(ageGroup) {
  return AGE_GROUP_FEES[ageGroup] || 40000;
}

// ── DISCOUNT CALCULATION ──────────────────────────────────────────────────────
/**
 * Returns discount percentage based on score
 * 80%+ → 70% off | 70–79% → 60% off | 60–69% → 50% off | below 60% → 0%
 */
function getDiscount(scorePercent) {
  if (scorePercent >= 80) return 70;
  if (scorePercent >= 70) return 60;
  if (scorePercent >= 60) return 50;
  return 0;
}

/**
 * Calculates fee breakdown
 * @param {number} baseFee - annual base fee in LKR
 * @param {number} discountPct - discount percentage (0-70)
 */
function calculateFee(baseFee, discountPct) {
  const discountAmt = Math.round(baseFee * (discountPct / 100));
  return {
    baseFee,
    discountPct,
    discountAmt,
    payableFee: baseFee - discountAmt
  };
}

// ── STORAGE HELPERS ───────────────────────────────────────────────────────────
const AIC_KEYS = {
  REGISTRATIONS: 'aic_registrations',
  RESULTS: 'aic_exam_results',
  SESSION: 'aic_current_session'
};

function getRegistrations() {
  return JSON.parse(localStorage.getItem(AIC_KEYS.REGISTRATIONS) || '[]');
}

function saveRegistrations(regs) {
  localStorage.setItem(AIC_KEYS.REGISTRATIONS, JSON.stringify(regs));
}

function getResults() {
  return JSON.parse(localStorage.getItem(AIC_KEYS.RESULTS) || '[]');
}

function getRegistrationByNIC(nic) {
  return getRegistrations().find(r => r.parentNIC === nic.toUpperCase()) || null;
}

function getResultByIndex(indexNumber) {
  return getResults().find(r => r.indexNumber === indexNumber) || null;
}
