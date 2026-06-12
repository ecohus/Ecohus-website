// ───────────────────────────────────────────────────────────────────────────
// Ecohus — Standardopbygning, priser og tilvalg
//
// Single source of truth for the standard construction spec, pricing and
// add-ons. Used by the price calculator, model detail pages and the homepage
// so copy and prices never drift between pages.
// ───────────────────────────────────────────────────────────────────────────

/** Vejledende kvadratmeterpris for et nøglefærdigt Ecohus inkl. standardopbygning. */
export const PRICE_PER_M2_FROM = 17599;

/** Det kunden får for kvadratmeterprisen — vist i pris-transparens-sektionen. */
export const STANDARD_PRICE_INCLUSIONS = [
  "Støbt fundament med gulvvarme",
  "Isoleret klimaskærm iht. BR18",
  "3-lags energivinduer",
  "Køkken og badeværelse",
  "El- og VVS-installationer",
  "Indvendige overflader",
  "Nøglefærdig levering",
];

/** Standard konstruktion — gælder for alle modeller. */
export const STANDARD_CONSTRUCTION: { title: string; items: string[] }[] = [
  {
    title: "Vægkonstruktion",
    items: [
      "Udvendig facadebeklædning i træ eller Thermowood",
      "Ventileret facadeopbygning med vindspærre",
      "12 mm OSB-plade",
      "Træskelet 45 × 195 mm",
      "195 mm mineraluld eller træfiberisolering",
      "Dampspærre",
      "Installationsvæg 45 × 45 mm med 45 mm isolering",
      "Indvendig beklædning i gips eller Fermacell",
      "Malerbehandlet overflade",
    ],
  },
  {
    title: "Tagtype",
    items: [
      "Sadeltag med 25–30 graders hældning",
      "Tagpap eller tagsten",
      "Diffusionsåbent undertag",
      "Tagkonstruktion 45 × 295 mm spær",
      "390 mm isolering",
      "Dampspærre",
      "Troldtekt- eller gipslofter",
    ],
  },
  {
    title: "Vinduer og døre",
    items: [
      "3-lags energivinduer med lavenergiruder",
      "Facadedør med glasparti",
      "Terrassedøre efter plantegning",
      "Udvendig farve sort eller antracit som standard",
    ],
  },
];

/** Inkluderet i standardprisen. */
export const INCLUDED_IN_STANDARD = [
  "Projektering og byggetegninger",
  "Fundament (traditionelt støbt fundament)",
  "Komplet klimaskærm",
  "Vinduer og yderdøre",
  "Isolering iht. BR18",
  "El-installation standard",
  "VVS-installation standard",
  "Gulvvarme i hele huset",
  "Standard køkken",
  "Badeværelse med fliser",
  "Malerbehandlede vægge og lofter",
  "Gulvbelægning",
  "Indvendige døre og lister",
  "Ventilationsanlæg med varmegenvinding",
];

/** Ikke inkluderet — tilvalg, der kan tilkøbes. */
export const NOT_INCLUDED = [
  "Solcelleanlæg",
  "Luft/vand varmepumpe",
  "Smart Home løsning",
  "Udekøkken",
  "Indbygningsbrændeovn",
  "Carport eller garage",
  "Ekstra terrassearealer",
  "Belægning og haveanlæg",
  "Tilslutningsafgifter",
  "Jordbundsundersøgelse",
  "Byggestrøm og byggepladsindretning",
];

export type AddonOption = {
  id: string;
  title: string;
  price: number;
  desc: string;
};

/** Tilvalgspriser — bruges i prisberegneren. */
export const ADDONS: AddonOption[] = [
  { id: "terrasse", title: "Overdækket terrasse (25 m²)", price: 175000, desc: "Integreret, overdækket uderum i forlængelse af boligen." },
  { id: "varmepumpe", title: "Luft/vand varmepumpe", price: 95000, desc: "Energivenlig og fremtidssikret opvarmning." },
  { id: "solceller", title: "Solcelleanlæg (6 kW)", price: 85000, desc: "Producér din egen grønne strøm." },
  { id: "udekoekken", title: "Udekøkken integration", price: 45000, desc: "Forberedt til vand og afløb på terrassen." },
  { id: "smart_home", title: "Smart Home pakke", price: 35000, desc: "Intelligent styring af lys, varme og overvågning." },
  { id: "brændeovn", title: "Indbygningsbrændeovn", price: 55000, desc: "Centralt placeret for maksimal hygge." },
];

export type Foundation = {
  id: string;
  title: string;
  /** Prisforskel ift. standard støbt fundament (0 = inkluderet i prisen). */
  priceDiff: number;
  desc: string;
};

/**
 * Fundamenttyper. Et almindeligt støbt fundament er inkluderet i standardprisen
 * (priceDiff 0). Alternativer angives som en prisforskel ift. standarden.
 */
export const FOUNDATIONS: Foundation[] = [
  { id: "stoebt", title: "Almindeligt støbt fundament", priceDiff: 0, desc: "Inkluderet i standardprisen — solidt, traditionelt støbt fundament." },
  { id: "skrue", title: "Skruefundament", priceDiff: -25000, desc: "Hurtig og miljøvenlig montering uden større jordarbejde." },
  { id: "punkt", title: "Punktfundament", priceDiff: -55000, desc: "Velegnet til visse jordtyper og hævet byggeri." },
  { id: "ved_ikke", title: "Ved ikke endnu", priceDiff: 0, desc: "Vi regner med et standard støbt fundament i estimatet og rådgiver dig undervejs." },
];
