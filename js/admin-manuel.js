// ==========================================================================
// Back office du site (pages/admin-manuel.html). Lit et écrit directement
// les fichiers data/*.json sur GitHub via l'API Contents, avec un jeton
// d'accès personnel saisi par l'utilisateur et conservé uniquement dans le
// localStorage de son appareil.
// ==========================================================================

const REPO_OWNER = "ga3lsA";
const REPO_NAME = "LuberonEtPyrenees";
const BRANCH = "main";
const TOKEN_STORAGE_KEY = "admin_manuel_gh_token";

const PAGE_TYPES = {
  "home": { label: "Accueil", path: "data/home.json" },
  "gordes": { label: "Gordes", path: "data/house-gordes.json" },
  "marquixanes": { label: "Marquixanes", path: "data/house-marquixanes.json" },
  "contact": { label: "Contact", path: "data/contact.json" },
  "manual-gordes": { label: "Manuel Gordes", path: "data/manuals-gordes.json" },
  "manual-marquixanes": { label: "Manuel Marquixanes", path: "data/manuals-marquixanes.json" }
};

let token = "";
let currentPageType = null;
let currentData = null;
let currentSha = null;

function el(selector) {
  return document.querySelector(selector);
}

function init() {
  const saved = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (saved) {
    token = saved;
    el("#token-input").value = saved;
    el("#token-status").textContent = "Jeton mémorisé sur cet appareil.";
    el("#page-card").hidden = false;
  }
  el("#token-connect").addEventListener("click", onConnect);
  el("#save-btn").addEventListener("click", saveCurrentPage);
  document.querySelectorAll("#page-card .admin-house-btn").forEach(btn =>
    btn.addEventListener("click", () => selectPage(btn.dataset.page))
  );
}

async function onConnect() {
  const value = el("#token-input").value.trim();
  if (!value) return;
  token = value;
  const status = el("#token-status");
  status.textContent = "Vérification...";
  try {
    const res = await githubFetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`);
    if (!res.ok) throw new Error("Jeton invalide, expiré, ou sans accès à ce dépôt (code " + res.status + ")");
    if (el("#token-remember").checked) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    status.textContent = "Connecté.";
    el("#page-card").hidden = false;
  } catch (err) {
    status.textContent = "Erreur : " + err.message;
  }
}

function githubFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
}

async function selectPage(pageType) {
  currentPageType = pageType;
  document.querySelectorAll("#page-card .admin-house-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.page === pageType)
  );
  const meta = PAGE_TYPES[pageType];
  el("#content-title").textContent = `3. ${meta.label}`;
  el("#content-card").hidden = false;
  el("#content-body").innerHTML = "Chargement...";
  try {
    const res = await githubFetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${meta.path}?ref=${BRANCH}`);
    if (!res.ok) throw new Error(`Impossible de charger ${meta.path} (code ${res.status})`);
    const data = await res.json();
    currentSha = data.sha;
    currentData = JSON.parse(b64DecodeUnicode(data.content));
    renderContentEditor();
  } catch (err) {
    el("#content-body").textContent = "Erreur : " + err.message;
  }
}

function renderContentEditor() {
  const body = el("#content-body");
  body.innerHTML = "";
  if (currentPageType === "home") renderHomeEditor(body);
  else if (currentPageType === "contact") renderContactEditor(body);
  else if (currentPageType.startsWith("manual-")) renderManualEditor(body);
  else renderHouseEditor(body, currentPageType);
}

/* -------------------------------------------------------------------- */
/* Champs génériques                                                     */
/* -------------------------------------------------------------------- */

function addTextField(container, label, value, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "admin-field-group";
  const l = document.createElement("label");
  l.textContent = label;
  const input = document.createElement("input");
  input.type = "text";
  input.value = value || "";
  input.addEventListener("input", () => onChange(input.value));
  wrap.appendChild(l);
  wrap.appendChild(input);
  container.appendChild(wrap);
  return input;
}

function addNumberField(container, label, value, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "admin-field-group";
  const l = document.createElement("label");
  l.textContent = label;
  const input = document.createElement("input");
  input.type = "number";
  input.value = value;
  input.addEventListener("input", () => onChange(Number(input.value)));
  wrap.appendChild(l);
  wrap.appendChild(input);
  container.appendChild(wrap);
  return input;
}

