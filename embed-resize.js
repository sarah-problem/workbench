(() => {
  const themeStyle = document.createElement("style");
  themeStyle.textContent = `
    .workbench-theme-toggle {
      position: fixed !important;
      top: 14px !important;
      right: 14px !important;
      z-index: 10000 !important;
      min-width: 112px !important;
      padding: 9px 14px !important;
      border: 2px solid var(--pink, var(--accent-primary, var(--risk-pink, var(--wb-pink, #ff42a7)))) !important;
      border-radius: 999px !important;
      background: var(--surface, var(--risk-surface, var(--wb-surface, #111))) !important;
      color: var(--text, var(--risk-text, var(--wb-text, #fff))) !important;
      font: 700 14px/1.2 "Asap", sans-serif !important;
      box-shadow: 0 3px 14px rgba(0, 0, 0, .25) !important;
      cursor: pointer !important;
    }
    .workbench-theme-toggle:hover,
    .workbench-theme-toggle:focus-visible {
      border-color: var(--yellow, var(--accent-secondary, var(--risk-yellow, var(--wb-yellow, #ffec1a)))) !important;
      outline: none !important;
    }
    html[data-workbench-theme="light"] {
      --bg: #f7f4ef;
      --text: #201d24;
      --pink: #a80f60;
      --yellow: #6b5700;
      --surface: #ffffff;
      --surface-2: #eee9e2;
      --border: #b8aea3;
      --accent-primary: #a80f60;
      --accent-secondary: #6b5700;
      --risk-bg: #f7f4ef;
      --risk-text: #201d24;
      --risk-pink: #a80f60;
      --risk-yellow: #6b5700;
      --risk-surface: #ffffff;
      --risk-surface-2: #eee9e2;
      --risk-border: #b8aea3;
      --wb-bg: #f7f4ef;
      --wb-text: #201d24;
      --wb-pink: #a80f60;
      --wb-yellow: #6b5700;
      --wb-surface: #ffffff;
      --wb-border: #b8aea3;
      color-scheme: light;
    }
    html[data-workbench-theme="light"] body { background: #f7f4ef !important; color: #201d24 !important; }
    html[data-workbench-theme="light"] .workbench-header p,
    html[data-workbench-theme="light"] .tool-card p,
    html[data-workbench-theme="light"] .helper-text,
    html[data-workbench-theme="light"] .screening-note,
    html[data-workbench-theme="light"] .question-context,
    html[data-workbench-theme="light"] .severity-probe,
    html[data-workbench-theme="light"] .response-key,
    html[data-workbench-theme="light"] .response-key span,
    html[data-workbench-theme="light"] .function-description,
    html[data-workbench-theme="light"] .ranked-reasons p,
    html[data-workbench-theme="light"] .ranked-function p,
    html[data-workbench-theme="light"] .marker-text,
    html[data-workbench-theme="light"] .domain-marker,
    html[data-workbench-theme="light"] .measure-section-note { color: #514a55 !important; }
    html[data-workbench-theme="light"] .risk-helper,
    html[data-workbench-theme="light"] .risk-note { color: #514a55 !important; }
    html[data-workbench-theme="light"] .risk-level-explainer { background: #f0ebe5 !important; }
    html[data-workbench-theme="light"] .risk-level-result.risk-low,
    html[data-workbench-theme="light"] .risk-level-explainer.risk-low { color: #176b37 !important; }
    html[data-workbench-theme="light"] .risk-level-result.risk-low-moderate,
    html[data-workbench-theme="light"] .risk-level-explainer.risk-low-moderate { color: #626800 !important; }
    html[data-workbench-theme="light"] .risk-level-result.risk-moderate,
    html[data-workbench-theme="light"] .risk-level-explainer.risk-moderate { color: #875400 !important; }
    html[data-workbench-theme="light"] .risk-level-result.risk-moderate-high,
    html[data-workbench-theme="light"] .risk-level-explainer.risk-moderate-high { color: #9a3f00 !important; }
    html[data-workbench-theme="light"] .risk-level-result.risk-high,
    html[data-workbench-theme="light"] .risk-level-explainer.risk-high { color: #a3202a !important; }
    html[data-workbench-theme="light"] .information-alert,
    html[data-workbench-theme="light"] .measure-alert { background: #fff8d8 !important; }
    html[data-workbench-theme="light"] .measure-section > h2,
    html[data-workbench-theme="light"] .measure-section-note { background: #f0ebe5 !important; }
    html[data-workbench-theme="light"] .question-row { border-color: #cfc5ba !important; }
    html[data-workbench-theme="light"] input[type="text"],
    html[data-workbench-theme="light"] input[type="number"],
    html[data-workbench-theme="light"] input[type="date"],
    html[data-workbench-theme="light"] select,
    html[data-workbench-theme="light"] textarea { background: #fff !important; color: #201d24 !important; }
    html[data-workbench-theme="light"] .score-track,
    html[data-workbench-theme="light"] .function-bar,
    html[data-workbench-theme="light"] .benchmark-bar span { background: #d8d0c7 !important; }
    html[data-workbench-theme="light"] .benchmark-bar span.active,
    html[data-workbench-theme="light"] .function-bar span { background: var(--pink) !important; }
    @media print { .workbench-theme-toggle { display: none !important; } }
  `;
  document.head.appendChild(themeStyle);

  let savedTheme = "dark";
  try { savedTheme = localStorage.getItem("clinical-workbench-theme") || "dark"; } catch (_) {}

  function applyTheme(theme) {
    const light = theme === "light";
    document.documentElement.dataset.workbenchTheme = light ? "light" : "dark";
    const toggle = document.querySelector(".workbench-theme-toggle");
    if (toggle) {
      toggle.textContent = light ? "☾ Dark mode" : "☀ Light mode";
      toggle.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
      toggle.setAttribute("aria-pressed", String(light));
    }
  }

  applyTheme(savedTheme);

  function addThemeToggle() {
    if (document.querySelector(".workbench-theme-toggle")) return;
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "workbench-theme-toggle";
    toggle.addEventListener("click", () => {
      const next = document.documentElement.dataset.workbenchTheme === "light" ? "dark" : "light";
      try { localStorage.setItem("clinical-workbench-theme", next); } catch (_) {}
      applyTheme(next);
    });
    document.body.appendChild(toggle);
    applyTheme(document.documentElement.dataset.workbenchTheme);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addThemeToggle, { once: true });
  } else {
    addThemeToggle();
  }

  if (window.parent === window) return;

  let lastHeight = 0;

  function reportHeight() {
    const height = Math.ceil(Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    ));

    if (height === lastHeight) return;
    lastHeight = height;
    window.parent.postMessage({
      type: "clinical-workbench-height",
      height
    }, "*");
  }

  function requestNavigationReset() {
    window.parent.postMessage({
      type: "clinical-workbench-height",
      height: 900
    }, "*");

    window.parent.postMessage({
      type: "clinical-workbench-scroll",
      top: 0
    }, "*");
  }

  function handlePageLink(event) {
    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    requestNavigationReset();
  }

  function handleSectionLink(event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = decodeURIComponent(link.getAttribute("href").slice(1));
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    history.replaceState(null, "", `#${encodeURIComponent(targetId)}`);
    window.parent.postMessage({
      type: "clinical-workbench-scroll",
      top: Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY - 16))
    }, "*");
  }

  window.addEventListener("load", reportHeight);
  window.addEventListener("resize", reportHeight);

  if ("ResizeObserver" in window) {
    new ResizeObserver(reportHeight).observe(document.documentElement);
  }

  window.addEventListener("beforeunload", requestNavigationReset);
  document.addEventListener("click", handlePageLink);
  document.addEventListener("click", handleSectionLink);

  reportHeight();
})();
