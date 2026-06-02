#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const REPORT_DIR = path.join(ROOT, "reports");
const PUBLIC_STATEMENTS_PATH = path.join(
  ROOT,
  "..",
  "Clinton-Russia-High-Level",
  "reports",
  "clinton-public-statements-audit.json"
);

const PROXY_URL = "https://nara-proxy.mzqmpgyvdv.workers.dev";
const NARA_PATH = "/records/search";
const API_KEY = process.env.NARA_SCOUT_API_KEY || "";
const SCOUT_URL = "https://therealjameswilson.github.io/nara-scout/";

const CHAPTERS = [
  { id: "ctbt", title: "NPT and CTBT" },
  { id: "strategic-arms", title: "Strategic Arms and Nuclear Security" },
  { id: "start-ii", title: "START II Ratification" },
  { id: "ctr-heu", title: "Cooperative Threat Reduction and HEU Agreement" },
  { id: "nonproliferation", title: "Nonproliferation Regimes" },
  { id: "counterproliferation", title: "Counterproliferation" },
  { id: "regional", title: "Regional Proliferation Cases" },
  { id: "cbw-conventional", title: "Chemical and Biological Weapons" },
  { id: "conventional-landmines", title: "Conventional Arms and Landmines" }
];

const SCOPES = {
  "7386504": "NSC Defense Policy and Arms Control Office",
  "7585451": "Robert Bell's Files",
  "7585449": "Steven Andreasen's Files",
  "7388773": "NSC Nonproliferation and Export Controls Office",
  "7585677": "Nonproliferation and Export Controls Subject Files",
  "7585685": "Daniel Poneman's Files",
  "7585686": "Gary Samore's Files",
  "7386739": "NSC Executive Secretary",
  "7388842": "NSC Speechwriting Office",
  "7388808": "NSC Records Management Office",
  "7388835": "NSC Russia, Ukraine, and Eurasian Affairs Office"
};

const QUERY_PACKS = [
  {
    chapterId: "ctbt",
    queries: [
      "Comprehensive Test Ban",
      "nuclear testing",
      "CTBT",
      "NPT extension",
      "Nuclear Non-Proliferation Treaty",
      "zero yield",
      "stockpile stewardship",
      "Article VI",
      "South Africa NPT",
      "Egypt NPT",
      "Non-Aligned Movement NPT"
    ],
    scopeIds: ["7386504", "7585449", "7388773", "7585685", "7388842"]
  },
  {
    chapterId: "strategic-arms",
    queries: [
      "strategic stability",
      "nuclear security",
      "missile systems",
      "transparency irreversibility nuclear weapons",
      "nuclear materials security"
    ],
    scopeIds: ["7386504", "7585451", "7585449", "7388808"]
  },
  {
    chapterId: "start-ii",
    queries: [
      "START II",
      "START ratification",
      "Senate ratification START",
      "nuclear arms reduction treaty",
      "START II Duma",
      "START II ABM",
      "START II theater missile defense",
      "START II resolution of ratification"
    ],
    scopeIds: ["7386504", "7585451", "7386739", "7388808"]
  },
  {
    chapterId: "ctr-heu",
    queries: [
      "Cooperative Threat Reduction",
      "Nunn-Lugar",
      "Highly Enriched Uranium",
      "HEU Agreement",
      "nuclear materials security",
      "Ukraine warheads",
      "P-8 Nuclear Safety",
      "USEC",
      "Minatom",
      "HEU transparency",
      "Megatons to Megawatts",
      "Ukraine denuclearization",
      "Kazakhstan nuclear weapons",
      "Belarus nuclear weapons"
    ],
    scopeIds: ["7388808", "7388835", "7388773", "7585685", "7585686", "7386739"]
  },
  {
    chapterId: "nonproliferation",
    queries: ["MTCR", "fissile material", "nuclear smuggling", "export controls nonproliferation", "nonproliferation policy"],
    scopeIds: ["7388773", "7585677", "7585685", "7585686", "7388842"]
  },
  {
    chapterId: "counterproliferation",
    queries: [
      "counterproliferation",
      "counter-proliferation",
      "Defense Counterproliferation Initiative",
      "PDD-18",
      "PDD 18",
      "weapons of mass destruction military planning",
      "theater missile defense proliferation",
      "biological defense program",
      "NBC terrorism",
      "Defense Planning Guidance WMD",
      "ballistic missile defense proliferation",
      "JCS counterproliferation",
      "intelligence support counterproliferation",
      "chemical biological defense"
    ],
    scopeIds: ["7386504", "7585451", "7388773", "7585677", "7585685", "7585686", "7386739", "7388808"]
  },
  {
    chapterId: "regional",
    queries: [
      "North Korea nuclear",
      "Agreed Framework",
      "DPRK",
      "Iran proliferation",
      "Iraq WMD",
      "UNSCOM",
      "Libya proliferation",
      "China missile transfer",
      "South Asia nuclear",
      "India Pakistan nuclear",
      "Russian arms sales Iran"
    ],
    scopeIds: ["7388773", "7585677", "7585685", "7585686", "7388808"]
  },
  {
    chapterId: "cbw-conventional",
    queries: [
      "Chemical Weapons Convention",
      "CWC ratification",
      "Biological Weapons Convention",
      "BWC protocol",
      "Australia Group",
      "chemical biological weapons",
      "CWC ratification",
      "CWC Senate",
      "BWC Ad Hoc Group",
      "Aum Shinrikyo",
      "CBW terrorism",
      "UNSCOM chemical weapons"
    ],
    scopeIds: ["7388773", "7585677", "7585685", "7585686", "7388842"]
  },
  {
    chapterId: "conventional-landmines",
    queries: [
      "landmines",
      "landmine control regime",
      "anti-personnel landmine",
      "PDD-34",
      "PDD-48",
      "Convention on Certain Conventional Weapons",
      "Protocol II",
      "conventional arms",
      "arms transfers",
      "export controls conventional"
    ],
    scopeIds: ["7386504", "7585451", "7388773", "7585677"]
  }
];

