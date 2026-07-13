(() => {
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