function addTextArea(container, label, value, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "admin-field-group";
  const l = document.createElement("label");
  l.textContent = label;
  const textarea = document.createElement("textarea");
  textarea.value = value || "";
  textarea.addEventListener("input", () => onChange(textarea.value));
  wrap.appendChild(l);
  wrap.appendChild(textarea);
  container.appendChild(wrap);
  return textarea;
}

function addSubhead(container, text, subtext) {
  const h = document.createElement("h3");
  h.className = "admin-subhead";
  h.textContent = text;
  container.appendChild(h);
  if (subtext) {
    const p = document.createElement("p");
    p.className = "admin-subtext";
    p.textContent = subtext;
    container.appendChild(p);
  }
}

function moveItem(array, index, delta) {
  const target = index + delta;
  if (target < 0 || target >= array.length) return false;
  const [item] = array.splice(index, 1);
  array.splice(target, 0, item);
  return true;
}

/* -------------------------------------------------------------------- */
/* Liste de textes courts (équipements) et de paragraphes (description)  */
/* -------------------------------------------------------------------- */

function renderStringListEditor(container, array, { addLabel, placeholder }) {
  const wrap = document.createElement("div");
  container.appendChild(wrap);

  function render() {
    wrap.innerHTML = "";
    array.forEach((val, i) => {
      const row = document.createElement("div");
      row.className = "admin-string-row";
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = placeholder || "";
      input.value = val;
      input.addEventListener("input", () => { array[i] = input.value; });
      row.appendChild(input);
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "admin-remove";
      removeBtn.textContent = "×";
      removeBtn.setAttribute("aria-label", "Supprimer");
      removeBtn.addEventListener("click", () => { array.splice(i, 1); render(); });
      row.appendChild(removeBtn);
      wrap.appendChild(row);
    });
  }
  render();

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-ghost admin-small-btn";
  addBtn.textContent = addLabel || "+ Ajouter";
  addBtn.addEventListener("click", () => { array.push(""); render(); });
  container.appendChild(addBtn);
}

function renderParagraphListEditor(container, array, addLabel) {
  const wrap = document.createElement("div");
  container.appendChild(wrap);

  function render() {
    wrap.innerHTML = "";
    array.forEach((val, i) => {
      const row = document.createElement("div");
      row.className = "admin-paragraph-row";
      const textarea = document.createElement("textarea");
      textarea.value = val;
      textarea.addEventListener("input", () => { array[i] = textarea.value; });
      row.appendChild(textarea);
      if (array.length > 1) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "admin-remove";
        removeBtn.textContent = "×";
        removeBtn.setAttribute("aria-label", "Supprimer ce paragraphe");
        removeBtn.addEventListener("click", () => { array.splice(i, 1); render(); });
        row.appendChild(removeBtn);
      }
      wrap.appendChild(row);
    });
  }
  render();

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-ghost admin-small-btn";
  addBtn.textContent = addLabel || "+ Ajouter un paragraphe";
  addBtn.addEventListener("click", () => { array.push(""); render(); });
  container.appendChild(addBtn);
}

/* -------------------------------------------------------------------- */
/* Photos : champ image unique, et galerie (liste de chemins simples)    */
/* -------------------------------------------------------------------- */

