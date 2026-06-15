// ───────────────────────────────────────────────────────────────────────────
// Ecohus — Standardopbygning, priser og tilvalg
//
// Single source of truth for the standard construction spec, pricing and
// add-ons. Used by the price calculator, model detail pages and the homepage
// so copy and prices never drift between pages.
//
// All prices are indicative "fra"-priser (from-prices) / estimates.
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
  "Luft/vand varmepumpe",
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
      "Indvendig beklædning i gips",
      "Malerbehandlet overflade",
    ],
  },
  {
    title: "Tagtype",
    items: [
      "Sadeltag med 15–30 graders hældning",
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
  "Vinduer og yderdøre",
  "Isolering iht. BR18",
  "El-installation standard",
  "VVS-installation standard",
  "Luft/vand varmepumpe",
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
  "Smart Home løsning",
  "Udekøkken",
  "Brændeovn (indbygget eller fritstående)",
  "Fermacell indvendig beklædning",
  "Spa og sauna",
  "Garage",
  "Terrassearealer",
  "Belægning og haveanlæg",
  "Tilslutningsafgifter",
];

export type AddonOption = {
  id: string;
  title: string;
  /** Fast fra-pris i kr. */
  price?: number;
  /** Fra-pris pr. m² (f.eks. terrasse uden overdækning). */
  pricePerM2?: number;
  /** Prissættes individuelt — indgår ikke i estimatet. */
  custom?: boolean;
  desc: string;
};

/** Tilvalgspriser — bruges i prisberegneren. Alle priser er fra-priser. */
export const ADDONS: AddonOption[] = [
  { id: "terrasse", title: "Overdækket terrasse (25 m²)", price: 175000, desc: "Integreret, overdækket uderum i forlængelse af boligen." },
  { id: "terrasse_aaben", title: "Terrasse – ikke overdækket", pricePerM2: 800, desc: "Anlagt terrasse uden overdækning. Pris pr. m²." },
  { id: "solceller", title: "Solcelleanlæg (6 kW)", price: 60000, desc: "Producér din egen grønne strøm." },
  { id: "udekoekken", title: "Udekøkken integration", price: 45000, desc: "Forberedt til vand og afløb på terrassen." },
  { id: "smart_home", title: "Smart Home pakke", price: 45000, desc: "Intelligent styring af lys, varme og overvågning." },
  { id: "brændeovn", title: "Indbygningsbrændeovn", price: 55000, desc: "Centralt placeret for maksimal hygge." },
  { id: "braendeovn_fritstaaende", title: "Fritstående brændeovn", price: 25000, desc: "Klassisk, fritstående brændeovn." },
  { id: "spa_sauna", title: "Spa og sauna", custom: true, desc: "Luksuriøst spa- og saunaanlæg. Pris oplyses individuelt." },
];

export type Foundation = {
  id: string;
  title: string;
  desc: string;
};

/**
 * Fundamenttyper. Et almindeligt støbt fundament er inkluderet i standardprisen.
 * Typen er primært til orientering og en god ting at afklare til samtalen.
 */
export const FOUNDATIONS: Foundation[] = [
  { id: "stoebt", title: "Almindeligt støbt fundament", desc: "Inkluderet i standardprisen — solidt, traditionelt støbt fundament." },
  { id: "skrue", title: "Skruefundament", desc: "Hurtig og miljøvenlig montering uden større jordarbejde." },
  { id: "punkt", title: "Punktfundament", desc: "Velegnet til visse jordtyper og hævet byggeri." },
  { id: "ved_ikke", title: "Ved ikke endnu", desc: "Vi rådgiver dig om den rette fundamentstype undervejs." },
];
