const CONFIG = {
  weddingDate: "2026-08-21T17:00:00+05:00",
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbzLU6m-rP0Pi9CEphgxqdDq4MhQC0PG9gqDpQivuWv7P0sKdSYuwSJ5-Kr0TD_k2i_T/exec",
};

const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");

musicButton.addEventListener("click", async () => {
  if (!music.getAttribute("src")) {
    musicButton.setAttribute("aria-label", "Музыка файлы табылмады");
    return;
  }

  try {
    if (music.paused) {
      await music.play();
      musicButton.setAttribute("aria-label", "Музыканы тоқтату");
    } else {
      music.pause();
      musicButton.setAttribute("aria-label", "Музыканы қосу");
    }
  } catch {
    musicButton.setAttribute("aria-label", "music.mp3 файлын тексеріңіз");
  }
});

music.addEventListener("ended", () => {
  musicButton.setAttribute("aria-label", "Музыканы қосу");
});

const targetDate = new Date(CONFIG.weddingDate).getTime();
const countdownItems = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const diff = Math.max(0, targetDate - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdownItems.days.textContent = pad(days);
  countdownItems.hours.textContent = pad(hours);
  countdownItems.minutes.textContent = pad(minutes);
  countdownItems.seconds.textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const form = document.getElementById("rsvpForm");
const statusNode = document.getElementById("formStatus");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = form.querySelector("button[type='submit']");
  const formData = new FormData(form);
  const payload = {
    name: formData.get("name")?.trim(),
    choice: formData.get("choice"),
    guests: formData.get("guests"),
  };

  if (!CONFIG.googleScriptUrl) {
    statusNode.textContent = "Google Apps Script сілтемесін script.js ішіне қойыңыз.";
    return;
  }

  submitButton.disabled = true;
  statusNode.textContent = "Жіберіліп жатыр...";

  try {
    await fetch(CONFIG.googleScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    form.reset();
    statusNode.textContent = "Рақмет! Жауабыңыз қабылданды.";
  } catch {
    statusNode.textContent = "Қате шықты. Кейінірек қайталап көріңіз.";
  } finally {
    submitButton.disabled = false;
  }
});
