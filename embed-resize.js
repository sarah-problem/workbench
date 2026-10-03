/**
 * embed-resize.js
 * Shared embedding helper: asks the containing website to resize or scroll an embedded tool.
 * Loaded by all pages; exits immediately when the page is not embedded.
 * See README.md for the file map and a guide to following the code.
 */

(() => {
  // There is no containing frame to notify when this page is opened by itself.
  if (window.parent === window) return;

  let lastHeight = 0;
  // Messages contain layout data only. The embedding parent must validate the
  // message origin and source before applying a height or scroll request.
  const ordinaryClick = (event) =>
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey;

  // Measure the full page and notify the parent only when its height changes.
  function reportHeight() {
    const height = Math.ceil(
      Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
    );

    if (height === lastHeight) return;
    lastHeight = height;
    window.parent.postMessage(
      {
        type: "clinical-workbench-height",
        height,
      },
      "*",
    );
  }

  // Ask the parent to reset the frame height and scroll position before navigation.
  function requestNavigationReset() {
    window.parent.postMessage(
      {
        type: "clinical-workbench-height",
        height: 900,
      },
      "*",
    );

    window.parent.postMessage(
      {
        type: "clinical-workbench-scroll",
        top: 0,
      },
      "*",
    );
  }

  // Request a navigation reset for ordinary links, leaving downloads and special links alone.
  function handlePageLink(event) {
    if (!ordinaryClick(event)) return;
    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:"))
      return;

    requestNavigationReset();
  }

  // Send the destination section position to the parent so embedded navigation scrolls correctly.
  function handleSectionLink(event) {
    if (!ordinaryClick(event)) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    let targetId;
    try {
      targetId = decodeURIComponent(link.getAttribute("href").slice(1));
    } catch {
      return; // An invalid encoded fragment must not break the click handler.
    }
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    history.replaceState(null, "", `#${encodeURIComponent(targetId)}`);
    window.parent.postMessage(
      {
        type: "clinical-workbench-scroll",
        top: Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY - 16)),
      },
      "*",
    );
  }

  // Keep the host informed as the page loads, the window resizes, or content expands.
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
