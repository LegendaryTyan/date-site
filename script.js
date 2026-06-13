const calendarDays = document.querySelector("#calendarDays");
const calendarMonth = document.querySelector("#calendarMonth");
const timeOptions = document.querySelectorAll(".time-option");
const dateResult = document.querySelector("#dateResult");
const wishInput = document.querySelector("#wishInput");
const replyLink = document.querySelector("#replyLink");
const noButton = document.querySelector("#noButton");
const answerZone = document.querySelector("#answerZone");
const noMessage = document.querySelector("#noMessage");
const toast = document.querySelector("#toast");

const siteUrl = "https://boost-me-pls.ru";
let selectedDay = new Date();
let selectedTime = "18:00";
let selectedDate = "";
let toastTimer;

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function showNoMessage(message) {
  noMessage.textContent = message;
  noMessage.classList.add("show");
}

function getReplyMessage() {
  const message = [
    "Миссия принята 💜",
    "Это настоящая Вика, не клон Йору. Наверное.",
    `Дата и время: ${selectedDate}`,
  ];

  if (wishInput.value.trim()) {
    message.push(`Loadout: ${wishInput.value.trim()}`);
  }

  message.push("Вика в пати. Жду подробности.");

  return message.join("\n");
}

function formatDate(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function updateSelectedDate() {
  selectedDate = `${formatDate(selectedDay)}, ${selectedTime}`;
  dateResult.textContent = `Выбран вариант: ${selectedDate}`;
  updateReplyLink();
}

function updateReplyLink() {
  const params = new URLSearchParams({
    url: siteUrl,
    text: getReplyMessage(),
  });

  replyLink.href = `https://t.me/share/url?${params.toString()}`;
}

function renderCalendar() {
  const dates = Array.from({ length: 21 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);
    return date;
  });
  const firstDay = dates[0].getDay() || 7;
  const monthLabel = new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
  }).format(dates[0]);

  calendarMonth.textContent = monthLabel;
  calendarDays.textContent = "";

  for (let index = 1; index < firstDay; index += 1) {
    const offset = document.createElement("span");
    offset.className = "calendar-day is-offset";
    calendarDays.append(offset);
  }

  dates.forEach((date, index) => {
    const button = document.createElement("button");
    const weekday = new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(date);
    const day = new Intl.DateTimeFormat("ru-RU", { day: "numeric" }).format(date);

    button.className = "calendar-day";
    button.type = "button";
    button.innerHTML = `<span>${day}</span><small>${index === 0 ? "сегодня" : weekday}</small>`;
    button.dataset.iso = date.toISOString();

    if (date.toDateString() === selectedDay.toDateString()) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      selectedDay = date;
      document.querySelectorAll(".calendar-day").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      updateSelectedDate();
      showToast("Вика выбрала день. Хороший выбор.");
    });

    calendarDays.append(button);
  });
}

timeOptions.forEach((option) => {
  option.addEventListener("click", () => {
    timeOptions.forEach((item) => item.classList.remove("active"));
    option.classList.add("active");
    selectedTime = option.dataset.time;
    updateSelectedDate();
    showToast("Время записал. Уже радуюсь.");
  });
});

replyLink.addEventListener("click", () => {
  updateReplyLink();
  showToast("Telegram откроется с готовым текстом.");
});

wishInput.addEventListener("input", updateReplyLink);

function getRunawayPosition(pointerX, pointerY) {
  const zoneRect = answerZone.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();
  const maxLeft = Math.max(zoneRect.width - buttonRect.width, 0);
  const maxTop = Math.max(zoneRect.height - buttonRect.height, 0);
  const pointerInsideZoneX = pointerX - zoneRect.left;
  const pointerInsideZoneY = pointerY - zoneRect.top;
  const directionX = pointerInsideZoneX < zoneRect.width / 2 ? 1 : -1;
  const directionY = pointerInsideZoneY < zoneRect.height / 2 ? 1 : -1;
  const currentLeft = buttonRect.left - zoneRect.left;
  const currentTop = buttonRect.top - zoneRect.top;
  const left = currentLeft + directionX * (54 + Math.random() * 34);
  const top = currentTop + directionY * (20 + Math.random() * 26);

  return {
    left: Math.min(Math.max(left, 0), maxLeft),
    top: Math.min(Math.max(top, 0), maxTop),
  };
}

function moveNoButton(event) {
  const pointerX = event?.clientX ?? window.innerWidth / 2;
  const pointerY = event?.clientY ?? window.innerHeight / 2;
  const { left, top } = getRunawayPosition(pointerX, pointerY);

  noButton.classList.add("is-running");
  noButton.style.left = `${left}px`;
  noButton.style.top = `${top}px`;
}

noButton.addEventListener("pointerenter", moveNoButton);
noButton.addEventListener("focus", moveNoButton);
noButton.addEventListener("touchstart", moveNoButton, { passive: true });
noButton.addEventListener("click", (event) => {
  event.preventDefault();
  showNoMessage("Подозрительно. Это точно Вика нажала, а не клон Йору?");
});

renderCalendar();
updateSelectedDate();
