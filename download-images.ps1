# ==============================================================================
# Version Windows (PowerShell) du script de récupération des photos.
# À exécuter une fois, sur un ordinateur connecté à Internet.
#
# Utilisation :
#   1. Clic droit sur ce fichier -> "Exécuter avec PowerShell"
#   OU, dans une fenêtre PowerShell ouverte dans ce dossier :
#      powershell -ExecutionPolicy Bypass -File .\download-images.ps1
# ==============================================================================

$Base = "https://jolie-maison-avec-piscine-a-gordes.e-monsite.com"

New-Item -ItemType Directory -Force -Path "images\gordes" | Out-Null
New-Item -ItemType Directory -Force -Path "images\marquixanes" | Out-Null

function Fetch($Url, $Out) {
    if (Test-Path $Out) {
        Write-Host "deja present : $Out"
        return
    }
    Write-Host "telechargement : $Out"
    try {
        Invoke-WebRequest -Uri $Url -OutFile $Out -UserAgent "Mozilla/5.0 (compatible; site-migration-script/1.0)"
    } catch {
        Write-Host "  -> ECHEC pour $Url (a verifier manuellement)"
    }
}

# --- Gordes : photos de couverture ---
Fetch "$Base/medias/images/img-3587.jpg" "images\gordes\img-3587.jpg"
Fetch "$Base/medias/images/img-4526.jpg" "images\gordes\img-4526.jpg"

# --- Gordes : galerie ---
$gordesFiles = @(
  "img-3587-grande","img-4526-grande","img-4536-grande","img-4560-grande",
  "img-4595-grande","img-4601-grande","img-4656-grande","img-4665-grande",
  "img-4834-grande","img-5015-grande","img-5227-grande","img-6065-grande",
  "img-6538-grande","img-0550-grande","img-2299-grande","img-2306-grande",
  "img-2307-grande","img-2314-grande","img-2741-grande","img-8130-grande"
)
foreach ($f in $gordesFiles) {
    Fetch "$Base/medias/album/$f.jpeg" "images\gordes\$f.jpeg"
}

# --- Marquixanes : photo de couverture ---
Fetch "$Base/medias/images/img-7942.jpeg" "images\marquixanes\img-7942.jpeg"

# --- Marquixanes : galerie ---
$marquixanesFiles = @(
  "img-6594-grande","img-6771-grande","img-5424-grande","img-5427-grande",
  "img-5428-grande","img-7629-grande","img-7631-grande","img-7716-grande",
  "img-7712-grande","img-7732-grande","img-7736-grande","img-7941-grande",
  "img-8220-grande","img-8221-grande","img-8222-grande","img-8224-grande",
  "img-8578-grande","img-8577-grande","img-8602-grande","img-8936-grande"
)
foreach ($f in $marquixanesFiles) {
    Fetch "$Base/medias/album/$f.jpeg" "images\marquixanes\$f.jpeg"
}

Write-Host ""
Write-Host "Termine. Verifiez ci-dessus qu'aucune ligne ECHEC n'apparait."
Write-Host "Appuyez sur une touche pour fermer..."
[void][System.Console]::ReadKey($true)
