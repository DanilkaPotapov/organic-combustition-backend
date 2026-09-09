# Git и GitHub для ЛР1

Рекомендуемое имя backend-репозитория:

```text
organic-combustion-backend
```

## Первый commit в main

На GitHub создай пустой репозиторий, затем в папке проекта:

```bash
git init
git add .gitignore README.md START_HERE.md package.json nest-cli.json tsconfig.json
git commit -m "init backend project"
git branch -M main
git remote add origin https://github.com/ТВОЙ_ЛОГИН/organic-combustion-backend.git
git push -u origin main
```

## Отдельная ветка ЛР1

```bash
git checkout -b lab1-modern-analytical
git add .
git commit -m "lab1: portrait templates, minio and pixso design"
git push -u origin lab1-modern-analytical
```

Перед защитой:

```bash
git status
git branch
git log --oneline --decorate -5
```

`git status` должен показывать чистую рабочую директорию, а активной должна быть ветка `lab1-modern-analytical`.

## После исправлений преподавателя

Не переписывай старый commit. Исправь код и сделай новый:

```bash
git add .
git commit -m "fix lab1 remarks"
git push
```

Для ЛР2 потом создавай новую ветку от актуального состояния в соответствии с правилами преподавателя.
