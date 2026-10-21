# Adminer

Открыть `http://localhost:8081` и подключиться к PostgreSQL:

- Server: `postgres`
- Username: `organic_compounds_user`
- Password: `organic_compounds_pass`
- Database: `organic_compounds_lab2`

Проверка:

```sql
SELECT id, name, status, carbon_count, hydrogen_count, image_url, video_url
FROM organic_compounds
ORDER BY id;
```

Пользователи:

```sql
SELECT id, name, email, password
FROM organic_compound_users
ORDER BY id;
```
