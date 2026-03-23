function clamp(n, min, max){
  return Math.max(min, Math.min(max, n));
}

function smoothScrollToHash(hash){
  const el = document.querySelector(hash);
  if(!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initNav(){
  const headerNav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const list = document.querySelector("[data-nav-list]");
  if(!headerNav || !toggle || !list) return;

  function setOpen(open){
    headerNav.dataset.open = open ? "true" : "false";
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  // Default closed
  setOpen(false);

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  // Close on link click
  list.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='#']");
    if(!a) return;
    setOpen(false);
  });

  // Close if user clicks outside (mobile)
  document.addEventListener("click", (e) => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if(!isOpen) return;
    const clickedInside = headerNav.contains(e.target);
    if(!clickedInside) setOpen(false);
  });
}

function initBillingToggle(){
  const buttons = Array.from(document.querySelectorAll("[data-billing]"));
  if(buttons.length === 0) return;

  const plans = Array.from(document.querySelectorAll("[data-plan]"));

  function setBilling(value){
    buttons.forEach((b) => {
      const pressed = b.getAttribute("value") === value;
      b.setAttribute("aria-pressed", pressed ? "true" : "false");
    });

    // Update displayed price amounts.
    plans.forEach((plan) => {
      const amount = plan.querySelector(".plan__amount");
      if(!amount) return;
      const monthly = amount.getAttribute("data-price-monthly");
      const annual = amount.getAttribute("data-price-annual");
      const per = plan.querySelector(".plan__per");
      const price = value === "annual" ? annual : monthly;
      amount.textContent = String(price);
      // Keep /mo to simplify; annual price is per month equivalent.
      if(per) per.textContent = "/mo";
    });
  }

  buttons.forEach((b) => {
    b.addEventListener("click", () => setBilling(b.getAttribute("value")));
  });
}

function initFAQ(){
  const root = document.querySelector("[data-faq]");
  if(!root) return;

  const items = Array.from(root.querySelectorAll("[data-faq-item]"));

  function setItemOpen(item, open){
    item.dataset.open = open ? "true" : "false";
    const btn = item.querySelector("[data-faq-toggle]");
    const panel = item.querySelector("[data-faq-panel]");
    if(btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    if(panel){
      // Use hidden attr to keep layout stable for reduced motion.
      if(open){
        panel.removeAttribute("hidden");
      }else{
        panel.setAttribute("hidden", "");
      }
    }
  }

  // Initialize state based on first expanded button.
  items.forEach((item) => {
    const btn = item.querySelector("[data-faq-toggle]");
    const open = btn ? btn.getAttribute("aria-expanded") === "true" : false;
    setItemOpen(item, open);
  });

  items.forEach((item) => {
    const btn = item.querySelector("[data-faq-toggle]");
    if(!btn) return;
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      // Only one open at a time (typical FAQ UX).
      items.forEach((other) => {
        if(other === item) return;
        setItemOpen(other, false);
      });
      setItemOpen(item, !isOpen);
    });
  });
}

function initCountUp(){
  const nums = Array.from(document.querySelectorAll("[data-countup][data-target]"));
  if(nums.length === 0) return;

  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduced){
    nums.forEach((n) => {
      const target = Number(n.getAttribute("data-target") || "0");
      n.textContent = String(target);
    });
    return;
  }

  // Small, deterministic animation.
  const durationMs = 900;
  let started = false;

  function start(){
    if(started) return;
    started = true;
    const startTime = performance.now();

    function tick(now){
      const t = clamp((now - startTime) / durationMs, 0, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      nums.forEach((n) => {
        const target = Number(n.getAttribute("data-target") || "0");
        const value = Math.round(target * ease);
        n.textContent = String(value);
      });
      if(t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // IntersectionObserver starts animation when mock becomes visible.
  const mock = document.querySelector(".mock");
  if(!mock || !("IntersectionObserver" in window)){
    start();
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for(const e of entries){
      if(e.isIntersecting){
        start();
        io.disconnect();
        return;
      }
    }
  }, { threshold: 0.25 });

  io.observe(mock);
}

function initForm(){
  const form = document.querySelector("[data-contact-form]");
  if(!form) return;
  const status = form.querySelector("[data-form-status]");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if(status) status.textContent = "";

    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim();
    const topic = String(fd.get("topic") || "").trim();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!emailOk){
      if(status) status.textContent = "Please enter a valid email address.";
      return;
    }

    // Demo-only: no backend.
    const msg = topic ? `Thanks! We will email ${email} about "${topic}".` : `Thanks! We will email ${email}.`;
    if(status) status.textContent = msg;
    form.reset();
  });
}

function initSmoothAnchorLinks(){
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='#']");
    if(!a) return;
    const href = a.getAttribute("href");
    if(!href || href === "#") return;
    // Let browser update URL hash; smooth scroll ourselves.
    e.preventDefault();
    history.pushState(null, "", href);
    smoothScrollToHash(href);
  });
}

function initYear(){
  const yearEl = document.getElementById("year");
  if(!yearEl) return;
  yearEl.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initBillingToggle();
  initFAQ();
  initCountUp();
  initForm();
  initSmoothAnchorLinks();
  initYear();
});

