INSERT INTO "Tense" ("name")
SELECT v.name
FROM (VALUES
  ('Présent'),
  ('Passé Composé'),
  ('Imparfait')
) AS v(name)
WHERE NOT EXISTS (
  SELECT 1
  FROM "Tense" existing
  WHERE existing."name" = v.name
);
