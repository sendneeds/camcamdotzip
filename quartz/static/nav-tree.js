/*
 * nav-tree.js — camcam.zip
 *
 * Renders the ascii directory tree. Desktop: fixed top-left rail.
 * Mobile: first element in document flow, centred in the viewport.
 */
;(function () {
  var ROOT_LABEL = "camcam.zip/"
  var AUTHOR = "by Cameron Campbell"
  var MOBILE_MAX = 999

  var SHORT = {
    coral: "coral",
    "coral/literature-review": "Literature Review",
    "coral/study-design-and-ethical-considerations-and-implications": "Study Design",
  }

  var dataCache = null
  var sectionRows = []
  var pageRows = []
  var bound = false
  var lastMobile = null

  function isMobile() {
    return window.innerWidth <= MOBILE_MAX
  }

  function normSlug(p) {
    try {
      p = decodeURIComponent(p)
    } catch (e) {}
    return p
      .replace(/^\/+/, "")
      .replace(/\/+$/, "")
      .replace(/(^|\/)index$/, "")
      .replace(/\/+$/, "")
  }

  function currentSlug() {
    return normSlug(location.pathname)
  }

  function rootBase() {
    var a = document.querySelector(".page-title a")
    if (a && a.getAttribute("href")) {
      return a.getAttribute("href").replace(/\/?$/, "/")
    }
    var segs = currentSlug().split("/").filter(Boolean)
    return segs.length ? new Array(segs.length + 1).join("../") : "./"
  }

  function prettify(seg) {
    return (seg || "").replace(/-/g, " ").replace(/\b\w/g, function (c) {
      return c.toUpperCase()
    })
  }

  function shortName(pathStr, seg) {
    return SHORT[pathStr] || prettify(seg)
  }

  function getArticle() {
    return document.querySelector(".center article") || document.querySelector("article")
  }

  function slugifyId(s) {
    return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  }

  function isReferenceHeading(el) {
    var t = (el.textContent || "").trim().toLowerCase()
    var id = (el.id || "").toLowerCase()
    return t.indexOf("reference") !== -1 || id.indexOf("reference") !== -1
  }

  function getReviewHeadings(article) {
    var root =
      article.querySelector(".markdown-preview-view") ||
      article.querySelector(".markdown-rendered") ||
      article
    var h2s = Array.prototype.slice.call(root.querySelectorAll(":scope > h2"))
    if (!h2s.length) h2s = Array.prototype.slice.call(root.querySelectorAll("h2"))
    var refIndex = h2s.findIndex(isReferenceHeading)
    return refIndex === -1 ? h2s : h2s.slice(0, refIndex)
  }

  function buildTrie(data) {
    var root = { children: {} }
    Object.keys(data).forEach(function (slug) {
      var parts = slug.split("/")
      if (parts[parts.length - 1] === "index") parts.pop()
      if (!parts.length) return
      if (parts[0] === "tags") return
      var node = root
      parts.forEach(function (seg, idx) {
        if (!node.children[seg]) {
          node.children[seg] = { seg: seg, path: parts.slice(0, idx + 1), children: {} }
        }
        node = node.children[seg]
      })
    })
    return root
  }

  function toNodes(trieNode, base) {
    return Object.keys(trieNode.children)
      .map(function (k) {
        return trieNode.children[k]
      })
      .map(function (n) {
        var pathStr = n.path.join("/")
        var hasChildren = Object.keys(n.children).length > 0
        return {
          pathStr: pathStr,
          label: shortName(pathStr, n.seg),
          href: base + pathStr + "/",
          isDir: hasChildren,
          isSection: false,
          children: toNodes(n, base),
        }
      })
      .sort(function (a, b) {
        return a.label.localeCompare(b.label)
      })
  }

  function attachSections(nodes) {
    var cur = currentSlug()
    var article = getArticle()
    if (!article) return
    function walk(list) {
      list.forEach(function (n) {
        if (n.pathStr === cur) {
          n.children = getReviewHeadings(article).map(function (h2) {
            if (!h2.id) h2.id = slugifyId(h2.textContent) || "section"
            return {
              label: (h2.textContent || "").trim().replace(/\s*#+\s*$/, ""),
              href: "#" + h2.id,
              headingId: h2.id,
              isSection: true,
              isDir: false,
              children: [],
            }
          })
        } else if (n.children.length) {
          walk(n.children)
        }
      })
    }
    walk(nodes)
  }

  function prefixOf(ancestors) {
    return ancestors
      .map(function (hasNext) {
        return hasNext ? "│   " : "    "
      })
      .join("")
  }

  function flatten(nodes, ancestors, out) {
    nodes.forEach(function (node, i) {
      var last = i === nodes.length - 1
      var prefix = prefixOf(ancestors)

      if (!node.isSection) {
        out.push({ spacer: true, gutter: prefix + "│" })
      }

      var conn = last ? "└── " : "├── "
      var label = node.label + (node.isDir ? "/" : "")

      out.push({
        gutter: prefix + conn,
        label: label,
        href: node.href,
        isSection: node.isSection,
        headingId: node.headingId,
        pathStr: node.isSection ? null : node.pathStr,
      })

      if (node.children && node.children.length) {
        flatten(node.children, ancestors.concat([!last]), out)
      }
    })
  }

  function buildTreeEl(rows, base) {
    var tree = document.createElement("div")
    tree.className = "ascii-tree" + (isMobile() ? " ascii-tree--mobile" : "")

    var rootRow = document.createElement("div")
    rootRow.className = "ascii-row is-root"
    var rootG = document.createElement("span")
    rootG.className = "g"
    rootG.textContent = ""
    var rootA = document.createElement("a")
    rootA.href = base
    rootA.textContent = ROOT_LABEL
    rootRow.appendChild(rootG)
    rootRow.appendChild(rootA)
    tree.appendChild(rootRow)

    sectionRows = []
    pageRows = []
    var cur = currentSlug()
    rows.forEach(function (r) {
      var row = document.createElement("div")
      row.className = "ascii-row" + (r.isSection ? " toc-section" : "")
      var g = document.createElement("span")
      g.className = "g"
      g.textContent = r.gutter
      row.appendChild(g)
      if (!r.spacer) {
        var a = document.createElement("a")
        a.className = "lbl"
        a.href = r.href || "#"
        a.textContent = r.label
        row.appendChild(a)
        if (r.isSection && r.headingId) {
          row.dataset.h = r.headingId
          sectionRows.push({ row: row, headingId: r.headingId, top: 0 })
        } else if (r.pathStr && r.pathStr === cur) {
          row.classList.add("nav-page")
          pageRows.push({ row: row })
        }
      }
      tree.appendChild(row)
    })

    return tree
  }

  function mountTree(tree) {
    var prev = document.querySelector(".ascii-tree")
    if (prev) prev.remove()

    if (isMobile()) {
      var body = document.getElementById("quartz-body")
      if (body) body.insertBefore(tree, body.firstChild)
      else document.body.appendChild(tree)
      document.documentElement.style.setProperty("--tree-reserve", "1rem")
    } else {
      document.body.appendChild(tree)
      setReserve(tree)
    }
  }

  function setReserve(tree) {
    if (isMobile()) {
      document.documentElement.style.setProperty("--tree-reserve", "1rem")
      return
    }
    var left = 32
    var gap = 40
    var w = tree.getBoundingClientRect().width
    document.documentElement.style.setProperty("--tree-reserve", left + w + gap + "px")
  }

  function ensureBackToTop() {
    var prev = document.querySelector(".back-to-top")
    if (prev) prev.remove()
    if (!isMobile()) return

    var btn = document.createElement("a")
    btn.href = "#top"
    btn.className = "back-to-top"
    btn.setAttribute("aria-label", "Back to top")
    btn.textContent = "↑"
    btn.addEventListener("click", function (e) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
    document.body.appendChild(btn)
  }

  function render(rows, base) {
    var tree = buildTreeEl(rows, base)
    mountTree(tree)
    ensureBackToTop()
  }

  function addAuthor() {
    var meta = document.querySelector(".content-meta")
    if (meta && !meta.querySelector(".meta-author")) {
      var s = document.createElement("span")
      s.className = "meta-author"
      s.textContent = AUTHOR
      meta.appendChild(s)
    }
  }

  function measure() {
    sectionRows.forEach(function (s) {
      var h = document.getElementById(s.headingId)
      s.top = h ? h.getBoundingClientRect().top + window.scrollY : 0
    })
  }

  function update() {
    var marker = window.scrollY + window.innerHeight * 0.3
    var idx = -1
    for (var i = 0; i < sectionRows.length; i++) {
      if (sectionRows[i].top <= marker) idx = i
    }

    sectionRows.forEach(function (s, i) {
      s.row.classList.toggle("nav-current", i === idx)
      s.row.classList.toggle("nav-read", idx !== -1 && i < idx)
    })

    // before the first section is reached, highlight the current page (e.g. Literature Review)
    pageRows.forEach(function (p) {
      var atPageTop = sectionRows.length === 0 || idx === -1
      p.row.classList.toggle("nav-current", atPageTop)
      p.row.classList.toggle("nav-read", !atPageTop)
    })
  }

  function buildFrom(data) {
    var base = rootBase()
    var nodes = toNodes(buildTrie(data), base)
    attachSections(nodes)
    var rows = []
    flatten(nodes, [], rows)
    render(rows, base)
    lastMobile = isMobile()
    measure()
    update()
  }

  function fetchData(cb) {
    if (dataCache) {
      cb(dataCache)
      return
    }
    fetch(rootBase() + "static/contentIndex.json")
      .then(function (r) {
        return r.json()
      })
      .then(function (d) {
        dataCache = d.content || d
        cb(dataCache)
      })
      .catch(function (e) {
        console.warn("nav-tree.js fetch:", e)
      })
  }

  var resizeTimer
  function onResize() {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(function () {
      var mobile = isMobile()
      if (lastMobile !== null && lastMobile !== mobile && dataCache) {
        buildFrom(dataCache)
      } else {
        var tree = document.querySelector(".ascii-tree")
        if (tree) setReserve(tree)
        ensureBackToTop()
      }
      lastMobile = mobile
      measure()
      update()
    }, 150)
  }

  function bind() {
    if (bound) return
    bound = true
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", onResize, { passive: true })
  }

  function init() {
    try {
      bind()
      addAuthor()
      fetchData(function (data) {
        try {
          buildFrom(data)
          setTimeout(function () {
            measure()
            update()
          }, 300)
        } catch (e) {
          console.warn("nav-tree.js build:", e)
        }
      })
    } catch (e) {
      console.warn("nav-tree.js:", e)
    }
  }

  if (document.readyState !== "loading") init()
  else document.addEventListener("DOMContentLoaded", init)
  document.addEventListener("nav", function () {
    setTimeout(init, 50)
  })
})()
