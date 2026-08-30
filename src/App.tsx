import React, { useState, useEffect } from "react";

/* ==================================================================
   CORDA — baseline sito v3
   Piattaforma di coaching per iRacing.

   ---- COME CARICARE I TUOI MEDIA ----
   Metti l'URL del file dentro MEDIA qui sotto, accanto al codice dello
   slot. Il placeholder sparisce da solo e al suo posto compare il tuo
   video (in loop, muto) o la tua immagine. Non serve toccare altro.

   Esempio:  V01: "https://.../onboard-monza.mp4",
   ================================================================== */

const MEDIA = {
  V01: null, // hero — onboard iRacing, loop 8-12s, senza audio
  V02: null, // come funziona, passo 1 — schermata di ricerca coach
  V03: null, // come funziona, passo 2 — sessione live vista dal coach
  V04: null, // come funziona, passo 3 — curva iRating che sale
  I01: null, // ritratto/setup postazione di un coach
  V05: null, // chiusura — montaggio gare, loop lungo
};

/* ------------------------------- dati demo ------------------------------- */

const FASCE = [
  { k: "b1", l: "Sotto 1.5k" },
  { k: "b2", l: "1.5k – 2.5k" },
  { k: "b3", l: "2.5k – 4k" },
  { k: "b4", l: "Sopra 4k" },
];

// punto medio di ogni fascia: usato come iRating di riferimento del
// pilota quando non inserisce il proprio valore esatto
const FASCE_MEDIO = { b1: 1000, b2: 2000, b3: 3250, b4: 5000 };

// come si racconta ogni fascia in una frase, per i messaggi di forbice e
// per il confronto dichiarazione/dati sul profilo del coach
const FASCE_FRASE = {
  b1: "sotto 1.500 iR",
  b2: "tra 1.500 e 2.500 iR",
  b3: "tra 2.500 e 4.000 iR",
  b4: "sopra 4.000 iR",
};

const COACHES = [
  {
    id: 1, nome: "Marco Bertolini", cat: ["coperte"], tag: "vela", lic: "A", ir: 4820, prezzo: 45, fasciaDichiarata: "b2",
    auto: ["Ferrari 296 GT3", "Lamborghini Huracán GT3 EVO"], spec: ["Trail braking", "Qualifica"],
    obiettivi: ["frenata", "qualifica"], irMed: 412, gg: 30, tracciati: 14, agg: "6 ore fa",
    fasce: { b1: [520, 26, 4], b2: [470, 28, 6], b3: [210, 34, 3], b4: null },
    curva: [1980, 1972, 1990, 1966, 1974, 1985, 2040, 2120, 2185, 2240, 2318, 2372, 2396], start: 5,
    patto: null,
    bio: "Ex pilota kart, dieci anni su iRacing. Lavoro quasi solo sul punto di staccata: nella maggior parte dei casi il tempo che manca è lì, non nel setup.",
    metodo: ["Sessione 0: giro tuo, senza correzioni.", "Confronto telemetria curva per curva.",
      "Due curve alla volta, mai di più.", "Compito scritto tra una lezione e l'altra."],
    slots: ["Gio 28 · 20:30", "Ven 29 · 21:00", "Sab 30 · 18:00", "Dom 31 · 20:00"],
    rec: [{ chi: "L. Moretti", auto: "Huracán GT3 · Monza", ir: 564, gg: 22,
      txt: "Mi ha smontato la staccata della prima variante e ricostruita in due sessioni." }],
  },
  {
    id: 2, nome: "Elena Kovač", cat: ["coperte"], tag: "kovi", lic: "A", ir: 5610, prezzo: 60, fasciaDichiarata: "b3",
    auto: ["Porsche 911 GT3 R (992)", "BMW M4 GT3 EVO"], spec: ["Race craft", "Traffico"],
    obiettivi: ["attacco_difesa", "passo_gara"], irMed: 508, gg: 34, tracciati: 11, agg: "2 ore fa",
    fasce: { b1: null, b2: [430, 30, 4], b3: [560, 32, 5], b4: [190, 44, 3] },
    curva: [3120, 3098, 3140, 3105, 3132, 3260, 3348, 3410, 3502, 3560, 3618, 3690, 3712], start: 4,
    patto: null,
    bio: "Il giro secco lo trovi da sola con la telemetria. Quello che non trovi da sola è cosa fare quando hai tre macchine attorno al giro 12.",
    metodo: ["Analisi delle tue ultime cinque gare.", "Doppiaggi e difesa pulita.",
      "In gara insieme, io in macchina con te.", "Debrief a caldo dopo la bandiera."],
    slots: ["Gio 28 · 16:00", "Sab 30 · 15:30", "Dom 31 · 17:00"],
    rec: [{ chi: "A. Rinaldi", auto: "M4 GT3 · Nürburgring", ir: 612, gg: 28,
      txt: "Ho smesso di buttare via gare al primo giro. Sembra poco, vale mezzo campionato." }],
  },
  {
    id: 3, nome: "Davide Sanna", cat: ["coperte"], tag: "sanna_dvd", lic: "B", ir: 3240, prezzo: 35, fasciaDichiarata: "b1",
    auto: ["Lamborghini Huracán GT3 EVO", "Audi R8 LMS EVO II GT3"], spec: ["Setup", "Gomme"],
    obiettivi: ["setup", "gomme"], irMed: 260, gg: 28, tracciati: 22, agg: "1 giorno fa",
    fasce: { b1: [340, 24, 9], b2: [250, 30, 10], b3: [120, 38, 3], b4: null },
    curva: [1640, 1652, 1630, 1648, 1690, 1742, 1780, 1812, 1868, 1890, 1922, 1948, 1960], start: 3,
    patto: { ir: 200, gg: 60 },
    bio: "Faccio setup da otto anni. Non ti vendo il mio file: ti insegno a leggere le pressioni a caldo.",
    metodo: ["Partiamo dal tuo feedback, non dai numeri.", "Una modifica per volta, con run di controllo.",
      "Foglio di lavoro pista per pista.", "Alla fine il setup lo sai rifare senza di me."],
    slots: ["Ven 29 · 21:30", "Sab 30 · 22:00", "Lun 1 · 21:00"],
    rec: [{ chi: "F. Curci", auto: "Huracán GT3 · Monza", ir: 284, gg: 31,
      txt: "Due sessioni e ho capito che il problema era il differenziale, non il posteriore." }],
  },
  {
    id: 4, nome: "Giulia Ferraro", cat: ["coperte"], tag: "giu_f", lic: "B", ir: 2880, prezzo: 25, fasciaDichiarata: "b1",
    auto: ["Ferrari 296 GT3"], spec: ["Fondamentali", "Licenza D"],
    obiettivi: ["traiettorie", "frenata"], irMed: 640, gg: 26, tracciati: 19, agg: "4 ore fa",
    fasce: { b1: [720, 22, 12], b2: [540, 28, 6], b3: null, b4: null },
    curva: [1180, 1164, 1192, 1150, 1210, 1298, 1372, 1450, 1524, 1608, 1690, 1748, 1802], start: 4,
    patto: { ir: 300, gg: 60 },
    bio: "Lavoro con chi ha appena comprato la GT3 e non capisce perché va fuori a ogni curva.",
    metodo: ["Prima le basi: sguardo, riferimenti, rilascio del freno.", "Niente dati finché il giro non è pulito.",
      "Obiettivo: chiudere gare intere senza incidenti.", "Poi, e solo poi, cerchiamo il tempo."],
    slots: ["Sab 30 · 10:30", "Sab 30 · 12:00", "Dom 31 · 11:00"],
    rec: [{ chi: "M. Loprete", auto: "296 GT3 · Watkins Glen", ir: 806, gg: 24,
      txt: "Ero fermo in D da sei mesi. In cinque settimane sono passato in C." }],
  },
  {
    id: 5, nome: "Tom Reeves", cat: ["coperte"], tag: "reeves", lic: "A", ir: 6110, prezzo: 70, fasciaDichiarata: "b4",
    auto: ["Acura ARX-06 GTP", "Mercedes-AMG GT3 2020", "BMW M4 GT3 EVO"], spec: ["Endurance", "Ritmo di stint"],
    obiettivi: ["passo_gara", "strategia"], irMed: 300, gg: 40, tracciati: 9, agg: "8 ore fa",
    fasce: { b1: null, b2: null, b3: [380, 36, 5], b4: [240, 42, 3] },
    curva: [3980, 3962, 3990, 4010, 4055, 4098, 4140, 4188, 4210, 4262, 4290, 4318, 4340], start: 3,
    patto: null,
    bio: "Nelle endurance non vince chi è più veloce, vince chi consegna trenta giri uguali.",
    metodo: ["Simulazione di stint completo.", "Deviazione tra i giri, non il giro migliore.",
      "Procedure pit e cambi guida.", "Piano gara scritto per il tuo evento."],
    slots: ["Sab 30 · 20:00", "Dom 31 · 19:00"],
    rec: [{ chi: "Team Aversa", auto: "AMG GT3 · Sebring 12h", ir: 226, gg: 44,
      txt: "Ci ha riscritto le procedure di pit. Finita la 12h senza un danno." }],
  },
  {
    id: 6, nome: "Niko Aaltonen", cat: ["coperte"], tag: "aalto", lic: "A", ir: 7020, prezzo: 85, fasciaDichiarata: "b4",
    auto: ["Porsche 911 GT3 R (992)", "Mercedes-AMG GT3 2020"], spec: ["Qualifica", "Trail braking"],
    obiettivi: ["qualifica", "frenata"], irMed: 210, gg: 35, tracciati: 6, agg: "3 giorni fa",
    fasce: { b1: null, b2: null, b3: [180, 38, 3], b4: [260, 32, 4] },
    curva: [4820, 4796, 4840, 4812, 4858, 4902, 4940, 4988, 5010, 5044, 5062, 5090, 5110], start: 4,
    patto: null,
    bio: "Prendo solo piloti già sotto il secondo dal riferimento. Se sei più lontano, ti faccio perdere tempo e soldi.",
    metodo: ["Solo giro secco.", "Confronto sui canali freno e sterzo.",
      "Tre curve chiave per pista.", "Sessione singola, torni quando serve."],
    slots: ["Ven 29 · 19:00", "Dom 31 · 18:30"],
    rec: [{ chi: "R. Halme", auto: "911 GT3 R · Road Atlanta", ir: 188, gg: 30,
      txt: "Tre curve, una sessione, quattro decimi. Caro, ma sa dove guardare." }],
  },
  {
    id: 7, nome: "Andrea Pili", cat: ["scoperte"], tag: "pili_a", lic: "A", ir: 4180, prezzo: 40, fasciaDichiarata: "b1",
    auto: ["Dallara F3", "Super Formula Lights", "Ray FF1600"], spec: ["Monoposto", "Staccata"],
    obiettivi: ["frenata", "traiettorie"], irMed: 380, gg: 32, tracciati: 8, agg: "1 giorno fa",
    fasce: { b1: [430, 28, 3], b2: [400, 32, 4], b3: null, b4: null },
    curva: [2260, 2242, 2274, 2250, 2288, 2340, 2402, 2456, 2510, 2548, 2596, 2632, 2660], start: 4,
    patto: null,
    bio: "In monoposto non puoi nasconderti dietro il setup. O gestisci il rilascio del freno o giri lento, punto.",
    metodo: ["Partiamo dalla Ray, sempre, anche se corri in F3.", "Un solo canale alla volta: prima il freno.",
      "Niente aero finché il piede non è pulito.", "Test settimanale sulla stessa pista, per misurare."],
    slots: ["Ven 29 · 19:30", "Sab 30 · 17:00", "Dom 31 · 21:30"],
    rec: [{ chi: "G. Petrosino", auto: "Dallara F3 · Silverstone", ir: 402, gg: 29,
      txt: "Venivo dalle GT e frenavo come un camion. Mi ha rifatto il piede da zero." }],
  },
];

/* ---------------------- "Il mio percorso" — dati pilota (mock) ----------------------
   Tre fonti tenute separate, come da spec:
   - PERCORSO: dati CORDA (interni) — disponibili subito, nessuna API esterna.
   - CALENDARIO_STAGIONE: PLACEHOLDER del calendario ufficiale iRacing. Da sostituire
     con corda-vetture-2026s2.js / la schedule reale quando arriva — per ora piste e
     date sono inventate solo per popolare la selezione "gare che pensi di fare".
   - I riquadri "strato 2" (curva iRating, ultime gare, licenza/SR) non hanno dati
     mock qui apposta: restano nello stato "Collega il tuo account iRacing" finché
     l'integrazione vera non c'è.
   ------------------------------------------------------------------------------- */

