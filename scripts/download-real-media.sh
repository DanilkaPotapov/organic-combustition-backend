#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MEDIA_DIR="$ROOT_DIR/media"
TMP_DIR="$MEDIA_DIR/.download-tmp"

mkdir -p "$MEDIA_DIR" "$TMP_DIR"

UA='OrganicAnalysisLab/1.0 (educational web-development project; Wikimedia Commons media)'

download() {
  local name="$1"
  local url="$2"
  echo ""
  echo "==> $name"
  curl -L --fail --retry 3 --retry-delay 2 --connect-timeout 30 \
    -A "$UA" \
    -o "$TMP_DIR/$name" "$url"
  mv "$TMP_DIR/$name" "$MEDIA_DIR/$name"
  echo "    saved: media/$name"
}

echo "Downloading real, openly licensed media from Wikimedia Commons..."

# ---------- IMAGES ----------
download "methane.png" \
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Methane-3D-vdW.png"

download "ethane.png" \
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ethane-3D-vdW.png"

download "ethene.png" \
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ethylene-CRC-MW-3D-vdW.png"

download "propene.png" \
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Propylene-GED-MW-3D-bs-17.png"

download "methanol.png" \
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Methanol-3D-vdW.png"

download "ethanol.png" \
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ethanol-3D-vdW.png"

download "pentane.png" \
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pentane.png"

# ---------- VIDEOS / ANIMATIONS ----------
download "methane.webm" \
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/A_Pathway_to_Protocells_on_Titan_%E2%80%93_Animations_%28SVS20411_-_TitanProtoCell_Molecule_Shot%29.webm"

download "ethane.webm" \
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Titan_science_results_from_James_Webb_Space_Telescope-_animation_resource_page_%28SVS20403_-_Webb_Titan_Shot3_h264_4k%29.webm"

download "ethene.webm" \
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Radikalische_Polymerisation_Ethen.webm"

download "propene.webm" \
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/NASA_-_Propylene_on_Titan_IN0SbMeOGIA.webm"

download "methanol.webm" \
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Artist%E2%80%99s_impression_of_the_disc_around_the_young_star_TW_Hydrae.webm"

download "ethanol.webm" \
  "https://upload.wikimedia.org/wikipedia/commons/5/59/15._%D0%9E%D1%81%D0%BB%D0%BE%D0%B1%D0%BE%D0%B4%D1%83%D0%B2%D0%B0%D1%9A%D0%B5_%D0%BD%D0%B0_%D0%B3%D0%BE%D0%BB%D0%B5%D0%BC%D0%BE_%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE_%D0%B5%D0%BD%D0%B5%D1%80%D0%B3%D0%B8%D1%98%D0%B0_%D0%BF%D1%80%D0%B8_%D1%81%D0%BE%D0%B3%D0%BE%D1%80%D0%BE%D0%B2%D1%83%D0%B0%D1%9A%D0%B5_%D0%B5%D1%82%D0%B0%D0%BD%D0%BE%D0%BB.webm"

download "pentane.gif" \
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Picoscopiy_image_of_pentane_molecule_and_animated_model.gif"

rm -rf "$TMP_DIR"

echo ""
echo "Done. Downloaded media:"
ls -lh "$MEDIA_DIR" | sed -n '1,30p'
echo ""
echo "Next: rebuild MinIO with: npm run minio:refresh"
