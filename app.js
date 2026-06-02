const generatedPotentialDocuments = window.ARMSCONTROL_POTENTIAL_DOCUMENTS || [];
const sourceGapLeads = window.ARMSCONTROL_SOURCE_GAP_LEADS || [];
const compilerGaps = window.ARMSCONTROL_COMPILER_GAPS || [];
const libraryResearchPlan = window.ARMSCONTROL_LIBRARY_RESEARCH_PLAN || [];
const dailyDiaryReferences = window.ARMSCONTROL_DAILY_DIARY_REFERENCES || [];
const chapterSequence = [
  "ctbt",
  "strategic-arms",
  "start-ii",
  "ctr-heu",
  "nonproliferation",
  "counterproliferation",
  "regional",
  "cbw-conventional",
  "conventional-landmines"
];
const potentialDocuments = [...generatedPotentialDocuments, ...sourceGapLeads].sort((a, b) => {
  const chapterOrder = chapterSequence.indexOf(a.chapterId) - chapterSequence.indexOf(b.chapterId);
  return (
    chapterOrder ||
    `${a.date || "9999"}`.localeCompare(`${b.date || "9999"}`) ||
    (b.score || 0) - (a.score || 0) ||
    a.title.localeCompare(b.title)
  );
});
const declassifiedChronology = potentialDocuments
  .filter(isDeclassifiedChronologyItem)
  .sort(
    (a, b) =>
      chronologySortKey(a.date).localeCompare(chronologySortKey(b.date)) ||
      (b.score || 0) - (a.score || 0) ||
      a.title.localeCompare(b.title)
  );
const clintonPublicStatements = (window.CLINTON_PUBLIC_STATEMENTS || potentialDocuments.filter((item) => item.sourceType === "Public Papers"))
  .slice()
  .sort((a, b) => `${a.date || ""}`.localeCompare(`${b.date || ""}`) || a.title.localeCompare(b.title));

const lanes = [
  {
    id: "volume-control",
    number: "Frame",
    title: "Volume Control",
    status: "Official frame",
    summary:
      "Keep the planned FRUS status, the Clinton volume boundary, and adjacent-volume overlap visible before record selection begins.",
    topics: ["FRUS status", "1993-1996", "Volume VIII handoff"]
  },
  {
    id: "ctbt",
    number: "Chapter 1",
    title: "NPT and CTBT",
    status: "High value",
    summary:
      "Track the 1995 indefinite extension of the Nuclear Non-Proliferation Treaty alongside the 1993-1996 nuclear testing review, CTBT negotiations, and September 1996 signature sequence.",
    topics: ["NPT extension", "CTBT", "test moratorium"]
  },
  {
    id: "strategic-arms",
    number: "Chapter 2",
    title: "Strategic Arms and Nuclear Security",
    status: "High value",
    summary:
      "Follow strategic stability, missile systems, nuclear materials security, and transparency around weapons reductions.",
    topics: ["strategic stability", "missile systems", "nuclear materials"]
  },
  {
    id: "start-ii",
    number: "Chapter 3",
    title: "START II Ratification",
    status: "Dedicated chapter",
    summary:
      "Track the U.S. ratification sequence for the START II nuclear arms reduction treaty, including Senate action, White House handling, Russian linkage, and source material around implementation politics.",
    topics: ["START II", "Senate", "ratification"]
  },
  {
    id: "ctr-heu",
    number: "Chapter 4",
    title: "Cooperative Threat Reduction and HEU Agreement",
    status: "Dedicated chapter",
    summary:
      "Cover 1995-1996 implementation of Nunn-Lugar Cooperative Threat Reduction, nuclear materials security, Ukraine denuclearization, and transparency measures under the U.S.-Russia Highly Enriched Uranium Agreement.",
    topics: ["Nunn-Lugar", "HEU Agreement", "Ukraine warheads"]
  },
  {
    id: "nonproliferation",
    number: "Chapter 5",
    title: "Nonproliferation Regimes",
    status: "Core chapter",
    summary:
      "Collect fissile material policy, MTCR, nuclear smuggling, export controls, and multilateral nonproliferation planning that falls outside the NPT/CTBT chapter.",
    topics: ["MTCR", "fissile material", "export controls"]
  },
  {
    id: "counterproliferation",
    number: "Chapter 6",
    title: "Counterproliferation",
    status: "Dedicated chapter",
    summary:
      "Track the administration's shift from prevention alone to prevention plus protection: PDD/NSC-18, the Defense Counterproliferation Initiative, WMD military planning, theater missile defense, biological defense, and intelligence support for operations against proliferators.",
    topics: ["PDD/NSC-18", "WMD planning", "theater missile defense"]
  },
  {
    id: "regional",
    number: "Chapter 7",
    title: "Regional Proliferation Cases",
    status: "Cross-regional",
    summary:
      "Surface records on North Korea, the former Soviet Union, China, the Middle East, South Asia, and other regional proliferation files.",
    topics: ["North Korea", "China", "South Asia"]
  },
  {
    id: "cbw-conventional",
    number: "Chapter 8",
    title: "Chemical and Biological Weapons",
    status: "Dedicated chapter",
    summary:
      "Track Chemical Weapons Convention ratification strategy, CWC implementation planning, Biological Weapons Convention strengthening, Australia Group export controls, and CBW proliferation reporting.",
    topics: ["CWC", "BWC", "Australia Group"]
  },
  {
    id: "conventional-landmines",
    number: "Chapter 9",
    title: "Conventional Arms and Landmines",
    status: "Watch chapter",
    summary:
      "Hold conventional arms transfer policy, landmine-control initiatives, and related export-control material that should not be folded into the CBW chapter.",
    topics: ["landmines", "arms transfers", "export controls"]
  }
];

