# Clinton Arms Control and Nonproliferation, 1993-1996

A static GitHub Pages source map for the planned *Foreign Relations of the
United States, 1993-2000, Volume VII, Arms Control and Nonproliferation,
1993-1996*.

The site is intentionally source-first because the Office of the Historian
currently lists the volume as planned rather than published. It gathers:

- official FRUS status and volume-boundary links
- an opening chronology of dated released or declassified document leads
- a compiler workbench that separates close-read texts, packet leads, on-site pulls, and source risks
- a selection-readiness queue that assigns every potential-document lead to an immediate verification action
- a FRUS selection capture worksheet for final document decisions, citation fields, and source-note completion
- a NARA file-unit resolver that isolates Scout hits needing item-boundary verification
- a public-statement backtrace queue that pairs Clinton statements with internal-counterpart search paths
- a Daily Diary counterpart queue that converts schedule evidence into substantive-record searches
- a chapter readiness scorecard that ranks launch status, blockers, and next actions
- CSV working tables for sorting potential documents, chronology items, archive pulls, OA/ID requests, diary follow-up, public statements, and source risks
- chapter dossiers that bundle first reads, packet screens, Clinton Library pulls, diary follow-up, public anchors, and risk controls by chapter
- Clinton Library guide entries for the relevant NSC offices
- NARA Catalog collection and series leads
- Clinton Library finding aids for NPT/CTBT and speechwriting/source context
- GovInfo and archived White House public milestones from 1993-1996
- NARA Scout candidate records and Public Papers anchors mapped to each chapter
- source-gap leads from Congress.gov, Clinton Digital Library, DOD, NRC, archived White House records, and the companion Clinton-Russia page
- Presidential Daily Diary call and meeting references from the 2010-0083-F hardcopy scans and Clinton Library foreign-leader index
- structured compiler-risk gaps with pull lists and verification actions
- a Clinton Library on-site research plan built from the local `2013-0185-M` folder-title PDFs
- an exploded Clinton Library OA/ID request queue with item-level capture columns for on-site review
- a dedicated Clinton Public Papers statement index for arms-control and nonproliferation items

## Files

- `index.html`: page structure and source sections
- `styles.css`: responsive visual system
- `app.js`: data model, filters, chapter cards, source leads, public statements, and milestones
- `compiler-workbench.js`: second-section decision board for close reads, packet screening, pulls, and risks
- `exports/*.csv`: generated compiler working tables for archive and source-note workflows
- `data/potential-documents.js`: generated potential-document data loaded by the page
- `data/source-gap-leads.js`: manual source-gap leads added after compiler-risk review
- `data/compiler-gaps.js`: structured gap analysis rendered on the page
- `data/clinton-library-research-plan.js`: on-site Clinton Library pull plan from `2013-0185-M` folder-title lists
- `data/presidential-daily-diary-references.js`: calls and meetings to check against telcon, memcon, PC/DC, and NSC records
- `data/clinton-public-statements.js`: generated Clinton Public Papers statement data
- `reports/nara-scout-potential-documents.md`: NARA Scout query summary and selected candidates
- `reports/declassified-document-chronology.md`: dated released/declassified leads promoted to the first page section
- `reports/compiler-working-tables.md`: explanation of the CSV exports and suggested compiler workflow
- `reports/selection-readiness-queue.md`: generated readiness gates and verification fields for every staged document lead
- `reports/frus-selection-capture-worksheet.md`: generated capture guide for final selection and source-note fields
- `reports/nara-file-unit-resolution-queue.md`: generated resolver for NARA Scout/file-unit leads
- `reports/public-statement-backtrace-queue.md`: generated queue for pairing public statements with internal records
- `reports/daily-diary-counterpart-queue.md`: generated queue for finding substantive records behind Diary entries
- `reports/chapter-dossiers.md`: generated per-chapter launch packet for first reads, pulls, date controls, and risks
- `reports/chapter-readiness-scorecard.md`: generated per-chapter triage scorecard for launch status and blockers
- `reports/compiler-gap-analysis.md`: source-gap treatment report and next pull list
- `reports/clinton-library-research-plan.md`: visit-priority report for Clinton Library research time
- `reports/clinton-library-oaid-request-queue.md`: generated request-slip queue from the Clinton Library OA/ID clusters
- `reports/frus-source-note-audit.md`: check of source-note formatting against FRUS conventions
- `reports/presidential-daily-diary-references.md`: diary search method and calls/meetings added to the page
- `scripts/harvest-nara-scout-documents.js`: repeatable NARA Scout/Public Papers harvest script
- `scripts/build-compiler-working-tables.js`: repeatable export builder for compiler CSV packets
- `assets/arms-control-source-map.svg`: first-pass source map visual

