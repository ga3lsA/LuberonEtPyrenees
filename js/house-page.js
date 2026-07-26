// ==========================================================================
// Remplit le contenu spécifique à une maison (texte, équipements, tarifs)
// à partir de data/house-<maison>.json (contenu éditable, chargé par
// fetchHouseContent() défini dans js/main.js) et de
// SITE_CONFIG.houses[<maison>] dans js/config.js (réglages techniques du
// moteur de réservation), pour n'avoir qu'un seul endroit à modifier de
// chaque côté.
// ==========================================================================

async function renderHousePage(houseKey) {
  const house = await fetchHouseContent(houseKey);
  if (!house) return;

  const technical = SITE_CONFIG.houses[houseKey];
  document.documentElement.setAttribute("data-theme", technical.theme);
  document.title = `${house.name} — ${house.region} | Luberon & Pyrénées`;

  set("[data-house-hero-img]", el => el.src = house.heroImage);
  set("[data-house-hero-img]", el => el.alt = `${house.name}, ${house.region}`);
  set("[data-house-region]", el => el.textContent = house.region);
  set("[data-house-name]", el => el.textContent = house.name);
  set("[data-house-tagline]", el => el.textContent = house.tagline);

  const descWrap = document.querySelector("[data-house-description]");
  if (descWrap) descWrap.innerHTML = house.description.map(p => `<p>${p}</p>`).join("");

  const amenitiesWrap = document.querySelector("[data-house-amenities]");
  if (amenitiesWrap) amenitiesWrap.innerHTML = house.amenities.map(a => `<li>${a}</li>`).join("");

  set("[data-figure-img]", el => el.src = house.gallery[1] || house.heroImage);

  const hs = house.pricing.highSeason, ls = house.pricing.lowSeason;
  set("[data-price-high-amount]", el => el.innerHTML = `${hs.amount} € <span>${hs.unit}</span>`);
  set("[data-price-high-label]", el => el.textContent = hs.label);
  set("[data-price-high-detail]", el => el.textContent = hs.detail);
  set("[data-price-low-amount]", el => el.innerHTML = `${ls.amount} € <span>${ls.unit}</span>`);
  set("[data-price-low-label]", el => el.textContent = ls.label);
  set("[data-price-low-detail]", el => el.textContent = ls.detail);

  const otherKey = houseKey === "gordes" ? "marquixanes" : "gordes";
  const other = await fetchHouseContent(otherKey);
  if (other) {
    set("[data-other-name]", el => el.textContent = other.name);
    set("[data-other-region]", el => el.textContent = other.region);
  }
  set("[data-other-link]", el => el.href = otherKey + ".html");
}

function set(selector, fn) {
  const el = document.querySelector(selector);
  if (el) fn(el);
}