function renderSingleImageField(container, label, obj, key, uploadFolder) {
  const wrap = document.createElement("div");
  wrap.className = "admin-field-group";
  const l = document.createElement("label");
  l.textContent = label;
  wrap.appendChild(l);

  const row = document.createElement("div");
  row.className = "admin-image-row";
  const thumbWrap = document.createElement("div");
  thumbWrap.className = "admin-thumb-wrap";
  const thumb = document.createElement("img");
  thumb.className = "admin-thumb";
  thumb.alt = "";
  const missingLabel = document.createElement("span");
  missingLabel.className = "admin-thumb-missing";
  missingLabel.textContent = "Photo manquante";
  missingLabel.hidden = true;
  thumb.addEventListener("error", () => { thumb.hidden = true; missingLabel.hidden = false; });

  function refreshThumb() {
    thumb.hidden = false;
    missingLabel.hidden = true;
    thumb.src = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${obj[key]}?t=${Date.now()}`;
  }
  refreshThumb();
  thumbWrap.appendChild(thumb);
  thumbWrap.appendChild(missingLabel);
  row.appendChild(thumbWrap);

  const replaceLabel = document.createElement("label");
  replaceLabel.className = "admin-replace-btn";
  replaceLabel.textContent = "Remplacer la photo";
  const replaceInput = document.createElement("input");
  replaceInput.type = "file";
  replaceInput.accept = "image/*";
  replaceInput.hidden = true;
  replaceInput.addEventListener("change", async () => {
    const file = replaceInput.files[0];
    if (!file) return;
    const original = replaceLabel.textContent;
    replaceLabel.textContent = "Envoi en cours...";
    try {
      const path = await uploadImage(file, uploadFolder);
      obj[key] = path;
      refreshThumb();
    } catch (err) {
      alert("Échec de l'envoi de la photo : " + err.message);
    } finally {
      replaceLabel.textContent = original;
      replaceInput.value = "";
    }
  });
  replaceLabel.appendChild(replaceInput);
  row.appendChild(replaceLabel);

  wrap.appendChild(row);
  container.appendChild(wrap);
}

function renderGalleryEditor(container, array, uploadFolder) {
  const wrap = document.createElement("div");
  wrap.className = "admin-images";
  container.appendChild(wrap);

  function render() {
    wrap.innerHTML = "";
    array.forEach((src, i) => {
      const row = document.createElement("div");
      row.className = "admin-image-row";

      const thumbWrap = document.createElement("div");
      thumbWrap.className = "admin-thumb-wrap";
      const thumb = document.createElement("img");
      thumb.src = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${src}?t=${Date.now()}`;
      thumb.loading = "lazy";
      thumb.className = "admin-thumb";
      thumb.alt = "";
      const missingLabel = document.createElement("span");
      missingLabel.className = "admin-thumb-missing";
      missingLabel.textContent = "Photo manquante";
      missingLabel.hidden = true;
      thumb.addEventListener("error", () => { thumb.hidden = true; missingLabel.hidden = false; });
      thumbWrap.appendChild(thumb);
      thumbWrap.appendChild(missingLabel);
      row.appendChild(thumbWrap);

      const fields = document.createElement("div");
      fields.className = "admin-image-fields";
      const replaceLabel = document.createElement("label");
      replaceLabel.className = "admin-replace-btn";
      replaceLabel.textContent = "Remplacer la photo";
      const replaceInput = document.createElement("input");
      replaceInput.type = "file";
      replaceInput.accept = "image/*";
      replaceInput.hidden = true;
      replaceInput.addEventListener("change", async () => {
        const file = replaceInput.files[0];
        if (!file) return;
        const original = replaceLabel.textContent;
        replaceLabel.textContent = "Envoi en cours...";
        try {
          const path = await uploadImage(file, uploadFolder);
          array[i] = path;
          render();
        } catch (err) {
          alert("Échec de l'envoi de la photo : " + err.message);
        } finally {
          replaceLabel.textContent = original;
          replaceInput.value = "";
        }
      });
      replaceLabel.appendChild(replaceInput);
      fields.appendChild(replaceLabel);
      row.appendChild(fields);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "admin-remove";
      removeBtn.textContent = "×";
      removeBtn.setAttribute("aria-label", "Retirer cette photo");
      removeBtn.addEventListener("click", () => { array.splice(i, 1); render(); });
      row.appendChild(removeBtn);

      wrap.appendChild(row);
    });
  }
  render();

  const uploadLabel = document.createElement("label");
  uploadLabel.className = "btn btn-ghost admin-small-btn admin-upload-btn";
  uploadLabel.textContent = "+ Ajouter une photo";
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.hidden = true;
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;
    const original = uploadLabel.textContent;
    uploadLabel.textContent = "Envoi en cours...";
    try {
      const path = await uploadImage(file, uploadFolder);
      array.push(path);
      render();
    } catch (err) {
      alert("Échec de l'envoi de la photo : " + err.message);
    } finally {
      uploadLabel.textContent = original;
      fileInput.value = "";
    }
  });
  uploadLabel.appendChild(fileInput);
  container.appendChild(uploadLabel);
}

