/*
 * blowout.js — camcam.zip
 *
 *  1. Adds the page TITLE to the top of the table of contents (headings are
 *     already handled by Quartz; individual figures are intentionally NOT
 *     listed so the ToC stays short and scrollbar-free).
 *  2. Makes body headings (h2–h6) collapsible: click a heading to fold every
 *     element beneath it up to the next heading of the same or higher level.
 *     Nesting is respected.
 *
 * Defensive by design: wrapped in try/catch + feature-detected so it can never
 * break page rendering. Re-runs on Quartz SPA navigation.
 */
;(function () {
  function truncate(s, n) {
    s = (s || "").trim().replace(/\s+/g, " ")
    return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s
  }

  function headingLevel(el) {
    return parseInt(el.tagName.slice(1), 10)
  }

  function getArticle() {
    return document.querySelector(".center > article") || document.querySelector("article")
  }

  // ---- 1) Title entry in the ToC -------------------------------------------
  function addTitleToToc() {
    const article = getArticle()
    if (!article) return
    const toc = document.querySelector(".toc")
    const list = toc && (toc.querySelector("ul") || toc.querySelector("ol"))
    if (!list) return

    // clean up previous injections / stale figure entries
    list.querySelectorAll("li.toc-page-title, li.toc-figure").forEach((el) => el.remove())

    const titleEl = document.querySelector(".article-title") || article.querySelector("h1")
    if (!titleEl) return
    if (!titleEl.id) titleEl.id = "page-top"

    const li = document.createElement("li")
    li.className = "toc-page-title depth-0"
    const a = document.createElement("a")
    a.href = "#" + titleEl.id
    a.textContent = truncate(titleEl.textContent, 40)
    li.appendChild(a)
    list.insertBefore(li, list.firstChild)
  }

  // ---- 2) Collapsible headings ---------------------------------------------
  function applyVisibility(article) {
    const collapsedStack = [] // levels of currently-collapsed ancestors
    for (const el of Array.from(article.children)) {
      const isHeading = /^H[1-6]$/.test(el.tagName)
      if (isHeading) {
        const lvl = headingLevel(el)
        while (collapsedStack.length && collapsedStack[collapsedStack.length - 1] >= lvl) {
          collapsedStack.pop()
        }
        // the heading itself is hidden only if nested in a collapsed ancestor
        el.classList.toggle("section-hidden", collapsedStack.length > 0)
        if (el.classList.contains("collapsed")) collapsedStack.push(lvl)
      } else {
        el.classList.toggle("section-hidden", collapsedStack.length > 0)
      }
    }
  }

  function setupCollapsibles() {
    const article = getArticle()
    if (!article) return
    const headings = article.querySelectorAll(":scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6")
    headings.forEach((h) => {
      if (h.dataset.collapsible) return
      h.dataset.collapsible = "1"
      h.classList.add("collapsible-header")
      h.addEventListener("click", (e) => {
        // let the heading's own anchor link work normally
        if (e.target.closest("a")) return
        h.classList.toggle("collapsed")
        applyVisibility(article)
      })
    })
    applyVisibility(article)
  }

  function enhance() {
    try {
      addTitleToToc()
    } catch (err) {
      console.warn("blowout.js (toc):", err)
    }
    try {
      setupCollapsibles()
    } catch (err) {
      console.warn("blowout.js (collapsibles):", err)
    }
  }

  if (document.readyState !== "loading") enhance()
  else document.addEventListener("DOMContentLoaded", enhance)
  document.addEventListener("nav", enhance)
})()
