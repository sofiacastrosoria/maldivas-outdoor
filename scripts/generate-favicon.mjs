import sharp from "sharp";
import toIco from "to-ico";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const source = path.join(root, "public/logo/maldivas-logo-transparent.png");
const appDir = path.join(root, "src/app");

async function buildSquareLogo(size) {
  const trimmed = await sharp(source).trim().png().toBuffer();
  const meta = await sharp(trimmed).metadata();
  const maxDim = Math.max(meta.width, meta.height);
  const padding = Math.round(maxDim * 0.1);
  const canvas = maxDim + padding * 2;

  const square = await sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: await sharp(trimmed)
          .resize(maxDim, maxDim, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png()
          .toBuffer(),
        top: padding,
        left: padding,
      },
    ])
    .png()
    .toBuffer();

  return sharp(square)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function main() {
  await mkdir(appDir, { recursive: true });

  const icon32 = await buildSquareLogo(32);
  const apple180 = await buildSquareLogo(180);
  const icon16 = await buildSquareLogo(16);
  const icon48 = await buildSquareLogo(48);

  await writeFile(path.join(appDir, "icon.png"), icon32);
  await writeFile(path.join(appDir, "apple-icon.png"), apple180);

  const faviconIco = await toIco([icon16, icon32, icon48]);
  await writeFile(path.join(appDir, "favicon.ico"), faviconIco);

  console.log("Favicons generados en src/app/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
