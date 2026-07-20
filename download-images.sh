#!/usr/bin/env bash
# ==============================================================================
# À exécuter UNE FOIS, sur une machine connectée à Internet (votre ordinateur),
# avant de mettre le site en ligne. Ce script télécharge les photos originales
# depuis l'ancien site e-monsite et les range dans images/gordes et
# images/marquixanes, aux emplacements attendus par js/config.js.
#
# Usage :
#   chmod +x download-images.sh
#   ./download-images.sh
# ==============================================================================
set -e
BASE="https://jolie-maison-avec-piscine-a-gordes.e-monsite.com"
UA="Mozilla/5.0 (compatible; site-migration-script/1.0)"

mkdir -p images/gordes images/marquixanes

fetch () {
  local url="$1" out="$2"
  if [ -f "$out" ]; then
    echo "déjà présent : $out"
    return
  fi
  echo "téléchargement : $out"
  curl -sSL -A "$UA" --fail "$url" -o "$out" || echo "  -> ÉCHEC pour $url (à vérifier manuellement)"
}

# --- Gordes : photos de couverture ---
fetch "$BASE/medias/images/img-3587.jpg" "images/gordes/img-3587.jpg"
fetch "$BASE/medias/images/img-4526.jpg" "images/gordes/img-4526.jpg"

# --- Gordes : galerie ---
for f in img-3587-grande img-4526-grande img-4536-grande img-4560-grande \
         img-4595-grande img-4601-grande img-4656-grande img-4665-grande \
         img-4834-grande img-5015-grande img-5227-grande img-6065-grande \
         img-6538-grande img-0550-grande img-2299-grande img-2306-grande \
         img-2307-grande img-2314-grande img-2741-grande img-8130-grande; do
  fetch "$BASE/medias/album/${f}.jpeg" "images/gordes/${f}.jpeg"
done

# --- Gordes : manuel de la maison (page pratique, non listée dans le menu) ---
mkdir -p images/gordes/manuel
for f in img-9145-moyenne img-9144-moyenne img-9146-moyenne img-9147-moyenne \
         img-9160 img-9161 img-9162 img-9149-moyenne img-9148-moyenne \
         img-9150-moyenne img-9154-moyenne img-9152-moyenne img-9151-moyenne; do
  fetch "$BASE/medias/images/${f}.jpeg" "images/gordes/manuel/${f}.jpeg"
done
fetch "$BASE/medias/images/img-8987-grande.jpeg" "images/gordes/manuel/img-8987-grande.jpeg"
fetch "$BASE/medias/images/img-8988-grande.jpeg" "images/gordes/manuel/img-8988-grande.jpeg"
fetch "$BASE/medias/images/img-4536.jpg" "images/gordes/manuel/img-4536.jpg"

# --- Marquixanes : photo de couverture ---
fetch "$BASE/medias/images/img-7942.jpeg" "images/marquixanes/img-7942.jpeg"

# --- Marquixanes : galerie ---
for f in img-6594-grande img-6771-grande img-5424-grande img-5427-grande \
         img-5428-grande img-7629-grande img-7631-grande img-7716-grande \
         img-7712-grande img-7732-grande img-7736-grande img-7941-grande \
         img-8220-grande img-8221-grande img-8222-grande img-8224-grande \
         img-8578-grande img-8577-grande img-8602-grande img-8936-grande; do
  fetch "$BASE/medias/album/${f}.jpeg" "images/marquixanes/${f}.jpeg"
done

# --- Marquixanes : manuel de la maison (page pratique, non listée dans le menu) ---
mkdir -p images/marquixanes/manuel
fetch "$BASE/medias/images/img-8602.jpeg" "images/marquixanes/manuel/img-8602.jpeg"
fetch "$BASE/medias/images/img-4505.jpg" "images/marquixanes/manuel/img-4505.jpg"
fetch "$BASE/medias/images/capture-d-e-cran-2025-11-26-a-16.54.22.png" "images/marquixanes/manuel/capture-decran-serrure.png"
fetch "$BASE/medias/images/img-8918.jpeg" "images/marquixanes/manuel/img-8918.jpeg"
fetch "$BASE/medias/images/img-8919.jpeg" "images/marquixanes/manuel/img-8919.jpeg"
fetch "$BASE/medias/images/img-8922.jpeg" "images/marquixanes/manuel/img-8922.jpeg"
fetch "$BASE/medias/images/img-8923.jpeg" "images/marquixanes/manuel/img-8923.jpeg"
fetch "$BASE/medias/images/img-8920.jpeg" "images/marquixanes/manuel/img-8920.jpeg"
fetch "$BASE/medias/images/img-8930.jpeg" "images/marquixanes/manuel/img-8930.jpeg"
fetch "$BASE/medias/images/e3510722-ec49-4818-9eed-eb67b62f3523.png" "images/marquixanes/manuel/e3510722.png"
fetch "$BASE/medias/images/img-6595.jpg" "images/marquixanes/manuel/img-6595.jpg"
fetch "$BASE/medias/images/img-330.jpg" "images/marquixanes/manuel/img-330.jpg"
fetch "$BASE/medias/images/img-8942.jpeg" "images/marquixanes/manuel/img-8942.jpeg"
fetch "$BASE/medias/images/img-8943.jpeg" "images/marquixanes/manuel/img-8943.jpeg"
fetch "$BASE/medias/images/img-8935-grande.jpeg" "images/marquixanes/manuel/img-8935-grande.jpeg"

echo ""
echo "Terminé. Vérifiez ci-dessus qu'aucune ligne ÉCHEC n'apparaît."
echo "En cas d'échec ponctuel, ouvrez l'URL dans un navigateur, enregistrez"
echo "l'image manuellement sous le nom de fichier indiqué, au bon endroit."
