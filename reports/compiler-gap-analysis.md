# Compiler Gap Analysis

Generated for the public FRUS 1993-2000, Volume VII source map.

## What changed

- Added `data/source-gap-leads.js` with primary-source leads from Congress.gov, Clinton Digital Library, DOD, NRC, archived White House records, and the companion Clinton-Russia high-level document page.
- Added `data/compiler-gaps.js` so source weaknesses are visible on the site as structured compiler-risk data.
- Expanded the rendered Potential Documents set from the original NARA/Public Papers list with source-gap leads that target START II, NPT/CTBT, CTR/HEU, Counterproliferation, CBW, regional proliferation, and conventional arms/landmines.
- Added confidence and compiler-risk metadata to document cards.

## Gap treatment

| Gap | Status | New coverage |
| --- | --- | --- |
| Source base too narrow | Addressed with new lanes | Congress.gov treaty documents and reports; Clinton Digital Library MDR packets and finding aids; DOD annual report; NRC HEU implementation notice; companion Clinton-Russia memcons and telcon |
| NARA file-unit quality | Open, now isolated | Kept as a visible risk; `exports/nara-file-unit-resolution-queue.csv` isolates 42 file-unit rows for item-boundary resolution before selection |
| START II ratification too thin | Addressed | Robert Bell START II MDR packet, Senate Executive Report 104-10, December 22, 1995 Congressional Record debate, January 26, 1996 Clinton-Yeltsin telcon |
| NPT/CTBT negotiation records missing | Partly addressed | CTBT finding aid, CTBT Treaty Document 105-28, NPT Congressional Record reaction; still needs State/ACDA cables and Geneva negotiation files |
| CTR/HEU implementation weak | Addressed | Nunn-Lugar MDR packet, Vancouver HEU/security memcon, Moscow trilateral Ukraine memcon, DOD Annual Defense Report, NRC HEU transparency notice |
| Counterproliferation provenance uneven | Partly addressed | 1994 DOD interagency report promoted as source-pool map; DCI threat-assessment path staged but still needs official replacement |
| CBW underdeveloped | Addressed | CWC Treaty Document 103-21, Senate Executive Report 104-33, Elisa Harris CWC files, BWC review-conference locator, Clinton-Yeltsin CW/BW memcon |
| Regional chapter North Korea-heavy | Addressed with balancing leads | North Korea MDR packets retained; added Iran, China, and South Asia source paths |
| Conventional arms/landmines placeholder | Addressed | PDD/NSC-34, PDD/NSC-48 source path, White House landmine-control fact sheet, Congressional Record landmine debate, CCW Executive Report 104-1 |
| Public statements overframing | Addressed in UI | Public statements now sit beside confidence/risk metadata and internal-source pull lists |

## Remaining risks

- Several new rows are source-path or packet-level leads rather than item-level documents.
- Some Congress.gov pre-1995 treaty pages provide authoritative metadata and action trails but not full document text.
- The DCI counterproliferation lead currently uses a non-official mirror as a locator and should be replaced before final use.
- The NARA Scout generated data still contains cached, undated file-unit rows from the earlier API-limited run. These now have a dedicated resolution worksheet but still require Catalog child-item or on-site verification.

## Next pull list

1. Work `exports/nara-file-unit-resolution-queue.csv` until each NAID is either replaced by item-level candidates or marked context-only.
2. Re-run the NARA Scout harvester with the expanded query packs once `NARA_SCOUT_API_KEY` quota is available.
3. Screen `2016-0048-M`, `2014-0644-M`, `2016-0158-F`, `2013-0870-M`, `2013-0865-M`, and `2015-0641-M` for item-level documents.
4. Replace source-path-only leads for China, South Asia, and the DCI threat-assessment lane with official item pages or stronger primary sources.
5. Add State/ACDA/DOE/JCS/CIA source records where available, especially for CTBT zero-yield, CWC ratification, HEU transparency, theater missile defense, and BWC protocol negotiations.
