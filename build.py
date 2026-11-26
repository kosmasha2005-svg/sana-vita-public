#!/usr/bin/env python3
"""Збирає сторінки сайту з src/pages + src/partials у готові .html у корені.

Перший рядок кожної сторінки — службовий коментар:
<!-- title: Назва | nav: about | cta: no | desc: Опис -->
Запуск: python3 build.py
"""
import hashlib
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
PART = {p.stem: p.read_text(encoding="utf-8") for p in (SRC / "partials").glob("*.html")}


def ver(name: str) -> str:
    """Короткий відбиток вмісту файлу: після змін браузер точно завантажить нову версію."""
    return hashlib.md5((ROOT / name).read_bytes()).hexdigest()[:8]


DEFAULT_DESC = ("Sana Vita — медицина, у якій є місце турботі. Проктологія, урологія, гінекологія, "
                "дерматологія, стоматологія та УЗД-діагностика в Одесі.")

TEMPLATE = """<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Inter:wght@500;600&family=Lato&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css?v={v_css}">
  <link rel="icon" href="assets/logo.png">
</head>
<body data-page="{page}">
<!-- Згенеровано з src/ скриптом build.py — редагуйте src/, а не цей файл. -->
{header}
<main id="top">
{body}
{cta}
</main>
{footer}
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script src="data.js?v={v_data}"></script>
<script src="script.js?v={v_js}"></script>
</body>
</html>
"""


def build(page: pathlib.Path) -> None:
    raw = page.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--(.*?)-->", raw, re.S)
    meta = {}
    if m:
        for part in m.group(1).split("|"):
            if ":" in part:
                k, v = part.split(":", 1)
                meta[k.strip()] = v.strip()
        raw = raw[m.end():]
    nav = meta.get("nav", "")
    header = PART["header"]
    if nav:
        header = header.replace(f'data-nav="{nav}"', f'data-nav="{nav}" class="is-active" aria-current="page"')
        header = header.replace('class="nav__dd" data-nav="services" class="is-active"', 'class="nav__dd is-active" data-nav="services"')
    html = TEMPLATE.format(
        title=meta.get("title", "Sana Vita"),
        desc=meta.get("desc", DEFAULT_DESC),
        page=page.stem,
        header=header,
        body=raw.strip("\n"),
        cta="" if meta.get("cta") == "no" else PART["cta"],
        footer=PART["footer"],
        v_css=ver("styles.css"),
        v_data=ver("data.js"),
        v_js=ver("script.js"),
    )
    (ROOT / page.name).write_text(html, encoding="utf-8")
    print("built", page.name)


for p in sorted((SRC / "pages").glob("*.html")):
    build(p)