/* -------------------------------------------------------------------- */
/* Liste de "cartes" réordonnables/ajoutables (accueil : pourquoi nous,  */
/* art de vivre)                                                         */
/* -------------------------------------------------------------------- */

function renderCardListEditor(container, array, { fields, withImage, uploadFolder, addLabel }) {
  const labelMap = { title: "Titre", text: "Texte", tag: "Étiquette (ex. région)" };
  const wrap = document.createElement("div");
  container.appendChild(wrap);

  function render() {
    wrap.innerHTML = "";
    array.forEach((item, i) => {
      const card = document.createElement("div");
      card.className = "admin-section";

      const header = document.createElement("div");
      header.className = "admin-section-header";
      const moveWrap = document.createElement("div");
      moveWrap.className = "admin-section-move";
      const upBtn = document.createElement("button");
      upBtn.type = "button";
      upBtn.textContent = "↑";
      upBtn.setAttribute("aria-label", "Monter la carte");
      upBtn.disabled = i === 0;
      upBtn.addEventListener("click", () => { moveItem(array, i, -1); render(); });
      const downBtn = document.createElement("button");
      downBtn.type = "button";
      downBtn.textContent = "↓";
      downBtn.setAttribute("aria-label", "Descendre la carte");
      downBtn.disabled = i === array.length - 1;
      downBtn.addEventListener("click", () => { moveItem(array, i, 1); render(); });
      moveWrap.appendChild(upBtn);
      moveWrap.appendChild(downBtn);
      header.appendChild(moveWrap);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "admin-remove";
      removeBtn.textContent = "×";
      removeBtn.setAttribute("aria-label", "Supprimer la carte");
      removeBtn.addEventListener("click", () => { array.splice(i, 1); render(); });
      header.appendChild(removeBtn);
      card.appendChild(header);

      if (withImage) {
        renderSingleImageField(card, "Photo", item, "image", uploadFolder);
        addTextField(card, "Description de la photo (accessibilité)", item.imageAlt, v => item.imageAlt = v);
      }
      fields.forEach(f => {
        if (f === "text") addTextArea(card, labelMap[f] || f, item[f], v => item[f] = v);
        else addTextField(card, labelMap[f] || f, item[f], v => item[f] = v);
      });

      wrap.appendChild(card);
    });
  }
  render();

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-ghost admin-small-btn";
  addBtn.textContent = addLabel || "+ Ajouter";
  addBtn.addEventListener("click", () => {
    const blank = {};
    if (withImage) { blank.image = ""; blank.imageAlt = ""; }
    fields.forEach(f => blank[f] = "");
    array.push(blank);
    render();
  });
  container.appendChild(addBtn);
}

/* -------------------------------------------------------------------- */
/* Éditeur : page d'accueil                                              */
/* -------------------------------------------------------------------- */

