# Ada škola: programování pro prváky

Podklady k prezentaci o programování pro děti v první třídě a hra **Robot Bobík**, kterou si děti mohou zahrát doma.

## Hra Robot Bobík
Dítě poskládá kroky (nahoru, dolů, doleva, doprava), čemuž říkáme program, a pak ho spustí. Robot ho splní. Když spadne, začne znovu a dítě program opraví. Hra má 7 úrovní, hlas a fanfáry, běží v prohlížeči i na mobilu a nic neodesílá.

Hraje se na adrese stránky z GitHub Pages (odkaz je v popisu repozitáře). Kód z QR kódu vede právě sem.

## Soubory
- `index.html`: přesměruje na hru
- `aplikace/robot.html`: samotná hra (jeden soubor)
- `aplikace/zvuky/`: hlas robota (mp3)
- `aplikace/generuj-hlas.py`: znovu vygeneruje hlas robota přes ElevenLabs (`source ~/.zshrc && python3 generuj-hlas.py --znovu`)
- `plan-prezentace.md`: časový plán na 35 minut
- `hry.md`: hry bez počítače (robot, třídič, vzory)
- `bezpecnost.md`: soukromí a bezpečnost hry
- `checklist.md`: co si připravit
