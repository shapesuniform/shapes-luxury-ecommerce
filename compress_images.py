from PIL import Image
import os

images_dir = r'C:\Users\ishbi\.gemini\antigravity-ide\scratch\shapes-luxury-ecommerce\images'
desktop_dir = r'C:\Users\ishbi\OneDrive\Desktop\shapes_website\images'

# --- Hero image: create desktop + mobile versions ---
hero_path = os.path.join(images_dir, 'welcome_coord_luxury.webp')
hero = Image.open(hero_path)
w, h = hero.size
ratio = h / w
print(f'Original hero size: {w}x{h}')

# Desktop version: max 1400px wide, quality 80
desktop_w = min(1400, w)
desktop_h = int(desktop_w * ratio)
hero_desktop = hero.resize((desktop_w, desktop_h), Image.LANCZOS)
hero_desktop.save(os.path.join(images_dir, 'welcome_coord_luxury.webp'), 'WEBP', quality=80, method=6)
hero_desktop.save(os.path.join(desktop_dir, 'welcome_coord_luxury.webp'), 'WEBP', quality=80, method=6)
kb = os.path.getsize(os.path.join(images_dir, 'welcome_coord_luxury.webp')) // 1024
print(f'Desktop hero saved: {kb}KB')

# Mobile version: 600px wide
mobile_w = 600
mobile_h = int(mobile_w * ratio)
hero_mobile = hero.resize((mobile_w, mobile_h), Image.LANCZOS)
hero_mobile.save(os.path.join(images_dir, 'welcome_coord_luxury_mobile.webp'), 'WEBP', quality=76, method=6)
hero_mobile.save(os.path.join(desktop_dir, 'welcome_coord_luxury_mobile.webp'), 'WEBP', quality=76, method=6)
kb2 = os.path.getsize(os.path.join(images_dir, 'welcome_coord_luxury_mobile.webp')) // 1024
print(f'Mobile hero saved: {kb2}KB')

# --- Compress all product webp images ---
product_images = [
    'coord_royal_emerald', 'coord_indigo_print', 'coord_beige_linen',
    'coord_black_floral', 'hero_coord_editorial', 'couture_lehenga',
    'gold_jewelry', 'heritage_craft', 'wedding_couple', 'draped_corset_set',
    'brocade_corset', 'zardozi_corset', 'pret_corset', 'pret_tunic'
]
for name in product_images:
    path = os.path.join(images_dir, name + '.webp')
    if os.path.exists(path):
        orig_size = os.path.getsize(path) // 1024
        img = Image.open(path)
        iw, ih = img.size
        max_w = 800
        if iw > max_w:
            img = img.resize((max_w, int(ih * max_w / iw)), Image.LANCZOS)
        img.save(path, 'WEBP', quality=78, method=6)
        new_size = os.path.getsize(path) // 1024
        dest = os.path.join(desktop_dir, name + '.webp')
        img.save(dest, 'WEBP', quality=78, method=6)
        print(f'{name}.webp: {orig_size}KB -> {new_size}KB')

print('All images optimized!')