const sourceLeads = [
  {
    title: "FRUS 1993-2000, Volume VII official page",
    institution: "Office of the Historian",
    lane: "volume-control",
    type: "Volume anchor",
    priority: "Anchor",
    date: "1993-1996",
    identifier: "frus1993-00v07",
    url: "https://history.state.gov/historicaldocuments/frus1993-00v07",
    note:
      "Official volume title and current status. The page identifies the volume as Arms Control and Nonproliferation, 1993-1996, and marks it planned.",
    tags: ["official", "planned", "volume"]
  },
  {
    title: "Clinton administration FRUS volume list",
    institution: "Office of the Historian",
    lane: "volume-control",
    type: "Volume boundary",
    priority: "Anchor",
    date: "1993-2000",
    identifier: "Clinton subseries",
    url: "https://history.state.gov/historicaldocuments/clinton",
    note:
      "Places Volume VII beside Volume VIII for 1997-2000 and Volume XX for former-Soviet arms control and nonproliferation overlap.",
    tags: ["official", "boundary", "volume VIII", "volume XX"]
  },
  {
    title: "Status of the Series entry for Volume VII",
    institution: "Office of the Historian",
    lane: "volume-control",
    type: "Status anchor",
    priority: "Anchor",
    date: "current",
    identifier: "Planned",
    url: "https://history.state.gov/historicaldocuments/status-of-the-series",
    note:
      "The status list includes Volume VII among planned FRUS volumes, so the public site should present leads rather than published-document text.",
    tags: ["official", "planned", "status"]
  },
  {
    title: "NSC Defense Policy and Arms Control Office",
    institution: "Clinton Presidential Library",
    lane: "strategic-arms",
    type: "Office guide",
    priority: "High",
    date: "1993-2001",
    identifier: "Guide to Textual Holdings, pp. 40-41",
    url: "https://www.clintonlibrary.gov/sites/default/files/documents/research/clinton-library-guide-holdings-2020-no-sf-cf.pdf",
    note:
      "The guide says the office advised the President and National Security Advisor on national security policy, nuclear arms control, and conventional arms control. Robert Bell headed it from January 1993 to October 1999.",
    tags: ["NSC", "Robert Bell", "nuclear arms control", "conventional arms"]
  },
  {
    title: "NSC Nonproliferation and Export Controls Office",
    institution: "Clinton Presidential Library",
    lane: "nonproliferation",
    type: "Office guide",
    priority: "High",
    date: "1993-2001",
    identifier: "Guide to Textual Holdings, p. 51",
    url: "https://www.clintonlibrary.gov/sites/default/files/documents/research/clinton-library-guide-holdings-2020-no-sf-cf.pdf",
    note:
      "The guide identifies this office with nonproliferation and arms control issues including nuclear smuggling, the CWC, the NPT, MTCR, North Korea, the former Soviet Union, China, the Middle East, and conventional arms transfer policy.",
    tags: ["NSC", "Daniel Poneman", "Gary Samore", "NPT", "MTCR"]
  },
  {
    title: "Fact Sheet on Nonproliferation and Export Control Policy",
    institution: "Archived White House via Argonne",
    lane: "counterproliferation",
    type: "Public record",
    priority: "High",
    date: "1993-09-27",
    identifier: "White House fact sheet",
    url: "https://www.rertr.anl.gov/REFDOCS/PRES93NP.html",
    note:
      "White House policy lead for giving proliferation a higher profile in intelligence collection, defense planning, force structure, and doctrine against WMD and missile threats.",
    tags: ["WMD", "missiles", "defense planning", "PDD-13"]
  },
  {
    title: "PDD/NSC-18 Defense Counterproliferation Initiative",
    institution: "Department of Defense text via FAS",
    lane: "counterproliferation",
    type: "Policy text",
    priority: "High",
    date: "1993-12-07",
    identifier: "PDD/NSC-18",
    url: "https://irp.fas.org/offdocs/pdd18.htm",
    note:
      "Primary source text for Secretary Les Aspin's launch of the Defense Counterproliferation Initiative, including military planning, theater missile defense, biological defense, and intelligence support.",
    tags: ["PDD/NSC-18", "Les Aspin", "theater missile defense", "biological defense"]
  },
  {
    title: "Remarks on the Resignation of Les Aspin as Secretary of Defense",
    institution: "GovInfo",
    lane: "counterproliferation",
    type: "Public Papers lead",
    priority: "High",
    date: "1993-12-15",
    identifier: "PPP-1993-book2-doc-pg2177",
    url: "https://www.govinfo.gov/app/details/PPP-1993-book2/PPP-1993-book2-doc-pg2177",
    note:
      "Clinton public statement crediting Aspin's leadership and explicitly identifying his new counterproliferation initiative as a major response to post-Cold War security challenges.",
    tags: ["Clinton statement", "Les Aspin", "counterproliferation", "Public Papers"]
  },
  {
    title: "Nonproliferation and counterproliferation activities and programs",
    institution: "OSTI / Office of the Deputy Secretary of Defense",
    lane: "counterproliferation",
    type: "Technical report",
    priority: "High",
    date: "1994-05-01",
    identifier: "OSTI ID 377259",
    url: "https://www.osti.gov/biblio/377259",
    note:
      "Interagency report required by the FY1994 defense authorization act, covering existing, planned, and proposed capabilities for countering proliferation and NBC terrorism.",
    tags: ["DOD", "NBC terrorism", "program review", "1994"]
  },
  {
    title: "Counterproliferation: A National Security Priority",
    institution: "OSTI / Office of the Under Secretary of Defense",
    lane: "counterproliferation",
    type: "Speech text",
    priority: "Medium",
    date: "1995-10-27",
    identifier: "OSTI ID 612135",
    url: "https://www.osti.gov/biblio/612135",
    note:
      "Paul Kaminski speech text connecting Clinton's 1995 national security strategy to effective military capabilities against WMD and missile-delivery threats.",
    tags: ["Paul Kaminski", "National Security Strategy", "WMD", "missiles"]
  },
  {
    title: "Letter to Congress on chemical and biological weapons",
    institution: "Archived White House",
    lane: "cbw-conventional",
    type: "Public record",
    priority: "High",
    date: "1995-02-16",
    identifier: "CBW report letter",
    url: "https://clintonwhitehouse6.archives.gov/1995/02/1995-02-16-letter-to-congress-on-chemical-and-biological-weapons.html",
    note:
      "Volume VII anchor for CWC submission and PrepCom work, the September 1994 BWC Special Conference, and the Ad Hoc Group mandate to strengthen BWC implementation.",
    tags: ["CWC", "BWC", "Congress", "1995"]
  },
  {
    title: "Letter on actions against weapons of mass destruction",
    institution: "Archived White House",
    lane: "cbw-conventional",
    type: "Public record",
    priority: "High",
    date: "1996-11-12",
    identifier: "WMD/CBW report letter",
    url: "https://clintonwhitehouse6.archives.gov/1996/11/1996-11-12-letter-on-actions-vs-mass-destruction-weapons.html",
    note:
      "Late-1996 CBW status lead covering CWC ratification urgency, BWC protocol goals, Australia Group activity, and CBW terrorism export-control concerns.",
    tags: ["CWC", "BWC", "Australia Group", "CBW terrorism"]
  },
  {
    title: "Records of the NSC Defense Policy and Arms Control Office",
    institution: "National Archives Catalog",
    lane: "strategic-arms",
    type: "Collection",
    priority: "High",
    date: "Clinton administration",
    identifier: "NAID 7386504",
    url: "https://catalog.archives.gov/id/7386504",
    note:
      "Parent collection for Clinton NSC defense policy and arms control records. Child series include Robert Bell's files and Steven Andreasen's files.",
    tags: ["NAID 7386504", "Robert Bell", "Steven Andreasen", "NARA"]
  },
  {
    title: "Robert Bell's Files",
    institution: "National Archives Catalog",
    lane: "start-ii",
    type: "Series",
    priority: "High",
    date: "1993-1999",
    identifier: "NAID 7585451",
    url: "https://catalog.archives.gov/id/7585451",
    note:
      "High-probability START II series because Bell headed the Defense Policy and Arms Control Office during the full Volume VII date span.",
    tags: ["NAID 7585451", "Robert Bell", "START II", "arms control"]
  },
  {
    title: "Statement on Senate Ratification of the START II Nuclear Arms Reduction Treaty With Russia",
    institution: "GovInfo",
    lane: "start-ii",
    type: "Public Papers lead",
    priority: "High",
    date: "1996-01-26",
    identifier: "PPP-1996-book1-doc-pg104",
    url: "https://www.govinfo.gov/app/details/PPP-1996-book1/PPP-1996-book1-doc-pg104",
    note:
      "Public Papers anchor for the U.S. Senate's START II ratification action and the White House public framing of the treaty.",
    tags: ["START II", "ratification", "Senate", "Public Papers"]
  },
  {
    title: "Declassified Documents Concerning the Nunn-Lugar Cooperative Threat Reduction Program",
    institution: "Clinton Digital Library",
    lane: "ctr-heu",
    type: "MDR collection",
    priority: "High",
    date: "1994-1996",
    identifier: "2014-0644-M",
    url: "https://clinton.presidentiallibraries.us/items/show/49417",
    note:
      "Mandatory declassification review collection for NSC Records Management System material on the Nunn-Lugar Program, including 1994-1996 memoranda on Ukraine and the Balkan states.",
    tags: ["Nunn-Lugar", "CTR", "Ukraine", "MDR"]
  },
  {
    title: "Joint Statement With President Yeltsin on Nuclear Materials Security",
    institution: "GovInfo",
    lane: "ctr-heu",
    type: "Public Papers lead",
    priority: "High",
    date: "1995-10-23",
    identifier: "PPP-1995-book2-doc-pg1663",
    url: "https://www.govinfo.gov/app/details/PPP-1995-book2/PPP-1995-book2-doc-pg1663",
    note:
      "Hyde Park public anchor for 1995 nuclear materials security and the U.S.-Russian implementation frame leading into CTR and HEU transparency work.",
    tags: ["nuclear materials security", "Yeltsin", "Public Papers", "1995"]
  },
  {
    title: "Russia-U.S. Joint Statement on the Highly Enriched Uranium Agreement: Transparency Measures",
    institution: "GovInfo",
    lane: "ctr-heu",
    type: "Public Papers lead",
    priority: "High",
    date: "1996-04-21",
    identifier: "PPP-1996-book1-doc-pg617",
    url: "https://www.govinfo.gov/app/details/PPP-1996-book1/PPP-1996-book1-doc-pg617",
    note:
      "Public Papers anchor for the transparency measures under the HEU Agreement, including the blend-down of weapons-derived HEU into reactor fuel.",
    tags: ["HEU Agreement", "transparency measures", "Megatons to Megawatts", "1996"]
  },
  {
    title: "Statement on Arms Reduction Agreements With Russia and Ukraine",
    institution: "GovInfo",
    lane: "ctr-heu",
    type: "Public Papers lead",
    priority: "High",
    date: "1996-06-01",
    identifier: "PPP-1996-book1-doc-pg849",
    url: "https://www.govinfo.gov/app/details/PPP-1996-book1/PPP-1996-book1-doc-pg849",
    note:
      "Public Papers anchor for Ukraine's denuclearization milestone and Clinton's statement that CTR played a major role in eliminating former Soviet delivery systems and denuclearizing Ukraine.",
    tags: ["Ukraine", "CTR", "Nunn-Lugar", "START I"]
  },
  {
    title: "Statement on Signing the National Defense Authorization Act for Fiscal Year 1997",
    institution: "GovInfo",
    lane: "ctr-heu",
    type: "Public Papers lead",
    priority: "Medium",
    date: "1996-09-23",
    identifier: "PPP-1996-book2-doc-pg1645",
    url: "https://www.govinfo.gov/app/details/PPP-1996-book2/PPP-1996-book2-doc-pg1645",
    note:
      "Public Papers lead for Clinton's signing statement noting authorization for Nunn-Lugar Cooperative Threat Reduction and creation of the Nunn-Lugar II program.",
    tags: ["Nunn-Lugar II", "NDAA FY1997", "CTR", "1996"]
  },
  {
    title: "Steven Andreasen's Files",
    institution: "National Archives Catalog",
    lane: "ctbt",
    type: "Series",
    priority: "High",
    date: "1993-1996",
    identifier: "NAID 7585449",
    url: "https://catalog.archives.gov/id/7585449",
    note:
      "Prominent CTBT lead. A Clinton Library CTBT finding aid identifies Andreasen as the NSC Defense Policy and Arms Control staff member handling many CTBT matters.",
    tags: ["NAID 7585449", "Steven Andreasen", "CTBT", "nuclear testing"]
  },
  {
    title: "Statement on Extension of the Nuclear Non-Proliferation Treaty",
    institution: "GovInfo",
    lane: "ctbt",
    type: "Public Papers lead",
    priority: "High",
    date: "1995-05-11",
    identifier: "PPP-1995-book1-doc-pg680",
    url: "https://www.govinfo.gov/app/details/PPP-1995-book1/PPP-1995-book1-doc-pg680",
    note:
      "Public Papers anchor for the 1995 NPT indefinite extension, which should sit beside the CTBT material in the dedicated NPT/CTBT chapter.",
    tags: ["NPT", "NPT extension", "Public Papers", "1995"]
  },
  {
    title: "Records of the NSC Nonproliferation and Export Controls Office",
    institution: "National Archives Catalog",
    lane: "nonproliferation",
    type: "Collection",
    priority: "High",
    date: "Clinton administration",
    identifier: "NAID 7388773",
    url: "https://catalog.archives.gov/id/7388773",
    note:
      "Parent collection for the Clinton NSC office focused on nonproliferation and export-control policy. Child series include Daniel Poneman, Gary Samore, Steven Aoki, and subject files.",
    tags: ["NAID 7388773", "NSC", "nonproliferation", "export controls"]
  },
  {
    title: "Nonproliferation and Export Controls Subject Files",
    institution: "National Archives Catalog",
    lane: "nonproliferation",
    type: "Series",
    priority: "High",
    date: "1993-1996",
    identifier: "NAID 7585677",
    url: "https://catalog.archives.gov/id/7585677",
    note:
      "Likely collection-level subject file for NPT, MTCR, nuclear smuggling, export-control reform, and regional proliferation cases.",
    tags: ["NAID 7585677", "subject files", "NPT", "MTCR"]
  },
  {
    title: "Daniel Poneman's Files",
    institution: "National Archives Catalog",
    lane: "nonproliferation",
    type: "Series",
    priority: "High",
    date: "1993-1996",
    identifier: "NAID 7585685",
    url: "https://catalog.archives.gov/id/7585685",
    note:
      "Poneman is listed as office head through November 1996, making the series a direct Volume VII lead.",
    tags: ["NAID 7585685", "Daniel Poneman", "NPT", "export controls"]
  },
  {
    title: "Gary Samore's Files",
    institution: "National Archives Catalog",
    lane: "regional",
    type: "Series",
    priority: "Medium",
    date: "1995-2001",
    identifier: "NAID 7585686",
    url: "https://catalog.archives.gov/id/7585686",
    note:
      "Samore became office head in August 1995, so the series may bridge late Volume VII material and Volume VIII handoff context.",
    tags: ["NAID 7585686", "Gary Samore", "regional cases", "handoff"]
  },
  {
    title: "Nuclear Testing and Comprehensive Test Ban",
    institution: "Clinton Presidential Library",
    lane: "ctbt",
    type: "Finding aid",
    priority: "High",
    date: "1993-1996",
    identifier: "2011-0821-F",
    url: "https://www.clintonlibrary.gov/research/archives/finding-aids/nuclear-testing-and-comprehensive-test-ban",
    note:
      "FOIA collection with NSC memoranda, emails, and press on the nuclear testing review, PRD-19, and PDD-11. The finding aid reports 39 folders and about 4,020 pages.",
    tags: ["2011-0821-F", "PDD-11", "PRD-19", "CTBT"]
  },
  {
    title: "Congressional Ratification of the Comprehensive Test Ban Treaty",
    institution: "Clinton Presidential Library",
    lane: "ctbt",
    type: "Finding aid",
    priority: "Context",
    date: "1997-1999",
    identifier: "2015-1095-F",
    url: "https://www.clintonlibrary.gov/research/archives/finding-aids/congressional-ratification-comprehensive-test-ban-treaty-ctbt",
    note:
      "Mostly Volume VIII by date, but useful for identifying earlier CTBT files, Senate submission context, and Andreasen provenance.",
    tags: ["2015-1095-F", "CTBT", "Volume VIII handoff"]
  },
  {
    title: "Robert O. Boorstin, NSC Speechwriter",
    institution: "Clinton Presidential Library",
    lane: "ctbt",
    type: "Finding aid",
    priority: "Medium",
    date: "1994-1995",
    identifier: "2006-0460-F",
    url: "https://www.clintonlibrary.gov/research/archives/finding-aids/2006-0460-f-robert-o-boorstin-nsc-speechwriter",
    note:
      "Container list exposes speech and policy files for NPT, test ban, nonproliferation, nuclear smuggling, and nuclear disarmament.",
    tags: ["2006-0460-F", "NPT", "test ban", "nuclear smuggling"]
  },
  {
    title: "Antony Blinken, NSC Speechwriter",
    institution: "Clinton Presidential Library",
    lane: "cbw-conventional",
    type: "Finding aid",
    priority: "Medium",
    date: "1994-1998",
    identifier: "2006-0459-F",
    url: "https://www.clintonlibrary.gov/research/archives/finding-aids/2006-0459-f-antony-tony-blinken-nsc-speechwriter",
    note:
      "Speechwriting files include a September 12, 1996 Chemical Weapons Convention statement and later CWC event materials useful for tracing public language back to internal drafting.",
    tags: ["2006-0459-F", "speechwriting", "CWC", "public statements"]
  }
];

