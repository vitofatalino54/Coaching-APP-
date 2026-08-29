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

const COACHES = [
  {
    id: 1, nome: "Marco Bertolini", cat: ["gt"], tag: "vela", lic: "A", ir: 4820, prezzo: 45,
    auto: ["Ferrari 296 GT3", "Lamborghini Huracán GT3 EVO"], spec: ["Trail braking", "Qualifica"],
    obiettivi: ["tempo", "quali"], irMed: 412, gg: 30, tracciati: 14, agg: "6 ore fa",
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
    id: 2, nome: "Elena Kovač", cat: ["gt"], tag: "kovi", lic: "A", ir: 5610, prezzo: 60,
    auto: ["Porsche 911 GT3 R", "BMW M4 GT3"], spec: ["Race craft", "Traffico"],
    obiettivi: ["gara"], irMed: 508, gg: 34, tracciati: 11, agg: "2 ore fa",
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
    id: 3, nome: "Davide Sanna", cat: ["gt"], tag: "sanna_dvd", lic: "B", ir: 3240, prezzo: 35,
    auto: ["Lamborghini Huracán GT3 EVO", "Audi R8 LMS EVO II"], spec: ["Setup", "Gomme"],
    obiettivi: ["setup", "endurance"], irMed: 260, gg: 28, tracciati: 22, agg: "1 giorno fa",
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
    id: 4, nome: "Giulia Ferraro", cat: ["gt"], tag: "giu_f", lic: "B", ir: 2880, prezzo: 25,
    auto: ["Ferrari 296 GT3"], spec: ["Fondamentali", "Licenza D"],
    obiettivi: ["licenza", "tempo"], irMed: 640, gg: 26, tracciati: 19, agg: "4 ore fa",
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
    id: 5, nome: "Tom Reeves", cat: ["proto", "gt"], tag: "reeves", lic: "A", ir: 6110, prezzo: 70,
    auto: ["Oreca 07 LMP2", "Mercedes-AMG GT3 EVO", "BMW M4 GT3"], spec: ["Endurance", "Ritmo di stint"],
    obiettivi: ["endurance", "gara"], irMed: 300, gg: 40, tracciati: 9, agg: "8 ore fa",
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
    id: 6, nome: "Niko Aaltonen", cat: ["gt"], tag: "aalto", lic: "A", ir: 7020, prezzo: 85,
    auto: ["Porsche 911 GT3 R", "Mercedes-AMG GT3 EVO"], spec: ["Qualifica", "Trail braking"],
    obiettivi: ["quali", "tempo"], irMed: 210, gg: 35, tracciati: 6, agg: "3 giorni fa",
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
    id: 7, nome: "Andrea Pili", cat: ["mono"], tag: "pili_a", lic: "A", ir: 4180, prezzo: 40,
    auto: ["Dallara F3", "Super Formula Lights", "Ray FF1600"], spec: ["Monoposto", "Staccata"],
    obiettivi: ["tempo", "quali"], irMed: 380, gg: 32, tracciati: 8, agg: "1 giorno fa",
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
  {
    id: 8, nome: "Wade Carter", cat: ["oval"], tag: "wcarter", lic: "B", ir: 2960, prezzo: 30,
    auto: ["NASCAR Next Gen Camry", "ARCA Menards Chevrolet"], spec: ["Ovali", "Pack racing"],
    obiettivi: ["gara", "licenza"], irMed: 470, gg: 30, tracciati: 12, agg: "9 ore fa",
    fasce: { b1: [560, 26, 5], b2: [420, 30, 5], b3: [190, 40, 3], b4: null },
    curva: [1420, 1408, 1436, 1414, 1448, 1502, 1566, 1620, 1684, 1730, 1788, 1836, 1872], start: 4,
    patto: { ir: 250, gg: 60 },
    bio: "Sugli ovali il 90% degli incidenti nasce da dove metti la macchina nel gruppo, non da quanto vai forte.",
    metodo: ["Prima cosa: leggere l'aria e capire dove sei nel pack.", "Gestione dell'entrata in curva 1 in traffico.",
      "Strategia di gomma e carburante sui long run.", "Analisi delle ultime cinque gare, giro per giro."],
    slots: ["Gio 28 · 22:00", "Sab 30 · 21:00", "Dom 31 · 22:30"],
    rec: [{ chi: "J. Nolan", auto: "ARCA · Charlotte", ir: 588, gg: 27,
      txt: "Ho smesso di trovarmi sempre in mezzo ai casini al giro 30. Il resto è venuto da solo." }],
  },
];

const CATEGORIE = [
  { k: "tutte", l: "Tutte le categorie" },
  { k: "gt", l: "Gran Turismo · GT3 e GT4" },
  { k: "proto", l: "Prototipi · LMP2 e GTP" },
  { k: "mono", l: "Monoposto" },
  { k: "oval", l: "Ovali" },
];

const AUTO_PER_CAT = {
  gt: ["Ferrari 296 GT3", "Porsche 911 GT3 R", "Lamborghini Huracán GT3 EVO", "BMW M4 GT3",
       "Mercedes-AMG GT3 EVO", "Audi R8 LMS EVO II", "Porsche 718 GT4"],
  proto: ["Oreca 07 LMP2", "Acura ARX-06 GTP", "Ligier JS P320"],
  mono: ["Dallara F3", "Super Formula Lights", "Ray FF1600", "Formula Vee"],
  oval: ["NASCAR Next Gen Camry", "ARCA Menards Chevrolet", "Legends Ford '34"],
};

const TUTTE = "Tutte le vetture";
const autoDi = (cat) =>
  cat === "tutte"
    ? Object.values(AUTO_PER_CAT).flat()
    : AUTO_PER_CAT[cat] || [];

const OBIETTIVI = [
  { k: "tutti", l: "Qualsiasi obiettivo" },
  { k: "licenza", l: "Uscire dalla licenza D" },
  { k: "tempo", l: "Trovare il tempo sul giro" },
  { k: "quali", l: "Andare forte in qualifica" },
  { k: "gara", l: "Race craft in gara" },
  { k: "setup", l: "Setup e gestione gomme" },
  { k: "endurance", l: "Endurance e ritmo di stint" },
];

/* ---------------------------------- stile ---------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Inter:wght@400;500;600&family=Roboto+Mono:wght@400;500&display=swap');

.crd{
  --nero:#0A0B0D; --nero2:#121418; --nero3:#1A1D23; --bordo:#282C34;
  --bianco:#FFFFFF; --grigio:#9BA3AF; --grigio2:#6B727D;
  --rosso:#8E1A20; --rosso2:#B32229; --rossoSoft:rgba(179,34,41,.12);
  --blu:#1D4FD7; --blu2:#3C6DF0; --bluSoft:rgba(29,79,215,.12);
  background:var(--nero); color:var(--bianco); min-height:100%;
  font-family:'Inter',system-ui,sans-serif; -webkit-font-smoothing:antialiased; line-height:1.5;
}
.crd *{box-sizing:border-box}
.crd h1,.crd h2,.crd h3{font-family:'Archivo',system-ui,sans-serif;font-weight:700;line-height:1.08;margin:0;letter-spacing:-.02em}
.mn{font-family:'Roboto Mono',ui-monospace,monospace;font-variant-numeric:tabular-nums}
.w{max-width:1080px;margin:0 auto;padding:0 20px}
.eyebrow{font-family:'Roboto Mono',monospace;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--grigio2)}

/* ---- barra ---- */
.nav{position:sticky;top:0;z-index:40;background:rgba(10,11,13,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--bordo)}
.navin{display:flex;align-items:center;gap:18px;height:62px}
.brand{font-family:'Archivo',sans-serif;font-weight:800;font-size:21px;letter-spacing:.14em;cursor:pointer;
  background:none;border:0;color:var(--bianco);padding:0}
.brand i{color:var(--rosso2);font-style:normal}
.navlinks{display:none;gap:22px;margin-left:14px}
@media(min-width:820px){.navlinks{display:flex}}
.navlinks button{background:none;border:0;color:var(--grigio);font-size:14px;cursor:pointer;font-family:inherit;padding:4px 0}
.navlinks button:hover{color:var(--bianco)}
.navcta{margin-left:auto;display:flex;gap:8px}

/* ---- bottoni ---- */
.b{font-family:'Archivo',sans-serif;font-weight:600;font-size:14px;letter-spacing:.01em;
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
.bcell b{display:block;font-family:'Archivo',sans-serif;font-size:29px;font-weight:700;letter-spacing:-.02em}
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
.metric .big{font-family:'Archivo',sans-serif;font-size:52px;font-weight:800;color:var(--blu2);letter-spacing:-.03em;line-height:1}
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
.faq summary{cursor:pointer;font-family:'Archivo',sans-serif;font-weight:600;font-size:16.5px;list-style:none}
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
  font-family:'Archivo',sans-serif;font-weight:600;font-size:14px}
.tabs button[data-on="1"][data-r="pilota"]{background:var(--blu);color:#fff}
.tabs button[data-on="1"][data-r="coach"]{background:var(--rosso);color:#fff}
.campo{margin-bottom:14px}
.campo label{display:block;font-family:'Roboto Mono',monospace;font-size:10.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--grigio2);margin-bottom:6px}
.campo input{width:100%;background:var(--nero);border:1px solid var(--bordo);color:var(--bianco);
  padding:11px 12px;font-family:'Inter',sans-serif;font-size:14px;border-radius:2px}
.campo input:focus{outline:none;border-color:var(--grigio)}
.hintbox{border-left:2px solid var(--bordo);padding-left:12px;margin-top:18px;color:var(--grigio2);font-size:12.5px;line-height:1.6}

/* ---- app ---- */
.appbar{border-bottom:1px solid var(--bordo);background:var(--nero2)}
.appbarin{display:flex;align-items:center;gap:4px;height:50px;overflow-x:auto}
.appbarin button{background:none;border:0;border-bottom:2px solid transparent;color:var(--grigio);
  padding:14px 12px;cursor:pointer;font-family:'Archivo',sans-serif;font-weight:600;font-size:14px;white-space:nowrap}
.appbarin button[data-on="1"]{color:var(--bianco);border-bottom-color:var(--rosso2)}
.appbarin .esci{margin-left:auto;color:var(--grigio2);font-size:13px;font-weight:500}

.filtri{border:1px solid var(--bordo);background:var(--nero2);margin:22px 0}
.fhead{padding:10px 14px;border-bottom:1px solid var(--bordo);font-family:'Roboto Mono',monospace;
  font-size:10.5px;letter-spacing:.18em;color:var(--grigio2);display:flex;justify-content:space-between}
.frow{display:flex;align-items:center;gap:12px;padding:11px 14px;border-bottom:1px solid var(--bordo)}
.frow:last-child{border-bottom:0}
.frow.hi{background:var(--bluSoft)}
.frow label{font-family:'Roboto Mono',monospace;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--grigio2);width:104px;flex:none}
.frow.hi label{color:var(--blu2)}
.frow select{flex:1;background:var(--nero);color:var(--bianco);border:1px solid var(--bordo);
  padding:8px 10px;font-family:'Roboto Mono',monospace;font-size:13px;border-radius:2px}

.lista{display:grid;gap:14px;grid-template-columns:1fr;margin:20px 0 40px}
@media(min-width:780px){.lista{grid-template-columns:1fr 1fr}}
.cc{border:1px solid var(--bordo);background:var(--nero2);padding:18px;text-align:left;cursor:pointer;
  color:inherit;font:inherit;width:100%;transition:border-color .16s,transform .16s}
.cc:hover{border-color:var(--rosso2);transform:translateY(-2px)}
.cc:focus-visible{outline:2px solid var(--blu2);outline-offset:2px}
.cctop{display:flex;gap:12px;align-items:center}
.avat{width:44px;height:44px;flex:none;background:var(--nero3);border:1px solid var(--bordo);
  display:flex;align-items:center;justify-content:center;font-family:'Archivo',sans-serif;font-weight:700;color:var(--grigio)}
.ccnome{font-family:'Archivo',sans-serif;font-weight:700;font-size:18px}
.ccsub{font-family:'Roboto Mono',monospace;font-size:11.5px;color:var(--grigio2)}
.ccmetr{display:flex;align-items:flex-end;gap:14px;margin-top:16px}
.ccbig{font-family:'Archivo',sans-serif;font-weight:800;font-size:30px;color:var(--blu2);letter-spacing:-.02em;line-height:1}
.ccsm{font-family:'Roboto Mono',monospace;font-size:11px;color:var(--grigio2);line-height:1.5}
.fit{margin-top:14px;border:1px solid rgba(29,79,215,.35);background:var(--bluSoft);padding:9px 11px;font-size:13px}
.fit b{color:var(--blu2)}
.fit.no{border-color:var(--bordo);background:var(--nero);color:var(--grigio2)}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}
.chip{font-family:'Roboto Mono',monospace;font-size:10.5px;letter-spacing:.06em;border:1px solid var(--bordo);
  color:var(--grigio2);padding:4px 8px}
