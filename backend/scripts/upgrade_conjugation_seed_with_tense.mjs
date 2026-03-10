import fs from 'node:fs';

const filePath = '/Users/andras/Desktop/szakdoga/backend/prisma/5_seed_conjugations.sql';
const original = fs.readFileSync(filePath, 'utf8');

const lines = original.split('\n').map((line) => {
  const valueLine = line.match(/^(\s+\('(?:[^']|'')*', '(?:[^']|'')*'), ('(?:[^']|'')*')(,?)$/);
  if (valueLine) {
    return `${valueLine[1]}, 'Passé Composé', ${valueLine[2]}${valueLine[3]}`;
  }
  return line;
});

let updated = lines.join('\n');
updated = updated.replace(
  ') AS c("verb_name", "subject_name", "text")',
  ') AS c("verb_name", "subject_name", "tense_name", "text")'
);
updated = updated.replace(
  /JOIN "Tense" t ON t\."name" = 'Passé Composé'/,
  'JOIN "Tense" t ON t."name" = c."tense_name"'
);

fs.writeFileSync(filePath, updated, 'utf8');
console.log('Updated conjugation seed with per-row tense_name.');
