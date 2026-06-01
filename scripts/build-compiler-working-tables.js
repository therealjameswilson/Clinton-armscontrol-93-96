const fs = require("fs");
const path = require("path");
const vm = require("vm");

const repoRoot = path.resolve(__dirname, "..");
const exportDir = path.join(repoRoot, "exports");
const workingTablesReportPath = path.join(repoRoot, "reports", "compiler-working-tables.md");
const dossierReportPath = path.join(repoRoot, "reports", "chapter-dossiers.md");

const dataFiles = [
  "data/potential-documents.js",
  "data/source-gap-leads.js",
  "data/compiler-gaps.js",
  "data/clinton-library-research-plan.js",
  "data/presidential-daily-diary-references.js",
  "data/clinton-public-statements.js"
];

const context = { window: {} };
vm.createContext(context);

for (const file of dataFiles) {
  const source = fs.readFileSync(path.join(repoRoot, file), "utf8");
  vm.runInContext(source, context, { filename: file });
}

const chapterSequence = [
  "ctbt",
  "strategic-arms",
  "start-ii",
  "ctr-heu",
  "nonproliferation",
  "counterproliferation",
  "regional",
  "cbw-conventional",
  "conventional-landmines"
];

const chapterDefinitions = [
  { id: "ctbt", number: "Chapter 1", title: "NPT and CTBT" },
  { id: "strategic-arms", number: "Chapter 2", title: "Strategic Arms and Nuclear Security" },
  { id: "start-ii", number: "Chapter 3", title: "START II Ratification" },
  { id: "ctr-heu", number: "Chapter 4", title: "Cooperative Threat Reduction and HEU Agreement" },
  { id: "nonproliferation", number: "Chapter 5", title: "Nonproliferation Regimes" },
  { id: "counterproliferation", number: "Chapter 6", title: "Counterproliferation" },
  { id: "regional", number: "Chapter 7", title: "Regional Proliferation Cases" },
  { id: "cbw-conventional", number: "Chapter 8", title: "Chemical and Biological Weapons" },
  { id: "conventional-landmines", number: "Chapter 9", title: "Conventional Arms and Landmines" }
];

const generatedPotentialDocuments = context.window.ARMSCONTROL_POTENTIAL_DOCUMENTS || [];
const sourceGapLeads = context.window.ARMSCONTROL_SOURCE_GAP_LEADS || [];
const compilerGaps = context.window.ARMSCONTROL_COMPILER_GAPS || [];
const libraryResearchPlan = context.window.ARMSCONTROL_LIBRARY_RESEARCH_PLAN || [];
const dailyDiaryReferences = context.window.ARMSCONTROL_DAILY_DIARY_REFERENCES || [];
const clintonPublicStatements = (context.window.CLINTON_PUBLIC_STATEMENTS || []).slice().sort(compareByDateThenTitle);

const potentialDocuments = [...generatedPotentialDocuments, ...sourceGapLeads].sort((a, b) => {
  const chapterOrder = chapterSequence.indexOf(a.chapterId) - chapterSequence.indexOf(b.chapterId);
  return (
    chapterOrder ||
    `${a.date || "9999"}`.localeCompare(`${b.date || "9999"}`) ||
    (b.score || 0) - (a.score || 0) ||
    a.title.localeCompare(b.title)
  );
});

const declassifiedChronology = potentialDocuments
  .filter(isDeclassifiedChronologyItem)
  .sort(
    (a, b) =>
      chronologySortKey(a.date).localeCompare(chronologySortKey(b.date)) ||
      (b.score || 0) - (a.score || 0) ||
      a.title.localeCompare(b.title)
  );
const chapterDossiers = chapterDefinitions.map(buildChapterDossier);

fs.mkdirSync(exportDir, { recursive: true });

