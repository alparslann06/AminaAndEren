/* ==========================================================
   AminaAndEren – behaviour (vanilla JS, no dependencies)
   Content comes from js/config.js
   ========================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var C = window.SITE_CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.3 2.7 4.5 6.3 4.5c2 0 3.7 1.1 4.7 2.7h2c1-1.6 2.7-2.7 4.7-2.7 3.6 0 5.5 3.8 3.9 7.3C19.5 16.4 12 21 12 21z" fill="currentColor"/></svg>';

  /* ---------- tiny helpers ---------- */
  function make(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function store(key, value) {
    try {
      if (value === undefined) return JSON.parse(localStorage.getItem(key));
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { return null; }
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

  var partyDate = new Date(C.party.date);
  var fmtLong = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  var fmtTime = new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
  var fmtDayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" });

  /* ==========================================================
     Render content
     ========================================================== */
  function renderStatic() {
    var a = C.couple.first, b = C.couple.second;
    $("#name-a").textContent = a;
    $("#name-b").textContent = b;
    $("#tagline").textContent = C.couple.tagline;
    $("#hero-when").textContent = fmtLong.format(partyDate) + " at " + fmtTime.format(partyDate) + ", " + C.party.place;
    document.title = a + " & " + b + " · Birthday Celebration";
    $(".nav__brand span").textContent = a + " & " + b;
    $(".footer__names").innerHTML = "";
    $(".footer__names").append(a + " ", Object.assign(make("i"), { textContent: "&" }), " " + b);

    // Birthdays
    var grid = $("#bday-grid");
    C.birthdays.forEach(function (p, i) {
      var card = make("article", "card bday reveal");
      card.style.setProperty("--stagger", i * 0.12 + "s");
      var av = make("div", "bday__avatar", p.name.charAt(0));
      av.setAttribute("aria-hidden", "true");
      card.append(
        av,
        make("h3", "", p.name),
        make("p", "bday__date", fmtDayMonth.format(new Date(2000, p.month - 1, p.day))),
        make("p", "bday__note", p.note),
        make("span", "bday__left", daysUntilBirthday(p.month, p.day))
      );
      grid.append(card);
    });

    // Timeline
    var tl = $("#timeline");
    C.story.forEach(function (s, i) {
      var li = make("li", "reveal");
      li.style.setProperty("--stagger", i * 0.08 + "s");
      li.append(make("div", "timeline__when", s.when), make("h3", "", s.title), make("p", "", s.text));
      tl.append(li);
    });

    // Gallery
    var gal = $("#gallery-grid");
    C.photos.forEach(function (p, i) {
      var btn = make("button", "gallery__item reveal");
      btn.type = "button";
      btn.dataset.caption = p.caption || "";
      btn.dataset.index = i;
      btn.setAttribute("aria-label", "Open photo: " + (p.caption || p.alt));
      btn.style.setProperty("--stagger", (i % 3) * 0.1 + "s");
      var img = make("img");
      img.src = p.src; img.alt = p.alt || ""; img.loading = "lazy"; img.decoding = "async";
      btn.append(img);
      gal.append(btn);
    });

    // Letter
    var L = C.letter;
    var paper = make("div", "letter__paper");
    var inner = make("div", "letter__inner");
    inner.append(make("p", "greet", L.greeting));
    L.paragraphs.forEach(function (t) { inner.append(make("p", "", t)); });
    inner.append(make("p", "sign", L.signoff), make("p", "from", L.from));
    paper.append(inner);
    $("#letter-paper").append(paper);

    // Party facts + schedule
    var facts = $("#facts");
    [["When", fmtLong.format(partyDate) + ", from " + fmtTime.format(partyDate)],
     ["Where", C.party.place + ", " + C.party.address],
     ["Dress code", C.party.dress]].forEach(function (f) {
      var d = make("div");
      d.append(make("dt", "", f[0]), make("dd", "", f[1]));
      facts.append(d);
    });
    var sched = $("#schedule");
    C.party.schedule.forEach(function (s) {
      var li = make("li");
      var t = make("time", "", s.time);
      li.append(t, make("span", "", s.what));
      sched.append(li);
    });
    $("#map-link").href = C.party.mapLink;
  }

  function daysUntilBirthday(month, day) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var next = new Date(now.getFullYear(), month - 1, day);
    if (next < today) next = new Date(now.getFullYear() + 1, month - 1, day);
    var d = Math.round((next - today) / 86400000);
    if (d === 0) return "It’s today. Happy birthday!";
    if (d === 1) return "Tomorrow";
    return d + " days to go";
  }

  /* ==========================================================
     Floating hearts
     ========================================================== */
  function makeHearts() {
    if (reduceMotion) return;
    var wrap = $("#hearts");
    var count = window.innerWidth < 640 ? 7 : 12;
    for (var i = 0; i < count; i++) {
      var s = make("span");
      s.innerHTML = HEART;
      s.style.left = Math.random() * 100 + "%";
      s.style.setProperty("--s", 12 + Math.random() * 20 + "px");
      s.style.setProperty("--d", 16 + Math.random() * 18 + "s");
      s.style.setProperty("--delay", -Math.random() * 30 + "s");
      s.style.setProperty("--x", (Math.random() * 120 - 60) + "px");
      s.style.color = Math.random() > 0.7 ? "#c99a5b" : "#e4608f";
      wrap.append(s);
    }
  }

  /* ==========================================================
     Confetti
     ========================================================== */
  var confetti = (function () {
    var canvas = $("#confetti"), ctx = canvas.getContext("2d"), parts = [], raf = null, w, h, dpr;
    var colors = ["#e4608f", "#f7b3cb", "#ffd3e1", "#c99a5b", "#ffffff", "#ffb347"];
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr; h = canvas.height = innerHeight * dpr;
    }
    function burst(n) {
      if (reduceMotion) return;
      size();
      for (var i = 0; i < n; i++) {
        var fromLeft = i % 2 === 0;
        parts.push({
          x: (fromLeft ? 0.15 : 0.85) * w, y: h * 0.85,
          vx: (Math.random() * 9 + 3) * dpr * (fromLeft ? 1 : -1),
          vy: -(Math.random() * 16 + 9) * dpr,
          r: (Math.random() * 6 + 4) * dpr, rot: Math.random() * 6, vr: (Math.random() - .5) * .35,
          c: colors[(Math.random() * colors.length) | 0], heart: Math.random() > .75, life: 0
        });
      }
      if (!raf) loop();
    }
    function loop() {
      ctx.clearRect(0, 0, w, h);
      parts = parts.filter(function (p) { return p.y < h + 40 && p.life < 260; });
      parts.forEach(function (p) {
        p.life++; p.vy += 0.34 * dpr; p.vx *= 0.992; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.max(0, 1 - p.life / 260);
        if (p.heart) {
          ctx.scale(p.r / 12, p.r / 12);
          ctx.beginPath(); ctx.moveTo(0, 5); ctx.bezierCurveTo(-12, -4, -6, -12, 0, -5); ctx.bezierCurveTo(6, -12, 12, -4, 0, 5); ctx.fill();
        } else { ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); }
        ctx.restore();
      });
      if (parts.length) raf = requestAnimationFrame(loop);
      else { raf = null; ctx.clearRect(0, 0, w, h); }
    }
    window.addEventListener("resize", function () { if (raf) size(); });
    return { burst: burst };
  })();

  /* ==========================================================
     Intro
     ========================================================== */
  function setupIntro() {
    var intro = $("#intro"), body = document.body;
    var done = false;

    function enter(celebrate) {
      if (done) return; done = true;
      store("ae_intro_seen", true);
      if (celebrate) {
        intro.classList.add("is-out");
        confetti.burst(150);
        setTimeout(function () { confetti.burst(90); }, 450);
      }
      setTimeout(function () {
        intro.classList.add("is-leaving");
        body.classList.remove("is-locked");
        body.classList.add("is-ready");
        setTimeout(function () { intro.classList.add("is-gone"); }, 1200);
      }, celebrate && !reduceMotion ? 1500 : 0);
    }

    // Skip instantly for returning visitors in this tab session unless ?intro is in the URL
    var seen = false;
    try { seen = sessionStorage.getItem("ae_intro") === "1"; } catch (e) {}
    if (seen && location.search.indexOf("intro") === -1) {
      intro.classList.add("is-gone"); body.classList.remove("is-locked"); body.classList.add("is-ready");
      return;
    }
    $("#blow").addEventListener("click", function () {
      try { sessionStorage.setItem("ae_intro", "1"); } catch (e) {}
      startMusic();
      enter(true);
    });
    $("#skip").addEventListener("click", function () {
      try { sessionStorage.setItem("ae_intro", "1"); } catch (e) {}
      enter(false);
    });
    $("#blow").focus({ preventScroll: true });
  }

  /* ==========================================================
     Music
     ========================================================== */
  var audio = $("#audio"), musicBtn = $("#music"), musicOK = false;
  function setupMusic() {
    if (!C.music || !C.music.src) return;
    audio.src = C.music.src;
    audio.volume = C.music.volume != null ? C.music.volume : 0.5;
    audio.addEventListener("canplay", function () { musicOK = true; musicBtn.hidden = false; }, { once: true });
    audio.addEventListener("error", function () { musicOK = false; musicBtn.hidden = true; });
    audio.addEventListener("play", function () { musicBtn.setAttribute("aria-pressed", "true"); musicBtn.setAttribute("aria-label", "Pause music"); });
    audio.addEventListener("pause", function () { musicBtn.setAttribute("aria-pressed", "false"); musicBtn.setAttribute("aria-label", "Play music"); });
    audio.load();
    musicBtn.addEventListener("click", function () {
      if (audio.paused) audio.play().catch(function () { toast("Tap again to start the music"); });
      else audio.pause();
    });
  }
  function startMusic() {
    if (!C.music || !C.music.src) return;
    audio.play().catch(function () { /* autoplay blocked or file missing: silently ignore */ });
  }

  /* ==========================================================
     Countdown
     ========================================================== */
  function setupCountdown() {
    var d = $("#cd-d"), h = $("#cd-h"), m = $("#cd-m"), s = $("#cd-s"), box = $("#countdown");
    function tick() {
      var diff = partyDate - new Date();
      if (diff <= 0) {
        box.innerHTML = "";
        box.style.gridTemplateColumns = "1fr";
        var p = make("p", "", "The party is on. Happy birthday, Amina & Eren!");
        p.style.cssText = "font-family:var(--font-display);font-style:italic;font-size:1.6rem;color:var(--rose-deep);margin:0";
        box.append(p);
        clearInterval(timer);
        return;
      }
      var sec = Math.floor(diff / 1000);
      d.textContent = pad(Math.floor(sec / 86400));
      h.textContent = pad(Math.floor(sec % 86400 / 3600));
      m.textContent = pad(Math.floor(sec % 3600 / 60));
      s.textContent = pad(sec % 60);
    }
    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ==========================================================
     Nav, active link, reveal
     ========================================================== */
  function setupNav() {
    var nav = $("#nav"), links = $("#nav-links"), burger = $("#burger");
    function onScroll() { nav.classList.toggle("is-stuck", window.scrollY > 24); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function setMenu(open) {
      links.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", open);
    }
    burger.addEventListener("click", function () { setMenu(!links.classList.contains("is-open")); });
    links.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

    if (!("IntersectionObserver" in window)) return;
    var map = {};
    $$("a", links).forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          $$("a", links).forEach(function (a) { a.classList.remove("is-active"); });
          map[en.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  function setupReveal() {
    var items = $$(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) { items.forEach(function (n) { n.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ==========================================================
     Lightbox
     ========================================================== */
  function setupLightbox() {
    var lb = $("#lightbox"), img = $("#lb-img"), cap = $("#lb-cap"), idx = 0, opener = null;
    function show(i) {
      idx = (i + C.photos.length) % C.photos.length;
      var p = C.photos[idx];
      img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
      img.src = p.src; img.alt = p.alt || ""; cap.textContent = p.caption || "";
    }
    function open(i, from) { opener = from; show(i); lb.hidden = false; document.body.style.overflow = "hidden"; $("#lb-close").focus(); }
    function close() { lb.hidden = true; document.body.style.overflow = ""; if (opener) opener.focus(); }

    $("#gallery-grid").addEventListener("click", function (e) {
      var b = e.target.closest(".gallery__item");
      if (b) open(+b.dataset.index, b);
    });
    $("#lb-close").addEventListener("click", close);
    $("#lb-prev").addEventListener("click", function () { show(idx - 1); });
    $("#lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    var x0 = null;
    lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (x0 == null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ==========================================================
     Envelope / letter
     ========================================================== */
  function setupLetter() {
    var env = $("#envelope"), paper = $("#letter-paper"), hint = $("#envelope-hint");
    env.addEventListener("click", function () {
      var open = env.getAttribute("aria-expanded") !== "true";
      env.setAttribute("aria-expanded", String(open));
      paper.classList.toggle("is-open", open);
      paper.setAttribute("aria-hidden", String(!open));
      hint.textContent = open ? "Tap to close" : "Tap to open";
      if (open) {
        confetti.burst(40);
        setTimeout(function () { paper.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }); }, 500);
      }
    });
  }

  /* ==========================================================
     RSVP
     ========================================================== */
  function setupRSVP() {
    var form = $("#rsvp"), err = $("#rsvp-error"), done = $("#rsvp-done"), guests = $("#guests-field");
    $$('input[name="attending"]', form).forEach(function (r) {
      r.addEventListener("change", function () { guests.hidden = form.attending.value === "no"; });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      err.hidden = true; done.hidden = true;
      var name = form.name.value.trim();
      form.name.removeAttribute("aria-invalid");
      if (!name) {
        form.name.setAttribute("aria-invalid", "true");
        err.textContent = "Please add your name so we know who’s coming.";
        err.hidden = false; form.name.focus(); return;
      }
      var data = {
        name: name,
        attending: form.attending.value,
        guests: form.attending.value === "yes" ? Math.max(1, Math.min(6, parseInt(form.guests.value, 10) || 1)) : 0,
        note: form.note.value.trim(),
        at: new Date().toISOString()
      };
      var btn = form.querySelector('button[type="submit"]');

      function success() {
        var list = store("ae_rsvps") || []; list.push(data); store("ae_rsvps", list);
        done.textContent = data.attending === "yes"
          ? "Thank you, " + name + ". We can’t wait to see you!"
          : "Thank you, " + name + ". We’ll miss you and are sending love.";
        done.hidden = false;
        if (data.attending === "yes") confetti.burst(60);
        btn.disabled = false;
      }

      if (C.rsvpEndpoint) {
        btn.disabled = true;
        fetch(C.rsvpEndpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
          .then(function (r) { if (!r.ok) throw new Error(); success(); })
          .catch(function () {
            btn.disabled = false;
            err.textContent = "Your RSVP didn’t send. Check your connection and try again.";
            err.hidden = false;
          });
      } else { success(); }
    });

    // Add to calendar (.ics)
    $("#ics").addEventListener("click", function () {
      function stamp(d) { return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + "00Z"; }
      var end = new Date(partyDate.getTime() + 4 * 3600 * 1000);
      var ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AminaAndEren//EN", "BEGIN:VEVENT",
        "UID:" + stamp(partyDate) + "@aminaanderen",
        "DTSTAMP:" + stamp(new Date()), "DTSTART:" + stamp(partyDate), "DTEND:" + stamp(end),
        "SUMMARY:" + C.couple.first + " & " + C.couple.second + " birthday party",
        "LOCATION:" + (C.party.place + ", " + C.party.address).replace(/,/g, "\\,"),
        "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
      a.download = "birthday-party.ics";
      document.body.append(a); a.click(); a.remove();
      toast("Calendar file downloaded");
    });
  }

  /* ==========================================================
     Wishes wall
     ========================================================== */
  function setupWishes() {
    var form = $("#wish-form"), wall = $("#wall"), err = $("#wish-error"), count = $("#wish-count");
    var mine = store("ae_wishes") || [];

    function card(w, isNew) {
      var li = make("li", "wish" + (isNew ? " is-new" : ""));
      li.append(make("p", "", "“" + w.text + "”"), make("cite", "", w.name));
      return li;
    }
    function render() {
      wall.innerHTML = "";
      var all = mine.slice().reverse().concat(C.seedWishes);
      if (!all.length) { wall.append(make("li", "wall__empty", "No wishes yet. Be the first to write one.")); return; }
      all.forEach(function (w) { wall.append(card(w, false)); });
    }
    render();

    form.text.addEventListener("input", function () { count.textContent = form.text.value.length; });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      err.hidden = true;
      var name = form.name.value.trim(), text = form.text.value.trim();
      [form.name, form.text].forEach(function (f) { f.removeAttribute("aria-invalid"); });
      if (!name || !text) {
        (!name ? form.name : form.text).setAttribute("aria-invalid", "true");
        err.textContent = !name ? "Please add your name." : "Please write a few words for the birthday pair.";
        err.hidden = false; (!name ? form.name : form.text).focus(); return;
      }
      var w = { name: name, text: text };
      mine.push(w); store("ae_wishes", mine);
      wall.prepend(card(w, true));
      form.reset(); count.textContent = "0";
      confetti.burst(30);
      toast("Your wish has been posted");
    });
  }

  /* ==========================================================
     Init
     ========================================================== */
  renderStatic();
  makeHearts();
  setupCountdown();
  setupNav();
  setupReveal();
  setupLightbox();
  setupLetter();
  setupRSVP();
  setupWishes();
  setupMusic();
  setupIntro();
})();
