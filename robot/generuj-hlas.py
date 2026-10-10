#!/usr/bin/env python3
"""Předgeneruje hlas robota Bobíka přes ElevenLabs do složky zvuky/.

Spuštění (klíč se čte z proměnné prostředí, nikam se nezapisuje):
    source ~/.zshrc && python3 generuj-hlas.py            # vygeneruje jen chybějící
    source ~/.zshrc && python3 generuj-hlas.py --znovu    # přegeneruje vše
"""
import json, os, sys, urllib.request, urllib.error

KEY = os.environ.get("ELEVENLABS_APIKEY") or os.environ.get("ELEVENLABS_API_KEY")
if not KEY:
    sys.exit("Chybí ELEVENLABS_APIKEY (zkus: source ~/.zshrc)")

# Eleven v4: nejnovější a nejexpresivnější model, umí česky.
MODEL = "eleven_v4"
# Charlie: hlasitý, energický, veselý hlas. Hodí se pro zábavného robota.
VOICE = "IKne3meq5aSn9XLyUdCD"

HLASKY = {
    "ahoj":      "Ahoj kamarádi! Já jsem robot Bobík. Pomozte mi dojít do cíle!",
    "start1":    "Jedeme!",
    "start2":    "Spouštím program!",
    "start3":    "Jdu na to!",
    "U":         "Nahoru!",
    "D":         "Dolů!",
    "L":         "Doleva!",
    "R":         "Doprava!",
    "pad1":      "Ách jo! Spadl jsem!",
    "pad2":      "Ouha! Tam nebyla cesta!",
    "pad3":      "Auuu! Bác!",
    "oprava":    "Špatný krok jsem smazal. Zkus to jinak!",
    "malo":      "Hmm, ještě nejsem v cíli. Přidej další kroky!",
    "cil1":      "Hurá! Jsem v cíli! Ty jsi ale šikulka!",
    "cil2":      "Jupííí! Dokázali jsme to! Jsi skvělý programátor!",
    "cil3":      "Jsem tam! Jsem tam! Bylo to úžasné!",
    "vse":       "Dokázal jsi všechny úrovně! Jsi mistr programátor!",
    "dalsi":     "Pojďme dál!",
    "plny":      "Program je plný. Zkus ho zkrátit.",
    "prazdny":   "Nejdřív mi řekni, kam mám jít!",
}

# Jak ElevenLabs čte text: v4 reaguje na emoce v hranatých závorkách.
EMOCE = {
    "ahoj": "[cheerfully] ", "start1": "[excited] ", "start2": "[excited] ", "start3": "[excited] ",
    "pad1": "[surprised] ", "pad2": "[surprised] ", "pad3": "[laughing] ",
    "oprava": "[friendly] ", "malo": "[thoughtful] ",
    "cil1": "[very excited, cheering] ", "cil2": "[very excited, cheering] ", "cil3": "[very excited, cheering] ",
    "vse": "[very excited, cheering] ", "dalsi": "[cheerfully] ",
}

znovu = "--znovu" in sys.argv
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "zvuky")
os.makedirs(out, exist_ok=True)

for nazev, text in HLASKY.items():
    cil = os.path.join(out, nazev + ".mp3")
    if os.path.exists(cil) and not znovu:
        print("přeskakuji", nazev); continue
    body = json.dumps({
        "text": EMOCE.get(nazev, "[cheerfully] ") + text,
        "model_id": MODEL,
        "language_code": "cs",
    }).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128",
        data=body, headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as r, open(cil, "wb") as f:
            f.write(r.read())
        print("hotovo", nazev)
    except urllib.error.HTTPError as e:
        print("CHYBA", nazev, e.code, e.read().decode()[:300]); sys.exit(1)
