/* =========================================
   AB ART — Interacciones
   ========================================= */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- Pantalla de carga ----- */
  const loader = document.querySelector(".loader");
  const hideLoader = () => loader && loader.classList.add("is-hidden");
  window.addEventListener("load", () => setTimeout(hideLoader, reduceMotion ? 0 : 700));
  setTimeout(hideLoader, 3500); // por si alguna imagen tarda demasiado

  /* ----- Encabezado al hacer scroll ----- */
  const header = document.querySelector(".header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----- Cerrar menú móvil al elegir una opción ----- */
  const menuToggle = document.getElementById("menu-toggle");
  document.querySelectorAll(".nav a").forEach((link) =>
    link.addEventListener("click", () => {
      if (menuToggle) menuToggle.checked = false;
    })
  );

  /* ----- Aparición suave al hacer scroll ----- */
  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  /* ----- Filtros de la galería ----- */
  document.querySelectorAll("[data-filters]").forEach((group) => {
    const gallery = document.getElementById(group.dataset.filters);
    if (!gallery) return;
    group.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (!button) return;
      group.querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", b === button));
      const filter = button.dataset.filter;
      gallery.querySelectorAll(".gallery__item").forEach((item) => {
        const show = filter === "todos" || item.dataset.cat === filter;
        item.hidden = !show;
        if (show) item.classList.add("is-visible");
      });
    });
  });

  /* ----- Visor de imágenes (lightbox) ----- */
  if (!document.querySelector(".gallery")) return;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.innerHTML = `
    <button class="lightbox__close" aria-label="Cerrar">&times;</button>
    <button class="lightbox__nav lightbox__nav--prev" aria-label="Anterior">&#8249;</button>
    <figure class="lightbox__figure">
      <img alt="">
      <figcaption></figcaption>
    </figure>
    <button class="lightbox__nav lightbox__nav--next" aria-label="Siguiente">&#8250;</button>`;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector("img");
  const lbCaption = lightbox.querySelector("figcaption");
  let list = [];
  let index = 0;

  const show = (i) => {
    index = (i + list.length) % list.length;
    const source = list[index];
    lbImg.src = source.currentSrc || source.src;
    lbImg.alt = source.alt;
    const caption = source.closest("figure").querySelector("figcaption");
    lbCaption.textContent = caption ? caption.textContent : "";
  };

  const open = (img) => {
    list = [...img.closest(".gallery").querySelectorAll(".gallery__item:not([hidden]) img")];
    show(list.indexOf(img));
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  document.addEventListener("click", (e) => {
    const img = e.target.closest(".gallery__item img");
    if (img) open(img);
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.closest(".lightbox__close")) close();
    else if (e.target.closest(".lightbox__nav--prev")) show(index - 1);
    else if (e.target.closest(".lightbox__nav--next")) show(index + 1);
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();
