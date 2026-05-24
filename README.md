# Clinton Arms Control and Nonproliferation, 1993-1996

A static GitHub Pages source map for the planned *Foreign Relations of the
United States, 1993-2000, Volume VII, Arms Control and Nonproliferation,
1993-1996*.

The site is intentionally source-first because the Office of the Historian
currently lists the volume as planned rather than published. It gathers:

- official FRUS status and volume-boundary links
- Clinton Library guide entries for the relevant NSC offices
- NARA Catalog collection and series leads
- Clinton Library finding aids for NPT/CTBT and speechwriting/source context
- GovInfo and archived White House public milestones from 1993-1996
- NARA Scout candidate records and Public Papers anchors mapped to each chapter
- source-gap leads from Congress.gov, Clinton Digital Library, DOD, NRC, archived White House records, and the companion Clinton-Russia page
- structured compiler-risk gaps with pull lists and verification actions
- a Clinton Library on-site research plan built from the local `2013-0185-M` folder-title PDFs
- a dedicated Clinton Public Papers statement index for arms-control and nonproliferation items

## Files

- `index.html`: page structure and source sections
- `styles.css`: responsive visual system
- `app.js`: data model, filters, chapter cards, source leads, public statements, and milestones
- `data/potential-documents.js`: generated potential-document data loaded by the page
- `data/source-gap-leads.js`: manual source-gap leads added after compiler-risk review
- `data/compiler-gaps.js`: structured gap analysis rendered on the page
- `data/clinton-library-research-plan.js`: on-site Clinton Library pull plan from `2013-0185-M` folder-title lists
- `data/clinton-public-statements.js`: generated Clinton Public Papers statement data
- `reports/nara-scout-potential-documents.md`: NARA Scout query summary and selected candidates
- `reports/compiler-gap-analysis.md`: source-gap treatment report and next pull list
- `reports/clinton-library-research-plan.md`: visit-priority report for Clinton Library research time
- `scripts/harvest-nara-scout-documents.js`: repeatable NARA Scout/Public Papers harvest script
- `assets/arms-control-source-map.svg`: first-pass source map visual

Regenerate the potential-document list with:

```bash
NARA_SCOUT_API_KEY=... node scripts/harvest-nara-scout-documents.js --limit=18 --per-chapter=12
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

## Compiler-risk pass

The gap dashboard now tracks ten open or partly addressed compiler risks:
source-base diversity, NARA file-unit quality, START II ratification, NPT/CTBT
negotiating records, CTR/HEU implementation, counterproliferation provenance,
CBW/CWC/BWC depth, regional balance, conventional arms/landmines, and public
statements as locators. The added source-gap leads address these weak areas
without pretending every packet or source path is already an item-level FRUS
candidate.

## Clinton Library visit plan

The site now incorporates the local `2013-0185-M_Part1.pdf` through
`2013-0185-M_Part4.pdf` folder-title lists as an on-site research plan. The
plan prioritizes PRD-19/CTBT, NPT briefing books, START II/Ukraine/Nunn-Lugar,
DOE safeguards/HEU, CWC/BWC/Russian BW-CW, North Korea PC/DC files,
Iran/Iraq/UNSCOM, China technology-transfer/missile-proliferation files,
counterproliferation intelligence files, landmines, and Legal Advisor treaty
folders. Speechwriting folders are staged as public-statement backtrace
material after policy files are reviewed.
