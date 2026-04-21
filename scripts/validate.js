#!/usr/bin/env node
/**
 * AIC Exam Portal — Pre-merge Validator
 * ─────────────────────────────────────
 * Run on every pull request via .github/workflows/validate.yml
 *
 * Checks:
 *  1. Parse success    — all four constants extracted cleanly
 *  2. Key consistency  — AGE_GROUP_FEES, QUESTION_BANK, Q_COUNT, and admin.html
 *                        all define exactly the same set of age group keys
 *  3. Fee sync         — AGE_GROUP_FEES (app.js) == GROUP_FEES (admin.html)
 *  4. Name sync        — AGE_GROUP_LABELS (app.js) == GROUP_NAMES (admin.html)
 *  5. Question counts  — each group's bank has >= Q_COUNT questions
 *  6. Question schema  — every question has q / opts[4] / ans (A-D) / topic
 *  7. Answer bias      — warns if > 60% of answers in a group share one letter
 *
 * Exit codes:
 *  0 — all checks passed (warnings are non-blocking)
 *  1 — one or more hard errors found
 */

'use strict';

const fs  = require('fs');
const path = require('path');
const vm  = require('vm');

// ── Paths ─────────────────────────────────────────────────────────────────────
const ROOT       = path.resolve(__dirname, '..');
const APP_JS     = path.join(ROOT, 'js', 'app.js');
const QUESTIONS  = path.join(ROOT, 'js', 'questions.js');
const ADMIN_HTML = path.join(ROOT, 'admin.html');

// ── Logging helpers ───────────────────────────────────────────────────────────
let errors   = 0;
let warnings = 0;

const fail    = msg => { console.error(`  ✗ FAIL  ${msg}`);  errors++;   };
const warn    = msg => { console.warn (`  ⚠ WARN  ${msg}`);  warnings++; };
const pass    = msg => { console.log  (`  ✓ PASS  ${msg}`);              };
const section = t   => console.log(`\n── ${t} ${'─'.repeat(Math.max(0, 60 - t.length))}`);

// ── File reader ───────────────────────────────────────────────────────────────
function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`File not found: ${path.relative(ROOT, filePath)}`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
}

const appJs       = readFile(APP_JS);
const questionsJs = readFile(QUESTIONS);
const adminHtml   = readFile(ADMIN_HTML);

// ── JS evaluator — IIFE wrapper ───────────────────────────────────────────────
/**
 * Wraps `src` in an IIFE with browser globals stubbed out,
 * evaluates it in a vm sandbox, and returns the named exports.
 *
 * Why IIFE: `const` declarations don't leak into a vm context's global scope,
 * but they ARE accessible inside the IIFE's own lexical scope.
 * The IIFE returns an object collecting the values we care about.
 */
function evalAndExtract(src, label, exports) {
  const stubs = `
    var localStorage   = { getItem: function(){ return null; }, setItem: function(){} };
    var sessionStorage = { getItem: function(){ return null; }, setItem: function(){} };
    var window         = {};
    var document       = {
      querySelector:    function(){ return null; },
      querySelectorAll: function(){ return []; }
    };
    var fetch = function(){ return Promise.resolve({ json: function(){ return Promise.resolve({}); } }); };
  `;

  const returnObj = exports.map(e => `"${e}": typeof ${e} !== 'undefined' ? ${e} : null`).join(',\n    ');

  const wrapped = `(function() {\n${stubs}\n${src}\n  return {\n    ${returnObj}\n  };\n})()`;

  try {
    return vm.runInNewContext(wrapped, { console, Math, JSON }, { filename: label, timeout: 5000 });
  } catch (e) {
    fail(`Evaluation error in ${label}: ${e.message}`);
    return null;
  }
}

// ── HTML script extractor ─────────────────────────────────────────────────────
/**
 * Concatenates all <script> blocks from an HTML file and runs them through
 * evalAndExtract with a richer DOM stub (admin.html calls more DOM APIs at init).
 */
