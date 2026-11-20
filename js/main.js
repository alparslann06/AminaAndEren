/* ==========================================================
   For Amina – interactive presentation (vanilla JS)
   Content comes from js/config.js
   ========================================================== */
(function () {
  "use strict";

  var C = window.SITE_CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touchOnly = window.matchMedia("(hover: none)").matches;
  var root = document.documentElement;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  /* Mark a node as a presentation step. mode: "auto" (shows when the slide opens) or "click" */
  function step(node, mode, delay, plain) {
    node.dataset.step = mode;
    node.dataset.d = delay || 0;
    if (!plain) node.classList.add("frag");
    return node;
  }
  function pad(n) { return String(n).padStart(2, "0"); }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-show"); }, 3200);
  }

  /* ==========================================================
     Pointer effects: heart trail, bursts, confetti, rain
     ========================================================== */
  var fx = (function () {
    var cv = $("#fx"), ctx = cv.getContext("2d"), W = 0, H = 0, P = [], raf = 0;
    var HEART = new Path2D("M12 21s-7.5-4.6-9.6-9.2C.8 8.3 2.7 4.5 6.3 4.5c2 0 3.7 1.1 4.7 2.7h2c1-1.6 2.7-2.7 4.7-2.7 3.6 0 5.5 3.8 3.9 7.3C19.5 16.4 12 21 12 21z");
    var COLORS = ["#e4608f", "#f48fb1", "#ffb3cc", "#ff7aa8", "#c99a5b", "#ffffff"];
    var MAX = 450;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function pick() { return COLORS[(Math.random() * COLORS.length) | 0]; }
    function add(p) {
      if (P.length > MAX) P.shift();
      p.life = 0; P.push(p);
      if (!raf) raf = requestAnimationFrame(loop);
    }

    function trail(x, y) {
      if (reduce) return;
      add({ k: "h", x: x, y: y, vx: (Math.random() - .5) * .9, vy: -(Math.random() * .9 + .5), g: -0.004, f: 1,
            s: 9 + Math.random() * 11, r: (Math.random() - .5) * .8, vr: (Math.random() - .5) * .04,
            c: pick(), max: 70 + Math.random() * 40, sw: Math.random() * 6.28 });
    }
    function burst(x, y, n) {
      if (reduce) return;
      for (var i = 0; i < n; i++) {
        var a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 5.5;
        add({ k: "h", x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.6, g: .09, f: .965,
              s: 10 + Math.random() * 14, r: Math.random() * 6, vr: (Math.random() - .5) * .2,
              c: pick(), max: 80 + Math.random() * 40, sw: 0 });
      }
    }
    function confetti(n) {
      if (reduce) return;
      for (var i = 0; i < n; i++) {
        var left = i % 2 === 0;
        add({ k: "c", x: (left ? .12 : .88) * W, y: H * .9,
              vx: (Math.random() * 9 + 3) * (left ? 1 : -1), vy: -(Math.random() * 15 + 9), g: .33, f: .992,
              w: Math.random() * 7 + 5, h: Math.random() * 4 + 3, r: Math.random() * 6, vr: (Math.random() - .5) * .35,
              c: pick(), max: 230, sw: 0 });
      }
    }
    function rain(n) {
      if (reduce) return;
      for (var i = 0; i < n; i++) {
        add({ k: "h", x: Math.random() * W, y: -20 - Math.random() * H * .9, vx: 0, vy: 1.2 + Math.random() * 2.2, g: .004, f: 1,
              s: 12 + Math.random() * 18, r: (Math.random() - .5) * .8, vr: (Math.random() - .5) * .03,
              c: pick(), max: 520, sw: Math.random() * 6.28 });
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      var alive = [];
      for (var i = 0; i < P.length; i++) {
        var p = P[i];
        p.life++;
        p.vy += p.g; p.vx *= p.f; p.x += p.vx + (p.sw ? Math.sin(p.life * .08 + p.sw) * .5 : 0); p.y += p.vy; p.r += p.vr;
        if (p.life >= p.max || p.y > H + 40) continue;
        alive.push(p);
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, (p.max - p.life) / 30));
        ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        if (p.k === "h") { var sc = p.s / 24; ctx.scale(sc, sc); ctx.translate(-12, -12); ctx.fill(HEART); }
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      P = alive;
      raf = P.length ? requestAnimationFrame(loop) : 0;
      if (!raf) ctx.clearRect(0, 0, W, H);
    }
    return { trail: trail, burst: burst, confetti: confetti, rain: rain };
  })();

  /* ---------- pointer wiring: trail, glow, parallax, tap bursts ---------- */
  (function () {
    var glow = $("#glow"), gx = 0, gy = 0, tx = 0, ty = 0, graf = 0;
    var lastX = -999, lastY = -999, lastT = 0, pend = false, px = 0, py = 0;

    function glowLoop() {
      gx += (tx - gx) * .18; gy += (ty - gy) * .18;
      glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)";
      graf = (Math.abs(tx - gx) + Math.abs(ty - gy) > .5) ? requestAnimationFrame(glowLoop) : 0;
    }
    window.addEventListener("pointermove", function (e) {
      var x = e.clientX, y = e.clientY, now = performance.now();
      if (e.pointerType === "mouse" && !reduce) {
        tx = x; ty = y; glow.classList.add("is-on");
        if (!graf) graf = requestAnimationFrame(glowLoop);
      }
      // trail: spawn when the pointer has travelled far enough
      var dx = x - lastX, dy = y - lastY;
      if (dx * dx + dy * dy > 340 && now - lastT > 28) {
        fx.trail(x, y);
        if (dx * dx + dy * dy > 3600) fx.trail(x - dx / 2, y - dy / 2);
        lastX = x; lastY = y; lastT = now;
      }
      // parallax
      px = (x / window.innerWidth - .5) * 2; py = (y / window.innerHeight - .5) * 2;
      if (!pend && !reduce) {
        pend = true;
        requestAnimationFrame(function () { root.style.setProperty("--mx", px.toFixed(3)); root.style.setProperty("--my", py.toFixed(3)); pend = false; });
      }
    }, { passive: true });
    window.addEventListener("pointerdown", function (e) { fx.burst(e.clientX, e.clientY, 12); }, { passive: true });
    root.addEventListener("mouseleave", function () { glow.classList.remove("is-on"); });
  })();

  /* floating background hearts */
  (function () {
    if (reduce) return;
    var wrap = $("#floaters"), n = window.innerWidth < 640 ? 7 : 12;
    for (var i = 0; i < n; i++) {
      var s = el("span");
      s.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#heart"/></svg>';
      s.style.left = Math.random() * 100 + "%";
      s.style.setProperty("--s", 12 + Math.random() * 20 + "px");
      s.style.setProperty("--d", 16 + Math.random() * 18 + "s");
      s.style.setProperty("--delay", -Math.random() * 30 + "s");
      s.style.setProperty("--x", (Math.random() * 120 - 60) + "px");
      if (Math.random() > .7) s.style.color = "#c99a5b";
      wrap.append(s);
    }
  })();

  /* ==========================================================
     Build the slides from config
     ========================================================== */
  var deck = $("#deck");
  var slides = [];

  function mk(id, label, cls) {
    var s = el("section", "slide " + (cls || ""));
    s.id = "slide-" + id;
    s.setAttribute("aria-label", label);
    var inner = el("div", "slide__inner");
    s.append(inner);
    slides.push({ id: id, label: label, el: s, inner: inner, steps: [], autos: [], clicks: [], stepped: 0 });
    deck.append(s);
    return slides[slides.length - 1];
  }

  /* ---- 1. Title + countdown ---- */
  var cdNodes = {};
  (function () {
    var s = mk("title", "Happy birthday", "s-title");
    var dateText = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" }).format(new Date(2000, C.birthday.month - 1, C.birthday.day));
    s.inner.append(
      step(el("p", "pre", "Happy birthday"), "auto", .1),
      step(el("h2", "name", C.to), "auto", .35),
      step(el("p", "date", dateText), "auto", .7)
    );
    var cd = el("div", "countdown");
    cd.setAttribute("role", "timer");
    [["d", "days"], ["h", "hours"], ["m", "minutes"], ["s", "seconds"]].forEach(function (u) {
      var cell = el("div"), b = el("b", "", "00");
      cell.append(b, el("span", "", u[1]));
      cdNodes[u[0]] = b; cd.append(cell);
    });
    cdNodes.box = cd;
    s.inner.append(step(cd, "auto", .9));
  })();

  function setupCountdown() {
    var box = cdNodes.box, timer;
    function tick() {
      var now = new Date(), y = now.getFullYear(), m = C.birthday.month - 1, d = C.birthday.day;
      var start = new Date(y, m, d), end = new Date(y, m, d + 1);
      if (now >= start && now < end) {
        box.replaceChildren(el("p", "today-msg", "Today is your day."));
        box.style.display = "block"; clearInterval(timer); return;
      }
      var target = now < start ? start : new Date(y + 1, m, d);
      var sec = Math.floor((target - now) / 1000);
      cdNodes.d.textContent = pad(Math.floor(sec / 86400));
      cdNodes.h.textContent = pad(Math.floor(sec % 86400 / 3600));
      cdNodes.m.textContent = pad(Math.floor(sec % 3600 / 60));
      cdNodes.s.textContent = pad(sec % 60);
    }
    tick(); timer = setInterval(tick, 1000);
  }

  /* ---- 2. Our story (one moment per click) ---- */
  (function () {
    var s = mk("story", C.storyTitle);
    s.inner.append(step(el("h2", "", C.storyTitle), "auto", .1));
    var ul = el("ul", "timeline");
    C.story.forEach(function (it) {
      var li = el("li");
      li.append(el("div", "when", it.when), el("h3", "", it.title), el("p", "", it.text));
      step(li, "click"); ul.append(li);
    });
    s.inner.append(ul);
  })();

  /* ---- 3. Photo pile (one polaroid dropped per click) ---- */
  (function () {
    var s = mk("photos", C.photosTitle, "s-photos");
    s.inner.append(step(el("h2", "", C.photosTitle), "auto", .1));
    var pile = el("div", "pile");
    var rot = [-3, 4, -6, 5, -2, 7, -5, 3], offs = [[0, 0], [10, -6], [-12, 4], [8, 8], [-8, -8], [12, 2], [-10, 6], [6, -4]];
    C.photos.forEach(function (p, i) {
      var fig = el("figure", "polaroid");
      fig.style.setProperty("--r", rot[i % rot.length] + "deg");
      fig.style.setProperty("--tx", offs[i % offs.length][0] + "px");
      fig.style.setProperty("--ty", offs[i % offs.length][1] + "px");
      var img = el("img"); img.src = p.src; img.alt = p.alt || "";
      fig.append(img, el("figcaption", "", p.caption || ""));
      step(fig, i === 0 ? "auto" : "click", i === 0 ? .5 : 0, true);
      pile.append(fig);
    });
    s.inner.append(pile);
  })();

  /* ---- 4. Big lines (one per click) ---- */
  (function () {
    var s = mk("lines", "Things I think about");
    s.inner.append(step(el("p", "slide__lead", C.linesLead), "auto", .1));
    var wrap = el("div", "biglines");
    C.lines.forEach(function (t) { wrap.append(step(el("p", "", t), "click")); });
    s.inner.append(wrap);
  })();

  /* ---- 5. Tap-to-flip hearts ---- */
  var reasonCards = [], foundText, found = 0;
  (function () {
    var s = mk("reasons", C.reasonsTitle, "s-reasons");
    s.inner.append(step(el("h2", "", C.reasonsTitle), "auto", .1));
    foundText = step(el("p", "found", C.reasonsHint), "auto", .25);
    s.inner.append(foundText);
    var grid = el("div", "reasons");
    C.reasons.forEach(function (text, i) {
      var b = el("button", "hc");
      b.type = "button";
      b.setAttribute("aria-label", "Heart " + (i + 1) + " of " + C.reasons.length + ". Tap to reveal");
      b.innerHTML = '<span class="hc__in"><span class="hc__f"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#heart"/></svg></span><span class="hc__b"></span></span>';
      $(".hc__b", b).textContent = text;
      b.addEventListener("click", function () {
        if (b.classList.contains("is-flipped")) return;
        b.classList.add("is-flipped");
        b.setAttribute("aria-label", text);
        found++;
        var r = b.getBoundingClientRect();
        fx.burst(r.left + r.width / 2, r.top + r.height / 2, 16);
        if (found === C.reasons.length) { foundText.textContent = "You found them all."; setTimeout(function () { fx.rain(28); }, 500); }
        else foundText.textContent = found + " of " + C.reasons.length + " found";
      });
      step(b, "auto", .35 + i * .09);
      reasonCards.push(b); grid.append(b);
    });
    s.inner.append(grid);
  })();

  /* ---- 6. The letter ---- */
  var letterStage, letterHint;
  (function () {
    var L = C.letter, s = mk("letter", L.title);
    var hintEl = step(el("p", "slide__lead", L.hint), "auto", .3); letterHint = hintEl;
    s.inner.append(step(el("h2", "", L.title), "auto", .1), hintEl);
    var stage = el("div", "stage"); letterStage = stage;
    var env = el("button", "envelope"); env.type = "button"; env.setAttribute("aria-label", "Open the letter");
    env.innerHTML = '<span class="envelope__back"></span><span class="envelope__paper"></span><span class="envelope__front"></span><span class="envelope__flap"></span><span class="envelope__seal"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#heart"/></svg></span>';
    var letter = el("article", "letter"); letter.tabIndex = 0; letter.dataset.interactive = "1"; letter.setAttribute("aria-label", "Your letter");
    letter.append(el("p", "greet", L.greeting));
    L.paragraphs.forEach(function (t) { letter.append(el("p", "", t)); });
    letter.append(el("p", "sign", L.signoff), el("p", "from", C.from));
    env.addEventListener("click", function () {
      stage.classList.add("is-open");
      hintEl.hidden = true;
      var r = env.getBoundingClientRect();
      fx.burst(r.left + r.width / 2, r.top + r.height / 2, 22);
    });
    stage.append(env, letter);
    s.inner.append(step(stage, "auto", .5));
  })();

  /* ---- 7. Gift ---- */
  var giftSlide;
  (function () {
    var G = C.gift, s = mk("gift", "Your gift", "s-gift");
    giftSlide = s;
    var wrap = el("div", "inner-wrap");
    var before = el("div", "before");
    before.innerHTML = '<svg class="gift-art" viewBox="0 0 120 120" aria-hidden="true"><rect x="20" y="52" width="80" height="58" rx="8" fill="#ffc2d6"/><rect x="54" y="52" width="12" height="58" fill="#e4608f"/><g class="lid"><rect x="14" y="38" width="92" height="20" rx="8" fill="#ffb1cb"/><rect x="54" y="38" width="12" height="20" fill="#e4608f"/><path d="M60 38c-8-18-26-14-22-4 3 7 16 6 22 4z" fill="#e4608f"/><path d="M60 38c8-18 26-14 22-4-3 7-16 6-22 4z" fill="#f06f9d"/></g></svg>';
    var btn = el("button", "btn btn--primary", G.button); btn.type = "button";
    before.append(el("p", "slide__lead", G.lead), el("h2", "", G.title), btn);
    var after = el("div", "after");
    var replay = el("button", "btn btn--ghost", "Watch again"); replay.type = "button";
    after.append(el("h2", "", G.headline), el("p", "gift-text", G.text), el("p", "sign", "Love, " + C.from), replay);
    wrap.append(before, after);
    s.inner.append(step(wrap, "auto", .2));

    btn.addEventListener("click", function () {
      s.el.classList.add("is-opened");
      fx.confetti(170); fx.burst(window.innerWidth / 2, window.innerHeight / 2, 40);
      setTimeout(function () { fx.rain(70); }, 450);
      hintOff();
    });
    replay.addEventListener("click", function () {
      go(0);
      setTimeout(function () {
        s.el.classList.remove("is-opened");
        letterStage.classList.remove("is-open");
        reasonCards.forEach(function (c, i) { c.classList.remove("is-flipped"); c.setAttribute("aria-label", "Heart " + (i + 1) + ". Tap to reveal"); });
        found = 0; foundText.textContent = C.reasonsHint;
        letterHint.hidden = false;
      }, 1000);
    });
  })();

  /* collect steps */
  slides.forEach(function (s) {
    s.steps = Array.prototype.slice.call(s.el.querySelectorAll("[data-step]"));
    s.autos = s.steps.filter(function (n) { return n.dataset.step === "auto"; });
    s.clicks = s.steps.filter(function (n) { return n.dataset.step === "click"; });
  });

  /* ==========================================================
     Presentation engine
     ========================================================== */
  var cur = 0, started = false, moves = 0;
  var prevBtn = $("#prev"), nextBtn = $("#next"), hint = $("#hint"), dotsWrap = $("#dots");
  hint.textContent = touchOnly ? "Tap anywhere to continue, or swipe" : "Click anywhere to continue";

  slides.forEach(function (s, i) {
    var d = el("button", "dot"); d.type = "button";
    d.setAttribute("aria-label", "Go to: " + s.label);
    d.addEventListener("click", function () { if (started) go(i); });
    dotsWrap.append(d);
  });
  var dots = dotsWrap.children;

  function hintOff() { hint.classList.add("is-off"); }

  function show(n, instant) {
    n.style.setProperty("--d", instant ? "0s" : (n.dataset.d || 0) + "s");
    n.classList.add("is-in");
  }
  function reset(s) { s.steps.forEach(function (n) { n.classList.remove("is-in"); }); s.stepped = 0; }

  function paint(n) {
    slides.forEach(function (s, i) {
      s.el.classList.toggle("is-active", i === n);
      s.el.classList.toggle("is-before", i < n);
      if (i === n) { s.el.removeAttribute("inert"); s.el.removeAttribute("aria-hidden"); }
      else { s.el.setAttribute("inert", ""); s.el.setAttribute("aria-hidden", "true"); }
    });
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("is-current", i === n);
      dots[i].classList.toggle("is-done", i < n);
      if (i === n) dots[i].setAttribute("aria-current", "step"); else dots[i].removeAttribute("aria-current");
    }
    root.style.setProperty("--i", n);
    prevBtn.disabled = n === 0;
    nextBtn.disabled = n === slides.length - 1 && slides[n].stepped >= slides[n].clicks.length;
  }

  function enter(n, forward) {
    var s = slides[n];
    if (forward) {
      reset(s); paint(n);
      requestAnimationFrame(function () { requestAnimationFrame(function () { s.autos.forEach(function (x) { show(x); }); }); });
    } else {
      s.steps.forEach(function (x) { show(x, true); }); s.stepped = s.clicks.length; paint(n);
    }
  }

  function go(n) {
    if (n < 0 || n >= slides.length || n === cur) return;
    var forward = n > cur;
    cur = n; enter(n, forward);
  }
  function next() {
    if (!started) return;
    var s = slides[cur];
    if (++moves >= 3) hintOff();
    if (s.stepped < s.clicks.length) { show(s.clicks[s.stepped++]); paint(cur); return; }
    go(cur + 1);
  }
  function prev() {
    if (!started) return;
    var s = slides[cur];
    if (s.stepped > 0 && s.clicks.length) { s.clicks[--s.stepped].classList.remove("is-in"); paint(cur); return; }
    go(cur - 1);
  }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  deck.addEventListener("click", function (e) {
    if (e.target.closest("button, a, [data-interactive]")) return;
    next();
  });
  document.addEventListener("keydown", function (e) {
    if (!started || e.altKey || e.ctrlKey || e.metaKey) return;
    var onControl = e.target.closest && e.target.closest("button, a, input, textarea, [tabindex]");
    switch (e.key) {
      case "ArrowRight": case "PageDown": e.preventDefault(); next(); break;
      case "ArrowLeft": case "PageUp": e.preventDefault(); prev(); break;
      case " ": case "Enter": if (!onControl) { e.preventDefault(); next(); } break;
      case "Home": go(0); break;
      case "End": go(slides.length - 1); break;
    }
  });
  var sx = null, sy = null;
  deck.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  deck.addEventListener("touchend", function (e) {
    if (sx == null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    sx = sy = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0) next(); else prev(); }
  }, { passive: true });

  /* fullscreen */
  (function () {
    var b = $("#fs");
    if (!root.requestFullscreen) return;
    b.hidden = false;
    b.addEventListener("click", function () {
      if (document.fullscreenElement) document.exitFullscreen(); else root.requestFullscreen().catch(function () {});
    });
  })();

  /* ==========================================================
     Music
     ========================================================== */
  var audio = $("#audio"), musicBtn = $("#music");
  (function () {
    if (!C.music || !C.music.src) return;
    audio.src = C.music.src;
    audio.volume = C.music.volume != null ? C.music.volume : .5;
    audio.addEventListener("canplay", function () { musicBtn.hidden = false; }, { once: true });
    audio.addEventListener("error", function () { musicBtn.hidden = true; });
    audio.addEventListener("play", function () { musicBtn.setAttribute("aria-pressed", "true"); musicBtn.setAttribute("aria-label", "Pause music"); });
    audio.addEventListener("pause", function () { musicBtn.setAttribute("aria-pressed", "false"); musicBtn.setAttribute("aria-label", "Play music"); });
    audio.load();
    musicBtn.addEventListener("click", function () {
      if (audio.paused) audio.play().catch(function () { toast("Tap again to start the music"); }); else audio.pause();
    });
  })();

  /* ==========================================================
     Intro → start
     ========================================================== */
  setupCountdown();
  paint(0);

  var intro = $("#intro"), blow = $("#blow");
  blow.addEventListener("click", function () {
    blow.disabled = true;
    intro.classList.add("is-out");
    fx.confetti(150);
    setTimeout(function () { fx.confetti(80); }, 450);
    if (C.music && C.music.src) audio.play().catch(function () {});
    setTimeout(function () {
      intro.classList.add("is-leaving");
      document.body.classList.remove("is-locked");
      started = true;
      enter(0, true);
      setTimeout(function () { intro.classList.add("is-gone"); }, 1200);
    }, reduce ? 0 : 1500);
  });
  blow.focus({ preventScroll: true });
})();
