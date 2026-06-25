const themeLink = document.querySelector("#theme-link");
const themeButton = document.querySelector("#theme-toggle");
const themeButtonText = document.querySelector("#theme-toggle-text");
const scrollTopButton = document.querySelector("#scroll-top-button");
const storageKey = "ejercicio1-theme";

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", nextTheme);
  themeLink.setAttribute("href", `/styles/${nextTheme}.css`);
  localStorage.setItem(storageKey, nextTheme);
  themeButtonText.textContent = nextTheme === "dark" ? "Modo claro" : "Modo oscuro";

  themeButton.innerHTML = `
    <i data-lucide="${nextTheme === "dark" ? "sun-medium" : "moon-star"}"></i>
    <span id="theme-toggle-text">${themeButtonText.textContent}</span>
  `;

  lucide.createIcons();
}

const savedTheme = localStorage.getItem(storageKey) || "light";
applyTheme(savedTheme);

themeButton.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  applyTheme(currentTheme === "light" ? "dark" : "light");
});

function toggleScrollButton() {
  scrollTopButton.classList.toggle("is-visible", window.scrollY > 220);
}

window.addEventListener("scroll", toggleScrollButton);
toggleScrollButton();

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
