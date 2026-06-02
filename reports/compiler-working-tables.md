# Compiler Working Tables

Generated from the site's staged data files. These CSVs are meant as working sheets for sorting, filtering, archive pulls, and source-note cleanup; they are not final FRUS document selections.

## Tables

- `exports/compiler-action-queue.csv`: 198 ordered compiler actions spanning close reads, archive requests, item-boundary work, counterpart searches, Scout reruns, and risk controls.
- `exports/compiler-requirements-audit.csv`: 15 requirement-to-evidence rows proving what is covered, what remains controlled open work, and where the compiler should verify each claim.
- `exports/declassified-chronology.csv`: 13 dated released/declassified archival leads promoted to the first page section.
- `exports/potential-documents-triage.csv`: 95 staged document or source-path leads with FRUS-style source notes and risk fields.
- `exports/selection-readiness-queue.csv`: 95 staged leads normalized into readiness gates, next actions, and verification fields.
- `exports/frus-selection-capture-worksheet.csv`: 95 staged leads with final-selection, citation, document-description, and source-note capture fields.
- `exports/nara-file-unit-resolution-queue.csv`: 42 NARA Scout or file-unit leads isolated for item-boundary resolution.
- `exports/nara-item-boundary-workbench.csv`: 42 ordered NARA/file-unit boundary checks with action ranks, Scout pressure, stop rules, and promotion gates.
- `exports/nara-scout-query-packets.csv`: 483 NARA Scout query/scope packets for reruns and source-gap discovery.
- `exports/public-statement-backtrace-queue.csv`: 15 Clinton public statements paired with internal-counterpart search paths.
- `exports/clinton-library-call-slips.csv`: 13 Clinton Library pull clusters from the 2013-0185-M folder-title lists.
- `exports/clinton-library-request-packets.csv`: 83 de-duplicated Clinton Library request packets for reading-room call slips.
- `exports/clinton-library-visit-run-sheet.csv`: 83 Clinton Library run-sheet rows with request order, stop rules, capture gates, and linked action-queue context.
- `exports/clinton-library-oaid-request-queue.csv`: 99 exploded Clinton Library request rows, one row per staged OA/ID or folder-list control reference.
- `exports/presidential-daily-diary-follow-up.csv`: 22 calls or meetings to verify against telcons, memcons, PC/DC minutes, NSC notes, or agency records.
- `exports/daily-diary-counterpart-queue.csv`: 22 diary events converted into substantive-counterpart searches and capture fields.
- `exports/compiler-risk-register.csv`: 10 source-risk controls with next actions, target records, and source pools.
- `exports/compiler-risk-closure-matrix.csv`: 10 risk rows with closure gates, evidence paths, related action ranks, and residual-limitation fields.
- `exports/clinton-public-statements.csv`: 15 Clinton Public Papers anchors for public chronology and speech-clearance backtracking.
- `exports/chapter-dossiers.csv`: 9 chapter-level dashboards bundling first reads, packet screens, archive pulls, diary date controls, public anchors, and risk controls.
- `exports/chapter-readiness-scorecard.csv`: 9 chapter-level readiness rows with counts, blockers, top risks, and next actions.

## Compiler Use

1. Start with `compiler-requirements-audit.csv` to see which explicit requirements are covered, which remain controlled open work, and which artifact proves each claim.
2. Use `compiler-action-queue.csv` when deciding what to do next across all workstreams.
3. Use `declassified-chronology.csv` for the first read-through of available or released records.
4. Use `selection-readiness-queue.csv` to see what each lead is ready for before investing time.
5. Use `nara-item-boundary-workbench.csv` to work unresolved NARA/file-unit rows in batch order with stop rules and promotion gates.
6. Use `nara-file-unit-resolution-queue.csv` as the underlying capture sheet for file-unit rows that need item-level candidates or context-only disposition.
7. Use `nara-scout-query-packets.csv` when re-running Scout or filling source gaps so query/scope work is tracked and reproducible.
8. Use `frus-selection-capture-worksheet.csv` to record final selection decisions, document description fields, and completed FRUS source notes.
9. Use `chapter-readiness-scorecard.csv` to decide which chapter can move to close reading, which chapter needs item-boundary work, and which chapter needs discovery first.
10. Use `chapter-dossiers.csv` as the chapter launch sheet before opening the larger tables.
11. Use `potential-documents-triage.csv` to sort by chapter, priority, source type, level, and compiler risk.
12. Use `public-statement-backtrace-queue.csv` to pair public anchors with internal records before treating them as sequence evidence.
13. Use `clinton-library-visit-run-sheet.csv` as the reading-room day plan, `clinton-library-request-packets.csv` for de-duplicated call slips, then `clinton-library-oaid-request-queue.csv` for item-level capture.
14. Use `presidential-daily-diary-follow-up.csv` for occurrence control, then `daily-diary-counterpart-queue.csv` to locate and capture substantive telcons, memcons, PC/DC minutes, NSC notes, cables, or agency files.
15. Use `compiler-risk-closure-matrix.csv` to decide whether each risk is closed, still open, or accepted as an explicit editorial limitation.
16. Keep `compiler-risk-register.csv` open while selecting documents so public statements, file-unit rows, and broad finding aids do not masquerade as final item-level evidence.

Regenerate with:

```bash
node scripts/build-compiler-working-tables.js
```
