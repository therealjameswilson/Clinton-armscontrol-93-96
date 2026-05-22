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
- a dedicated Clinton Public Papers statement index for arms-control and nonproliferation items

## Files

- `index.html`: page structure and source sections
- `styles.css`: responsive visual system
- `app.js`: data model, filters, chapter cards, source leads, public statements, and milestones
- `data/potential-documents.js`: generated potential-document data loaded by the page
- `data/clinton-public-statements.js`: generated Clinton Public Papers statement data
- `reports/nara-scout-potential-documents.md`: NARA Scout query summary and selected candidates
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
primary-source anchors from neighboring Clinton research pages. The Clinton
Public Statements section isolates the GovInfo/Public Papers records so they
can be used as a chapter-by-chapter public chronology without mixing them into
archival file-unit candidates.