writeCsv("potential-documents-triage.csv", potentialDocumentColumns(), potentialDocuments);
writeCsv("declassified-chronology.csv", chronologyColumns(), declassifiedChronology);
writeCsv("clinton-library-call-slips.csv", libraryColumns(), libraryResearchPlan.slice().sort(compareLibraryRows));
writeCsv("presidential-daily-diary-follow-up.csv", diaryColumns(), dailyDiaryReferences.slice().sort(compareDiaryRows));
writeCsv("compiler-risk-register.csv", gapColumns(), compilerGaps.slice().sort(compareGapRows));
writeCsv("clinton-public-statements.csv", statementColumns(), clintonPublicStatements);
writeCsv("chapter-dossiers.csv", dossierColumns(), chapterDossiers);
writeReport();
writeDossierReport();

console.log(
  [
    `Generated ${path.relative(repoRoot, path.join(exportDir, "potential-documents-triage.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "declassified-chronology.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "clinton-library-call-slips.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "presidential-daily-diary-follow-up.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "compiler-risk-register.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "clinton-public-statements.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "chapter-dossiers.csv"))}`,
    `Generated ${path.relative(repoRoot, workingTablesReportPath)}`,
    `Generated ${path.relative(repoRoot, dossierReportPath)}`
  ].join("\n")
);

function writeCsv(filename, columns, rows) {
  const header = columns.map((column) => csvCell(column.label)).join(",");
  const body = rows.map((row, index) =>
    columns.map((column) => csvCell(column.value(row, index))).join(",")
  );
  fs.writeFileSync(path.join(exportDir, filename), `${[header, ...body].join("\n")}\n`);
}

function potentialDocumentColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("date", (row) => row.date),
    column("chapter", (row) => row.chapterTitle || row.chapterId),
    column("priority", (row) => row.priority),
    column("title", (row) => row.title),
    column("source_type", (row) => row.sourceType),
    column("repository", (row) => row.sourceRepository),
    column("collection", (row) => cleanSourceCollection(row)),
    column("identifier", (row) => row.identifier || (row.naid ? `NAID ${row.naid}` : "")),
    column("level", (row) => row.level),
    column("confidence", (row) => row.confidence),
    column("category", (row) => row.category),
    column("compiler_risk", (row) => row.compilerRisk),
    column("source_note", (row) => formatFrusSourceNote(row)),
    column("source_url", (row) => row.sourceUrl),
    column("digital_object_url", (row) => row.digitalObjectUrl),
    column("scout_search_url", (row) => row.scoutSearchUrl),
    column("matched_queries", (row) => row.matchedQueries),
    column("topics", (row) => row.topics),
    column("summary", (row) => row.summary || row.sourceNote)
  ];
}

function chronologyColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("date", (row) => row.date),
    column("chapter", (row) => row.chapterTitle || row.chapterId),
    column("priority", (row) => row.priority),
    column("title", (row) => row.title),
    column("source_type", (row) => row.sourceType),
    column("repository", (row) => row.sourceRepository),
    column("identifier", (row) => row.identifier || (row.naid ? `NAID ${row.naid}` : "")),
    column("level", (row) => row.level),
    column("confidence", (row) => row.confidence),
    column("source_note", (row) => formatFrusSourceNote(row)),
    column("compiler_risk", (row) => row.compilerRisk),
    column("source_url", (row) => row.sourceUrl),
    column("digital_object_url", (row) => row.digitalObjectUrl),
    column("summary", (row) => row.summary || row.sourceNote)
  ];
}

function libraryColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("priority", (row) => row.priority),
    column("chapter", (row) => row.chapterTitle || row.chapterId),
    column("title", (row) => row.title),
    column("office", (row) => row.office),
    column("source_part", (row) => row.sourcePart),
    column("oa_ids", (row) => row.oaIds),
    column("visit_goal", (row) => row.visitGoal),
    column("why_it_matters", (row) => row.whyItMatters),
    column("onsite_actions", (row) => row.onsiteActions),
    column("target_terms", (row) => row.targetTerms),
    column("source_note", (row) => formatLibrarySourceNote(row))
  ];
}

function diaryColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("date", (row) => row.date),
    column("priority", (row) => row.priority),
    column("chapter", (row) => row.chapterTitle || row.chapterId),
    column("event_type", (row) => row.eventType),
    column("title", (row) => row.title),
    column("participants", (row) => row.participants),
    column("source_path", (row) => row.sourcePath),
    column("verification", (row) => row.verification),
    column("relevance", (row) => row.relevance),
    column("source_note", (row) => row.sourceNote),
    column("source_url", (row) => row.sourceUrl),
    column("digital_object_url", (row) => row.digitalObjectUrl),
    column("catalog_search_url", (row) => row.catalogSearchUrl)
  ];
}

function gapColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("priority", (row) => row.priority),
    column("status", (row) => row.status),
    column("lane", (row) => row.lane),
    column("title", (row) => row.title),
    column("evidence", (row) => row.evidence),
    column("problem", (row) => row.problem),
    column("needed", (row) => row.needed),
    column("next_actions", (row) => row.nextActions),
    column("target_records", (row) => row.targetRecords),
    column("target_terms", (row) => row.targetTerms),
    column("source_pools", (row) => row.sourcePools)
  ];
}

function statementColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("date", (row) => row.date),
    column("chapter", (row) => row.chapterTitle || row.chapterId),
    column("priority", (row) => row.priority),
    column("title", (row) => row.title),
    column("identifier", (row) => row.identifier),
    column("pages", (row) => row.pages),
    column("topics", (row) => row.topics),
    column("source_note", (row) => formatFrusSourceNote(row)),
    column("summary", (row) => row.summary),
    column("source_url", (row) => row.sourceUrl),
    column("digital_object_url", (row) => row.digitalObjectUrl)
  ];
}

function dossierColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("chapter_number", (row) => row.chapter.number),
    column("chapter", (row) => row.chapter.title),
    column("candidate_leads", (row) => row.documents.length),
    column("declassified_chronology_leads", (row) => row.chronology.length),
    column("first_read_count", (row) => row.firstReads.length),
    column("packet_screen_count", (row) => row.packetScreens.length),
    column("clinton_library_pull_count", (row) => row.pulls.length),
    column("a_priority_pull_count", (row) => row.pulls.filter((item) => item.priority === "A").length),
    column("diary_reference_count", (row) => row.diaries.length),
    column("high_diary_reference_count", (row) => row.diaries.filter((item) => item.priority === "High").length),
    column("public_statement_count", (row) => row.statements.length),
    column("active_risk_count", (row) => row.risks.length),
    column("next_move", (row) => row.nextMove),
    column("first_reads", (row) => titleList(row.firstReads, documentLabel)),
    column("packet_or_pull_leads", (row) => titleList(row.pulls.length ? row.pulls : row.packetScreens, pullOrPacketLabel)),
    column("date_controls", (row) =>
      titleList([...row.diaries.filter((item) => item.priority === "High"), ...row.statements], documentLabel)
    ),
    column("risk_controls", (row) => titleList(row.risks, (gap) => `${gap.priority}: ${gap.title}`)),
    column("target_records", (row) => uniqueFlat(row.risks.map((gap) => gap.targetRecords))),
    column("target_terms", (row) => uniqueFlat(row.risks.map((gap) => gap.targetTerms)))
  ];
}

