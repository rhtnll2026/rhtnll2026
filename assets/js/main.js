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

  // Language toggle: switches interface text in place, and jumps to the
  // translated version when reading a post that has one.
  var setLang = function (lang) {
    root.dataset.uiLang = lang;
    root.lang = lang === "zh" ? "zh-CN" : "en";
    try { localStorage.setItem("lang", lang); } catch (e) {}
    document.querySelectorAll("[data-aria-en]").forEach(function (el) {
      el.setAttribute("aria-label", el.getAttribute("data-aria-" + lang));
    });
  };
  setLang(root.dataset.uiLang === "zh" ? "zh" : "en");

  var langToggle = document.querySelector(".lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", function () {
      var next = root.dataset.uiLang === "zh" ? "en" : "zh";
      setLang(next);
      if (langToggle.dataset.altUrl && langToggle.dataset.altLang === next) {
        window.location.href = langToggle.dataset.altUrl;
      }
    });
  }
  document.querySelectorAll("a[data-set-lang]").forEach(function (a) {
    a.addEventListener("click", function () { setLang(a.dataset.setLang); });
  });

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
