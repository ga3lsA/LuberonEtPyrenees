// ==========================================================================
// Comportements généraux du site (menu mobile, galerie photo, lightbox)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initGallery();
});

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );
}

function initGallery() {
  const grid = document.querySelector("[data-gallery]");
  if (!grid) return;

  const houseKey = grid.getAttribute("data-gallery");
  const house = SITE_CONFIG.houses[houseKey];
  if (!house) return;

  // Construit la grille de vignettes à partir de la config
  grid.innerHTML = house.gallery.map((src, i) => `
    <button type="button" data-index="${i}" aria-label="Agrandir la photo ${i + 1}">
      <img src="${src}" alt="${house.name} — photo ${i + 1}" loading="lazy">
    </button>
  `).join("");

  // Lightbox
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <button class="close" aria-label="Fermer">&times;</button>
    <button class="prev" aria-label="Photo précédente">&#8249;</button>
    <img alt="">
    <button class="next" aria-label="Photo suivante">&#8250;</button>
  `;
  document.body.appendChild(lightbox);

  const imgEl = lightbox.querySelector("img");
  let current = 0;

  function show(i) {
    current = (i + house.gallery.length) % house.gallery.length;
    imgEl.src = house.gallery[current];
    imgEl.alt = `${house.name} — photo ${current + 1}`;
  }
  function open(i) { show(i); lightbox.classList.add("open"); }
  function close() { lightbox.classList.remove("open"); }

  grid.querySelectorAll("button[data-index]").forEach(btn => {
    btn.addEventListener("click", () => open(Number(btn.dataset.index)));
  });
  lightbox.querySelector(".close").addEventListener("click", close);
  lightbox.querySelector(".prev").addEventListener("click", () => show(current - 1));
  lightbox.querySelector(".next").addEventListener("click", () => show(current + 1));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });
}
