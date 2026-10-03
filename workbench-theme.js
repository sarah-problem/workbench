/** Shared display preference only: no answers or client information are stored. */
(() => {
  const root = document.documentElement;
  const readTheme = () => {
    try {
      return localStorage.getItem("workbench-theme") || localStorage.getItem("mse-theme") || "dark";
    } catch {
      return "dark";
    }
  };
  function applyTheme(theme) {
    const light = theme === "light";
    root.dataset.theme = light ? "light" : "dark";
    const button = document.getElementById("theme-toggle");
    if (!button) return;
    button.querySelector(".theme-icon").textContent = light ? "☾" : "☀︎";
    button.querySelector(".theme-label").textContent = light ? "Dark mode" : "Light mode";
    button.setAttribute("aria-pressed", String(light));
    button.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
  }
  // Apply before the page paints, then wire the same control on every page.
  applyTheme(readTheme());
  document.addEventListener("DOMContentLoaded", () => {
    let button = document.getElementById("theme-toggle");
    if (!button) {
      const main = document.querySelector("main");
      const bar = document.createElement("div");
      bar.className = "workbench-topbar";
      const back = main.querySelector(":scope > a");
      if (back) bar.appendChild(back);
      button = document.createElement("button");
      button.type = "button";
      button.id = "theme-toggle";
      button.innerHTML =
        '<span class="theme-icon" aria-hidden="true"></span><span class="theme-label"></span>';
      bar.appendChild(button);
      main.prepend(bar);
    }
    applyTheme(root.dataset.theme);
    button.addEventListener("click", () => {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem("workbench-theme", next);
      } catch {
        /* Works without storage. */
      }
    });
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "workbench-theme") applyTheme(event.newValue);
  });
})();
