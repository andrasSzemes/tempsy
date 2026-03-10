import fs from 'node:fs';
import path from 'node:path';
import FrenchVerbs from '/tmp/fv/node_modules/french-verbs/dist/index.js';
const Lefff = JSON.parse(
  fs.readFileSync('/tmp/fv/node_modules/french-verbs-lefff/dist/conjugations.json', 'utf8')
);

const workspace = '/Users/andras/Desktop/szakdoga';
const inFile = path.join(workspace, 'backend/prisma/5_seed_conjugations.sql');
const outFile = path.join(workspace, 'backend/prisma/5B_seed_conjugations.sql');

const src = fs.readFileSync(inFile, 'utf8');
const rowRe = /\('([^']+)',\s*'[^']+',\s*'[^']+',/g;
const verbs = [];
const seen = new Set();
let m;
while ((m = rowRe.exec(src)) !== null) {
  const verb = m[1];
  if (!seen.has(verb)) {
    seen.add(verb);
    verbs.push(verb);
  }
}

const subjects = ['je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'];
const personBySubject = { je: 0, tu: 1, il: 2, elle: 2, on: 2, nous: 3, vous: 4, ils: 5, elles: 5 };

const customByVerb = {
  's’en aller': {
    je: "je m'en vais",
    tu: "tu t'en vas",
    il: "il s'en va",
    elle: "elle s'en va",
    on: "on s'en va",
    nous: 'nous nous en allons',
    vous: 'vous vous en allez',
    ils: "ils s'en vont",
    elles: "elles s'en vont",
  },
  'se replier sur soi-même': {
    je: 'je me replie sur moi-même',
    tu: 'tu te replies sur toi-même',
    il: 'il se replie sur lui-même',
    elle: 'elle se replie sur elle-même',
    on: 'on se replie sur soi-même',
    nous: 'nous nous replions sur nous-mêmes',
    vous: 'vous vous repliez sur vous-mêmes',
    ils: 'ils se replient sur eux-mêmes',
    elles: 'elles se replient sur elles-mêmes',
  },
  clore: {
    je: 'je clos',
    tu: 'tu clos',
    il: 'il clôt',
    elle: 'elle clôt',
    on: 'on clôt',
    nous: 'nous closons',
    vous: 'vous closez',
    ils: 'ils closent',
    elles: 'elles closent',
  },
  's’en sortir': {
    je: "je m'en sors",
    tu: "tu t'en sors",
    il: "il s'en sort",
    elle: "elle s'en sort",
    on: "on s'en sort",
    nous: 'nous nous en sortons',
    vous: 'vous vous en sortez',
    ils: "ils s'en sortent",
    elles: "elles s'en sortent",
  },
  falloir: Object.fromEntries(subjects.map((s) => [s, 'il faut'])),
  pleuvoir: Object.fromEntries(subjects.map((s) => [s, 'il pleut'])),
};

const compoundSuffixByVerb = {
  'se rendre compte': 'compte',
};

function normalizeVerb(verb) {
  let normalized = verb.replace(/’/g, "'");
  if (normalized === 'resoudre') normalized = 'résoudre';
  return normalized;
}

function withSubject(subject, form) {
  if (subject === 'je') {
    if (/^m'/.test(form) || /^me\s/.test(form)) return `je ${form}`;
    if (/^[aeiouhâàäéèêëîïôöùûüÿœæ]/i.test(form)) return `j'${form}`;
  }
  return `${subject} ${form}`;
}

function conjugate(verb, subject) {
  if (customByVerb[verb]) {
    return customByVerb[verb][subject];
  }

  const person = personBySubject[subject];

  if (compoundSuffixByVerb[verb]) {
    const base = verb.replace(/\s+[^\s]+$/, '').replace(/’/g, "'");
    const baseForm = FrenchVerbs.getConjugation(Lefff, base, 'PRESENT', person);
    return withSubject(subject, `${baseForm} ${compoundSuffixByVerb[verb]}`);
  }

  const normalized = normalizeVerb(verb);
  try {
    const form = FrenchVerbs.getConjugation(Lefff, normalized, 'PRESENT', person);
    return withSubject(subject, form);
  } catch {
    if (/^s'/.test(normalized)) {
      const fallback = FrenchVerbs.getConjugation(Lefff, `se ${normalized.slice(2)}`, 'PRESENT', person);
      return withSubject(subject, fallback);
    }
    throw new Error(`Cannot conjugate: ${verb} (${subject})`);
  }
}

const rows = [];
for (const verb of verbs) {
  for (const subject of subjects) {
    rows.push({
      verb,
      subject,
      tense: 'Présent',
      text: conjugate(verb, subject),
    });
  }
}

const esc = (s) => s.replace(/'/g, "''");
const values = rows
  .map((r) => `    ('${esc(r.verb)}', '${esc(r.subject)}', '${esc(r.tense)}', '${esc(r.text)}')`)
  .join(',\n');

const sql = `INSERT INTO "Conjugation" ("verb_id", "subject_id", "tense_id", "text")\nSELECT v."id", s."id", t."id", c."text"\nFROM (\n  VALUES\n${values}\n) AS c("verb_name", "subject_name", "tense_name", "text")\nJOIN "Verb" v ON v."name" = c."verb_name"\nJOIN "Subject" s ON s."name" = c."subject_name"\nJOIN "Tense" t ON t."name" = c."tense_name"\nON CONFLICT ("verb_id", "subject_id", "tense_id")\nDO UPDATE SET "text" = EXCLUDED."text";\n`;

fs.writeFileSync(outFile, sql, 'utf8');
console.log(`Generated ${rows.length} rows for ${verbs.length} verbs into ${outFile}`);
