window.ARMSCONTROL_COMPILER_GAPS = [
  {
    id: "gap-source-base-diversity",
    priority: "Critical",
    status: "Addressed with new source lanes",
    lane: "Source Base",
    title: "Widen the project beyond NSC/Public Papers/NARA Scout",
    evidence:
      "The first pass had 65 potential documents: 41 NARA Scout file-unit candidates, 15 Public Papers items, and only a small set of DOD, archived White House, and Clinton Library leads.",
    problem:
      "A compiler-facing map can become misleading if public statements and cached file-unit hits stand in for State, ACDA, DOE, DOD, IC, JCS, and Senate records.",
    needed:
      "Keep source classes visible and stage primary-source leads from Congress.gov, Clinton Digital Library, DOD, NRC, and companion Clinton-Russia document packets.",
    nextActions: [
      "Use the new source-gap leads as a pull list, not a final selection list.",
      "Replace source-path leads with item-level official documents as they are located.",
      "Do not promote cached NARA file units without dates, item boundaries, or source-note verification."
    ],
    targetRecords: [
      "Treaty Doc. 105-28",
      "Ex. Rept. 104-10",
      "Ex. Rept. 104-33",
      "2014-0644-M",
      "2016-0048-M",
      "2016-0158-F"
    ],
    targetTerms: ["State", "ACDA", "DOE", "DOD", "IC", "JCS", "Senate"],
    sourcePools: ["Congress.gov", "Clinton Digital Library", "DOD Historical Office", "NRC", "Clinton-Russia-High-Level"]
  },
  {
    id: "gap-nara-file-unit-quality",
    priority: "Critical",
    status: "Open",
    lane: "NARA Scout",
    title: "Resolve cached NARA file-unit rows into item-level documents",
    evidence:
      "The NARA list still includes many undated fileUnit records and a recovery note from a NARA API Limit Exceeded condition.",
    problem:
      "File-unit hits are valid research leads, but they cannot support final FRUS chronology, source notes, or document selection without item boundaries.",
    needed:
      "Re-run Scout with the expanded query packs, then record dates, file/folder hierarchy, digital-object status, and page-level item titles.",
    nextActions: [
      "Run the harvester after NARA API quota recovery.",
      "Screen all High-priority file units before adding more broad cached rows.",
      "Add page ranges or mark each row as collection-only, file-unit lead, or item-level candidate."
    ],
    targetRecords: ["23903435", "40478001", "23903296", "235148478", "122245993", "40477989"],
    targetTerms: ["date not surfaced", "fileUnit", "cached NARA Scout candidate"],
    sourcePools: ["National Archives Catalog", "NARA Scout"]
  },
  {
    id: "gap-start-ii-ratification",
    priority: "High",
    status: "Addressed with START II ratification leads",
    lane: "START II",
    title: "Build a real START II ratification file",
    evidence:
      "The first START II chapter had one Clinton statement and two NARA leads.",
    problem:
      "The chapter lacked Senate conditions, Foreign Relations Committee action, floor debate, Robert Bell records, and Clinton-Yeltsin handling on ratification day.",
    needed:
      "Pair the public Clinton statement with Senate treaty records, Robert Bell MDR packets, and the January 26, 1996 Yeltsin telcon.",
    nextActions: [
      "Screen Robert Bell MDR 2016-0048-M for START II, Ukraine, Russia, ABM, and Duma material.",
      "Use Ex. Rept. 104-10 and the December 22, 1995 Congressional Record as the Senate backbone.",
      "Review the January 26, 1996 Clinton-Yeltsin telcon against the public statement."
    ],
    targetRecords: ["2016-0048-M", "Ex. Rept. 104-10", "Cong. Rec. Vol. 141, No. 207", "2015-0782-M-1 / telcon 33"],
    targetTerms: ["START II", "ratification", "Senate", "Duma", "ABM", "TMD"],
    sourcePools: ["Robert Bell files", "Congress.gov", "Clinton-Russia-High-Level"]
  },
  {
    id: "gap-npt-ctbt-negotiating-record",
    priority: "High",
    status: "Partly addressed",
    lane: "NPT/CTBT",
    title: "Add negotiation and treaty-text records behind the NPT/CTBT public statements",
    evidence:
      "The first NPT/CTBT chapter had strong Clinton public anchors but limited internal negotiation records.",
    problem:
      "NPT indefinite extension and CTBT signature decisions need State/ACDA/NSC negotiating records, not only public statements.",
    needed:
      "Use the Clinton Library CTBT finding aid, CTBT Treaty Doc. 105-28, and Congressional Record NPT reaction as locators while searching for State/ACDA cables and NSC decision papers.",
    nextActions: [
      "Screen FOIA 2011-0821-F for PRD-19, PDD-11, zero-yield, and stockpile-stewardship files.",
      "Use Treaty Doc. 105-28 as the CTBT treaty-text endpoint and Volume VIII handoff marker.",
      "Search for NPT extension material on Egypt, NAM, South Africa, Ukraine, and Article VI commitments."
    ],
    targetRecords: ["2011-0821-F", "Treaty Doc. 105-28", "Cong. Rec. Vol. 141, No. 78"],
    targetTerms: ["NPT extension", "CTBT", "zero-yield", "stockpile stewardship", "ACDA", "Geneva"],
    sourcePools: ["Clinton Library", "Congress.gov", "State Department", "ACDA"]
  },
  {
    id: "gap-ctr-heu-implementation",
    priority: "High",
    status: "Addressed with CTR/HEU implementation leads",
    lane: "CTR/HEU",
    title: "Move CTR/HEU beyond public summit statements",
    evidence:
      "The first CTR/HEU chapter had four Public Papers anchors and two NARA file-unit leads.",
    problem:
      "Implementation of Nunn-Lugar, HEU transparency, Ukraine denuclearization, DOE/USEC handling, and DOD CTR work requires operational records.",
    needed:
      "Add Nunn-Lugar MDR records, Clinton-Yeltsin/Kravchuk memcons, DOD annual reporting, and NRC/DOE transparency context.",
    nextActions: [
      "Screen 2014-0644-M for Ukraine and Balkan-state CTR memoranda.",
      "Use the April 4, 1993 Vancouver and January 14, 1994 trilateral memcons to anchor leader-level HEU/Ukraine handling.",
      "Pursue DOE/USEC/Minatom transparency records for 1995-1996."
    ],
    targetRecords: ["2014-0644-M", "NAID 163545404", "C06694499", "1996 DoD Annual Report", "NUREG/BR-0117"],
    targetTerms: ["Nunn-Lugar", "HEU", "USEC", "Minatom", "Ukraine", "transparency"],
    sourcePools: ["Clinton Digital Library", "DOD Historical Office", "NRC", "DOE", "Clinton-Russia-High-Level"]
  },
  {
    id: "gap-counterproliferation-provenance",
    priority: "High",
    status: "Partly addressed",
    lane: "Counterproliferation",
    title: "Separate official counterproliferation records from generic chron-file hits",
    evidence:
      "The first Counterproliferation chapter had many Robert Bell chron-file hits and a PDD/NSC-18 text from a mirror.",
    problem:
      "Chron-file hits and mirrored texts are useful locators, but the chapter needs official PDD, DOD, JCS, IC, and theater-missile-defense records.",
    needed:
      "Keep PDD/NSC-18 and the 1994 DOD interagency report visible while pursuing official DOD, IC, and JCS records.",
    nextActions: [
      "Use OSTI ID 377259 as a source-pool map because it names State, Defense, Energy, IC, JCS, and ACDA.",
      "Replace the mirrored DCI threat-assessment locator with official CIA, SSCI, or GovInfo text.",
      "Add theater missile defense, biological defense, NBC terrorism, and military planning search terms to NARA Scout."
    ],
    targetRecords: ["PDD/NSC-18", "OSTI ID 377259", "DCI Deutch threat-assessment lead"],
    targetTerms: ["counterproliferation", "PDD-18", "TMD", "biological defense", "NBC terrorism", "IC"],
    sourcePools: ["DOD", "JCS", "CIA/IC", "ACDA", "State Department"]
  },
  {
    id: "gap-cbw-senate-bwc-australia-group",
    priority: "High",
    status: "Addressed with CWC/BWC leads",
    lane: "CBW",
    title: "Expand CBW into CWC ratification, BWC strengthening, and NSC staff files",
    evidence:
      "The first CBW chapter had three archived White House records and two NARA leads.",
    problem:
      "CWC ratification and BWC strengthening need Senate records, ACDA/State files, Elisa Harris NSC files, and BWC conference records.",
    needed:
      "Add CWC Treaty Doc. 103-21, Ex. Rept. 104-33, Elisa Harris CWC files, BWC Fourth Review Conference locators, and the 1994 Clinton-Yeltsin CW/BW memcon.",
    nextActions: [
      "Screen Elisa Harris FOIA 2016-0158-F at collection/folder level.",
      "Pair Ex. Rept. 104-33 with NSC/ACDA/State ratification-strategy files.",
      "Locate contemporaneous BWC Ad Hoc Group and Fourth Review Conference records."
    ],
    targetRecords: ["Treaty Doc. 103-21", "Ex. Rept. 104-33", "2016-0158-F", "2018-1215-M"],
    targetTerms: ["CWC", "BWC", "Elisa Harris", "Australia Group", "Aum Shinrikyo", "UNSCOM"],
    sourcePools: ["Congress.gov", "Clinton Digital Library", "ACDA", "State Department"]
  },
  {
    id: "gap-regional-balance",
    priority: "High",
    status: "Addressed with regional-balancing leads",
    lane: "Regional Cases",
    title: "Balance the regional chapter beyond North Korea",
    evidence:
      "The first regional chapter was dominated by North Korea file units.",
    problem:
      "North Korea is essential, but Iran, Iraq, China, South Asia, Libya, and former-Soviet leakage need visible source paths.",
    needed:
      "Keep DPRK item-level leads while adding Iran, China, South Asia, and Iraq/UNSCOM source paths.",
    nextActions: [
      "Screen North Korea MDR packets 2013-0870-M and 2013-0865-M before adding more DPRK folder hits.",
      "Use Iran MDR 2015-0641-M for Russian arms-sales/proliferation angles.",
      "Locate item pages for China 2016-0557-M and South Asia 2006-0859-M or replace with stronger official leads."
    ],
    targetRecords: ["2013-0870-M", "2013-0865-M", "2009-0528-F Segment 2", "2015-0641-M", "2016-0557-M", "2006-0859-M"],
    targetTerms: ["North Korea", "Iran", "Iraq", "China", "South Asia", "Libya"],
    sourcePools: ["Clinton Digital Library", "NARA Catalog", "State Department", "CIA/IC"]
  },
  {
    id: "gap-conventional-landmines",
    priority: "High",
    status: "Addressed with landmine/CCW leads",
    lane: "Conventional Arms",
    title: "Turn the conventional chapter from placeholder into a review lane",
    evidence:
      "The first conventional chapter had one NARA Scout Landmines row.",
    problem:
      "A one-row chapter hides landmine control, CCW/Protocol II, arms-transfer policy, and export-control decisions.",
    needed:
      "Add White House landmine policy, Congressional Record landmine reaction, and CCW Senate report leads.",
    nextActions: [
      "Use the September 26, 1994 White House fact sheet as the public policy anchor.",
      "Use Ex. Rept. 104-1 for CCW/Protocol II context.",
      "Search NSC/State/DOD files for arms-transfer policy and landmine decision memoranda."
    ],
    targetRecords: ["PDD/NSC-34", "PDD/NSC-48", "1994-09-26 landmine fact sheet", "Cong. Rec. Vol. 142, No. 88", "Ex. Rept. 104-1"],
    targetTerms: ["landmines", "CCW", "Protocol II", "PDD-34", "PDD-48", "arms transfers", "export controls"],
    sourcePools: ["Archived White House", "Congress.gov", "NSC", "State Department", "DOD"]
  },
  {
    id: "gap-public-statements-as-locators",
    priority: "Medium",
    status: "Addressed in UI metadata",
    lane: "Public Statements",
    title: "Use Clinton statements as locators, not automatic selections",
    evidence:
      "Public Papers are useful milestones but can overframe the compiler map if they displace internal decision records.",
    problem:
      "A public chronology without matching memcons, cables, PDDs, and action memoranda can look more complete than it is.",
    needed:
      "Show confidence, compiler-risk, source category, and item level on document cards.",
    nextActions: [
      "Use public statements to identify dates and policy claims.",
      "Pair each public statement with internal clearance, negotiation, or implementation records where possible.",
      "Keep public-only rows marked as public anchors unless they are likely final textual selections."
    ],
    targetRecords: ["Public Papers", "Archived White House"],
    targetTerms: ["Clinton statement", "public statement", "public anchor"],
    sourcePools: ["GovInfo", "Archived White House", "Clinton Library"]
  }
];
