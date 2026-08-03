/**
 * Jarvis optional voice/text assistant layer
 * Toggle only — no real speech recognition in this prototype
 */

let jarvisEnabled = false;
let soundEnabled = true;

function initJarvis() {
  const jarvisBtn = document.getElementById("jarvis-toggle");
  const soundBtn = document.getElementById("sound-toggle");

  if (jarvisBtn) {
    jarvisBtn.addEventListener("click", () => {
      jarvisEnabled = !jarvisEnabled;
      jarvisBtn.dataset.state = jarvisEnabled ? "on" : "off";
      jarvisBtn.setAttribute("aria-pressed", String(jarvisEnabled));
      const txt = jarvisBtn.querySelector(".toggle-text");
      if (txt) txt.textContent = jarvisEnabled ? "ON" : "OFF";

      if (typeof chronosLog === "function") {
        chronosLog(jarvisEnabled ? "Jarvis activated" : "Jarvis deactivated", "optional interface");
      }
      if (typeof addSystemMessage === "function") {
        addSystemMessage(
          jarvisEnabled
            ? "Jarvis mode enabled. Voice layer ready (prototype — use text for commands). Human approval still required for high-impact actions."
            : "Jarvis mode disabled. Text command mode remains active."
        );
      }

      if (soundEnabled && typeof playTone === "function") playTone(jarvisEnabled ? 520 : 320, 0.08);
    });
  }

  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      soundBtn.dataset.state = soundEnabled ? "on" : "off";
      soundBtn.setAttribute("aria-pressed", String(soundEnabled));
      const txt = soundBtn.querySelector(".toggle-text");
      if (txt) txt.textContent = soundEnabled ? "ON" : "OFF";
      if (typeof chronosLog === "function") {
        chronosLog(soundEnabled ? "System audio enabled" : "System audio muted");
      }
    });
  }
}

function playTone(freq, duration) {
  if (!soundEnabled) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq || 440;
    osc.type = "sine";
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (duration || 0.1));
    osc.start(now);
    osc.stop(now + (duration || 0.1));
    setTimeout(() => {
      try { ctx.close(); } catch (_) {}
    }, ((duration || 0.1) * 1000) + 50);
  } catch (_) {
    /* audio not available */
  }
}
