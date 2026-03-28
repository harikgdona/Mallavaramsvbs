from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image


def trim_transparent_png(path: Path) -> None:
    img = Image.open(path)
    rgba = img.convert("RGBA")
    alpha = rgba.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        # Fully transparent; nothing to trim.
        return
    cropped = rgba.crop(bbox)
    cropped.save(path)


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Usage: python scripts/trim_transparent_png.py <path-to-png>", file=sys.stderr)
        return 2
    p = Path(argv[1])
    if not p.exists():
        print(f"File not found: {p}", file=sys.stderr)
        return 2
    trim_transparent_png(p)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

