# Bobíkova herna

Učící hry pro děti základní školy s maskotem robotem Bobíkem, plus podklady k prezentaci pro první třídu. Hry si děti mohou zahrát doma v prohlížeči (i na mobilu). Rozcestník s obrázky her je v `index.html` a hry jsou rozdělené podle ročníku (1. až 5. třída, zatím jsou hotové hry pro 1. třídu). QR kód vede právě na rozcestník.

Adresa po zapnutí GitHub Pages: https://supermanadam007.github.io/bobikova-herna/

## Hry pro 1. třídu
- **Robot Bobík** (`robot/`): dítě poskládá kroky (nahoru, dolů, doleva, doprava), čemuž říkáme program, a pak ho spustí. Když robot spadne, program se opraví a jde se dál. 7 úrovní.
- **Abeceda** (`abeceda/`): všech 42 písmen české abecedy včetně `ch`, `ě`, `ř`, `ů`. Procházení abecedy s obrázky, hra "Najdi písmeno" podle hlasu a hra "Obrázek" (S jakým písmenem začíná slovo?). Samohlásky červeně, souhlásky modře.
- **Psaní** (`psani/`): obtahování psacích písmen české abecedy prstem (malá, velká a slova) ve školním písmu Playwrite CZ. Hra vyhodnotí, kolik je obtaženo, a ukáže žlutě, co chybí.

Hry nic neodesílají na internet, nemají přihlášení ani reklamy. Jediné, co se ukládá, je v prohlížeči dítěte hvězdička u hotových písmen.

## Struktura
- `index.html`: rozcestník s výběrem třídy (obrázky v `obrazky/`). Novou hru přidáš do seznamu `HRY` v `index.html` a nastavíš jí třídu, např. `trida: [2]`.
- `robot/`, `abeceda/`, `psani/`: jednotlivé hry, každá má `index.html` a složku `zvuky/` s hlasem (mp3)
- `spolecne/`: sdílený kód (`spolecne.js`, `spolecne.css`) a česká abeceda s příklady (`pismena.js`)
- `spolecne/spolecne.js`: načítací obrazovka "Bobík se připravuje" stáhne všechny hlasy do mezipaměti prohlížeče, po změně nahrávek zvyš `VERZE_HLASU`
- `tools/generuj-lokalne.py`: aktuální hlas Abecedy a Psaní, český hlas Zuzana z macOS (správná výslovnost ě š č ř ž ý á í, zdarma, bez internetu)
- `tools/generuj.py`: původní verze přes ElevenLabs, dnes slouží jen jako seznam textů nahrávek
- `robot/generuj-hlas.py`: totéž pro Robota Bobíka
- `psani/PlaywriteCZ.ttf`: písmo Playwrite CZ (licence SIL OFL, viz `psani/OFL.txt`)

## Hlas
Hlas je předem nahraný, hry fungují i bez internetu. Správná čeština je důležitá, proto se u písmen používá výslovnost (např. "bé", "dlouhé á", "e s háčkem") a každá nahrávka se po vygenerování zkontroluje přepisem na text:

```
source ~/.zshrc && python3 tools/generuj.py            # jen chybějící nahrávky
source ~/.zshrc && python3 tools/generuj.py --znovu    # všechno znovu
source ~/.zshrc && python3 tools/generuj.py --over     # kontrola přepisem na text
```

Klíč `ELEVENLABS_APIKEY` se čte jen z prostředí a do souborů se nezapisuje. Skript posílá dotazy po jednom, ElevenLabs při dávce naráz zablokuje bezplatný účet.

## Materiály k prezentaci
- `plan-prezentace.md`: časový plán na 35 minut
- `hry.md`: hry bez počítače
- `bezpecnost.md`: soukromí a bezpečnost her
- `checklist.md`: co si připravit
