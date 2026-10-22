(function () {
  var root = document.documentElement;

  // Theme toggle: remembers an explicit choice, otherwise follows the OS.
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.dataset.theme ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // Reading progress bar on posts.
  var bar = document.querySelector(".reading-progress span");
  var article = document.querySelector(".post .prose");
  if (bar && article) {
    var update = function () {
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var done = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.style.transform = "scaleX(" + done + ")";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  // Copy buttons on code blocks.
  document.querySelectorAll(".prose div.highlighter-rouge, .prose figure.highlight").forEach(function (block) {
    var code = block.querySelector("pre code") || block.querySelector("pre");
    if (!code || !navigator.clipboard) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(code.innerText).then(function () {
        btn.textContent = "Copied!";
        setTimeout(function () { btn.textContent = "Copy"; }, 1500);
      });
    });
    block.appendChild(btn);
  });

  // Anchor links on post headings.
  document.querySelectorAll(".prose h2[id], .prose h3[id]").forEach(function (h) {
    var a = document.createElement("a");
    a.className = "heading-anchor";
    a.href = "#" + h.id;
    a.setAttribute("aria-label", "Link to this section");
    a.textContent = "#";
    h.appendChild(a);
  });
})();
