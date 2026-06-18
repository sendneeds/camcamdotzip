/*
 * blowout.js — camcam.zip
 * Augments the Quartz table of contents so it lists the page TITLE and every
 * blowout IMAGE (figure) in addition to the headings, and wires up scroll-spy
 * highlighting for those figure entries. Headings are already handled by Quartz.
 *
 * Defensive by design: everything is wrapped in try/catch and feature-detected
 * so a failure here can never break page rendering. Re-runs on Quartz SPA nav.
 */
;(function () {
  function truncate(s, n) {
    s = (s || "").trim().replace(/\s+/g, " ")
    return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s
  }

  function enhance() {
    try {
      const article = document.querySelector(".center > article, article")
      if (!article) return

      const toc = document.querySelector(".toc")
      // find the list Quartz renders inside the ToC
      const list = toc && (toc.querySelector("ul") || toc.querySelector("ol"))
      if (!toc || !list) return

      // avoid double-injecting on re-runs
      list.querySelectorAll("li.toc-figure, li.toc-page-title").forEach((el) => el.remove())

      // 1) title entry at the top of the ToC
      const titleEl = article.querySelector("h1, .article-title")
      if (titleEl) {
        if (!titleEl.id) titleEl.id = "page-top"
        const li = document.createElement("li")
        li.className = "toc-page-title depth-0"
        const a = document.createElement("a")
        a.href = "#" + titleEl.id
        a.textContent = truncate(titleEl.textContent, 40)
        li.appendChild(a)
        list.insertBefore(li, list.firstChild)
      }

      // 2) figure entries — one per blowout image paragraph
      const figures = article.querySelectorAll("p:has(> img)")
      const observed = []
      figures.forEach((fig, i) => {
        if (!fig.id) fig.id = "figure-" + (i + 1)
        const cap = fig.querySelector("em")
        const label = cap ? truncate(cap.textContent, 38) : "Figure " + (i + 1)

        const li = document.createElement("li")
        li.className = "toc-figure depth-1"
        const a = document.createElement("a")
        a.href = "#" + fig.id
        a.textContent = label
        a.dataset.figureId = fig.id
        li.appendChild(a)
        list.appendChild(li)
        observed.push({ fig, a })
      })

      // 3) scroll-spy for the figure entries
      if ("IntersectionObserver" in window && observed.length) {
        const map = new Map(observed.map((o) => [o.fig, o.a]))
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              const a = map.get(e.target)
              if (a) a.classList.toggle("in-view", e.isIntersecting)
            })
          },
          { rootMargin: "-20% 0px -70% 0px" },
        )
        observed.forEach((o) => io.observe(o.fig))
      }
    } catch (err) {
      /* never let styling JS break the page */
      console.warn("blowout.js:", err)
    }
  }

  // initial load + Quartz client-side navigation
  if (document.readyState !== "loading") enhance()
  else document.addEventListener("DOMContentLoaded", enhance)
  document.addEventListener("nav", enhance)
})()
