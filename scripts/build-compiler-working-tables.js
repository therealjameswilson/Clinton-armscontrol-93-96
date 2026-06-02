const fs = require("fs");
const path = require("path");
const vm = require("vm");
const {
  QUERY_PACKS: naraScoutQueryPacks,
  SCOPES: naraScoutScopes,
  SCOUT_URL: naraScoutUrl
} = require("./harvest-nara-scout-documents");

const repoRoot = path.resolve(__dirname, "..");
const exportDir = path.join(repoRoot, "exports");
const workingTablesReportPath = path.join(repoRoot, "reports", "compiler-working-tables.md");
const dossierReportPath = path.join(repoRoot, "reports", "chapter-dossiers.md");
const chapterReadinessReportPath = path.join(repoRoot, "reports", "chapter-readiness-scorecard.md");
const readinessReportPath = path.join(repoRoot, "reports", "selection-readiness-queue.md");
const selectionCaptureReportPath = path.join(repoRoot, "reports", "frus-selection-capture-worksheet.md");
const naraFileUnitReportPath = path.join(repoRoot, "reports", "nara-file-unit-resolution-queue.md");
const naraScoutQueryPacketReportPath = path.join(repoRoot, "reports", "nara-scout-query-packets.md");
const publicBacktraceReportPath = path.join(repoRoot, "reports", "public-statement-backtrace-queue.md");
const diaryCounterpartReportPath = path.join(repoRoot, "reports", "daily-diary-counterpart-queue.md");
const libraryRequestPacketReportPath = path.join(repoRoot, "reports", "clinton-library-request-packets.md");
const libraryRequestReportPath = path.join(repoRoot, "reports", "clinton-library-oaid-request-queue.md");

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
const selectionReadinessQueue = potentialDocuments
  .map((item) => ({ ...item, readiness: classifySelectionReadiness(item) }))
  .sort(compareReadinessRows);
const selectionCaptureWorksheet = selectionReadinessQueue.map((item) => ({
  ...item,
  selectionGate: classifySelectionGate(item)
}));
const naraFileUnitResolutionQueue = potentialDocuments.filter(isNaraFileUnitLead).sort(compareNaraFileUnitRows);
const publicStatementBacktraceQueue = clintonPublicStatements.map(buildPublicBacktraceRow).sort(comparePublicBacktraceRows);
const dailyDiaryCounterpartQueue = dailyDiaryReferences.map(buildDiaryCounterpartRow).sort(compareDiaryCounterpartRows);
const libraryRequestQueue = libraryResearchPlan.flatMap(expandLibraryRequestRows).sort(compareLibraryRequestRows);
const libraryRequestPackets = buildLibraryRequestPackets(libraryRequestQueue);
const chapterDossiers = chapterDefinitions.map(buildChapterDossier);
const chapterReadinessScorecard = chapterDefinitions.map(buildChapterReadinessRow);
const naraScoutQueryPacketQueue = buildNaraScoutQueryPacketQueue();

fs.mkdirSync(exportDir, { recursive: true });

writeCsv("potential-documents-triage.csv", potentialDocumentColumns(), potentialDocuments);
writeCsv("selection-readiness-queue.csv", readinessColumns(), selectionReadinessQueue);
writeCsv("frus-selection-capture-worksheet.csv", selectionCaptureColumns(), selectionCaptureWorksheet);
writeCsv("nara-file-unit-resolution-queue.csv", naraFileUnitColumns(), naraFileUnitResolutionQueue);
writeCsv("nara-scout-query-packets.csv", naraScoutQueryPacketColumns(), naraScoutQueryPacketQueue);
writeCsv("declassified-chronology.csv", chronologyColumns(), declassifiedChronology);
writeCsv("public-statement-backtrace-queue.csv", publicBacktraceColumns(), publicStatementBacktraceQueue);
writeCsv("clinton-library-call-slips.csv", libraryColumns(), libraryResearchPlan.slice().sort(compareLibraryRows));
writeCsv("clinton-library-oaid-request-queue.csv", libraryRequestColumns(), libraryRequestQueue);
writeCsv("clinton-library-request-packets.csv", libraryRequestPacketColumns(), libraryRequestPackets);
writeCsv("presidential-daily-diary-follow-up.csv", diaryColumns(), dailyDiaryReferences.slice().sort(compareDiaryRows));
writeCsv("daily-diary-counterpart-queue.csv", diaryCounterpartColumns(), dailyDiaryCounterpartQueue);
writeCsv("compiler-risk-register.csv", gapColumns(), compilerGaps.slice().sort(compareGapRows));
writeCsv("clinton-public-statements.csv", statementColumns(), clintonPublicStatements);
writeCsv("chapter-dossiers.csv", dossierColumns(), chapterDossiers);
writeCsv("chapter-readiness-scorecard.csv", chapterReadinessColumns(), chapterReadinessScorecard);
writeReport();
writeDossierReport();
writeChapterReadinessReport();
writeReadinessReport();
writeSelectionCaptureReport();
writeNaraFileUnitReport();
writeNaraScoutQueryPacketReport();
writePublicBacktraceReport();
writeDiaryCounterpartReport();
writeLibraryRequestPacketReport();
writeLibraryRequestReport();

console.log(
  [
    `Generated ${path.relative(repoRoot, path.join(exportDir, "potential-documents-triage.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "selection-readiness-queue.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "frus-selection-capture-worksheet.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "nara-file-unit-resolution-queue.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "nara-scout-query-packets.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "declassified-chronology.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "public-statement-backtrace-queue.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "clinton-library-call-slips.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "clinton-library-oaid-request-queue.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "clinton-library-request-packets.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "presidential-daily-diary-follow-up.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "daily-diary-counterpart-queue.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "compiler-risk-register.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "clinton-public-statements.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "chapter-dossiers.csv"))}`,
    `Generated ${path.relative(repoRoot, path.join(exportDir, "chapter-readiness-scorecard.csv"))}`,
    `Generated ${path.relative(repoRoot, workingTablesReportPath)}`,
    `Generated ${path.relative(repoRoot, dossierReportPath)}`,
    `Generated ${path.relative(repoRoot, chapterReadinessReportPath)}`,
    `Generated ${path.relative(repoRoot, readinessReportPath)}`,
    `Generated ${path.relative(repoRoot, selectionCaptureReportPath)}`,
    `Generated ${path.relative(repoRoot, naraFileUnitReportPath)}`,
    `Generated ${path.relative(repoRoot, naraScoutQueryPacketReportPath)}`,
    `Generated ${path.relative(repoRoot, publicBacktraceReportPath)}`,
    `Generated ${path.relative(repoRoot, diaryCounterpartReportPath)}`,
    `Generated ${path.relative(repoRoot, libraryRequestPacketReportPath)}`,
    `Generated ${path.relative(repoRoot, libraryRequestReportPath)}`
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

function readinessColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("queue", (row) => row.readiness.queue),
    column("readiness", (row) => row.readiness.readiness),
    column("next_action", (row) => row.readiness.nextAction),
    column("required_verification", (row) => row.readiness.requiredVerification),
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
    column("compiler_risk", (row) => row.compilerRisk),
    column("source_note", (row) => formatFrusSourceNote(row)),
    column("source_url", (row) => row.sourceUrl),
    column("digital_object_url", (row) => row.digitalObjectUrl),
    column("summary", (row) => row.summary || row.sourceNote)
  ];
}

function selectionCaptureColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("selection_gate", (row) => row.selectionGate),
    column("readiness_queue", (row) => row.readiness.queue),
    column("next_action", (row) => row.readiness.nextAction),
    column("required_verification", (row) => row.readiness.requiredVerification),
    column("date_or_span", (row) => row.date),
    column("chapter", (row) => row.chapterTitle || row.chapterId),
    column("priority", (row) => row.priority),
    column("title", (row) => row.title),
    column("source_type", (row) => row.sourceType),
    column("repository", (row) => row.sourceRepository),
    column("collection", (row) => cleanSourceCollection(row)),
    column("identifier", (row) => row.identifier || (row.naid ? `NAID ${row.naid}` : "")),
    column("level", (row) => row.level),
    column("confidence", (row) => row.confidence),
    column("compiler_risk", (row) => row.compilerRisk),
    column("current_source_note", (row) => formatFrusSourceNote(row)),
    column("current_citation_status", (row) => sourceNoteStatus(row)),
    column("source_url", (row) => row.sourceUrl),
    column("digital_object_url", (row) => row.digitalObjectUrl),
    column("proposed_document_number", () => ""),
    column("selection_decision", () => ""),
    column("final_document_date", () => ""),
    column("final_document_title", () => ""),
    column("document_type", () => ""),
    column("author_or_origin", () => ""),
    column("recipient_or_audience", () => ""),
    column("final_repository", () => ""),
    column("final_collection_or_file_path", () => ""),
    column("final_box_folder_or_identifier", () => ""),
    column("classification_markings", () => ""),
    column("draft_final_action_status", () => ""),
    column("pagination", () => ""),
    column("attachments_enclosures", () => ""),
    column("editorial_note_needed", () => ""),
    column("cross_references", () => ""),
    column("declassification_or_withholding_notes", () => ""),
    column("final_source_note", () => ""),
    column("compiler_notes", () => "")
  ];
}

function naraFileUnitColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("resolution_priority", (row) => naraResolutionPriority(row)),
    column("chapter", (row) => row.chapterTitle || row.chapterId),
    column("priority", (row) => row.priority),
    column("title", (row) => row.title),
    column("naid", (row) => row.naid || naidFromIdentifier(row.identifier)),
    column("identifier", (row) => row.identifier || (row.naid ? `NAID ${row.naid}` : "")),
    column("catalog_url", (row) => row.sourceUrl || catalogUrl(row)),
    column("catalog_search_url", (row) => catalogSearchUrl(row)),
    column("source_type", (row) => row.sourceType),
    column("repository", (row) => row.sourceRepository),
    column("collection", (row) => cleanSourceCollection(row)),
    column("level", (row) => row.level),
    column("confidence", (row) => row.confidence),
    column("matched_queries", (row) => row.matchedQueries),
    column("topics", (row) => row.topics),
    column("current_source_note", (row) => formatFrusSourceNote(row)),
    column("resolution_goal", () => "Replace file-unit lead with item-level document candidate or mark as context-only."),
    column("first_action", (row) => naraFirstAction(row)),
    column("verify_box_folder_path", () => ""),
    column("verify_child_item_url", () => ""),
    column("verify_item_title", () => ""),
    column("verify_item_date", () => ""),
    column("verify_author_recipient", () => ""),
    column("verify_document_type", () => ""),
    column("verify_classification_markings", () => ""),
    column("verify_page_range", () => ""),
    column("verify_digital_object_status", () => ""),
    column("replacement_candidate_title", () => ""),
    column("replacement_candidate_date", () => ""),
    column("disposition", () => ""),
    column("final_source_note", () => ""),
    column("compiler_notes", () => "")
  ];
}

function naraScoutQueryPacketColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("run_priority", (row) => row.runPriority),
    column("chapter", (row) => row.chapterTitle),
    column("query", (row) => row.query),
    column("scope_naid", (row) => row.scopeNaid),
    column("scope_label", (row) => row.scopeLabel),
    column("scout_search_url", (row) => row.scoutSearchUrl),
    column("catalog_search_url", (row) => row.catalogSearchUrl),
    column("existing_file_unit_leads_in_chapter", (row) => row.existingFileUnitLeadsInChapter),
    column("high_priority_file_unit_leads_in_chapter", (row) => row.highPriorityFileUnitLeadsInChapter),
    column("chapter_readiness_band", (row) => row.chapterReadinessBand),
    column("chapter_readiness_score", (row) => row.chapterReadinessScore),
    column("top_chapter_risk", (row) => row.topChapterRisk),
    column("target_record_types", (row) => row.targetRecordTypes),
    column("why_run_this_query", (row) => row.whyRunThisQuery),
    column("dedupe_note", (row) => row.dedupeNote),
    column("harvester_command", (row) => row.harvesterCommand),
    column("capture_result_count", () => ""),
    column("capture_top_naids", () => ""),
    column("capture_item_level_hits", () => ""),
    column("capture_child_item_urls", () => ""),
    column("capture_dates_or_date_spans", () => ""),
    column("capture_source_paths", () => ""),
    column("capture_candidates_promoted", () => ""),
    column("capture_context_only_leads", () => ""),
    column("disposition", () => ""),
    column("compiler_notes", () => "")
  ];
}

function publicBacktraceColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("date", (row) => row.date),
    column("chapter", (row) => row.chapterTitle || row.chapterId),
    column("priority", (row) => row.priority),
    column("public_anchor_title", (row) => row.title),
    column("identifier", (row) => row.identifier),
    column("pages", (row) => row.pages),
    column("source_url", (row) => row.sourceUrl),
    column("digital_object_url", (row) => row.digitalObjectUrl),
    column("source_note", (row) => formatFrusSourceNote(row)),
    column("public_claim_or_use", (row) => row.summary || row.sourceNote),
    column("internal_counterpart_needed", () => "Yes: use as locator until paired with internal policy, clearance, negotiation, implementation, telcon, memcon, PC/DC, or agency record."),
    column("likely_internal_record_types", (row) => likelyInternalRecordTypes(row)),
    column("backtrace_action", (row) => row.backtraceAction),
    column("nearest_diary_controls", (row) => titleList(row.nearestDiaries, diaryBacktraceLabel, 3)),
    column("clinton_library_pull_clusters", (row) => titleList(row.libraryPulls, pullOrPacketLabel, 3)),
    column("related_candidate_leads", (row) => titleList(row.relatedCandidates, documentLabel, 4)),
    column("target_terms", (row) => row.targetTerms),
    column("capture_internal_counterpart_title", () => ""),
    column("capture_internal_counterpart_date", () => ""),
    column("capture_source_path", () => ""),
    column("capture_record_type", () => ""),
    column("capture_author_recipient", () => ""),
    column("capture_classification_markings", () => ""),
    column("capture_page_range", () => ""),
    column("capture_relationship_to_public_statement", () => ""),
    column("disposition", () => ""),
    column("compiler_notes", () => "")
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

function libraryRequestColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("visit_day", (row) => row.visitDay),
    column("request_wave", (row) => row.requestWave),
    column("priority", (row) => row.priority),
    column("chapter", (row) => row.chapterTitle || row.chapterId),
    column("cluster_title", (row) => row.clusterTitle),
    column("request_identifier", (row) => row.requestIdentifier),
    column("request_type", (row) => row.requestType),
    column("source_part", (row) => row.sourcePart),
    column("office", (row) => row.office),
    column("visit_goal", (row) => row.visitGoal),
    column("why_it_matters", (row) => row.whyItMatters),
    column("first_onsite_action", (row) => row.firstOnsiteAction),
    column("onsite_actions", (row) => row.onsiteActions),
    column("target_terms", (row) => row.targetTerms),
    column("capture_folder_title", () => ""),
    column("capture_box_or_container", () => ""),
    column("capture_item_title", () => ""),
    column("capture_item_date", () => ""),
    column("capture_sender_recipient", () => ""),
    column("capture_document_type", () => ""),
    column("capture_classification_markings", () => ""),
    column("capture_page_range", () => ""),
    column("capture_attachments", () => ""),
    column("capture_withdrawal_or_redaction_notes", () => ""),
    column("capture_volume_boundary", () => ""),
    column("candidate_disposition", () => ""),
    column("final_source_note", () => ""),
    column("source_note", (row) => formatLibraryRequestSourceNote(row))
  ];
}

function libraryRequestPacketColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("visit_day", (row) => row.visitDay),
    column("packet_wave", (row) => row.packetWave),
    column("priority", (row) => row.priority),
    column("request_identifier", (row) => row.requestIdentifier),
    column("request_type", (row) => row.requestType),
    column("duplicate_rows_collapsed", (row) => row.duplicateRowsCollapsed),
    column("chapters", (row) => row.chapters),
    column("cluster_titles", (row) => row.clusterTitles),
    column("source_parts", (row) => row.sourceParts),
    column("offices", (row) => row.offices),
    column("related_request_waves", (row) => row.relatedRequestWaves),
    column("request_reason", (row) => row.requestReason),
    column("first_onsite_action", (row) => row.firstOnsiteAction),
    column("onsite_actions", (row) => row.onsiteActions),
    column("target_terms", (row) => row.targetTerms),
    column("combined_why_it_matters", (row) => row.combinedWhyItMatters),
    column("dedupe_note", (row) => row.dedupeNote),
    column("capture_exact_folder_title", () => ""),
    column("capture_box_or_container", () => ""),
    column("capture_folder_date_span", () => ""),
    column("capture_withdrawal_sheet", () => ""),
    column("capture_item_title", () => ""),
    column("capture_item_date", () => ""),
    column("capture_sender_recipient", () => ""),
    column("capture_document_type", () => ""),
    column("capture_classification_markings", () => ""),
    column("capture_page_range", () => ""),
    column("capture_attachments", () => ""),
    column("capture_volume_boundary", () => ""),
    column("candidate_disposition", () => ""),
    column("final_source_note", () => ""),
    column("compiler_notes", () => ""),
    column("packet_source_note", (row) => formatLibraryPacketSourceNote(row))
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

function diaryCounterpartColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("date", (row) => row.date),
    column("priority", (row) => row.priority),
    column("chapter", (row) => row.chapterTitle || row.chapterId),
    column("event_type", (row) => row.eventType),
    column("diary_anchor_title", (row) => row.title),
    column("participants", (row) => row.participants),
    column("occurrence_source_path", (row) => row.sourcePath),
    column("occurrence_source_note", (row) => row.sourceNote),
    column("occurrence_source_url", (row) => row.sourceUrl),
    column("occurrence_digital_object_url", (row) => row.digitalObjectUrl),
    column("catalog_search_url", (row) => row.catalogSearchUrl),
    column("counterpart_needed", () => "Yes: diary or index entry proves occurrence only; locate the substantive telcon, memcon, PC/DC minutes, NSC note, cable, or agency file before final selection."),
    column("likely_counterpart_record_types", (row) => row.likelyCounterpartRecordTypes),
    column("search_action", (row) => row.searchAction),
    column("related_candidate_leads", (row) => titleList(row.relatedCandidates, documentLabel, 4)),
    column("clinton_library_pull_clusters", (row) => titleList(row.libraryPulls, pullOrPacketLabel, 3)),
    column("public_statement_anchors", (row) => titleList(row.publicAnchors, documentLabel, 3)),
    column("target_terms", (row) => row.targetTerms),
    column("required_verification", (row) => row.requiredVerification),
    column("capture_counterpart_title", () => ""),
    column("capture_counterpart_date", () => ""),
    column("capture_counterpart_record_type", () => ""),
    column("capture_source_path", () => ""),
    column("capture_author_recipient", () => ""),
    column("capture_classification_markings", () => ""),
    column("capture_page_range", () => ""),
    column("capture_relationship_to_diary_entry", () => ""),
    column("disposition", () => ""),
    column("final_source_note", () => ""),
    column("compiler_notes", () => "")
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

