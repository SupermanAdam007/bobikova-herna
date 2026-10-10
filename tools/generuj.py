#!/usr/bin/env python3
"""Předgeneruje hlas pro hry Abeceda a Psaní přes ElevenLabs.

Klíč se čte z proměnné prostředí ELEVENLABS_APIKEY a nikam se nezapisuje.
    source ~/.zshrc && python3 tools/generuj.py            # jen chybějící nahrávky
    source ~/.zshrc && python3 tools/generuj.py --znovu    # vše znovu
    source ~/.zshrc && python3 tools/generuj.py --over     # přepíše nahrávky na text (kontrola výslovnosti)
Důležitá je správná čeština, proto se u písmen používá výslovnost (např. "bé", "dlouhé á", "e s háčkem").
"""
import json, os, re, sys, urllib.request, urllib.error
import time

KEY = os.environ.get("ELEVENLABS_APIKEY") or os.environ.get("ELEVENLABS_API_KEY")
if not KEY:
    sys.exit("Chybí ELEVENLABS_APIKEY (zkus: source ~/.zshrc)")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Eleven v3 + rodilý český hlas z knihovny (anglický hlas Charlie vyslovoval české hlásky špatně).
MODEL = "eleven_v3"
HLAS = "vdZa6jplen8RQdIWzOGX"  # Michaela: česká učitelka, klidný a srozumitelný rodilý hlas

def nacti(jmeno):
    t = open(os.path.join(ROOT, "spolecne", "pismena.js"), encoding="utf-8").read()
    m = re.search(r"const %s = (\[.*?\n\]);" % jmeno, t, re.S)
    return json.loads(m.group(1))

PISMENA, SLOVA = nacti("PISMENA"), nacti("SLOVA")

# (složka, název souboru, emoce, text)
KLIPY = []
def pridej(hra, nazev, emoce, text): KLIPY.append((hra, nazev, emoce, text))

# ---------- Abeceda ----------
pridej("abeceda", "ahoj", "[cheerfully]", "Ahoj! Já jsem písmenkový kamarád. Klepni na písmeno a já ti ho přečtu.")
for i, t in enumerate(["Správně!", "Výborně!", "To je ono!", "Skvělé!"], 1):
    pridej("abeceda", f"spravne{i}", "[very excited]", t)
for i, t in enumerate(["To není ono. Zkus to znovu!", "Skoro! Zkus to ještě jednou."], 1):
    pridej("abeceda", f"zkus{i}", "[friendly]", t)
pridej("abeceda", "otazka", "[curious]", "S jakým písmenem začíná tohle slovo?")
pridej("abeceda", "konec", "[very excited, cheering]", "Hotovo! Jsi skvělý čtenář!")
for p in PISMENA:
    if p["kde"] == "zacatek":
        pridej("abeceda", "karta_" + p["id"], "", f"Písmeno {p['jmeno']}, jako {p['slovo']}.")
    else:
        pridej("abeceda", "karta_" + p["id"], "", f"Písmeno {p['jmeno']} je ve slově {p['slovo']}.")
    pridej("abeceda", "najdi_" + p["id"], "", f"Najdi písmeno {p['jmeno']}.")
    if p["m3"]:
        pridej("abeceda", "slovo_" + p["id"], "", f"Tohle je {p['slovo']}.")

# ---------- Psaní ----------
pridej("psani", "ahoj", "[cheerfully]", "Ahoj! Obtáhni písmeno prstem. Drž se čáry!")
for i, t in enumerate(["Krásně napsáno!", "Výborně, to se ti povedlo!", "Šikulka! Tak se to píše!"], 1):
    pridej("psani", f"skvele{i}", "[very excited]", t)
for i, t in enumerate(["Skoro! Zkus to ještě jednou a drž se čáry.", "Ještě něco chybí. Podívej se na žlutá místa."], 1):
    pridej("psani", f"zkus{i}", "[friendly]", t)
pridej("psani", "konec", "[very excited, cheering]", "Máš to všechno! Jsi výborný písmenkář!")
for p in PISMENA:
    pridej("psani", "obtahni_" + p["id"], "", f"Obtáhni písmeno {p['jmeno']}.")
for s in SLOVA:
    pridej("psani", "slovo_" + s["id"], "", f"Obtáhni slovo {s['text']}.")

def multipart(soubor):
    h = "----hranice"
    telo = (f'--{h}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n'
            f'--{h}\r\nContent-Disposition: form-data; name="language_code"\r\n\r\nces\r\n'
            f'--{h}\r\nContent-Disposition: form-data; name="file"; filename="a.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n').encode()
    telo += open(soubor, "rb").read() + f"\r\n--{h}--\r\n".encode()
    return telo, "multipart/form-data; boundary=" + h

def generuj(k):
    hra, nazev, emoce, text = k
    slozka = os.path.join(ROOT, hra, "zvuky"); os.makedirs(slozka, exist_ok=True)
    cil = os.path.join(slozka, nazev + ".mp3")
    # --od=EPOCH: přegeneruje jen soubory starší než daný čas (pokračování po přerušeném běhu)
    od = next((float(a[5:]) for a in sys.argv if a.startswith("--od=")), None)
    if os.path.exists(cil) and "--znovu" not in sys.argv and (od is None or os.path.getmtime(cil) >= od):
        return f"přeskakuji {hra}/{nazev}"
    body = json.dumps({"text": (emoce + " " + text).strip(), "model_id": MODEL, "language_code": "cs"}).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{HLAS}?output_format=mp3_44100_128",
        data=body, headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    for pokus in range(4):   # při výpadku sítě to zkusí znovu
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            open(cil, "wb").write(data)
            return f"hotovo {hra}/{nazev}"
        except urllib.error.HTTPError as e:
            if e.code == 429 and pokus < 3: time.sleep(5); continue
            return f"CHYBA {hra}/{nazev} {e.code} {e.read().decode()[:200]}"
        except (urllib.error.URLError, TimeoutError, OSError):
            time.sleep(5 * (pokus + 1))
    return f"CHYBA {hra}/{nazev} síť nedostupná"

def over(k):
    hra, nazev, _, text = k
    cil = os.path.join(ROOT, hra, "zvuky", nazev + ".mp3")
    telo, typ = multipart(cil)
    req = urllib.request.Request("https://api.elevenlabs.io/v1/speech-to-text", data=telo,
                                 headers={"xi-api-key": KEY, "Content-Type": typ})
    try:
        with urllib.request.urlopen(req) as r:
            return f"{hra}/{nazev}\n   chceme: {text}\n   slyšíme: {json.loads(r.read()).get('text')}"
    except urllib.error.HTTPError as e:
        return f"CHYBA {hra}/{nazev} {e.code}"

if __name__ == "__main__":
    fn = over if "--over" in sys.argv else generuj
    filtr = [a for a in sys.argv[1:] if not a.startswith("--")]
    klipy = [k for k in KLIPY if not filtr or any(f in k[0] + "/" + k[1] for f in filtr)]
    print(len(klipy), "nahrávek")
    # Po jedné nahrávce: bezplatný účet povoluje jen 2 souběžné dotazy a při dávce naráz ho ElevenLabs zablokuje.
    for k in klipy:
        v = fn(k)
        if v.startswith("přeskakuji"): continue
        print(v, flush=True)
        if " 401 " in v:
            sys.exit("ElevenLabs zablokoval přístup (401). Počkej nebo to vyřeš na účtu, pak spusť znovu.")
        if " 429 " in v:
            time.sleep(5); print(fn(k), flush=True)
        time.sleep(0.4)
