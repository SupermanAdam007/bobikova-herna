# Bobíkova herna

Učící hry pro děti základní školy s maskotem robotem Bobíkem. Hry si děti mohou zahrát doma v prohlížeči (i na mobilu). Rozcestník s obrázky her je v `index.html` a hry jsou rozdělené podle ročníku (1. až 5. třída, zatím jsou hotové hry pro 1. třídu). QR kód vede právě na rozcestník.

Adresa po zapnutí GitHub Pages: https://supermanadam007.github.io/bobikova-herna/

## Hry pro 1. třídu
- **Robot Bobík** (`robot/`): dítě poskládá kroky (nahoru, dolů, doleva, doprava), čemuž říkáme program, a pak ho spustí. Když robot spadne, program se opraví a jde se dál. 10 úrovní, od druhé jsou pole široká s dírami a k cíli vede víc různých cest. Po každé úrovni vyskočí dialog s 1 až 3 hvězdičkami (podle počtu chyb), Enter nebo tlačítko pokračuje a po poslední úrovni se hra restartuje. Dialog se dělá voláním `ukazDialog` v `robot/index.html`.
- **Abeceda** (`abeceda/`): všech 42 písmen české abecedy včetně `ch`, `ě`, `ř`, `ů`. Procházení abecedy s obrázky, hra "Najdi písmeno" podle hlasu a hra "Obrázek" (S jakým písmenem začíná slovo?). Samohlásky červeně, souhlásky modře.
- **Co bude dál?** (`rady/`): řady z emoji obrázků (AB, AAB, ABC a další), dítě vybere ze tří možností, co v řadě bude dál. Deset řad, hvězdičky, postupně těžší.
- **Sčítání** (`scitani/`): sečtení dvou čísel, u menších součtů s obrázky, dítě vybere výsledek ze tří možností. Deset příkladů (od součtu do 4 po součet do 20), hvězdičky.
- **Taxík na dálnici** (`taxi/`): taxík jede po třípruhové dálnici, šipkami mění pruh a tlačítkem Skoč přeskakuje auta. Deset úseků, každý těžší, hvězdička za úsek bez nárazu, pauza a osmibitová hudba generovaná v prohlížeči (vypne se tlačítkem zvuku).
- **Ohniště** (`ohen/`): klidná hra bez bodů a kol. Uprostřed hoří oheň (kreslený na canvas z částic), který pomalu uhasíná. Tlačítkem se přikládá polínko a podle množství paliva je oheň vyšší nebo nižší. Když se dřeva přidá moc, oheň vystřelí a vyletí z něj třeba buřt nebo ponožka a Bobík se červená, když oheň zhasne, nad uhlíky se vznáší 💤 a polínkem se zapálí znovu. Hlas občas řekne, že je oheň malý nebo že je hezký.
- **Psaní** (`psani/`): obtahování psacích písmen české abecedy prstem (malá a velká) podle vzorových listů ze stránek [pisanka.cz](https://pisanka.cz/): předlohou je výřez originálního listu včetně směrových šipek (`psani/pismena/`, popis v `psani/pismena-data.js`), vyhodnocuje se podle logické masky písmene, háčky a čárky jsou doplněné ručně. Hra vyhodnotí, kolik je obtaženo, a ukáže žlutě, co chybí.

Hry nic neodesílají na internet, nemají přihlášení ani reklamy. Jediné, co se ukládá, je v prohlížeči dítěte hvězdička u hotových písmen.

## Lokální spuštění
Hry jsou statické, stačí spustit jednoduchý server v kořeni projektu a otevřít `http://localhost:8765/`:

```
python3 -m http.server 8765
```

Z mobilu na stejné wifi otevři `http://<IP-adresa-počítače>:8765/`.

## Struktura
- `index.html`: rozcestník s výběrem třídy (obrázky v `obrazky/`). Novou hru přidáš do seznamu `HRY` v `index.html` a nastavíš jí třídu, např. `trida: [2]`.
- `robot/`, `abeceda/`, `psani/`, `rady/`, `scitani/`, `taxi/`, `ohen/`: jednotlivé hry, každá má `index.html` a složku `zvuky/` s hlasem (mp3)
- `spolecne/`: sdílený kód (`spolecne.js`, `spolecne.css`) a česká abeceda s příklady (`pismena.js`)
- `spolecne/spolecne.js`: načítací obrazovka "Bobík se připravuje" stáhne všechny hlasy do mezipaměti prohlížeče, po změně nahrávek zvyš `VERZE_HLASU`
- `tools/generuj.py`: hlas Abecedy a Psaní přes ElevenLabs (model `eleven_v3`, rodilý český hlas Michaela)
- `robot/generuj-hlas.py`: totéž pro Robota Bobíka

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