function renderHomeEditor(container) {
  const home = currentData;

  addSubhead(container, "Bandeau d'accueil");
  addTextField(container, "Eyebrow (petit texte au-dessus du titre)", home.hero.eyebrow, v => home.hero.eyebrow = v);
  addTextField(container, "Titre principal", home.hero.title, v => home.hero.title = v);
  addTextArea(container, "Sous-titre", home.hero.tagline, v => home.hero.tagline = v);
  renderSingleImageField(container, "Photo du bandeau", home.hero, "image", "images/site");

  addSubhead(container, "Cartes des deux maisons", "Titre de la section, puis texte et photo pour chaque maison.");
  addTextField(container, "Titre de la section", home.diptychTitle, v => home.diptychTitle = v);
  for (const key of ["gordes", "marquixanes"]) {
    const card = home.houseCards[key];
    const label = document.createElement("p");
    label.className = "admin-subtext";
    label.style.fontWeight = "700";
    label.textContent = key === "gordes" ? "Carte Gordes" : "Carte Marquixanes";
    container.appendChild(label);
    addTextField(container, "Région affichée", card.region, v => card.region = v);
    addTextArea(container, "Texte", card.text, v => card.text = v);
    renderSingleImageField(container, "Photo", card, "image", "images/site");
  }

  addSubhead(container, "Pourquoi nous choisir");
  addTextField(container, "Eyebrow", home.whyEyebrow, v => home.whyEyebrow = v);
  addTextField(container, "Titre", home.whyTitle, v => home.whyTitle = v);
  addTextArea(container, "Texte d'intro", home.whyText, v => home.whyText = v);
  renderCardListEditor(container, home.whyCards, { fields: ["title", "text"], addLabel: "+ Ajouter une carte" });

  addSubhead(container, "L'art de vivre (régions)");
  addTextField(container, "Eyebrow", home.artEyebrow, v => home.artEyebrow = v);
  addTextField(container, "Titre", home.artTitle, v => home.artTitle = v);
  renderCardListEditor(container, home.artCards, {
    fields: ["tag", "title", "text"], withImage: true, uploadFolder: "images/site",
    addLabel: "+ Ajouter une carte"
  });
}

/* -------------------------------------------------------------------- */
/* Éditeur : page maison (Gordes / Marquixanes)                          */
/* -------------------------------------------------------------------- */

function renderHouseEditor(container, houseKey) {
  const house = currentData;
  const folder = `images/${houseKey}/galerie`;

  addSubhead(container, "Informations générales");
  addTextField(container, "Nom de la maison", house.name, v => house.name = v);
  addTextField(container, "Région affichée", house.region, v => house.region = v);
  addTextArea(container, "Phrase d'intro (sous le titre)", house.tagline, v => house.tagline = v);
  renderSingleImageField(container, "Photo principale (bandeau)", house, "heroImage", folder);

  addSubhead(container, "Description", "Un paragraphe par bloc de texte.");
  renderParagraphListEditor(container, house.description, "+ Ajouter un paragraphe");

  addSubhead(container, "Équipements", "Un élément par ligne (ex. « Piscine partagée »).");
  renderStringListEditor(container, house.amenities, { addLabel: "+ Ajouter un équipement", placeholder: "Ex. Climatisation" });

  addSubhead(container, "Galerie photo");
  renderGalleryEditor(container, house.gallery, folder);

  addSubhead(container, "Tarifs");
  const hs = house.pricing.highSeason, ls = house.pricing.lowSeason;

  const highLabel = document.createElement("p");
  highLabel.className = "admin-subtext";
  highLabel.style.fontWeight = "700";
  highLabel.textContent = "Haute saison";
  container.appendChild(highLabel);
  const rowHigh = document.createElement("div");
  rowHigh.className = "admin-field-row";
  container.appendChild(rowHigh);
  addTextField(rowHigh, "Libellé (ex. « Juillet – Août »)", hs.label, v => hs.label = v);
  addNumberField(rowHigh, "Montant (€)", hs.amount, v => hs.amount = v);
  addTextField(container, "Unité (ex. « la semaine »)", hs.unit, v => hs.unit = v);
  addTextArea(container, "Détail (conditions d'arrivée/départ)", hs.detail, v => hs.detail = v);

  const lowLabel = document.createElement("p");
  lowLabel.className = "admin-subtext";
  lowLabel.style.fontWeight = "700";
  lowLabel.textContent = "Hors saison";
  container.appendChild(lowLabel);
  const rowLow = document.createElement("div");
  rowLow.className = "admin-field-row";
  container.appendChild(rowLow);
  addTextField(rowLow, "Libellé (ex. « Hors saison »)", ls.label, v => ls.label = v);
  addNumberField(rowLow, "Montant (€)", ls.amount, v => ls.amount = v);
  addTextField(container, "Unité (ex. « la nuit »)", ls.unit, v => ls.unit = v);
  addTextArea(container, "Détail", ls.detail, v => ls.detail = v);
}

/* -------------------------------------------------------------------- */
/* Éditeur : page contact                                                */
/* -------------------------------------------------------------------- */

