/*
 * blowout.js — camcam.zip
 *
 * Wraps image+caption pairs into <figure class="blowout">. The caption is pulled
 * out of the image paragraph into a full-width box beneath the image. No margin
 * blowout or leader lines.
 */
;(function () {
  function getRoot() {
    var art = document.querySelector(".center article") || document.querySelector("article")
    if (!art) return null
    return (
      art.querySelector(":scope > .markdown-preview-view") ||
      art.querySelector(".markdown-preview-view") ||
      art.querySelector(":scope > .markdown-rendered") ||
      art
    )
  }

  function wrapFigures(r) {
    var ps = Array.prototype.slice.call(r.querySelectorAll(":scope > p"))
    ps.forEach(function (p) {
      var img = p.querySelector(":scope > img")
      if (!img) return
      if (p.closest("figure.blowout")) return

      var fig = document.createElement("figure")
      fig.className = "blowout"
      p.parentNode.insertBefore(fig, p)
      fig.appendChild(p)
      p.classList.add("blowout-img")

      var em = p.querySelector(":scope > em")
      if (em) {
        var capP = document.createElement("p")
        capP.className = "blowout-cap"
        capP.appendChild(em)
        fig.appendChild(capP)
      }

      while (
        p.lastChild &&
        (p.lastChild.nodeName === "BR" ||
          (p.lastChild.nodeType === 3 && !p.lastChild.textContent.trim()))
      ) {
        p.removeChild(p.lastChild)
      }
    })
  }

  function wrapAlbumCaptions(r) {
    var kids = Array.prototype.slice.call(r.children)
    for (var i = 0; i < kids.length; i++) {
      if (!kids[i].classList || !kids[i].classList.contains("table-container")) continue
      if (!kids[i].querySelector("img")) continue

      var j = i
      while (
        j + 1 < kids.length &&
        kids[j + 1].classList &&
        kids[j + 1].classList.contains("table-container")
      ) {
        j++
      }

      var cap = kids[j + 1]
      if (
        cap &&
        cap.tagName === "P" &&
        cap.querySelector("em") &&
        !cap.querySelector("img") &&
        !cap.classList.contains("blowout-cap")
      ) {
        cap.classList.add("blowout-cap")
      }
      i = j
    }
  }

  function build() {
    var root = getRoot()
    if (!root) return false
    wrapFigures(root)
    wrapAlbumCaptions(root)
    return root.querySelector("figure.blowout, .blowout-cap") !== null
  }

  function init() {
    try {
      if (!build()) {
        setTimeout(build, 200)
        setTimeout(build, 600)
      }
    } catch (e) {
      console.warn("blowout.js:", e)
    }
  }

  if (document.readyState !== "loading") init()
  else document.addEventListener("DOMContentLoaded", init)
  document.addEventListener("nav", function () {
    setTimeout(init, 60)
  })
})()