const milestones = [
  {
    date: "1993-03-09",
    title: "Statement on nuclear cooperation",
    lane: "nonproliferation",
    summary:
      "Early Clinton statement on nuclear cooperation and export criteria under the Nuclear Non-Proliferation Act framework.",
    url: "https://clintonwhitehouse6.archives.gov/1993/03/1993-03-09-statement-on-nuclear-cooperation.html"
  },
  {
    date: "1993-07-03",
    title: "PDD-11 nuclear testing policy",
    lane: "ctbt",
    summary:
      "The Clinton Library CTBT finding aid identifies July 3, 1993 as the date President Clinton issued PDD-11, a no-first-test nuclear policy in force until September 1994.",
    url: "https://www.clintonlibrary.gov/research/archives/finding-aids/nuclear-testing-and-comprehensive-test-ban"
  },
  {
    date: "1993-09-27",
    title: "Address to the United Nations General Assembly",
    lane: "nonproliferation",
    summary:
      "Clinton presented nonproliferation as one of the administration's urgent priorities and described policies on nuclear materials, test-ban diplomacy, CWC implementation, missile transfers, and export controls.",
    url: "https://clintonwhitehouse6.archives.gov/1993/09/1993-09-27-presidents-address-to-the-un.html"
  },
  {
    date: "1993-09-27",
    title: "Military planning and doctrine folded into nonproliferation policy",
    lane: "counterproliferation",
    summary:
      "The White House fact sheet directed greater attention to proliferation in intelligence collection, analysis, defense planning, force structure, and military planning for WMD and missile threats.",
    url: "https://www.rertr.anl.gov/REFDOCS/PRES93NP.html"
  },
  {
    date: "1993-12-07",
    title: "Defense Counterproliferation Initiative launched",
    lane: "counterproliferation",
    summary:
      "Secretary Les Aspin outlined the Defense Counterproliferation Initiative under PDD/NSC-18, adding protection and military capability to the prevention-centered nonproliferation agenda.",
    url: "https://irp.fas.org/offdocs/pdd18.htm"
  },
  {
    date: "1993-12-15",
    title: "Clinton publicly credits Aspin's counterproliferation initiative",
    lane: "counterproliferation",
    summary:
      "In Oval Office remarks on Aspin's resignation, Clinton identified the new counterproliferation initiative as one of Aspin's major contributions to post-Cold War defense policy.",
    url: "https://www.govinfo.gov/app/details/PPP-1993-book2/PPP-1993-book2-doc-pg2177"
  },
  {
    date: "1994-05-01",
    title: "Counterproliferation program review report",
    lane: "counterproliferation",
    summary:
      "The Office of the Deputy Secretary of Defense report surveyed activities and program options for countering proliferation and nuclear, biological, and chemical terrorism.",
    url: "https://www.osti.gov/biblio/377259"
  },
  {
    date: "1994-09-29",
    title: "Joint statement on strategic stability and nuclear security",
    lane: "strategic-arms",
    summary: "Public Papers lead from the Clinton-Yeltsin summit sequence, pp. 1659-1661.",
    url: "https://www.govinfo.gov/app/details/PPP-1994-book2/PPP-1994-book2-doc-pg1659"
  },
  {
    date: "1994-10-18",
    title: "Remarks on the nuclear agreement with North Korea",
    lane: "regional",
    summary: "Public Papers lead for the 1994 North Korea nuclear agreement, pp. 1794-1795.",
    url: "https://www.govinfo.gov/app/details/PPP-1994-book2/PPP-1994-book2-doc-pg1794"
  },
  {
    date: "1995-02-16",
    title: "Letter to Congress on chemical and biological weapons",
    lane: "cbw-conventional",
    summary:
      "Public record lead for CWC ratification and PrepCom work, BWC strengthening, and CBW proliferation reporting.",
    url: "https://clintonwhitehouse6.archives.gov/1995/02/1995-02-16-letter-to-congress-on-chemical-and-biological-weapons.html"
  },
  {
    date: "1995-05-10",
    title: "Russia-U.S. joint statements on missile systems and nonproliferation",
    lane: "strategic-arms",
    summary:
      "Moscow summit cluster: missile systems, nonproliferation, and transparency of nuclear weapons reduction, Public Papers pp. 667-672.",
    url: "https://www.govinfo.gov/app/details/PPP-1995-book1/PPP-1995-book1-doc-pg667"
  },
  {
    date: "1995-05-11",
    title: "Statement on extension of the Nuclear Non-Proliferation Treaty",
    lane: "ctbt",
    summary: "Public Papers lead for the NPT extension statement, pp. 680-681.",
    url: "https://www.govinfo.gov/app/details/PPP-1995-book1/PPP-1995-book1-doc-pg680"
  },
  {
    date: "1995-08-11",
    title: "Comprehensive nuclear weapons test ban negotiations",
    lane: "ctbt",
    summary:
      "Public Papers cluster with remarks and statement on CTBT negotiations, pp. 1251-1253.",
    url: "https://www.govinfo.gov/app/details/PPP-1995-book2/PPP-1995-book2-doc-pg1251"
  },
  {
    date: "1995-10-23",
    title: "Joint statement with President Yeltsin on nuclear materials security",
    lane: "ctr-heu",
    summary:
      "Public Papers lead for nuclear materials security and the 1995 bridge into CTR and HEU transparency implementation, pp. 1663-1664.",
    url: "https://www.govinfo.gov/app/details/PPP-1995-book2/PPP-1995-book2-doc-pg1663"
  },
  {
    date: "1995-10-27",
    title: "Counterproliferation framed as a national security priority",
    lane: "counterproliferation",
    summary:
      "Paul Kaminski's DOD speech text tied Clinton's 1995 national security strategy to capabilities for countering WMD and missile-delivery threats.",
    url: "https://www.osti.gov/biblio/612135"
  },
  {
    date: "1996-01-26",
    title: "Statement on Senate ratification of START II",
    lane: "start-ii",
    summary: "Public Papers lead for Senate ratification of the START II nuclear arms reduction treaty, pp. 104-105.",
    url: "https://www.govinfo.gov/app/details/PPP-1996-book1/PPP-1996-book1-doc-pg104"
  },
  {
    date: "1996-04-25",
    title: "Anthony Lake address on the arms-control agenda",
    lane: "cbw-conventional",
    summary:
      "Lake framed the 1996 arms-control agenda as strengthening the BWC, signing the CTBT, and ratifying the CWC.",
    url: "https://clintonwhitehouse6.archives.gov/1996/04/1996-04-25-anthony-lake-address-to-the-fletcher-school.html"
  },
  {
    date: "1996-04-21",
    title: "HEU Agreement transparency measures",
    lane: "ctr-heu",
    summary:
      "Russia-U.S. Public Papers statement on transparency measures under the Highly Enriched Uranium Agreement and the conversion of weapons-derived HEU into reactor fuel.",
    url: "https://www.govinfo.gov/app/details/PPP-1996-book1/PPP-1996-book1-doc-pg617"
  },
  {
    date: "1996-06-01",
    title: "Ukraine warheads removed and CTR implementation milestone",
    lane: "ctr-heu",
    summary:
      "Clinton marked the removal of all nuclear warheads from Ukraine and credited Cooperative Threat Reduction with a major role in former-Soviet weapons elimination.",
    url: "https://www.govinfo.gov/app/details/PPP-1996-book1/PPP-1996-book1-doc-pg849"
  },
  {
    date: "1996-09-10",
    title: "Remarks on the Comprehensive Nuclear Test Ban Treaty",
    lane: "ctbt",
    summary: "Public Papers lead from Kansas City on the CTBT, pp. 1525-1526.",
    url: "https://www.govinfo.gov/app/details/PPP-1996-book2/PPP-1996-book2-doc-pg1525"
  },
  {
    date: "1996-09-23",
    title: "NDAA FY1997 signs Nunn-Lugar and Nunn-Lugar II authority",
    lane: "ctr-heu",
    summary:
      "Clinton's signing statement for the FY1997 defense authorization noted CTR authorization and the creation of Nunn-Lugar II for biological, chemical, or nuclear WMD emergencies.",
    url: "https://www.govinfo.gov/app/details/PPP-1996-book2/PPP-1996-book2-doc-pg1645"
  },
  {
    date: "1996-11-12",
    title: "Letter on actions against weapons of mass destruction",
    lane: "cbw-conventional",
    summary:
      "Late-1996 public record lead for CWC ratification, BWC protocol work, Australia Group export controls, and CBW terrorism concerns.",
    url: "https://clintonwhitehouse6.archives.gov/1996/11/1996-11-12-letter-on-actions-vs-mass-destruction-weapons.html"
  }
];

