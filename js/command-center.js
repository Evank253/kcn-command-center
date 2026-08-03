/**
 * KCN Command Center — main controller
 * Boot sequence → living interface → mission routing → governance
 */

let pendingApprovals = [];

function addSystemMessage(text, type = "system") {
  const area = document.getElementById("chat-area");
  if (!area) return;
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  const label = type === "user" ? "You" : type === "approval" ? "Governance" : "KCN Core";
  msg.innerHTML = `<div class="msg-label">${label}</div><div class="msg-body">${String(text).replace(/\n/g, "<br>")}</div>`;
  area.appendChild(msg);
  area.scrollTop = area.scrollHeight;
}

function setCoreProcessing(on) {
  const core = document.getElementById("neural-core");
  if (!core) return;
  core.classList.toggle("processing", !!on);
}

function updatePendingUI() {
  const el = document.getElementById("pending-count");
  if (el) el.textContent = String(pendingApprovals.length);
  const queue = document.getElementById("approval-queue");
  if (!queue) return;
  queue.innerHTML = "";
  pendingApprovals.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "approval-item";
    div.innerHTML = `<div>${item.summary}</div><div class="actions"><button class="btn-approve" data-idx="${idx}">Approve</button><button class="btn-reject" data-idx="${idx}">Reject</button></div>`;
    queue.appendChild(div);
  });
  queue.querySelectorAll(".btn-approve").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.idx);
      const item = pendingApprovals[i];
      if (!item) return;
      if (typeof chronosLog === "function") chronosLog("Human approved", item.summary);
      addSystemMessage(`Approved: ${item.summary}\n\nExecution pathway unlocked.`, "system");
      pendingApprovals.splice(i, 1);
      updatePendingUI();
      if (typeof soundEnabled !== "undefined" && soundEnabled && typeof playTone === "function") playTone(660, 0.1);
    });
  });
  queue.querySelectorAll(".btn-reject").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.idx);
      const item = pendingApprovals[i];
      if (!item) return;
      if (typeof chronosLog === "function") chronosLog("Human rejected", item.summary);
      addSystemMessage(`Rejected: ${item.summary}`, "system");
      pendingApprovals.splice(i, 1);
      if (typeof activateModules === "function") activateModules([]);
      setCoreProcessing(false);
      updatePendingUI();
      const ms = document.getElementById("mission-status");
      const cm = document.getElementById("current-mission");
      if (ms) ms.textContent = "Ready";
      if (cm) cm.textContent = "No active mission";
    });
  });
}

function runMission(text) {
  if (!text || !String(text).trim()) return;
  addSystemMessage(text, "user");
  if (typeof chronosLog === "function") chronosLog("Mission received", String(text).slice(0, 48));
  setCoreProcessing(true);
  const ms = document.getElementById("mission-status");
  const cm = document.getElementById("current-mission");
  if (ms) ms.textContent = "Routing";
  if (cm) cm.textContent = String(text).slice(0, 60);
  setTimeout(() => {
    try {
      const plan = typeof routeMission === "function" ? routeMission(text) : { intent: "General Inquiry", modules: [], message: "Routing unavailable." };
      if (typeof chronosLog === "function") chronosLog("Intelligence Directory", plan.intent);
      if (typeof activateModules === "function") activateModules(plan.modules || []);
      addSystemMessage(plan.message || "Mission received.");
      pendingApprovals.push({ summary: `${plan.intent} — activate ${(plan.modules || []).length} modules`, modules: plan.modules || [], original: text });
      updatePendingUI();
      if (ms) ms.textContent = "Awaiting Approval";
      if (typeof chronosLog === "function") chronosLog("Awaiting human approval");
      setCoreProcessing(false);
      if (typeof soundEnabled !== "undefined" && soundEnabled && typeof playTone === "function") playTone(440, 0.12);
    } catch (err) {
      console.error("Mission routing error:", err);
      setCoreProcessing(false);
      if (ms) ms.textContent = "Error";
      addSystemMessage("Mission routing encountered an error.", "system");
    }
  }, 900);
}

function runBootSequence() {
  const log = document.getElementById("boot-log");
  if (!log) return;
  const lines = ["Loading Governance Layer...", "Loading Memory Network...", "Loading Intelligence Directory...", "Loading Security Framework...", "Loading Assurance Engine...", "Loading Cognitive Resource Manager...", "Loading Chronos Ledger...", "KCN CORE ONLINE"];
  let i = 0;
  function next() {
    if (i >= lines.length) {
      const btn = document.getElementById("enter-btn");
      if (btn) btn.classList.remove("hidden");
      if (typeof soundEnabled !== "undefined" && soundEnabled && typeof playTone === "function") playTone(523, 0.15);
      return;
    }
    const line = document.createElement("div");
    line.className = "line ok";
    line.textContent = lines[i];
    log.appendChild(line);
    i++;
    setTimeout(next, 320);
  }
  setTimeout(next, 400);
}

function enterCommandCenter() {
  const overlay = document.getElementById("boot-overlay");
  const center = document.getElementById("command-center");
  if (!overlay || !center) return;
  overlay.classList.add("fade-out");
  setTimeout(() => {
    overlay.classList.add("hidden");
    center.classList.remove("hidden");
    if (typeof initParticles === "function") { try { initParticles(); } catch (e) {} }
    if (typeof chronosLog === "function") { chronosLog("Command Center entered"); chronosLog("All foundation layers online"); }
  }, 700);
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    runBootSequence();
    if (typeof initJarvis === "function") initJarvis();
    const enterBtn = document.getElementById("enter-btn");
    if (enterBtn) enterBtn.addEventListener("click", enterCommandCenter);
    const sendBtn = document.getElementById("send-mission");
    if (sendBtn) sendBtn.addEventListener("click", () => { const input = document.getElementById("mission-input"); if (!input) return; runMission(input.value); input.value = ""; });
    const missionInput = document.getElementById("mission-input");
    if (missionInput) missionInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { runMission(e.target.value); e.target.value = ""; } });
    document.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const map = { build: "I want to build an application", learn: "Help me learn a new skill", secure: "Secure my system", analyze: "Analyze my project", grow: "Help me find my strengths" };
        const key = chip.dataset && chip.dataset.mission;
        runMission(map[key] || chip.textContent || "Mission");
      });
    });
    const stopBtn = document.getElementById("emergency-stop");
    if (stopBtn) stopBtn.addEventListener("click", () => {
      if (typeof activateModules === "function") activateModules([]);
      setCoreProcessing(false);
      pendingApprovals = [];
      updatePendingUI();
      if (typeof chronosLog === "function") chronosLog("EMERGENCY STOP", "all modules returned to standby");
      addSystemMessage("Emergency stop engaged. Human control reasserted.", "approval");
      const ms = document.getElementById("mission-status");
      const cm = document.getElementById("current-mission");
      if (ms) ms.textContent = "Stopped";
      if (cm) cm.textContent = "Emergency stop — awaiting new mission";
    });
    document.querySelectorAll(".module-node").forEach((node) => {
      node.addEventListener("click", () => {
        const id = node.dataset && node.dataset.module;
        const mod = (typeof KCN_MODULES !== "undefined" && id) ? KCN_MODULES[id] : null;
        if (!mod) return;
        addSystemMessage(`<strong>${mod.name}</strong><br>${mod.description}<br><br>Status: ${mod.status}<br>Capabilities: ${(mod.capabilities || []).join(", ")}`);
        if (typeof chronosLog === "function") chronosLog("Module inspected", mod.name);
      });
    });
  } catch (err) {
    console.error("KCN init error:", err);
  }
});
