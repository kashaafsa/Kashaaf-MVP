from PIL import Image
from collections import Counter
import sys

def get_dominant_color(image_path):
    try:
        image = Image.open(image_path)
        image = image.convert("RGBA")
        image = image.resize((100, 100))
        pixels = []
        for p in list(image.getdata()):
            # Alpha check (ignore transparent)
            if p[3] < 128:
                continue
            # Ignore almost black or almost white
            if (p[0] < 20 and p[1] < 20 and p[2] < 20) or (p[0] > 240 and p[1] > 240 and p[2] > 240):
                continue
            pixels.append((p[0], p[1], p[2]))

        if not pixels:
            return "#6366f1" # Fallback indigo

        most_common = Counter(pixels).most_common(1)[0][0]
        return "#{:02x}{:02x}{:02x}".format(most_common[0], most_common[1], most_common[2])
    except Exception as e:
        sys.stderr.write(str(e))
        return "#6366f1"

if __name__ == "__main__":
    print(get_dominant_color("public/logo.png"))
