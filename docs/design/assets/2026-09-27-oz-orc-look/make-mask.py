# Convert black-ink line art into a single-ink alpha mask (black RGB, alpha = ink).
# usage: mask.py in out long_edge black white [x0,y0,x1,y1 blanked-to-paper ...]
import sys, numpy as np
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
src, out, edge, black, white = sys.argv[1], sys.argv[2], int(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])
im = Image.open(src).convert('L')
g = np.asarray(im, dtype=np.float32) / 255
crop = None
for box in sys.argv[6:]:
    if box.startswith('crop:'):
        crop = tuple(map(int, box[5:].split(','))); continue
    x0, y0, x1, y1 = map(int, box.split(','))
    g[y0:y1, x0:x1] = 1.0
if crop:
    x0, y0, x1, y1 = crop; g = g[y0:y1, x0:x1]
a = np.clip((white - g) / (white - black), 0, 1)
im = Image.fromarray((a * 255).astype(np.uint8))
im.thumbnail((edge, edge), Image.LANCZOS)
rgba = Image.new('RGBA', im.size, (0, 0, 0, 0)); rgba.putalpha(im)
# Trim empty margins so the art's box hugs the drawing.
rgba = rgba.crop(rgba.getbbox())
rgba.save(out, 'WEBP', quality=int(__import__('os').environ.get('Q', 75)), method=6)
print(out, rgba.size)