const laneById = new Map(lanes.map((lane) => [lane.id, lane]));

Object.assign(window, {
  declassifiedChronology,
  libraryResearchPlan,
  compilerGaps,
  laneById
});

const leadCount = document.querySelector("#lead-count");
const laneCount = document.querySelector("#lane-count");
const milestoneCount = document.querySelector("#milestone-count");
const chronologyCount = document.querySelector("#chronology-count");
const documentCount = document.querySelector("#document-count");
const statementCount = document.querySelector("#statement-count");
const gapCount = document.querySelector("#gap-count");
const diaryCount = document.querySelector("#diary-count");
const lanesRoot = document.querySelector("#lanes-root");
const chronologyRoot = document.querySelector("#chronology-root");
const readinessRoot = document.querySelector("#readiness-root");
const leadsRoot = document.querySelector("#leads-root");
const documentsRoot = document.querySelector("#documents-root");
const statementsRoot = document.querySelector("#statements-root");
const milestonesRoot = document.querySelector("#milestones-root");
const gapsRoot = document.querySelector("#gaps-root");
const libraryRoot = document.querySelector("#library-root");
const diaryRoot = document.querySelector("#diary-root");
const dossiersRoot = document.querySelector("#dossiers-root");
const leadSearch = document.querySelector("#lead-search");
const laneFilter = document.querySelector("#lane-filter");
const institutionFilter = document.querySelector("#institution-filter");
const clearFilters = document.querySelector("#clear-filters");
const leadSummary = document.querySelector("#lead-summary");
const documentSearch = document.querySelector("#document-search");
const documentChapterFilter = document.querySelector("#document-chapter-filter");
const documentPriorityFilter = document.querySelector("#document-priority-filter");
const clearDocumentFilters = document.querySelector("#clear-document-filters");
const documentSummary = document.querySelector("#document-summary");
const statementSearch = document.querySelector("#statement-search");
const statementChapterFilter = document.querySelector("#statement-chapter-filter");
const statementYearFilter = document.querySelector("#statement-year-filter");
const clearStatementFilters = document.querySelector("#clear-statement-filters");
const statementSummary = document.querySelector("#statement-summary");

function formatDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function option(label, value = "") {
  const item = document.createElement("option");
  item.value = value;
  item.textContent = label;
  return item;
}

function startYear(value = "") {
  const match = String(value).match(/\d{4}/);
  return match ? Number(match[0]) : 9999;
}

function chronologySortKey(value = "") {
  const text = String(value);
  const exact = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (exact) return text;
  const month = text.match(/^(\d{4})-(\d{2})$/);
  if (month) return `${month[1]}-${month[2]}-99`;
  const year = text.match(/^(\d{4})/);
  return year ? `${year[1]}-99-99` : "9999-99-99";
}

function isDeclassifiedChronologyItem(item) {
  if (!item.date || startYear(item.date) > 1996) return false;

  const sourceBlob = [
    item.sourceType,
    item.sourceRepository,
    item.sourceCollection,
    item.category,
    item.level
  ]
    .filter(Boolean)
    .join(" ");
  const publicBlob = [item.sourceType, item.sourceRepository].filter(Boolean).join(" ");

  if (/finding aid/i.test(sourceBlob)) return false;
  if (/Public Papers|Archived White House|Congress|DOD|NRC|OSTI|FAS|Argonne/i.test(publicBlob)) return false;

  return /(declassified|released|MDR|Clinton Digital Library|Clinton-Russia|Presidential decision directive|directive)/i.test(
    sourceBlob
  );
}

function makeChip(text, className = "chip") {
  const chip = document.createElement("span");
  chip.className = className;
  chip.textContent = text;
  return chip;
}

function makeLink(url, label) {
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noreferrer";
  link.textContent = label;
  return link;
}

function publicPapersBook(identifier = "", date = "") {
  const match = identifier.match(/PPP-(\d{4})-book(\d)/);
  if (!match) return date ? date.slice(0, 4) : "year not surfaced";
  const roman = { 1: "I", 2: "II", 3: "III" };
  return `${match[1]}, Book ${roman[match[2]] || match[2]}`;
}

function cleanSourceCollection(item) {
  const collection = item.sourceCollection || "";
  if (!collection || collection === "NARA Scout cached result") return "";
  return collection;
}

function leadTitleLabel(item) {
  const level = `${item.level || ""}`.toLowerCase();
  if (level.includes("fileunit")) return "File-unit title";
  if (level.includes("packet")) return "Packet title";
  if (level.includes("collection") || item.sourceType?.includes("finding aid")) return "Collection title";
  return "Title";
}

function sourceNoteStatus(item) {
  const level = `${item.level || ""}`.toLowerCase();
  const type = `${item.sourceType || ""}`.toLowerCase();
  const category = `${item.category || ""}`.toLowerCase();

  if (type.includes("public papers") || item.sourceRepository === "GovInfo") {
    return "Published primary source.";
  }
  if (type.includes("congressional") || type.includes("senate")) {
    return "Published primary-source record; use with internal policy files before final document selection.";
  }
  if (type.includes("nara scout") || level.includes("fileunit")) {
    return "File-unit lead surfaced for research triage; item-level document text, classification, date, and pagination pending.";
  }
  if (level.includes("packet")) {
    return "Packet lead; exact item title, classification, and pagination pending.";
  }
  if (level.includes("collection") || type.includes("finding aid") || category.includes("finding aid")) {
    return "Collection-level lead; exact folder, item title, classification, and pagination pending.";
  }
  if (level.includes("source-path") || category.includes("source path")) {
    return "Source-path lead; replace with an item-level archival citation before final FRUS selection.";
  }
  if (level.includes("published")) {
    return "Published primary source.";
  }
  return "Research lead; verify item-level source details before final FRUS selection.";
}

