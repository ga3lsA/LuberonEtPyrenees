// ==========================================================================
// Remplit une page "manuel de la maison" à partir des sections définies dans
// data/manuals-<maison>.json, pour n'avoir qu'un seul endroit à modifier :
// ajouter ou réordonner les sections se fait dans ce fichier JSON, pas ici.
// Le back office (pages/admin-manuel.html) écrit directement dans ces mêmes
// fichiers JSON via l'API GitHub.
// ==========================================================================

async function renderManualPage(houseKey) {
  const wrap = document.querySelector("[data-manual-blocks]");
  if (!wrap) return;

  try {
    const res = await fetch(`../data/manuals-${houseKey}.json`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const sections = await res.json();
    wrap.innerHTML = sections.map(renderManualBlock).join("");
  } catch (err) {
    console.error("Impossible de charger le manuel de la maison :", err);
  }
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