function renderContactEditor(container) {
  const contact = currentData;
  addTextField(container, "Eyebrow", contact.eyebrow, v => contact.eyebrow = v);
  addTextField(container, "Titre", contact.title, v => contact.title = v);
  addTextArea(container, "Texte d'introduction", contact.text, v => contact.text = v);
}

/* -------------------------------------------------------------------- */
/* Éditeur : pages manuel (sections avec titre, texte, photos)           */
/* -------------------------------------------------------------------- */

function renderManualEditor(container) {
  const houseKey = currentPageType.replace("manual-", "");
  const folder = `images/${houseKey}/manuel`;
  const sections = currentData;

  const list = document.createElement("div");
  container.appendChild(list);

  function renderList() {
    list.innerHTML = "";
    sections.forEach((section, i) => list.appendChild(renderSectionCard(section, i)));
  }

  function renderSectionCard(section, index) {
    const card = document.createElement("div");
    card.className = "admin-section";

    const header = document.createElement("div");
    header.className = "admin-section-header";

    const moveWrap = document.createElement("div");
    moveWrap.className = "admin-section-move";
    const upBtn = document.createElement("button");
    upBtn.type = "button";
    upBtn.textContent = "↑";
    upBtn.setAttribute("aria-label", "Monter la section");
    upBtn.disabled = index === 0;
    upBtn.addEventListener("click", () => { moveItem(sections, index, -1); renderList(); });
    const downBtn = document.createElement("button");
    downBtn.type = "button";
    downBtn.textContent = "↓";
    downBtn.setAttribute("aria-label", "Descendre la section");
    downBtn.disabled = index === sections.length - 1;
    downBtn.addEventListener("click", () => { moveItem(sections, index, 1); renderList(); });
    moveWrap.appendChild(upBtn);
    moveWrap.appendChild(downBtn);
    header.appendChild(moveWrap);

    const removeSectionBtn = document.createElement("button");
    removeSectionBtn.type = "button";
    removeSectionBtn.className = "admin-remove";
    removeSectionBtn.textContent = "×";
    removeSectionBtn.setAttribute("aria-label", "Supprimer la section");
    removeSectionBtn.addEventListener("click", () => {
      if (!confirm("Supprimer cette section ? Cette action n'est effective qu'après avoir cliqué sur « Enregistrer ».")) return;
      sections.splice(index, 1);
      renderList();
    });
    header.appendChild(removeSectionBtn);

    card.appendChild(header);

    addTextField(card, "Titre", section.title, v => section.title = v);

    const paraLabel = document.createElement("label");
    paraLabel.textContent = "Texte";
    card.appendChild(paraLabel);
    renderParagraphListEditor(card, section.paragraphs, "+ Ajouter un paragraphe");

    const imgLabel = document.createElement("label");
    imgLabel.textContent = "Photos";
    card.appendChild(imgLabel);

    section.images = section.images || [];
    renderManualImageEditor(card, section.images, folder);

    return card;
  }

  renderList();

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-ghost";
  addBtn.textContent = "+ Ajouter une section";
  addBtn.addEventListener("click", () => {
    sections.push({ title: "Nouvelle section", paragraphs: [""], images: [] });
    renderList();
  });
  container.appendChild(addBtn);
}

