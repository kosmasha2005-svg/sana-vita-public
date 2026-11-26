# Sana Vita — сайт медичного центру

Сайт медичного центру Sana Vita (Одеса), зверстаний за макетом у Figma. Чистий HTML + CSS + JavaScript.

## Сторінки
| Файл | Сторінка |
|---|---|
| `index.html` | Головна |
| `services.html` | Послуги |
| `proctology.html` | Проктологія |
| `doctors.html` | Спеціалісти |
| `doctor.html` | Картка лікаря (Бондаревич С. М.) |
| `about.html` | Про нас |
| `contacts.html` | Контакти |
| `prices.html` | Ціни (10 напрямів, `prices.html?dir=urology` тощо) |
| `booking.html` | Запис до лікаря у 3 кроки (`booking.html?service=urology&doctor=bondarevych`) |

Переходи між сторінками зроблені за прототипом у Figma.

## Як редагувати
Готові `.html` у корені **генеруються** з папки `src/`:
- `src/pages/*.html` — вміст кожної сторінки;
- `src/partials/` — спільні шапка, футер і блок «Записатися на прийом».

Після змін у `src/` запустіть:

```bash
python3 build.py
```

Дані (лікарі, прайси, послуги для запису) — у `data.js`, стилі — у `styles.css`, логіка — у `script.js`.

Переглянути локально:

```bash
python3 -m http.server 8000
```
