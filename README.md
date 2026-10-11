# Bobíkova herna

Učící hry pro děti základní školy s maskotem robotem Bobíkem. Hry si děti mohou zahrát doma v prohlížeči (i na mobilu). Rozcestník s obrázky her je v `index.html` a hry jsou rozdělené podle ročníku (1. až 5. třída, zatím jsou hotové hry pro 1. třídu). QR kód vede právě na rozcestník.

Adresa po zapnutí GitHub Pages: https://supermanadam007.github.io/bobikova-herna/

## Hry pro 1. třídu
- **Robot Bobík** (`robot/`): dítě poskládá kroky (nahoru, dolů, doleva, doprava), čemuž říkáme program, a pak ho spustí. Když robot spadne, program se opraví a jde se dál. 7 úrovní.
- **Abeceda** (`abeceda/`): všech 42 písmen české abecedy včetně `ch`, `ě`, `ř`, `ů`. Procházení abecedy s obrázky, hra "Najdi písmeno" podle hlasu a hra "Obrázek" (S jakým písmenem začíná slovo?). Samohlásky červeně, souhlásky modře.
- **Co bude dál?** (`rady/`): řady z emoji obrázků (AB, AAB, ABC a další), dítě vybere ze tří možností, co v řadě bude dál. Deset řad, hvězdičky, postupně těžší.
- **Sčítání** (`scitani/`): sečtení dvou čísel, u menších součtů s obrázky, dítě vybere výsledek ze tří možností. Deset příkladů (od součtu do 4 po součet do 20), hvězdičky.
- **Psaní** (`psani/`): obtahování psacích písmen české abecedy prstem (malá, velká a slova) ve školním písmu Playwrite CZ. Hra vyhodnotí, kolik je obtaženo, a ukáže žlutě, co chybí.

Hry nic neodesílají na internet, nemají přihlášení ani reklamy. Jediné, co se ukládá, je v prohlížeči dítěte hvězdička u hotových písmen.

## Struktura
- `index.html`: rozcestník s výběrem třídy (obrázky v `obrazky/`). Novou hru přidáš do seznamu `HRY` v `index.html` a nastavíš jí třídu, např. `trida: [2]`.
- `robot/`, `abeceda/`, `psani/`, `rady/`, `scitani/`: jednotlivé hry, každá má `index.html` a složku `zvuky/` s hlasem (mp3)
- `spolecne/`: sdílený kód (`spolecne.js`, `spolecne.css`) a česká abeceda s příklady (`pismena.js`)
- `spolecne/spolecne.js`: načítací obrazovka "Bobík se připravuje" stáhne všechny hlasy do mezipaměti prohlížeče, po změně nahrávek zvyš `VERZE_HLASU`
- `tools/generuj.py`: hlas Abecedy a Psaní přes ElevenLabs (model `eleven_v3`, rodilý český hlas Michaela)
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

## Další soubory
- `hry.md`: nápady na další hry do herny
- Materiály k prezentaci ve škole (plán, checklist, bezpečnost, hry bez počítače, vizitky s QR kódem) jsou v samostatném projektu `ada-skola-prezentace`.

## Kontakt
Autor her: [Adam Pavlát na LinkedInu](https://www.linkedin.com/in/adam-pavlat/). Když budete něco potřebovat, klidně mi napište.