function renderManualImageEditor(container, images, uploadFolder) {
  const wrap = document.createElement("div");
  wrap.className = "admin-images";
  container.appendChild(wrap);

  function render() {
    wrap.innerHTML = "";
    images.forEach((img, ii) => {
      const row = document.createElement("div");
      row.className = "admin-image-row";

      const thumbWrap = document.createElement("div");
      thumbWrap.className = "admin-thumb-wrap";
      const thumb = document.createElement("img");
      thumb.src = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${img.src}?t=${Date.now()}`;
      thumb.loading = "lazy";
      thumb.className = "admin-thumb";
      thumb.alt = "";
      const missingLabel = document.createElement("span");
      missingLabel.className = "admin-thumb-missing";
      missingLabel.textContent = "Photo manquante";
      missingLabel.hidden = true;
      thumb.addEventListener("error", () => { thumb.hidden = true; missingLabel.hidden = false; });
      thumbWrap.appendChild(thumb);
      thumbWrap.appendChild(missingLabel);
      row.appendChild(thumbWrap);

      const fields = document.createElement("div");
      fields.className = "admin-image-fields";
      const captionInput = document.createElement("input");
      captionInput.type = "text";
      captionInput.placeholder = "Légende affichée sous la photo";
      captionInput.value = img.caption || "";
      captionInput.addEventListener("input", () => { img.caption = captionInput.value; });
      const altInput = document.createElement("input");
      altInput.type = "text";
      altInput.placeholder = "Description (accessibilité)";
      altInput.value = img.alt || "";
      altInput.addEventListener("input", () => { img.alt = altInput.value; });
      fields.appendChild(captionInput);
      fields.appendChild(altInput);

      const replaceLabel = document.createElement("label");
      replaceLabel.className = "admin-replace-btn";
      replaceLabel.textContent = "Remplacer la photo";
      const replaceInput = document.createElement("input");
      replaceInput.type = "file";
      replaceInput.accept = "image/*";
      replaceInput.hidden = true;
      replaceInput.addEventListener("change", async () => {
        const file = replaceInput.files[0];
        if (!file) return;
        const original = replaceLabel.textContent;
        replaceLabel.textContent = "Envoi en cours...";
        try {
          const path = await uploadImage(file, uploadFolder);
          img.src = path;
          render();
        } catch (err) {
          alert("Échec de l'envoi de la photo : " + err.message);
        } finally {
          replaceLabel.textContent = original;
          replaceInput.value = "";
        }
      });
      replaceLabel.appendChild(replaceInput);
      fields.appendChild(replaceLabel);
      row.appendChild(fields);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "admin-remove";
      removeBtn.textContent = "×";
      removeBtn.setAttribute("aria-label", "Retirer cette photo");
      removeBtn.addEventListener("click", () => { images.splice(ii, 1); render(); });
      row.appendChild(removeBtn);

      wrap.appendChild(row);
    });
  }
  render();

  const uploadLabel = document.createElement("label");
  uploadLabel.className = "btn btn-ghost admin-small-btn admin-upload-btn";
  uploadLabel.textContent = "+ Ajouter une photo";
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.hidden = true;
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;
    const original = uploadLabel.textContent;
    uploadLabel.textContent = "Envoi en cours...";
    try {
      const path = await uploadImage(file, uploadFolder);
      images.push({ src: path, alt: "", caption: "" });
      render();
    } catch (err) {
      alert("Échec de l'envoi de la photo : " + err.message);
    } finally {
      uploadLabel.textContent = original;
      fileInput.value = "";
    }
  });
  uploadLabel.appendChild(fileInput);
  container.appendChild(uploadLabel);
}

/* -------------------------------------------------------------------- */
/* Upload de photo, sauvegarde, encodage                                 */
/* -------------------------------------------------------------------- */

async function uploadImage(file, folder) {
  const base64 = await fileToBase64(file);
  const filename = sanitizeFilename(file.name);
  const path = `${folder}/${filename}`;
  const res = await githubFetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Ajoute une photo : ${path}`,
      content: base64,
      branch: BRANCH
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return path;
}

function sanitizeFilename(name) {
  const stamp = Date.now();
  const clean = name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-");
  return `${stamp}-${clean}`;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
    reader.readAsDataURL(file);
  });
}

async function saveCurrentPage() {
  const status = el("#save-status");
  status.textContent = "Enregistrement...";
  try {
    const meta = PAGE_TYPES[currentPageType];
    const content = b64EncodeUnicode(JSON.stringify(currentData, null, 2) + "\n");
    const res = await githubFetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${meta.path}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Met à jour ${meta.label} depuis le back office`,
        content,
        sha: currentSha,
        branch: BRANCH
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    currentSha = data.content.sha;
    status.textContent = "Enregistré ✓ — le site sera à jour dans une à deux minutes.";
  } catch (err) {
    status.textContent = "Erreur : " + err.message;
  }
}

function b64EncodeUnicode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function b64DecodeUnicode(b64) {
  const binary = atob(b64.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

document.addEventListener("DOMContentLoaded", init);
