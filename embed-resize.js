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

  window.addEventListener("load", reportHeight);
  window.addEventListener("resize", reportHeight);

  if ("ResizeObserver" in window) {
    new ResizeObserver(reportHeight).observe(document.documentElement);
  }

  window.addEventListener("beforeunload", requestNavigationReset);

  reportHeight();
})();