function writeReport() {
  const lines = [
    "# Compiler Working Tables",
    "",
    "Generated from the site's staged data files. These CSVs are meant as working sheets for sorting, filtering, archive pulls, and source-note cleanup; they are not final FRUS document selections.",
    "",
    "## Tables",
    "",
    `- \`exports/potential-documents-triage.csv\`: ${potentialDocuments.length} staged document or source-path leads with FRUS-style source notes and risk fields.`,
    `- \`exports/declassified-chronology.csv\`: ${declassifiedChronology.length} dated released/declassified archival leads promoted to the first page section.`,
    `- \`exports/clinton-library-call-slips.csv\`: ${libraryResearchPlan.length} Clinton Library pull clusters from the 2013-0185-M folder-title lists.`,
    `- \`exports/presidential-daily-diary-follow-up.csv\`: ${dailyDiaryReferences.length} calls or meetings to verify against telcons, memcons, PC/DC minutes, NSC notes, or agency records.`,
    `- \`exports/compiler-risk-register.csv\`: ${compilerGaps.length} source-risk controls with next actions, target records, and source pools.`,
    `- \`exports/clinton-public-statements.csv\`: ${clintonPublicStatements.length} Clinton Public Papers anchors for public chronology and speech-clearance backtracking.`,
    `- \`exports/chapter-dossiers.csv\`: ${chapterDossiers.length} chapter-level dashboards bundling first reads, packet screens, archive pulls, diary date controls, public anchors, and risk controls.`,
    "",
    "## Compiler Use",
    "",
    "1. Start with `declassified-chronology.csv` for the first read-through of available or released records.",
    "2. Use `chapter-dossiers.csv` as the chapter launch sheet before opening the larger tables.",
    "3. Use `potential-documents-triage.csv` to sort by chapter, priority, source type, level, and compiler risk.",
    "4. Use `clinton-library-call-slips.csv` on site to request high-yield OA/ID clusters and record exact box, folder, item, markings, and pagination.",
    "5. Use `presidential-daily-diary-follow-up.csv` only as a locator sheet until a substantive telcon, memcon, meeting note, or agency file is found.",
    "6. Keep `compiler-risk-register.csv` open while selecting documents so public statements, file-unit rows, and broad finding aids do not masquerade as final item-level evidence.",
    "",
    "Regenerate with:",
    "",
    "```bash",
    "node scripts/build-compiler-working-tables.js",
    "```",
    ""
  ];
  fs.writeFileSync(workingTablesReportPath, lines.join("\n"));
}

function writeDossierReport() {
  const lines = [
    "# Chapter Dossiers",
    "",
    "Generated from the site's staged chronology, potential-document, Clinton Library, Presidential Daily Diary, public-statement, and risk-register data. Each dossier is a chapter-level launch pad rather than a final FRUS selection.",
    "",
    "## Use Rule",
    "",
    "Start each chapter from its first-read list, use packet or pull leads to get item boundaries, use diary and public-statement rows as date controls, and keep the risk controls open until the source base is strong enough for final selection.",
    "",
    "## Dossiers",
    ""
  ];

  for (const dossier of chapterDossiers) {
    lines.push(
      `### ${dossier.chapter.number}: ${dossier.chapter.title}`,
      "",
      `- Candidate leads: ${dossier.documents.length}`,
      `- Declassified chronology leads: ${dossier.chronology.length}`,
      `- Clinton Library pull clusters: ${dossier.pulls.length}`,
      `- Diary references: ${dossier.diaries.length}`,
      `- Clinton public statements: ${dossier.statements.length}`,
      `- Active risk controls: ${dossier.risks.length}`,
      `- Next move: ${dossier.nextMove}`,
      ""
    );

    lines.push("First reads:");
    appendBulletList(lines, dossier.firstReads, documentLabel, "No item-level or released leads staged yet.");
    lines.push("", "Packet or pull leads:");
    appendBulletList(lines, dossier.pulls.length ? dossier.pulls : dossier.packetScreens, pullOrPacketLabel, "No packet or library pull staged yet.");
    lines.push("", "Date controls:");
    appendBulletList(
      lines,
      [...dossier.diaries.filter((item) => item.priority === "High"), ...dossier.statements].slice(0, 4),
      documentLabel,
      "No diary or public-statement date control staged yet."
    );
    lines.push("", "Risk controls:");
    appendBulletList(lines, dossier.risks, (gap) => `${gap.priority}: ${gap.title}`, "No specific source risk staged.");
    lines.push("");
  }

  fs.writeFileSync(dossierReportPath, lines.join("\n"));
}

