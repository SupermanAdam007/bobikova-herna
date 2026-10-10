// Česká abeceda (42 písmen). Čte ji prohlížeč i generátor hlasu (tools/generuj.py), proto je to čisté JSON.
const PISMENA = [
 {
  "id": "a",
  "velke": "A",
  "male": "a",
  "jmeno": "a",
  "slovo": "auto",
  "emoji": "🚗",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "a2",
  "velke": "Á",
  "male": "á",
  "jmeno": "dlouhé á",
  "slovo": "áčko",
  "emoji": "🅰️",
  "kde": "zacatek",
  "m3": false
 },
 {
  "id": "b",
  "velke": "B",
  "male": "b",
  "jmeno": "bé",
  "slovo": "bota",
  "emoji": "👢",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "c",
  "velke": "C",
  "male": "c",
  "jmeno": "cé",
  "slovo": "citron",
  "emoji": "🍋",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "c2",
  "velke": "Č",
  "male": "č",
  "jmeno": "čé",
  "slovo": "čokoláda",
  "emoji": "🍫",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "d",
  "velke": "D",
  "male": "d",
  "jmeno": "dé",
  "slovo": "dort",
  "emoji": "🎂",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "d2",
  "velke": "Ď",
  "male": "ď",
  "jmeno": "ďé",
  "slovo": "loď",
  "emoji": "⛵",
  "kde": "uvnitr",
  "m3": false
 },
 {
  "id": "e",
  "velke": "E",
  "male": "e",
  "jmeno": "e",
  "slovo": "elefant",
  "emoji": "🐘",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "e2",
  "velke": "É",
  "male": "é",
  "jmeno": "dlouhé é",
  "slovo": "mléko",
  "emoji": "🥛",
  "kde": "uvnitr",
  "m3": false
 },
 {
  "id": "e3",
  "velke": "Ě",
  "male": "ě",
  "jmeno": "e s háčkem",
  "slovo": "děti",
  "emoji": "🧒",
  "kde": "uvnitr",
  "m3": false
 },
 {
  "id": "f",
  "velke": "F",
  "male": "f",
  "jmeno": "ef",
  "slovo": "fotbal",
  "emoji": "⚽",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "g",
  "velke": "G",
  "male": "g",
  "jmeno": "gé",
  "slovo": "gorila",
  "emoji": "🦍",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "h",
  "velke": "H",
  "male": "h",
  "jmeno": "há",
  "slovo": "hruška",
  "emoji": "🍐",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "ch",
  "velke": "Ch",
  "male": "ch",
  "jmeno": "chá",
  "slovo": "chleba",
  "emoji": "🍞",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "i",
  "velke": "I",
  "male": "i",
  "jmeno": "i",
  "slovo": "iglú",
  "emoji": "🧊",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "i2",
  "velke": "Í",
  "male": "í",
  "jmeno": "dlouhé í",
  "slovo": "víla",
  "emoji": "🧚",
  "kde": "uvnitr",
  "m3": false
 },
 {
  "id": "j",
  "velke": "J",
  "male": "j",
  "jmeno": "jé",
  "slovo": "jablko",
  "emoji": "🍎",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "k",
  "velke": "K",
  "male": "k",
  "jmeno": "ká",
  "slovo": "kočka",
  "emoji": "🐱",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "l",
  "velke": "L",
  "male": "l",
  "jmeno": "el",
  "slovo": "lev",
  "emoji": "🦁",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "m",
  "velke": "M",
  "male": "m",
  "jmeno": "em",
  "slovo": "medvěd",
  "emoji": "🐻",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "n",
  "velke": "N",
  "male": "n",
  "jmeno": "en",
  "slovo": "nos",
  "emoji": "👃",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "n2",
  "velke": "Ň",
  "male": "ň",
  "jmeno": "eň",
  "slovo": "kůň",
  "emoji": "🐴",
  "kde": "uvnitr",
  "m3": false
 },
 {
  "id": "o",
  "velke": "O",
  "male": "o",
  "jmeno": "o",
  "slovo": "oko",
  "emoji": "👁️",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "o2",
  "velke": "Ó",
  "male": "ó",
  "jmeno": "dlouhé ó",
  "slovo": "kóla",
  "emoji": "🥤",
  "kde": "uvnitr",
  "m3": false
 },
 {
  "id": "p",
  "velke": "P",
  "male": "p",
  "jmeno": "pé",
  "slovo": "pes",
  "emoji": "🐶",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "q",
  "velke": "Q",
  "male": "q",
  "jmeno": "kvé",
  "slovo": "quokka",
  "emoji": "🦘",
  "kde": "zacatek",
  "m3": false
 },
 {
  "id": "r",
  "velke": "R",
  "male": "r",
  "jmeno": "er",
  "slovo": "rak",
  "emoji": "🦞",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "r2",
  "velke": "Ř",
  "male": "ř",
  "jmeno": "ře",
  "slovo": "řeka",
  "emoji": "🏞️",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "s",
  "velke": "S",
  "male": "s",
  "jmeno": "es",
  "slovo": "slunce",
  "emoji": "☀️",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "s2",
  "velke": "Š",
  "male": "š",
  "jmeno": "še",
  "slovo": "šnek",
  "emoji": "🐌",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "t",
  "velke": "T",
  "male": "t",
  "jmeno": "té",
  "slovo": "telefon",
  "emoji": "📞",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "t2",
  "velke": "Ť",
  "male": "ť",
  "jmeno": "ťé",
  "slovo": "ťapka",
  "emoji": "🐾",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "u",
  "velke": "U",
  "male": "u",
  "jmeno": "u",
  "slovo": "ucho",
  "emoji": "👂",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "u2",
  "velke": "Ú",
  "male": "ú",
  "jmeno": "dlouhé ú",
  "slovo": "úl",
  "emoji": "🐝",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "u3",
  "velke": "Ů",
  "male": "ů",
  "jmeno": "u s kroužkem",
  "slovo": "dům",
  "emoji": "🏠",
  "kde": "uvnitr",
  "m3": false
 },
 {
  "id": "v",
  "velke": "V",
  "male": "v",
  "jmeno": "vé",
  "slovo": "vlak",
  "emoji": "🚂",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "w",
  "velke": "W",
  "male": "w",
  "jmeno": "dvojité vé",
  "slovo": "wifi",
  "emoji": "📶",
  "kde": "zacatek",
  "m3": false
 },
 {
  "id": "x",
  "velke": "X",
  "male": "x",
  "jmeno": "iks",
  "slovo": "xylofon",
  "emoji": "🎶",
  "kde": "zacatek",
  "m3": false
 },
 {
  "id": "y",
  "velke": "Y",
  "male": "y",
  "jmeno": "ypsilon",
  "slovo": "myš",
  "emoji": "🐭",
  "kde": "uvnitr",
  "m3": false
 },
 {
  "id": "y2",
  "velke": "Ý",
  "male": "ý",
  "jmeno": "dlouhé ypsilon",
  "slovo": "býk",
  "emoji": "🐂",
  "kde": "uvnitr",
  "m3": false
 },
 {
  "id": "z",
  "velke": "Z",
  "male": "z",
  "jmeno": "zet",
  "slovo": "zebra",
  "emoji": "🦓",
  "kde": "zacatek",
  "m3": true
 },
 {
  "id": "z2",
  "velke": "Ž",
  "male": "ž",
  "jmeno": "žet",
  "slovo": "žába",
  "emoji": "🐸",
  "kde": "zacatek",
  "m3": true
 }
];

// Slova k obtahování ve hře Psaní (id je jen název souboru s hlasem).
const SLOVA = [
 {"id":"mama","text":"máma"},{"id":"deda","text":"děda"},{"id":"kocka","text":"kočka"},{"id":"skola","text":"škola"},
 {"id":"reka","text":"řeka"},{"id":"oko","text":"oko"},{"id":"hlava","text":"hlava"},{"id":"ruka","text":"ruka"},
 {"id":"noha","text":"noha"},{"id":"kolo","text":"kolo"}
];
