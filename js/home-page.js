// ==========================================================================
// Remplit la page d'accueil à partir de data/home.json, pour n'avoir qu'un
// seul endroit à modifier (ou le back office, pages/admin-manuel.html).
// ==========================================================================

async function renderHomePage() {
  const wrap = document.querySelector("[data-home-why-cards]");
  if (!wrap && !document.querySelector("[data-home-hero-title]")) return;

  try {
    const res = await fetch("data/home.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const home = await res.json();

    set("[data-home-hero-eyebrow]", el => el.textContent = home.hero.eyebrow);
    set("[data-home-hero-title]", el => el.textContent = home.hero.title);
    set("[data-home-hero-tag]", el => el.textContent = home.hero.tagline);
    set("[data-home-hero-img]", el => { el.src = home.hero.image; el.alt = home.hero.imageAlt; });

    set("[data-home-diptych-eyebrow]", el => el.textContent = home.hero.eyebrow);
    set("[data-home-diptych-title]", el => el.textContent = home.diptychTitle);

    for (const key of ["gordes", "marquixanes"]) {
      const card = home.houseCards[key];
      if (!card) continue;
      set(`[data-home-card-img="${key}"]`, el => { el.src = card.image; el.alt = card.imageAlt; });
      set(`[data-home-card-region="${key}"]`, el => el.textContent = card.region);
      set(`[data-home-card-title="${key}"]`, el => el.textContent = card.title);
      set(`[data-home-card-text="${key}"]`, el => el.textContent = card.text);
    }

    set("[data-home-why-eyebrow]", el => el.textContent = home.whyEyebrow);
    set("[data-home-why-title]", el => el.textContent = home.whyTitle);
    set("[data-home-why-text]", el => el.textContent = home.whyText);
    const whyWrap = document.querySelector("[data-home-why-cards]");
    if (whyWrap) {
      whyWrap.innerHTML = home.whyCards.map(c => `
        <div class="why-card">
          <h4>${c.title}</h4>
          <p>${c.text}</p>
        </div>
      `).join("");
    }

    set("[data-home-art-eyebrow]", el => el.textContent = home.artEyebrow);
    set("[data-home-art-title]", el => el.textContent = home.artTitle);
    const artWrap = document.querySelector("[data-home-art-cards]");
    if (artWrap) {
      artWrap.innerHTML = home.artCards.map(c => `
        <div class="region-card">
          <img src="${c.image}" alt="${c.imageAlt}" loading="lazy">
          <span class="region-tag">${c.tag}</span>
          <h3>${c.title}</h3>
          <p>${c.text}</p>
        </div>
      `).join("");
    }
  } catch (err) {
    console.error("Impossible de charger le contenu de la page d'accueil :", err);
  }
}

function set(selector, fn) {
  const el = document.querySelector(selector);
  if (el) fn(el);
}

document.addEventListener("DOMContentLoaded", renderHomePage);