function evalHTMLAndExtract(html, label, exports) {
  const scriptRe = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let combined = '';
  let m;
  while ((m = scriptRe.exec(html)) !== null) combined += m[1] + '\n';

  // admin.html calls Chart(), getElementById(), addEventListener() etc. at init.
  // Stub everything that would throw, then evaluate just enough to collect the constants.
  const stubs = `
    var localStorage   = { getItem: function(){ return null; }, setItem: function(){} };
    var sessionStorage = { getItem: function(){ return null; }, setItem: function(){} };
    var fetch  = function(){ return Promise.resolve({ json: function(){ return Promise.resolve({}); } }); };
    var alert  = function(){};
    var confirm= function(){ return false; };
    var Chart  = function(){ return { update: function(){}, data: { datasets: [{ data: [] }] } }; };
    Chart.register = function(){};
    var window   = { matchMedia: function(){ return { matches: false }; } };
    var document = {
      querySelector:    function(){ return { addEventListener: function(){}, classList: { add:function(){}, remove:function(){} }, textContent:'', innerHTML:'' }; },
      querySelectorAll: function(){ return []; },
      getElementById:   function(){ return { addEventListener: function(){}, classList: { add:function(){}, remove:function(){} }, textContent:'', innerHTML:'' }; },
      addEventListener: function(){},
      body: { addEventListener: function(){} }
    };
  `;

  const returnObj = exports.map(e => `"${e}": typeof ${e} !== 'undefined' ? ${e} : null`).join(',\n    ');
  const wrapped   = `(function() {\n${stubs}\n${combined}\n  return {\n    ${returnObj}\n  };\n})()`;

  try {
    return vm.runInNewContext(wrapped, { console, Math, JSON }, { filename: label, timeout: 5000 });
  } catch (e) {
    // Fallback: try to extract just the constants with a targeted snippet
    // admin.html declares GROUP_FEES and GROUP_NAMES on two consecutive compact lines
    const lineRe = new RegExp(
      `(?:const|var|let)\\s+(${exports.join('|')})\\s*=\\s*(\\{[^}]+\\})`,
      'g'
    );
    const result = {};
    let lm;
    while ((lm = lineRe.exec(combined)) !== null) {
      const name = lm[1];
      let raw = lm[2]
        .replace(/'([^']+)'\s*:/g,  '"$1":')
        .replace(/:\s*'([^']*)'/g,   ': "$1"')
        .replace(/,\s*\}/g, '}')
        .replace(/\/\/[^\n]*/g, '');
      try { result[name] = JSON.parse(raw); } catch (_) { /* leave null */ }
    }
    if (Object.keys(result).length > 0) return result;
    fail(`Evaluation error in ${label}: ${e.message}`);
    return null;
  }
}

// ── Parse all constants ───────────────────────────────────────────────────────
section('Parse checks');

const appResult = evalAndExtract(appJs, 'js/app.js',
  ['AGE_GROUP_FEES', 'AGE_GROUP_LABELS', 'AGE_GROUP_NAMES']);

const qResult = evalAndExtract(questionsJs, 'js/questions.js',
  ['QUESTION_BANK', 'Q_COUNT']);

const adminResult = evalHTMLAndExtract(adminHtml, 'admin.html',
  ['GROUP_FEES', 'GROUP_NAMES']);

const appFees    = appResult    && appResult.AGE_GROUP_FEES;
const appLabels  = appResult    && appResult.AGE_GROUP_LABELS;
const bank       = qResult      && qResult.QUESTION_BANK;
const qCount     = qResult      && qResult.Q_COUNT;
const adminFees  = adminResult  && adminResult.GROUP_FEES;
const adminNames = adminResult  && adminResult.GROUP_NAMES;

// Report parse results
const checkParsed = (val, name, file) => {
  if (val && typeof val === 'object' && Object.keys(val).length > 0) {
    pass(`${name} extracted from ${file}`);
    return true;
  }
  fail(`Could not extract ${name} from ${file}`);
  return false;
};

