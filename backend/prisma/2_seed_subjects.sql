INSERT INTO "Subject" ("name")
SELECT v.name
FROM (VALUES
  ('je'),
  ('tu'),
  ('il'),
  ('elle'),
  ('on'),
  ('nous'),
  ('vous'),
  ('ils'),
  ('elles')
) AS v(name)
WHERE NOT EXISTS (
  SELECT 1
  FROM "Subject" existing
  WHERE existing."name" = v.name
);
