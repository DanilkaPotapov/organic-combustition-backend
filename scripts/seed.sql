TRUNCATE organic_compound_likes, organic_compounds, users RESTART IDENTITY CASCADE;

INSERT INTO users (id, name, email, password_hash) VALUES
  (1, 'Потапов Данил', 'potapov@example.local', '30c952fab122c3f9759f02a6d95c3758b246b4f253d11f1edffcafa12cc09c4f'),
  (2, 'Тестовый пользователь', 'student2@example.local', '30c952fab122c3f9759f02a6d95c3758b246b4f253d11f1edffcafa12cc09c4f');

INSERT INTO organic_compounds
  (id, name, short_description, status, image_file_name, video_file_name, carbon_count, hydrogen_count, created_at, creator_id, formed_at)
VALUES
  (1, 'Метан', 'Простейший алкан с одним атомом углерода и четырьмя атомами водорода.', 'published',
   'organic-methane.png', 'organic-methane.webm', 1, 4, NOW() - INTERVAL '8 days', 1, NOW() - INTERVAL '8 days'),
  (2, 'Этан', 'Алкан с двумя атомами углерода и шестью атомами водорода.', 'published',
   'organic-ethane.png', 'organic-ethane.webm', 2, 6, NOW() - INTERVAL '7 days', 2, NOW() - INTERVAL '7 days'),
  (3, 'Этен', 'Алкен с двумя атомами углерода и четырьмя атомами водорода.', 'published',
   'organic-ethene.png', 'organic-ethene.webm', 2, 4, NOW() - INTERVAL '6 days', 1, NOW() - INTERVAL '6 days'),
  (4, 'Пропен', 'Алкен с тремя атомами углерода и шестью атомами водорода.', 'published',
   'organic-propene.png', 'organic-propene.webm', 3, 6, NOW() - INTERVAL '5 days', 2, NOW() - INTERVAL '5 days'),
  (5, 'Метанол', 'Простейший одноатомный спирт; отношение C:H равно 1:4.', 'published',
   'organic-methanol.png', 'organic-methanol.webm', 1, 4, NOW() - INTERVAL '4 days', 2, NOW() - INTERVAL '4 days'),
  (6, 'Этанол', 'Одноатомный спирт; отношение C:H равно 2:6.', 'published',
   'organic-ethanol.png', 'organic-ethanol.webm', 2, 6, NOW() - INTERVAL '3 days', 1, NOW() - INTERVAL '3 days'),
  (7, 'Гексан', 'Логически удаленная услуга.', 'deleted',
   'organic-methane.png', 'organic-methane.webm', 6, 14, NOW() - INTERVAL '2 days', 1, NOW() - INTERVAL '2 days');

INSERT INTO organic_compound_likes (id, user_id, organic_compound_id) VALUES
  (1, 2, 1),
  (2, 1, 2),
  (3, 1, 3),
  (4, 2, 3),
  (5, 2, 6);

SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('organic_compounds', 'id'), (SELECT MAX(id) FROM organic_compounds));
SELECT setval(pg_get_serial_sequence('organic_compound_likes', 'id'), (SELECT MAX(id) FROM organic_compound_likes));

SELECT id, name, status, carbon_count, hydrogen_count, creator_id, image_file_name, video_file_name
FROM organic_compounds
ORDER BY id;
