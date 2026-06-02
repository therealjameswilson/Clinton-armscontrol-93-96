const workbenchRoot = document.querySelector("#workbench-root");
const workbenchLaneById = window.laneById instanceof Map ? window.laneById : new Map();

function formatWorkbenchDate(value) {
  if (typeof window.formatDate === "function") return window.formatDate(value);
  return value || "Date pending";
}

function makeWorkbenchLink(url, label) {
  if (typeof window.makeLink === "function") return window.makeLink(url, label);
  const link = document.createElement("a");
  link.href = url;
  link.textContent = label;
  link.rel = "noreferrer";
  return link;
}

function workbenchGapPriorityRank(priority) {
  return { Critical: 0, High: 1, Medium: 2, Review: 3 }[priority] ?? 4;
}

function isCloseReadCandidate(item) {
  const level = `${item.level || ""}`.toLowerCase();
  const type = `${item.sourceType || ""}`.toLowerCase();
  return level.includes("item-level review copy") || level.includes("published primary source") || type.includes("directive");
}

function makeWorkbenchList(items, renderItem, emptyText) {
  const list = document.createElement("ul");
  list.className = "workbench-list";

  if (!items.length) {
    const empty = document.createElement("li");
    empty.textContent = emptyText;
    list.append(empty);
    return list;
  }

  for (const item of items) list.append(renderItem(item));
  return list;
}

function makeWorkbenchDocumentItem(item) {
  const listItem = document.createElement("li");
  const title = document.createElement("strong");
  title.textContent = item.title;
  const meta = document.createElement("span");
  meta.textContent = `${formatWorkbenchDate(item.date)} / ${
    item.chapterTitle || workbenchLaneById.get(item.chapterId)?.title || item.chapterId
  }`;
  listItem.append(title, meta);
  if (item.sourceUrl || item.digitalObjectUrl) {
    const links = document.createElement("span");
    links.className = "workbench-links";
    if (item.digitalObjectUrl) links.append(makeWorkbenchLink(item.digitalObjectUrl, "review copy"));
    if (item.sourceUrl) links.append(makeWorkbenchLink(item.sourceUrl, "source"));
    listItem.append(links);
  }
  return listItem;
}

function makeWorkbenchLibraryItem(item) {
  const listItem = document.createElement("li");
  const title = document.createElement("strong");
  title.textContent = item.title;
  const meta = document.createElement("span");
  meta.textContent = `${item.chapterTitle} / ${(item.oaIds || []).slice(0, 5).join(", ")}${
    (item.oaIds || []).length > 5 ? ", ..." : ""
  }`;
  listItem.append(title, meta);
  return listItem;
}

function makeWorkbenchGapItem(item) {
  const listItem = document.createElement("li");
  const title = document.createElement("strong");
  title.textContent = item.title;
  const meta = document.createElement("span");
  meta.textContent = `${item.priority} / ${item.status}`;
  listItem.append(title, meta);
  return listItem;
}

function renderCompilerWorkbench() {
  if (!workbenchRoot) return;

  const chronology = window.declassifiedChronology || [];
  const pullPlan = window.libraryResearchPlan || [];
  const gaps = window.compilerGaps || [];
  const closeRead = chronology.filter(isCloseReadCandidate).slice(0, 6);
  const screenNext = chronology.filter((item) => !isCloseReadCandidate(item)).slice(0, 6);
  const pullNext = pullPlan.filter((item) => item.priority === "A").slice(0, 6);
  const riskNext = gaps
    .filter((gap) => ["Critical", "High"].includes(gap.priority))
    .sort((a, b) => workbenchGapPriorityRank(a.priority) - workbenchGapPriorityRank(b.priority) || a.title.localeCompare(b.title))
    .slice(0, 6);

  const panels = [
    {
      title: "Close-Read First",
      note: "Texts or review copies visible enough for immediate document-level judgment.",
      items: closeRead,
      renderItem: makeWorkbenchDocumentItem,
      empty: "No close-read candidates are currently staged."
    },
    {
      title: "Screen Packet Leads",
      note: "MDR packets, folder leads, and source paths that need item boundaries before promotion.",
      items: screenNext,
      renderItem: makeWorkbenchDocumentItem,
      empty: "No packet leads are currently staged."
    },
    {
      title: "Pull At Clinton Library",
      note: "A-priority folder clusters from the on-site research plan.",
      items: pullNext,
      renderItem: makeWorkbenchLibraryItem,
      empty: "No A-priority pull clusters are currently staged."
    },
    {
      title: "Control Risks",
      note: "Weaknesses to resolve before calling a document sequence compiler-ready.",
      items: riskNext,
      renderItem: makeWorkbenchGapItem,
      empty: "No critical or high source risks are currently staged."
    }
  ];

  const grid = document.createElement("div");
  grid.className = "workbench-grid";
  for (const panel of panels) {
    const card = document.createElement("article");
    card.className = "workbench-panel";
    const heading = document.createElement("h3");
    heading.textContent = panel.title;
    const note = document.createElement("p");
    note.textContent = panel.note;
    card.append(heading, note, makeWorkbenchList(panel.items, panel.renderItem, panel.empty));
    grid.append(card);
  }

  workbenchRoot.replaceChildren(grid);
}

renderCompilerWorkbench();