const CHAPTER_RULES = [
  {
    id: "ctbt",
    terms: [
      "NPT",
      "NUCLEAR NON-PROLIFERATION TREATY",
      "CTBT",
      "COMPREHENSIVE TEST BAN",
      "TEST BAN",
      "NUCLEAR TESTING",
      "ZERO YIELD",
      "STOCKPILE STEWARDSHIP",
      "ARTICLE VI",
      "NON-ALIGNED MOVEMENT"
    ]
  },
  {
    id: "start-ii",
    terms: [
      "START II",
      "START RATIFICATION",
      "SENATE RATIFICATION",
      "ARMS REDUCTION TREATY",
      "DUMA",
      "RESOLUTION OF RATIFICATION",
      "ABM",
      "THEATER MISSILE DEFENSE"
    ]
  },
  {
    id: "ctr-heu",
    terms: [
      "COOPERATIVE THREAT REDUCTION",
      "NUNN-LUGAR",
      "NUNN LUGAR",
      "HIGHLY ENRICHED URANIUM",
      "HEU",
      "MEGATONS",
      "MEGAWATTS",
      "NUCLEAR MATERIALS SECURITY",
      "ARMS REDUCTION AGREEMENTS WITH RUSSIA AND UKRAINE",
      "UKRAINE WARHEADS",
      "UKRAINE DENUCLEARIZATION",
      "BELARUS NUCLEAR",
      "KAZAKHSTAN NUCLEAR",
      "STANDING COMMITTEE NUCLEAR MATERIALS",
      "DENUCLEARIZATION OF UKRAINE",
      "TRILATERAL STATEMENT",
      "P-8 NUCLEAR SAFETY",
      "USEC",
      "MINATOM",
      "TRANSPARENCY MEASURES"
    ]
  },
  {
    id: "counterproliferation",
    terms: [
      "COUNTERPROLIFERATION",
      "COUNTER-PROLIFERATION",
      "PDD/NSC 18",
      "PDD-18",
      "PDD 18",
      "DEFENSE COUNTERPROLIFERATION INITIATIVE",
      "WEAPONS OF MASS DESTRUCTION",
      "WMD",
      "THEATER MISSILE DEFENSE",
      "BALLISTIC MISSILE DEFENSE",
      "BIOLOGICAL DEFENSE",
      "DEFENSE PLANNING GUIDANCE",
      "MILITARY PLANNING",
      "NONPROLIFERATION AND COUNTERPROLIFERATION",
      "NBC TERRORISM",
      "JCS",
      "INTELLIGENCE SUPPORT"
    ]
  },
  {
    id: "cbw-conventional",
    terms: [
      "CHEMICAL WEAPONS",
      "BIOLOGICAL WEAPONS",
      "CWC",
      "BWC",
      "AUSTRALIA GROUP",
      "CHEMICAL AND BIOLOGICAL",
      "CBW",
      "AD HOC GROUP",
      "AUM SHINRIKYO",
      "UNSCOM"
    ]
  },
  {
    id: "regional",
    terms: [
      "NORTH KOREA",
      "DPRK",
      "AGREED FRAMEWORK",
      "IRAN",
      "IRAQ",
      "UNSCOM",
      "LIBYA",
      "SOUTH ASIA",
      "INDIA",
      "PAKISTAN",
      "CHINA",
      "MISSILE TRANSFER"
    ]
  },
  {
    id: "strategic-arms",
    terms: [
      "STRATEGIC STABILITY",
      "MISSILE SYSTEMS",
      "NUCLEAR SECURITY",
      "NUCLEAR MATERIALS",
      "TRANSPARENCY",
      "IRREVERSIBILITY",
      "NUCLEAR WEAPONS REDUCTION"
    ]
  },
  {
    id: "conventional-landmines",
    terms: [
      "LANDMINES",
      "LAND MINES",
      "ANTI-PERSONNEL LANDMINE",
      "PDD-34",
      "PDD-48",
      "CONVENTION ON CERTAIN CONVENTIONAL WEAPONS",
      "PROTOCOL II",
      "CONVENTIONAL ARMS",
      "ARMS TRANSFERS",
      "CONVENTIONAL WEAPONS"
    ]
  },
  {
    id: "nonproliferation",
    terms: ["NONPROLIFERATION", "NON-PROLIFERATION", "MTCR", "FISSILE", "NUCLEAR SMUGGLING", "EXPORT CONTROLS"]
  }
];

const HIGH_VALUE_TERMS = [
  "MEMORANDUM",
  "MEETING",
  "CONVERSATION",
  "TELEPHONE",
  "TELCON",
  "PRESIDENT",
  "NATIONAL SECURITY ADVISOR",
  "SECRETARY",
  "PDD",
  "PRD",
  "DECISION",
  "TREATY",
  "RATIFICATION"
];

