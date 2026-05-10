from PIL import Image, ImageDraw, ImageFont
import math

def create_gradient(width, height, color1, color2):
    """Create a vertical gradient from color1 to color2."""
    base = Image.new('RGB', (width, height))
    for y in range(height):
        r = int(color1[0] + (color2[0] - color1[0]) * y / height)
        g = int(color1[1] + (color2[1] - color1[1]) * y / height)
        b = int(color1[2] + (color2[2] - color1[2]) * y / height)
        draw = ImageDraw.Draw(base)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    return base

def round_rectangle(draw, xy, radius, fill):
    """Draw a rounded rectangle."""
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill)

def create_logo(size=1024):
    # Colors
    indigo = (99, 102, 241)    # indigo-500
    blue = (37, 99, 235)       # blue-600
    white = (255, 255, 255)
    
    img = create_gradient(size, size, indigo, blue)
    draw = ImageDraw.Draw(img)
    
    # Rounded square background (already gradient, but add corner rounding via mask)
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, size, size], radius=size//5, fill=255)
    
    # Apply mask to make rounded corners on the gradient
    result = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    result.paste(img, (0, 0), mask)
    draw = ImageDraw.Draw(result)
    
    # Draw flask icon
    center_x = size // 2
    center_y = size // 2
    scale = size / 1024
    
    # Flask base (rounded rectangle, wider at bottom)
    base_w = int(320 * scale)
    base_h = int(220 * scale)
    base_x1 = center_x - base_w // 2
    base_y1 = center_y + int(30 * scale)
    base_x2 = base_x1 + base_w
    base_y2 = base_y1 + base_h
    draw.rounded_rectangle([base_x1, base_y1, base_x2, base_y2], 
                          radius=int(40*scale), fill=white)
    
    # Flask neck (rectangle, narrower)
    neck_w = int(120 * scale)
    neck_h = int(140 * scale)
    neck_x1 = center_x - neck_w // 2
    neck_y1 = center_y - int(80 * scale)
    neck_x2 = neck_x1 + neck_w
    neck_y2 = neck_y1 + neck_h
    draw.rounded_rectangle([neck_x1, neck_y1, neck_x2, neck_y2], 
                          radius=int(20*scale), fill=white)
    
    # Flask rim (small rounded rectangle on top)
    rim_w = int(160 * scale)
    rim_h = int(40 * scale)
    rim_x1 = center_x - rim_w // 2
    rim_y1 = neck_y1 - int(10 * scale)
    rim_x2 = rim_x1 + rim_w
    rim_y2 = rim_y1 + rim_h
    draw.rounded_rectangle([rim_x1, rim_y1, rim_x2, rim_y2], 
                          radius=int(15*scale), fill=white)
    
    # Flask shoulders (connect neck to base with angled lines - use polygons)
    shoulder_h = int(60 * scale)
    # Left shoulder
    left_shoulder = [
        (neck_x1, neck_y2 - int(10*scale)),
        (base_x1 + int(20*scale), base_y1 + int(10*scale)),
        (base_x1, base_y1),
        (neck_x1 - int(30*scale), neck_y2 - int(20*scale))
    ]
    draw.polygon(left_shoulder, fill=white)
    
    # Right shoulder
    right_shoulder = [
        (neck_x2, neck_y2 - int(10*scale)),
        (base_x2 - int(20*scale), base_y1 + int(10*scale)),
        (base_x2, base_y1),
        (neck_x2 + int(30*scale), neck_y2 - int(20*scale))
    ]
    draw.polygon(right_shoulder, fill=white)
    
    return result

if __name__ == "__main__":
    logo = create_logo(1024)
    logo.save("assets/logo-base.png")
    print("Logo generated: assets/logo-base.png")
