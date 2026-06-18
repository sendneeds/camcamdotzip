/*
 * reading-progress.js — camcam.zip
 * Vertical scroll progress, top-right, segmented at review section headings (h2).
 * Stops before "Reference List" — reference entries are never treated as sections.
 */
;(function () {
  var trackEl = null
  var sections = []
  var bound = false

  function getArticle() {
    return document.querySelector(".center article") || document.querySelector("article")
  }

  function getReviewHeadings(article) {
    var root =
      article.querySelector(".markdown-preview-view") ||
      article.querySelector(".markdown-rendered") ||
      article
    var h2s = Array.from(root.querySelectorAll(":scope > h2"))
    if (!h2s.length) h2s = Array.from(root.querySelectorAll("h2"))
    return h2s
  }

  function isReferenceHeading(el) {
    var text = (el.textContent || "").trim().toLowerCase()
    var id = (el.id || "").toLowerCase()
    return text.includes("reference") || id.includes("reference")
  }

  function sectionLabel(h2) {
    var text = (h2.textContent || "").trim().replace(/\s*#+\s*$/, "")
    return text ? text + " -" : ""
  }

  function collectSections(article) {
    var h2s = getReviewHeadings(article)
    var refIndex = h2s.findIndex(isReferenceHeading)
    var reviewH2s = refIndex === -1 ? h2s : h2s.slice(0, refIndex)
    if (!reviewH2s.length) return []

    var refEl = refIndex !== -1 ? h2s[refIndex] : null
    var articleRect = article.getBoundingClientRect()
    var articleBottom = refEl
      ? refEl.getBoundingClientRect().top + window.scrollY
      : articleRect.bottom + window.scrollY

    return reviewH2s.map(function (h2, i) {
      var next = reviewH2s[i + 1] || refEl
      var top = h2.getBoundingClientRect().top + window.scrollY
      var bottom = next
        ? next.getBoundingClientRect().top + window.scrollY
        : articleBottom
      return {
        top: top,
        height: Math.max(bottom - top, 1),
        label: sectionLabel(h2),
        fillEl: null,
      }
    })
  }

  function build() {
    var article = getArticle()
    if (!article) return false

    if (trackEl) trackEl.remove()
    trackEl = null
    sections = []

    var measured = collectSections(article)
    if (!measured.length) return false

    var total = measured.reduce(function (sum, s) {
      return sum + s.height
    }, 0)

    trackEl = document.createElement("div")
    trackEl.className = "reading-progress"
    trackEl.setAttribute("aria-hidden", "true")

    measured.forEach(function (sec, i) {
      // label sits in the break *before* each segment so the trailing "-" lines up with the gap
      var brk = document.createElement("div")
      brk.className = "reading-progress__break"
      var label = document.createElement("span")
      label.className = "reading-progress__label"
      label.textContent = sec.label
      brk.appendChild(label)
      trackEl.appendChild(brk)

      var row = document.createElement("div")
      row.className = "reading-progress__section"
      row.style.height = (sec.height / total) * 100 + "%"

      var track = document.createElement("div")
      track.className = "reading-progress__track"

      var fill = document.createElement("div")
      fill.className = "reading-progress__fill"
      track.appendChild(fill)

      row.appendChild(track)
      trackEl.appendChild(row)

      sec.fillEl = fill
      sections.push(sec)
    })

    document.body.appendChild(trackEl)
    update()
    return true
  }

  function update() {
    if (!sections.length) return
    var marker = window.scrollY + window.innerHeight * 0.33

    sections.forEach(function (sec) {
      if (!sec.fillEl) return
      var start = sec.top
      var end = sec.top + sec.height
      var pct = 0
      if (marker >= end) pct = 100
      else if (marker <= start) pct = 0
      else pct = ((marker - start) / sec.height) * 100
      sec.fillEl.style.height = Math.min(100, Math.max(0, pct)) + "%"
    })
  }

  function bind() {
    if (bound) return
    bound = true
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", onResize, { passive: true })
  }

  var resizeTimer
  function onResize() {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(build, 150)
  }

  function init() {
    try {
      bind()
      if (!build()) {
        setTimeout(build, 120)
        setTimeout(build, 500)
      }
    } catch (e) {
      console.warn("reading-progress.js:", e)
    }
  }

  if (document.readyState !== "loading") init()
  else document.addEventListener("DOMContentLoaded", init)
  document.addEventListener("nav", function () {
    setTimeout(build, 50)
    setTimeout(build, 300)
  })
})()
