// ==========================================================================
// Remplit une page "manuel de la maison" à partir des sections définies dans
// js/config.js (SITE_CONFIG.manuals.<maison>), pour n'avoir qu'un seul
// endroit à modifier : ajouter ou réordonner les sections se fait dans le
// tableau de config.js, pas dans ce fichier.
// ==========================================================================

function renderManualPage(houseKey) {
  const sections = SITE_CONFIG.manuals && SITE_CONFIG.manuals[houseKey];
  const wrap = document.querySelector("[data-manual-blocks]");
  if (!sections || !wrap) return;

  wrap.innerHTML = sections.map(renderManualBlock).join("");
}

function renderManualBlock(block) {
  const paragraphs = block.paragraphs.map(p => `<p>${p}</p>`).join("");
  const images = block.images || [];
  const figures = images
    .map(img => `<figure><img src="../${img.src}" alt="${img.alt}" loading="lazy"><figcaption>${img.caption}</figcaption></figure>`)
    .join("");

  return `
    <article class="manual-block">
      <h3>${block.title}</h3>
      ${paragraphs}
      ${figures ? `<div class="manual-images">${figures}</div>` : ""}
    </article>
  `;
}
