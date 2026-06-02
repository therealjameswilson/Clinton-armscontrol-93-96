# Compiler Requirements Audit

Generated from the current page scaffolding, chapter dossiers, working tables, Clinton Library queues, Daily Diary rows, public-statement backtrace queue, NARA Scout packet queue, compiler-risk register, and compiler-risk closure matrix.

## Use Rule

Use this as the handoff proof map. It shows which explicit requirements are already represented in public artifacts and which requirements are deliberately controlled open work rather than hidden gaps. It does not claim that final FRUS document selection is complete.

## Audit Counts

- Requirement rows: 15
- Proved in current artifacts: 4
- Ready for compiler use: 9
- Controlled open work: 2
- Potential-document leads: 95
- Declassified chronology rows: 13
- Compiler action rows: 198
- Clinton Library run-sheet rows: 83

## Requirement Evidence

| Area | Requirement | Status | Evidence | Primary artifact | Next action |
| --- | --- | --- | --- | --- | --- |
| Public page and official frame | Create a public page for FRUS 1993-2000, Volume VII, Arms Control and Nonproliferation, 1993-1996. | Proved in current artifacts | index.html renders the compiler page, README records the official FRUS volume anchor, and the page keeps the planned-volume status visible. | index.html | Re-check the official Office of the Historian status before final publication or citation freeze. |
| Declassified chronology | Prioritize the chronology of declassified documents as the first section of the page. | Proved in current artifacts | The first <main> section is #chronology and the declassified chronology contains 13 dated released/declassified leads. | exports/declassified-chronology.csv | Close-read visible texts first, then fill the final selection capture worksheet for any row promoted into the FRUS sequence. |
| Chapter arrangement | Include the requested compiler chapters and keep them separated for selection work. | Proved in current artifacts | Chapter definitions include 9 chapters, including NPT and CTBT, START II Ratification, Cooperative Threat Reduction and HEU Agreement, Counterproliferation, Chemical and Biological Weapons. | exports/chapter-dossiers.csv | Use the readiness scorecard before deciding whether a chapter should start with close reading, archive pulls, or discovery. |
| NPT and CTBT | Include a chapter on NPT and CTBT. | Ready for compiler use | Chapter 1 has 11 candidate leads, 0 declassified chronology leads, 2 Clinton Library pull clusters, 1 diary controls, 4 public anchors, and 21 action-queue rows. | exports/chapter-dossiers.csv | Day 1 / Packet 20: request OA/ID 1406; Flag any Egypt, South Africa, Ukraine, NAM, Article VI, or negative-security-assurance material for item-level selection. |
| START II Ratification | Include a chapter on START II ratification. | Ready for compiler use | Chapter 3 has 7 candidate leads, 2 declassified chronology leads, 1 Clinton Library pull clusters, 1 diary controls, 1 public anchors, and 10 action-queue rows. | exports/chapter-dossiers.csv | Close-read "Telephone call with President Boris Yeltsin of Russia, January 26, 1996" and fill final document-description fields before selection. |
| Cooperative Threat Reduction and HEU Agreement | Include a chapter on Cooperative Threat Reduction and the HEU Agreement covering 1995-1996. | Ready for compiler use | Chapter 4 has 11 candidate leads, 3 declassified chronology leads, 1 Clinton Library pull clusters, 10 diary controls, 4 public anchors, and 23 action-queue rows. | exports/chapter-dossiers.csv | Close-read "Meeting with Russian President Boris Yeltsin on Security Issues" and fill final document-description fields before selection. |
| Counterproliferation | Create a chapter on Counterproliferation. | Ready for compiler use | Chapter 6 has 18 candidate leads, 0 declassified chronology leads, 1 Clinton Library pull clusters, 0 diary controls, 1 public anchors, and 21 action-queue rows. | exports/chapter-dossiers.csv | Day 1 / Packet 33: request OA/ID 2483; Pull OA/ID 1394 North Korea PC/DC notes from November 1993 through October 1994, plus May 28, 1996. |
| Chemical and Biological Weapons | Include a chapter on Chemical and Biological Weapons. | Ready for compiler use | Chapter 8 has 10 candidate leads, 1 declassified chronology leads, 1 Clinton Library pull clusters, 0 diary controls, 0 public anchors, and 14 action-queue rows. | exports/chapter-dossiers.csv | Close-read "Second Clinton/Yeltsin One-on-One" and fill final document-description fields before selection. |
| NARA Scout and primary-source leads | Populate chapters with potential documents drawn from primary sources and NARA Scout discovery. | Controlled open work | 95 potential-document leads are staged; 483 Scout query packets make reruns reproducible; 42 NARA/file-unit rows now have batch order, Scout pressure, stop rules, and promotion gates. | exports/nara-item-boundary-workbench.csv | Work the NARA item-boundary workbench in batch order, then rerun the linked Scout packets only when Catalog checks do not expose item boundaries. |
| Clinton public statements | Incorporate Clinton public statements without letting them overframe archival selection. | Ready for compiler use | 15 Public Papers anchors are staged and 15 backtrace rows pair them with internal-counterpart searches. | exports/clinton-public-statements.csv | Use public statements as date/public-policy locators until a memcon, telcon, clearance file, cable, or policy paper is captured. |
| Clinton Library research | Incorporate Clinton Library finding aids and maximize time at the Clinton Library. | Ready for compiler use | 83 run-sheet rows, 83 de-duplicated request packets, and 99 OA/ID queue rows convert the local finding-aid PDFs into a reading-room workflow. | exports/clinton-library-visit-run-sheet.csv | Use the run sheet at the archive table, fill pull status and best-item fields, and promote only item-level records into the capture worksheet. |
| Presidential Daily Diary | Search the Presidential Daily Diary and include pertinent calls or meetings. | Proved in current artifacts | 22 diary or foreign-leader-index occurrence controls are staged and 22 counterpart-search rows prevent schedule evidence from being mistaken for substantive records. | exports/presidential-daily-diary-follow-up.csv | Locate the substantive telcon, memcon, PC/DC minutes, NSC note, cable, or agency file for each high-value occurrence. |
| FRUS source notes | Check source notes against FRUS-style expectations. | Ready for compiler use | 95 of 95 potential-document leads render a Source: note; capture worksheets preserve current notes and add final source-note fields. | reports/frus-source-note-audit.md | Replace generated pending notes with final repository, collection, folder, markings, pagination, and declassification details only after item-level verification. |
| Compiler risks and gaps | Assume compiler risk, identify gaps, and address them with controlled workflows. | Controlled open work | 10 structured risks now have 10 closure-matrix rows, linked action ranks, evidence gates, and residual-limitation fields. | exports/compiler-risk-closure-matrix.csv | Work the risk closure matrix row by row, closing risks only when item-level evidence or explicit editorial limitation supports closure. |
| Compiler handoff | Make the project easy for a FRUS compiler to pick up and use. | Ready for compiler use | 198 ordered actions, 9 chapter dossiers, 9 readiness rows, and this requirements audit provide the handoff path. | exports/compiler-requirements-audit.csv | Start each session with this audit, then the action queue, then the chapter dossier for the selected chapter. |

