/**
 * Genera placeholders 4:3 (1200×900) para las secciones de piedras.
 * Cada piedra tiene color y tono propios para evocar su carácter.
 * Ejecutar: node scripts/generateStonePlaceholders.mjs
 */

import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "../public/images/materiales/piedras");

const W = 1200;
const H = 900;

/** Paleta de tonos por piedra */
const STONES = {
  // ─── Dekton ───────────────────────────────────────────────────────────────
  "dekton-aura":   { r: 225, g: 220, b: 214, textLight: false, label: "Aura" },
  "dekton-opera":  { r: 48,  g: 44,  b: 42,  textLight: true,  label: "Ópera" },
  "dekton-vera":   { r: 195, g: 188, b: 178, textLight: false, label: "Vera" },

  // ─── Infinity ─────────────────────────────────────────────────────────────
  "infinity-atlantis-grey":       { r: 148, g: 148, b: 148, textLight: false, label: "Atlantis Grey" },
  "infinity-calacatta-oro":       { r: 238, g: 234, b: 224, textLight: false, label: "Calacatta Oro" },
  "infinity-andromeda":           { r: 38,  g: 36,  b: 36,  textLight: true,  label: "Andromeda" },
  "infinity-travertino-chiaro":   { r: 218, g: 206, b: 190, textLight: false, label: "Travertino Chiaro" },
  "infinity-defense":             { r: 80,  g: 80,  b: 80,  textLight: true,  label: "Defense" },
  "infinity-pietra-grey":         { r: 62,  g: 62,  b: 64,  textLight: true,  label: "Pietra Grey" },
  "infinity-laurent":             { r: 22,  g: 20,  b: 20,  textLight: true,  label: "Laurent" },
  "infinity-calacatta-hermitage": { r: 242, g: 240, b: 234, textLight: false, label: "Calacatta Hermitage" },
  "infinity-chianca-di-ostuni":   { r: 228, g: 218, b: 204, textLight: false, label: "Chianca Di Ostuni" },
  "infinity-royal-peacock":       { r: 30,  g: 36,  b: 44,  textLight: true,  label: "Royal Peacock" },
  "infinity-tundra-select":       { r: 168, g: 162, b: 152, textLight: false, label: "Tundra Select" },
  "infinity-sahara-noir":         { r: 18,  g: 16,  b: 14,  textLight: true,  label: "Sahara Noir" },
};

function svgOverlay(label, textLight) {
  const textColor = textLight
    ? "rgba(255,255,255,0.70)"
    : "rgba(20,15,10,0.52)";
  const lineColor = textLight
    ? "rgba(255,255,255,0.22)"
    : "rgba(20,15,10,0.16)";
  const brandColor = textLight
    ? "rgba(255,255,255,0.40)"
    : "rgba(20,15,10,0.30)";

  const cx = W / 2;
  const cy = H / 2;

  return Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- subtle grain -->
  <filter id="g">
    <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
    <feBlend in="SourceGraphic" mode="overlay"/>
  </filter>
  <rect width="${W}" height="${H}" fill="transparent" filter="url(#g)" opacity="0.07"/>

  <!-- inner frame -->
  <rect x="36" y="36" width="${W - 72}" height="${H - 72}"
        fill="none" stroke="${lineColor}" stroke-width="0.8"/>

  <!-- brand -->
  <text x="${cx}" y="${cy - 36}"
    text-anchor="middle"
    font-family="Georgia, serif" font-size="11" letter-spacing="5"
    fill="${brandColor}">MALDIVAS OUTDOOR</text>

  <!-- divider -->
  <line x1="${cx - 22}" y1="${cy - 16}" x2="${cx + 22}" y2="${cy - 16}"
        stroke="${lineColor}" stroke-width="0.8"/>

  <!-- stone name -->
  <text x="${cx}" y="${cy + 14}"
    text-anchor="middle"
    font-family="Georgia, serif" font-size="22" letter-spacing="1"
    fill="${textColor}">${label}</text>

  <!-- label -->
  <text x="${cx}" y="${cy + 48}"
    text-anchor="middle"
    font-family="Georgia, serif" font-size="10" letter-spacing="4"
    fill="${brandColor}">IMAGEN PRÓXIMAMENTE</text>
</svg>`);
}

for (const [key, stone] of Object.entries(STONES)) {
  const folder = key.startsWith("dekton") ? "dekton" : "infinity";
  const dest = path.join(PUBLIC, folder, `${key}.jpg`);

  await sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: { r: stone.r, g: stone.g, b: stone.b },
    },
  })
    .composite([{ input: svgOverlay(stone.label, stone.textLight), blend: "over" }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(dest);

  console.log(`✓ ${folder}/${key}.jpg`);
}

console.log(`\n✅  ${Object.keys(STONES).length} placeholders de piedra generados en /public/images/materiales/piedras/`);