Regenerate the potential-document list with:

```bash
NARA_SCOUT_API_KEY=... node scripts/harvest-nara-scout-documents.js --limit=18 --per-chapter=12
```

Regenerate the compiler working tables with:

```bash
node scripts/build-compiler-working-tables.js
```

## Primary anchors

- <https://history.state.gov/historicaldocuments/frus1993-00v07>
- <https://history.state.gov/historicaldocuments/clinton>
- <https://history.state.gov/historicaldocuments/status-of-the-series>
- <https://www.clintonlibrary.gov/sites/default/files/documents/research/clinton-library-guide-holdings-2020-no-sf-cf.pdf>
- <https://catalog.archives.gov/id/7386504>
- <https://catalog.archives.gov/id/7388773>

## Featured chapter

The site includes dedicated compiler chapters for NPT and CTBT, START II
ratification, Cooperative Threat Reduction and the HEU Agreement,
Counterproliferation, and chemical and biological weapons. The NPT/CTBT
chapter is keyed to the 1995 NPT extension, the 1993 nuclear testing review,
and the CTBT negotiation/signature sequence. The START II chapter is keyed to
the January 26, 1996 Public Papers statement and the NSC Defense Policy and
Arms Control source trail. The CTR/HEU chapter covers 1995-1996
nuclear-materials security, Nunn-Lugar implementation, Ukraine
denuclearization, and U.S.-Russian HEU transparency measures. The
Counterproliferation chapter tracks PDD/NSC-18, the Defense
Counterproliferation Initiative, WMD military planning, theater missile defense,
biological defense, and DOD program-review records. The CBW chapter is keyed
to CWC, BWC, Australia Group, and CBW reporting records from 1993-1996.

The potential-document table is populated from NARA Scout searches over the
Clinton NSC arms-control, nonproliferation, Russia/Ukraine/Eurasia,
speechwriting, and records-management scopes, then supplemented with public
primary-source anchors from neighboring Clinton research pages. A second
source-gap pass adds congressional treaty records, Clinton Digital Library MDR
packets, DOD/NRC implementation sources, and companion released memcons/telcons
to correct the largest compiler-risk gaps. The Clinton Public Statements
section isolates the GovInfo/Public Papers records so they can be used as a
chapter-by-chapter public chronology without mixing them into archival
file-unit candidates.

## Declassified-document chronology

The first section of the page is now a dated chronology of released or
declassified archival leads. It excludes public statements, broad finding aids,
diary-only references, and undated Scout hits so the opening read-through starts
with document candidates that can plausibly become FRUS-style selections after
item-level verification.

## Compiler workbench

The second section is a practical decision board. It tells the compiler which
chronology items are ready for close reading, which MDR packets or folder leads
need item screening, which Clinton Library folders to pull first, and which
source-risk controls must stay visible before a sequence is treated as
compiler-ready.

## Selection readiness

The third compiler-facing section normalizes every potential-document lead into
a readiness queue: close-read now, screen packet, resolve file unit, pull source
path, date/control anchor, or hold for review. The matching
`exports/selection-readiness-queue.csv` gives the next action and verification
fields for each row so broad locators do not get mistaken for finished document
candidates.

## Chapter dossiers

The chapter dossier board gives each
provisional chapter one card with first-read leads, packet or Clinton Library
pulls, Presidential Daily Diary/Public Papers date controls, source risks, and a
single next move. The matching `exports/chapter-dossiers.csv` and
`reports/chapter-dossiers.md` files are regenerated from the same staged data as
the page.

The generated `exports/chapter-readiness-scorecard.csv` sits one level above
the dossiers. It ranks the nine compiler chapters by close-read material,
packet and file-unit blockers, source-path work, A-priority Clinton Library
pulls, Daily Diary counterparts, public-statement backtraces, active risks, and
the next chapter-specific action. The score is a triage aid, not a claim that a
chapter is ready for final FRUS selection.

## Compiler working tables

