/**
 * KCN Intelligence Directory
 * Routes user intent → correct modules. Only activates what is needed.
 */

const MISSION_ROUTES = {
  build: {
    intent: "Application Development",
    modules: ["companion", "kronos", "vibedev", "cyber", "testing"],
    message: "Mission: Build an application.\n\nActivating creation & delivery pathway:\n• Human AI Companion (understand goals)\n• Kronos Vibe Coder (architecture & code)\n• Vibe Developer (fix → Ship)\n• Cybersecurity (protect)\n• AI Testing Engines (validate)\n\nHuman approval required before execution."
  },
  learn: {
    intent: "Skill Development",
    modules: ["companion", "kronos"],
    message: "Mission: Learn a skill.\n\nActivating growth pathway:\n• Human AI Companion (profile & goals)\n• Kronos Vibe Coder (learning paths)\n\nOther systems remain on standby to conserve resources."
  },
  secure: {
    intent: "Security Validation",
    modules: ["cyber", "testing", "akiis"],
    message: "Mission: Secure a system.\n\nActivating defense & assurance pathway:\n• Cybersecurity Network (scan & protect)\n• AI Testing Engines (adversarial checks)\n• KCN-AKIIS (formal validation)\n\nAwaiting human approval to begin scans."
  },
  analyze: {
    intent: "Project Intelligence",
    modules: ["vibedev", "testing", "cyber", "akiis"],
    message: "Mission: Analyze project.\n\nActivating intelligence pipeline:\n• Vibe Developer (structure & health)\n• AI Testing Engines (quality)\n• Cybersecurity (risk surface)\n• KCN-AKIIS (assurance scoring)\n\nUpload or connect a project to begin."
  },
  grow: {
    intent: "Personal Strength Discovery",
    modules: ["companion"],
    message: "Mission: Discover strengths.\n\nActivating personal intelligence:\n• Human AI Companion\n\nThis pathway focuses on skill mapping, interest signals, and growth recommendations. No deployment systems required."
  },
  default: {
    intent: "General Inquiry",
    modules: ["companion"],
    message: "I understood your request. Routing through Human AI Companion first to clarify intent, then I will activate only the systems required."
  }
};

function classifyMission(text) {
  const t = text.toLowerCase();
  if (/build|create|app|application|ship|deploy|code/.test(t)) return "build";
  if (/learn|teach|skill|course|tutorial|study/.test(t)) return "learn";
  if (/secure|security|protect|hack|vulnerab|threat/.test(t)) return "secure";
  if (/analy[sz]e|review|inspect|audit|check project/.test(t)) return "analyze";
  if (/strength|grow|career|potential|who am i|skills/.test(t)) return "grow";
  return "default";
}

function routeMission(text) {
  const key = classifyMission(text);
  const route = MISSION_ROUTES[key] || MISSION_ROUTES.default;
  return {
    key,
    intent: route.intent,
    modules: route.modules,
    message: route.message
  };
}