function formatFrusSourceNote(item) {
  const existing = `${item.sourceNote || ""}`.trim();
  if (existing.startsWith("Source:") && !existing.includes("NARA Scout harvest")) return existing;

  if (item.sourceType === "Public Papers" || item.sourceRepository === "GovInfo") {
    const book = publicPapersBook(item.identifier, item.date);
    const pages = item.pages ? `, ${item.pages}` : "";
    return `Source: Public Papers of the Presidents of the United States: William J. Clinton, ${book}${pages}, "${item.title}"; GovInfo. Published primary source.`;
  }

  const repository =
    item.sourceRepository === "Clinton-Russia-High-Level"
      ? cleanSourceCollection(item) || "Clinton Library release packet"
      : item.sourceRepository || item.sourceType || "Repository pending";
  const collection =
    item.sourceRepository === "Clinton-Russia-High-Level" ? "" : cleanSourceCollection(item);
  const identifier = item.identifier || (item.naid ? `NAID ${item.naid}` : "");
  const path = [repository, collection, identifier].filter(Boolean).join(", ");
  const title = item.title ? ` ${leadTitleLabel(item)}: "${item.title}".` : "";
  const reviewCopy =
    item.sourceRepository === "Clinton-Russia-High-Level"
      ? " Review copy available through the companion Clinton-Russia page; verify the final citation against the owning release packet."
      : "";

  return `Source: ${path || "source path pending"}.${title} ${sourceNoteStatus(item)}${reviewCopy}`.replace(/\s+/g, " ");
}

function formatLibrarySourceNote(item) {
  const ids = (item.oaIds || []).map((id) => id.replace(/\.$/, ""));
  const idLabel = ids.some((id) => id.startsWith("Part ")) ? "references" : "OA/ID";
  const shownIds = ids.slice(0, 6).join(", ");
  const extra = ids.length > 6 ? `, plus ${ids.length - 6} more` : "";
  const oaText = ids.length ? `, ${idLabel} ${shownIds}${extra}` : "";
  return `Source: Clinton Presidential Library, 2013-0185-M folder-title lists, ${item.sourcePart || "part pending"}${oaText}. Folder-title lead; verify exact box, folder title, item date, classification, and pagination on site.`;
}

function priorityRank(priority) {
  return { Critical: 0, High: 1, A: 1, Medium: 2, B: 2, Low: 3, C: 3, Review: 4, Control: 4 }[priority] ?? 5;
}

function compareDossierRows(a, b) {
  return (
    priorityRank(a.priority) - priorityRank(b.priority) ||
    chronologySortKey(a.date || "").localeCompare(chronologySortKey(b.date || "")) ||
    (b.score || 0) - (a.score || 0) ||
    a.title.localeCompare(b.title)
  );
}

function isImmediateDossierRead(item) {
  const level = `${item.level || ""}`.toLowerCase();
  const type = `${item.sourceType || ""}`.toLowerCase();
  return level.includes("item-level review copy") || level.includes("published primary source") || type.includes("directive");
}

function uniqueDossierRows(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = [row.date, row.title, row.identifier || row.naid || row.sourceUrl || ""].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function gapMatchesChapter(gap, lane) {
  const blob = [gap.id, gap.lane, gap.title, gap.needed, ...(gap.targetTerms || [])]
    .join(" ")
    .toLowerCase();
  const aliases = {
    ctbt: ["npt", "ctbt", "test ban"],
    "strategic-arms": ["strategic", "nuclear security", "missile systems"],
    "start-ii": ["start ii", "start-ii", "duma"],
    "ctr-heu": ["ctr", "heu", "nunn-lugar", "cooperative threat reduction"],
    nonproliferation: ["nonproliferation regime", "mtcr", "fissile", "nuclear smuggling"],
    counterproliferation: ["counterproliferation", "pdd-18", "wmd planning"],
    regional: ["regional", "north korea", "iran", "iraq", "china", "south asia"],
    "cbw-conventional": ["cbw", "cwc", "bwc", "chemical weapons", "chemical and biological", "elisa harris", "australia group"],
    "conventional-landmines": ["conventional", "landmine", "ccw", "arms transfer"]
  };
  return (aliases[lane.id] || [lane.title.toLowerCase()]).some((term) => blob.includes(term));
}

function buildChapterDossier(lane) {
  const documents = potentialDocuments.filter((item) => item.chapterId === lane.id).sort(compareDossierRows);
  const chronology = declassifiedChronology.filter((item) => item.chapterId === lane.id).sort(compareDossierRows);
  const firstReads = uniqueDossierRows([...chronology, ...documents.filter(isImmediateDossierRead)])
    .sort(compareDossierRows)
    .slice(0, 3);
  const packetScreens = uniqueDossierRows(documents.filter((item) => !isImmediateDossierRead(item)))
    .sort(compareDossierRows)
    .slice(0, 3);
  const pulls = libraryResearchPlan
    .filter((item) => item.chapterId === lane.id)
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || a.title.localeCompare(b.title));
  const diaries = dailyDiaryReferences
    .filter((item) => item.chapterId === lane.id)
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || chronologySortKey(a.date).localeCompare(chronologySortKey(b.date)));
  const statements = clintonPublicStatements
    .filter((item) => item.chapterId === lane.id)
    .sort((a, b) => chronologySortKey(a.date).localeCompare(chronologySortKey(b.date)) || a.title.localeCompare(b.title));
  const specificRisks = compilerGaps.filter((gap) => gapMatchesChapter(gap, lane));
  const globalRisks = compilerGaps.filter((gap) =>
    ["gap-source-base-diversity", "gap-nara-file-unit-quality", "gap-public-statements-as-locators"].includes(gap.id)
  );
  const risks = uniqueDossierRows([
    ...specificRisks.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || a.title.localeCompare(b.title)),
    ...globalRisks.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || a.title.localeCompare(b.title))
  ]).slice(0, 3);

  const nextMove =
    specificRisks.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || a.title.localeCompare(b.title))[0]
      ?.nextActions?.[0] ||
    pulls[0]?.onsiteActions?.[0] ||
    (packetScreens[0] ? `Screen packet lead: ${packetScreens[0].title}` : "") ||
    (firstReads[0] ? `Close-read: ${firstReads[0].title}` : "Hold for additional source discovery.");

  return { lane, documents, chronology, firstReads, packetScreens, pulls, diaries, statements, risks, nextMove };
}

function makeDossierList(title, items, emptyText, renderItem) {
  const block = document.createElement("div");
  block.className = "dossier-block";
  const heading = document.createElement("h4");
  heading.textContent = title;
  const list = document.createElement("ul");
  list.className = "dossier-list";

  if (!items.length) {
    const empty = document.createElement("li");
    empty.textContent = emptyText;
    list.append(empty);
  } else {
    for (const item of items) {
      const row = document.createElement("li");
      row.textContent = renderItem(item);
      list.append(row);
    }
  }

  block.append(heading, list);
  return block;
}

function renderChapterDossiers() {
  if (!dossiersRoot) return;

  const dossiers = lanes.filter((lane) => lane.id !== "volume-control").map(buildChapterDossier);
  const cards = dossiers.map((dossier) => {
    const { lane, documents, chronology, firstReads, packetScreens, pulls, diaries, statements, risks, nextMove } = dossier;
    const card = document.createElement("article");
    card.className = "dossier-card";

    const header = document.createElement("div");
    header.className = "dossier-card-header";
    const title = document.createElement("h3");
    title.textContent = lane.title;
    const number = makeChip(lane.number, "priority-chip");
    header.append(title, number);

    const metrics = document.createElement("div");
    metrics.className = "dossier-metrics";
    for (const metric of [
      ["Docs", documents.length],
      ["Chronology", chronology.length],
      ["Pulls", pulls.length],
      ["Diary", diaries.length]
    ]) {
      const item = document.createElement("span");
      item.textContent = `${metric[1]} ${metric[0]}`;
      metrics.append(item);
    }

    const action = document.createElement("p");
    action.className = "dossier-next";
    action.textContent = `Next move: ${nextMove}`;

    const firstReadList = makeDossierList(
      "First Read",
      firstReads,
      "No item-level or released leads staged yet.",
      (item) => `${formatDate(item.date || "date pending")}: ${item.title}`
    );
    const packetList = makeDossierList(
      "Packet Or Pull",
      pulls.length ? pulls.slice(0, 3) : packetScreens,
      "No packet or library pull staged yet.",
      (item) =>
        item.oaIds
          ? `${item.priority}: ${item.title} (${(item.oaIds || []).slice(0, 4).join(", ")})`
          : `${item.priority || "Review"}: ${item.title}`
    );
    const publicList = makeDossierList(
      "Date Controls",
      [...diaries.filter((item) => item.priority === "High").slice(0, 2), ...statements.slice(0, 2)].slice(0, 3),
      "No diary or public-statement date control staged yet.",
      (item) => `${formatDate(item.date || "date pending")}: ${item.title}`
    );
    const riskList = makeDossierList(
      "Risk Controls",
      risks,
      "No specific source risk staged.",
      (gap) => `${gap.priority}: ${gap.title}`
    );

    card.append(header, metrics, action, firstReadList, packetList, publicList, riskList);
    return card;
  });

  dossiersRoot.replaceChildren(...cards);
}

