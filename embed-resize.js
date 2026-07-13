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
  document.addEventListener("click", handleSectionLink);

  reportHeight();
})();
