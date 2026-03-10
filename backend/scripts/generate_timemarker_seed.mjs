import fs from 'node:fs';
import vm from 'node:vm';

const inputPath = '/Users/andras/Desktop/szakdoga/frontend/src/tenses/passeCompose/timeMarker.tsx';
const outputPath = '/Users/andras/Desktop/szakdoga/backend/prisma/7_seed_timemarkers.sql';

const source = fs.readFileSync(inputPath, 'utf8');
const transformed =
  source.replace(
    /export\s+const\s+timeMarkerPasseCompose\s*=\s*/,
    'const timeMarkerPasseCompose = '
  ) + '\n;globalThis.__data = timeMarkerPasseCompose;';

const sandbox = { globalThis: {} };
vm.createContext(sandbox);
new vm.Script(transformed, { filename: inputPath }).runInContext(sandbox);

const data = sandbox.globalThis.__data;
if (!Array.isArray(data)) {
  throw new Error('Could not parse timeMarkerPasseCompose from timeMarker.tsx');
}

const rows = data
  .filter((row) => row && typeof row === 'object')
  .map((row) => ({
    placement: String(row.placement ?? '').trim(),
    text: String(row.text ?? '').trim(),
    tenseName: 'Passé Composé',
  }))
  .filter((row) => row.placement.length > 0 && row.text.length > 0);

const values = rows
  .map(({ placement, text, tenseName }) => {
    const escapedPlacement = placement.replace(/'/g, "''");
    const escapedText = text.replace(/'/g, "''");
    const escapedTense = tenseName.replace(/'/g, "''");
    return `    ('${escapedText}', '${escapedPlacement}', '${escapedTense}')`;
  })
  .join(',\n');

const sql = `-- Generated from frontend/src/tenses/passeCompose/timeMarker.tsx\n-- Inserts time markers for Passé Composé (idempotent).\n\nWITH input("text", "placement", "tense_name") AS (\n  VALUES\n${values}\n)\nINSERT INTO "TimeMarker" ("text", "placement", "tense_id")\nSELECT i."text", i."placement", t."id"\nFROM input i\nJOIN "Tense" t ON t."name" = i."tense_name"\nLEFT JOIN "TimeMarker" tm\n  ON tm."text" = i."text"\n AND tm."placement" = i."placement"\n AND tm."tense_id" = t."id"\nWHERE tm."id" IS NULL;\n`;

fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Generated ${rows.length} time marker rows into ${outputPath}`);