const appFeesOk    = checkParsed(appFees,    'AGE_GROUP_FEES',    'js/app.js');
const appLabelsOk  = checkParsed(appLabels,  'AGE_GROUP_LABELS',  'js/app.js');
const bankOk       = checkParsed(bank,       'QUESTION_BANK',     'js/questions.js');
const qCountOk     = checkParsed(qCount,     'Q_COUNT',           'js/questions.js');
const adminFeesOk  = checkParsed(adminFees,  'GROUP_FEES',        'admin.html');
const adminNamesOk = checkParsed(adminNames, 'GROUP_NAMES',       'admin.html');

if (errors > 0) {
  console.error('\n  Aborting — fix parse errors first.\n');
  process.exit(1);
}

// ── CHECK 1: Group key consistency ────────────────────────────────────────────
section('Group key consistency');

const sort       = obj => Object.keys(obj).sort();
const sameKeys   = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const appFeeKeys   = sort(appFees);
const appLabelKeys = sort(appLabels);
const adminFeeKeys = sort(adminFees);
const adminNmKeys  = sort(adminNames);
const bankKeys     = sort(bank);
const qCountKeys   = sort(qCount);

if (!sameKeys(appFeeKeys, appLabelKeys))
  fail(`app.js key mismatch — AGE_GROUP_FEES [${appFeeKeys}] ≠ AGE_GROUP_LABELS [${appLabelKeys}]`);
else
  pass(`app.js AGE_GROUP_FEES and AGE_GROUP_LABELS keys match: [${appFeeKeys}]`);

if (!sameKeys(appFeeKeys, adminFeeKeys))
  fail(`Fee key mismatch — app.js [${appFeeKeys}] ≠ admin.html GROUP_FEES [${adminFeeKeys}]`);
else
  pass(`Fee keys match across app.js and admin.html: [${appFeeKeys}]`);

if (!sameKeys(appFeeKeys, adminNmKeys))
  fail(`Name key mismatch — app.js [${appFeeKeys}] ≠ admin.html GROUP_NAMES [${adminNmKeys}]`);
else
  pass(`Name keys match across app.js and admin.html: [${appFeeKeys}]`);

if (!sameKeys(appFeeKeys, bankKeys))
  fail(`app.js groups [${appFeeKeys}] ≠ QUESTION_BANK groups [${bankKeys}]`);
else
  pass(`QUESTION_BANK keys match app.js: [${bankKeys}]`);

if (!sameKeys(appFeeKeys, qCountKeys))
  fail(`app.js groups [${appFeeKeys}] ≠ Q_COUNT groups [${qCountKeys}]`);
else
  pass(`Q_COUNT keys match app.js: [${qCountKeys}]`);

// ── CHECK 2: Fee value sync ───────────────────────────────────────────────────
section('Fee value sync — app.js AGE_GROUP_FEES vs admin.html GROUP_FEES');

for (const key of appFeeKeys) {
  const aFee = Number(appFees[key]);
  const hFee = adminFees[key] !== undefined ? Number(adminFees[key]) : undefined;
  if (hFee === undefined) {
    fail(`Group "${key}": in app.js but missing from admin.html GROUP_FEES`);
  } else if (aFee !== hFee) {
    fail(`Group "${key}" fee mismatch — app.js: LKR ${aFee}  |  admin.html: LKR ${hFee}`);
  } else {
    pass(`Group "${key}": LKR ${aFee} ✓`);
  }
}
for (const key of adminFeeKeys) {
  if (appFees[key] === undefined)
    fail(`Group "${key}": in admin.html GROUP_FEES but missing from app.js AGE_GROUP_FEES`);
}

// ── CHECK 3: Name sync ────────────────────────────────────────────────────────
section('Name sync — app.js AGE_GROUP_LABELS vs admin.html GROUP_NAMES');

for (const key of appFeeKeys) {
  const appLabel   = appLabels[key];
  const adminLabel = adminNames[key];
  if (adminLabel === undefined) {
    fail(`Group "${key}": in AGE_GROUP_LABELS but missing from admin.html GROUP_NAMES`);
  } else if (appLabel !== adminLabel) {
    fail(`Group "${key}" name mismatch:\n      app.js  : "${appLabel}"\n      admin.html: "${adminLabel}"`);
  } else {
    pass(`Group "${key}": "${appLabel}" ✓`);
  }
}