function classifySelectionReadiness(item) {
  const level = `${item.level || ""}`.toLowerCase();
  const type = `${item.sourceType || ""}`.toLowerCase();
  const repo = `${item.sourceRepository || ""}`.toLowerCase();
  const category = `${item.category || ""}`.toLowerCase();
  const sourceBlob = [level, type, repo, category, item.sourceCollection || ""].join(" ");

  if (
    /public papers|govinfo|archived white house|congress|senate|osti|dod|nrc|fas|argonne|nuclear regulatory commission|department of defense text/i.test(
      sourceBlob
    )
  ) {
    return {
      queue: "Date/control anchor",
      readiness: "Published or public primary-source locator",
      nextAction: "Use the date, public claim, or treaty-text endpoint; pair with internal policy, clearance, or implementation records before final selection.",
      requiredVerification: [
        "published citation",
        "policy claim to match",
        "internal counterpart",
        "chapter placement"
      ]
    };
  }

  if (isDeclassifiedChronologyItem(item) && (item.digitalObjectUrl || repo.includes("clinton-russia") || type.includes("directive"))) {
    return {
      queue: "Close-read now",
      readiness: "Document-level or review-copy candidate",
      nextAction: "Close-read the text and record final citation fields before deciding whether it belongs in the chronology.",
      requiredVerification: [
        "owning repository",
        "folder path",
        "item date",
        "author/recipient",
        "classification markings",
        "pagination"
      ]
    };
  }

  if (type.includes("nara scout") || level.includes("fileunit")) {
    return {
      queue: "Resolve file unit",
      readiness: "File-unit lead",
      nextAction: "Open the Catalog or Scout trail, identify item boundaries, and replace the row with an item-level document candidate.",
      requiredVerification: [
        "box/folder path",
        "item title",
        "item date",
        "classification markings",
        "page range",
        "digital-object status"
      ]
    };
  }

  if (level.includes("packet") || type.includes("mdr") || repo.includes("clinton digital library")) {
    return {
      queue: "Screen packet",
      readiness: "MDR or release-packet lead",
      nextAction: "Screen the packet for discrete memoranda, cables, telcons, memcons, directives, or action papers.",
      requiredVerification: [
        "packet page range",
        "exact item title",
        "item date",
        "classification markings",
        "attachments",
        "final source note"
      ]
    };
  }

  if (level.includes("source-path") || level.includes("collection") || type.includes("finding aid") || category.includes("source path")) {
    return {
      queue: "Pull source path",
      readiness: "Collection, finding-aid, or source-path lead",
      nextAction: "Use as a call-slip or search-path lead until a specific item-level record is located.",
      requiredVerification: [
        "requestable identifier",
        "box/folder title",
        "item boundaries",
        "date span",
        "classification markings",
        "selection relevance"
      ]
    };
  }

  return {
    queue: "Hold for review",
    readiness: "Unclassified research lead",
    nextAction: "Keep as a locator until stronger source details or a document image are found.",
    requiredVerification: ["source class", "exact item", "date", "source note", "compiler relevance"]
  };
}

const selectionReadinessQueue = potentialDocuments.map((item) => ({
  ...item,
  readiness: classifySelectionReadiness(item)
}));

function readinessQueueRank(queue) {
  return {
    "Close-read now": 0,
    "Screen packet": 1,
    "Resolve file unit": 2,
    "Pull source path": 3,
    "Date/control anchor": 4,
    "Hold for review": 5
  }[queue] ?? 6;
}

function renderSelectionReadiness() {
  if (!readinessRoot) return;

  const groups = [...new Set(selectionReadinessQueue.map((item) => item.readiness.queue))].sort(
    (a, b) => readinessQueueRank(a) - readinessQueueRank(b)
  );
  const cards = groups.map((queue) => {
    const items = selectionReadinessQueue
      .filter((item) => item.readiness.queue === queue)
      .sort(compareDossierRows);
    const card = document.createElement("article");
    card.className = "readiness-card";

    const header = document.createElement("div");
    header.className = "readiness-card-header";
    const title = document.createElement("h3");
    title.textContent = queue;
    const count = makeChip(`${items.length} leads`, "priority-chip");
    header.append(title, count);

    const note = document.createElement("p");
    note.className = "readiness-note";
    note.textContent = items[0]?.readiness.nextAction || "No staged action.";

    const list = document.createElement("ul");
    list.className = "readiness-list";
    for (const item of items.slice(0, 5)) {
      const row = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = item.title;
      const meta = document.createElement("span");
      meta.textContent = `${item.chapterTitle || laneById.get(item.chapterId)?.title || item.chapterId} / ${
        item.date || "date pending"
      } / ${item.priority || "Review"}`;
      row.append(title, meta);
      list.append(row);
    }

    const fields = document.createElement("p");
    fields.className = "readiness-fields";
    fields.textContent = `Verify: ${(items[0]?.readiness.requiredVerification || []).join(", ") || "source details"}`;

    card.append(header, note, list, fields);
    return card;
  });

  readinessRoot.replaceChildren(...cards);
}

function setStats() {
  leadCount.textContent = sourceLeads.length.toString();
  laneCount.textContent = lanes.length.toString();
  milestoneCount.textContent = milestones.length.toString();
  if (chronologyCount) chronologyCount.textContent = declassifiedChronology.length.toString();
  documentCount.textContent = potentialDocuments.length.toString();
  statementCount.textContent = clintonPublicStatements.length.toString();
  if (gapCount) gapCount.textContent = compilerGaps.length.toString();
  if (diaryCount) diaryCount.textContent = dailyDiaryReferences.length.toString();
}

function populateFilters() {
  laneFilter.replaceChildren(option("All chapters"));
  for (const lane of lanes) {
    laneFilter.append(option(lane.title, lane.id));
  }

  institutionFilter.replaceChildren(option("All institutions"));
  for (const institution of unique(sourceLeads.map((lead) => lead.institution))) {
    institutionFilter.append(option(institution, institution));
  }

  documentChapterFilter.replaceChildren(option("All chapters"));
  for (const lane of lanes.filter((lane) => lane.id !== "volume-control")) {
    documentChapterFilter.append(option(lane.title, lane.id));
  }

  documentPriorityFilter.replaceChildren(option("All priorities"));
  for (const priority of unique(potentialDocuments.map((item) => item.priority))) {
    documentPriorityFilter.append(option(priority, priority));
  }

  statementChapterFilter.replaceChildren(option("All chapters"));
  for (const lane of lanes.filter((lane) => lane.id !== "volume-control")) {
    statementChapterFilter.append(option(lane.title, lane.id));
  }

  statementYearFilter.replaceChildren(option("All years"));
  for (const year of unique(clintonPublicStatements.map((item) => (item.date || "").slice(0, 4)))) {
    statementYearFilter.append(option(year, year));
  }
}

function renderLanes() {
  const cards = lanes.map((lane) => {
    const card = document.createElement("article");
    card.className = "lane-card";
    card.id = `lane-${lane.id}`;

    const number = document.createElement("strong");
    number.textContent = lane.number;

    const title = document.createElement("h3");
    title.textContent = lane.title;

    const summary = document.createElement("p");
    summary.textContent = lane.summary;

    const meta = document.createElement("div");
    meta.className = "lane-meta";
    meta.append(makeChip(lane.status, "priority-chip"));
    for (const topic of lane.topics) meta.append(makeChip(topic));

    card.append(number, title, summary, meta);
    return card;
  });

  lanesRoot.replaceChildren(...cards);
}

function renderDeclassifiedChronology() {
  if (!chronologyRoot) return;

  if (!declassifiedChronology.length) {
    const empty = document.createElement("p");
    empty.className = "loading";
    empty.textContent = "No dated declassified document leads are currently staged.";
    chronologyRoot.replaceChildren(empty);
    return;
  }

  const cards = declassifiedChronology.map((item) => {
    const card = document.createElement("article");
    card.className = "document-card chronology-card";

    const main = document.createElement("div");
    const type = document.createElement("p");
    type.className = "record-type";
    type.textContent = `${item.sourceType} / ${item.sourceRepository || item.sourceCollection || "Source"}`;

    const title = document.createElement("h3");
    title.textContent = item.title;

    const summary = document.createElement("p");
    summary.textContent = item.summary || "Released or declassified archival lead for chronological review.";

    const sourceNote = document.createElement("p");
    sourceNote.className = "source-note";
    sourceNote.textContent = formatFrusSourceNote(item);

    const links = document.createElement("div");
    links.className = "document-links";
    if (item.sourceUrl) links.append(makeLink(item.sourceUrl, "Open source"));
    if (item.digitalObjectUrl) links.append(makeLink(item.digitalObjectUrl, "Open review copy"));
    if (item.scoutSearchUrl) links.append(makeLink(item.scoutSearchUrl, "Open Scout search"));

    const tags = document.createElement("div");
    tags.className = "lead-tags";
    tags.append(makeChip(item.chapterTitle || laneById.get(item.chapterId)?.title || item.chapterId, "priority-chip"));
    if (item.level) tags.append(makeChip(item.level));
    if (item.confidence) tags.append(makeChip(`Confidence: ${item.confidence}`));

    main.append(type, title, summary);
    if (item.compilerRisk) {
      const risk = document.createElement("p");
      risk.className = "risk-note";
      risk.textContent = `Compiler risk: ${item.compilerRisk}`;
      main.append(risk);
    }
    main.append(sourceNote, links, tags);

    const side = document.createElement("div");
    side.className = "document-side chronology-side";
    side.append(makeChip(formatDate(item.date), "priority-chip"));
    side.append(makeChip(item.priority || "Review"));
    side.append(makeChip(item.identifier || item.naid || "source id pending"));
    if (item.category) side.append(makeChip(item.category));

    card.append(main, side);
    return card;
  });

  chronologyRoot.replaceChildren(...cards);
}

function leadSearchText(lead) {
  return [
    lead.title,
    lead.institution,
    lead.lane,
    laneById.get(lead.lane)?.title,
    lead.type,
    lead.priority,
    lead.date,
    lead.identifier,
    lead.note,
    ...(lead.tags || [])
  ]
    .join(" ")
    .toLowerCase();
}

function filteredLeads() {
  const query = leadSearch.value.trim().toLowerCase();
  const lane = laneFilter.value;
  const institution = institutionFilter.value;

  return sourceLeads.filter((lead) => {
    if (lane && lead.lane !== lane) return false;
    if (institution && lead.institution !== institution) return false;
    return !query || leadSearchText(lead).includes(query);
  });
}