const CALENDARIO_STAGIONE = [
  { id: "s1", data: "2026-09-06", pista: "Monza", auto: "Ferrari 296 GT3" },
  { id: "s2", data: "2026-09-13", pista: "Spa-Francorchamps", auto: "Porsche 911 GT3 R (992)" },
  { id: "s3", data: "2026-09-20", pista: "Silverstone", auto: "BMW M4 GT3 EVO" },
  { id: "s4", data: "2026-09-27", pista: "Watkins Glen", auto: "Lamborghini Huracán GT3 EVO" },
  { id: "s5", data: "2026-10-04", pista: "Road Atlanta", auto: "Ferrari 296 GT3" },
  { id: "s6", data: "2026-10-11", pista: "Nürburgring", auto: "Mercedes-AMG GT3 2020" },
  { id: "s7", data: "2026-10-18", pista: "Sebring", auto: "Audi R8 LMS EVO II GT3" },
  { id: "s8", data: "2026-10-25", pista: "Charlotte", auto: "Ferrari 296 GT3" },
];

const PERCORSO = {
  oreAcquistate: 20,
  oreResidue: 6,
  sessioniTotali: 12,
  coachAttualeId: 1, // Marco Bertolini
  dalCoachAttuale: "2026-08-02",
  sessioniConAttuale: 4,
  storicoCoach: [
    { coachId: 3, periodo: "mag – lug 2026", sessioni: 5, irGuadagnato: 180, auto: ["Lamborghini Huracán GT3 EVO"] },
    { coachId: 4, periodo: "mar – apr 2026", sessioni: 3, irGuadagnato: 90, auto: ["Ferrari 296 GT3"] },
  ],
  prenotazioni: [
    { id: "p1", data: "2026-09-05", coachId: 1, orario: "20:30" },
    { id: "p2", data: "2026-09-19", coachId: 1, orario: "21:00" },
  ],
  garePianificateIds: ["s1", "s3", "s5"],
  note: [
    { id: "n1", coachId: 1, data: "2026-08-30", pista: "Monza",
      testo: "Prima variante: stai ancora frenando dritta.", fatto: false },
    { id: "n2", coachId: 1, data: "2026-08-30", pista: "Monza",
      testo: "Lesmo 1: entri lunga per compensare il sottosterzo.", fatto: false },
    { id: "n3", coachId: 1, data: "2026-08-23", pista: null,
      testo: "Parabolica: qui vai bene, non toccare niente.", fatto: true },
  ],
};

const CATEGORIE = [
  { k: "tutte", l: "Tutte le categorie" },
  { k: "coperte", l: "Ruote coperte · GT, prototipi, turismo" },
  { k: "scoperte", l: "Ruote scoperte · Monoposto" },
];

// vetture per macro-categoria, raggruppate per tipologia: i gruppi diventano
// gli <optgroup> del filtro vettura
const AUTO_PER_CAT = {
  coperte: {
    "GT3": [
      "Ferrari 296 GT3", "Porsche 911 GT3 R (992)", "BMW M4 GT3 EVO",
      "Mercedes-AMG GT3 2020", "Audi R8 LMS EVO II GT3", "Lamborghini Huracán GT3 EVO",
      "Chevrolet Corvette Z06 GT3.R", "Ford Mustang GT3", "McLaren 720S GT3 EVO",
      "Acura NSX GT3 EVO 22", "Aston Martin Vantage GT3 EVO",
    ],
    "GT4": [
      "BMW M4 G82 GT4 Evo", "Ford Mustang GT4", "McLaren 570S GT4",
      "Mercedes-AMG GT4", "Aston Martin Vantage GT4", "Porsche 718 Cayman GT4 Clubsport MR",
    ],
    "GTP": [
      "Acura ARX-06 GTP", "BMW M Hybrid V8", "Cadillac V-Series.R GTP",
      "Ferrari 499P", "Porsche 963 GTP",
    ],
    "Prototipi": [
      "Dallara P217", "Ligier JS P320", "HPD ARX-01c", "Radical SR10",
    ],
    "GTE": [
      "BMW M8 GTE", "Chevrolet Corvette C8.R GTE", "Ferrari 488 GTE",
      "Ford GTE", "Porsche 911 RSR",
    ],
    "TCR": [
      "Audi RS3 LMS Gen2 TCR", "Honda Civic Type R TCR",
      "Hyundai Elantra N TCR", "Hyundai Veloster N TCR",
    ],
    "Cup e monomarca": [
      "BMW M2 CS Racing", "Ferrari 296 Challenge", "Global Mazda MX-5 Cup",
      "Porsche 911 Cup (992.2)", "Porsche Mission R", "Renault Clio",
      "SCCA Spec Racer Ford", "Toyota GR86", "Legends Ford '34 Coupe",
    ],
    "Turismo e stock": [
      "Cadillac CTS-V Racecar", "Kia Optima",
      "Stock Car Brasil Chevrolet Cruze", "Stock Car Brasil Toyota Corolla",
      "Supercars Chevrolet Camaro Gen 3", "Supercars Ford Mustang Gen 3",
    ],
    "Storiche": [
      "Aston Martin DBR9 GT1", "Audi 90 GTO", "Chevrolet Corvette C6.R GT1",
      "Ford GT GT2", "Nissan GTP ZX-T",
    ],
  },
  scoperte: {
    "Junior": [
      "Formula Vee", "Ray FF1600", "USF 2000",
      "Skip Barber Formula 2000", "FIA F4",
    ],
    "Formula 3": [
      "Dallara F3", "Super Formula Lights", "Dallara IL-15",
    ],
    "Top Formula": [
      "Dallara IR18", "Dallara iR-01", "Super Formula SF23 - Honda",
      "Super Formula SF23 - Toyota", "Mercedes-AMG W13 E Performance",
    ],
    "Storiche": [
      "Lotus 49", "Lotus 79",
    ],
  },
};

const TUTTE = "Tutte le vetture";

// i gruppi (nome sotto-categoria + vetture) di una macro-categoria, o di
// entrambe per "tutte" — usati sia per il filtro sia per l'elenco piatto
const gruppiDi = (cat) => {
  if (cat === "coperte") return Object.entries(AUTO_PER_CAT.coperte);
  if (cat === "scoperte") return Object.entries(AUTO_PER_CAT.scoperte);
  return [...Object.entries(AUTO_PER_CAT.coperte), ...Object.entries(AUTO_PER_CAT.scoperte)];
};

const autoDi = (cat) => gruppiDi(cat).flatMap(([, auto]) => auto);

// selezionabili nel filtro fino a un massimo di 4 (vedi MAX_OBIETTIVI)
const OBIETTIVI = [
  { k: "frenata", l: "Gestione frenata" },
  { k: "periferiche", l: "Consulenza su periferiche" },
  { k: "uscita_curve", l: "Uscita curve" },
  { k: "traiettorie", l: "Percorrenza e traiettorie" },
  { k: "nuovo_circuito", l: "Apprendere un nuovo circuito" },
  { k: "bagnato", l: "Guida sul bagnato" },
  { k: "gomme", l: "Gestione gomme" },
  { k: "setup", l: "Creazione setup" },
  { k: "qualifica", l: "Preparazione qualifica" },
  { k: "passo_gara", l: "Passo gara" },
  { k: "attacco_difesa", l: "Attacco e difesa" },
  { k: "strategia", l: "Supporto strategico" },
  { k: "altro", l: "Altro" },
];

const MAX_OBIETTIVI = 4;

// estremi dello slider del prezzo orario
const PREZZO_MIN = 9.99;
const PREZZO_MAX = 99;

/* ---------------------------------- stile ---------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@500;600;700;800;900&family=Titillium+Web:wght@400;600;700&family=Roboto+Mono:wght@400;500&display=swap');

.crd{
  --nero:#0A0B0D; --nero2:#121418; --nero3:#1A1D23; --bordo:#282C34;
  --bianco:#FFFFFF; --grigio:#9BA3AF; --grigio2:#6B727D;
  --rosso:#8E1A20; --rosso2:#B32229; --rossoSoft:rgba(179,34,41,.12);
  --blu:#1D4FD7; --blu2:#3C6DF0; --bluSoft:rgba(29,79,215,.12);
  --ambra:#E2472A; --ambraSoft:rgba(226,71,42,.14);
  --verde:#1FAA59; --verdeSoft:rgba(31,170,89,.14);
  --oro:#E3A63A; --oroSoft:rgba(227,166,58,.14);
  background:var(--nero); color:var(--bianco); min-height:100%;
  font-family:'Titillium Web',system-ui,sans-serif; -webkit-font-smoothing:antialiased; line-height:1.5;
}
.crd *{box-sizing:border-box}
.crd h1,.crd h2,.crd h3{font-family:'Saira Condensed',system-ui,sans-serif;font-weight:700;line-height:1.08;margin:0;letter-spacing:-.02em}
.mn{font-family:'Roboto Mono',ui-monospace,monospace;font-variant-numeric:tabular-nums}
.w{max-width:1080px;margin:0 auto;padding:0 20px}
.eyebrow{font-family:'Roboto Mono',monospace;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--grigio2)}

/* ---- barra ---- */
.nav{position:sticky;top:0;z-index:40;background:rgba(10,11,13,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--bordo)}
.navin{display:flex;align-items:center;gap:18px;height:62px}
.brand{font-family:'Saira Condensed',sans-serif;font-weight:800;font-size:21px;letter-spacing:.14em;cursor:pointer;
  background:none;border:0;color:var(--bianco);padding:0}
.brand i{color:var(--rosso2);font-style:normal}
.navlinks{display:none;gap:22px;margin-left:14px}
@media(min-width:820px){.navlinks{display:flex}}
.navlinks button{background:none;border:0;color:var(--grigio);font-size:14px;cursor:pointer;font-family:inherit;padding:4px 0}
.navlinks button:hover{color:var(--bianco)}
.navcta{margin-left:auto;display:flex;gap:8px}

/* ---- bottoni ---- */
.b{font-family:'Saira Condensed',sans-serif;font-weight:600;font-size:14px;letter-spacing:.01em;
  padding:11px 18px;border:1px solid transparent;cursor:pointer;border-radius:3px;transition:background .15s,border-color .15s}