.chip.p{border-color:rgba(179,34,41,.45);color:var(--rosso2)}
.ccfoot{display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:14px;border-top:1px solid var(--bordo)}
.prezzo{font-family:'Archivo',sans-serif;font-weight:700;font-size:20px}
.prezzo small{color:var(--grigio2);font-weight:500;font-size:12px}

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
.kval{font-family:'Archivo',sans-serif;font-weight:800;font-size:32px;margin-top:8px;letter-spacing:-.02em}
.apri{background:none;border:0;color:var(--blu2);cursor:pointer;font-family:'Roboto Mono',monospace;font-size:12px;padding:10px 0;text-align:left}
.regole{border-left:2px solid var(--bordo);padding-left:14px;margin:4px 0 0}
.regole li{font-size:12.5px;color:var(--grigio2);line-height:1.55;margin-bottom:8px}
.recens{border-left:2px solid var(--bordo);padding-left:14px;margin-bottom:16px}
.recens p{font-size:14px;line-height:1.6;margin:7px 0}
.recmeta{display:flex;gap:12px;flex-wrap:wrap;font-family:'Roboto Mono',monospace;font-size:11.5px;color:var(--grigio2)}
@media (prefers-reduced-motion:reduce){.crd *{transition:none!important}}
`;

/* -------------------------------- componenti -------------------------------- */

const iniz = (n) => n.split(" ").map((x) => x[0]).join("");
const perSett = (ir, gg) => Math.round((ir / gg) * 7);

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

function Home({ vaiLogin }) {
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
              <button className="b b-ghost b-lg" onClick={() => vaiLogin("coach")}>
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
              <button className="b b-rosso" onClick={() => vaiLogin("coach")}>Entra come coach</button>
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

function Cerca({ apri, mia, setMia }) {
  const [cat, setCat] = useState("tutte");
  const [auto, setAuto] = useState(TUTTE);
  const [obi, setObi] = useState("tutti");

  const cambiaCat = (k) => { setCat(k); setAuto(TUTTE); };

  const list = [...COACHES]
    .filter((c) => (cat === "tutte" || c.cat.includes(cat)) &&
                   (auto === TUTTE || c.auto.includes(auto)) &&
                   (obi === "tutti" || c.obiettivi.includes(obi)))
    .sort((a, b) => {
      const fa = a.fasce[mia], fb = b.fasce[mia];
      if (fa && !fb) return -1;
      if (!fa && fb) return 1;
      if (fa && fb) return perSett(fb[0], fb[1]) - perSett(fa[0], fa[1]);
      return 0;
    });

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
            {autoDi(cat).map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div className="frow">
          <label htmlFor="f3">Obiettivo</label>
          <select id="f3" value={obi} onChange={(e) => setObi(e.target.value)}>
            {OBIETTIVI.map((o) => <option key={o.k} value={o.k}>{o.l}</option>)}
          </select>
        </div>
      </div>

      <p className="nota" style={{ marginTop: 0 }}>
        L'ordine cambia con la tua fascia: chi fa numeri enormi con i principianti non è detto che
        li faccia con te.
      </p>

      <div className="lista">
        {list.map((c) => {
          const f = c.fasce[mia];
          return (
            <button key={c.id} className="cc" onClick={() => apri(c)}>
              <div className="cctop">
                <div className="avat">{iniz(c.nome)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ccnome">{c.nome}</div>
                  <div className="ccsub">@{c.tag} · {c.ir} iR · licenza {c.lic}</div>
                </div>
              </div>

              <div className="ccmetr">
                <div>
                  <div className="ccbig">+{c.irMed} iR</div>
                  <div className="ccsm">mediana allievi · {c.gg} gg<br />{perSett(c.irMed, c.gg)} iR a settimana</div>
                </div>
                <Spark curva={c.curva} start={c.start} />
              </div>

              {f ? (
                <div className="fit">Con piloti come te: <b>+{f[0]} iR in {f[1]} gg</b> · {f[2]} allievi</div>
              ) : (
                <div className="fit no">Nessun dato nella tua fascia.</div>
              )}

              <div className="chips">
                {c.spec.map((s) => <span className="chip" key={s}>{s}</span>)}
                {c.patto && <span className="chip p">Patto di risultato</span>}
              </div>

              <div className="ccfoot">
                <span className="ccsm">{c.tracciati} allievi tracciati · agg. {c.agg}</span>
                <span className="prezzo">{c.prezzo}€ <small>/h</small></span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Scheda({ c, mia, chiudi, vaiPercorso }) {
  const [slot, setSlot] = useState(null);
  const [fatto, setFatto] = useState(false);
  const [apri, setApri] = useState(false);
  const f = c.fasce[mia];
  const fee = (c.prezzo * 0.15).toFixed(2);

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
        <div>
          <h2 style={{ fontSize: 28 }}>{c.nome}</h2>
          <div className="ccsub">@{c.tag} · {c.ir} iR · licenza {c.lic} · {c.prezzo}€/h</div>
        </div>
      </div>

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

function Percorso() {
  const curva = [1780, 1762, 1794, 1770, 1802, 1788, 1842, 1898, 1940, 2010, 2064, 2118, 2172, 2206];
  const start = 5;
  const min = Math.min(...curva), max = Math.max(...curva);
  const pts = curva.map((v, i) => {
    const x = (i / (curva.length - 1)) * 300;
    const y = 88 - ((v - min) / (max - min)) * 74;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const sx = ((start / (curva.length - 1)) * 300).toFixed(1);

  return (
    <div className="w">
      <div className="stit" style={{ marginTop: 26 }}><span>Il tuo percorso · Marco Bertolini</span><span>giorno 22</span></div>
      <div className="kpigrid">
        <div className="kbox">
          <div className="klab">Guadagno dal punto zero</div>
          <div className="kval" style={{ color: "var(--blu2)" }}>+564 iR</div>
          <div className="ccsm" style={{ marginTop: 6 }}>in 22 giorni · 179 iR a settimana</div>
        </div>
        <div className="kbox">
          <div className="klab">Proiezione a 60 giorni</div>
          <div className="kval">≈ 2.680</div>
          <div className="ccsm" style={{ marginTop: 6 }}>se tieni questo ritmo di gare</div>
        </div>
      </div>

      <div className="stit"><span>iRating · 30 giorni prima e dopo</span></div>
      <div className="blocco">
        <svg viewBox="0 0 300 100" width="100%" height="130" role="img" aria-label="Curva iRating">
          <line x1={sx} y1="0" x2={sx} y2="94" stroke="#8E1A20" strokeWidth="1" strokeDasharray="3 3" />
          <polyline points={pts.slice(0, start + 1).join(" ")} fill="none" stroke="#6B727D" strokeWidth="2" />
          <polyline points={pts.slice(start).join(" ")} fill="none" stroke="#3C6DF0" strokeWidth="2.5" />
          <text x={+sx + 4} y="10" fill="#B32229" fontSize="8" fontFamily="Roboto Mono, monospace">prima sessione</text>
        </svg>
        <div className="ccsm">1.788 al punto zero · 2.206 oggi · 19 gare nel periodo</div>
      </div>

      <div className="avviso" style={{ marginTop: 20 }}>
        Sei fermo da 6 giorni. Servono otto gare ogni 30 giorni: senza gare la curva si appiattisce
        e il lavoro fatto non risulta a nessuno dei due.
      </div>

      <div className="stit"><span>Note del coach · sessione 03</span></div>
      <ul style={{ paddingLeft: 20 }}>
        <li style={{ color: "var(--grigio)", marginBottom: 8 }}>Prima variante: stai ancora frenando dritta.</li>
        <li style={{ color: "var(--grigio)", marginBottom: 8 }}>Lesmo 1: entri lunga per compensare il sottosterzo.</li>
        <li style={{ color: "var(--grigio)", marginBottom: 8 }}>Parabolica: qui vai bene, non toccare niente.</li>
      </ul>

      <div className="stit"><span>Da fare prima di venerdì</span></div>
      <ul style={{ paddingLeft: 20 }}>
        <li style={{ color: "var(--grigio)", marginBottom: 8 }}>Tre gare ufficiali, servono anche al conteggio.</li>
        <li style={{ color: "var(--grigio)", marginBottom: 8 }}>Venti giri sulla prima variante.</li>
        <li style={{ color: "var(--grigio)", marginBottom: 8 }}>Carica il run qui.</li>
      </ul>
      <div style={{ margin: "16px 0 40px" }}>
        <button className="b b-ghost b-lg" style={{ width: "100%" }}>Carica il run</button>
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

/* ---------------------------------- APP ---------------------------------- */

export default function App() {
  const [pagina, setPagina] = useState("home"); // home | login | app
  const [ruolo, setRuolo] = useState("pilota");
  const [tab, setTab] = useState("cerca");
  const [coach, setCoach] = useState(null);
  const [mia, setMia] = useState("b2");

  useEffect(() => { window.scrollTo(0, 0); }, [pagina, tab, coach]);

  const vaiLogin = (r) => { setRuolo(r); setPagina("login"); };
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
              <button onClick={() => vaiLogin("coach")}>Per i coach</button>
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

      {pagina === "home" && <Home vaiLogin={vaiLogin} />}
      {pagina === "login" && <Login ruolo={ruolo} setRuolo={setRuolo} entra={entra} />}

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
            ? <Scheda c={coach} mia={mia} chiudi={() => setCoach(null)} vaiPercorso={() => { setCoach(null); setTab("percorso"); }} />
            : <Cerca apri={setCoach} mia={mia} setMia={setMia} />)}
          {ruolo === "pilota" && tab === "percorso" && <Percorso />}
          {ruolo === "coach" && <AreaCoach />}
        </>
      )}
    </div>
  );
}
