import fs from 'node:fs';
import path from 'node:path';
import FrenchVerbs from '/tmp/fv/node_modules/french-verbs/dist/index.js';
const Lefff = JSON.parse(
  fs.readFileSync('/tmp/fv/node_modules/french-verbs-lefff/dist/conjugations.json', 'utf8')
);

const workspace = '/Users/andras/Desktop/szakdoga';
const inFile = path.join(workspace, 'backend/prisma/5_seed_conjugations.sql');
const outFile = path.join(workspace, 'backend/prisma/5C_seed_conjugations.sql');

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
    je: "je m'en allais",
    tu: "tu t'en allais",
    il: "il s'en allait",
    elle: "elle s'en allait",
    on: "on s'en allait",
    nous: 'nous nous en allions',
    vous: 'vous vous en alliez',
    ils: "ils s'en allaient",
    elles: "elles s'en allaient",
  },
  'se replier sur soi-même': {
    je: 'je me repliais sur moi-même',
    tu: 'tu te repliais sur toi-même',
    il: 'il se repliait sur lui-même',
    elle: 'elle se repliait sur elle-même',
    on: 'on se repliait sur soi-même',
    nous: 'nous nous repliions sur nous-mêmes',
    vous: 'vous vous repliiez sur vous-mêmes',
    ils: 'ils se repliaient sur eux-mêmes',
    elles: 'elles se repliaient sur elles-mêmes',
  },
  clore: {
    je: 'je closais',
    tu: 'tu closais',
    il: 'il closait',
    elle: 'elle closait',
    on: 'on closait',
    nous: 'nous closions',
    vous: 'vous closiez',
    ils: 'ils closaient',
    elles: 'elles closaient',
  },
  's’en sortir': {
    je: "je m'en sortais",
    tu: "tu t'en sortais",
    il: "il s'en sortait",
    elle: "elle s'en sortait",
    on: "on s'en sortait",
    nous: 'nous nous en sortions',
    vous: 'vous vous en sortiez',
    ils: "ils s'en sortaient",
    elles: "elles s'en sortaient",
  },
  falloir: Object.fromEntries(subjects.map((s) => [s, 'il fallait'])),
  pleuvoir: Object.fromEntries(subjects.map((s) => [s, 'il pleuvait'])),
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
    const baseForm = FrenchVerbs.getConjugation(Lefff, base, 'IMPARFAIT', person);
    return withSubject(subject, `${baseForm} ${compoundSuffixByVerb[verb]}`);
  }

  const normalized = normalizeVerb(verb);
  try {
    const form = FrenchVerbs.getConjugation(Lefff, normalized, 'IMPARFAIT', person);
    return withSubject(subject, form);
  } catch {
    if (/^s'/.test(normalized)) {
      const fallback = FrenchVerbs.getConjugation(Lefff, `se ${normalized.slice(2)}`, 'IMPARFAIT', person);
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
      tense: 'Imparfait',
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
