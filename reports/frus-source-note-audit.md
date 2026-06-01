# FRUS Source Note Audit

Checked: May 25, 2026

## Style model

The planned Volume VII page should not present research annotations as source notes. FRUS document notes normally begin with `Source:` and then give the repository, collection or file path, box/folder or identifier when available, and document-status details such as classification, action status, marginalia, attachments, or cross-references. Official examples include:

- `https://history.state.gov/historicaldocuments/frus1969-76v30/d105`
- `https://history.state.gov/historicaldocuments/frus1969-76v38p2/d181`
- `https://history.state.gov/historicaldocuments/frus1969-76ve11p1/d390`

The Office of the Historian's FRUS description also frames the selection standard: the series documents major foreign-policy decisions and significant diplomatic activity from records across the White House, NSC, State, Defense, CIA, and other foreign-affairs agencies.

## Audit result

Before this pass, the rendered data mixed FRUS-style notes with research annotations:

| Area | Finding |
| --- | --- |
| Generated potential documents | 52 of 65 stored notes did not begin with `Source:` |
| NARA Scout candidates | 41 notes only said they were recovered from a Scout harvest |
| Manual source-gap leads | 30 high-value leads had no `sourceNote` field |
| Clinton public statements | 2 of 15 notes were prose summaries rather than source notes |
| Clinton Library visit clusters | 13 clusters had pull-planning detail but no source-note line |

## Fix applied

The page now renders a generated FRUS-style note for every potential document, public statement, source-gap lead, and Clinton Library pull cluster. The generator preserves existing good `Source:` notes, replaces generic Scout recovery prose, and labels evidence level honestly:

- Published sources are marked as published primary sources.
- NARA file-unit leads are marked as file-unit leads pending item-level text, classification, date, and pagination.
- Clinton Library packets and MDR/finding-aid rows are marked as packet, collection, or source-path leads pending item-level verification.
- Companion review copies are marked as review copies that still need final citation against the owning release packet.
- Clinton Library `2013-0185-M` clusters now cite the folder-title lists, source part, and OA/ID trail.

## Remaining rule

Do not promote any file-unit, packet, or folder-title lead into a final FRUS chronological document until the archive visit or digital release confirms exact item title, date, classification markings, folder path, and page range.

Use `exports/frus-selection-capture-worksheet.csv` as the promotion worksheet. It preserves the generated source note, then leaves final-source-note and document-description fields blank until item-level verification is complete.