function renderLeads() {
  const leads = filteredLeads();

  leadSummary.textContent = `${leads.length} of ${sourceLeads.length} source leads shown`;

  if (!leads.length) {
    const empty = document.createElement("p");
    empty.className = "loading";
    empty.textContent = "No source leads match the current filters.";
    leadsRoot.replaceChildren(empty);
    return;
  }

  const cards = leads.map((lead) => {
    const card = document.createElement("article");
    card.className = "lead-card";

    const main = document.createElement("div");
    const type = document.createElement("p");
    type.className = "record-type";
    type.textContent = `${lead.type} / ${lead.institution}`;

    const title = document.createElement("h3");
    title.textContent = lead.title;

    const note = document.createElement("p");
    note.textContent = lead.note;

    const link = makeLink(lead.url, "Open source");

    const tags = document.createElement("div");
    tags.className = "lead-tags";
    tags.append(makeChip(laneById.get(lead.lane)?.title || lead.lane, "priority-chip"));
    for (const tag of lead.tags || []) tags.append(makeChip(tag));

    main.append(type, title, note, link, tags);

    const side = document.createElement("div");
    side.className = "lead-side";
    side.append(makeChip(lead.priority, "priority-chip"));
    side.append(makeChip(lead.date));
    side.append(makeChip(lead.identifier));

    card.append(main, side);
    return card;
  });

  leadsRoot.replaceChildren(...cards);
}

function documentSearchText(item) {
  return [
    item.title,
    item.chapterId,
    item.chapterTitle,
    item.sourceType,
    item.sourceRepository,
    item.sourceCollection,
    item.priority,
    item.date,
    item.identifier,
    item.category,
    item.level,
    item.sourceNote,
    formatFrusSourceNote(item),
    item.summary,
    item.confidence,
    item.compilerRisk,
    ...(item.matchedQueries || []),
    ...(item.topics || [])
  ]
    .join(" ")
    .toLowerCase();
}

function filteredDocuments() {
  const query = documentSearch.value.trim().toLowerCase();
  const chapter = documentChapterFilter.value;
  const priority = documentPriorityFilter.value;

  return potentialDocuments.filter((item) => {
    if (chapter && item.chapterId !== chapter) return false;
    if (priority && item.priority !== priority) return false;
    return !query || documentSearchText(item).includes(query);
  });
}

function renderDocuments() {
  const items = filteredDocuments();

  documentSummary.textContent = `${items.length} of ${potentialDocuments.length} potential documents shown; ${sourceGapLeads.length} added from the compiler-gap pass`;

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "loading";
    empty.textContent = "No potential documents match the current filters.";
    documentsRoot.replaceChildren(empty);
    return;
  }

  const cards = items.map((item) => {
    const card = document.createElement("article");
    card.className = "document-card";

    const main = document.createElement("div");
    const type = document.createElement("p");
    type.className = "record-type";
    type.textContent = `${item.sourceType} / ${item.sourceRepository || item.sourceCollection || "Source"}`;

    const title = document.createElement("h3");
    title.textContent = item.title;

    const summary = document.createElement("p");
    summary.textContent = item.summary || item.sourceNote || "Candidate record for chapter review.";

    const sourceNote = document.createElement("p");
    sourceNote.className = "source-note";
    sourceNote.textContent = formatFrusSourceNote(item);

    const links = document.createElement("div");
    links.className = "document-links";
    if (item.sourceUrl) links.append(makeLink(item.sourceUrl, "Open source"));
    if (item.digitalObjectUrl) links.append(makeLink(item.digitalObjectUrl, "Open digital object"));
    if (item.scoutSearchUrl) links.append(makeLink(item.scoutSearchUrl, "Open Scout search"));

    const tags = document.createElement("div");
    tags.className = "lead-tags";
    tags.append(makeChip(item.chapterTitle || laneById.get(item.chapterId)?.title || item.chapterId, "priority-chip"));
    if (item.confidence) tags.append(makeChip(`Confidence: ${item.confidence}`));
    if (item.level) tags.append(makeChip(item.level));
    for (const query of (item.matchedQueries || []).slice(0, 3)) tags.append(makeChip(query));

    main.append(type, title, summary);
    if (item.compilerRisk) {
      const risk = document.createElement("p");
      risk.className = "risk-note";
      risk.textContent = `Compiler risk: ${item.compilerRisk}`;
      main.append(risk);
    }
    main.append(sourceNote, links, tags);

    const side = document.createElement("div");
    side.className = "document-side";
    side.append(makeChip(item.priority || "Review", "priority-chip"));
    side.append(makeChip(item.date || "date not surfaced"));
    side.append(makeChip(item.identifier || item.naid || "source id pending"));
    if (item.category) side.append(makeChip(item.category));
    if (item.confidence) side.append(makeChip(`confidence ${item.confidence}`));
    if (item.digitalObjects) side.append(makeChip(`${item.digitalObjects} digital object${item.digitalObjects === 1 ? "" : "s"}`));

    card.append(main, side);
    return card;
  });

  documentsRoot.replaceChildren(...cards);
}

function statementSearchText(item) {
  return [
    item.title,
    item.chapterId,
    item.chapterTitle,
    item.date,
    item.identifier,
    item.pages,
    item.sourceNote,
    formatFrusSourceNote(item),
    item.summary,
    ...(item.topics || [])
  ]
    .join(" ")
    .toLowerCase();
}

function filteredStatements() {
  const query = statementSearch.value.trim().toLowerCase();
  const chapter = statementChapterFilter.value;
  const year = statementYearFilter.value;

  return clintonPublicStatements.filter((item) => {
    if (chapter && item.chapterId !== chapter) return false;
    if (year && !`${item.date || ""}`.startsWith(year)) return false;
    return !query || statementSearchText(item).includes(query);
  });
}

function renderStatements() {
  const items = filteredStatements();

  statementSummary.textContent = `${items.length} of ${clintonPublicStatements.length} Clinton public statements shown`;

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "loading";
    empty.textContent = "No Clinton public statements match the current filters.";
    statementsRoot.replaceChildren(empty);
    return;
  }

  const cards = items.map((item) => {
    const card = document.createElement("article");
    card.className = "statement-card";

    const date = document.createElement("div");
    date.className = "statement-date";
    date.textContent = formatDate(item.date);

    const main = document.createElement("div");
    const type = document.createElement("p");
    type.className = "record-type";
    type.textContent = `${item.sourceRepository || "GovInfo"} / ${item.sourceCollection || "Public Papers of the Presidents"}`;

    const title = document.createElement("h3");
    title.textContent = item.title;

    const note = document.createElement("p");
    note.className = "source-note";
    note.textContent = formatFrusSourceNote(item);

    const links = document.createElement("div");
    links.className = "document-links";
    if (item.sourceUrl) links.append(makeLink(item.sourceUrl, "Open GovInfo"));
    if (item.digitalObjectUrl) links.append(makeLink(item.digitalObjectUrl, "Open PDF"));

    const tags = document.createElement("div");
    tags.className = "lead-tags";
    tags.append(makeChip(item.chapterTitle || laneById.get(item.chapterId)?.title || item.chapterId, "priority-chip"));
    if (item.pages) tags.append(makeChip(item.pages));
    if (item.identifier) tags.append(makeChip(item.identifier));

    main.append(type, title, note, links, tags);
    card.append(date, main);
    return card;
  });

  statementsRoot.replaceChildren(...cards);
}

function renderMilestones() {
  const cards = [...milestones]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((milestone) => {
      const card = document.createElement("article");
      card.className = "milestone-card";

      const date = document.createElement("div");
      date.className = "milestone-date";
      date.textContent = formatDate(milestone.date);

      const body = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = milestone.title;
      const summary = document.createElement("p");
      summary.textContent = milestone.summary;
      const tags = document.createElement("div");
      tags.className = "lead-tags";
      tags.append(makeChip(laneById.get(milestone.lane)?.title || milestone.lane, "priority-chip"));
      tags.append(makeLink(milestone.url, "Open record"));

      body.append(title, summary, tags);
      card.append(date, body);
      return card;
    });

  milestonesRoot.replaceChildren(...cards);
}

function gapPriorityRank(priority) {
  return { Critical: 0, High: 1, Medium: 2, Review: 3 }[priority] ?? 4;
}

function renderGaps() {
  if (!gapsRoot) return;

  if (!compilerGaps.length) {
    const empty = document.createElement("p");
    empty.className = "loading";
    empty.textContent = "No compiler gaps are currently staged.";
    gapsRoot.replaceChildren(empty);
    return;
  }

  const metrics = document.createElement("div");
  metrics.className = "gap-metrics";
  const highCount = compilerGaps.filter((gap) => ["Critical", "High"].includes(gap.priority)).length;
  const sourcePoolCount = new Set(compilerGaps.flatMap((gap) => gap.sourcePools || [])).size;
  for (const item of [
    ["Open gaps", compilerGaps.length, "Tracked compiler-risk issues"],
    ["Critical/high", highCount, "Needs source review before final selection"],
    ["New source leads", sourceGapLeads.length, "Added document or source-path candidates"],
    ["Source pools", sourcePoolCount, "Institutions or record groups to pursue"]
  ]) {
    const card = document.createElement("article");
    card.className = "gap-metric";
    const value = document.createElement("strong");
    value.textContent = item[1].toString();
    const label = document.createElement("span");
    label.textContent = item[0];
    const note = document.createElement("p");
    note.textContent = item[2];
    card.append(value, label, note);
    metrics.append(card);
  }

  const list = document.createElement("div");
  list.className = "gap-list";
  for (const gap of [...compilerGaps].sort(
    (a, b) => gapPriorityRank(a.priority) - gapPriorityRank(b.priority) || a.title.localeCompare(b.title)
  )) {
    const card = document.createElement("article");
    card.className = `gap-card gap-priority-${String(gap.priority || "review").toLowerCase()}`;

    const header = document.createElement("div");
    header.className = "gap-card-header";
    const heading = document.createElement("h3");
    heading.textContent = gap.title;
    const badge = makeChip(gap.priority || "Review", "gap-badge");
    header.append(heading, badge);

    const meta = document.createElement("div");
    meta.className = "lead-tags";
    for (const value of [gap.lane, gap.status, `${gap.targetRecords?.length || 0} target IDs`]) {
      if (value) meta.append(makeChip(value));
    }

    const evidence = document.createElement("p");
    evidence.className = "gap-evidence";
    evidence.textContent = gap.evidence;

    const problem = document.createElement("p");
    problem.className = "gap-problem";
    problem.textContent = gap.problem;

    const needed = document.createElement("p");
    needed.className = "gap-needed";
    needed.textContent = gap.needed;

    const actions = document.createElement("ul");
    actions.className = "gap-actions";
    for (const action of gap.nextActions || []) {
      const item = document.createElement("li");
      item.textContent = action;
      actions.append(item);
    }

    const pullList = document.createElement("p");
    pullList.className = "gap-pull-list";
    pullList.textContent = `Pull list: ${(gap.targetRecords || []).join(", ") || "source search required"}`;

    card.append(header, meta, evidence, problem, needed, actions, pullList);
    list.append(card);
  }

  gapsRoot.replaceChildren(metrics, list);
}

