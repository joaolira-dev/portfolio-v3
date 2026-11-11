(() => {
  const root = document.documentElement;
  const lang = root.lang.startsWith("en") ? "en" : "pt";
  const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
    .matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const EMAIL = "joaoliradev@hotmail.com";

  const TEXT = {
    pt: {
      copied: "E-mail copiado ✦",
      copyFail: `Copie à mão: ${EMAIL}`,
      usedIn: "em",
      notFound: "comando não encontrado:",
      hired: "Permissão concedida. Vamos conversar? ✦",
      placeholder: "digite um comando…",
      navigate: "navegar",
      run: "executar",
      close: "fechar",
      dialog: "Terminal de comandos",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
    },
    en: {
      copied: "Email copied ✦",
      copyFail: `Copy it manually: ${EMAIL}`,
      usedIn: "in",
      notFound: "command not found:",
      hired: "Permission granted. Shall we talk? ✦",
      placeholder: "type a command…",
      navigate: "navigate",
      run: "run",
      close: "close",
      dialog: "Command terminal",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
  }[lang];

  /* ---------- Aviso rápido ---------- */
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.append(toast);
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2400);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      showToast(TEXT.copied);
    } catch {
      showToast(TEXT.copyFail);
    }
  };

  /* ---------- Header, progresso e link ativo ---------- */
  const headerBar = $(".header-bar");
  const progress = $(".scroll-progress");
  let ticking = false;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.scrollY;
    progress?.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);
    headerBar?.classList.toggle("is-scrolled", y > 24);
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );
  onScroll();

  if ("IntersectionObserver" in window) {
    const navLinks = $$('nav > a[href^="#"]');
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    $$("main section[id]").forEach((s) => sectionObserver.observe(s));
  }

  /* ---------- Menu mobile ---------- */
  const menuBtn = $(".menu-toggle");
  const menu = $("#menu");
  const setMenu = (open) => {
    if (!menuBtn || !menu) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? TEXT.closeMenu : TEXT.openMenu);
    menu.classList.toggle("is-open", open);
  };
  menuBtn?.addEventListener("click", () =>
    setMenu(menuBtn.getAttribute("aria-expanded") !== "true"),
  );
  menu?.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("click", (e) => {
    if (menu?.classList.contains("is-open") && !e.target.closest(".header"))
      setMenu(false);
  });

  /* ---------- Skills: em quais projetos aparecem ---------- */
  const projects = $$(".project[data-tech]").map((p) => ({
    name: $("h3", p)?.textContent.trim(),
    tech: p.dataset.tech.split(" "),
  }));
  $$(".skills span").forEach((chip) => {
    const key = $("img", chip)
      ?.getAttribute("src")
      .split("/")
      .pop()
      .replace(".svg", "");
    const used = projects.filter((p) => p.tech.includes(key));
    if (used.length)
      chip.dataset.used = `${TEXT.usedIn} ${used.map((p) => p.name).join(" · ")}`;
  });

  /* ---------- Contato: copiar e-mail e hora local ---------- */
  $(".copy-email")?.addEventListener("click", copyEmail);
  const clock = $(".local-time time");
  if (clock) {
    const fmt = new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Fortaleza",
    });
    const tick = () => {
      const now = new Date();
      clock.textContent = fmt.format(now);
      clock.dateTime = now.toISOString();
    };
    tick();
    setInterval(tick, 15000);
  }

  /* ---------- Paleta de comandos ---------- */
  const go = (sel) => {
    $(sel)?.scrollIntoView({ behavior: motionOK ? "smooth" : "auto" });
    history.replaceState(null, "", sel === "#inicio" ? location.pathname : sel);
  };
  const open = (url) => window.open(url, "_blank", "noopener");
  const COMMANDS = {
    pt: [
      ["projetos", "Ir para os projetos", () => go("#projetos")],
      ["experiencia", "Ver minha trajetória", () => go("#experiencia")],
      ["sobre", "Quem sou eu e minhas tecnologias", () => go("#sobre")],
      ["contato", "Vamos conversar", () => go("#contato")],
      ["cv", "Abrir o currículo (PDF)", () => open("curriculo.pdf")],
      ["email", "Copiar meu e-mail", copyEmail],
      ["github", "Abrir meu GitHub", () => open("https://github.com/joaolira-dev")],
      ["linkedin", "Abrir meu LinkedIn", () => open("https://www.linkedin.com/in/joaolira-dev/")],
      ["instagram", "Abrir meu Instagram", () => open("https://www.instagram.com/joaoliradev/")],
      ["english", "Switch to English", () => (location.href = "en.html")],
      ["topo", "Voltar ao início", () => go("#inicio")],
      ["sudo contratar", "Hmm, ótima ideia 👀", () => { go("#contato"); showToast(TEXT.hired); }],
    ],
    en: [
      ["projects", "Go to projects", () => go("#projetos")],
      ["experience", "See my journey", () => go("#experiencia")],
      ["about", "Who I am and my stack", () => go("#sobre")],
      ["contact", "Let’s talk", () => go("#contato")],
      ["cv", "Open my résumé (PDF)", () => open("curriculo.pdf")],
      ["email", "Copy my email", copyEmail],
      ["github", "Open my GitHub", () => open("https://github.com/joaolira-dev")],
      ["linkedin", "Open my LinkedIn", () => open("https://www.linkedin.com/in/joaolira-dev/")],
      ["instagram", "Open my Instagram", () => open("https://www.instagram.com/joaoliradev/")],
      ["portugues", "Mudar para português", () => (location.href = "index.html")],
      ["top", "Back to top", () => go("#inicio")],
      ["sudo hire", "Hmm, great idea 👀", () => { go("#contato"); showToast(TEXT.hired); }],
    ],
  }[lang];

  const norm = (s) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

  const cmdk = document.createElement("div");
  cmdk.className = "cmdk";
  cmdk.innerHTML = `
    <div class="cmdk-box" role="dialog" aria-modal="true" aria-label="${TEXT.dialog}">
      <div class="cmdk-bar" aria-hidden="true"><span>● ● ●</span>joao@portfolio:~</div>
      <div class="cmdk-row">
        <label for="cmdk-input">joao@portfolio:~$</label>
        <input id="cmdk-input" type="text" autocomplete="off" spellcheck="false"
          role="combobox" aria-expanded="true" aria-controls="cmdk-list"
          aria-autocomplete="list" placeholder="${TEXT.placeholder}" />
      </div>
      <ul class="cmdk-list" id="cmdk-list" role="listbox"></ul>
      <div class="cmdk-foot" aria-hidden="true">
        <span><kbd>↑</kbd><kbd>↓</kbd> ${TEXT.navigate}</span>
        <span><kbd>Enter</kbd> ${TEXT.run}</span>
        <span><kbd>Esc</kbd> ${TEXT.close}</span>
      </div>
    </div>`;
  document.body.append(cmdk);
  const input = $("input", cmdk);
  const list = $(".cmdk-list", cmdk);
  let filtered = COMMANDS;
  let selected = 0;
  let lastFocus = null;

  const render = () => {
    const q = norm(input.value);
    filtered = COMMANDS.filter(
      ([cmd, desc]) => norm(cmd).includes(q) || norm(desc).includes(q),
    );
    selected = Math.min(selected, Math.max(filtered.length - 1, 0));
    list.replaceChildren(
      ...filtered.map(([cmd, desc], i) => {
        const li = document.createElement("li");
        li.id = `cmdk-opt-${i}`;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", String(i === selected));
        const b = document.createElement("span");
        b.textContent = cmd;
        const small = document.createElement("small");
        small.textContent = desc;
        li.append(b, small);
        li.addEventListener("mousemove", () => {
          if (selected !== i) {
            selected = i;
            render();
          }
        });
        li.addEventListener("click", () => runSelected());
        return li;
      }),
    );
    if (!filtered.length) {
      const li = document.createElement("li");
      li.className = "cmdk-empty";
      li.textContent = `${TEXT.notFound} ${input.value.trim()}`;
      list.append(li);
      input.removeAttribute("aria-activedescendant");
    } else {
      input.setAttribute("aria-activedescendant", `cmdk-opt-${selected}`);
      $(`#cmdk-opt-${selected}`)?.scrollIntoView({ block: "nearest" });
    }
  };
  const openCmdk = () => {
    lastFocus = document.activeElement;
    setMenu(false);
    input.value = "";
    selected = 0;
    render();
    cmdk.classList.add("is-open");
    requestAnimationFrame(() => input.focus());
  };
  const closeCmdk = () => {
    cmdk.classList.remove("is-open");
    lastFocus?.focus?.();
  };
  const runSelected = () => {
    const item = filtered[selected];
    if (!item) return;
    closeCmdk();
    item[2]();
  };
  input.addEventListener("input", () => {
    selected = 0;
    render();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!filtered.length) return;
      const dir = e.key === "ArrowDown" ? 1 : -1;
      selected = (selected + dir + filtered.length) % filtered.length;
      render();
    } else if (e.key === "Enter") {
      e.preventDefault();
      runSelected();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  });
  cmdk.addEventListener("click", (e) => {
    if (e.target === cmdk) closeCmdk();
  });
  $(".cmdk-hint")?.addEventListener("click", openCmdk);
  document.addEventListener("keydown", (e) => {
    const typing = e.target.closest?.("input, textarea, [contenteditable]");
    if (e.key === "Escape") {
      if (cmdk.classList.contains("is-open")) closeCmdk();
      setMenu(false);
      return;
    }
    if (
      (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
      (e.key === "/" && !typing)
    ) {
      e.preventDefault();
      cmdk.classList.contains("is-open") ? closeCmdk() : openCmdk();
    }
  });

  /* ---------- Daqui para baixo: só animações ---------- */
  if (!motionOK || !("IntersectionObserver" in window)) return;
  root.classList.add("motion-ready");

  // Títulos revelados linha a linha
  $$("main h2").forEach((h2) => {
    const parts = h2.innerHTML.split(/<br\s*\/?>/i);
    h2.innerHTML = parts
      .map(
        (part, i) =>
          `<span class="line"><span class="line-inner" style="--l:${i}">${part.trim()}</span></span>`,
      )
      .join("");
  });

  // Etiquetas e skills entram em sequência
  $$(".skills, .tags").forEach((group) => {
    group.classList.add("stagger");
    [...group.children].forEach((child, i) => child.style.setProperty("--i", i));
  });

  const revealTargets = $$(
    ".section-heading, .experience-grid, .about > div, .contact-grid",
  );
  revealTargets.forEach((t) => t.classList.add("reveal"));
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  [...revealTargets, ...$$(".project")].forEach((t) => revealObserver.observe(t));

  // Terminal digitando a experiência
  const timeline = $(".timeline");
  const cmdEl = $(".term-cmd");
  if (timeline && cmdEl) {
    const full = cmdEl.textContent;
    cmdEl.textContent = "";
    const steps = [...$$(".timeline-item", timeline), $(".timeline > .text-link")];
    const termObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        termObserver.disconnect();
        let i = 0;
        const type = () => {
          cmdEl.textContent = full.slice(0, ++i);
          if (i < full.length) setTimeout(type, 45 + Math.random() * 45);
          else
            steps.forEach((el, n) =>
              setTimeout(() => el?.classList.add("is-shown"), 250 + n * 260),
            );
        };
        setTimeout(type, 350);
      },
      { threshold: 0.35 },
    );
    termObserver.observe(timeline);
  }

  // Título do hero se "decodificando"
  const scramble = $("[data-scramble]");
  if (scramble) {
    const final = scramble.textContent;
    const glyphs = "<>/{}[]=+*#$01_";
    const duration = 1100;
    let start;
    scramble.classList.add("is-scrambling");
    const frame = (t) => {
      start ??= t;
      const p = Math.min((t - start) / duration, 1);
      const done = Math.floor(p * final.length);
      scramble.textContent =
        final.slice(0, done) +
        [...final.slice(done)]
          .map(() => glyphs[Math.floor(Math.random() * glyphs.length)])
          .join("");
      if (p < 1) requestAnimationFrame(frame);
      else {
        scramble.textContent = final;
        scramble.classList.remove("is-scrambling");
      }
    };
    setTimeout(() => requestAnimationFrame(frame), 450);
  }

  // Palavras sendo digitadas no hero
  const word = $(".rotator-word");
  if (word) {
    const words = word.dataset.words.split("|");
    let w = 0;
    let c = words[0].length;
    let deleting = false;
    const loop = () => {
      const current = words[w];
      if (!deleting && c === current.length) {
        deleting = true;
        return setTimeout(loop, 2000);
      }
      if (deleting && c === 0) {
        deleting = false;
        w = (w + 1) % words.length;
        return setTimeout(loop, 300);
      }
      c += deleting ? -1 : 1;
      word.textContent = words[w].slice(0, c);
      setTimeout(loop, deleting ? 28 : 55 + Math.random() * 40);
    };
    setTimeout(loop, 2400);
  }

  if (!finePointer) return;

  // Brilho que segue o mouse no hero
  const hero = $(".hero");
  hero?.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--gx", `${e.clientX - r.left}px`);
    hero.style.setProperty("--gy", `${e.clientY - r.top}px`);
  });

  // Botões magnéticos
  $$(".button, .nav-contact").forEach((el) => {
    el.classList.add("magnetic");
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.22;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      el.style.setProperty("--mx", `${Math.max(-10, Math.min(10, x))}px`);
      el.style.setProperty("--my", `${Math.max(-8, Math.min(8, y))}px`);
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    });
  });

  // Inclinação 3D nas capturas dos projetos
  $$(".project-art").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
      card.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
      card.style.setProperty("--px", `${x * 100}%`);
      card.style.setProperty("--py", `${y * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
})();
