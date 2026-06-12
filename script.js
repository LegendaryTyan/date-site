const dateOptions = document.querySelectorAll(".date-option");
const dateResult = document.querySelector("#dateResult");
const sparkButton = document.querySelector("#sparkButton");
const secretButton = document.querySelector("#secretButton");
const toast = document.querySelector("#toast");

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function createSpark(x, y) {
  const spark = document.createElement("span");
  const angle = Math.random() * Math.PI * 2;
  const distance = 70 + Math.random() * 90;

  spark.className = "spark";
  spark.textContent = Math.random() > 0.5 ? "♡" : "✦";
  spark.style.left = `${x}px`;
  spark.style.top = `${y}px`;
  spark.style.setProperty("--spark-x", `${Math.cos(angle) * distance}px`);
  spark.style.setProperty("--spark-y", `${Math.sin(angle) * distance}px`);
  spark.style.fontSize = `${18 + Math.random() * 20}px`;

  document.body.append(spark);
  spark.addEventListener("animationend", () => spark.remove(), { once: true });
}

function burstSparks(origin) {
  const rect = origin.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let index = 0; index < 24; index += 1) {
    window.setTimeout(() => createSpark(centerX, centerY), index * 18);
  }
}

dateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    dateOptions.forEach((item) => item.classList.remove("active"));
    option.classList.add("active");
    dateResult.textContent = `Выбран вариант: ${option.dataset.date}`;
    showToast("Отличный выбор. Я уже радуюсь.");
  });
});

sparkButton.addEventListener("click", () => {
  burstSparks(sparkButton);
  showToast("Магия добавлена. Уровень милоты повышен.");
});

secretButton.addEventListener("click", () => {
  burstSparks(secretButton);
  showToast("Значит, сайт работает правильно ♡");
});
