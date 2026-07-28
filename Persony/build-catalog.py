#!/usr/bin/env python3
"""Vygeneruje personas.json (katalog person) z MD souborů v téhle složce.

Zdroj pravdy jsou MD soubory — ty se editují. Po změně spusť:
    python3 Persony/build-catalog.py

Z každého MD se vytáhne: název (# nadpis), krátký popis, delší popis
a celá sekce '## Systémový prompt' (to je text, který dostane model).
"""
import json
import re
from pathlib import Path

HERE = Path(__file__).parent

# id → soubor. id se ukládá do karty Glitche (pole "persona") a vybírá se v editoru.
IDS = {
    "glitchee": "glitchee-basic-glitch.md",
    "glitchee-chat": "glitchee-chat.md",
    "planovani": "01_chatbot-pro-planovani.md",
    "co-kdyby": "02_co-kdyby.md",
    "opakovaci-partak": "03_opakovaci-partak.md",
    "chybujici-chatbot": "04_chybujici-chatbot.md",
    "brainstorming": "05_partak-pro-brainstorming.md",
    "spolecne-objevovani": "06_spolecne-objevovani.md",
    "v-hlavni-roli": "07_v-hlavni-roli.md",
    "testovaci-chatbot": "08_testovaci-chatbot.md",
    "zvedavy-mimon": "09_zvedavy-mimon.md",
    "historicka-postava": "10_historicka-postava.md",
    "argumentacni-partner": "11_argumentacni-partner.md",
    "detektiv-chyb": "12_detektiv-chyb.md",
    "stavitel-glitche": "13_stavitel-glitche.md",
}


def mask_fences(text):
    """Nahradí obsah ``` bloků stejně dlouhou výplní, aby se nadpisy uvnitř
    kódu (např. '### KARTA GLITCHE' v šabloně) nebraly jako konec sekce.
    Pozice znaků zůstávají zachované, takže indexy sedí i v originále."""
    def blank(m):
        return re.sub(r"[^\n]", " ", m.group(0))
    return re.sub(r"```.*?```", blank, text, flags=re.S)


def section(text, heading):
    """Vrátí obsah sekce daného nadpisu až po další nadpis stejné (nebo vyšší) úrovně."""
    level = heading.split(" ")[0]                       # '##' nebo '###'
    # konec sekce = další nadpis stejné úrovně, nebo vyšší (## ukončí i ###)
    stops = [rf"^{'#' * n} " for n in range(1, len(level) + 1)]
    pattern = rf"^{re.escape(heading)}\s*$(.*?)(?={'|'.join(stops)}|\Z)"
    m = re.search(pattern, mask_fences(text), re.M | re.S)
    return text[m.start(1):m.end(1)].strip() if m else ""


def clean(s):
    """Zruší kurzívu kolem celého popisu a sjednotí mezery."""
    s = s.strip().strip("*").strip()
    return re.sub(r"\s+", " ", s)


def strip_templates(prompt):
    """Odstraní z promptu šablonové bloky s {{PLACEHOLDERY}}.

    Některé persony (Glitchee) mají v promptu vzorový blok '### KARTA GLITCHE'
    s poli {{NAZEV}}, {{VYUKOVY_CIL}}… Tuhle roli u nás plní blok ZADÁNÍ, který
    skládá server ze skutečné karty. Kdyby šablona v promptu zůstala, model by
    placeholdery klidně vypsal žákovi ({{NAZEV}} v bublině).
    """
    # ``` bloky, které obsahují placeholdery
    prompt = re.sub(r"```[^\n]*\n(?:(?!```).)*?\{\{[A-Z_0-9]+\}\}(?:(?!```).)*?```",
                    "(kontext Glitche dostaneš níže v bloku ZADÁNÍ)", prompt, flags=re.S)
    # zbylé osamocené placeholdery (např. ve větě „Glitch o {{NAZEV}}")
    prompt = re.sub(r"\{\{[A-Z_0-9]+\}\}", "…", prompt)
    return prompt


def build():
    personas = []
    for pid, fname in IDS.items():
        path = HERE / fname
        if not path.exists():
            print(f"  ! chybí {fname} — přeskakuji")
            continue
        text = path.read_text(encoding="utf-8")

        title = re.search(r"^#\s+(.+)$", text, re.M)
        name = title.group(1).strip() if title else pid

        # Glitchee má nadpisy o úroveň níž (###), ostatní ##
        prompt = section(text, "## Systémový prompt") or section(text, "### Systémový prompt")
        short = clean(section(text, "## Krátký popis") or section(text, "### Krátký popis"))
        long_ = clean(section(text, "## Delší popis") or section(text, "### Delší popis"))

        if not prompt:
            print(f"  ! {fname}: nenašel jsem '## Systémový prompt'")
        prompt = strip_templates(prompt)

        personas.append({
            "id": pid,
            "name": name,
            "short": short,
            "description": long_,
            "source": fname,
            "prompt": prompt,
        })

    out = {"default": "glitchee", "personas": personas}
    (HERE / "personas.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Hotovo: {len(personas)} person → Persony/personas.json")
    for p in personas:
        print(f"  {p['id']:24} {p['name'][:38]:40} prompt {len(p['prompt']):>6} zn.")


if __name__ == "__main__":
    build()
