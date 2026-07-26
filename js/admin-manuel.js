// ==========================================================================
// Back office des pages "manuel de la maison" (pages/admin-manuel.html).
// Lit et écrit directement data/manuals-<maison>.json sur GitHub via l'API
// Contents, avec un jeton d'accès personnel saisi par l'utilisateur et
// conservé uniquement dans le localStorage de son appareil.
// ==========================================================================

const REPO_OWNER = "ga3lsA";
const REPO_NAME = "LuberonEtPyrenees";
const BRANCH = "main";
const TOKEN_STORAGE_KEY = "admin_manuel_gh_token";

let token = "";
let currentHouse = null;
let sections = [];
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
    el("#house-card").hidden = false;
  }
  el("#token-connect").addEventListener("click", onConnect);
  el("#add-section").addEventListener("click", addSection);
  el("#save-btn").addEventListener("click", saveSections);
  document.querySelectorAll(".admin-house-btn").forEach(btn =>
    btn.addEventListener("click", () => selectHouse(btn.dataset.house))
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
    el("#house-card").hidden = false;
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

async function selectHouse(house) {
  currentHouse = house;
  document.querySelectorAll(".admin-house-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.house === house)
  );
  el("#sections-title").textContent = `3. Sections — ${house === "gordes" ? "Gordes" : "Marquixanes"}`;
  el("#sections-card").hidden = false;
  el("#sections-list").innerHTML = "Chargement...";
  try {
    const path = `data/manuals-${house}.json`;
    const res = await githubFetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`);
    if (!res.ok) throw new Error(`Impossible de charger ${path} (code ${res.status})`);
    const data = await res.json();
    currentSha = data.sha;
    sections = JSON.parse(b64DecodeUnicode(data.content));
    renderSections();
  } catch (err) {
    el("#sections-list").textContent = "Erreur : " + err.message;
  }
}

function renderSections() {
  const list = el("#sections-list");
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
  upBtn.addEventListener("click", () => moveSection(index, -1));
  const downBtn = document.createElement("button");
  downBtn.type = "button";
  downBtn.textContent = "↓";
  downBtn.setAttribute("aria-label", "Descendre la section");
  downBtn.disabled = index === sections.length - 1;
  downBtn.addEventListener("click", () => moveSection(index, 1));
  moveWrap.appendChild(upBtn);
  moveWrap.appendChild(downBtn);
  header.appendChild(moveWrap);

  const removeSectionBtn = document.createElement("button");
  removeSectionBtn.type = "button";
  removeSectionBtn.className = "admin-remove";
  removeSectionBtn.textContent = "×";
  removeSectionBtn.setAttribute("aria-label", "Supprimer la section");
  removeSectionBtn.addEventListener("click", () => removeSection(index));
  header.appendChild(removeSectionBtn);

  card.appendChild(header);

  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Titre";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = section.title;
  titleInput.addEventListener("input", () => { section.title = titleInput.value; });
  card.appendChild(titleLabel);
  card.appendChild(titleInput);

  const paraLabel = document.createElement("label");
  paraLabel.textContent = "Texte";
  card.appendChild(paraLabel);
  const paraWrap = document.createElement("div");
  paraWrap.className = "admin-paragraphs";
  card.appendChild(paraWrap);

  function renderParagraphs() {
    paraWrap.innerHTML = "";
    section.paragraphs.forEach((p, pi) => {
      const row = document.createElement("div");
      row.className = "admin-paragraph-row";
      const textarea = document.createElement("textarea");
      textarea.value = p;
      textarea.addEventListener("input", () => { section.paragraphs[pi] = textarea.value; });
      row.appendChild(textarea);
      if (section.paragraphs.length > 1) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "admin-remove";
        removeBtn.textContent = "×";
        removeBtn.setAttribute("aria-label", "Supprimer ce paragraphe");
        removeBtn.addEventListener("click", () => {
          section.paragraphs.splice(pi, 1);
          renderParagraphs();
        });
        row.appendChild(removeBtn);
      }
      paraWrap.appendChild(row);
    });
  }
  renderParagraphs();

  const addParaBtn = document.createElement("button");
  addParaBtn.type = "button";
  addParaBtn.className = "btn btn-ghost admin-small-btn";
  addParaBtn.textContent = "+ Ajouter un paragraphe";
  addParaBtn.addEventListener("click", () => {
    section.paragraphs.push("");
    renderParagraphs();
  });
  card.appendChild(addParaBtn);

  const imgLabel = document.createElement("label");
  imgLabel.textContent = "Photos";
  card.appendChild(imgLabel);
  const imgWrap = document.createElement("div");
  imgWrap.className = "admin-images";
  card.appendChild(imgWrap);

  function renderImages() {
    imgWrap.innerHTML = "";
    (section.images || []).forEach((img, ii) => {
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
      thumb.addEventListener("error", () => {
        thumb.hidden = true;
        missingLabel.hidden = false;
      });
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
        const originalLabel = replaceLabel.textContent;
        replaceLabel.textContent = "Envoi en cours...";
        try {
          const path = await uploadImage(file);
          img.src = path;
          renderImages();
        } catch (err) {
          alert("Échec de l'envoi de la photo : " + err.message);
        } finally {
          replaceLabel.textContent = originalLabel;
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
      removeBtn.addEventListener("click", () => {
        section.images.splice(ii, 1);
        renderImages();
      });
      row.appendChild(removeBtn);

      imgWrap.appendChild(row);
    });
  }
  renderImages();

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
    const originalLabel = uploadLabel.textContent;
    uploadLabel.textContent = "Envoi en cours...";
    try {
      const path = await uploadImage(file);
      section.images = section.images || [];
      section.images.push({ src: path, alt: "", caption: "" });
      renderImages();
    } catch (err) {
      alert("Échec de l'envoi de la photo : " + err.message);
    } finally {
      uploadLabel.textContent = originalLabel;
      fileInput.value = "";
    }
  });
  uploadLabel.appendChild(fileInput);
  card.appendChild(uploadLabel);

  return card;
}

function moveSection(index, delta) {
  const target = index + delta;
  if (target < 0 || target >= sections.length) return;
  const [item] = sections.splice(index, 1);
  sections.splice(target, 0, item);
  renderSections();
}

function removeSection(index) {
  if (!confirm("Supprimer cette section ? Cette action n'est effective qu'après avoir cliqué sur « Enregistrer ».")) return;
  sections.splice(index, 1);
  renderSections();
}

function addSection() {
  sections.push({ title: "Nouvelle section", paragraphs: [""], images: [] });
  renderSections();
}

async function uploadImage(file) {
  const base64 = await fileToBase64(file);
  const filename = sanitizeFilename(file.name);
  const path = `images/${currentHouse}/manuel/${filename}`;
  const res = await githubFetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Ajoute une photo au manuel ${currentHouse} : ${filename}`,
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

async function saveSections() {
  const status = el("#save-status");
  status.textContent = "Enregistrement...";
  try {
    const content = b64EncodeUnicode(JSON.stringify(sections, null, 2) + "\n");
    const path = `data/manuals-${currentHouse}.json`;
    const res = await githubFetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Met à jour le manuel ${currentHouse} depuis le back office`,
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