function buildChapterDossier(chapter) {
  const documents = potentialDocuments.filter((item) => item.chapterId === chapter.id).sort(compareDossierRows);
  const chronology = declassifiedChronology.filter((item) => item.chapterId === chapter.id).sort(compareDossierRows);
  const firstReads = uniqueDossierRows([...chronology, ...documents.filter(isImmediateDossierRead)])
    .sort(compareDossierRows)
    .slice(0, 3);
  const packetScreens = uniqueDossierRows(documents.filter((item) => !isImmediateDossierRead(item)))
    .sort(compareDossierRows)
    .slice(0, 3);
  const pulls = libraryResearchPlan
    .filter((item) => item.chapterId === chapter.id)
    .sort((a, b) => libraryPriorityRank(a.priority) - libraryPriorityRank(b.priority) || a.title.localeCompare(b.title));
  const diaries = dailyDiaryReferences
    .filter((item) => item.chapterId === chapter.id)
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || chronologySortKey(a.date).localeCompare(chronologySortKey(b.date)));
  const statements = clintonPublicStatements
    .filter((item) => item.chapterId === chapter.id)
    .sort(compareByDateThenTitle);
  const specificRisks = compilerGaps.filter((gap) => gapMatchesChapter(gap, chapter));
  const globalRisks = compilerGaps.filter((gap) =>
    ["gap-source-base-diversity", "gap-nara-file-unit-quality", "gap-public-statements-as-locators"].includes(gap.id)
  );
  const risks = uniqueDossierRows([...specificRisks.sort(compareGapRows), ...globalRisks.sort(compareGapRows)]).slice(0, 3);
  const nextMove =
    specificRisks.sort(compareGapRows)[0]?.nextActions?.[0] ||
    pulls[0]?.onsiteActions?.[0] ||
    (packetScreens[0] ? `Screen packet lead: ${packetScreens[0].title}` : "") ||
    (firstReads[0] ? `Close-read: ${firstReads[0].title}` : "Hold for additional source discovery.");

  return { chapter, documents, chronology, firstReads, packetScreens, pulls, diaries, statements, risks, nextMove };
}

function compareDossierRows(a, b) {
  return (
    priorityRank(a.priority) - priorityRank(b.priority) ||
    chronologySortKey(a.date || "").localeCompare(chronologySortKey(b.date || "")) ||
    (b.score || 0) - (a.score || 0) ||
    a.title.localeCompare(b.title)
  );
}

function isImmediateDossierRead(item) {
  const level = `${item.level || ""}`.toLowerCase();
  const type = `${item.sourceType || ""}`.toLowerCase();
  return level.includes("item-level review copy") || level.includes("published primary source") || type.includes("directive");
}

