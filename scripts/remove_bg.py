import os
import sys
from pathlib import Path

try:
    from rembg import remove
    from PIL import Image
except ImportError:
    print("Instalando dependencias...")
    os.system(f"{sys.executable} -m pip install rembg pillow")
    from rembg import remove
    from PIL import Image


INPUT_DIR = Path(__file__).resolve().parent.parent / "public"


def main():
    images = sorted(INPUT_DIR.glob("logo-*.png")) + sorted(INPUT_DIR.glob("somente-*.png"))

    if not images:
        print("Nenhuma imagem encontrada")
        return

    for img_path in images:
        if img_path.stem.endswith("-sem-fundo"):
            continue

        output_path = img_path.parent / f"{img_path.stem}-sem-fundo.png"

        print(f"Processando: {img_path.name}")

        with open(img_path, "rb") as f:
            input_data = f.read()

        output_data = remove(input_data)

        with open(output_path, "wb") as f:
            f.write(output_data)

        print(f"  -> Salvo: {output_path.name}")


if __name__ == "__main__":
    main()
