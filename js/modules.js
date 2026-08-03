/**
 * KCN Module Registry
 * Every intelligence system registers here so the Directory can route missions.
 */
const KCN_MODULES = {
  companion: {
    id: "companion",
    name: "Human AI Companion",
    category: "personal",
    capabilities: ["skill-profile", "growth-tracking", "goal-mapping", "interest-discovery"],
    status: "standby",
    description: "Know yourself. Grow yourself."
  },
  kronos: {
    id: "kronos",
    name: "Kronos Vibe Coder",
    category: "creation",
    capabilities: ["code-mentor", "architecture", "learning-path", "build-assistance"],
    status: "standby",
    description: "Learn. Build. Create."
  },
  vibedev: {
    id: "vibedev",
    name: "KCN Vibe Developer",
    category: "deployment",
    capabilities: ["import", "repair", "deploy", "health-check", "secrets-shield"],
    status: "standby",
    description: "Ship Without Fear."
  },
  cyber: {
    id: "cyber",
    name: "Cybersecurity Network",
    category: "defense",
    capabilities: ["scan", "monitor", "threat-detect", "protect"],
    status: "standby",
    description: "Protect what you create."
  },
  akiis: {
    id: "akiis",
    name: "KCN-AKIIS Assurance",
    category: "assurance",
    capabilities: ["benchmark", "validation", "regression", "certification"],
    status: "standby",
    description: "Trust Through Verification."
  },
  testing: {
    id: "testing",
    name: "AI Testing Engines",
    category: "quality",
    capabilities: ["capability-test", "agent-test", "adversarial", "reliability"],
    status: "standby",
    description: "Test. Challenge. Prove."
  },
  marketplace: {
    id: "marketplace",
    name: "AI Marketplace",
    category: "economy",
    capabilities: ["list-assistants", "verify-agents", "trust-scores", "license"],
    status: "standby",
    description: "Discover trusted AI assistants."
  }
};

function setModuleStatus(id, status) {
  const mod = KCN_MODULES[id];
  if (!mod) return;
  mod.status = status;

  const node = document.querySelector(`.module-node[data-module="${id}"]`);
  if (!node) return;

  const statusEl = node.querySelector(".node-status");
  if (statusEl) statusEl.textContent = status.charAt(0).toUpperCase() + status.slice(1);

  if (status === "active") {
    node.classList.add("active");
  } else {
    node.classList.remove("active");
  }
}

function activateModules(ids) {
  Object.keys(KCN_MODULES).forEach((id) => setModuleStatus(id, "standby"));
  ids.forEach((id) => setModuleStatus(id, "active"));
  updateResourceMeters(ids.length);
}

function updateResourceMeters(activeCount) {
  const total = Object.keys(KCN_MODULES).length;
  const pct = Math.round((activeCount / total) * 100);
  const fill = document.getElementById("modules-fill");
  const label = document.getElementById("modules-pct");
  if (fill) fill.style.width = pct + "%";
  if (label) label.textContent = `${activeCount} / ${total}`;

  const compute = Math.min(12 + activeCount * 11, 88);
  const cFill = document.getElementById("compute-fill");
  const cPct = document.getElementById("compute-pct");
  if (cFill) cFill.style.width = compute + "%";
  if (cPct) cPct.textContent = compute + "%";
}

function getActiveModules() {
  return Object.values(KCN_MODULES).filter((m) => m.status === "active");
}
