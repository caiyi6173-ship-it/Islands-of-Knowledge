"""Shared-palette pixel art pipeline.

Downsamples painterly source art, quantizes to ONE palette shared by all
scenes, dithers, then upscales with nearest-neighbour so every scene has
identical pixel grain. Deterministic and reversible.
"""
import os
import sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = {
    "harbor": os.path.join(ROOT, "assets", "harbor-arrival-v1.png"),
    "world": os.path.join(ROOT, "assets", "world-map-v2.png"),
}
OUT = os.path.join(ROOT, "tmp", "pixel-preview")


def shared_palette(images, colors=48):
    small = [im.resize((im.width // 8, im.height // 8), Image.BOX) for im in images]
    w = sum(im.width for im in small)
    h = max(im.height for im in small)
    sheet = Image.new("RGB", (w, h))
    x = 0
    for im in small:
        sheet.paste(im, (x, 0))
        x += im.width
    return sheet.quantize(colors=colors, method=Image.MEDIANCUT)


def pixelate(im, palette, factor):
    w = max(1, im.width // factor)
    h = max(1, im.height // factor)
    small = im.resize((w, h), Image.BOX)
    q = small.quantize(palette=palette, dither=Image.FLOYDSTEINBERG)
    return q.convert("RGB").resize((im.width, im.height), Image.NEAREST)


def main():
    os.makedirs(OUT, exist_ok=True)
    names = list(SRC)
    images = [Image.open(SRC[n]).convert("RGB") for n in names]
    pal = shared_palette(images)
    for name, im in zip(names, images):
        for factor in (2, 3, 4):
            art = pixelate(im, pal, factor)
            full = os.path.join(OUT, f"{name}-{factor}x.png")
            art.save(full, optimize=True)
            overview = art.resize((1100, round(im.height * 1100 / im.width)), Image.NEAREST)
            overview.save(os.path.join(OUT, f"{name}-{factor}x-overview.png"), optimize=True)
            crop = art.crop((im.width // 3, im.height // 3, im.width // 3 + 520, im.height // 3 + 320))
            crop.save(os.path.join(OUT, f"{name}-{factor}x-crop.png"), optimize=True)
            print(f"{name} {factor}x -> {os.path.getsize(full)//1024} KB")


if __name__ == "__main__":
    main()
