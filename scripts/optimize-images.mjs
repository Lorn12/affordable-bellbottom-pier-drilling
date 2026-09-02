import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const assetsDir = path.resolve("public/assets");
const widths = [400, 800, 1280, 1920];

const files = (await readdir(assetsDir)).filter((name) => name.endsWith(".png"));

await mkdir(assetsDir, { recursive: true });

for (const file of files) {
  const input = path.join(assetsDir, file);
  const base = file.replace(/\.png$/i, "");
  const image = sharp(input);
  const meta = await image.metadata();
  const sourceWidth = meta.width || 0;

  for (const width of widths) {
    if (sourceWidth && width > sourceWidth && width !== widths[0]) continue;
    const targetWidth = Math.min(width, sourceWidth || width);
    const output = path.join(assetsDir, `${base}-${targetWidth}.webp`);
    await sharp(input)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: 76, effort: 4 })
      .toFile(output);
    console.log(path.basename(output));
  }
}
