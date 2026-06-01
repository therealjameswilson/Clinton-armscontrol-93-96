# Clinton Arms Control and Nonproliferation, 1993-1996

A static GitHub Pages source map for the planned *Foreign Relations of the
United States, 1993-2000, Volume VII, Arms Control and Nonproliferation,
1993-1996*.

The site is intentionally source-first because the Office of the Historian
currently lists the volume as planned rather than published. It gathers:

- official FRUS status and volume-boundary links
- an opening chronology of dated released or declassified document leads
- a compiler workbench that separates close-read texts, packet leads, on-site pulls, and source risks
- CSV working tables for sorting potential documents, chronology items, archive pulls, diary follow-up, public statements, and source risks
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
- `reports/chapter-dossiers.md`: generated per-chapter launch packet for first reads, pulls, date controls, and risks
- `reports/compiler-gap-analysis.md`: source-gap treatment report and next pull list
- `reports/clinton-library-research-plan.md`: visit-priority report for Clinton Library research time
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

## Chapter dossiers

The fourth compiler-facing section is a chapter dossier board. It gives each
provisional chapter one card with first-read leads, packet or Clinton Library
pulls, Presidential Daily Diary/Public Papers date controls, source risks, and a
single next move. The matching `exports/chapter-dossiers.csv` and
`reports/chapter-dossiers.md` files are regenerated from the same staged data as
the page.

## Compiler working tables

The third section links generated CSV packets for offline use: the full
potential-document triage sheet, the declassified chronology, Clinton Library
call-slip clusters, Presidential Daily Diary follow-up, the risk register,
Clinton public statements, and chapter dossiers. The tables are regenerated from
the same staged data files as the page, so a compiler can sort and annotate them
without creating a separate hand-maintained index.

## Compiler-risk pass

The gap dashboard now tracks ten open or partly addressed compiler risks:
source-base diversity, NARA file-unit quality, START II ratification, NPT/CTBT
negotiating records, CTR/HEU implementation, counterproliferation provenance,
CBW/CWC/BWC depth, regional balance, conventional arms/landmines, and public
statements as locators. The added source-gap leads address these weak areas
without pretending every packet or source path is already an item-level FRUS
candidate.

## Source-note pass

The rendered source notes now follow the FRUS pattern: `Source:` plus
repository, collection or identifier, title trail, and a clear status note.
Existing published-source notes are preserved; generic NARA Scout recovery
notes and prose summaries are converted on the page into source notes that
flag file-unit, packet, collection, and source-path leads as pending item-level
verification.

## Presidential Daily Diary pass

The page now includes a dedicated Diary section. It distinguishes hardcopy
2010-0083-F hits from the Clinton Library foreign-leader call/meeting index,
and marks each reference as a chronology or pull-list anchor rather than a
finished document candidate. High-value entries include Yeltsin, Kravchuk,
Shushkevich, Nazarbayev, Kuchma, and Kim Young-sam calls or meetings that map
to START II, CTR/HEU, Ukraine denuclearization, nuclear-materials security,
and North Korea proliferation files.

## Clinton Library visit plan

The site now incorporates the local `2013-0185-M_Part1.pdf` through
`2013-0185-M_Part4.pdf` folder-title lists as an on-site research plan. The
plan prioritizes PRD-19/CTBT, NPT briefing books, START II/Ukraine/Nunn-Lugar,
DOE safeguards/HEU, CWC/BWC/Russian BW-CW, North Korea PC/DC files,
Iran/Iraq/UNSCOM, China technology-transfer/missile-proliferation files,
counterproliferation intelligence files, landmines, and Legal Advisor treaty
folders. Speechwriting folders are staged as public-statement backtrace
material after policy files are reviewed.
