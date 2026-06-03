# FRUS Source Note Provenance Audit

Checked: June 3, 2026

## Published FRUS Model

The planned Volume VII page should not present research annotations as final
source notes. Published FRUS document notes begin with `Source:` and then
establish provenance before editorial interpretation: repository, record group
or presidential materials, collection/file path, box/folder or identifier,
classification or handling markings, action/distribution status when present,
and editorial facts such as attachments, not-printed material, cross-references,
marginalia, or declassification/withholding notes.

Official comparison points:

- `https://history.state.gov/historicaldocuments/frus1969-76v30/d105`
  shows a meeting record source note with National Archives repository,
  presidential materials, NSC institutional file path, box/folder, classification
  and sensitivity markings, meeting location, and separate attachment/cross-
  reference notes.
- `https://history.state.gov/historicaldocuments/frus1969-76v38p2/d181`
  shows a memorandum source note with repository, presidential materials,
  NSC/H-Files path, box/folder, classification, action status, and marginalia.
- `https://history.state.gov/historicaldocuments/frus1969-76ve11p1/d390`
  shows an electronic-volume note that still preserves repository, collection
  path, box/folder, classification, follow-on memorandum status, and related
  telegram cross-references.
- `https://history.state.gov/historicaldocuments/about-frus`
  frames the broader standard for a thorough, accurate, reliable documentary
  record based on records across the White House, NSC, State, Defense, CIA, and
  other foreign-affairs agencies.

## Current Generated State

| Area | Result |
| --- | --- |
| Potential-document triage | 95 of 95 `source_note` fields begin with `Source:` and 95 of 95 include `Provenance status:` boundary language. |
| Selection-readiness queue | 95 of 95 `source_note` fields begin with `Source:` and 95 of 95 include `Provenance status:` boundary language. |
| FRUS selection capture worksheet | 95 of 95 `current_source_note` fields begin with `Source:` and 95 of 95 include `Provenance status:` boundary language. |
| Clinton public statements | 15 of 15 `source_note` fields begin with `Source:` and 15 of 15 include `Provenance status:` boundary language. |
| Public-statement backtrace queue | 15 of 15 `source_note` fields begin with `Source:` and 15 of 15 include `Provenance status:` boundary language. |
| Clinton Library call slips | 13 of 13 `source_note` fields begin with `Source:` and 13 of 13 include `Provenance status:` boundary language. |
| Clinton Library OA/ID request queue | 99 of 99 `source_note` fields begin with `Source:` and 99 of 99 include `Provenance status:` boundary language. |
| Clinton Library request packets | 83 of 83 `packet_source_note` fields begin with `Source:` and 83 of 83 include `Provenance status:` boundary language. |
| Clinton Library visit run sheet | 83 of 83 `packet_source_note` fields begin with `Source:` and 83 of 83 include `Provenance status:` boundary language. |

## Applied Provenance Rules

- Public Papers and congressional/treaty-text records are marked as published
  primary-source anchors and must be paired with internal policy files unless
  the published text itself is selected.
- NARA Scout file-unit rows are marked as file-unit leads only until item
  boundaries, item title/date, origin/recipient, markings, page range,
  attachments, and declassification/withholding details are verified.
- Clinton Library MDR packets and release packets are marked as packet leads,
  not item-level selections, until the exact document and page range are
  captured.
- Finding-aid and folder-title rows are marked as collection or request leads
  until a requestable folder/item path and item-level source evidence are
  captured.
- Companion review copies are flagged so the final FRUS note cites the owning
  repository or release packet, not the companion page.

## Promotion Rule

Do not promote any file-unit, packet, finding-aid, folder-title, or companion
review-copy lead into a final FRUS chronological document until the archive visit
or digital release confirms exact repository, collection/file path, box/folder
or identifier, item title/date, author or origin, recipient/audience,
classification markings, action/distribution status when present, page range,
attachments/enclosures, cross-references, and declassification or withholding
details.

Use `exports/frus-selection-capture-worksheet.csv` as the promotion worksheet.
It preserves the generated provisional note, then leaves final-source-note and
document-description fields blank until item-level verification is complete.
