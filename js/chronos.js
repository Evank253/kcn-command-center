/**
 * KCN Chronos Ledger — timeline of every significant action
 */

function nowTime() {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

function chronosLog(event, detail = "") {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;

  // Remove placeholder if present
  if (timeline.children.length === 1 && timeline.textContent.includes("awaiting")) {
    timeline.innerHTML = "";
  }

  const item = document.createElement("div");
  item.className = "tl-item";
  item.innerHTML = `
    <div class="tl-time">${nowTime()}</div>
    <div class="tl-event">${event}${detail ? " · " + detail : ""}</div>
  `;
  timeline.prepend(item);

  // Keep last 40 events
  while (timeline.children.length > 40) {
    timeline.removeChild(timeline.lastChild);
  }
}