// ── CHECK 4: Question counts (bank size ≥ Q_COUNT) ────────────────────────────
section('Question counts — bank size ≥ Q_COUNT');

for (const key of bankKeys) {
  const declared  = qCount[key];
  const questions = bank[key];
  const actual    = Array.isArray(questions) ? questions.length : 0;

  if (declared === undefined) {
    fail(`Group "${key}" in QUESTION_BANK but not in Q_COUNT`);
    continue;
  }
  if (actual === 0) {
    fail(`Group "${key}": question bank is empty or failed to parse`);
    continue;
  }
  if (actual < declared) {
    fail(`Group "${key}": Q_COUNT=${declared} but only ${actual} question(s) in bank`);
  } else {
    const extra = actual - declared;
    pass(`Group "${key}": ${actual} questions ≥ Q_COUNT ${declared}` +
         (extra > 0 ? ` (${extra} bonus pool)` : ''));
  }
}
for (const key of qCountKeys) {
  if (!bank[key])
    fail(`Q_COUNT references group "${key}" but QUESTION_BANK["${key}"] does not exist`);
}

// ── CHECK 5: Question object schema ──────────────────────────────────────────
section('Question schema — all groups');

const VALID_ANS = new Set(['A', 'B', 'C', 'D']);

for (const key of bankKeys) {
  const questions = bank[key];
  if (!Array.isArray(questions)) {
    fail(`Group "${key}": QUESTION_BANK["${key}"] is not an array`);
    continue;
  }

  const ansFreq  = { A: 0, B: 0, C: 0, D: 0 };
  let groupFails = 0;

  questions.forEach((q, idx) => {
    const loc = `Group "${key}" Q#${idx + 1}`;

    if (typeof q.q !== 'string' || q.q.trim() === '') {
      fail(`${loc}: "q" is missing or empty`);  groupFails++;
    }

    if (!Array.isArray(q.opts)) {
      fail(`${loc}: "opts" is not an array`);  groupFails++;
    } else if (q.opts.length !== 4) {
      fail(`${loc}: "opts" must have exactly 4 items — found ${q.opts.length}`);  groupFails++;
    } else {
      q.opts.forEach((opt, oi) => {
        if (typeof opt !== 'string' || opt.trim() === '') {
          fail(`${loc}: opts[${oi}] ("${'ABCD'[oi]}") is empty or not a string`);  groupFails++;
        }
      });
    }

    if (typeof q.ans !== 'string' || !VALID_ANS.has(q.ans.trim().toUpperCase())) {
      fail(`${loc}: "ans" must be A/B/C/D — found "${q.ans}"`);  groupFails++;
    } else {
      ansFreq[q.ans.trim().toUpperCase()]++;
    }

    if (typeof q.topic !== 'string' || q.topic.trim() === '') {
      fail(`${loc}: "topic" is missing or empty`);  groupFails++;
    }
  });

  if (groupFails === 0)
    pass(`Group "${key}": all ${questions.length} questions pass schema checks`);

  // Answer-position bias warning
  const total = questions.length;
  for (const [letter, count] of Object.entries(ansFreq)) {
    const pct = Math.round((count / total) * 100);
    if (pct > 60)
      warn(`Group "${key}": answer "${letter}" used in ${count}/${total} (${pct}%) — redistribute correct answers`);
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────
section('Result');

const totalQ = bankKeys.reduce((s, k) => s + (Array.isArray(bank[k]) ? bank[k].length : 0), 0);

console.log(`\n  Groups validated  : ${bankKeys.join(', ')}`);
console.log(`  Total questions   : ${totalQ}`);
console.log(`  Errors            : ${errors}`);
console.log(`  Warnings          : ${warnings}\n`);

if (errors > 0) {
  console.error(`  ✗ Validation FAILED — ${errors} error(s) must be fixed before merging.\n`);
  process.exit(1);
} else {
  console.log(`  ✓ Validation PASSED${warnings ? ` with ${warnings} warning(s)` : ' — all checks clean'}.\n`);
  process.exit(0);
}
