#!/usr/bin/env python3
"""Vygeneruje hlas pro hry Abeceda a Psaní bezplatně na macOS českým hlasem Zuzana (příkaz `say`).

Proč ne ElevenLabs: české hlásky (ě, š, č, ř, ž, ý, á, í) a názvy písmen vyslovovala špatně.
Systémový český hlas je vyslovuje správně, funguje bez internetu a bez kreditů.

    python3 tools/generuj-lokalne.py            # vše znovu
    python3 tools/generuj-lokalne.py abeceda/karta_s2   # jen vybrané nahrávky
"""
import os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RYCHLOST = 135   # slov za minutu: pomaleji než běžná řeč, ať děti rozumí

# seznam nahrávek a textů je společný s tools/generuj.py
os.environ.setdefault("ELEVENLABS_APIKEY", "nepouziva-se")
import importlib.util
spec = importlib.util.spec_from_file_location("g", os.path.join(ROOT, "tools", "generuj.py"))
g = importlib.util.module_from_spec(spec); spec.loader.exec_module(g)

def cisty_text(t):
    t = re.sub(r"\[[^\]]*\]", "", t)       # emoční značky ElevenLabs
    return re.sub(r"\s+", " ", t).strip()

filtr = [a for a in sys.argv[1:] if not a.startswith("--")]
klipy = [k for k in g.KLIPY if not filtr or any(f in k[0] + "/" + k[1] for f in filtr)]
for hra, nazev, _, text in klipy:
    slozka = os.path.join(ROOT, hra, "zvuky"); os.makedirs(slozka, exist_ok=True)
    cil = os.path.join(slozka, nazev + ".mp3")
    with tempfile.TemporaryDirectory() as tmp:
        aiff = os.path.join(tmp, "a.aiff")
        subprocess.run(["say", "-v", "Zuzana", "-r", str(RYCHLOST), "-o", aiff, cisty_text(text)], check=True)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", aiff, "-ar", "44100", "-ac", "1", "-b:a", "96k", cil], check=True)
    print("hotovo", hra + "/" + nazev, "|", cisty_text(text))