const MANUAL_PUBLIC_RECORDS = [
  {
    id: "whitehouse-1993-03-09-nuclear-cooperation",
    chapterId: "nonproliferation",
    date: "1993-03-09",
    title: "Statement on nuclear cooperation",
    sourceType: "Archived White House",
    priority: "High",
    identifier: "1993-03-09 White House statement",
    sourceUrl: "https://clintonwhitehouse6.archives.gov/1993/03/1993-03-09-statement-on-nuclear-cooperation.html",
    summary:
      "Early Clinton primary-source statement on nuclear cooperation and export criteria under the Nuclear Non-Proliferation Act framework.",
    topics: ["nuclear cooperation", "export criteria", "nonproliferation"]
  },
  {
    id: "whitehouse-1993-09-27-unga",
    chapterId: "nonproliferation",
    date: "1993-09-27",
    title: "Address to the United Nations General Assembly",
    sourceType: "Archived White House",
    priority: "High",
    identifier: "1993-09-27 UNGA address",
    sourceUrl: "https://clintonwhitehouse6.archives.gov/1993/09/1993-09-27-presidents-address-to-the-un.html",
    summary:
      "Public presidential statement tying together nuclear materials, test-ban diplomacy, CWC implementation, missile transfers, and export controls.",
    topics: ["United Nations", "test ban", "CWC", "export controls"]
  },
  {
    id: "whitehouse-1993-09-27-nonproliferation-export-policy",
    chapterId: "counterproliferation",
    date: "1993-09-27",
    title: "Fact Sheet on Nonproliferation and Export Control Policy",
    sourceType: "Archived White House",
    priority: "High",
    identifier: "1993-09-27 White House fact sheet",
    sourceUrl: "https://www.rertr.anl.gov/REFDOCS/PRES93NP.html",
    summary:
      "Primary-source White House fact sheet directing greater attention to proliferation in intelligence collection, defense planning, force structure, and military planning against WMD and missile threats.",
    topics: ["defense planning", "WMD", "missiles", "counterproliferation"]
  },
  {
    id: "dod-1993-12-07-defense-counterproliferation-initiative",
    chapterId: "counterproliferation",
    date: "1993-12-07",
    title: "PDD/NSC-18 Defense Counterproliferation Initiative",
    sourceType: "Department of Defense text",
    priority: "High",
    identifier: "PDD/NSC-18",
    sourceUrl: "https://irp.fas.org/offdocs/pdd18.htm",
    summary:
      "Secretary Les Aspin's launch of the Defense Counterproliferation Initiative under PDD/NSC-18, covering military planning, theater missile defense, biological defense, and intelligence support.",
    topics: ["PDD/NSC-18", "Les Aspin", "theater missile defense", "biological defense"]
  },
  {
    id: "public-statement-PPP-1993-book2-doc-pg2177",
    chapterId: "counterproliferation",
    date: "1993-12-15",
    title: "Remarks on the Resignation of Les Aspin as Secretary of Defense",
    sourceType: "Public Papers",
    sourceRepository: "GovInfo",
    sourceCollection: "Public Papers of the Presidents",
    priority: "High",
    identifier: "PPP-1993-book2-doc-pg2177",
    sourceUrl: "https://www.govinfo.gov/app/details/PPP-1993-book2/PPP-1993-book2-doc-pg2177",
    digitalObjectUrl: "https://www.govinfo.gov/content/pkg/PPP-1993-book2/pdf/PPP-1993-book2-doc-pg2177.pdf",
    pages: "p. 2177",
    pageCount: 1,
    summary:
      "Clinton public statement crediting Secretary Aspin's leadership and explicitly noting his new counterproliferation initiative.",
    topics: ["Clinton statement", "Les Aspin", "counterproliferation"]
  },
  {
    id: "osti-1994-05-01-nonproliferation-counterproliferation-activities",
    chapterId: "counterproliferation",
    date: "1994-05-01",
    title: "Nonproliferation and counterproliferation activities and programs",
    sourceType: "DOD technical report",
    sourceRepository: "OSTI",
    sourceCollection: "Office of the Deputy Secretary of Defense",
    priority: "High",
    identifier: "OSTI ID 377259",
    sourceUrl: "https://www.osti.gov/biblio/377259",
    summary:
      "FY1994 defense authorization report surveying existing, planned, and proposed U.S. capabilities and technologies for countering proliferation and NBC terrorism.",
    topics: ["program review", "NBC terrorism", "DOD", "counterproliferation"]
  },
  {
    id: "osti-1995-10-27-counterproliferation-national-security-priority",
    chapterId: "counterproliferation",
    date: "1995-10-27",
    title: "Counterproliferation: A National Security Priority",
    sourceType: "DOD speech text",
    sourceRepository: "OSTI",
    sourceCollection: "Office of the Under Secretary of Defense (Acquisition)",
    priority: "Medium",
    identifier: "OSTI ID 612135",
    sourceUrl: "https://www.osti.gov/biblio/612135",
    summary:
      "Paul Kaminski speech text linking Clinton's 1995 national security strategy to effective capabilities against WMD and missile-delivery threats.",
    topics: ["Paul Kaminski", "National Security Strategy", "WMD", "missiles"]
  },
  {
    id: "whitehouse-1995-02-16-cbw-letter",
    chapterId: "cbw-conventional",
    date: "1995-02-16",
    title: "Letter to Congress on chemical and biological weapons",
    sourceType: "Archived White House",
    priority: "High",
    identifier: "1995-02-16 CBW report letter",
    sourceUrl:
      "https://clintonwhitehouse6.archives.gov/1995/02/1995-02-16-letter-to-congress-on-chemical-and-biological-weapons.html",
    summary:
      "Primary-source lead for CWC submission and PrepCom work, the 1994 BWC Special Conference, and the Ad Hoc Group mandate.",
    topics: ["CWC", "BWC", "Congress"]
  },
  {
    id: "whitehouse-1996-04-25-lake-fletcher",
    chapterId: "cbw-conventional",
    date: "1996-04-25",
    title: "Anthony Lake address on the arms-control agenda",
    sourceType: "Archived White House",
    priority: "Medium",
    identifier: "1996-04-25 Fletcher School address",
    sourceUrl:
      "https://clintonwhitehouse6.archives.gov/1996/04/1996-04-25-anthony-lake-address-to-the-fletcher-school.html",
    summary:
      "National Security Advisor address linking the 1996 agenda to BWC strengthening, CTBT signature, and CWC ratification.",
    topics: ["CWC", "BWC", "CTBT", "arms-control agenda"]
  },
  {
    id: "whitehouse-1996-11-12-wmd-letter",
    chapterId: "cbw-conventional",
    date: "1996-11-12",
    title: "Letter on actions against weapons of mass destruction",
    sourceType: "Archived White House",
    priority: "High",
    identifier: "1996-11-12 WMD/CBW report letter",
    sourceUrl:
      "https://clintonwhitehouse6.archives.gov/1996/11/1996-11-12-letter-on-actions-vs-mass-destruction-weapons.html",
    summary:
      "Late-1996 primary-source lead for CWC ratification, BWC protocol work, Australia Group export controls, and CBW terrorism concerns.",
    topics: ["CWC", "BWC", "Australia Group", "WMD"]
  },
  {
    id: "public-statement-PPP-1996-book2-doc-pg1645",
    chapterId: "ctr-heu",
    date: "1996-09-23",
    title: "Statement on Signing the National Defense Authorization Act for Fiscal Year 1997",
    sourceType: "Public Papers",
    sourceRepository: "GovInfo",
    sourceCollection: "Public Papers of the Presidents",
    priority: "Medium",
    identifier: "PPP-1996-book2-doc-pg1645",
    sourceUrl: "https://www.govinfo.gov/app/details/PPP-1996-book2/PPP-1996-book2-doc-pg1645",
    digitalObjectUrl: "https://www.govinfo.gov/content/pkg/PPP-1996-book2/pdf/PPP-1996-book2-doc-pg1645.pdf",
    pages: "pp. 1645-1647",
    pageCount: 3,
    summary:
      "Clinton's signing statement for the FY1997 defense authorization noted authorization for Nunn-Lugar Cooperative Threat Reduction and establishment of Nunn-Lugar II.",
    topics: ["Nunn-Lugar", "Cooperative Threat Reduction", "Nunn-Lugar II", "NDAA FY1997"]
  }
];

