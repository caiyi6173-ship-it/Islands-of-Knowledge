"""Finalize generated pixel art: strip the corner watermark, restore the exact
source dimensions (nearest neighbour, so map landmark coordinates keep their
proportional mapping), and write optimized PNGs into assets/.
"""
import os
import shutil
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEN = os.path.join(ROOT, "tmp", "pixel-art-gen")
LEGACY = os.path.join(ROOT, "assets", "legacy")

JOBS = [
    {
        "src": "Redraw_this_harbour_scene_as_h_2026-10-29T01-35-08.png",
        "dest": "harbor-arrival-v1.png",
        "size": (1672, 941),
    },
    {
        "src": "Redraw_this_fantasy_archipelag_2026-10-29T01-35-24.png",
        "dest": "world-map-v2.png",
        "size": (1586, 992),
    },
]


def strip_watermark(im):
    """The generator stamps a corner badge. Cover it with a mirrored copy of
    the adjacent band so water, cloud and plank textures stay continuous."""
    w, h = im.size
    x0 = int(w * 0.875)
    y0 = int(h * 0.905)
    bw, bh = w - x0, h - y0
    donor = im.crop((x0 - bw, y0, x0, h)).transpose(Image.FLIP_LEFT_RIGHT)
    im.paste(donor, (x0, y0))
    return im


def main():
    os.makedirs(LEGACY, exist_ok=True)
    for job in JOBS:
        src = os.path.join(GEN, job["src"])
        dest = os.path.join(ROOT, "assets", job["dest"])
        im = Image.open(src).convert("RGB")
        im = strip_watermark(im)
        im = im.resize(job["size"], Image.NEAREST)
        im = im.quantize(colors=256, method=Image.MEDIANCUT, dither=Image.NONE)
        if os.path.exists(dest) and not os.path.exists(os.path.join(LEGACY, job["dest"])):
            shutil.copy2(dest, os.path.join(LEGACY, job["dest"]))
        im.save(dest, optimize=True)
        print(f"{job['dest']}: {im.size} {os.path.getsize(dest)//1024} KB")


if __name__ == "__main__":
    main()