The tables section links generated CSV packets for offline use: the full
potential-document triage sheet, the selection-readiness queue, the FRUS
selection capture worksheet, the NARA file-unit resolver, the declassified
chronology, Clinton Library call-slip clusters, the exploded Clinton Library
OA/ID request queue, Presidential Daily Diary follow-up, the Daily Diary
counterpart queue, the risk register, Clinton public statements, the
public-statement backtrace queue, the chapter readiness scorecard, and chapter
dossiers. The tables are regenerated from the same staged data files as the
page, so a compiler can sort and annotate them without creating a separate
hand-maintained index.

The generated `exports/frus-selection-capture-worksheet.csv` is the compilation
handoff sheet. It preserves the current lead, readiness queue, action, required
verification, and generated source note, then adds blank fields for proposed
document number, selection decision, final title/date, document type,
author/recipient, repository path, markings, pagination, attachments,
declassification notes, final source note, and compiler notes.

The generated `exports/nara-file-unit-resolution-queue.csv` pulls the 42 NARA
Scout/file-unit rows out of the general candidate list. It gives the compiler
NAID, Catalog URL, chapter, current source note, first action, and blank fields
for child item URL, box/folder path, item title/date, author/recipient,
classification markings, page range, digital-object status, replacement
candidate, disposition, final source note, and compiler notes.

The generated `exports/public-statement-backtrace-queue.csv` keeps the 15
Clinton Public Papers anchors from overframing the volume. Each row lists likely
internal record types, nearest diary controls, Clinton Library pull clusters,
related candidate leads, target terms, and blank fields for the internal
counterpart that should carry the substantive FRUS sequence.

## Compiler-risk pass

The gap dashboard now tracks ten open or partly addressed compiler risks:
source-base diversity, NARA file-unit quality, START II ratification, NPT/CTBT
negotiating records, CTR/HEU implementation, counterproliferation provenance,
CBW/CWC/BWC depth, regional balance, conventional arms/landmines, and public
statements as locators. The added source-gap leads address these weak areas
without pretending every packet or source path is already an item-level FRUS
candidate. The NARA file-unit resolver now turns the largest remaining open
risk into a sortable item-boundary worksheet.

## Source-note pass

The rendered source notes now follow the FRUS pattern: `Source:` plus
repository, collection or identifier, title trail, and a clear status note.
Existing published-source notes are preserved; generic NARA Scout recovery
notes and prose summaries are converted on the page into source notes that
flag file-unit, packet, collection, and source-path leads as pending item-level
verification. The selection capture worksheet gives those generated notes a
place to become final FRUS source notes only after the compiler verifies the
item-level fields, and the public-statement backtrace queue keeps published
statements paired with internal records before final sequencing.

## Presidential Daily Diary pass

The page now includes a dedicated Diary section. It distinguishes hardcopy
2010-0083-F hits from the Clinton Library foreign-leader call/meeting index,
and marks each reference as a chronology or pull-list anchor rather than a
finished document candidate. High-value entries include Yeltsin, Kravchuk,
Shushkevich, Nazarbayev, Kuchma, and Kim Young-sam calls or meetings that map
to START II, CTR/HEU, Ukraine denuclearization, nuclear-materials security,
and North Korea proliferation files.

The generated `exports/daily-diary-counterpart-queue.csv` takes the next
compiler step. It keeps the Diary or foreign-leader index source note as the
occurrence control, then adds likely counterpart record types, related
candidate leads, Clinton Library pull clusters, public anchors, target terms,
and blank fields for the telcon, memcon, PC/DC minutes, NSC note, cable, agency
paper, page range, markings, disposition, and final source note.

## Clinton Library visit plan

The site now incorporates the local `2013-0185-M_Part1.pdf` through
`2013-0185-M_Part4.pdf` folder-title lists as an on-site research plan. The
plan prioritizes PRD-19/CTBT, NPT briefing books, START II/Ukraine/Nunn-Lugar,
DOE safeguards/HEU, CWC/BWC/Russian BW-CW, North Korea PC/DC files,
Iran/Iraq/UNSCOM, China technology-transfer/missile-proliferation files,
counterproliferation intelligence files, landmines, and Legal Advisor treaty
folders. Speechwriting folders are staged as public-statement backtrace
material after policy files are reviewed.

The generated `exports/clinton-library-oaid-request-queue.csv` explodes those
clusters into one row per staged OA/ID or folder-list control reference. Its
blank capture columns are meant for the archive table: exact folder title, box
or container, item title, date, sender/recipient, document type,
classification markings, page range, attachments, withdrawal/redaction notes,
volume boundary, disposition, and final source note.
