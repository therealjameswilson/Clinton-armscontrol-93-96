# Compiler Working Tables

Generated from the site's staged data files. These CSVs are meant as working sheets for sorting, filtering, archive pulls, and source-note cleanup; they are not final FRUS document selections.

## Tables

- `exports/potential-documents-triage.csv`: 95 staged document or source-path leads with FRUS-style source notes and risk fields.
- `exports/selection-readiness-queue.csv`: 95 staged leads normalized into readiness gates, next actions, and verification fields.
- `exports/frus-selection-capture-worksheet.csv`: 95 staged leads with final-selection, citation, document-description, and source-note capture fields.
- `exports/declassified-chronology.csv`: 13 dated released/declassified archival leads promoted to the first page section.
- `exports/clinton-library-call-slips.csv`: 13 Clinton Library pull clusters from the 2013-0185-M folder-title lists.
- `exports/clinton-library-oaid-request-queue.csv`: 99 exploded Clinton Library request rows, one row per staged OA/ID or folder-list control reference.
- `exports/presidential-daily-diary-follow-up.csv`: 22 calls or meetings to verify against telcons, memcons, PC/DC minutes, NSC notes, or agency records.
- `exports/compiler-risk-register.csv`: 10 source-risk controls with next actions, target records, and source pools.
- `exports/clinton-public-statements.csv`: 15 Clinton Public Papers anchors for public chronology and speech-clearance backtracking.
- `exports/chapter-dossiers.csv`: 9 chapter-level dashboards bundling first reads, packet screens, archive pulls, diary date controls, public anchors, and risk controls.

## Compiler Use

1. Start with `declassified-chronology.csv` for the first read-through of available or released records.
2. Use `selection-readiness-queue.csv` to see what each lead is ready for before investing time.
3. Use `frus-selection-capture-worksheet.csv` to record final selection decisions, document description fields, and completed FRUS source notes.
4. Use `chapter-dossiers.csv` as the chapter launch sheet before opening the larger tables.
5. Use `potential-documents-triage.csv` to sort by chapter, priority, source type, level, and compiler risk.
6. Use `clinton-library-call-slips.csv` for pull-cluster strategy, then `clinton-library-oaid-request-queue.csv` as the on-site request and capture worksheet.
7. Use `presidential-daily-diary-follow-up.csv` only as a locator sheet until a substantive telcon, memcon, meeting note, or agency file is found.
8. Keep `compiler-risk-register.csv` open while selecting documents so public statements, file-unit rows, and broad finding aids do not masquerade as final item-level evidence.

Regenerate with:

```bash
node scripts/build-compiler-working-tables.js
```
