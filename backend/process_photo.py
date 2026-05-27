from rembg import remove
from PIL import Image

def process():
    input_path = 'photo.jpg'
    output_path = 'photo_no_bg.png'
    try:
        # Load image
        input_image = Image.open(input_path)
        # Remove background
        output_image = remove(input_image)
        # Save image
        output_image.save(output_path)
        print("Background removed successfully.")
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == '__main__':
    process()