.b:focus-visible{outline:2px solid var(--bianco);outline-offset:2px}
.b-rosso{background:var(--rosso);color:#fff}
.b-rosso:hover{background:var(--rosso2)}
.b-blu{background:var(--blu);color:#fff}
.b-blu:hover{background:var(--blu2)}
.b-ghost{background:transparent;border-color:var(--bordo);color:var(--bianco)}
.b-ghost:hover{border-color:var(--grigio)}
.b-lg{padding:15px 26px;font-size:16px;width:100%}
@media(min-width:640px){.b-lg{width:auto}}

/* ---- slot media ---- */
.slot{position:relative;width:100%;border:1px dashed var(--bordo);background:
  repeating-linear-gradient(135deg,transparent,transparent 9px,rgba(255,255,255,.022) 9px,rgba(255,255,255,.022) 18px),var(--nero2);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:18px;text-align:center}
.slot code{font-family:'Roboto Mono',monospace;font-size:12px;letter-spacing:.16em;color:var(--rosso2);
  border:1px solid rgba(179,34,41,.4);padding:3px 9px}
.slot p{margin:0;font-size:12.5px;color:var(--grigio2);max-width:34ch;line-height:1.45}
.slot span{font-family:'Roboto Mono',monospace;font-size:10.5px;color:var(--bordo);letter-spacing:.1em}
.slot video,.slot img{width:100%;height:100%;object-fit:cover;display:block}
.media{overflow:hidden;background:var(--nero2);border:1px solid var(--bordo)}
.media video,.media img{width:100%;height:100%;object-fit:cover;display:block}

/* ---- home ---- */
.hero{padding:64px 0 56px;border-bottom:1px solid var(--bordo)}
@media(min-width:900px){.hero{padding:88px 0 76px}}
.herogrid{display:grid;gap:38px;grid-template-columns:1fr;align-items:center}
@media(min-width:900px){.herogrid{grid-template-columns:1.05fr .95fr;gap:52px}}
.h1{font-size:clamp(38px,6.4vw,60px)}
.h1 em{font-style:normal;color:var(--rosso2)}
.lead{color:var(--grigio);font-size:17px;line-height:1.6;margin:20px 0 28px;max-width:46ch}
.ctas{display:flex;flex-direction:column;gap:10px}
@media(min-width:640px){.ctas{flex-direction:row}}
.plat{display:inline-flex;align-items:center;gap:9px;border:1px solid var(--bordo);background:var(--nero2);
  padding:7px 12px;font-family:'Roboto Mono',monospace;font-size:11.5px;letter-spacing:.12em;color:var(--grigio);margin-bottom:24px}
.plat i{width:7px;height:7px;border-radius:50%;background:var(--blu2);display:inline-block}

.band{border-bottom:1px solid var(--bordo);background:var(--nero2)}
.bandin{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--bordo)}
@media(min-width:760px){.bandin{grid-template-columns:repeat(4,1fr)}}
.bcell{background:var(--nero2);padding:22px 18px}
.bcell b{display:block;font-family:'Saira Condensed',sans-serif;font-size:29px;font-weight:700;letter-spacing:-.02em}
.bcell span{font-family:'Roboto Mono',monospace;font-size:10.5px;letter-spacing:.16em;color:var(--grigio2);text-transform:uppercase}

.sez{padding:70px 0;border-bottom:1px solid var(--bordo)}
.sezhead{max-width:56ch;margin-bottom:38px}
.h2{font-size:clamp(28px,4.6vw,40px);margin-top:12px}
.p{color:var(--grigio);font-size:16px;line-height:1.65;margin-top:14px}

.passi{display:grid;gap:20px;grid-template-columns:1fr}
@media(min-width:820px){.passi{grid-template-columns:repeat(3,1fr);gap:24px}}
.passo .num{font-family:'Roboto Mono',monospace;font-size:11px;letter-spacing:.2em;color:var(--rosso2);margin-bottom:12px}
.passo h3{font-size:21px;margin-bottom:8px}
.passo p{color:var(--grigio);font-size:14.5px;line-height:1.6;margin:0 0 16px}

.duo{display:grid;gap:34px;grid-template-columns:1fr;align-items:center}
@media(min-width:900px){.duo{grid-template-columns:1fr 1fr;gap:52px}}
.metric{border:1px solid var(--bordo);background:var(--nero2);padding:22px}
.metric .big{font-family:'Saira Condensed',sans-serif;font-size:52px;font-weight:800;color:var(--blu2);letter-spacing:-.03em;line-height:1}
.metric .sm{font-family:'Roboto Mono',monospace;font-size:12px;color:var(--grigio2);margin-top:8px;letter-spacing:.06em}
.check{list-style:none;padding:0;margin:20px 0 0}
.check li{position:relative;padding-left:24px;margin-bottom:12px;color:var(--grigio);font-size:15px;line-height:1.55}
.check li::before{content:"";position:absolute;left:0;top:8px;width:9px;height:9px;background:var(--rosso2)}

.due{display:grid;gap:16px;grid-template-columns:1fr}
@media(min-width:760px){.due{grid-template-columns:1fr 1fr}}
.porta{border:1px solid var(--bordo);background:var(--nero2);padding:26px;display:flex;flex-direction:column}
.porta.blu{border-top:3px solid var(--blu)}
.porta.rossa{border-top:3px solid var(--rosso2)}
.porta h3{font-size:23px;margin-bottom:10px}
.porta p{color:var(--grigio);font-size:14.5px;line-height:1.6;flex:1;margin:0 0 20px}

.faq{border-top:1px solid var(--bordo)}
.faq details{border-bottom:1px solid var(--bordo);padding:18px 0}
.faq summary{cursor:pointer;font-family:'Saira Condensed',sans-serif;font-weight:600;font-size:16.5px;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq summary::before{content:"+ ";color:var(--rosso2)}
.faq details[open] summary::before{content:"− "}
.faq p{color:var(--grigio);font-size:14.5px;line-height:1.65;margin:12px 0 0;max-width:64ch}

.foot{padding:44px 0 60px;color:var(--grigio2);font-size:13px;line-height:1.7}
.footgrid{display:flex;flex-wrap:wrap;gap:28px;justify-content:space-between;align-items:flex-start}

/* ---- login ---- */
.auth{min-height:calc(100vh - 62px);display:flex;align-items:center;justify-content:center;padding:40px 20px}
.authbox{width:100%;max-width:420px;border:1px solid var(--bordo);background:var(--nero2);padding:28px}
.tabs{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid var(--bordo);margin:20px 0 22px}
.tabs button{background:transparent;border:0;padding:12px;cursor:pointer;color:var(--grigio);
  font-family:'Saira Condensed',sans-serif;font-weight:600;font-size:14px}
.tabs button[data-on="1"][data-r="pilota"]{background:var(--blu);color:#fff}
.tabs button[data-on="1"][data-r="coach"]{background:var(--rosso);color:#fff}
.campo{margin-bottom:14px}
.campo label{display:block;font-family:'Roboto Mono',monospace;font-size:10.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--grigio2);margin-bottom:6px}
.campo input{width:100%;background:var(--nero);border:1px solid var(--bordo);color:var(--bianco);
  padding:11px 12px;font-family:'Titillium Web',sans-serif;font-size:14px;border-radius:2px}
.campo input:focus{outline:none;border-color:var(--grigio)}
.campo select,.campo textarea{width:100%;background:var(--nero);border:1px solid var(--bordo);color:var(--bianco);
  padding:11px 12px;font-family:'Titillium Web',sans-serif;font-size:14px;border-radius:2px}
.campo textarea{resize:vertical;min-height:88px;line-height:1.5}
.campo select:focus,.campo textarea:focus{outline:none;border-color:var(--grigio)}
.checkgrid{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.checkgrid label{display:flex;align-items:center;gap:7px;flex-shrink:0;white-space:nowrap;
  border:1px solid var(--bordo);padding:8px 12px;font-size:13px;cursor:pointer;border-radius:2px;color:var(--grigio)}
.checkgrid label:has(input:checked){border-color:var(--blu2);color:var(--blu2);background:var(--bluSoft)}
.checkgrid input{accent-color:var(--blu2)}
.hintbox{border-left:2px solid var(--bordo);padding-left:12px;margin-top:18px;color:var(--grigio2);font-size:12.5px;line-height:1.6}

/* ---- app ---- */
.appbar{border-bottom:1px solid var(--bordo);background:var(--nero2)}
.appbarin{display:flex;align-items:center;gap:4px;height:50px;overflow-x:auto}
.appbarin button{background:none;border:0;border-bottom:2px solid transparent;color:var(--grigio);
  padding:14px 12px;cursor:pointer;font-family:'Saira Condensed',sans-serif;font-weight:600;font-size:14px;white-space:nowrap}
.appbarin button[data-on="1"]{color:var(--bianco);border-bottom-color:var(--rosso2)}
.appbarin .esci{margin-left:auto;color:var(--grigio2);font-size:13px;font-weight:500}

.filtri{border:1px solid var(--bordo);background:var(--nero2);margin:22px 0}
.fhead{padding:10px 14px;border-bottom:1px solid var(--bordo);font-family:'Roboto Mono',monospace;
  font-size:10.5px;letter-spacing:.18em;color:var(--grigio2);display:flex;justify-content:space-between}
.frow{display:flex;align-items:center;gap:12px;padding:11px 14px;border-bottom:1px solid var(--bordo)}
.frow:last-child{border-bottom:0}
.frow.hi{background:var(--bluSoft)}
.frow > label{font-family:'Roboto Mono',monospace;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--grigio2);width:104px;flex:none}
.frow.hi > label{color:var(--blu2)}
.frow select,.frow input{flex:1;background:var(--nero);color:var(--bianco);border:1px solid var(--bordo);
  padding:8px 10px;font-family:'Roboto Mono',monospace;font-size:13px;border-radius:2px}
.frow input::placeholder{color:var(--grigio2)}

.lista{display:grid;gap:14px;grid-template-columns:1fr;margin:20px 0 40px}
@media(min-width:780px){.lista{grid-template-columns:1fr 1fr}}
.cc{border:1px solid var(--bordo);background:var(--nero2);padding:18px;text-align:left;cursor:pointer;
  color:inherit;font:inherit;width:100%;transition:border-color .16s,transform .16s}
.cc:hover{border-color:var(--rosso2);transform:translateY(-2px)}
.cc:focus-visible{outline:2px solid var(--blu2);outline-offset:2px}
.cctop{display:flex;gap:12px;align-items:center}
.avat{width:44px;height:44px;flex:none;background:var(--nero3);border:1px solid var(--bordo);
  display:flex;align-items:center;justify-content:center;font-family:'Saira Condensed',sans-serif;font-weight:700;color:var(--grigio)}
.ccnome{font-family:'Saira Condensed',sans-serif;font-weight:700;font-size:18px}
.ccsub{font-family:'Roboto Mono',monospace;font-size:11.5px;color:var(--grigio2)}
.ccmetr{display:flex;align-items:flex-end;gap:14px;margin-top:16px}
.ccbig{font-family:'Saira Condensed',sans-serif;font-weight:800;font-size:30px;color:var(--blu2);letter-spacing:-.02em;line-height:1}
.ccsm{font-family:'Roboto Mono',monospace;font-size:11px;color:var(--grigio2);line-height:1.5}
.fit{margin-top:14px;border:1px solid rgba(29,79,215,.35);background:var(--bluSoft);padding:9px 11px;font-size:13px}
.fit b{color:var(--blu2)}
.fit.no{border-color:var(--bordo);background:var(--nero);color:var(--grigio2)}
.stato{display:inline-flex;align-items:center;font-family:'Roboto Mono',monospace;font-size:10.5px;
  letter-spacing:.1em;text-transform:uppercase;padding:4px 9px;border:1px solid transparent;border-radius:2px}
.stato-consigliato{background:var(--verde);color:#fff}
.stato-neutro{background:var(--oro);color:#241A05}
.stato-avviso{background:var(--ambra);color:#fff}
.notaBox{border:1px solid var(--bordo);background:var(--nero2);padding:14px 16px;margin-top:10px;font-size:13px;line-height:1.6}
.notaBox b{color:var(--bianco)}
.notaBox.ambra{border-color:rgba(226,71,42,.4);background:var(--ambraSoft)}
.notaBox.ambra b{color:var(--ambra)}
.notaBox.rossa{border-color:rgba(179,34,41,.5);background:var(--rossoSoft)}
.notaBox.rossa b{color:var(--rosso2)}
.altList{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.altList button{background:var(--nero);border:1px solid var(--bordo);color:var(--bianco);
  font-family:'Roboto Mono',monospace;font-size:11.5px;padding:6px 10px;cursor:pointer;border-radius:2px}
.altList button:hover{border-color:var(--blu2);color:var(--blu2)}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}
.chip{font-family:'Roboto Mono',monospace;font-size:10.5px;letter-spacing:.06em;border:1px solid var(--bordo);
  color:var(--grigio2);padding:4px 8px}
.chip.p{border-color:rgba(179,34,41,.45);color:var(--rosso2)}
.specbox{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.specbox-item{border:1px solid var(--bordo);background:var(--nero3);color:var(--bianco);
  padding:8px 12px;font-size:12.5px;font-weight:600;border-radius:3px}
.ccfoot{display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:14px;border-top:1px solid var(--bordo)}
.prezzo{font-family:'Saira Condensed',sans-serif;font-weight:700;font-size:20px}
.prezzo.lg{font-size:32px}
.prezzo small{color:var(--grigio2);font-weight:500;font-size:12px}

/* ---- slider prezzo a due cursori ---- */
.rangewrap{position:relative;height:30px;margin-top:6px}
.rangetrack{position:absolute;top:13px;left:0;right:0;height:4px;background:var(--bordo);border-radius:2px}
.rangefill{position:absolute;top:13px;height:4px;background:var(--blu2);border-radius:2px}
.rangewrap input[type="range"]{position:absolute;top:11px;left:0;width:100%;margin:0;background:transparent;
  -webkit-appearance:none;appearance:none;pointer-events:none}
.rangewrap input[type="range"]::-webkit-slider-runnable-track{height:8px;background:transparent}
.rangewrap input[type="range"]::-moz-range-track{height:8px;background:transparent;border:none}
.rangewrap input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;pointer-events:auto;
  width:18px;height:18px;border-radius:50%;background:var(--blu2);border:2px solid var(--nero);
  cursor:pointer;margin-top:-5px}
.rangewrap input[type="range"]::-moz-range-thumb{pointer-events:auto;width:18px;height:18px;border-radius:50%;
  background:var(--blu2);border:2px solid var(--nero);cursor:pointer}

.blocco{border:1px solid var(--bordo);background:var(--nero2);padding:18px}
.riga{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--bordo);font-size:14px;align-items:baseline}
.riga:last-child{border-bottom:0}
.riga .nn{font-family:'Roboto Mono',monospace;font-size:11px;color:var(--grigio2)}
.stit{font-family:'Roboto Mono',monospace;font-size:10.5px;letter-spacing:.18em;color:var(--grigio2);
  text-transform:uppercase;border-bottom:1px solid var(--bordo);padding-bottom:8px;margin:32px 0 14px;
  display:flex;justify-content:space-between;gap:10px}
.nota{font-size:12.5px;color:var(--grigio2);line-height:1.6;margin-top:12px}
.indietro{background:none;border:0;color:var(--grigio2);cursor:pointer;font-size:13px;padding:18px 0 6px;font-family:inherit}
.slotchip{border:1px solid var(--bordo);background:var(--nero);color:var(--bianco);padding:11px;
  cursor:pointer;font-family:'Roboto Mono',monospace;font-size:13px;border-radius:2px}
.slotchip[data-on="1"]{border-color:var(--blu2);background:var(--bluSoft);color:var(--blu2)}
.slotgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
.ok{border:1px solid var(--blu);background:var(--bluSoft);padding:20px;margin:22px 0}
.avviso{border:1px solid rgba(179,34,41,.5);background:var(--rossoSoft);padding:14px;font-size:13.5px;line-height:1.55;margin-bottom:16px}
.kpigrid{display:grid;gap:14px;grid-template-columns:1fr}
@media(min-width:620px){.kpigrid{grid-template-columns:1fr 1fr}}
.kbox{border:1px solid var(--bordo);background:var(--nero2);padding:18px}
.klab{font-family:'Roboto Mono',monospace;font-size:10px;letter-spacing:.16em;color:var(--grigio2);text-transform:uppercase}
.kval{font-family:'Saira Condensed',sans-serif;font-weight:800;font-size:32px;margin-top:8px;letter-spacing:-.02em}
.apri{background:none;border:0;color:var(--blu2);cursor:pointer;font-family:'Roboto Mono',monospace;font-size:12px;padding:10px 0;text-align:left}
.regole{border-left:2px solid var(--bordo);padding-left:14px;margin:4px 0 0}
.regole li{font-size:12.5px;color:var(--grigio2);line-height:1.55;margin-bottom:8px}
.recens{border-left:2px solid var(--bordo);padding-left:14px;margin-bottom:16px}
.recens p{font-size:14px;line-height:1.6;margin:7px 0}
.recmeta{display:flex;gap:12px;flex-wrap:wrap;font-family:'Roboto Mono',monospace;font-size:11.5px;color:var(--grigio2)}
.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;vertical-align:middle}
.orebar{height:8px;background:var(--bordo);border-radius:4px;overflow:hidden;margin-top:14px}
.orebarfill{height:100%;background:var(--blu2)}
.lockbox{border:1px dashed var(--bordo);background:var(--nero2);padding:22px}
@media (prefers-reduced-motion:reduce){.crd *{transition:none!important}}
`;

/* -------------------------------- componenti -------------------------------- */

const iniz = (n) => n.split(" ").map((x) => x[0]).join("");
const perSett = (ir, gg) => Math.round((ir / gg) * 7);

const fmtData = (iso) => {
  const s = new Date(iso + "T00:00:00").toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" });
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/* ---- forbice iRating coach ↔ allievo -----------------------------------
   Sotto i 3.000 iR dell'allievo il coach deve stare almeno il 50% sopra,
   oltre i 3.000 basta il 25%. In entrambi i casi un coach oltre il triplo
   dell'allievo è considerato troppo lontano per essere davvero utile. */

function iRAllievo(miaIr, mia) {
  const n = Number(miaIr);
  return n > 0 ? n : FASCE_MEDIO[mia];
}

function statoForbice(coachIr, allievoIr) {
  const soglia = allievoIr <= 3000 ? allievoIr * 1.5 : allievoIr * 1.25;
  const tetto = allievoIr * 3;
  if (coachIr > tetto) return "avviso";
  if (coachIr >= soglia) return "consigliato";
  return "neutro";
}

// almeno 3 allievi in quella fascia, con guadagno positivo: il dato reale
// batte sempre l'iRating grezzo e fa salire lo stato di un gradino
function storicoBuono(coach, fascia) {
  const d = coach.fasce[fascia];
  return !!d && d[2] >= 3 && d[0] > 0;
}

const SALE_DI_GRADINO = { avviso: "neutro", neutro: "consigliato", consigliato: "consigliato" };

function calcolaStato(coach, allievoIr, mia) {
  const base = statoForbice(coach.ir, allievoIr);
  return storicoBuono(coach, mia) ? SALE_DI_GRADINO[base] : base;
}

const STATO_LABEL = { consigliato: "Consigliato", neutro: "Neutro", avviso: "Avviso" };

// la fascia in cui il coach ha il ritmo settimanale migliore, con almeno 3
// allievi: è il dato che conta di più, anche contro la sua dichiarazione
function migliorFascia(coach) {
  const candidate = FASCE
    .filter((fa) => coach.fasce[fa.k] && coach.fasce[fa.k][2] >= 3)
    .map((fa) => ({ k: fa.k, ritmo: perSett(coach.fasce[fa.k][0], coach.fasce[fa.k][1]) }));
  if (candidate.length === 0) return null;
  return candidate.reduce((a, b) => (b.ritmo > a.ritmo ? b : a)).k;
}

function fraseDichiarazione(coach) {
  const dichiarata = FASCE_FRASE[coach.fasciaDichiarata];
  const migliore = migliorFascia(coach);
  if (!migliore)
    return `Dichiara di rivolgersi a piloti ${dichiarata}, ma non ha ancora abbastanza allievi tracciati per confermarlo.`;
  if (migliore === coach.fasciaDichiarata)
    return `Dichiara di rivolgersi a piloti ${dichiarata} — e i dati lo confermano.`;
  return `Dichiara di rivolgersi a piloti ${dichiarata}, ma i risultati migliori li ottiene con piloti ${FASCE_FRASE[migliore]}.`;
}

function Media({ id, ratio = "16 / 9", nota, tipo = "video" }) {
  const src = MEDIA[id];
  if (src)
    return (
      <div className="media" style={{ aspectRatio: ratio }}>
        {tipo === "video" ? (
          <video src={src} autoPlay muted loop playsInline />
        ) : (
          <img src={src} alt={nota || ""} />
        )}
      </div>
    );
  return (
    <div className="slot" style={{ aspectRatio: ratio }}>
      <code>{id}</code>
      <p>{nota}</p>
      <span>{tipo === "video" ? "VIDEO IN LOOP" : "IMMAGINE"} · {ratio.replace(" ", "")}</span>
    </div>
  );
}

function Spark({ curva, start, w = 110, h = 36 }) {
  const min = Math.min(...curva), max = Math.max(...curva);
  const pts = curva.map((v, i) => {
    const x = (i / (curva.length - 1)) * w;
    const y = h - 3 - ((v - min) / (max - min || 1)) * (h - 7);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const sx = ((start / (curva.length - 1)) * w).toFixed(1);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Andamento iRating allievi"
         style={{ marginLeft: "auto", flex: "none" }}>
      <line x1={sx} y1="0" x2={sx} y2={h} stroke="#8E1A20" strokeWidth="1" strokeDasharray="2 2" />
      <polyline points={pts.slice(0, start + 1).join(" ")} fill="none" stroke="#6B727D" strokeWidth="1.5" />
      <polyline points={pts.slice(start).join(" ")} fill="none" stroke="#3C6DF0" strokeWidth="2" />
    </svg>
  );
}

/* ---------------------------------- HOME ---------------------------------- */

function Home({ vaiLogin, vaiCandidatura }) {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="w herogrid">
          <div>
            <div className="plat"><i />FUNZIONA SU iRACING</div>
            <h1 className="h1">
              Trova il coach che ti fa <em>salire davvero</em>.
            </h1>
            <p className="lead">
              Su CORDA ogni coach è valutato con un solo numero: l'iRating che i suoi allievi hanno
              guadagnato dopo la prima sessione. Il dato arriva dall'account iRacing dell'allievo,
              non da una recensione.
            </p>
            <div className="ctas">
              <button className="b b-blu b-lg" onClick={() => vaiLogin("pilota")}>
                Cerco un coach
              </button>
              <button className="b b-ghost b-lg" onClick={vaiCandidatura}>
                Voglio fare coaching
              </button>
            </div>
          </div>
          <Media id="V01" ratio="16 / 10"
                 nota="Onboard iRacing, loop breve senza audio. È la prima cosa che si vede: meglio una staccata pulita che un montaggio." />
        </div>
      </section>

      {/* NUMERI */}
      <section className="band">
        <div className="w">
          <div className="bandin">
            <div className="bcell"><b>18</b><span>coach verificati</span></div>
            <div className="bcell"><b>+412</b><span>iR mediani per allievo</span></div>
            <div className="bcell"><b>30 gg</b><span>tempo mediano</span></div>
            <div className="bcell"><b>iRacing</b><span>unica piattaforma supportata</span></div>
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section className="sez" id="come">
        <div className="w">
          <div className="sezhead">
            <div className="eyebrow">Come funziona</div>
            <h2 className="h2">Tre passaggi, nessuna sorpresa.</h2>
            <p className="p">
              Colleghi il tuo account iRacing una volta sola. Da lì in poi la piattaforma sa da dove
              parti e misura dove arrivi.
            </p>
          </div>

          <div className="passi">
            <div className="passo">
              <div className="num">PASSO 01</div>
              <h3>Dici da dove parti</h3>
              <p>
                Categoria, vettura, obiettivo e il tuo iRating attuale. Ti mostriamo solo i coach
                che hanno risultati con piloti della tua fascia, non i più veloci in assoluto.
              </p>
              <Media id="V02" ratio="4 / 3" nota="Schermata di ricerca coach, con i filtri che si muovono." />
            </div>
            <div className="passo">
              <div className="num">PASSO 02</div>
              <h3>Guidi con il coach</h3>
              <p>
                Sessione da un'ora in pista insieme. Il pagamento resta in deposito fino a 24 ore
                dopo: se il coach non si presenta, torna a te.
              </p>
              <Media id="V03" ratio="4 / 3" nota="Sessione live: schermo del coach con telemetria e onboard dell'allievo." />
            </div>
            <div className="passo">
              <div className="num">PASSO 03</div>
              <h3>Vedi se è servito</h3>
              <p>
                Corri le tue gare normalmente. La piattaforma confronta la tua curva iRating con i
                trenta giorni precedenti e dice se il lavoro ha funzionato.
              </p>
              <Media id="V04" ratio="4 / 3" nota="Curva iRating che sale, con il marcatore della prima sessione." />
            </div>
          </div>
        </div>
      </section>

      {/* IL NUMERO */}
      <section className="sez">
        <div className="w duo">
          <div>
            <div className="eyebrow">Il numero che conta</div>
            <h2 className="h2">Le stelline non fanno guadagnare iRating.</h2>
            <p className="p">
              Chiunque può avere cinque stelle. Molto più difficile è far salire chi si allena con te,
              e dimostrarlo con i dati di iRacing.
            </p>
            <ul className="check">
              <li>Solo allievi che hanno collegato l'account e dato il consenso.</li>
              <li>Minimo otto gare dopo la prima sessione: chi non corre non entra nel conto.</li>
              <li>Mediana e non media, così un allievo fuoriclasse non gonfia il risultato.</li>
              <li>Normalizzato per fascia: salire da 1.200 non vale quanto salire da 5.000.</li>
              <li>Finestra mobile di 90 giorni: chi smette di funzionare scende.</li>
            </ul>
          </div>
          <div className="metric">
            <div className="eyebrow">Esempio reale di un allievo</div>
            <div className="big" style={{ marginTop: 14 }}>+564 iR</div>
            <div className="sm">IN 22 GIORNI · 179 iR A SETTIMANA · 19 GARE</div>
            <div style={{ marginTop: 20 }}>
              <Media id="I01" ratio="4 / 3" tipo="immagine"
                     nota="Postazione di un coach o schermata del profilo con la curva iRating." />
            </div>
          </div>
        </div>
      </section>

      {/* DUE PORTE */}
      <section className="sez">
        <div className="w">
          <div className="sezhead">
            <div className="eyebrow">Da che parte stai</div>
            <h2 className="h2">Due ingressi, due mestieri diversi.</h2>
          </div>
          <div className="due">
            <div className="porta blu">
              <h3>Sono un pilota</h3>
              <p>
                Cerchi qualcuno che ti tolga il tempo o ti faccia smettere di rovinare le gare.
                Scegli in base ai risultati ottenuti con piloti che partivano dal tuo livello, non
                in base a chi ha il canale YouTube più grosso.
              </p>
              <button className="b b-blu" onClick={() => vaiLogin("pilota")}>Entra come pilota</button>
            </div>
            <div className="porta rossa">
              <h3>Sono un coach</h3>
              <p>
                Hai già allievi su Discord e li gestisci a mano. Qui hai calendario, pagamenti,
                fatture e uno storico dei risultati che vale più di qualsiasi presentazione. La
                commissione è il 15%.
              </p>
              <button className="b b-rosso" onClick={vaiCandidatura}>Candidati come coach</button>
            </div>
          </div>
        </div>
      </section>

      {/* CHIUSURA */}
      <section className="sez">
        <div className="w duo">
          <Media id="V05" ratio="16 / 9" nota="Montaggio lungo di gare e sorpassi, loop di sfondo per la chiusura." />
          <div>
            <div className="eyebrow">Oggi</div>
            <h2 className="h2">Partiamo da iRacing.</h2>
            <p className="p">
              Una sola piattaforma, tutte le sue categorie: gran turismo, prototipi, monoposto,
              ovali. Coach scelti a mano, nessun profilo finto. Gli altri simulatori arrivano
              quando qui il sistema funziona davvero.
            </p>
            <div className="ctas" style={{ marginTop: 26 }}>
              <button className="b b-blu b-lg" onClick={() => vaiLogin("pilota")}>Inizia ora</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sez">
        <div className="w">
          <div className="sezhead">
            <div className="eyebrow">Domande</div>
            <h2 className="h2">Quello che chiedono tutti.</h2>
          </div>
          <div className="faq">
            <details>
              <summary>Serve per forza collegare l'account iRacing?</summary>
              <p>
                Per prenotare no, per contare nei risultati sì. Senza collegamento la tua crescita
                non viene misurata e non finisce nel punteggio del coach.
              </p>
            </details>
            <details>
              <summary>E se il coach non si presenta?</summary>
              <p>
                Il pagamento resta in deposito fino a 24 ore dopo la sessione. Se non si presenta,
                l'importo torna a te automaticamente.
              </p>
            </details>
            <details>
              <summary>Come faccio a sapere che i numeri sono veri?</summary>
              <p>
                Arrivano dall'account iRacing degli allievi, non da quello del coach. Il coach può
                leggerli, non modificarli.
              </p>
            </details>
            <details>
              <summary>Funziona anche su altri simulatori?</summary>
              <p>
                Al momento no. CORDA lavora solo su iRacing, perché è l'unico dove esiste un dato
                pubblico e confrontabile su cui misurare il progresso.
              </p>
            </details>
          </div>
        </div>
      </section>

      <footer className="w foot">
        <div className="footgrid">
          <div>
            <div className="brand" style={{ cursor: "default", marginBottom: 10 }}>CORD<i>A</i></div>
            <div>Coaching per iRacing.<br />Demo — dati inventati, nessun pagamento reale.</div>
          </div>
          <div className="mn" style={{ fontSize: 11.5, letterSpacing: ".08em", lineHeight: 2 }}>
            SLOT MEDIA DA CARICARE<br />
            V01 hero · V02 ricerca · V03 sessione<br />
            V04 curva iRating · I01 profilo · V05 chiusura
          </div>
        </div>
      </footer>
    </>
  );
}

/* ---------------------------------- LOGIN ---------------------------------- */

function Login({ ruolo, setRuolo, entra }) {
  return (
    <div className="auth">
      <div className="authbox">
        <div className="eyebrow">Accedi a CORDA</div>
        <h2 style={{ fontSize: 26, marginTop: 10 }}>
          {ruolo === "coach" ? "Area coach" : "Area pilota"}
        </h2>

        <div className="tabs">
          {["pilota", "coach"].map((r) => (
            <button key={r} data-r={r} data-on={ruolo === r ? "1" : "0"} onClick={() => setRuolo(r)}>
              {r === "pilota" ? "Sono un pilota" : "Sono un coach"}
            </button>
          ))}
        </div>

        <div className="campo">
          <label htmlFor="em">Email</label>
          <input id="em" type="email" placeholder="nome@email.it" defaultValue="" />
        </div>
        <div className="campo">
          <label htmlFor="pw">Password</label>
          <input id="pw" type="password" placeholder="••••••••" defaultValue="" />
        </div>

        <button className={ruolo === "coach" ? "b b-rosso b-lg" : "b b-blu b-lg"}
                style={{ width: "100%", marginTop: 8 }} onClick={entra}>
          Entra
        </button>

        <div className="hintbox">
          {ruolo === "coach"
            ? "Al primo accesso ti chiediamo di collegare l'account iRacing per verificare licenza e iRating. Senza verifica il profilo non è pubblicabile."
            : "Al primo accesso colleghiamo il tuo account iRacing e congeliamo il tuo iRating come punto zero. È da lì che si misura tutto quello che viene dopo."}
        </div>
        <div style={{ marginTop: 16, fontSize: 12.5, color: "var(--grigio2)" }}>
          Demo: premi Entra, non serve nessuna credenziale.
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- AREA PILOTA ------------------------------- */

function Cerca({ apri, mia, setMia, miaIr, setMiaIr }) {
  const [cat, setCat] = useState("tutte");
  const [auto, setAuto] = useState(TUTTE);
  const [obi, setObi] = useState(OBIETTIVI.map((o) => o.k).slice(0, 0));
  const [prezzoMin, setPrezzoMin] = useState(PREZZO_MIN);
  const [prezzoMax, setPrezzoMax] = useState(PREZZO_MAX);

  const cambiaCat = (k) => { setCat(k); setAuto(TUTTE); };

  const cambiaPrezzoMin = (v) => setPrezzoMin(Math.min(v, prezzoMax - 1));
  const cambiaPrezzoMax = (v) => setPrezzoMax(Math.max(v, prezzoMin + 1));
  const pctPrezzo = (v) => ((v - PREZZO_MIN) / (PREZZO_MAX - PREZZO_MIN)) * 100;

  const toggleObi = (k) =>
    setObi((prev) => {
      if (prev.includes(k)) return prev.filter((x) => x !== k);
      if (prev.length >= MAX_OBIETTIVI) return prev;
      return [...prev, k];
    });

  const allievoIr = iRAllievo(miaIr, mia);

  const list = [...COACHES]
    .filter((c) => (cat === "tutte" || c.cat.includes(cat)) &&
                   (auto === TUTTE || c.auto.includes(auto)) &&
                   (obi.length === 0 || obi.some((o) => c.obiettivi.includes(o))) &&
                   (c.prezzo >= prezzoMin && c.prezzo <= prezzoMax))
    .sort((a, b) => {
      const fa = a.fasce[mia], fb = b.fasce[mia];
      if (fa && !fb) return -1;
      if (!fa && fb) return 1;
      if (fa && fb) return perSett(fb[0], fb[1]) - perSett(fa[0], fa[1]);
      return 0;
    });

  // coach della stessa categoria, in stato Consigliato: l'alternativa da
  // proporre quando un altro coach è troppo lontano dal livello del pilota
  const alternative = (c) =>
    COACHES.filter((x) => x.id !== c.id &&
      x.cat.some((k) => c.cat.includes(k)) &&
      calcolaStato(x, allievoIr, mia) === "consigliato").slice(0, 3);

  return (
    <div className="w">
      <div className="stit" style={{ marginTop: 26 }}>
        <span>Trova il tuo coach</span><span>{list.length} risultati</span>
      </div>

      <div className="filtri">
        <div className="fhead"><span>FILTRI</span><span>iRACING</span></div>
        <div className="frow hi">
          <label htmlFor="f1">Il tuo iR</label>
          <select id="f1" value={mia} onChange={(e) => setMia(e.target.value)}>
            {FASCE.map((f) => <option key={f.k} value={f.k}>{f.l}</option>)}
          </select>
        </div>
        <div className="frow hi">
          <label htmlFor="f1b">iR esatto</label>
          <input id="f1b" type="number" min="0" inputMode="numeric" value={miaIr}
                 onChange={(e) => setMiaIr(e.target.value)}
                 placeholder={`opzionale · senza, usiamo ${FASCE_MEDIO[mia]}`} />
        </div>
        <div className="frow">
          <label htmlFor="f0">Categoria</label>
          <select id="f0" value={cat} onChange={(e) => cambiaCat(e.target.value)}>
            {CATEGORIE.map((k) => <option key={k.k} value={k.k}>{k.l}</option>)}
          </select>
        </div>
        <div className="frow">
          <label htmlFor="f2">Vettura</label>
          <select id="f2" value={auto} onChange={(e) => setAuto(e.target.value)}>
            <option>{TUTTE}</option>
            {gruppiDi(cat).map(([nome, vetture], i) => (
              <optgroup label={nome} key={`${nome}-${i}`}>
                {vetture.map((a) => <option key={a}>{a}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="frow" style={{ alignItems: "flex-start" }}>
          <label htmlFor="f3">Obiettivo</label>
          <div style={{ flex: 1 }}>
            <div className="checkgrid" id="f3">
              {OBIETTIVI.map((o) => {
                const on = obi.includes(o.k);
                return (
                  <label key={o.k}>
                    <input type="checkbox" checked={on} disabled={!on && obi.length >= MAX_OBIETTIVI}
                           onChange={() => toggleObi(o.k)} />
                    {o.l}
                  </label>
                );
              })}
            </div>
            <p className="nn" style={{ marginTop: 8 }}>
              {obi.length === 0 ? `Nessuno selezionato · fino a ${MAX_OBIETTIVI}` : `${obi.length}/${MAX_OBIETTIVI} selezionati`}
            </p>
          </div>
        </div>
        <div className="frow" style={{ alignItems: "flex-start" }}>
          <label htmlFor="f4">Prezzo /h</label>
          <div style={{ flex: 1 }}>
            <div className="rangewrap" id="f4">
              <div className="rangetrack" />
              <div className="rangefill" style={{ left: `${pctPrezzo(prezzoMin)}%`, right: `${100 - pctPrezzo(prezzoMax)}%` }} />
              <input type="range" min={PREZZO_MIN} max={PREZZO_MAX} step="0.01" value={prezzoMin}
                     aria-label="Prezzo minimo" onChange={(e) => cambiaPrezzoMin(Number(e.target.value))} />
              <input type="range" min={PREZZO_MIN} max={PREZZO_MAX} step="0.01" value={prezzoMax}
                     aria-label="Prezzo massimo" onChange={(e) => cambiaPrezzoMax(Number(e.target.value))} />
            </div>
            <p className="nn" style={{ marginTop: 6 }}>
              {prezzoMin.toFixed(2)}€ – {prezzoMax.toFixed(2)}€ /h
            </p>
          </div>
        </div>
      </div>

      <p className="nota" style={{ marginTop: 0 }}>
        L'ordine cambia con la tua fascia: chi fa numeri enormi con i principianti non è detto che
        li faccia con te. Consigliato / Neutro / Avviso confrontano il tuo iR con quello del coach.
      </p>

      <div className="lista">
        {list.map((c) => {
          const f = c.fasce[mia];
          const stato = calcolaStato(c, allievoIr, mia);
          return (
            <div key={c.id}>
              <button className="cc" onClick={() => apri(c)}>
                <div className="cctop">
                  <div className="avat">{iniz(c.nome)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ccnome">{c.nome}</div>
                    <div className="ccsub">@{c.tag} · {c.ir} iR · licenza {c.lic}</div>
                  </div>
                  <span className={`stato stato-${stato}`}>{STATO_LABEL[stato]}</span>
                </div>

                <div className="ccmetr">
                  <div>
                    <div className="ccbig">+{c.irMed} iR</div>
                    <div className="ccsm">mediana allievi · {c.gg} gg<br />{perSett(c.irMed, c.gg)} iR a settimana</div>
                  </div>
                </div>

                {f ? (
                  <div className="fit">Con piloti come te: <b>+{f[0]} iR in {f[1]} gg</b> · {f[2]} allievi</div>
                ) : (
                  <div className="fit no">Nessun dato nella tua fascia.</div>
                )}

                <div className="specbox">
                  {c.obiettivi.map((k) => (
                    <div className="specbox-item" key={k}>{OBIETTIVI.find((o) => o.k === k)?.l || k}</div>
                  ))}
                </div>
                {c.patto && (
                  <div className="chips" style={{ marginTop: 8 }}>
                    <span className="chip p">Patto di risultato</span>
                  </div>
                )}

                <div className="ccfoot">
                  <span className="ccsm">{c.tracciati} allievi tracciati · agg. {c.agg}</span>
                  <span className="prezzo lg">{c.prezzo}€ <small>/h</small></span>
                </div>
              </button>

              {stato === "avviso" && (() => {
                const alt = alternative(c);
                return (
                  <div className="notaBox ambra">
                    <p>
                      Lavora di solito con piloti <b>{FASCE_FRASE[c.fasciaDichiarata]}</b>. Potrebbe dare
                      per scontati fondamentali che stai ancora costruendo.
                    </p>
                    {alt.length > 0 && (
                      <>
                        <p style={{ marginTop: 8 }}>Questi hanno risultati migliori con piloti come te:</p>
                        <div className="altList">
                          {alt.map((a) => <button key={a.id} onClick={() => apri(a)}>{a.nome}</button>)}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Scheda({ c, mia, miaIr, chiudi, vaiPercorso, vediCoach }) {
  const [slot, setSlot] = useState(null);
  const [fatto, setFatto] = useState(false);
  const [apri, setApri] = useState(false);
  const f = c.fasce[mia];
  const fee = (c.prezzo * 0.15).toFixed(2);
  const allievoIr = iRAllievo(miaIr, mia);
  const stato = calcolaStato(c, allievoIr, mia);
  const alternative = COACHES.filter((x) => x.id !== c.id &&
    x.cat.some((k) => c.cat.includes(k)) &&
    calcolaStato(x, allievoIr, mia) === "consigliato").slice(0, 3);

  if (fatto)
    return (
      <div className="w">
        <button className="indietro" onClick={chiudi}>← Torna ai coach</button>
        <div className="ok">
          <h2 style={{ fontSize: 24, color: "var(--blu2)" }}>Sessione prenotata</h2>
          <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.6 }}>
            {c.nome} · {slot}. L'importo resta in deposito fino a 24 ore dopo la sessione.
          </p>
        </div>
        <div className="stit"><span>Punto zero fissato</span></div>
        <div className="blocco">
          <div className="riga"><span>iRating alla prenotazione</span><b className="mn">1.842</b></div>
          <div className="riga"><span>Gare negli ultimi 30 giorni</span><b className="mn">14</b></div>
          <div className="riga"><span>Primo controllo</span><b className="mn">fra 30 giorni</b></div>
          <p className="nota">
            Da qui in poi la tua curva viene confrontata con i 30 giorni precedenti. Servono almeno
            otto gare perché il dato sia valido.
          </p>
        </div>
        <div style={{ margin: "20px 0 40px" }}>
          <button className="b b-blu b-lg" style={{ width: "100%" }} onClick={vaiPercorso}>
            Vai al tuo percorso
          </button>
        </div>
      </div>
    );

  return (
    <div className="w">
      <button className="indietro" onClick={chiudi}>← Torna ai coach</button>

      <div className="cctop" style={{ marginTop: 8 }}>
        <div className="avat" style={{ width: 56, height: 56, fontSize: 20 }}>{iniz(c.nome)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 28 }}>{c.nome}</h2>
          <div className="ccsub">@{c.tag} · {c.ir} iR · licenza {c.lic} · {c.prezzo}€/h</div>
        </div>
        <span className={`stato stato-${stato}`}>{STATO_LABEL[stato]}</span>
      </div>

      {stato === "avviso" && (
        <div className="notaBox ambra">
          <p>
            Lavora di solito con piloti <b>{FASCE_FRASE[c.fasciaDichiarata]}</b>. Potrebbe dare per
            scontati fondamentali che stai ancora costruendo.
          </p>
          {alternative.length > 0 && (
            <>
              <p style={{ marginTop: 8 }}>Questi hanno risultati migliori con piloti come te:</p>
              <div className="altList">
                {alternative.map((a) => <button key={a.id} onClick={() => vediCoach(a)}>{a.nome}</button>)}
              </div>
            </>
          )}
        </div>
      )}

      <div className="stit"><span>Risultati allievi · 90 giorni</span><span>agg. {c.agg}</span></div>
      <div className="blocco">
        <div className="ccmetr" style={{ marginTop: 0 }}>
          <div>
            <div className="ccbig" style={{ fontSize: 40 }}>+{c.irMed} iR</div>
            <div className="ccsm">
              mediana per allievo, in {c.gg} giorni<br />
              {perSett(c.irMed, c.gg)} iR a settimana · {c.tracciati} allievi
            </div>
          </div>
          <Spark curva={c.curva} start={c.start} w={130} h={46} />
        </div>
        <p className="nota">
          Linea grigia: i 30 giorni prima della prima sessione. Linea blu: dopo. Il tratteggio rosso
          è il giorno in cui è iniziato il coaching.
        </p>
        <button className="apri" onClick={() => setApri(!apri)}>
          {apri ? "▾" : "▸"} Come calcoliamo questo numero
        </button>
        {apri && (
          <ul className="regole">
            <li>Solo allievi con account iRacing collegato e consenso dato.</li>
            <li>Almeno otto gare dopo la prima sessione.</li>
            <li>Mediana, non media.</li>
            <li>Normalizzato sulla fascia di partenza.</li>
            <li>Sotto i tre allievi in una fascia non mostriamo nulla.</li>
          </ul>
        )}
      </div>

      <div className="stit"><span>Dove funziona davvero</span></div>
      <div className="blocco">
        {FASCE.map((fa) => {
          const d = c.fasce[fa.k];
          const on = fa.k === mia;
          return (
            <div className="riga" key={fa.k}
                 style={on ? { background: "var(--bluSoft)", margin: "0 -18px", padding: "10px 18px" } : undefined}>
              <span style={on ? { color: "var(--blu2)" } : undefined}>
                {fa.l} {on && <span className="nn">· la tua fascia</span>}
              </span>
              {d
                ? <span><b className="mn">+{d[0]} iR</b> <span className="nn">in {d[1]} gg · {d[2]} allievi</span></span>
                : <span className="nn">dato insufficiente</span>}
            </div>
          );
        })}
        <p className="nota">
          {f ? `Nella tua fascia il ritmo è di ${perSett(f[0], f[1])} iR a settimana su ${f[2]} allievi.`
             : "In questa fascia non ha storico: prenoti al buio, il prezzo dovrebbe rifletterlo."}
        </p>
      </div>

      <div className="stit"><span>Fascia dichiarata dal coach</span></div>
      <div className="blocco">
        <p className="nota" style={{ marginTop: 0 }}>{fraseDichiarazione(c)}</p>
      </div>

      {c.patto && (
        <>
          <div className="stit"><span>Patto di risultato</span></div>
          <div className="blocco" style={{ borderColor: "rgba(179,34,41,.5)" }}>
            <div className="riga">
              <span>Obiettivo dichiarato dal coach</span>
              <b className="mn" style={{ color: "var(--rosso2)" }}>+{c.patto.ir} iR in {c.patto.gg} giorni</b>
            </div>
            <p className="nota">
              Se non ci arrivi, e hai fatto i compiti e almeno otto gare, la sessione successiva è a
              carico del coach. Lo decide il sistema sui dati.
            </p>
          </div>
        </>
      )}

      <div className="stit"><span>Come lavora</span></div>
      <p style={{ fontSize: 15, color: "var(--grigio)", lineHeight: 1.65 }}>{c.bio}</p>
      <ol style={{ paddingLeft: 20, marginTop: 14 }}>
        {c.metodo.map((m, i) => (
          <li key={i} style={{ color: "var(--grigio)", fontSize: 14.5, lineHeight: 1.6, marginBottom: 8 }}>{m}</li>
        ))}
      </ol>
      <div className="chips" style={{ marginTop: 16 }}>
        {c.auto.map((a) => <span className="chip" key={a}>{a}</span>)}
      </div>

      <div className="stit"><span>Allievi verificati</span></div>
      {c.rec.map((r, i) => (
        <div className="recens" key={i}>
          <div className="recmeta"><span style={{ color: "#fff" }}>{r.chi}</span><span>{r.auto}</span></div>
          <p>{r.txt}</p>
          <div className="recmeta">
            <span style={{ color: "var(--blu2)" }}>+{r.ir} iR in {r.gg} giorni</span>
            <span>{perSett(r.ir, r.gg)} iR/sett.</span>
          </div>
        </div>
      ))}

      <div className="stit"><span>Prenota · 60 minuti</span></div>
      <div className="slotgrid">
        {c.slots.map((s) => (
          <button key={s} className="slotchip" data-on={slot === s ? "1" : "0"} onClick={() => setSlot(s)}>{s}</button>
        ))}
      </div>
      <div className="blocco">
        <div className="riga"><span>Sessione 60 min</span><span className="mn">{c.prezzo.toFixed(2)} €</span></div>
        <div className="riga" style={{ color: "var(--grigio2)" }}>
          <span>di cui commissione CORDA (15%)</span><span className="mn">{fee} €</span>
        </div>
        <div className="riga"><b>Paghi ora</b><b className="mn" style={{ color: "var(--blu2)" }}>{c.prezzo.toFixed(2)} €</b></div>
      </div>
      <div style={{ margin: "16px 0 40px" }}>
        <button className="b b-blu b-lg" style={{ width: "100%" }} disabled={!slot} onClick={() => setFatto(true)}>
          {slot ? `Prenota ${slot}` : "Scegli uno slot"}
        </button>
      </div>
    </div>
  );
}

// link Discord del coach — mock: da sostituire con l'invito reale quando c'è
const DISCORD_DEFAULT = "https://discord.gg/corda-demo";
const DISCORD_COACH = { 1: "https://discord.gg/corda-vela" };

function Percorso({ vaiScheda }) {
  const [gareIds, setGareIds] = useState(PERCORSO.garePianificateIds);
  const [pickerAperto, setPickerAperto] = useState(false);
  const [ricaricaAperta, setRicaricaAperta] = useState(false);
  const [prenotazioni, setPrenotazioni] = useState(PERCORSO.prenotazioni);
  const [spostaAperto, setSpostaAperto] = useState(""); // id della prenotazione in modifica, "" = nessuna
  const [sospendiAperto, setSospendiAperto] = useState(false);
  const [sospesoMsg, setSospesoMsg] = useState(false);

  const toggleGara = (id) =>
    setGareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const cancellaSessione = (id) => setPrenotazioni((prev) => prev.filter((p) => p.id !== id));

  // lo slot scelto ("Gio 28 · 20:30") sostituisce interamente l'orario: la data
  // originale della prenotazione resta solo per l'ordinamento della lista
  const spostaSessione = (id, slot) => {
    setPrenotazioni((prev) => prev.map((p) => (p.id === id ? { ...p, orario: slot } : p)));
    setSpostaAperto("");
  };

  const sospendiTutto = () => {
    setPrenotazioni((prev) => prev.filter((p) => p.coachId !== coachAttuale?.id));
    setSospendiAperto(false);
    setSospesoMsg(true);
  };

  const coachAttuale = COACHES.find((c) => c.id === PERCORSO.coachAttualeId);
  const prossimeSessioni = [...prenotazioni].sort((a, b) => a.data.localeCompare(b.data));
  const garePianificate = CALENDARIO_STAGIONE
    .filter((g) => gareIds.includes(g.id))
    .sort((a, b) => a.data.localeCompare(b.data));
  const oreUsate = PERCORSO.oreAcquistate - PERCORSO.oreResidue;

  return (
    <div className="w">
      {/* 1. riga-titolo: sintesi del percorso — solo dati CORDA finché non c'è iRacing */}
      <div className="stit" style={{ marginTop: 26 }}><span>Il tuo percorso</span></div>
      <div className="metric">
        <div className="eyebrow">Da quando fai coaching</div>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 12, alignItems: "baseline" }}>
          <div>
            <div className="kval" style={{ fontSize: 34 }}>{PERCORSO.sessioniTotali}</div>
            <div className="ccsm">sessioni</div>
          </div>
          <div>
            <div className="kval" style={{ fontSize: 34 }}>{oreUsate}</div>
            <div className="ccsm">ore di coaching</div>
          </div>
        </div>
        <p className="nota">
          Il guadagno di iRating comparirà qui appena colleghi il tuo account iRacing.
        </p>
      </div>

      {/* 2. coach attuale + storico — il tuo percorso, non una classifica */}
      <div className="stit"><span>Il tuo coach</span></div>
      <div className="blocco">
        {coachAttuale ? (
          <>
            <div className="cctop">
              <div className="avat" style={{ width: 52, height: 52, fontSize: 18 }}>{iniz(coachAttuale.nome)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="ccnome">{coachAttuale.nome}</div>
                <div className="ccsub">
                  Dal {fmtData(PERCORSO.dalCoachAttuale)} · {PERCORSO.sessioniConAttuale} sessioni insieme
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="b b-blu" onClick={() => vaiScheda?.(coachAttuale)}>Vai al suo profilo</button>
              <button className="b b-ghost" onClick={() => setSospendiAperto(true)}>Sospendi</button>
              <a className="b b-ghost" href={DISCORD_COACH[coachAttuale.id] || DISCORD_DEFAULT}
                 target="_blank" rel="noopener noreferrer">
                Contatta su Discord
              </a>
            </div>

            {sospendiAperto && (
              <div className="notaBox rossa" style={{ marginTop: 14 }}>
                <p>
                  <b>Sospendere il coaching con {coachAttuale.nome}?</b> Tutte le sessioni prenotate
                  con lui verranno cancellate. Il vostro storico resta comunque visibile.
                </p>
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button className="b b-rosso" onClick={sospendiTutto}>Conferma sospensione</button>
                  <button className="b b-ghost" onClick={() => setSospendiAperto(false)}>Annulla</button>
                </div>
              </div>
            )}
            {sospesoMsg && (
              <p className="nota">
                Tutte le sessioni prenotate con {coachAttuale.nome} sono state cancellate.
              </p>
            )}
          </>
        ) : (
          <p className="nota" style={{ marginTop: 0 }}>Non hai ancora un coach attivo.</p>
        )}
      </div>

      {PERCORSO.storicoCoach.length > 0 && (
        <>
          <div className="stit"><span>Con chi hai lavorato prima</span></div>
          <div className="blocco">
            {PERCORSO.storicoCoach.map((s, i) => {
              const co = COACHES.find((c) => c.id === s.coachId);
              if (!co) return null;
              return (
                <div className="riga" key={i}>
                  <span>{co.nome} <span className="nn">· {s.periodo}</span></span>
                  <span>
                    <b className="mn" style={{ color: "var(--blu2)" }}>+{s.irGuadagnato} iR</b>{" "}
                    <span className="nn">· {s.sessioni} sessioni · {s.auto.join(", ")}</span>
                  </span>
                </div>
              );
            })}
            <p className="nota">È il tuo percorso, non una classifica: questi numeri restano tuoi.</p>
          </div>
        </>
      )}

      {/* 3. dati iRacing — strato 2, non ancora collegato */}
      <div className="stit"><span>I tuoi dati iRacing</span></div>
      <div className="lockbox">
        <div className="eyebrow">Da collegare</div>
        <p style={{ marginTop: 10, color: "var(--grigio)", fontSize: 14.5, lineHeight: 1.6 }}>
          Collega il tuo account iRacing per sbloccare qui la tua curva iRating, le ultime gare —
          con il confronto prima/dopo ogni sessione di coaching — e la tua licenza e Safety Rating.
        </p>
        <button className="b b-blu" style={{ marginTop: 14 }}>Collega il tuo account iRacing</button>
      </div>

      {/* 4. ore acquistate */}
      <div className="stit"><span>Ore di coaching</span></div>
      <div className="blocco">
        <div className="ccbig">{PERCORSO.oreResidue} ore residue</div>
        <div className="ccsm">su {PERCORSO.oreAcquistate} acquistate finora</div>
        <div className="orebar"><div className="orebarfill" style={{ width: `${(PERCORSO.oreResidue / PERCORSO.oreAcquistate) * 100}%` }} /></div>
        <button className="b b-ghost" style={{ marginTop: 16 }} onClick={() => setRicaricaAperta(true)}>
          Ricarica ore
        </button>
        {ricaricaAperta && (
          <p className="nota">
            Il pagamento online arriva in una prossima versione: per ora contatta il tuo coach o
            l'assistenza per aggiungere ore.
          </p>
        )}
      </div>

      {/* 5. calendario — sessioni di coaching e gare pianificate, due liste separate */}
      <div className="stit"><span>Prossime sessioni di coaching</span></div>
      <div className="blocco">
        {prossimeSessioni.length === 0 && <p className="nota" style={{ marginTop: 0 }}>Nessuna sessione in calendario.</p>}
        {prossimeSessioni.map((p) => {
          const co = COACHES.find((c) => c.id === p.coachId);
          return (
            <div key={p.id}>
              <div className="riga" style={{ flexDirection: "column", alignItems: "stretch", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>
                    <span className="dot" style={{ background: "var(--blu2)" }} />
                    {p.orario.includes("·") ? p.orario : `${fmtData(p.data)} · ${p.orario}`}
                  </span>
                  <span className="nn">{co?.nome}</span>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <button className="apri" style={{ padding: 0 }}
                          onClick={() => setSpostaAperto(spostaAperto === p.id ? "" : p.id)}>
                    Sposta
                  </button>
                  <button className="apri" style={{ padding: 0, color: "var(--ambra)" }}
                          onClick={() => cancellaSessione(p.id)}>
                    Cancella
                  </button>
                </div>
              </div>
              {spostaAperto === p.id && co && (
                <div className="slotgrid" style={{ marginTop: 0, marginBottom: 14 }}>
                  {co.slots.map((s) => (
                    <button key={s} className="slotchip" onClick={() => spostaSessione(p.id, s)}>{s}</button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="stit"><span>Gare che hai in programma</span></div>
      <div className="blocco">
        {garePianificate.length === 0 && (
          <p className="nota" style={{ marginTop: 0 }}>Non hai ancora selezionato gare dal calendario di stagione.</p>
        )}
        {garePianificate.map((g) => (
          <div className="riga" key={g.id}>
            <span><span className="dot" style={{ background: "var(--oro)" }} />{fmtData(g.data)} · {g.pista}</span>
            <span className="nn">{g.auto}</span>
          </div>
        ))}
        <button className="apri" onClick={() => setPickerAperto((v) => !v)}>
          {pickerAperto ? "▾ Chiudi il calendario di stagione" : "▸ Aggiungi una gara dal calendario di stagione"}
        </button>
        {pickerAperto && (
          <div style={{ marginTop: 4, borderTop: "1px solid var(--bordo)", paddingTop: 6 }}>
            {CALENDARIO_STAGIONE.map((g) => (
              <label className="riga" style={{ cursor: "pointer" }} key={g.id}>
                <span>
                  <input type="checkbox" checked={gareIds.includes(g.id)} onChange={() => toggleGara(g.id)}
                         style={{ marginRight: 10 }} />
                  {fmtData(g.data)} · {g.pista}
                </span>
                <span className="nn">{g.auto}</span>
              </label>
            ))}
            <p className="nota">Calendario di stagione provvisorio — verrà sostituito con quello ufficiale.</p>
          </div>
        )}
      </div>

      {/* 6. note & consigli del coach — archivio in lettura */}
      <div className="stit"><span>Note & consigli del coach</span></div>
      <div className="blocco" style={{ marginBottom: 40 }}>
        {PERCORSO.note.length === 0 && <p className="nota" style={{ marginTop: 0 }}>Ancora nessuna nota.</p>}
        {PERCORSO.note.map((n) => {
          const co = COACHES.find((c) => c.id === n.coachId);
          return (
            <div className="recens" key={n.id}>
              <div className="recmeta">
                <span>{co?.nome}</span><span>{fmtData(n.data)}</span>{n.pista && <span>· {n.pista}</span>}
              </div>
              <p>{n.testo}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------- AREA COACH -------------------------------- */

function AreaCoach() {
  const allievi = [
    { n: "L. Moretti", p: "Monza · Huracán", ir: 564, gg: 22, w: 82, s: "in regola · 19 gare" },
    { n: "S. Danieli", p: "Spa · Ferrari 296", ir: 318, gg: 35, w: 54, s: "in regola · 11 gare" },
    { n: "F. Curci", p: "Imola · Huracán", ir: 42, gg: 12, w: 12, s: "fermo da 9 giorni", warn: true },
  ];
  return (
    <div className="w">
      <div className="stit" style={{ marginTop: 26 }}><span>Il tuo punteggio</span><span>agg. 6 ore fa</span></div>
      <div className="kpigrid">
        <div className="kbox">
          <div className="klab">Mediana allievi</div>
          <div className="kval" style={{ color: "var(--blu2)" }}>+412 iR</div>
          <div className="ccsm" style={{ marginTop: 6 }}>in 30 giorni · 14 allievi tracciati</div>
        </div>
        <div className="kbox">
          <div className="klab">Incassato in agosto</div>
          <div className="kval">1.147 €</div>
          <div className="ccsm" style={{ marginTop: 6 }}>su 1.350 € lordi · 27 sessioni</div>
        </div>
      </div>

      <div className="avviso" style={{ marginTop: 20 }}>
        Un allievo non corre da 9 giorni. Sotto le otto gare mensili esce dal conteggio e il tuo
        punteggio scende senza che tu abbia sbagliato niente.
      </div>

      <div className="stit"><span>I tuoi allievi</span></div>
      {allievi.map((a) => (
        <div key={a.n} style={{ marginBottom: 16 }}>
          <div className="riga" style={{ borderBottom: 0, paddingBottom: 6 }}>
            <span>{a.n} <span className="nn">· {a.p}</span></span>
            <b className="mn" style={{ color: a.warn ? "var(--rosso2)" : "var(--blu2)" }}>+{a.ir} iR / {a.gg} gg</b>
          </div>
          <div style={{ height: 6, background: "var(--nero3)" }}>
            <i style={{ display: "block", height: "100%", width: a.w + "%", background: a.warn ? "var(--rosso2)" : "var(--blu)" }} />
          </div>
          <div className="ccsm" style={{ marginTop: 6, color: a.warn ? "var(--rosso2)" : undefined }}>{a.s}</div>
        </div>
      ))}

      <div className="stit"><span>Dove sei forte</span></div>
      <div className="blocco">
        <div className="riga"><span>Sotto 1.5k</span><b className="mn" style={{ color: "var(--blu2)" }}>+520 iR · 4 allievi</b></div>
        <div className="riga"><span>1.5k – 2.5k</span><b className="mn" style={{ color: "var(--blu2)" }}>+470 iR · 6 allievi</b></div>
        <div className="riga"><span>2.5k – 4k</span><b className="mn" style={{ color: "var(--blu2)" }}>+210 iR · 3 allievi</b></div>
        <div className="riga"><span>Sopra 4k</span><span className="nn">1 allievo · non mostrato</span></div>
        <p className="nota">
          Ti conviene farti trovare da chi parte sotto i 2.5k: è lì che i tuoi numeri parlano.
        </p>
      </div>

      <div className="stit"><span>Profilo pubblico</span></div>
      <div className="blocco" style={{ marginBottom: 40 }}>
        <div className="riga"><span>Account iRacing collegato</span><span className="mn" style={{ color: "var(--blu2)" }}>verificato</span></div>
        <div className="riga"><span>Sessione di prova</span><span className="mn" style={{ color: "var(--blu2)" }}>superata</span></div>
        <div className="riga"><span>Patto di risultato</span><span className="nn">non attivo</span></div>
        <div style={{ marginTop: 16 }}>
          <button className="b b-rosso">Modifica profilo</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ CANDIDATURA COACH ------------------------------ */

const FASCE_ORARIE = ["Feriali mattina", "Feriali pomeriggio", "Feriali sera", "Weekend giorno", "Weekend sera"];

function Candidatura({ chiudi, vaiLoginCoach }) {
  const [step, setStep] = useState(1); // 1 requisiti · 2 questionario · 3 conferma

  // cancello 1: requisiti automatici, verificati (in produzione) via account iRacing
  const [licenza, setLicenza] = useState("");
  const [anni, setAnni] = useState("");
  const [irMin, setIrMin] = useState("");
  const rispostoRequisiti = licenza !== "" && anni !== "" && irMin !== "";
  const requisitiOk = licenza === "A" && anni === "si" && irMin === "si";

  // cancello 2: questionario, 12 domande, revisione manuale
  const [r, setR] = useState({
    categoria: "", fascia: "", ore: "", fasceOrarie: FASCE_ORARIE.slice(0, 0), software: "",
    conduzione: "", postazione: "", q8: "", q9: "", q10: "", q11: "", q12: "",
  });
  const set = (k) => (e) => setR((prev) => ({ ...prev, [k]: e.target.value }));
  const toggleOraria = (v) =>
    setR((prev) => ({
      ...prev,
      fasceOrarie: prev.fasceOrarie.includes(v)
        ? prev.fasceOrarie.filter((x) => x !== v)
        : [...prev.fasceOrarie, v],
    }));

  const questionarioCompleto =
    r.categoria && r.fascia && r.ore && r.fasceOrarie.length > 0 && r.software &&
    r.conduzione && r.postazione && r.q8 && r.q9 && r.q10 && r.q11 && r.q12;

  if (step === 3)
    return (
      <div className="w">
        <button className="indietro" onClick={chiudi}>← Torna alla home</button>
        <div className="ok">
          <h2 style={{ fontSize: 24, color: "var(--blu2)" }}>Candidatura inviata</h2>
          <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.6 }}>
            Requisiti verificati, questionario ricevuto. Le risposte aperte le leggiamo a mano: se il
            profilo torna, ti scriviamo per fissare la prova.
          </p>
        </div>
        <div className="stit"><span>Stato candidatura</span></div>
        <div className="blocco" style={{ marginBottom: 40 }}>
          <div className="riga"><span>Requisiti automatici</span><b className="mn" style={{ color: "var(--blu2)" }}>superati</b></div>
          <div className="riga"><span>Questionario</span><b className="mn" style={{ color: "var(--blu2)" }}>in revisione</b></div>
          <div className="riga"><span>Prova reale · 30 minuti</span><span className="nn">in attesa di approvazione del questionario</span></div>
          <p className="nota">
            Appena il questionario è approvato lo stato passa a "in attesa di prova": una sessione da
            30 minuti in cui fai coaching a un pilota vero, non a noi.
          </p>
        </div>
      </div>
    );

  if (step === 2)
    return (
      <div className="w">
        <button className="indietro" onClick={() => setStep(1)}>← Torna ai requisiti</button>
        <div className="stit" style={{ marginTop: 8 }}><span>Candidatura coach · 2 di 3</span><span>Questionario</span></div>
        <p className="p" style={{ marginTop: 0 }}>
          12 domande. Le prime sono operative, le ultime aperte: al lancio le leggiamo di persona, non
          c'è un punteggio automatico.
        </p>

        <div className="campo">
          <label>1 · Categoria in cui vuoi fare coaching</label>
          <select value={r.categoria} onChange={set("categoria")}>
            <option value="">Seleziona…</option>
            <option value="coperte">Ruote coperte</option>
            <option value="scoperte">Ruote scoperte</option>
            <option value="entrambe">Entrambe</option>
          </select>
        </div>
        <div className="campo">
          <label>2 · Fascia di iRating a cui ti rivolgi</label>
          <select value={r.fascia} onChange={set("fascia")}>
            <option value="">Seleziona…</option>
            <option value="b1">Sotto 1.5k</option>
            <option value="b2">1.5k – 2.5k</option>
            <option value="b3">2.5k – 4k</option>
            <option value="b4">Sopra 4k</option>
            <option value="piu">Più di una</option>
          </select>
        </div>
        <div className="campo">
          <label>3 · Ore a settimana che puoi dedicare</label>
          <select value={r.ore} onChange={set("ore")}>
            <option value="">Seleziona…</option>
            <option value="sotto3">Sotto 3</option>
            <option value="3-6">3 – 6</option>
            <option value="6-12">6 – 12</option>
            <option value="oltre12">Oltre 12</option>
          </select>
        </div>
        <div className="campo">
          <label>4 · Fasce orarie in cui sei disponibile</label>
          <div className="checkgrid">
            {FASCE_ORARIE.map((v) => (
              <label key={v}>
                <input type="checkbox" checked={r.fasceOrarie.includes(v)} onChange={() => toggleOraria(v)} />
                {v}
              </label>
            ))}
          </div>
        </div>
        <div className="campo">
          <label>5 · Software che usi per la telemetria</label>
          <select value={r.software} onChange={set("software")}>
            <option value="">Seleziona…</option>
            <option value="motec">MoTeC</option>
            <option value="atlas">Atlas</option>
            <option value="ispeed">iSpeed</option>
            <option value="altro">Altro</option>
            <option value="nessuno">Nessuno</option>
          </select>
        </div>
        <div className="campo">
          <label>6 · Come conduci una sessione</label>
          <select value={r.conduzione} onChange={set("conduzione")}>
            <option value="">Seleziona…</option>
            <option value="live">Voce live in gara</option>
            <option value="telemetria">Analisi telemetria registrata</option>
            <option value="entrambi">Entrambi</option>
          </select>
        </div>
        <div className="campo">
          <label>7 · Hai una postazione da cui condividere schermo e telemetria in tempo reale?</label>
          <select value={r.postazione} onChange={set("postazione")}>
            <option value="">Seleziona…</option>
            <option value="si">Sì</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="campo">
          <label>8 · Descrivi come struttureresti la prima sessione con un pilota che non conosci.</label>
          <textarea value={r.q8} onChange={set("q8")} />
        </div>
        <div className="campo">
          <label>9 · Un allievo dopo tre sessioni non è migliorato. Cosa fai?</label>
          <textarea value={r.q9} onChange={set("q9")} />
        </div>
        <div className="campo">
          <label>10 · Un allievo vuole lavorare sulla velocità in curva, ma dai suoi dati vedi che perde
            soprattutto in staccata. Come gestisci la differenza tra quello che chiede e quello che gli serve?</label>
          <textarea value={r.q10} onChange={set("q10")} />
        </div>
        <div className="campo">
          <label>11 · Raccontaci un tuo limite come pilota e come l'hai affrontato.</label>
          <textarea value={r.q11} onChange={set("q11")} />
        </div>
        <div className="campo">
          <label>12 · Perché vuoi fare coaching su una piattaforma piccola e nuova invece che sul tuo Discord?</label>
          <textarea value={r.q12} onChange={set("q12")} />
        </div>

        <div style={{ margin: "16px 0 40px" }}>
          <button className="b b-rosso b-lg" style={{ width: "100%" }} disabled={!questionarioCompleto}
                  onClick={() => setStep(3)}>
            {questionarioCompleto ? "Invia candidatura" : "Rispondi a tutte le domande per continuare"}
          </button>
        </div>
      </div>
    );

  return (
    <div className="w">
      <button className="indietro" onClick={chiudi}>← Torna alla home</button>
      <div className="stit" style={{ marginTop: 8 }}><span>Candidatura coach · 1 di 3</span><span>Requisiti</span></div>
      <p className="p" style={{ marginTop: 0 }}>
        Tre condizioni verificate tramite il tuo account iRacing. Da sole determinano se puoi
        candidarti: non bloccano una singola prenotazione, quello lo fa la forbice di livello con
        ogni pilota.
      </p>

      <div className="filtri">
        <div className="fhead"><span>REQUISITI</span><span>iRACING</span></div>
        <div className="frow">
          <label htmlFor="rl">Licenza</label>
          <select id="rl" value={licenza} onChange={(e) => setLicenza(e.target.value)}>
            <option value="">Seleziona…</option>
            <option value="A">Licenza A</option>
            <option value="altra">Licenza B, C o D</option>
          </select>
        </div>
        <div className="frow">
          <label htmlFor="ra">Account ≥ 3 anni</label>
          <select id="ra" value={anni} onChange={(e) => setAnni(e.target.value)}>
            <option value="">Seleziona…</option>
            <option value="si">Sì, da almeno 3 anni</option>
            <option value="no">No, meno di 3 anni</option>
          </select>
        </div>
        <div className="frow">
          <label htmlFor="ri">iRating ≥ 3.000</label>
          <select id="ri" value={irMin} onChange={(e) => setIrMin(e.target.value)}>
            <option value="">Seleziona…</option>
            <option value="si">Sì, 3.000 o più</option>
            <option value="no">No, sotto i 3.000</option>
          </select>
        </div>
      </div>

      {rispostoRequisiti && !requisitiOk && (
        <div className="notaBox rossa">
          <p>
            <b>Non soddisfi ancora i requisiti minimi.</b> Servono licenza A, almeno 3 anni di account
            iRacing e un iRating minimo di 3.000 per candidarsi come coach su CORDA. Puoi ricandidarti
            appena li raggiungi.
          </p>
        </div>
      )}

      {requisitiOk && (
        <div style={{ margin: "20px 0 40px" }}>
          <button className="b b-rosso b-lg" style={{ width: "100%" }} onClick={() => setStep(2)}>
            Continua al questionario
          </button>
        </div>
      )}

      <p className="nota">
        Hai già un profilo attivo? <button className="apri" style={{ display: "inline", padding: 0 }}
          onClick={vaiLoginCoach}>Accedi</button>
      </p>
    </div>
  );
}

/* ---------------------------------- APP ---------------------------------- */

export default function App() {
  const [pagina, setPagina] = useState("home"); // home | login | app | candidatura
  const [ruolo, setRuolo] = useState("pilota");
  const [tab, setTab] = useState("cerca");
  const [coach, setCoach] = useState(null);
  const [mia, setMia] = useState("b2");
  const [miaIr, setMiaIr] = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, [pagina, tab, coach]);

  const vaiLogin = (r) => { setRuolo(r); setPagina("login"); };
  const vaiCandidatura = () => setPagina("candidatura");
  const entra = () => { setPagina("app"); setTab(ruolo === "coach" ? "dash" : "cerca"); setCoach(null); };
  const esci = () => { setPagina("home"); setCoach(null); };

  return (
    <div className="crd">
      <style>{CSS}</style>

      <header className="nav">
        <div className="w navin">
          <button className="brand" onClick={esci}>CORD<i>A</i></button>
          {pagina === "home" && (
            <nav className="navlinks">
              <button onClick={() => document.getElementById("come")?.scrollIntoView({ behavior: "smooth" })}>
                Come funziona
              </button>
              <button onClick={vaiCandidatura}>Per i coach</button>
            </nav>
          )}
          <div className="navcta">
            {pagina === "app" ? (
              <button className="b b-ghost" onClick={esci}>Esci</button>
            ) : (
              <>
                <button className="b b-ghost" onClick={() => vaiLogin("pilota")}>Accedi</button>
                <button className="b b-rosso" onClick={() => vaiLogin("pilota")}>Inizia</button>
              </>
            )}
          </div>
        </div>
      </header>

      {pagina === "home" && <Home vaiLogin={vaiLogin} vaiCandidatura={vaiCandidatura} />}
      {pagina === "login" && <Login ruolo={ruolo} setRuolo={setRuolo} entra={entra} />}
      {pagina === "candidatura" && <Candidatura chiudi={esci} vaiLoginCoach={() => vaiLogin("coach")} />}

      {pagina === "app" && (
        <>
          <div className="appbar">
            <div className="w appbarin">
              {ruolo === "pilota" ? (
                <>
                  <button data-on={tab === "cerca" ? "1" : "0"} onClick={() => { setTab("cerca"); setCoach(null); }}>Cerca coach</button>
                  <button data-on={tab === "percorso" ? "1" : "0"} onClick={() => { setTab("percorso"); setCoach(null); }}>Il mio percorso</button>
                </>
              ) : (
                <button data-on="1">Area coach</button>
              )}
              <span className="esci mn">{ruolo === "coach" ? "MARCO BERTOLINI" : "L. MORETTI · 1.842 iR"}</span>
            </div>
          </div>

          {ruolo === "pilota" && tab === "cerca" && (coach
            ? <Scheda c={coach} mia={mia} miaIr={miaIr} chiudi={() => setCoach(null)}
                       vaiPercorso={() => { setCoach(null); setTab("percorso"); }} vediCoach={setCoach} />
            : <Cerca apri={setCoach} mia={mia} setMia={setMia} miaIr={miaIr} setMiaIr={setMiaIr} />)}
          {ruolo === "pilota" && tab === "percorso" && (
            <Percorso vaiScheda={(co) => { setCoach(co); setTab("cerca"); }} />
          )}
          {ruolo === "coach" && <AreaCoach />}
        </>
      )}
    </div>
  );
}
