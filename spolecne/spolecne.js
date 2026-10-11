// Společný kód pro hry: zvuky, hlas, konfety. Žádné externí služby, všechno běží v prohlížeči.
const Hry = (() => {
  let muted = false, actx = null, confettiRun = 0, odemceno = false;
  const voices = {};
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function audio() {
    if (!actx) { const A = window.AudioContext || window.webkitAudioContext; if (A) actx = new A(); }
    if (actx && actx.state === "suspended") actx.resume();
    return actx;
  }

  function tone(freq, dur, { type = "square", vol = 0.15, delay = 0, slide = 0 } = {}) {
    if (muted) return;
    const a = audio(); if (!a) return;
    const t = a.currentTime + delay;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + 0.05);
  }

  const zvuky = {
    klik() { tone(660, 0.1, { type: "triangle", vol: 0.25 }); },
    spravne() { [523, 659, 784].forEach((f, i) => tone(f, 0.14, { type: "triangle", vol: 0.22, delay: i * 0.09 })); },
    spatne() { tone(220, 0.22, { type: "sawtooth", vol: 0.13 }); tone(180, 0.3, { type: "sawtooth", vol: 0.13, delay: 0.2 }); },
    fanfara() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, { type: "sawtooth", vol: 0.14, delay: i * 0.15 }));
      [523, 659, 784, 1047].forEach(f => tone(f, 0.9, { type: "sawtooth", vol: 0.1, delay: 0.7 }));
      [1319, 1568, 2093].forEach((f, i) => tone(f, 0.15, { type: "triangle", vol: 0.12, delay: 1.0 + i * 0.1 }));
    },
  };

  // Nahrávky hlasu ze složky zvuky/. jmena je seznam názvů souborů bez .mp3.
  // Hra se nejdřív načte pod obrazovkou "Bobík se připravuje": všechny nahrávky se stáhnou, uloží do
  // mezipaměti prohlížeče (Cache API, příště je to hned) a změní se na lokální adresy, takže se pak
  // přehrávají bez čekání. Na konci je velké tlačítko "Hrát", které zároveň odemkne zvuk na mobilu.
  // Změníš-li nahrávky, zvyš VERZE_HLASU, ať si je uživatelé stáhnou znovu.
  const VERZE_HLASU = "2026-10-11a";
  const player = new Audio();

  function obrazovkaNacitani(logo) {
    const ov = document.createElement("div");
    ov.style.cssText = "position:fixed;inset:0;z-index:1000;background:#1f2a5a;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:20px;text-align:center;font-family:'Trebuchet MS','Comic Sans MS',sans-serif";
    ov.innerHTML =
      '<img alt="" src="' + logo + '" style="width:min(32vw,28dvh);height:min(32vw,28dvh);border-radius:50%;border:5px solid #ffe066;object-fit:cover">' +
      '<div class="t" style="font-size:clamp(20px,5dvh,34px);font-weight:bold">Bobík se připravuje...</div>' +
      '<div style="width:min(80vw,380px);height:18px;border-radius:9px;background:#3b4a8f;overflow:hidden"><div class="p" style="height:100%;width:0;background:#ffe066;transition:width .15s"></div></div>' +
      '<div class="c" style="font-size:16px;opacity:.85">0 %</div>';
    document.body.appendChild(ov);
    return {
      postup(v) { ov.querySelector(".p").style.width = Math.round(v * 100) + "%"; ov.querySelector(".c").textContent = Math.round(v * 100) + " %"; },
      hotovo() {
        return new Promise(resolve => {
          ov.querySelector(".t").textContent = "Hotovo! Můžeme hrát.";
          ov.querySelector(".c").innerHTML = '<button type="button" style="font:inherit;font-weight:bold;font-size:clamp(22px,5dvh,34px);background:#e03131;color:#fff;border:none;border-radius:22px;padding:12px 40px;cursor:pointer;box-shadow:0 5px 0 rgba(0,0,0,.4)">Hrát ▶</button>';
          ov.querySelector(".p").parentNode.style.display = "none";
          ov.querySelector("button").onclick = () => { odemkni(); ov.remove(); resolve(); };
          ov.querySelector("button").focus(); // na počítači stačí stisknout Enter
        });
      },
    };
  }

  async function stahni(url, mezipamet) {
    const klic = url + "?v=" + VERZE_HLASU;
    try {
      let odp = mezipamet && await mezipamet.match(klic);
      if (!odp) {
        odp = await fetch(url);
        if (!odp.ok) throw new Error(odp.status);
        if (mezipamet) { try { await mezipamet.put(klic, odp.clone()); } catch (e) {} }
      }
      return URL.createObjectURL(await odp.blob());
    } catch (e) { return url; }   // nepovedlo se (třeba soubor otevřený z disku): přehraje se přímo ze souboru
  }

  // Vrací Promise, který skončí, až jsou nahrávky načtené a dítě klepne na "Hrát".
  async function nactiHlas(slozka, jmena, { logo = "../obrazky/bobik.jpg" } = {}) {
    jmena.forEach(n => { voices[n] = slozka + n + ".mp3"; });
    const ov = obrazovkaNacitani(logo);
    let mezipamet = null;
    try { mezipamet = window.caches ? await caches.open("bobik-hlas") : null; } catch (e) {}
    if (mezipamet) {   // smaž nahrávky starších verzí
      try { for (const k of await mezipamet.keys()) if (!k.url.endsWith("?v=" + VERZE_HLASU)) await mezipamet.delete(k); } catch (e) {}
    }
    const fronta = jmena.slice(); let hotove = 0;
    const pracovnik = async () => {
      while (fronta.length) {
        const n = fronta.shift();
        voices[n] = await stahni(voices[n], mezipamet);
        ov.postup(++hotove / jmena.length);
      }
    };
    await Promise.all(Array.from({ length: 6 }, pracovnik));
    await ov.hotovo();
  }

  // rekni("spravne") vybere náhodně spravne1..spravne9, pokud přesný název neexistuje.
  // Vrací Promise, který skončí s koncem nahrávky.
  let poradi = 0;
  function rekni(jmeno, { delay = 0, interrupt = true } = {}) {
    return new Promise(resolve => {
      if (muted) return resolve();
      const moznosti = voices[jmeno] ? [jmeno]
        : Object.keys(voices).filter(n => n.startsWith(jmeno) && /^\d$/.test(n.slice(jmeno.length)));
      if (!moznosti.length) return resolve();
      setTimeout(() => {
        if (muted) return resolve();
        const url = voices[moznosti[(Math.random() * moznosti.length) | 0]];
        const moje = ++poradi;
        player.pause();
        player.src = url;
        player.onended = () => { if (moje === poradi) resolve(); };
        player.play().catch(() => { if (moje === poradi) resolve(); });
        setTimeout(resolve, 8000);
      }, delay);
    });
  }
  function zastav() { poradi++; player.pause(); }

  // Safari a mobily povolí přehrát zvuk až po dotyku: jednou odemkneme společný přehrávač tichým záznamem.
  const TICHO = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
  function odemkni() {
    if (odemceno) return; odemceno = true;
    audio();
    if (!player.src || player.paused) {
      const puvodni = player.src;
      if (!puvodni) { player.src = TICHO; const p = player.play(); if (p && p.catch) p.catch(() => {}); }
    }
  }
  window.addEventListener("pointerdown", odemkni, { passive: true });

  function nastavTlacitkoZvuku(btn) {
    btn.onclick = () => {
      muted = !muted; btn.textContent = muted ? "🔇" : "🔊";
      if (muted) zastav(); else zvuky.klik();
    };
  }

  // ---------- Konfety a nápis ----------
  function vytvorVrstvy() {
    if (document.getElementById("confetti")) return;
    const cv = document.createElement("canvas"); cv.id = "confetti";
    const bn = document.createElement("div"); bn.id = "banner";
    document.body.append(cv, bn);
  }

  function oslava(velka, text) {
    vytvorVrstvy();
    const cv = document.getElementById("confetti"), ctx = cv.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const barvy = ["#ff6b6b", "#ffd43b", "#51cf66", "#4dabf7", "#da77f2", "#ff922b"];
    const dily = [];
    const salvy = velka ? 3 : 2;
    for (let b = 0; b < salvy; b++) {
      const cx = innerWidth * (salvy === 2 ? 0.25 + b * 0.5 : 0.2 + b * 0.3);
      for (let i = 0; i < (velka ? 90 : 70); i++) {
        const a = Math.random() * Math.PI * 2, v = 6 + Math.random() * 9;
        dily.push({ x: cx, y: innerHeight * 0.45, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6,
          w: 6 + Math.random() * 8, h: 4 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .4,
          c: barvy[(Math.random() * barvy.length) | 0], zpozdeni: b * 12 });
      }
    }
    for (let i = 0; i < 40; i++)
      dily.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * 200, vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3,
        w: 6 + Math.random() * 8, h: 4 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .3,
        c: barvy[(Math.random() * barvy.length) | 0], zpozdeni: 20 });
    const id = ++confettiRun; let f = 0;
    (function tik() {
      if (id !== confettiRun) return;
      ctx.clearRect(0, 0, innerWidth, innerHeight); f++;
      let zije = false;
      for (const p of dily) {
        if (f < p.zpozdeni) { zije = true; continue; }
        p.vy += 0.28; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        if (p.y < innerHeight + 30) zije = true; else continue;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      }
      if (zije && f < 300) requestAnimationFrame(tik); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })();
    const bn = document.getElementById("banner");
    bn.textContent = text || "🎉 Hurá! 🎉";
    bn.classList.remove("show"); void bn.offsetWidth; bn.classList.add("show");
  }
  function uklidOslavu() {
    confettiRun++;
    const cv = document.getElementById("confetti");
    if (cv) cv.getContext("2d").clearRect(0, 0, 1e5, 1e5);
    const bn = document.getElementById("banner"); if (bn) bn.classList.remove("show");
  }

  function uloz(klic, hodnota) { try { localStorage.setItem(klic, JSON.stringify(hodnota)); } catch (e) {} }
  function nacti(klic, vychozi) { try { const v = localStorage.getItem(klic); return v ? JSON.parse(v) : vychozi; } catch (e) { return vychozi; } }

  return { sleep, tone, zvuky, nactiHlas, rekni, zastav, nastavTlacitkoZvuku, oslava, uklidOslavu, uloz, nacti,
           get ztlumeno() { return muted; } };
})();
