DELETE FROM organic_compound_likes;
DELETE FROM organic_compounds;
DELETE FROM organic_compound_users;
ALTER SEQUENCE organic_compound_likes_id_seq RESTART WITH 1;
ALTER SEQUENCE organic_compounds_id_seq RESTART WITH 1;
ALTER SEQUENCE organic_compound_users_id_seq RESTART WITH 1;
