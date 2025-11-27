import os
import json
import base64
from openai import OpenAI

def main():
    # Read API key from env
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY environment variable is not set.")

    client = OpenAI(api_key=api_key)

    # Load prompts
    json_path = os.path.join(os.path.dirname(__file__), "countries_images.json")
    with open(json_path, "r", encoding="utf-8") as f:
        countries = json.load(f)

    # Output folder: media/countries
    output_dir = os.path.join(os.path.dirname(__file__), "media", "countries")
    os.makedirs(output_dir, exist_ok=True)

    for item in countries:
        filename = item["image_filename"]
        prompt = item["image_prompt"]

        out_path = os.path.join(output_dir, filename)

        # Skip if already exists (so you can re-run safely)
        if os.path.exists(out_path):
            print(f"[SKIP] {filename} already exists")
            continue

        print(f"[GEN] {filename} ...")

        try:
            result = client.images.generate(
                model="gpt-image-1",
                prompt=prompt,
                size="1536x1024",
                n=1
            )

            image_b64 = result.data[0].b64_json
            image_bytes = base64.b64decode(image_b64)

            with open(out_path, "wb") as img_file:
                img_file.write(image_bytes)

            print(f"[OK] Saved {out_path}")
        except Exception as e:
            print(f"[ERROR] {filename}: {e}")

if __name__ == "__main__":
    main()
