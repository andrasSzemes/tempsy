import fs from 'node:fs';
import vm from 'node:vm';

const inputPath = '/Users/andras/Desktop/szakdoga/frontend/src/tenses/passeCompose/conjugaison.tsx';
const outputPath = '/Users/andras/Desktop/szakdoga/backend/prisma/5_seed_conjugations.sql';

const source = fs.readFileSync(inputPath, 'utf8');
const transformed =
  source.replace(
    /export\s+const\s+conjugaisonPasseCompose\s*:[\s\S]*?=\s*/,
    'const conjugaisonPasseCompose = '
  ) + '\n;globalThis.__data = conjugaisonPasseCompose;';

const sandbox = { globalThis: {} };
vm.createContext(sandbox);
new vm.Script(transformed, { filename: inputPath }).runInContext(sandbox);

const data = sandbox.globalThis.__data;
if (!data || typeof data !== 'object') {
  throw new Error('Could not parse conjugaisonPasseCompose from conjugaison.tsx');
}

const rows = [];
for (const [verbName, bySubject] of Object.entries(data)) {
  if (!bySubject || typeof bySubject !== 'object') {
    continue;
  }

  for (const [subjectName, text] of Object.entries(bySubject)) {
    if (typeof text !== 'string') {
      continue;
    }

    rows.push({ verbName, subjectName, tenseName: 'Passé Composé', text });
  }
}

const values = rows
  .map(({ verbName, subjectName, tenseName, text }) => {
    const escapedVerb = verbName.replace(/'/g, "''");
    const escapedSubject = subjectName.replace(/'/g, "''");
    const escapedTense = tenseName.replace(/'/g, "''");
    const escapedText = text.replace(/'/g, "''");
    return `    ('${escapedVerb}', '${escapedSubject}', '${escapedTense}', '${escapedText}')`;
  })
  .join(',\n');

const sql = `-- Generated from frontend/src/tenses/passeCompose/conjugaison.tsx\n-- Resolves verb_id, subject_id and tense_id by name, then upserts conjugations.\n\nINSERT INTO "Conjugation" ("verb_id", "subject_id", "tense_id", "text")\nSELECT v."id", s."id", t."id", c."text"\nFROM (\n  VALUES\n${values}\n) AS c("verb_name", "subject_name", "tense_name", "text")\nJOIN "Verb" v ON v."name" = c."verb_name"\nJOIN "Subject" s ON s."name" = c."subject_name"\nJOIN "Tense" t ON t."name" = c."tense_name"\nON CONFLICT ("verb_id", "subject_id", "tense_id")\nDO UPDATE SET "text" = EXCLUDED."text";\n`;

fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Generated ${rows.length} conjugation rows into ${outputPath}`);
