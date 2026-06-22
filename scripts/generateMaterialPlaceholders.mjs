/**
 * Genera placeholders JPEG premium para la sección Materiales.
 * Tamaño: 1400×1000 (aspect-[7/5], misma proporción que el resto del sitio).
 * Ejecutar: node scripts/generateMaterialPlaceholders.mjs
 */

import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "../public/images/materiales");

const W = 1400;
const H = 1000;

// Paleta de fondos neutros premium (variaciones de ivory/sand)
const BACKGROUNDS = {
  aluminio: { r: 220, g: 218, b: 214 },   // gris plateado cálido
  telas:    { r: 232, g: 224, b: 214 },   // arena suave
  goma:     { r: 215, g: 210, b: 204 },   // greige neutro
  dekton:   { r: 200, g: 196, b: 192 },   // piedra fría
  infinity: { r: 210, g: 206, b: 200 },   // mineral cálido
};

function svgText(label, category) {
  const bg = BACKGROUNDS[category] ?? BACKGROUNDS.telas;
  const lineY = H / 2 + 2;
  return Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="rgb(${bg.r},${bg.g},${bg.b})"/>
  <!-- grain texture overlay -->
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
    <feBlend in="SourceGraphic" mode="overlay"/>
  </filter>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.08"/>
  <!-- subtle border -->
  <rect x="48" y="48" width="${W - 96}" height="${H - 96}"
        fill="none" stroke="rgba(80,70,60,0.12)" stroke-width="1"/>
  <!-- category label -->
  <text
    x="${W / 2}" y="${lineY - 52}"
    text-anchor="middle"
    font-family="Georgia, serif"
    font-size="13"
    font-weight="400"
    letter-spacing="5"
    fill="rgba(50,40,30,0.38)"
  >MALDIVAS OUTDOOR</text>
  <!-- separator -->
  <line x1="${W / 2 - 28}" y1="${lineY - 26}" x2="${W / 2 + 28}" y2="${lineY - 26}"
        stroke="rgba(50,40,30,0.22)" stroke-width="0.8"/>
  <!-- material name -->
  <text
    x="${W / 2}" y="${lineY + 14}"
    text-anchor="middle"
    font-family="Georgia, serif"
    font-size="26"
    font-weight="400"
    letter-spacing="1"
    fill="rgba(30,25,20,0.55)"
  >${label}</text>
  <!-- bottom label -->
  <text
    x="${W / 2}" y="${lineY + 58}"
    text-anchor="middle"
    font-family="Georgia, serif"
    font-size="11"
    font-weight="400"
    letter-spacing="4"
    fill="rgba(50,40,30,0.30)"
  >IMAGEN PRÓXIMAMENTE</text>
</svg>`);
}

async function make(relPath, label, category) {
  const dest = path.join(PUBLIC, relPath);
  await sharp({
    create: { width: W, height: H, channels: 3, background: BACKGROUNDS[category] ?? BACKGROUNDS.telas },
  })
    .composite([{ input: svgText(label, category), blend: "over" }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(dest);
  console.log("✓", relPath);
}

// ─── Aluminio ────────────────────────────────────────────────────────────────
await make("aluminio/aluminio-simil-madera.jpg",  "Aluminio Símil Madera",  "aluminio");
await make("aluminio/aluminio-pintado.jpg",        "Aluminio Pintado",        "aluminio");
await make("aluminio/aluminio-anodizado.jpg",      "Aluminio Anodizado",      "aluminio");

// ─── Telas ───────────────────────────────────────────────────────────────────
await make("telas/sunbrella.jpg", "Sunbrella", "telas");
await make("telas/agora.jpg",     "Ágora",     "telas");
await make("telas/bliss.jpg",     "Bliss",     "telas");

// ─── Goma Espuma ─────────────────────────────────────────────────────────────
await make("goma-espuma/piero-26k.jpg", "Piero 26K", "goma");
await make("goma-espuma/piero-27k.jpg", "Piero 27K", "goma");
await make("goma-espuma/piero-29k.jpg", "Piero 29K", "goma");

// ─── Piedras — Dekton ────────────────────────────────────────────────────────
await make("piedras/dekton/dekton-aura.jpg",  "Aura",  "dekton");
await make("piedras/dekton/dekton-opera.jpg", "Ópera", "dekton");
await make("piedras/dekton/dekton-vera.jpg",  "Vera",  "dekton");

// ─── Piedras — Infinity ──────────────────────────────────────────────────────
await make("piedras/infinity/infinity-atlantis-grey.jpg",       "Atlantis Grey",       "infinity");
await make("piedras/infinity/infinity-calacatta-oro.jpg",       "Calacatta Oro",       "infinity");
await make("piedras/infinity/infinity-andromeda.jpg",           "Andromeda",           "infinity");
await make("piedras/infinity/infinity-travertino-chiaro.jpg",   "Travertino Chiaro",   "infinity");
await make("piedras/infinity/infinity-defense.jpg",             "Defense",             "infinity");
await make("piedras/infinity/infinity-pietra-grey.jpg",         "Pietra Grey",         "infinity");
await make("piedras/infinity/infinity-laurent.jpg",             "Laurent",             "infinity");
await make("piedras/infinity/infinity-calacatta-hermitage.jpg", "Calacatta Hermitage", "infinity");
await make("piedras/infinity/infinity-chianca-di-ostuni.jpg",   "Chianca Di Ostuni",   "infinity");
await make("piedras/infinity/infinity-royal-peacock.jpg",       "Royal Peacock",       "infinity");
await make("piedras/infinity/infinity-tundra-select.jpg",       "Tundra Select",       "infinity");
await make("piedras/infinity/infinity-sahara-noir.jpg",         "Sahara Noir",         "infinity");

console.log("\n✅  24 placeholders generados en /public/images/materiales/");
