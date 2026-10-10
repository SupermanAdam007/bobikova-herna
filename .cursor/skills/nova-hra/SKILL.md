---
name: nova-hra
description: Vytvoří novou hru pro Bobíkovu hernu (statický web na GitHub Pages) včetně hlasu, obrázku na dlaždici a zápisu na rozcestník. Použij, když uživatel chce přidat novou hru, nový level typ nebo novou stránku do herny.
---

# Nová hra v Bobíkově herně

Web je čistě statický (HTML, JS, CSS, bez build kroku), hostovaný na GitHub Pages z větve `main`, cesta `/`. Hry jsou pro české děti, QR kód z vizitek vede na rozcestník `index.html`.

## Pevná pravidla her

- Celá hra se vejde na jednu obrazovku mobilu bez scrollování. Používej `dvh`, `vw`, `min()`, `clamp()`.
- Vysoký kontrast (hraje se i na projektoru).
- Hlas je předgenerovaný ElevenLabs, rodilá čeština. Žádný Apple/Web Speech hlas.
- Nic se neodesílá na internet, neptá se na jména, žádné externí knihovny, fonty ani CDN.
- Odkazy vždy s `index.html` (kvůli otevírání přes `file://`).
- Texty česky, bez em-dashů a bez dvojitých pomlček.
- Commit jedna věta česky. Nikdy nepushuj bez výslovného "push" od uživatele. Před pushem proběhne kontrola syntaxe a nahlásí se výsledek (viz níže).

## Postup

1. **Složka a stránka.** Vytvoř `nazev/index.html` podle `abeceda/index.html` nebo `rady/index.html` (nejjednodušší vzor). Povinné části:
   - `<link rel="stylesheet" href="../spolecne/spolecne.css">`, favicon `../obrazky/bobik-ikona.png`
   - `#top` s odkazem `<a class="domu" href="../index.html">` (logo `../obrazky/bobik.jpg`, text "Herna"), `<h1>` s emoji a názvem, `.hvezdy`, tlačítko `#zvuk`
   - `#hlaska` (krátký řádek textu, volitelný, na širokých obrazovkách bere místo)
   - `<script src="../spolecne/spolecne.js"></script>` a pak vlastní skript
2. **Sdílený modul `Hry`** (`spolecne/spolecne.js`), nevymýšlej vlastní zvuk:
   - `Hry.nactiHlas("zvuky/", jmena).then(() => Hry.rekni("ahoj", {delay:200}))` ukáže loading obrazovku, stáhne a nacachuje všechny klipy, tlačítko "Hrát" odemkne zvuk. Seznam `jmena` musí obsahovat každý klip, který hra použije.
   - `Hry.rekni(jmeno, {delay, interrupt})` přehrává jedním sdíleným přehrávačem (nikdy víc hlasů najednou). Když existují klipy `jmeno1`, `jmeno2`..., vybere náhodně variantu, takže `rekni("spravne")` funguje.
   - `Hry.zvuky.klik/spravne/spatne/fanfara`, `Hry.nastavTlacitkoZvuku(el)`, `Hry.oslava(bezchyby, text)`, `Hry.uklidOslavu()`, `Hry.zastav()`, `Hry.sleep(ms)`, `Hry.uloz/nacti`.
   - Struktura kola: `KOL = 10`, hvězdičky `⭐ body/KOL`, chyba v kole znamená bod nepřidat, na konci `fanfara` + `oslava` + klip `konec` + tlačítko "Hrát znovu".
3. **Hlas.** V `tools/generuj.py` přidej sekci přes `pridej("nazev", "klip", "[emoce]", "Text")`. Hlas Michaela (Abeceda, Psaní, Řady), model `eleven_v3`, `language_code: "cs"`.
   - Klíč je jen v env proměnné `ELEVENLABS_APIKEY` (`zsh -ic '...'` kvůli `~/.zshrc`). Nikdy ho nevypisuj ani neukládej do repa.
   - Generování: `python3 tools/generuj.py nazev`. Kontrola výslovnosti přepisem: `python3 tools/generuj.py --over nazev` (porovná "chceme" a "slyšíme"). Špatné klipy smaž a vygeneruj znovu, případně přeformuluj text. Velmi krátké věty (například "Co bude dál?") se často přečtou špatně, přidej slova navíc.
   - Pozor na `ř`, `š` a krátké slabiky (písmena se pojmenovávají "ře", "še"). Výslovnost musí být správná česky.
   - Klipy jsou `nazev/zvuky/*.mp3`, commitují se do repa.
   - Když měníš existující klipy, zvyš `VERZE_HLASU` v `spolecne/spolecne.js`, jinak si děti ponechají starou cache. Pro novou hru není nutné.
4. **Obrázek dlaždice.** Skill `openrouter-image`, poměr `3:2`, jednotný veselý plochý kreslený styl (krémové pozadí, modrý robot Bobík jako maskot, bez textu). Ulož jako `obrazky/nazev.jpg` (`sips -s format jpeg -s formatOptions 82`, PNG smaž). Obrázek si před commitem prohlédni.
5. **Rozcestník.** V `index.html` přidej položku do pole `HRY`:
   ```js
   { trida: [1], href: "nazev/index.html", obrazek: "obrazky/nazev.jpg", alt: "Popis obrázku",
     nazev: "🔁 Název hry", popis: "Jedna věta, co dítě dělá." },
   ```
   `trida` je pole ročníků (1 až 5), víc tříd najednou je možné.
6. **Dokumentace.** Dopiš hru do `README.md` (seznam her a složka `nazev/`). Pokud šla o nápad z `hry.md`, uprav ho tam.
7. **Kontrola.** Vždy proběhne před commitem:
   - Skript z každé změněné stránky: vytáhni obsah `<script>` a spusť `node --check`.
   - `python3 -c "import ast; ast.parse(open('tools/generuj.py').read())"`
   - Lokální server (`python3 -m http.server PORT`), otevři hru v prohlížeči (`cursor-ide-browser`), klikni na "Hrát" (loading overlay má `z-index:1000`), udělej screenshot v mobilní šířce kolem 390 px a ověř, že se vše vejde.
   - Na konci uklidit své servery a profily Chrome, nepoužívej `pkill` na cizí procesy.
8. **Commit a push.** `git add -A && git commit -m "Jedna věta česky."` Potom nahlásit výsledek kontroly a počkat na "push". Nikdy neřetěz commit a push.

## Tipy

- Chybové hlášky dětem nepiš textem, mluví hlas (děti nečtou plynule).
- Obtížnost stupňuj uvnitř jednoho kola hry (například pole jednotek podle čísla kola v `rady/index.html`).
- Emoji se na různých zařízeních vykreslují různě, ověř, že nic nevypadá dvojznačně.