function libraryPriorityRank(priority) {
  return { Control: 0, A: 1, B: 2, C: 3 }[priority] ?? 4;
}

function renderLibraryPlan() {
  if (!libraryRoot) return;

  if (!libraryResearchPlan.length) {
    const empty = document.createElement("p");
    empty.className = "loading";
    empty.textContent = "No Clinton Library research plan is currently staged.";
    libraryRoot.replaceChildren(empty);
    return;
  }

  const metrics = document.createElement("div");
  metrics.className = "library-metrics";
  const aPriority = libraryResearchPlan.filter((item) => item.priority === "A").length;
  const oaCount = new Set(libraryResearchPlan.flatMap((item) => item.oaIds || [])).size;
  const offices = new Set(libraryResearchPlan.map((item) => item.office).filter(Boolean)).size;
  for (const item of [
    ["Pull clusters", libraryResearchPlan.length, "Folder groups staged from 2013-0185-M"],
    ["A-priority", aPriority, "First-day pulls"],
    ["OA/ID refs", oaCount, "Call-slip identifiers to verify"],
    ["Office lanes", offices, "NSC staff or office groupings"]
  ]) {
    const card = document.createElement("article");
    card.className = "library-metric";
    const value = document.createElement("strong");
    value.textContent = item[1].toString();
    const label = document.createElement("span");
    label.textContent = item[0];
    const note = document.createElement("p");
    note.textContent = item[2];
    card.append(value, label, note);
    metrics.append(card);
  }

  const list = document.createElement("div");
  list.className = "library-list";
  for (const item of [...libraryResearchPlan].sort(
    (a, b) => libraryPriorityRank(a.priority) - libraryPriorityRank(b.priority) || a.title.localeCompare(b.title)
  )) {
    const card = document.createElement("article");
    card.className = `library-card library-priority-${String(item.priority || "review").toLowerCase()}`;

    const header = document.createElement("div");
    header.className = "library-card-header";
    const heading = document.createElement("h3");
    heading.textContent = item.title;
    const badge = makeChip(item.priority || "Review", "library-badge");
    header.append(heading, badge);

    const meta = document.createElement("div");
    meta.className = "lead-tags";
    for (const value of [item.chapterTitle, item.sourcePart, item.office]) {
      if (value) meta.append(makeChip(value));
    }

    const goal = document.createElement("p");
    goal.className = "library-goal";
    goal.textContent = item.visitGoal;

    const reason = document.createElement("p");
    reason.className = "library-reason";
    reason.textContent = item.whyItMatters;

    const sourceNote = document.createElement("p");
    sourceNote.className = "source-note";
    sourceNote.textContent = formatLibrarySourceNote(item);

    const actions = document.createElement("ul");
    actions.className = "library-actions";
    for (const action of item.onsiteActions || []) {
      const actionItem = document.createElement("li");
      actionItem.textContent = action;
      actions.append(actionItem);
    }

    const pullList = document.createElement("p");
    pullList.className = "library-pull-list";
    pullList.textContent = `OA/ID pull list: ${(item.oaIds || []).join(", ")}`;

    const terms = document.createElement("div");
    terms.className = "lead-tags";
    for (const term of item.targetTerms || []) terms.append(makeChip(term));

    card.append(header, meta, goal, reason, sourceNote, actions, pullList, terms);
    list.append(card);
  }

  libraryRoot.replaceChildren(metrics, list);
}

function diaryPriorityRank(priority) {
  return { High: 0, Medium: 1, Review: 2 }[priority] ?? 3;
}

function renderDailyDiaryReferences() {
  if (!diaryRoot) return;

  if (!dailyDiaryReferences.length) {
    const empty = document.createElement("p");
    empty.className = "loading";
    empty.textContent = "No Presidential Daily Diary references are currently staged.";
    diaryRoot.replaceChildren(empty);
    return;
  }

  const metrics = document.createElement("div");
  metrics.className = "diary-metrics";
  const hardcopyCount = dailyDiaryReferences.filter((item) => item.sourcePath === "2010-0083-F hardcopy scan").length;
  const highCount = dailyDiaryReferences.filter((item) => item.priority === "High").length;
  const chapterCount = new Set(dailyDiaryReferences.map((item) => item.chapterId).filter(Boolean)).size;
  for (const item of [
    ["Diary refs", dailyDiaryReferences.length, "Calls or meetings staged for follow-up"],
    ["Hardcopy hits", hardcopyCount, "Confirmed in 2010-0083-F scans"],
    ["High priority", highCount, "Likely worth telcon, memcon, or PC/DC follow-up"],
    ["Chapters", chapterCount, "Volume VII chapters touched"]
  ]) {
    const card = document.createElement("article");
    card.className = "diary-metric";
    const value = document.createElement("strong");
    value.textContent = item[1].toString();
    const label = document.createElement("span");
    label.textContent = item[0];
    const note = document.createElement("p");
    note.textContent = item[2];
    card.append(value, label, note);
    metrics.append(card);
  }

  const list = document.createElement("div");
  list.className = "diary-list";
  for (const item of [...dailyDiaryReferences].sort(
    (a, b) =>
      `${a.date || "9999"}`.localeCompare(`${b.date || "9999"}`) ||
      diaryPriorityRank(a.priority) - diaryPriorityRank(b.priority) ||
      a.title.localeCompare(b.title)
  )) {
    const card = document.createElement("article");
    card.className = `diary-card diary-priority-${String(item.priority || "review").toLowerCase()}`;

    const header = document.createElement("div");
    header.className = "diary-card-header";
    const heading = document.createElement("h3");
    heading.textContent = item.title;
    const badge = makeChip(item.priority || "Review", "diary-badge");
    header.append(heading, badge);

    const meta = document.createElement("div");
    meta.className = "lead-tags";
    for (const value of [formatDate(item.date), item.eventType, item.chapterTitle, item.sourcePath]) {
      if (value) meta.append(makeChip(value));
    }

    const participants = document.createElement("p");
    participants.className = "diary-participants";
    participants.textContent = `Participants: ${(item.participants || []).join(", ") || "pending"}`;

    const relevance = document.createElement("p");
    relevance.className = "diary-relevance";
    relevance.textContent = item.relevance;

    const verification = document.createElement("p");
    verification.className = "risk-note";
    verification.textContent = `Verification: ${item.verification}`;

    const sourceNote = document.createElement("p");
    sourceNote.className = "source-note";
    sourceNote.textContent = item.sourceNote;

    const links = document.createElement("div");
    links.className = "document-links";
    if (item.sourceUrl) links.append(makeLink(item.sourceUrl, "Open source"));
    if (item.digitalObjectUrl) links.append(makeLink(item.digitalObjectUrl, "Open diary scan"));
    if (item.catalogSearchUrl) links.append(makeLink(item.catalogSearchUrl, "Open Catalog search"));

    card.append(header, meta, participants, relevance, verification, sourceNote, links);
    list.append(card);
  }

  diaryRoot.replaceChildren(metrics, list);
}

function bindEvents() {
  for (const control of [leadSearch, laneFilter, institutionFilter]) {
    control.addEventListener("input", renderLeads);
    control.addEventListener("change", renderLeads);
  }

  for (const control of [documentSearch, documentChapterFilter, documentPriorityFilter]) {
    control.addEventListener("input", renderDocuments);
    control.addEventListener("change", renderDocuments);
  }

  for (const control of [statementSearch, statementChapterFilter, statementYearFilter]) {
    control.addEventListener("input", renderStatements);
    control.addEventListener("change", renderStatements);
  }

  clearFilters.addEventListener("click", () => {
    leadSearch.value = "";
    laneFilter.value = "";
    institutionFilter.value = "";
    renderLeads();
    leadSearch.focus();
  });

  clearDocumentFilters.addEventListener("click", () => {
    documentSearch.value = "";
    documentChapterFilter.value = "";
    documentPriorityFilter.value = "";
    renderDocuments();
    documentSearch.focus();
  });

  clearStatementFilters.addEventListener("click", () => {
    statementSearch.value = "";
    statementChapterFilter.value = "";
    statementYearFilter.value = "";
    renderStatements();
    statementSearch.focus();
  });
}

setStats();
populateFilters();
renderLanes();
renderDeclassifiedChronology();
renderSelectionReadiness();
renderLeads();
renderDocuments();
renderStatements();
renderMilestones();
renderChapterDossiers();
renderGaps();
renderLibraryPlan();
renderDailyDiaryReferences();
bindEvents();