function chapterById(id) {
  return CHAPTERS.find((chapter) => chapter.id === id) || { id, title: id };
}

function sanitizeQuery(query) {
  return (query || "").replace(/["“”]/g, "").replace(/[‘’]/g, "'").trim();
}

function uniq(values) {
  const seen = new Set();
  return values.filter((value) => {
    const key = `${value || ""}`.trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function naraUrl(naid) {
  return `https://catalog.archives.gov/id/${naid}`;
}

function scoutSearchLabel(matches) {
  const first = matches[0];
  if (!first) return SCOUT_URL;
  const query = encodeURIComponent(first.query);
  return `${SCOUT_URL}?q=${query}`;
}

function yearFromRecord(record, side) {
  return record?.[side]?.year || "";
}

function dateLabel(record) {
  const start = yearFromRecord(record, "coverageStartDate");
  const end = yearFromRecord(record, "coverageEndDate");
  if (start && end && start !== end) return `${start}-${end}`;
  return start || end || "";
}

function textFor(record) {
  return [
    record.title,
    record.scopeAndContentNote,
    ...(record.ancestors || []).map((ancestor) => ancestor.title || ancestor.collectionTitle)
  ]
    .filter(Boolean)
    .join(" ");
}

function titleDateText(record) {
  return `${record.title || ""} ${dateLabel(record)}`.trim();
}

function hasPostBoundaryDate(record) {
  const text = titleDateText(record);
  return /\b(1997|1998|1999|2000|2001)\b/.test(text) || /\b\d{1,2}\/\d{1,2}\/(97|98|99|00|01)\b/.test(text);
}

function isGenericTitle(record) {
  const title = `${record.title || ""}`.trim();
  return (
    /^chron file\b/i.test(title) ||
    /^\[\d{2}\/\d{2}\/\d{4}/.test(title) ||
    /^\d{7}\b/.test(title) ||
    /^(january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(title)
  );
}

function titleChapterOverride(record) {
  const title = `${record.title || ""}`.toUpperCase();
  if (/\bSTART\s+II\b/.test(title)) return "start-ii";
  if (
    /COOPERATIVE THREAT REDUCTION|NUNN-LUGAR|NUNN LUGAR|HIGHLY ENRICHED URANIUM|\bHEU\b|MEGATONS|MEGAWATTS|NUCLEAR MATERIALS SECURITY|ARMS REDUCTION AGREEMENTS WITH RUSSIA AND UKRAINE|UKRAINE WARHEADS|STANDING COMMITTEE NUCLEAR MATERIALS|TRILATERAL STATEMENT|P-8 NUCLEAR SAFETY/.test(
      title
    )
  ) {
    return "ctr-heu";
  }
  if (
    /COUNTERPROLIFERATION|COUNTER-PROLIFERATION|PDD\/NSC\s*18|\bPDD-?18\b|DEFENSE COUNTERPROLIFERATION INITIATIVE|THEATER MISSILE DEFENSE|BALLISTIC MISSILE DEFENSE|BIOLOGICAL DEFENSE|NBC TERRORISM/.test(
      title
    )
  ) {
    return "counterproliferation";
  }
  if (/CHEMICAL WEAPONS|BIOLOGICAL WEAPONS|\bCWC\b|\bBWC\b|AUSTRALIA GROUP/.test(title)) return "cbw-conventional";
  if (/\bNPT\b|NUCLEAR NON-PROLIFERATION TREATY|\bCTBT\b|COMPREHENSIVE TEST BAN|TEST BAN|NUCLEAR TEST/.test(title)) {
    return "ctbt";
  }
  if (/NORTH KOREA|\bDPRK\b|AGREED FRAMEWORK|\bIRAN\b|\bIRAQ\b|SOUTH ASIA|\bINDIA\b|\bPAKISTAN\b|\bCHINA\b/.test(title)) {
    return "regional";
  }
  if (/STRATEGIC STABILITY|MISSILE SYSTEMS|NUCLEAR SECURITY|NUCLEAR MATERIALS|IRREVERSIBILITY/.test(title)) {
    return "strategic-arms";
  }
  if (/LANDMINES|LAND MINES|CONVENTIONAL ARMS|ARMS TRANSFERS/.test(title)) return "conventional-landmines";
  if (/NONPROLIFERATION|NON-PROLIFERATION|\bMTCR\b|FISSILE|NUCLEAR SMUGGLING|EXPORT CONTROLS/.test(title)) {
    return "nonproliferation";
  }
  return "";
}

function classify(record) {
  const title = record.title || "";
  const desc = record.scopeAndContentNote || "";
  const online = Array.isArray(record.digitalObjects) && record.digitalObjects.length > 0;
  const restrictions = record.accessRestriction?.specificAccessRestrictions || [];
  const restrictionTypes = restrictions.map((item) => `${item.restriction || ""}`.toUpperCase());
  const foia = restrictionTypes.some((item) => /FOIA/.test(item));
  const pra = restrictionTypes.some((item) => /PRA|PRESIDENTIAL/.test(item));
  const withdrawal = /withdraw(al)?\s*(sheet|notice|card)|NA\s*Form\s*1402[13]/i.test(`${title} ${desc}`);
  if (withdrawal || foia || pra) return { category: "withdrawal/MDR", online };
  if (online) return { category: "declassified online", online };
  if (!desc.trim() || desc.trim().length < 20) return { category: "unprocessed/no description", online };
  return { category: "described, not digitized", online };
}

function chapterTermScores(record) {
  const text = textFor(record).toUpperCase();
  const scores = new Map();
  for (const chapter of CHAPTERS) scores.set(chapter.id, 0);

  for (const rule of CHAPTER_RULES) {
    for (const term of rule.terms) {
      if (text.includes(term)) {
        const boost = term.length > 8 ? 7 : 4;
        scores.set(rule.id, (scores.get(rule.id) || 0) + boost);
      }
    }
  }

  return [...scores.entries()].sort((a, b) => b[1] - a[1]);
}

function chapterScores(record, matches) {
  const scores = new Map(chapterTermScores(record));
  for (const match of matches) {
    scores.set(match.chapterId, (scores.get(match.chapterId) || 0) + 4);
  }
  return [...scores.entries()].sort((a, b) => b[1] - a[1]);
}

function inferChapter(record, matches) {
  const titleChapter = titleChapterOverride(record);
  if (titleChapter) return chapterById(titleChapter);
  const [best] = chapterScores(record, matches);
  return chapterById(best?.[0] || matches[0]?.chapterId || "nonproliferation");
}

function scoreRecord(record, matches) {
  const text = textFor(record).toUpperCase();
  const info = classify(record);
  const [bestTermChapter] = chapterTermScores(record);
  const exactCounterproliferationHit = matches.some(
    (match) =>
      match.chapterId === "counterproliferation" &&
      /^(counterproliferation|Defense Counterproliferation Initiative)$/i.test(match.query)
  );
  const counterproliferationProvenance = /ROBERT BELL|DEFENSE POLICY AND ARMS CONTROL/.test(text);
  let score = 0;

  score += Math.min(16, matches.length * 3);
  score += Math.min(34, bestTermChapter?.[1] || 0);
  score += exactCounterproliferationHit && counterproliferationProvenance ? 28 : 0;
  score += info.online ? 14 : 0;
  score += record.levelOfDescription === "item" ? 10 : 0;
  score += record.levelOfDescription === "fileUnit" ? 7 : 0;
  score += record.levelOfDescription === "series" ? 3 : 0;
  score += info.category === "withdrawal/MDR" ? 4 : 0;
  score += HIGH_VALUE_TERMS.some((term) => text.includes(term)) ? 10 : 0;
  score += (record.digitalObjects?.length || 0) >= 5 ? 4 : 0;
  score += titleChapterOverride(record) ? 10 : 0;
  score -= (bestTermChapter?.[1] || 0) === 0 ? 22 : 0;
  score -= isGenericTitle(record) && (bestTermChapter?.[1] || 0) < 10 ? 16 : 0;
  score -= hasPostBoundaryDate(record) ? 80 : 0;

  return score;
}

function priorityFor(score) {
  if (score >= 52) return "High";
  if (score >= 36) return "Medium";
  return "Review";
}

function compactText(value, max = 360) {
  const text = `${value || ""}`.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}...`;
}

function recordSummary(record, matches) {
  const info = classify(record);
  const score = scoreRecord(record, matches);
  const chapter = inferChapter(record, matches);
  const [termMatch] = chapterTermScores(record);
  const ancestors = (record.ancestors || []).map((ancestor) => ({
    naid: ancestor.naId || "",
    title: ancestor.title || ancestor.collectionTitle || "",
    level: ancestor.levelOfDescription || ""
  }));
  const sourceCollection =
    ancestors.find((ancestor) => ancestor.level === "series")?.title ||
    ancestors.find((ancestor) => ancestor.level === "collection")?.title ||
    uniq(matches.map((match) => match.scopeLabel))[0] ||
    "National Archives Catalog";
  const matchedQueries = uniq(matches.map((match) => `${chapterById(match.chapterId).title}: ${match.query}`));
  const scope = uniq(matches.map((match) => match.scopeLabel));
  const summary =
    compactText(record.scopeAndContentNote) ||
    `NARA Scout candidate ${record.levelOfDescription || "record"} located in ${sourceCollection}.`;

  return {
    id: `nara-${record.naId}`,
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    date: dateLabel(record),
    title: record.title || "Untitled NARA record",
    sourceType: "NARA Scout candidate",
    sourceRepository: "National Archives Catalog",
    sourceCollection,
    priority: priorityFor(score),
    score,
    identifier: `NAID ${record.naId}`,
    naid: record.naId || "",
    sourceUrl: naraUrl(record.naId),
    digitalObjectUrl: record.digitalObjects?.[0]?.objectUrl || "",
    scoutSearchUrl: scoutSearchLabel(matches),
    outOfScopeDate: hasPostBoundaryDate(record),
    metadataTermScore: termMatch?.[1] || 0,
    genericTitle: isGenericTitle(record),
    category: info.category,
    level: record.levelOfDescription || "",
    digitalObjects: record.digitalObjects?.length || 0,
    matchedQueries: matchedQueries.slice(0, 8),
    sourceNote:
      termMatch?.[1] > 0
        ? `${info.category}; found in ${scope.join(", ")}.`
        : `${info.category}; matched through NARA Scout full text or broad metadata in ${scope.join(", ")}.`,
    summary,
    topics: uniq([
      ...chapter.title.split(/\s+and\s+|\s+/).filter((word) => word.length > 3),
      ...matchedQueries.map((query) => query.split(": ").pop())
    ]).slice(0, 6),
    ancestors
  };
}

function chapterForText(text) {
  const upper = `${text || ""}`.toUpperCase();
  for (const rule of CHAPTER_RULES) {
    if (rule.terms.some((term) => upper.includes(term))) return chapterById(rule.id);
  }
  return chapterById("nonproliferation");
}

function publicDocumentFromRecord(record) {
  const chapter = chapterForText(`${record.title} ${record.sourceNote}`);
  return {
    id: record.id || `public-statement-${record.accessId}`,
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    date: record.date || "",
    title: record.title,
    sourceType: "Public Papers",
    sourceRepository: "GovInfo",
    sourceCollection: "Public Papers of the Presidents",
    priority: "High",
    score: 72,
    identifier: record.accessId || "",
    sourceUrl: record.detailUrl,
    digitalObjectUrl: record.pdfUrl || "",
    pages: record.publicPapersPages || "",
    pageCount: record.publicPapersPageCount || 0,
    category: "public statement",
    level: "published primary source",
    digitalObjects: record.pdfUrl ? 1 : 0,
    matchedQueries: ["Local Public Papers audit"],
    sourceNote: record.sourceNote || "Public Papers of the Presidents; GovInfo.",
    summary: compactText(record.sourceNote || record.extractionStatus || record.title, 320),
    topics: uniq([chapter.title, record.publicPapersPages, "Public Papers"]).filter(Boolean)
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadPublicDocuments() {
  const manual = MANUAL_PUBLIC_RECORDS.map((record) => {
    const chapter = chapterById(record.chapterId);
    return {
      ...record,
      chapterTitle: chapter.title,
      sourceRepository: record.sourceRepository || record.sourceType,
      sourceCollection: record.sourceCollection || "Clinton administration public record",
      score: record.priority === "High" ? 70 : 54,
      category: "public statement",
      level: "published primary source",
      digitalObjects: record.digitalObjectUrl ? 1 : 0,
      matchedQueries: ["Local public milestone page"],
      sourceNote: record.summary
    };
  });

  try {
    const raw = await fs.readFile(PUBLIC_STATEMENTS_PATH, "utf8");
    const data = JSON.parse(raw);
    const ctrStatementRe =
      /Highly Enriched Uranium|HEU Agreement|Cooperative Threat Reduction|Nunn-Lugar|Arms Reduction Agreements With Russia and Ukraine|denuclearization of Ukraine/i;
    const counterStatementRe =
      /counterproliferation|counter-proliferation|Defense Counterproliferation Initiative|weapons of mass destruction|missile-delivery threats/i;
    const records = (data.records || data.items || []).filter((record) => {
      if (!/^199[3-6]/.test(record.date || "")) return false;
      return (
        record.category === "Arms control and nonproliferation" ||
        ctrStatementRe.test(`${record.title || ""} ${record.sourceNote || ""}`) ||
        counterStatementRe.test(`${record.title || ""} ${record.sourceNote || ""}`)
      );
    });
    return [...records.map(publicDocumentFromRecord), ...manual];
  } catch (error) {
    console.warn(`Could not load Public Papers audit at ${PUBLIC_STATEMENTS_PATH}: ${error.message}`);
    return manual;
  }
}

async function fetchScout(scopeId, pack, query, limit) {
  const params = new URLSearchParams();
  params.append("q", sanitizeQuery(query));
  params.append("ancestorNaId", scopeId);
  params.append("startDate", "1993");
  params.append("endDate", "1996");
  params.append("limit", String(limit));

  const url = `${PROXY_URL}${NARA_PATH}?${params.toString()}`;
  let response;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    response = await fetch(url, {
      headers: {
        "x-api-key": API_KEY,
        Accept: "application/json"
      }
    });
    if (response.ok) break;
    if (response.status !== 429 || attempt === 3) {
      throw new Error(`NARA Scout request failed ${response.status}: ${url}`);
    }
    await delay(1200 * attempt);
  }
  const json = await response.json();
  const body = json.body || json;
  const hits = body.hits?.hits || [];
  const totalRaw = body.hits?.total;
  const total = totalRaw?.value ?? totalRaw ?? 0;
  return {
    total,
    records: hits.map((hit) => hit._source?.record || hit._source || hit)
  };
}

async function runWithLimit(tasks, limit = 6) {
  const queue = [...tasks];
  const results = [];
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const task = queue.shift();
      results.push(await task());
    }
  });
  await Promise.all(workers);
  return results;
}

function byDocumentRank(a, b) {
  const priorityRank = { High: 0, Medium: 1, Review: 2 };
  return (
    (priorityRank[a.priority] ?? 3) - (priorityRank[b.priority] ?? 3) ||
    (b.score || 0) - (a.score || 0) ||
    `${a.date || "9999"}`.localeCompare(`${b.date || "9999"}`) ||
    a.title.localeCompare(b.title)
  );
}

function selectNaraDocuments(candidates, maxPerChapter) {
  const selected = [];
  for (const chapter of CHAPTERS) {
    const pool = candidates
      .filter((candidate) => candidate.chapterId === chapter.id)
      .filter((candidate) => !candidate.outOfScopeDate)
      .filter((candidate) => candidate.score >= 26 || candidate.metadataTermScore > 0)
      .sort(byDocumentRank);
    selected.push(...pool.slice(0, maxPerChapter));
  }
  return selected;
}

function escapePipe(value) {
  return `${value || ""}`.replaceAll("|", "\\|");
}

function markdownTable(documents) {
  return [
    "| Chapter | Priority | Date | Identifier | Type | Title |",
    "| --- | --- | --- | --- | --- | --- |",
    ...documents.map(
      (doc) =>
        `| ${escapePipe(doc.chapterTitle)} | ${doc.priority} | ${doc.date || ""} | [${escapePipe(doc.identifier)}](${doc.sourceUrl}) | ${escapePipe(doc.sourceType)} | ${escapePipe(doc.title)} |`
    )
  ].join("\n");
}

function buildMarkdown(report) {
  const lines = [
    "# NARA Scout Potential Documents for FRUS 1993-2000, Volume VII",
    "",
    `Source tool: ${SCOUT_URL}`,
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- NARA Scout API calls attempted: ${report.apiCallsAttempted}`,
    `- NARA Scout API calls completed: ${report.apiCallsCompleted}`,
    `- Unique NARA records found: ${report.uniqueNaraRecords}`,
    `- NARA candidates selected for page: ${report.naraDocumentsSelected}`,
    `- Public primary-source records added: ${report.publicDocumentsAdded}`,
    `- Clinton Public Papers statements added: ${report.clintonPublicStatementsAdded}`,
    `- Total potential documents on page: ${report.documents.length}`,
    "",
    "## Chapter Counts",
    "",
    ...CHAPTERS.map((chapter) => `- ${chapter.title}: ${report.chapterCounts[chapter.id] || 0}`),
    "",
    "## Selected Candidates",
    "",
    markdownTable(report.documents),
    "",
    "## Query Packs",
    "",
    ...QUERY_PACKS.map(
      (pack) =>
        `- ${chapterById(pack.chapterId).title}: ${pack.queries.join("; ")}. Scopes: ${pack.scopeIds
          .map((scopeId) => `${SCOPES[scopeId]} (NAID ${scopeId})`)
          .join(", ")}.`
    ),
    "",
    "## Notes",
    "",
    "- Candidate priority is a research triage score, not a final FRUS selection decision.",
    "- NARA Scout candidates may be file units or withdrawal/MDR records rather than individual document texts.",
    "- Public Papers and archived White House entries are primary-source anchors from neighboring Clinton research pages."
  ];

  if (report.errors.length) {
    lines.push("", "## Scout Errors", "");
    for (const error of report.errors) {
      lines.push(`- ${error.scopeLabel}; ${chapterById(error.chapterId).title}; ${error.query}: ${error.message}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  if (!API_KEY) {
    throw new Error("Set NARA_SCOUT_API_KEY before running the NARA Scout harvester.");
  }
  const perQueryLimit = Number(process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1] || 18);
  const maxPerChapter = Number(process.argv.find((arg) => arg.startsWith("--per-chapter="))?.split("=")[1] || 12);
  const tasks = [];

  for (const pack of QUERY_PACKS) {
    for (const scopeId of pack.scopeIds) {
      for (const query of pack.queries) {
        tasks.push(async () => {
          try {
            const result = await fetchScout(scopeId, pack, query, perQueryLimit);
            return { ok: true, pack, scopeId, scopeLabel: SCOPES[scopeId], query, ...result };
          } catch (error) {
            return {
              ok: false,
              chapterId: pack.chapterId,
              scopeId,
              scopeLabel: SCOPES[scopeId],
              query,
              message: error.message
            };
          }
        });
      }
    }
  }

  const results = await runWithLimit(tasks, 3);
  const merged = new Map();
  const errors = [];
  let totalAcrossQueries = 0;

  for (const result of results) {
    if (!result.ok) {
      errors.push(result);
      continue;
    }

    totalAcrossQueries += result.total;
    for (const record of result.records) {
      if (!record.naId) continue;
      const match = {
        chapterId: result.pack.chapterId,
        scopeNaid: result.scopeId,
        scopeLabel: result.scopeLabel,
        query: result.query,
        totalForQuery: result.total
      };
      if (!merged.has(record.naId)) {
        merged.set(record.naId, { record, matches: [match] });
      } else {
        merged.get(record.naId).matches.push(match);
      }
    }
  }

  const naraCandidates = [...merged.values()]
    .map(({ record, matches }) => recordSummary(record, matches))
    .sort(byDocumentRank);
  const naraDocuments = selectNaraDocuments(naraCandidates, maxPerChapter);
  if (naraDocuments.length === 0 && errors.length === tasks.length) {
    let existingHasNara = false;
    try {
      const existing = JSON.parse(await fs.readFile(path.join(DATA_DIR, "potential-documents.json"), "utf8"));
      existingHasNara = existing.some((document) => document.sourceType === "NARA Scout candidate");
    } catch {
      existingHasNara = false;
    }
    if (existingHasNara) {
      throw new Error(`All ${tasks.length} NARA Scout calls failed; existing generated data was left unchanged.`);
    }
  }
  const publicDocuments = await loadPublicDocuments();
  const clintonPublicStatements = publicDocuments
    .filter((document) => document.sourceType === "Public Papers")
    .sort((a, b) => `${a.date || ""}`.localeCompare(`${b.date || ""}`) || a.title.localeCompare(b.title));
  const documents = [...naraDocuments, ...publicDocuments].sort((a, b) => {
    const chapterOrder =
      CHAPTERS.findIndex((chapter) => chapter.id === a.chapterId) -
      CHAPTERS.findIndex((chapter) => chapter.id === b.chapterId);
    return chapterOrder || byDocumentRank(a, b);
  });

  const chapterCounts = {};
  const sourceTypeCounts = {};
  for (const document of documents) {
    chapterCounts[document.chapterId] = (chapterCounts[document.chapterId] || 0) + 1;
    sourceTypeCounts[document.sourceType] = (sourceTypeCounts[document.sourceType] || 0) + 1;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    scoutUrl: SCOUT_URL,
    proxyUrl: PROXY_URL,
    apiCallsAttempted: tasks.length,
    apiCallsCompleted: results.filter((result) => result.ok).length,
    totalAcrossQueries,
    uniqueNaraRecords: naraCandidates.length,
    naraDocumentsSelected: naraDocuments.length,
    publicDocumentsAdded: publicDocuments.length,
    clintonPublicStatementsAdded: clintonPublicStatements.length,
    chapterCounts,
    sourceTypeCounts,
    scopes: Object.entries(SCOPES).map(([naid, label]) => ({ naid, label })),
    queryPacks: QUERY_PACKS,
    errors,
    clintonPublicStatements,
    documents,
    naraCandidates
  };

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(REPORT_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, "potential-documents.json"), `${JSON.stringify(documents, null, 2)}\n`);
  await fs.writeFile(
    path.join(DATA_DIR, "potential-documents.js"),
    `window.ARMSCONTROL_POTENTIAL_DOCUMENTS = ${JSON.stringify(documents, null, 2)};\n`
  );
  await fs.writeFile(
    path.join(DATA_DIR, "clinton-public-statements.json"),
    `${JSON.stringify(clintonPublicStatements, null, 2)}\n`
  );
  await fs.writeFile(
    path.join(DATA_DIR, "clinton-public-statements.js"),
    `window.CLINTON_PUBLIC_STATEMENTS = ${JSON.stringify(clintonPublicStatements, null, 2)};\n`
  );
  await fs.writeFile(
    path.join(REPORT_DIR, "nara-scout-potential-documents.json"),
    `${JSON.stringify(report, null, 2)}\n`
  );
  await fs.writeFile(path.join(REPORT_DIR, "nara-scout-potential-documents.md"), buildMarkdown(report));

  console.log(`Ran ${report.apiCallsCompleted}/${report.apiCallsAttempted} NARA Scout API calls.`);
  console.log(`Found ${report.uniqueNaraRecords} unique NARA records; selected ${report.naraDocumentsSelected}.`);
  console.log(`Added ${report.publicDocumentsAdded} public primary-source records.`);
  console.log(`Added ${report.clintonPublicStatementsAdded} Clinton Public Papers statements.`);
  console.log(`Wrote ${documents.length} potential documents to data/potential-documents.js.`);
  if (errors.length) console.log(`Scout warnings: ${errors.length} failed calls; see report.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  CHAPTERS,
  QUERY_PACKS,
  SCOPES,
  SCOUT_URL
};