function uniqueDossierRows(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = [row.date, row.title, row.identifier || row.id || row.naid || row.sourceUrl || ""].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function gapMatchesChapter(gap, chapter) {
  const blob = [gap.id, gap.lane, gap.title, gap.needed, ...(gap.targetTerms || [])]
    .join(" ")
    .toLowerCase();
  const aliases = {
    ctbt: ["npt", "ctbt", "test ban"],
    "strategic-arms": ["strategic", "nuclear security", "missile systems"],
    "start-ii": ["start ii", "start-ii", "duma"],
    "ctr-heu": ["ctr", "heu", "nunn-lugar", "cooperative threat reduction"],
    nonproliferation: ["nonproliferation regime", "mtcr", "fissile", "nuclear smuggling"],
    counterproliferation: ["counterproliferation", "pdd-18", "wmd planning"],
    regional: ["regional", "north korea", "iran", "iraq", "china", "south asia"],
    "cbw-conventional": ["cbw", "cwc", "bwc", "chemical weapons", "chemical and biological", "elisa harris", "australia group"],
    "conventional-landmines": ["conventional", "landmine", "ccw", "arms transfer"]
  };
  return (aliases[chapter.id] || [chapter.title.toLowerCase()]).some((term) => blob.includes(term));
}

function documentLabel(item) {
  return `${item.date || "date pending"}: ${item.title}`;
}

function pullOrPacketLabel(item) {
  if (item.oaIds) {
    const ids = (item.oaIds || []).slice(0, 4).join(", ");
    return `${item.priority || "Review"}: ${item.title}${ids ? ` (${ids})` : ""}`;
  }
  return `${item.priority || "Review"}: ${item.title}`;
}

function titleList(rows, mapper, limit = 4) {
  return rows.slice(0, limit).map(mapper);
}

function uniqueFlat(groups) {
  return [...new Set(groups.flat().filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function appendBulletList(lines, rows, mapper, emptyText) {
  if (!rows.length) {
    lines.push(`- ${emptyText}`);
    return;
  }
  for (const row of rows) lines.push(`- ${mapper(row)}`);
}

function column(label, value) {
  return { label, value };
}

function csvCell(value) {
  const text = normalizeCell(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function normalizeCell(value) {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(normalizeCell).filter(Boolean).join("; ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value).replace(/\s+/g, " ").trim();
}

function compareByDateThenTitle(a, b) {
  return `${a.date || "9999"}`.localeCompare(`${b.date || "9999"}`) || a.title.localeCompare(b.title);
}

function compareDiaryRows(a, b) {
  return (
    `${a.date || "9999"}`.localeCompare(`${b.date || "9999"}`) ||
    priorityRank(a.priority) - priorityRank(b.priority) ||
    a.title.localeCompare(b.title)
  );
}

function compareLibraryRows(a, b) {
  return (
    libraryPriorityRank(a.priority) - libraryPriorityRank(b.priority) ||
    chapterRank(a.chapterId) - chapterRank(b.chapterId) ||
    a.title.localeCompare(b.title)
  );
}

function compareGapRows(a, b) {
  return gapPriorityRank(a.priority) - gapPriorityRank(b.priority) || a.title.localeCompare(b.title);
}

function priorityRank(priority) {
  return { Critical: 0, High: 1, A: 1, Medium: 2, B: 2, Low: 3, C: 3, Review: 4, Control: 4 }[priority] ?? 5;
}

function libraryPriorityRank(priority) {
  return { Control: 0, A: 1, B: 2, C: 3 }[priority] ?? 4;
}

function gapPriorityRank(priority) {
  return { Critical: 0, High: 1, Medium: 2, Review: 3 }[priority] ?? 4;
}

function chapterRank(chapterId) {
  const index = chapterSequence.indexOf(chapterId);
  return index === -1 ? 99 : index;
}

function startYear(value = "") {
  const match = String(value).match(/\d{4}/);
  return match ? Number(match[0]) : 9999;
}

function chronologySortKey(value = "") {
  const text = String(value);
  const exact = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (exact) return text;
  const month = text.match(/^(\d{4})-(\d{2})$/);
  if (month) return `${month[1]}-${month[2]}-99`;
  const year = text.match(/^(\d{4})/);
  return year ? `${year[1]}-99-99` : "9999-99-99";
}

function isDeclassifiedChronologyItem(item) {
  if (!item.date || startYear(item.date) > 1996) return false;

  const sourceBlob = [
    item.sourceType,
    item.sourceRepository,
    item.sourceCollection,
    item.category,
    item.level
  ]
    .filter(Boolean)
    .join(" ");
  const publicBlob = [item.sourceType, item.sourceRepository].filter(Boolean).join(" ");

  if (/finding aid/i.test(sourceBlob)) return false;
  if (/Public Papers|Archived White House|Congress|DOD|NRC|OSTI|FAS|Argonne/i.test(publicBlob)) return false;

  return /(declassified|released|MDR|Clinton Digital Library|Clinton-Russia|Presidential decision directive|directive)/i.test(
    sourceBlob
  );
}

function publicPapersBook(identifier = "", date = "") {
  const match = identifier.match(/PPP-(\d{4})-book(\d)/);
  if (!match) return date ? date.slice(0, 4) : "year not surfaced";
  const roman = { 1: "I", 2: "II", 3: "III" };
  return `${match[1]}, Book ${roman[match[2]] || match[2]}`;
}

function cleanSourceCollection(item) {
  const collection = item.sourceCollection || "";
  if (!collection || collection === "NARA Scout cached result") return "";
  return collection;
}

function leadTitleLabel(item) {
  const level = `${item.level || ""}`.toLowerCase();
  if (level.includes("fileunit")) return "File-unit title";
  if (level.includes("packet")) return "Packet title";
  if (level.includes("collection") || item.sourceType?.includes("finding aid")) return "Collection title";
  return "Title";
}

function sourceNoteStatus(item) {
  const level = `${item.level || ""}`.toLowerCase();
  const type = `${item.sourceType || ""}`.toLowerCase();
  const category = `${item.category || ""}`.toLowerCase();

  if (type.includes("public papers") || item.sourceRepository === "GovInfo") {
    return "Published primary source.";
  }
  if (type.includes("congressional") || type.includes("senate")) {
    return "Published primary-source record; use with internal policy files before final document selection.";
  }
  if (type.includes("nara scout") || level.includes("fileunit")) {
    return "File-unit lead surfaced for research triage; item-level document text, classification, date, and pagination pending.";
  }
  if (level.includes("packet")) {
    return "Packet lead; exact item title, classification, and pagination pending.";
  }
  if (level.includes("collection") || type.includes("finding aid") || category.includes("finding aid")) {
    return "Collection-level lead; exact folder, item title, classification, and pagination pending.";
  }
  if (level.includes("source-path") || category.includes("source path")) {
    return "Source-path lead; replace with an item-level archival citation before final FRUS selection.";
  }
  if (level.includes("published")) {
    return "Published primary source.";
  }
  return "Research lead; verify item-level source details before final FRUS selection.";
}

function formatFrusSourceNote(item) {
  const existing = `${item.sourceNote || ""}`.trim();
  if (existing.startsWith("Source:") && !existing.includes("NARA Scout harvest")) return existing;

  if (item.sourceType === "Public Papers" || item.sourceRepository === "GovInfo") {
    const book = publicPapersBook(item.identifier, item.date);
    const pages = item.pages ? `, ${item.pages}` : "";
    return `Source: Public Papers of the Presidents of the United States: William J. Clinton, ${book}${pages}, "${item.title}"; GovInfo. Published primary source.`;
  }

  const repository =
    item.sourceRepository === "Clinton-Russia-High-Level"
      ? cleanSourceCollection(item) || "Clinton Library release packet"
      : item.sourceRepository || item.sourceType || "Repository pending";
  const collection =
    item.sourceRepository === "Clinton-Russia-High-Level" ? "" : cleanSourceCollection(item);
  const identifier = item.identifier || (item.naid ? `NAID ${item.naid}` : "");
  const pathText = [repository, collection, identifier].filter(Boolean).join(", ");
  const title = item.title ? ` ${leadTitleLabel(item)}: "${item.title}".` : "";
  const reviewCopy =
    item.sourceRepository === "Clinton-Russia-High-Level"
      ? " Review copy available through the companion Clinton-Russia page; verify the final citation against the owning release packet."
      : "";

  return `Source: ${pathText || "source path pending"}.${title} ${sourceNoteStatus(item)}${reviewCopy}`.replace(
    /\s+/g,
    " "
  );
}

function formatLibrarySourceNote(item) {
  const ids = (item.oaIds || []).map((id) => id.replace(/\.$/, ""));
  const idLabel = ids.some((id) => id.startsWith("Part ")) ? "references" : "OA/ID";
  const shownIds = ids.slice(0, 6).join(", ");
  const extra = ids.length > 6 ? `, plus ${ids.length - 6} more` : "";
  const oaText = ids.length ? `, ${idLabel} ${shownIds}${extra}` : "";
  return `Source: Clinton Presidential Library, 2013-0185-M folder-title lists, ${
    item.sourcePart || "part pending"
  }${oaText}. Folder-title lead; verify exact box, folder title, item date, classification, and pagination on site.`;
}
