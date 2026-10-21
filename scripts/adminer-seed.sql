INSERT INTO organic_compound_users (id, name, email, password) VALUES
  (1, 'Потапов Данил', 'potapov@example.local', 'password1'),
  (2, 'Тестовый пользователь', 'student2@example.local', 'password2'),
  (3, 'Пользователь 3', 'student3@example.local', 'password3'),
  (4, 'Пользователь 4', 'student4@example.local', 'password4'),
  (5, 'Пользователь 5', 'student5@example.local', 'password5');

INSERT INTO organic_compounds
  (id, name, short_description, status, image_url, video_url, carbon_count, hydrogen_count, created_at, creator_id, formed_at)
VALUES
  (1, 'Метан', 'Простейший алкан; при полном сгорании образуются CO₂ и H₂O.', 'published',
   'http://localhost:9000/organic-compounds-media/organic-methane.png',
   'http://localhost:9000/organic-compounds-media/organic-methane.webm',
   1, 4, NOW() - INTERVAL '8 days', 1, NOW() - INTERVAL '8 days'),
  (2, 'Этан', 'Предельный углеводород с двумя атомами углерода.', 'published',
   'http://localhost:9000/organic-compounds-media/organic-ethane.png',
   'http://localhost:9000/organic-compounds-media/organic-ethane.webm',
   2, 6, NOW() - INTERVAL '7 days', 1, NOW() - INTERVAL '7 days'),
  (3, 'Этен', 'Простейший алкен с двойной связью C=C.', 'published',
   'http://localhost:9000/organic-compounds-media/organic-ethene.png',
   'http://localhost:9000/organic-compounds-media/organic-ethene.webm',
   2, 4, NOW() - INTERVAL '6 days', 1, NOW() - INTERVAL '6 days'),
  (4, 'Пропен', 'Алкен с тремя атомами углерода и одной двойной связью.', 'published',
   'http://localhost:9000/organic-compounds-media/organic-propene.png',
   'http://localhost:9000/organic-compounds-media/organic-propene.webm',
   3, 6, NOW() - INTERVAL '5 days', 2, NOW() - INTERVAL '5 days'),
  (5, 'Метанол', 'Простейший одноатомный спирт.', 'published',
   'http://localhost:9000/organic-compounds-media/organic-methanol.png',
   'http://localhost:9000/organic-compounds-media/organic-methanol.webm',
   1, 4, NOW() - INTERVAL '4 days', 2, NOW() - INTERVAL '4 days'),
  (6, 'Этанол', 'Одноатомный спирт; продукты полного сгорания — CO₂ и H₂O.', 'published',
   'http://localhost:9000/organic-compounds-media/organic-ethanol.png',
   'http://localhost:9000/organic-compounds-media/organic-ethanol.webm',
   2, 6, NOW() - INTERVAL '3 days', 1, NOW() - INTERVAL '3 days'),
  (7, 'Гексан', 'Логически удалённая карточка.', 'deleted', NULL, NULL,
   6, 14, NOW() - INTERVAL '2 days', 2, NOW() - INTERVAL '2 days'),
  (8, 'Пентан', NULL, 'draft',
   'http://localhost:9000/organic-compounds-media/organic-pentane.png',
   'http://localhost:9000/organic-compounds-media/organic-pentane.webm',
   NULL, NULL, NOW() - INTERVAL '1 day', 2, NULL);

INSERT INTO organic_compound_likes (id, user_id, organic_compound_id) VALUES
  (1, 2, 1), (2, 3, 1), (3, 4, 1),
  (4, 1, 2), (5, 3, 2),
  (6, 1, 3), (7, 2, 3), (8, 4, 3), (9, 5, 3),
  (10, 2, 4), (11, 3, 4),
  (12, 1, 5), (13, 4, 5), (14, 5, 5),
  (15, 2, 6), (16, 3, 6), (17, 4, 6), (18, 5, 6);

SELECT setval(pg_get_serial_sequence('organic_compound_users', 'id'), (SELECT MAX(id) FROM organic_compound_users));
SELECT setval(pg_get_serial_sequence('organic_compounds', 'id'), (SELECT MAX(id) FROM organic_compounds));
SELECT setval(pg_get_serial_sequence('organic_compound_likes', 'id'), (SELECT MAX(id) FROM organic_compound_likes));

SELECT id, name, status, carbon_count, hydrogen_count, creator_id FROM organic_compounds ORDER BY id;