## Open Work That Is Controlled

- NARA Scout and primary-source leads: Work the NARA item-boundary workbench in batch order, then rerun the linked Scout packets only when Catalog checks do not expose item boundaries. Evidence trail: exports/nara-item-boundary-workbench.csv; exports/potential-documents-triage.csv; exports/nara-scout-query-packets.csv; exports/nara-file-unit-resolution-queue.csv; reports/nara-scout-potential-documents.md
- Compiler risks and gaps: Work the risk closure matrix row by row, closing risks only when item-level evidence or explicit editorial limitation supports closure. Evidence trail: exports/compiler-risk-closure-matrix.csv; exports/compiler-risk-register.csv; reports/compiler-gap-analysis.md; exports/compiler-action-queue.csv; exports/selection-readiness-queue.csv

## By Status

### Proved in current artifacts

- Rows: 4

- Public page and official frame: Create a public page for FRUS 1993-2000, Volume VII, Arms Control and Nonproliferation, 1993-1996.
- Declassified chronology: Prioritize the chronology of declassified documents as the first section of the page.
- Chapter arrangement: Include the requested compiler chapters and keep them separated for selection work.
- Presidential Daily Diary: Search the Presidential Daily Diary and include pertinent calls or meetings.

### Ready for compiler use

- Rows: 9

- NPT and CTBT: Include a chapter on NPT and CTBT.
- START II Ratification: Include a chapter on START II ratification.
- Cooperative Threat Reduction and HEU Agreement: Include a chapter on Cooperative Threat Reduction and the HEU Agreement covering 1995-1996.
- Counterproliferation: Create a chapter on Counterproliferation.
- Chemical and Biological Weapons: Include a chapter on Chemical and Biological Weapons.
- Clinton public statements: Incorporate Clinton public statements without letting them overframe archival selection.
- Clinton Library research: Incorporate Clinton Library finding aids and maximize time at the Clinton Library.
- FRUS source notes: Check source notes against FRUS-style expectations.
- Compiler handoff: Make the project easy for a FRUS compiler to pick up and use.

### Controlled open work

- Rows: 2

- NARA Scout and primary-source leads: Populate chapters with potential documents drawn from primary sources and NARA Scout discovery.
- Compiler risks and gaps: Assume compiler risk, identify gaps, and address them with controlled workflows.
