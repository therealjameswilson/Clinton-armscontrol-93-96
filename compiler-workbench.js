const workbenchRoot = document.querySelector("#workbench-root");
const workbenchLaneById = window.laneById instanceof Map ? window.laneById : new Map();
const workbenchActionQueue = (window.ARMSCONTROL_COMPILER_ACTION_QUEUE || []).slice().sort(compareWorkbenchActions);

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

function compareWorkbenchActions(a, b) {
  return (
    (a.sortWeight || 999) - (b.sortWeight || 999) ||
    `${a.priorityBand || ""}`.localeCompare(`${b.priorityBand || ""}`) ||
    `${a.workstream || ""}`.localeCompare(`${b.workstream || ""}`) ||
    `${a.targetTitle || ""}`.localeCompare(`${b.targetTitle || ""}`)
  );
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

function firstStartHereActions() {
  const startHere = workbenchActionQueue.filter((item) => item.priorityBand === "1 - Start here");
  return (startHere.length ? startHere : workbenchActionQueue).slice(0, 12);
}

function fallbackWorkbenchCopy(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.append(area);
  area.select();
  try {
    document.execCommand("copy");
  } finally {
    area.remove();
  }
}

async function copyWorkbenchPlan(text, button) {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else fallbackWorkbenchCopy(text);
  } catch (_error) {
    fallbackWorkbenchCopy(text);
  }

  button.textContent = "Copied";
  window.setTimeout(() => {
    button.textContent = "Copy First 12";
  }, 1800);
}

function workbenchActionPlanText(actions) {
  const lines = [
    "# FRUS Volume VII First 12 Compiler Actions",
    "",
    `Page: ${window.location.href.split("#")[0]}`,
    "Full queue: exports/compiler-action-queue.csv",
    "",
    ...actions.map((item, index) =>
      [
        `${String(index + 1).padStart(2, "0")}. ${item.priorityBand || "Action"} / ${item.workstream || "Workstream"} / ${
          item.chapterTitle || "Volume Control"
        }`,
        `Target: ${item.targetTitle || item.sourceIdentifier || "target pending"}`,
        `Action: ${item.immediateAction || "action pending"}`,
        `Gate: ${item.completionGate || "completion gate pending"}`
      ].join("\n")
    )
  ];
  return lines.join("\n\n");
}

function makeWorkbenchActionItem(item, index) {
  const listItem = document.createElement("li");
  const rank = document.createElement("span");
  rank.className = "workbench-action-rank";
  rank.textContent = String(index + 1).padStart(2, "0");

  const body = document.createElement("div");
  body.className = "workbench-action-body";

  const title = document.createElement("strong");
  title.textContent = item.targetTitle || item.sourceIdentifier || "Untitled action";

  const meta = document.createElement("span");
  meta.textContent = `${item.workstream || "Workstream pending"} / ${item.chapterTitle || "Volume Control"} / ${
    item.sourceQueue || "queue pending"
  }`;

  const action = document.createElement("p");
  action.textContent = item.immediateAction || "Action pending.";

  body.append(title, meta, action);
  listItem.append(rank, body);
  return listItem;
}

function makeWorkbenchActionConsole(actions) {
  const consolePanel = document.createElement("article");
  consolePanel.className = "workbench-action-console";

  const header = document.createElement("div");
  header.className = "workbench-console-header";

  const copy = document.createElement("button");
  copy.type = "button";
  copy.textContent = "Copy First 12";
  copy.addEventListener("click", () => copyWorkbenchPlan(workbenchActionPlanText(actions), copy));

  const titleWrap = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = "First 12 Compiler Actions";
  const note = document.createElement("p");
  note.textContent =
    "Start here before opening the larger tables: these are the top-ranked actions from the live compiler action queue.";
  titleWrap.append(title, note);

  const links = document.createElement("div");
  links.className = "workbench-console-actions";
  links.append(makeWorkbenchLink("exports/compiler-action-queue.csv", "Action CSV"));
  links.append(makeWorkbenchLink("reports/compiler-action-queue.md", "Queue Report"));
  links.append(copy);

  header.append(titleWrap, links);

  const list = document.createElement("ol");
  list.className = "workbench-action-list";
  actions.forEach((item, index) => list.append(makeWorkbenchActionItem(item, index)));

  consolePanel.append(header, list);
  return consolePanel;
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

  workbenchRoot.replaceChildren(makeWorkbenchActionConsole(firstStartHereActions()), grid);
}

renderCompilerWorkbench();