function chapterReadinessColumns() {
  return [
    column("sequence", (_row, index) => index + 1),
    column("chapter_number", (row) => row.chapter.number),
    column("chapter", (row) => row.chapter.title),
    column("readiness_band", (row) => row.readinessBand),
    column("readiness_score", (row) => row.readinessScore),
    column("compiler_focus", (row) => row.compilerFocus),
    column("next_action", (row) => row.nextAction),
    column("top_risk", (row) => row.topRisk),
    column("candidate_leads", (row) => row.candidateLeads),
    column("declassified_chronology_leads", (row) => row.declassifiedChronologyLeads),
    column("close_read_now_count", (row) => row.closeReadNowCount),
    column("screen_packet_count", (row) => row.screenPacketCount),
    column("resolve_file_unit_count", (row) => row.resolveFileUnitCount),
    column("pull_source_path_count", (row) => row.pullSourcePathCount),
    column("date_control_anchor_count", (row) => row.dateControlAnchorCount),
    column("clinton_library_pull_count", (row) => row.clintonLibraryPullCount),
    column("a_priority_pull_count", (row) => row.aPriorityPullCount),
    column("daily_diary_counterpart_count", (row) => row.dailyDiaryCounterpartCount),
    column("public_statement_backtrace_count", (row) => row.publicStatementBacktraceCount),
    column("active_risk_count", (row) => row.activeRiskCount),
    column("critical_risk_count", (row) => row.criticalRiskCount),
    column("high_risk_count", (row) => row.highRiskCount),
    column("blockers", (row) => row.blockers),
    column("first_reads", (row) => titleList(row.firstReads, documentLabel, 3)),
    column("first_pull", (row) => row.firstPull ? pullOrPacketLabel(row.firstPull) : ""),
    column("date_controls", (row) => titleList(row.dateControls, documentLabel, 4)),
    column("risk_controls", (row) => titleList(row.riskControls, (gap) => `${gap.priority}: ${gap.title}`, 4)),
    column("notes", (row) => row.notes)
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
    `- \`exports/declassified-chronology.csv\`: ${declassifiedChronology.length} dated released/declassified archival leads promoted to the first page section.`,
    `- \`exports/potential-documents-triage.csv\`: ${potentialDocuments.length} staged document or source-path leads with FRUS-style source notes and risk fields.`,
    `- \`exports/selection-readiness-queue.csv\`: ${selectionReadinessQueue.length} staged leads normalized into readiness gates, next actions, and verification fields.`,
    `- \`exports/frus-selection-capture-worksheet.csv\`: ${selectionCaptureWorksheet.length} staged leads with final-selection, citation, document-description, and source-note capture fields.`,
    `- \`exports/nara-file-unit-resolution-queue.csv\`: ${naraFileUnitResolutionQueue.length} NARA Scout or file-unit leads isolated for item-boundary resolution.`,
    `- \`exports/nara-scout-query-packets.csv\`: ${naraScoutQueryPacketQueue.length} NARA Scout query/scope packets for reruns and source-gap discovery.`,
    `- \`exports/public-statement-backtrace-queue.csv\`: ${publicStatementBacktraceQueue.length} Clinton public statements paired with internal-counterpart search paths.`,
    `- \`exports/clinton-library-call-slips.csv\`: ${libraryResearchPlan.length} Clinton Library pull clusters from the 2013-0185-M folder-title lists.`,
    `- \`exports/clinton-library-request-packets.csv\`: ${libraryRequestPackets.length} de-duplicated Clinton Library request packets for reading-room call slips.`,
    `- \`exports/clinton-library-oaid-request-queue.csv\`: ${libraryRequestQueue.length} exploded Clinton Library request rows, one row per staged OA/ID or folder-list control reference.`,
    `- \`exports/presidential-daily-diary-follow-up.csv\`: ${dailyDiaryReferences.length} calls or meetings to verify against telcons, memcons, PC/DC minutes, NSC notes, or agency records.`,
    `- \`exports/daily-diary-counterpart-queue.csv\`: ${dailyDiaryCounterpartQueue.length} diary events converted into substantive-counterpart searches and capture fields.`,
    `- \`exports/compiler-risk-register.csv\`: ${compilerGaps.length} source-risk controls with next actions, target records, and source pools.`,
    `- \`exports/clinton-public-statements.csv\`: ${clintonPublicStatements.length} Clinton Public Papers anchors for public chronology and speech-clearance backtracking.`,
    `- \`exports/chapter-dossiers.csv\`: ${chapterDossiers.length} chapter-level dashboards bundling first reads, packet screens, archive pulls, diary date controls, public anchors, and risk controls.`,
    `- \`exports/chapter-readiness-scorecard.csv\`: ${chapterReadinessScorecard.length} chapter-level readiness rows with counts, blockers, top risks, and next actions.`,
    "",
    "## Compiler Use",
    "",
    "1. Start with `declassified-chronology.csv` for the first read-through of available or released records.",
    "2. Use `selection-readiness-queue.csv` to see what each lead is ready for before investing time.",
    "3. Use `nara-file-unit-resolution-queue.csv` to resolve file-unit rows into item-level candidates or context-only leads.",
    "4. Use `nara-scout-query-packets.csv` when re-running Scout or filling source gaps so query/scope work is tracked and reproducible.",
    "5. Use `frus-selection-capture-worksheet.csv` to record final selection decisions, document description fields, and completed FRUS source notes.",
    "6. Use `chapter-readiness-scorecard.csv` to decide which chapter can move to close reading, which chapter needs item-boundary work, and which chapter needs discovery first.",
    "7. Use `chapter-dossiers.csv` as the chapter launch sheet before opening the larger tables.",
    "8. Use `potential-documents-triage.csv` to sort by chapter, priority, source type, level, and compiler risk.",
    "9. Use `public-statement-backtrace-queue.csv` to pair public anchors with internal records before treating them as sequence evidence.",
    "10. Use `clinton-library-call-slips.csv` for pull-cluster strategy, `clinton-library-request-packets.csv` for de-duplicated reading-room requests, then `clinton-library-oaid-request-queue.csv` for item-level capture.",
    "11. Use `presidential-daily-diary-follow-up.csv` for occurrence control, then `daily-diary-counterpart-queue.csv` to locate and capture substantive telcons, memcons, PC/DC minutes, NSC notes, cables, or agency files.",
    "12. Keep `compiler-risk-register.csv` open while selecting documents so public statements, file-unit rows, and broad finding aids do not masquerade as final item-level evidence.",
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

function writeChapterReadinessReport() {
  const sortedRows = chapterReadinessScorecard.slice().sort(
    (a, b) =>
      b.readinessScore - a.readinessScore ||
      a.criticalRiskCount - b.criticalRiskCount ||
      chapterRank(a.chapter.id) - chapterRank(b.chapter.id)
  );
  const lines = [
    "# Chapter Readiness Scorecard",
    "",
    "Generated from the chapter dossiers, selection-readiness queue, file-unit resolver, Daily Diary counterpart queue, public-statement backtrace queue, Clinton Library pull plan, and compiler-risk register.",
    "",
    "## Use Rule",
    "",
    "Treat the score as a triage aid, not a final selection claim. A high score means the chapter has enough visible material to launch close reading or archive pulls. A low score means the compiler should first resolve item boundaries, backtrace public/date controls, or add stronger primary-source leads.",
    "",
    "## Scorecard",
    "",
    "| Chapter | Band | Score | Focus | Next action | Blockers |",
    "| --- | --- | ---: | --- | --- | --- |"
  ];

  for (const row of sortedRows) {
    lines.push(
      `| ${mdCell(`${row.chapter.number}: ${row.chapter.title}`)} | ${mdCell(row.readinessBand)} | ${row.readinessScore} | ${mdCell(row.compilerFocus)} | ${mdCell(row.nextAction)} | ${mdCell(row.blockers.join("; "))} |`
    );
  }

  lines.push("", "## Counts By Chapter", "");

  for (const row of sortedRows) {
    lines.push(
      `### ${row.chapter.number}: ${row.chapter.title}`,
      "",
      `- Readiness: ${row.readinessBand} (${row.readinessScore})`,
      `- Candidate leads: ${row.candidateLeads}`,
      `- Close-read now: ${row.closeReadNowCount}`,
      `- Screen packet: ${row.screenPacketCount}`,
      `- Resolve file unit: ${row.resolveFileUnitCount}`,
      `- Pull source path: ${row.pullSourcePathCount}`,
      `- Date/control anchors: ${row.dateControlAnchorCount}`,
      `- Clinton Library pulls: ${row.clintonLibraryPullCount} (${row.aPriorityPullCount} A-priority)`,
      `- Diary counterparts: ${row.dailyDiaryCounterpartCount}`,
      `- Public-statement backtraces: ${row.publicStatementBacktraceCount}`,
      `- Active risks: ${row.activeRiskCount} (${row.criticalRiskCount} critical, ${row.highRiskCount} high)`,
      `- Focus: ${row.compilerFocus}`,
      `- Next action: ${row.nextAction}`,
      `- Top risk: ${row.topRisk || "No specific risk staged."}`,
      "",
      "First reads:"
    );
    appendBulletList(lines, row.firstReads, documentLabel, "No first reads staged.");
    lines.push("", "Blockers:");
    appendBulletList(lines, row.blockers, (item) => item, "No major blocker surfaced by the scorecard.");
    lines.push("");
  }

  fs.writeFileSync(chapterReadinessReportPath, lines.join("\n"));
}

function writeReadinessReport() {
  const groups = [...new Set(selectionReadinessQueue.map((item) => item.readiness.queue))].sort(
    (a, b) => readinessQueueRank(a) - readinessQueueRank(b)
  );
  const lines = [
    "# Selection Readiness Queue",
    "",
    "Generated from the potential-document table. This report normalizes each staged lead into the immediate work it is ready for: close-read, packet screening, file-unit resolution, source-path pulling, public/date control, or hold-for-review.",
    "",
    "## Queue Counts",
    ""
  ];

  for (const queue of groups) {
    const items = selectionReadinessQueue.filter((item) => item.readiness.queue === queue);
    lines.push(`- ${queue}: ${items.length}`);
  }

  lines.push("", "## Queues", "");

  for (const queue of groups) {
    const items = selectionReadinessQueue.filter((item) => item.readiness.queue === queue);
    const first = items[0];
    lines.push(
      `### ${queue}`,
      "",
      `- Leads: ${items.length}`,
      `- Readiness: ${first?.readiness.readiness || "pending"}`,
      `- Next action: ${first?.readiness.nextAction || "pending"}`,
      `- Verify: ${(first?.readiness.requiredVerification || []).join("; ") || "source details"}`,
      "",
      "Top leads:"
    );
    appendBulletList(
      lines,
      items.slice(0, 8),
      (item) => `${item.chapterTitle || item.chapterId} / ${item.date || "date pending"} / ${item.title}`,
      "No leads staged."
    );
    lines.push("");
  }

  fs.writeFileSync(readinessReportPath, lines.join("\n"));
}

function writeSelectionCaptureReport() {
  const gates = [...new Set(selectionCaptureWorksheet.map((item) => item.selectionGate))].sort(
    (a, b) => selectionGateRank(a) - selectionGateRank(b)
  );
  const lines = [
    "# FRUS Selection Capture Worksheet",
    "",
    "Generated from the selection-readiness queue. This worksheet is the handoff from source discovery to compilation: one row per staged lead, with current source-note context plus blank fields for final document description, selection disposition, and completed FRUS source note.",
    "",
    "## Use Rule",
    "",
    "Do not treat a row as selected until the final document fields are filled: document date, title, type, author/origin, recipient/audience, repository, collection or file path, box/folder or identifier, classification markings, page range, attachments, declassification notes, and final source note.",
    "",
    "## Selection Gate Counts",
    ""
  ];

  for (const gate of gates) {
    const rows = selectionCaptureWorksheet.filter((item) => item.selectionGate === gate);
    lines.push(`- ${gate}: ${rows.length}`);
  }

  lines.push("", "## Gates", "");

  for (const gate of gates) {
    const rows = selectionCaptureWorksheet.filter((item) => item.selectionGate === gate);
    lines.push(`### ${gate}`, "", `- Leads: ${rows.length}`, "", "Top rows:");
    appendBulletList(
      lines,
      rows.slice(0, 8),
      (item) =>
        `${item.readiness.queue} / ${item.chapterTitle || item.chapterId} / ${item.date || "date pending"} / ${item.title}`,
      "No leads staged."
    );
    lines.push("");
  }

  fs.writeFileSync(selectionCaptureReportPath, lines.join("\n"));
}

function writeNaraFileUnitReport() {
  const chapters = [...new Set(naraFileUnitResolutionQueue.map((item) => item.chapterTitle || item.chapterId))];
  const lines = [
    "# NARA File-Unit Resolution Queue",
    "",
    "Generated from the potential-document table. This report isolates NARA Scout and file-unit leads that cannot become FRUS selections until item boundaries, dates, markings, and page ranges are verified.",
    "",
    "## Use Rule",
    "",
    "Open each Catalog record, look for child item records or digital objects, and either replace the file-unit lead with an item-level candidate or mark it context-only. Do not move a file-unit row into the final chronology without item title, date, author/recipient, classification markings, folder path, and page range.",
    "",
    "## Queue Counts",
    "",
    `- Total file-unit leads: ${naraFileUnitResolutionQueue.length}`,
    `- High priority: ${naraFileUnitResolutionQueue.filter((item) => item.priority === "High").length}`,
    `- With NAID: ${naraFileUnitResolutionQueue.filter((item) => item.naid || naidFromIdentifier(item.identifier)).length}`,
    `- With any identifier: ${naraFileUnitResolutionQueue.filter((item) => item.naid || item.identifier).length}`,
    "",
    "## By Chapter",
    ""
  ];

  for (const chapter of chapters) {
    const rows = naraFileUnitResolutionQueue.filter((item) => (item.chapterTitle || item.chapterId) === chapter);
    lines.push(`### ${chapter}`, "", `- Leads: ${rows.length}`, "", "Rows:");
    appendBulletList(
      lines,
      rows,
      (item) => `${item.priority || "Review"} / ${naraDisplayIdentifier(item)} / ${item.title}`,
      "No file-unit rows staged."
    );
    lines.push("");
  }

  fs.writeFileSync(naraFileUnitReportPath, lines.join("\n"));
}

function writeNaraScoutQueryPacketReport() {
  const runGroups = [...new Set(naraScoutQueryPacketQueue.map((item) => item.runPriority))].sort(
    (a, b) => naraScoutRunPriorityRank(a) - naraScoutRunPriorityRank(b)
  );
  const lines = [
    "# NARA Scout Query Packets",
    "",
    "Generated from the same query packs used by `scripts/harvest-nara-scout-documents.js`, combined with the current file-unit resolver, chapter readiness scorecard, and compiler-risk register.",
    "",
    "## Use Rule",
    "",
    "Use this sheet when NARA Scout quota is available or when a compiler needs to rerun a chapter-specific search by hand. Record result counts, top NAIDs, child-item URLs, source paths, and disposition so repeated searches do not disappear into ad hoc notes.",
    "",
    "## Packet Counts",
    "",
    `- Query/scope packets: ${naraScoutQueryPacketQueue.length}`,
    `- Chapters covered: ${new Set(naraScoutQueryPacketQueue.map((item) => item.chapterId)).size}`,
    `- Scope records covered: ${new Set(naraScoutQueryPacketQueue.map((item) => item.scopeNaid)).size}`,
    `- Urgent rerun packets: ${naraScoutQueryPacketQueue.filter((item) => item.runPriority === "Urgent").length}`,
    `- High priority packets: ${naraScoutQueryPacketQueue.filter((item) => item.runPriority === "High").length}`,
    "",
    "## By Run Priority",
    ""
  ];

  for (const group of runGroups) {
    const rows = naraScoutQueryPacketQueue.filter((item) => item.runPriority === group);
    lines.push(`### ${group}`, "", `- Packets: ${rows.length}`, "", "Top packets:");
    appendBulletList(
      lines,
      rows.slice(0, 18),
      (item) => `${item.chapterTitle} / ${item.query} / ${item.scopeLabel} / ${item.whyRunThisQuery}`,
      "No packets in this priority."
    );
    lines.push("");
  }

  lines.push("## By Chapter", "");
  for (const chapter of chapterDefinitions) {
    const rows = naraScoutQueryPacketQueue.filter((item) => item.chapterId === chapter.id);
    const urgent = rows.filter((item) => item.runPriority === "Urgent").length;
    const high = rows.filter((item) => item.runPriority === "High").length;
    const fileUnits = naraFileUnitResolutionQueue.filter((item) => item.chapterId === chapter.id).length;
    lines.push(
      `### ${chapter.number}: ${chapter.title}`,
      "",
      `- Query/scope packets: ${rows.length}`,
      `- Urgent: ${urgent}`,
      `- High: ${high}`,
      `- Existing file-unit leads: ${fileUnits}`,
      "",
      "Queries:"
    );
    appendBulletList(
      lines,
      uniqueSorted(rows.map((item) => item.query)),
      (query) => query,
      "No query packets staged."
    );
    lines.push("");
  }

  fs.writeFileSync(naraScoutQueryPacketReportPath, lines.join("\n"));
}

function writePublicBacktraceReport() {
  const chapters = [...new Set(publicStatementBacktraceQueue.map((item) => item.chapterTitle || item.chapterId))];
  const lines = [
    "# Public Statement Backtrace Queue",
    "",
    "Generated from the Clinton Public Papers statement index. This report treats public statements as locators and pairs each one with the nearest diary controls, Clinton Library pull clusters, candidate document leads, and blank fields for the internal counterpart that should carry the FRUS sequence.",
    "",
    "## Use Rule",
    "",
    "Do not let a public statement stand alone for internal policy substance unless the compiler deliberately selects the statement text. Backtrace each public anchor to a memcon, telcon, decision memorandum, clearance file, treaty file, PC/DC record, cable, or agency implementation record.",
    "",
    "## Queue Counts",
    "",
    `- Public statement anchors: ${publicStatementBacktraceQueue.length}`,
    `- With diary controls: ${publicStatementBacktraceQueue.filter((item) => item.nearestDiaries.length).length}`,
    `- With Clinton Library pulls: ${publicStatementBacktraceQueue.filter((item) => item.libraryPulls.length).length}`,
    "",
    "## By Chapter",
    ""
  ];

  for (const chapter of chapters) {
    const rows = publicStatementBacktraceQueue.filter((item) => (item.chapterTitle || item.chapterId) === chapter);
    lines.push(`### ${chapter}`, "", `- Public anchors: ${rows.length}`, "", "Rows:");
    appendBulletList(
      lines,
      rows,
      (item) => `${item.date || "date pending"} / ${item.title} / Backtrace: ${item.backtraceAction}`,
      "No public statements staged."
    );
    lines.push("");
  }

  fs.writeFileSync(publicBacktraceReportPath, lines.join("\n"));
}

function writeDiaryCounterpartReport() {
  const chapters = [...new Set(dailyDiaryCounterpartQueue.map((item) => item.chapterTitle || item.chapterId))].sort(
    (a, b) => chapterTitleRank(a) - chapterTitleRank(b) || a.localeCompare(b)
  );
  const lines = [
    "# Daily Diary Counterpart Queue",
    "",
    "Generated from the Presidential Daily Diary follow-up rows. This report treats diary and foreign-leader index entries as occurrence controls, then points the compiler toward the substantive counterpart record needed for FRUS selection.",
    "",
    "## Use Rule",
    "",
    "Do not select a diary row by itself unless the editorial decision is to document the President's schedule. For arms-control substance, locate the matching telcon, memcon, PC/DC minutes, NSC meeting note, cable, agency paper, or briefing file, then fill the counterpart capture fields and final source note.",
    "",
    "## Queue Counts",
    "",
    `- Diary or index occurrence controls: ${dailyDiaryCounterpartQueue.length}`,
    `- High priority: ${dailyDiaryCounterpartQueue.filter((item) => item.priority === "High").length}`,
    `- Hardcopy diary digital objects: ${dailyDiaryCounterpartQueue.filter((item) => item.digitalObjectUrl).length}`,
    `- Foreign-leader index controls: ${dailyDiaryCounterpartQueue.filter((item) => /foreign-leader/i.test(item.eventType || "")).length}`,
    `- With Clinton Library pull clusters: ${dailyDiaryCounterpartQueue.filter((item) => item.libraryPulls.length).length}`,
    "",
    "## By Chapter",
    ""
  ];

  for (const chapter of chapters) {
    const rows = dailyDiaryCounterpartQueue.filter((item) => (item.chapterTitle || item.chapterId) === chapter);
    lines.push(`### ${chapter}`, "", `- Occurrence controls: ${rows.length}`, "", "Rows:");
    appendBulletList(
      lines,
      rows,
      (item) => `${item.date || "date pending"} / ${item.title} / ${item.searchAction}`,
      "No diary counterparts staged."
    );
    lines.push("");
  }

  fs.writeFileSync(diaryCounterpartReportPath, lines.join("\n"));
}

function writeLibraryRequestPacketReport() {
  const visitDays = [...new Set(libraryRequestPackets.map((item) => item.visitDay))].sort(
    (a, b) => libraryVisitDayRank(a) - libraryVisitDayRank(b)
  );
  const duplicatedPackets = libraryRequestPackets.filter((item) => item.duplicateRowsCollapsed > 1);
  const lines = [
    "# Clinton Library Request Packets",
    "",
    "Generated from the exploded OA/ID request queue. This report collapses duplicate request identifiers so the compiler can request each OA/ID or folder-list control once while preserving every chapter rationale attached to it.",
    "",
    "## Use Rule",
    "",
    "Use this packet list for reading-room call slips and request sequencing. After a packet is pulled, use the exploded OA/ID request queue or FRUS selection capture worksheet for item-level candidates, markings, pagination, withdrawal sheets, volume boundary, and final source notes.",
    "",
    "## Packet Counts",
    "",
    `- Exploded request rows: ${libraryRequestQueue.length}`,
    `- De-duplicated request packets: ${libraryRequestPackets.length}`,
    `- Rows collapsed by de-duplication: ${libraryRequestQueue.length - libraryRequestPackets.length}`,
    `- Identifiers with multiple chapter or cluster rationales: ${duplicatedPackets.length}`,
    "",
    "## By Visit Day",
    ""
  ];

  for (const day of visitDays) {
    const rows = libraryRequestPackets.filter((item) => item.visitDay === day);
    const duplicateRows = rows.filter((item) => item.duplicateRowsCollapsed > 1);
    lines.push(
      `### ${day}`,
      "",
      `- Packets: ${rows.length}`,
      `- Multi-rationale packets: ${duplicateRows.length}`,
      "",
      "Requests:"
    );
    appendBulletList(
      lines,
      rows,
      (item) =>
        `${item.packetWave} / ${item.requestIdentifier} / ${item.chapters.join("; ")} / ${item.clusterTitles
          .slice(0, 2)
          .join("; ")}${item.clusterTitles.length > 2 ? ` / plus ${item.clusterTitles.length - 2} more clusters` : ""}`,
      "No request packets staged."
    );
    lines.push("");
  }

  lines.push("## Duplicate Identifiers To Request Once", "");
  appendBulletList(
    lines,
    duplicatedPackets.sort((a, b) => b.duplicateRowsCollapsed - a.duplicateRowsCollapsed || compareLibraryPacketRows(a, b)),
    (item) =>
      `${item.requestIdentifier}: ${item.duplicateRowsCollapsed} rows collapsed; chapters: ${item.chapters.join("; ")}; waves: ${item.relatedRequestWaves.join("; ")}`,
    "No duplicate identifiers found."
  );
  lines.push("");

  fs.writeFileSync(libraryRequestPacketReportPath, lines.join("\n"));
}

function writeLibraryRequestReport() {
  const visitDays = [...new Set(libraryRequestQueue.map((item) => item.visitDay))].sort(
    (a, b) => libraryVisitDayRank(a) - libraryVisitDayRank(b)
  );
  const lines = [
    "# Clinton Library OA/ID Request Queue",
    "",
    "Generated from the 2013-0185-M folder-title research plan. This report explodes the cluster-level visit plan into one row per staged OA/ID or folder-list control reference so the compiler can move from chapter strategy to request slips and capture fields.",
    "",
    "## Use Rule",
    "",
    "Use `clinton-library-request-packets.csv` for de-duplicated reading-room call slips, then use this CSV as the on-site item-review worksheet. Request folders from the Day 1 packet rows first, then fill the blank capture columns here for exact folder title, box or container, item title, date, sender/recipient, document type, classification markings, page range, attachments, withdrawal notes, volume boundary, disposition, and final source note.",
    "",
    "## Queue Counts",
    ""
  ];

  for (const day of visitDays) {
    const rows = libraryRequestQueue.filter((item) => item.visitDay === day);
    lines.push(`- ${day}: ${rows.length}`);
  }

  lines.push("", "## Requests", "");

  for (const day of visitDays) {
    const rows = libraryRequestQueue.filter((item) => item.visitDay === day);
    lines.push(`### ${day}`, "");
    for (const row of rows) {
      lines.push(
        `- ${row.requestWave} / ${row.requestIdentifier} / ${row.chapterTitle || row.chapterId} / ${row.clusterTitle}`
      );
    }
    lines.push("");
  }

  fs.writeFileSync(libraryRequestReportPath, lines.join("\n"));
}

function expandLibraryRequestRows(item, clusterIndex) {
  const ids = item.oaIds?.length ? item.oaIds : ["request identifier pending"];
  return ids.map((rawIdentifier, idIndex) => {
    const cleanedIdentifier = cleanOaIdentifier(rawIdentifier);
    const requestIdentifier = formatRequestIdentifier(cleanedIdentifier);
    return {
      id: `${item.id || "library"}-${idIndex}-${cleanedIdentifier}`,
      clusterId: item.id,
      clusterOrder: clusterIndex,
      identifierOrder: idIndex,
      priority: item.priority,
      chapterId: item.chapterId,
      chapterTitle: item.chapterTitle,
      clusterTitle: item.title,
      office: item.office,
      sourcePart: item.sourcePart,
      rawIdentifier: cleanedIdentifier,
      requestIdentifier,
      requestType: /^Part\s+\d/i.test(cleanedIdentifier) ? "Folder-list control reference" : "OA/ID request",
      visitDay: libraryVisitDay(item.priority),
      requestWave: `${libraryVisitDay(item.priority)} / ${String(clusterIndex + 1).padStart(2, "0")}.${String(
        idIndex + 1
      ).padStart(2, "0")}`,
      visitGoal: item.visitGoal,
      whyItMatters: item.whyItMatters,
      onsiteActions: item.onsiteActions || [],
      firstOnsiteAction: item.onsiteActions?.[0] || item.visitGoal,
      targetTerms: item.targetTerms || []
    };
  });
}

function buildLibraryRequestPackets(rows) {
  const groups = new Map();
  for (const row of rows) {
    const key = row.requestIdentifier || row.rawIdentifier || "request identifier pending";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  const packets = [...groups.values()]
    .map(buildLibraryRequestPacket)
    .sort(compareLibraryPacketRows);
  const dayCounts = {};
  return packets.map((packet) => {
    dayCounts[packet.visitDay] = (dayCounts[packet.visitDay] || 0) + 1;
    return {
      ...packet,
      packetWave: `${packet.visitDay} / Packet ${String(dayCounts[packet.visitDay]).padStart(2, "0")}`
    };
  });
}

function buildLibraryRequestPacket(rows) {
  const sortedRows = rows.slice().sort(compareLibraryRequestRows);
  const representative = sortedRows[0];
  const visitDay = bestVisitDay(sortedRows);
  const priority = bestLibraryPriority(sortedRows);
  const chapters = sortChapters(uniqueFlat([sortedRows.map((row) => row.chapterTitle || row.chapterId)]));
  const clusterTitles = uniqueSorted(sortedRows.map((row) => row.clusterTitle));
  const sourceParts = uniqueSorted(sortedRows.map((row) => row.sourcePart));
  const offices = uniqueSorted(sortedRows.map((row) => row.office));
  const onsiteActions = uniqueSorted(sortedRows.flatMap((row) => row.onsiteActions || []));
  const targetTerms = uniqueSorted(sortedRows.flatMap((row) => row.targetTerms || []));
  const relatedRequestWaves = uniqueSorted(sortedRows.map((row) => row.requestWave));
  const combinedWhyItMatters = uniqueSorted(sortedRows.map((row) => row.whyItMatters));
  const requestReason =
    sortedRows.length > 1
      ? `Request once; supports ${chapters.join(", ")} across ${clusterTitles.length} staged clusters.`
      : `Request for ${chapters[0] || "chapter pending"}: ${clusterTitles[0] || "cluster pending"}.`;
  const dedupeNote =
    sortedRows.length > 1
      ? `Collapsed ${sortedRows.length} queue rows into one reading-room request for ${representative.requestIdentifier}.`
      : "Single-rationale request packet.";

  return {
    requestIdentifier: representative.requestIdentifier,
    rawIdentifier: representative.rawIdentifier,
    requestType: representative.requestType,
    visitDay,
    priority,
    duplicateRowsCollapsed: sortedRows.length,
    chapters,
    clusterTitles,
    sourceParts,
    offices,
    relatedRequestWaves,
    requestReason,
    firstOnsiteAction: onsiteActions[0] || representative.firstOnsiteAction || representative.visitGoal,
    onsiteActions,
    targetTerms,
    combinedWhyItMatters,
    dedupeNote
  };
}

function bestVisitDay(rows) {
  return rows
    .map((row) => row.visitDay)
    .filter(Boolean)
    .sort((a, b) => libraryVisitDayRank(a) - libraryVisitDayRank(b))[0] || "Review";
}

function bestLibraryPriority(rows) {
  return rows
    .map((row) => row.priority)
    .filter(Boolean)
    .sort((a, b) => libraryPriorityRank(a) - libraryPriorityRank(b))[0] || "Review";
}

function libraryVisitDay(priority) {
  return { Control: "Pre-visit", A: "Day 1", B: "Day 2", C: "Defer" }[priority] || "Review";
}

function libraryVisitDayRank(day) {
  return { "Pre-visit": 0, "Day 1": 1, "Day 2": 2, Defer: 3, Review: 4 }[day] ?? 5;
}

function cleanOaIdentifier(value) {
  return String(value || "identifier pending").replace(/\.$/, "").trim();
}

function formatRequestIdentifier(value) {
  if (/^Part\s+\d/i.test(value) || /^request identifier pending$/i.test(value)) return value;
  return `OA/ID ${value}`;
}

function formatLibraryRequestSourceNote(row) {
  return `Source: Clinton Presidential Library, 2013-0185-M folder-title lists, ${
    row.sourcePart || "part pending"
  }, ${row.requestIdentifier}. Folder-title request lead; verify exact box, folder title, item date, classification, and pagination on site.`;
}

function formatLibraryPacketSourceNote(row) {
  const parts = row.sourceParts?.length ? row.sourceParts.join(", ") : "part pending";
  return `Source: Clinton Presidential Library, 2013-0185-M folder-title lists, ${parts}, ${row.requestIdentifier}. De-duplicated request packet; verify exact box, folder title, item date, classification, and pagination on site.`;
}

function classifySelectionGate(item) {
  const queue = item.readiness?.queue || "Hold for review";
  return {
    "Close-read now": "Candidate for close read",
    "Screen packet": "Packet screening required",
    "Resolve file unit": "Resolve file unit before selection",
    "Pull source path": "Pull source path before selection",
    "Date/control anchor": "Locator or date control only",
    "Hold for review": "Hold for source upgrade"
  }[queue] || "Hold for source upgrade";
}

function selectionGateRank(gate) {
  return {
    "Candidate for close read": 0,
    "Packet screening required": 1,
    "Resolve file unit before selection": 2,
    "Pull source path before selection": 3,
    "Locator or date control only": 4,
    "Hold for source upgrade": 5
  }[gate] ?? 6;
}

function isNaraFileUnitLead(item) {
  const type = `${item.sourceType || ""}`.toLowerCase();
  const level = `${item.level || ""}`.toLowerCase();
  return type.includes("nara scout") || level.includes("fileunit");
}

function naraResolutionPriority(item) {
  if (item.priority === "High") return "Resolve first";
  if (item.priority === "Medium") return "Resolve after high";
  return "Review if chapter needs depth";
}

function naraFirstAction(item) {
  const naid = item.naid || naidFromIdentifier(item.identifier);
  if (naid) return `Open Catalog NAID ${naid}; check for child item records, digital objects, folder path, and item dates.`;
  const identifier = normalizeIdentifier(item.identifier);
  if (identifier) return `Open ${identifier}; record requestable identifier, child item records, folder path, and item dates.`;
  return "Open the Catalog lead; record requestable identifier, child item records, folder path, and item dates.";
}

function catalogUrl(item) {
  const naid = item.naid || naidFromIdentifier(item.identifier);
  return naid ? `https://catalog.archives.gov/id/${naid}` : "";
}

function catalogSearchUrl(item) {
  const query = [item.title, item.naid ? `NAID ${item.naid}` : item.identifier, item.chapterTitle]
    .filter(Boolean)
    .join(" ");
  return query ? `https://catalog.archives.gov/search?q=${encodeURIComponent(query)}&collectionIdentifier=WJC*` : "";
}

function naidFromIdentifier(value) {
  const match = normalizeIdentifier(value).match(/^NAID\s+(\d+)$/i);
  return match ? match[1] : "";
}

function naraDisplayIdentifier(item) {
  if (item.naid) return `NAID ${item.naid}`;
  return normalizeIdentifier(item.identifier) || "identifier pending";
}

function buildNaraScoutQueryPacketQueue() {
  return naraScoutQueryPacks
    .flatMap((pack) =>
      pack.scopeIds.flatMap((scopeNaid) =>
        pack.queries.map((query) => buildNaraScoutQueryPacket(pack, scopeNaid, query))
      )
    )
    .sort(compareNaraScoutQueryPackets);
}

function buildNaraScoutQueryPacket(pack, scopeNaid, query) {
  const chapter = chapterDefinitions.find((item) => item.id === pack.chapterId) || {
    id: pack.chapterId,
    title: pack.chapterId,
    number: "Chapter"
  };
  const chapterFileUnits = naraFileUnitResolutionQueue.filter((item) => item.chapterId === pack.chapterId);
  const highPriorityFileUnits = chapterFileUnits.filter((item) => item.priority === "High");
  const scorecard = chapterReadinessScorecard.find((item) => item.chapter.id === pack.chapterId);
  const risks = chapterRiskControls(chapter);
  const topRisk = preferredChapterRisk(chapter, risks);
  const targetRecordTypes = naraScoutTargetRecordTypes(pack.chapterId, query);

  return {
    chapterId: pack.chapterId,
    chapterTitle: chapter.title,
    query,
    scopeNaid,
    scopeLabel: naraScoutScopes[scopeNaid] || "Scope pending",
    scoutSearchUrl: `${naraScoutUrl}?q=${encodeURIComponent(query)}`,
    catalogSearchUrl: `https://catalog.archives.gov/search?q=${encodeURIComponent(query)}&collectionIdentifier=WJC*`,
    existingFileUnitLeadsInChapter: chapterFileUnits.length,
    highPriorityFileUnitLeadsInChapter: highPriorityFileUnits.length,
    chapterReadinessBand: scorecard?.readinessBand || "",
    chapterReadinessScore: scorecard?.readinessScore ?? "",
    topChapterRisk: topRisk ? `${topRisk.priority}: ${topRisk.title}` : "",
    targetRecordTypes,
    whyRunThisQuery: naraScoutRunReason(pack.chapterId, query, chapterFileUnits, scorecard, topRisk),
    dedupeNote: "One row per query/scope pair from the harvester; capture result counts here before promoting records into the file-unit resolver or selection worksheet.",
    harvesterCommand: "NARA_SCOUT_API_KEY=... node scripts/harvest-nara-scout-documents.js --limit=18 --per-chapter=12",
    runPriority: naraScoutRunPriority(pack.chapterId, query, chapterFileUnits, scorecard, topRisk)
  };
}

function naraScoutRunPriority(chapterId, query, chapterFileUnits, scorecard, topRisk) {
  const queryText = query.toLowerCase();
  const highValueTerms = /start ii|ctbt|npt|cwc|bwc|counterproliferation|defense counterproliferation|nunn-lugar|highly enriched|north korea|iran|iraq|china|pdd-18|pdd-34|pdd-48/;
  if ((scorecard?.readinessScore ?? 100) <= 15 && highValueTerms.test(queryText)) return "Urgent";
  if (chapterFileUnits.filter((item) => item.priority === "High").length >= 4) return "Urgent";
  if (topRisk?.priority === "High" || highValueTerms.test(queryText)) return "High";
  if (chapterFileUnits.length) return "Medium";
  return "Review";
}

function naraScoutRunReason(chapterId, query, chapterFileUnits, scorecard, topRisk) {
  const pieces = [];
  if (chapterFileUnits.length) pieces.push(`chapter has ${chapterFileUnits.length} unresolved file-unit leads`);
  if (scorecard?.readinessBand) pieces.push(`scorecard band is ${scorecard.readinessBand}`);
  if (topRisk?.title) pieces.push(`top chapter risk: ${topRisk.title}`);
  pieces.push(`query targets ${targetPhrase({ chapterId, title: query, topics: titleKeywords(query) })}`);
  return pieces.join("; ");
}

function naraScoutTargetRecordTypes(chapterId, query) {
  const base = {
    ctbt: ["ACDA/State negotiation cable", "NSC decision memorandum", "PRD/PDD file", "Geneva negotiating file"],
    "strategic-arms": ["NSC arms-control memorandum", "summit preparation file", "joint-statement clearance", "working-group record"],
    "start-ii": ["ratification strategy memorandum", "Senate liaison file", "Duma/ABM linkage note", "telcon or memcon"],
    "ctr-heu": ["CTR implementation memorandum", "DOE/USEC/Minatom file", "Ukraine denuclearization record", "leader memcon"],
    nonproliferation: ["State/ACDA policy file", "export-control cable", "legal implementation memorandum", "treaty briefing file"],
    counterproliferation: ["DOD/NSC initiative paper", "JCS or IC assessment", "PDD/NSC file", "interagency meeting record"],
    regional: ["PC/DC minutes", "regional NSC policy file", "State cable", "telcon or memcon"],
    "cbw-conventional": ["CWC/BWC treaty file", "Senate ratification strategy", "ACDA/State implementation record", "CBW threat file"],
    "conventional-landmines": ["PDD/NSC policy file", "DOD/State implementation record", "CCW treaty file", "landmine decision memorandum"]
  }[chapterId] || ["item-level archival record", "folder-level lead"];
  const text = query.toLowerCase();
  if (/pdd|prd/.test(text)) return ["Presidential decision directive file", ...base].slice(0, 5);
  if (/speech|statement|radio address/.test(text)) return ["speech clearance file", "policy clearance attachment", ...base].slice(0, 5);
  if (/meeting|working group|committee/.test(text)) return ["meeting minutes", "briefing book", ...base].slice(0, 5);
  return base.slice(0, 5);
}

function buildPublicBacktraceRow(statement) {
  const nearestDiaries = dailyDiaryReferences
    .filter((item) => item.chapterId === statement.chapterId && dateDistanceDays(statement.date, item.date) <= 180)
    .sort((a, b) => compareBacktraceMatches(statement, a, b))
    .slice(0, 3);
  const libraryPulls = libraryResearchPlan
    .filter((item) => item.chapterId === statement.chapterId)
    .sort((a, b) => compareBacktraceMatches(statement, a, b))
    .slice(0, 3);
  const relatedCandidates = potentialDocuments
    .filter((item) => item.chapterId === statement.chapterId && item.sourceType !== "Public Papers" && item.title !== statement.title)
    .sort((a, b) => compareBacktraceMatches(statement, a, b))
    .slice(0, 4);
  const targetTerms = publicBacktraceTargetTerms(statement);
  const backtraceAction = publicBacktraceAction(statement, nearestDiaries, libraryPulls, relatedCandidates);

  return { ...statement, nearestDiaries, libraryPulls, relatedCandidates, targetTerms, backtraceAction };
}

function publicBacktraceAction(statement, nearestDiaries, libraryPulls, relatedCandidates) {
  const diary = nearestDiaries[0] ? `check diary control "${nearestDiaries[0].title}"` : "";
  const pull = libraryPulls[0] ? `pull "${libraryPulls[0].title}"` : "";
  const candidate = relatedCandidates[0] ? `screen "${relatedCandidates[0].title}"` : "";
  const actions = [diary, pull, candidate].filter(Boolean);
  if (actions.length) return `${actions.join("; ")}; record the internal counterpart before using "${statement.title}" as sequence evidence.`;
  return `Search internal files for ${targetPhrase(statement)} before using "${statement.title}" as sequence evidence.`;
}

function publicBacktraceTargetTerms(statement) {
  const genericTerms = new Set([
    `${statement.chapterTitle || ""}`.toLowerCase(),
    `${statement.chapterId || ""}`.toLowerCase(),
    "public papers",
    "clinton statement"
  ]);
  return [...new Set([...(statement.topics || []), ...titleKeywords(statement.title)])]
    .filter((term) => {
      const normalized = String(term).toLowerCase();
      return normalized && !normalized.startsWith("pp.") && !genericTerms.has(normalized);
    })
    .slice(0, 12);
}

function titleKeywords(title = "") {
  const stopwords = new Set([
    "with",
    "from",
    "that",
    "this",
    "and",
    "the",
    "statement",
    "remarks",
    "joint",
    "exchange",
    "reporters",
    "president",
    "united",
    "states"
  ]);
  return String(title)
    .replace(/[^A-Za-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopwords.has(word.toLowerCase()))
    .slice(0, 8);
}

function targetPhrase(statement) {
  const terms = publicBacktraceTargetTerms(statement);
  return terms.length ? terms.slice(0, 5).join(", ") : statement.chapterTitle || statement.chapterId || "internal counterpart records";
}

function likelyInternalRecordTypes(statement) {
  const typesByChapter = {
    ctbt: ["NSC/ACDA negotiation record", "State or ACDA cable", "PRD/PDD policy file", "speech or statement clearance"],
    "strategic-arms": ["summit memcon", "joint-statement clearance file", "NSC Russia arms-control file", "State cable"],
    "start-ii": ["telcon or memcon", "Senate ratification file", "Robert Bell arms-control file", "Duma/ABM implementation note"],
    "ctr-heu": ["leader memcon", "DOE/USEC/Minatom implementation file", "Nunn-Lugar certification record", "NSC Ukraine/Russia file"],
    nonproliferation: ["summit memcon", "State/ACDA nonproliferation file", "treaty or export-control clearance", "agency implementation record"],
    counterproliferation: ["DOD/NSC initiative paper", "PDD/NSC file", "JCS or IC threat-assessment record", "speech clearance"],
    regional: ["telcon or memcon", "PC/DC meeting record", "NSC regional policy file", "State cable"],
    "cbw-conventional": ["CWC/BWC treaty file", "ACDA/State ratification strategy", "NSC staff file", "Senate or legal implementation record"],
    "conventional-landmines": ["PDD/NSC policy file", "NSC landmine working paper", "DOD/State implementation record", "speech or fact-sheet clearance"]
  };
  return typesByChapter[statement.chapterId] || ["internal policy file", "clearance record", "meeting record", "agency implementation record"];
}

function buildDiaryCounterpartRow(diary) {
  const targetTerms = diaryCounterpartTargetTerms(diary);
  const relatedCandidates = potentialDocuments
    .filter((item) => item.chapterId === diary.chapterId && !isPublicCounterpartAnchor(item))
    .sort((a, b) => compareDiaryCounterpartMatches(diary, a, b))
    .slice(0, 4);
  const libraryPulls = libraryResearchPlan
    .filter((item) => item.chapterId === diary.chapterId)
    .sort((a, b) => compareDiaryCounterpartMatches(diary, a, b))
    .slice(0, 3);
  const publicAnchors = clintonPublicStatements
    .filter((item) => item.chapterId === diary.chapterId && dateDistanceDays(diary.date, item.date) <= 180)
    .sort((a, b) => compareDiaryCounterpartMatches(diary, a, b))
    .slice(0, 3);
  const likelyCounterpartRecordTypes = likelyDiaryCounterpartRecordTypes(diary);
  const requiredVerification = [
    "confirm diary date/time and page",
    "locate substantive counterpart record",
    "record author, recipient, or principals",
    "record classification markings and page range",
    "decide select, cite as context, or discard"
  ];
  const searchAction = diaryCounterpartSearchAction(diary, likelyCounterpartRecordTypes, relatedCandidates, libraryPulls);

  return {
    ...diary,
    targetTerms,
    relatedCandidates,
    libraryPulls,
    publicAnchors,
    likelyCounterpartRecordTypes,
    requiredVerification,
    searchAction
  };
}

function diaryCounterpartTargetTerms(diary) {
  const genericTerms = new Set([
    "bill",
    "clinton",
    "president",
    "telephone",
    "conference",
    "meeting",
    "meetings",
    "call",
    "calls",
    "foreign",
    "leader",
    "index"
  ]);
  const chapterTerms = {
    ctbt: ["NPT", "CTBT", "test ban"],
    "strategic-arms": ["Yeltsin", "strategic stability", "nuclear security"],
    "start-ii": ["START II", "Yeltsin", "Duma"],
    "ctr-heu": ["CTR", "HEU", "Ukraine", "Nunn-Lugar", "nuclear removal"],
    nonproliferation: ["NPT", "nonproliferation", "export control"],
    counterproliferation: ["counterproliferation", "WMD", "PDD-18"],
    regional: ["North Korea", "Agreed Framework", "Iran", "Iraq"],
    "cbw-conventional": ["CWC", "BWC", "chemical weapons", "biological weapons"],
    "conventional-landmines": ["landmines", "CCW", "arms transfer"]
  };
  return [
    ...new Set([
      ...(diary.participants || []).flatMap(participantTargetTerms),
      ...titleKeywords(diary.title),
      ...titleKeywords(diary.relevance),
      ...(chapterTerms[diary.chapterId] || [])
    ])
  ]
    .filter((term) => {
      const normalized = String(term).toLowerCase();
      return normalized && !genericTerms.has(normalized);
    })
    .slice(0, 12);
}

function participantTargetTerms(name = "") {
  const cleaned = String(name).replace(/[^A-Za-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned || /^bill clinton$/i.test(cleaned)) return [];
  const parts = cleaned.split(" ");
  const last = parts[parts.length - 1];
  return [...new Set([cleaned, last].filter((term) => term.length > 2 && !/^clinton$/i.test(term)))];
}

function likelyDiaryCounterpartRecordTypes(diary) {
  const text = [diary.eventType, diary.title, diary.relevance].join(" ").toLowerCase();
  const types = [];

  if (/call|telephone|conference/.test(text)) {
    types.push("telcon memorandum", "NSC call memorandum", "interpreter or translation record");
  }
  if (/meeting|summit|one-on-one|trilateral/.test(text)) {
    types.push("memorandum of conversation", "NSC meeting note", "briefing book or trip file");
  }
  if (/pc\/dc|north korea|haiti|crisis|options/.test(text)) {
    types.push("PC/DC minutes", "interagency options paper", "agency situation report");
  }

  const chapterTypes = {
    ctbt: ["NSC/ACDA negotiation file", "State or ACDA cable"],
    "strategic-arms": ["NSC Russia arms-control file", "joint-statement clearance record"],
    "start-ii": ["START II ratification strategy file", "Duma or ABM implementation note"],
    "ctr-heu": ["CTR or HEU implementation file", "Ukraine/Russia nuclear-removal file", "State cable"],
    nonproliferation: ["State/ACDA nonproliferation file", "export-control or treaty file"],
    counterproliferation: ["DOD/NSC initiative paper", "JCS or IC threat-assessment record"],
    regional: ["NSC regional policy file", "State cable", "PC/DC record"],
    "cbw-conventional": ["CWC/BWC treaty file", "ACDA/State implementation record"],
    "conventional-landmines": ["PDD/NSC policy file", "DOD/State implementation record"]
  };

  return [...new Set([...types, ...(chapterTypes[diary.chapterId] || ["internal policy file"])])];
}

function diaryCounterpartSearchAction(diary, recordTypes, relatedCandidates, libraryPulls) {
  const recordPhrase = recordTypes.slice(0, 2).join(" or ");
  const candidate = relatedCandidates[0] ? `screen "${relatedCandidates[0].title}"` : "";
  const pull = libraryPulls[0] ? `pull "${libraryPulls[0].title}"` : "";
  const followUps = [candidate, pull].filter(Boolean);
  const trail = followUps.length ? `${followUps.join("; ")}; ` : "";
  return `Locate ${recordPhrase} for "${diary.title}"; ${trail}capture the substantive counterpart before using the diary entry as sequence evidence.`;
}

function isPublicCounterpartAnchor(item) {
  const blob = [item.sourceType, item.sourceRepository, item.sourceCollection, item.category, item.level]
    .filter(Boolean)
    .join(" ");
  return /Public Papers|GovInfo|Archived White House|Congress|Senate|OSTI|NRC|FAS|Argonne|Department of Defense text|published primary/i.test(
    blob
  );
}

function compareDiaryCounterpartMatches(diary, a, b) {
  const terms = diaryCounterpartTargetTerms(diary);
  return (
    backtraceOverlapScore(terms, b) - backtraceOverlapScore(terms, a) ||
    dateDistanceDays(diary.date, a.date) - dateDistanceDays(diary.date, b.date) ||
    priorityRank(a.priority) - priorityRank(b.priority) ||
    libraryPriorityRank(a.priority) - libraryPriorityRank(b.priority) ||
    (a.title || "").localeCompare(b.title || "")
  );
}

function diaryBacktraceLabel(item) {
  return `${item.date || "date pending"}: ${item.title}`;
}

function compareBacktraceMatches(statement, a, b) {
  const terms = publicBacktraceTargetTerms(statement);
  return (
    backtraceOverlapScore(terms, b) - backtraceOverlapScore(terms, a) ||
    dateDistanceDays(statement.date, a.date) - dateDistanceDays(statement.date, b.date) ||
    priorityRank(a.priority) - priorityRank(b.priority) ||
    libraryPriorityRank(a.priority) - libraryPriorityRank(b.priority) ||
    (a.title || "").localeCompare(b.title || "")
  );
}

function backtraceOverlapScore(terms, row) {
  const strongText = [row.title, ...(row.targetTerms || []), ...(row.topics || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const contextText = [
    row.title,
    row.chapterTitle,
    row.visitGoal,
    row.whyItMatters,
    row.relevance,
    row.summary,
    ...(row.targetTerms || []),
    ...(row.topics || [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return terms.reduce((score, term) => {
    const normalized = String(term).toLowerCase();
    return score + (strongText.includes(normalized) ? 3 : 0) + (contextText.includes(normalized) ? 1 : 0);
  }, 0);
}

function classifySelectionReadiness(item) {
  const level = `${item.level || ""}`.toLowerCase();
  const type = `${item.sourceType || ""}`.toLowerCase();
  const repo = `${item.sourceRepository || ""}`.toLowerCase();
  const category = `${item.category || ""}`.toLowerCase();
  const sourceBlob = [level, type, repo, category, item.sourceCollection || ""].join(" ");

  if (
    /public papers|govinfo|archived white house|congress|senate|osti|dod|nrc|fas|argonne|nuclear regulatory commission|department of defense text/i.test(
      sourceBlob
    )
  ) {
    return {
      queue: "Date/control anchor",
      readiness: "Published or public primary-source locator",
      nextAction:
        "Use the date, public claim, or treaty-text endpoint; pair with internal policy, clearance, or implementation records before final selection.",
      requiredVerification: ["published citation", "policy claim to match", "internal counterpart", "chapter placement"]
    };
  }

  if (isDeclassifiedChronologyItem(item) && (item.digitalObjectUrl || repo.includes("clinton-russia") || type.includes("directive"))) {
    return {
      queue: "Close-read now",
      readiness: "Document-level or review-copy candidate",
      nextAction:
        "Close-read the text and record final citation fields before deciding whether it belongs in the chronology.",
      requiredVerification: [
        "owning repository",
        "folder path",
        "item date",
        "author/recipient",
        "classification markings",
        "pagination"
      ]
    };
  }

  if (type.includes("nara scout") || level.includes("fileunit")) {
    return {
      queue: "Resolve file unit",
      readiness: "File-unit lead",
      nextAction:
        "Open the Catalog or Scout trail, identify item boundaries, and replace the row with an item-level document candidate.",
      requiredVerification: [
        "box/folder path",
        "item title",
        "item date",
        "classification markings",
        "page range",
        "digital-object status"
      ]
    };
  }

  if (level.includes("packet") || type.includes("mdr") || repo.includes("clinton digital library")) {
    return {
      queue: "Screen packet",
      readiness: "MDR or release-packet lead",
      nextAction: "Screen the packet for discrete memoranda, cables, telcons, memcons, directives, or action papers.",
      requiredVerification: [
        "packet page range",
        "exact item title",
        "item date",
        "classification markings",
        "attachments",
        "final source note"
      ]
    };
  }

  if (level.includes("source-path") || level.includes("collection") || type.includes("finding aid") || category.includes("source path")) {
    return {
      queue: "Pull source path",
      readiness: "Collection, finding-aid, or source-path lead",
      nextAction: "Use as a call-slip or search-path lead until a specific item-level record is located.",
      requiredVerification: [
        "requestable identifier",
        "box/folder title",
        "item boundaries",
        "date span",
        "classification markings",
        "selection relevance"
      ]
    };
  }

  return {
    queue: "Hold for review",
    readiness: "Unclassified research lead",
    nextAction: "Keep as a locator until stronger source details or a document image are found.",
    requiredVerification: ["source class", "exact item", "date", "source note", "compiler relevance"]
  };
}

function readinessQueueRank(queue) {
  return {
    "Close-read now": 0,
    "Screen packet": 1,
    "Resolve file unit": 2,
    "Pull source path": 3,
    "Date/control anchor": 4,
    "Hold for review": 5
  }[queue] ?? 6;
}

function compareReadinessRows(a, b) {
  return (
    readinessQueueRank(a.readiness.queue) - readinessQueueRank(b.readiness.queue) ||
    chapterRank(a.chapterId) - chapterRank(b.chapterId) ||
    priorityRank(a.priority) - priorityRank(b.priority) ||
    chronologySortKey(a.date || "").localeCompare(chronologySortKey(b.date || "")) ||
    a.title.localeCompare(b.title)
  );
}

function compareNaraFileUnitRows(a, b) {
  return (
    priorityRank(a.priority) - priorityRank(b.priority) ||
    chapterRank(a.chapterId) - chapterRank(b.chapterId) ||
    requestIdentifierRank(a.naid || a.identifier) - requestIdentifierRank(b.naid || b.identifier) ||
    a.title.localeCompare(b.title)
  );
}

function compareNaraScoutQueryPackets(a, b) {
  return (
    naraScoutRunPriorityRank(a.runPriority) - naraScoutRunPriorityRank(b.runPriority) ||
    chapterRank(a.chapterId) - chapterRank(b.chapterId) ||
    requestIdentifierRank(a.scopeNaid) - requestIdentifierRank(b.scopeNaid) ||
    a.query.localeCompare(b.query)
  );
}

function naraScoutRunPriorityRank(priority) {
  return { Urgent: 0, High: 1, Medium: 2, Review: 3 }[priority] ?? 4;
}

function comparePublicBacktraceRows(a, b) {
  return (
    chapterRank(a.chapterId) - chapterRank(b.chapterId) ||
    chronologySortKey(a.date || "").localeCompare(chronologySortKey(b.date || "")) ||
    priorityRank(a.priority) - priorityRank(b.priority) ||
    a.title.localeCompare(b.title)
  );
}

function compareDiaryCounterpartRows(a, b) {
  return (
    chronologySortKey(a.date || "").localeCompare(chronologySortKey(b.date || "")) ||
    priorityRank(a.priority) - priorityRank(b.priority) ||
    chapterRank(a.chapterId) - chapterRank(b.chapterId) ||
    a.title.localeCompare(b.title)
  );
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

function buildChapterReadinessRow(chapter) {
  const dossier = chapterDossiers.find((item) => item.chapter.id === chapter.id) || buildChapterDossier(chapter);
  const readinessRows = selectionReadinessQueue.filter((item) => item.chapterId === chapter.id);
  const risks = chapterRiskControls(chapter);
  const closeReadNow = readinessRows.filter((item) => item.readiness.queue === "Close-read now");
  const screenPacket = readinessRows.filter((item) => item.readiness.queue === "Screen packet");
  const resolveFileUnit = readinessRows.filter((item) => item.readiness.queue === "Resolve file unit");
  const pullSourcePath = readinessRows.filter((item) => item.readiness.queue === "Pull source path");
  const dateControlAnchors = readinessRows.filter((item) => item.readiness.queue === "Date/control anchor");
  const publicBacktraces = publicStatementBacktraceQueue.filter((item) => item.chapterId === chapter.id);
  const diaryCounterparts = dailyDiaryCounterpartQueue.filter((item) => item.chapterId === chapter.id);
  const aPriorityPulls = dossier.pulls.filter((item) => item.priority === "A");
  const criticalRisks = risks.filter((gap) => gap.priority === "Critical");
  const highRisks = risks.filter((gap) => gap.priority === "High");
  const topRisk = preferredChapterRisk(chapter, risks);
  const firstPull = aPriorityPulls[0] || dossier.pulls[0] || null;
  const dateControls = [...dossier.diaries.filter((item) => item.priority === "High"), ...dossier.statements]
    .sort(compareDossierRows)
    .slice(0, 4);
  const blockers = chapterReadinessBlockers({
    closeReadNow,
    screenPacket,
    resolveFileUnit,
    pullSourcePath,
    dateControlAnchors,
    publicBacktraces,
    diaryCounterparts,
    criticalRisks,
    highRisks,
    aPriorityPulls,
    dossier
  });
  const readinessScore = chapterReadinessScore({
    closeReadNow,
    chronology: dossier.chronology,
    screenPacket,
    resolveFileUnit,
    pullSourcePath,
    dateControlAnchors,
    publicBacktraces,
    diaryCounterparts,
    aPriorityPulls,
    criticalRisks,
    highRisks
  });
  const readinessBand = chapterReadinessBand(readinessScore);
  const compilerFocus = chapterCompilerFocus({
    readinessScore,
    closeReadNow,
    screenPacket,
    resolveFileUnit,
    pullSourcePath,
    dateControlAnchors,
    publicBacktraces,
    diaryCounterparts,
    aPriorityPulls,
    dossier
  });
  const nextAction =
    topRisk?.nextActions?.[0] ||
    firstPull?.onsiteActions?.[0] ||
    closeReadNow[0]?.readiness?.nextAction ||
    dossier.nextMove;

  return {
    chapter,
    readinessBand,
    readinessScore,
    compilerFocus,
    nextAction,
    topRisk: topRisk ? `${topRisk.priority}: ${topRisk.title}` : "",
    candidateLeads: dossier.documents.length,
    declassifiedChronologyLeads: dossier.chronology.length,
    closeReadNowCount: closeReadNow.length,
    screenPacketCount: screenPacket.length,
    resolveFileUnitCount: resolveFileUnit.length,
    pullSourcePathCount: pullSourcePath.length,
    dateControlAnchorCount: dateControlAnchors.length,
    clintonLibraryPullCount: dossier.pulls.length,
    aPriorityPullCount: aPriorityPulls.length,
    dailyDiaryCounterpartCount: diaryCounterparts.length,
    publicStatementBacktraceCount: publicBacktraces.length,
    activeRiskCount: risks.length,
    criticalRiskCount: criticalRisks.length,
    highRiskCount: highRisks.length,
    blockers,
    firstReads: dossier.firstReads,
    firstPull,
    dateControls,
    riskControls: risks.slice(0, 4),
    notes: "Readiness score is a triage aid; final FRUS selection still requires item-level source notes, markings, pagination, and declassification status."
  };
}

function chapterRiskControls(chapter) {
  const specificRisks = compilerGaps.filter((gap) => gapMatchesChapter(gap, chapter));
  const globalRisks = compilerGaps.filter((gap) =>
    isGlobalRisk(gap)
  );
  return uniqueDossierRows([...specificRisks, ...globalRisks]).sort(compareGapRows);
}

function preferredChapterRisk(chapter, risks) {
  const specific = risks.filter((gap) => gapMatchesChapter(gap, chapter) && !isGlobalRisk(gap)).sort(compareGapRows);
  return specific[0] || risks.slice().sort(compareGapRows)[0];
}

function isGlobalRisk(gap) {
  return ["gap-source-base-diversity", "gap-nara-file-unit-quality", "gap-public-statements-as-locators"].includes(gap.id);
}

function chapterReadinessScore(parts) {
  const positive =
    Math.min(parts.closeReadNow.length * 9, 27) +
    Math.min(parts.chronology.length * 7, 21) +
    Math.min(parts.aPriorityPulls.length * 7, 21) +
    Math.min(parts.diaryCounterparts.length * 2, 10) +
    Math.min(parts.publicBacktraces.length * 2, 8);
  const negative =
    Math.min(parts.resolveFileUnit.length * 3, 18) +
    Math.min(parts.pullSourcePath.length * 2, 12) +
    Math.min(parts.dateControlAnchors.length, 10) +
    parts.criticalRisks.length * 8 +
    parts.highRisks.length * 4;
  return clamp(20 + positive - negative, 0, 100);
}

function chapterReadinessBand(score) {
  if (score >= 70) return "Close-read launch ready";
  if (score >= 50) return "Archive-pull ready";
  if (score >= 30) return "Item-boundary work first";
  return "Discovery first";
}

function chapterCompilerFocus(parts) {
  if (parts.closeReadNow.length >= 2 && parts.resolveFileUnit.length <= 3) return "Close-read available texts";
  if (parts.aPriorityPulls.length) return "Pull priority Clinton Library folders";
  if (parts.resolveFileUnit.length || parts.screenPacket.length) return "Resolve packets and file units";
  if (parts.diaryCounterparts.length || parts.publicBacktraces.length || parts.dateControlAnchors.length) {
    return "Backtrace date and public controls";
  }
  if (parts.pullSourcePath.length) return "Turn source paths into item leads";
  return "Add stronger primary-source leads";
}

function chapterReadinessBlockers(parts) {
  const blockers = [];
  if (parts.criticalRisks.length) blockers.push(`${parts.criticalRisks.length} critical risk controls open`);
  if (parts.resolveFileUnit.length) blockers.push(`Resolve ${parts.resolveFileUnit.length} file-unit leads`);
  if (parts.screenPacket.length) blockers.push(`Screen ${parts.screenPacket.length} packet leads`);
  if (parts.pullSourcePath.length) blockers.push(`Convert ${parts.pullSourcePath.length} source paths into item leads`);
  if (!parts.closeReadNow.length && !parts.dossier.chronology.length) blockers.push("No declassified close-read lead staged");
  if (parts.diaryCounterparts.length) blockers.push(`Find counterparts for ${parts.diaryCounterparts.length} diary controls`);
  if (parts.publicBacktraces.length) blockers.push(`Backtrace ${parts.publicBacktraces.length} public statements`);
  if (!parts.aPriorityPulls.length && parts.dossier.pulls.length) blockers.push("No A-priority Clinton Library pull in chapter");
  return blockers.slice(0, 5);
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

function uniqueSorted(values) {
  return [...new Set(values.map(normalizeCell).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function sortChapters(chapters) {
  return chapters
    .filter(Boolean)
    .sort((a, b) => chapterTitleRank(a) - chapterTitleRank(b) || a.localeCompare(b));
}

function appendBulletList(lines, rows, mapper, emptyText) {
  if (!rows.length) {
    lines.push(`- ${emptyText}`);
    return;
  }
  for (const row of rows) lines.push(`- ${mapper(row)}`);
}

function mdCell(value) {
  return normalizeCell(value).replace(/\|/g, "\\|");
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

function normalizeIdentifier(value) {
  return normalizeCell(value);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function compareByDateThenTitle(a, b) {
  return `${a.date || "9999"}`.localeCompare(`${b.date || "9999"}`) || a.title.localeCompare(b.title);
}

function dateDistanceDays(a, b) {
  const aTime = Date.parse(a || "");
  const bTime = Date.parse(b || "");
  if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 999999;
  return Math.abs(aTime - bTime) / 86400000;
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

function compareLibraryRequestRows(a, b) {
  return (
    libraryPriorityRank(a.priority) - libraryPriorityRank(b.priority) ||
    a.clusterOrder - b.clusterOrder ||
    a.identifierOrder - b.identifierOrder ||
    requestIdentifierRank(a.rawIdentifier) - requestIdentifierRank(b.rawIdentifier)
  );
}

function compareLibraryPacketRows(a, b) {
  return (
    libraryVisitDayRank(a.visitDay) - libraryVisitDayRank(b.visitDay) ||
    libraryPriorityRank(a.priority) - libraryPriorityRank(b.priority) ||
    requestIdentifierRank(a.rawIdentifier || a.requestIdentifier) - requestIdentifierRank(b.rawIdentifier || b.requestIdentifier) ||
    (a.requestIdentifier || "").localeCompare(b.requestIdentifier || "")
  );
}

function requestIdentifierRank(value) {
  const match = String(value || "").match(/\d+/);
  return match ? Number(match[0]) : 999999;
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

function chapterTitleRank(title) {
  const chapter = chapterDefinitions.find((item) => item.title === title);
  return chapter ? chapterRank(chapter.id) : 99;
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
