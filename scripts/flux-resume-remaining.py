#!/usr/bin/env python3
"""Resume free CF Flux regen for remaining Math Hero items.
Runs until remaining list is empty or CF daily free neurons exhaust.
Usage: python3 scripts/flux-resume-remaining.py
"""
import os, json, base64, time, urllib.request, urllib.error, io
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ITEMS = ROOT / 'assets' / 'items'
RAW = Path('/tmp/flux-gen'); RAW.mkdir(exist_ok=True)
STATE = ROOT / 'scripts' / 'flux-remaining.json'
BASE = 'http://localhost:3003/v1'
KEY = os.environ.get('VANSROUTE_API_KEY') or ''
MODEL = 'cf/@cf/black-forest-labs/flux-2-klein-9b'

SLOT_BOX = {
    'hand': (124, 90, 68, 74), 'pet': (0, 122, 68, 72), 'acc': (0, 0, 200, 200),
    'shirt': (44, 92, 112, 82), 'bg': (0, 0, 200, 200),
}
PROMPTS = {
  'shirt-superhero': ('shirt', 'bright red blue hero costume top with yellow star, kids cartoon clothing only no person'),
  'hand-telescope': ('hand', 'telescope prop only kids cartoon no hand no person'),
  'pet-bunny': ('pet', 'cute small bunny pet kids cartoon animal only'),
  'pet-cat': ('pet', 'cute small cat pet kids cartoon animal only'),
  'pet-puppy': ('pet', 'cute small puppy pet kids cartoon animal only'),
  'pet-dragon': ('pet', 'cute baby dragon pet kids cartoon creature only'),
  'pet-phoenix': ('pet', 'cute phoenix bird pet kids cartoon bird only'),
  'pet-slime': ('pet', 'cute green slime pet blob kids cartoon creature only'),
  'pet-puppy-blue': ('pet', 'cute blue puppy pet kids cartoon animal only'),
  'pet-owl': ('pet', 'cute owl pet kids cartoon bird only'),
  'pet-fox': ('pet', 'cute fox pet kids cartoon animal only'),
  'pet-wolf': ('pet', 'cute wolf cub pet kids cartoon animal only'),
  'pet-turtle': ('pet', 'cute turtle pet kids cartoon animal only'),
  'pet-frog': ('pet', 'cute frog pet kids cartoon animal only'),
  'pet-hamster': ('pet', 'cute hamster pet kids cartoon animal only'),
  'pet-parrot': ('pet', 'cute parrot pet kids cartoon bird only'),
  'pet-unicorn': ('pet', 'cute baby unicorn pet kids cartoon creature only'),
  'pet-panda': ('pet', 'cute panda cub pet kids cartoon animal only'),
  'pet-koala': ('pet', 'cute koala pet kids cartoon animal only'),
  'pet-monkey': ('pet', 'cute monkey pet kids cartoon animal only'),
  'pet-mouse': ('pet', 'cute mouse pet kids cartoon animal only'),
  'pet-trex': ('pet', 'cute baby t-rex pet kids cartoon dinosaur only'),
  'acc-badge-star-gold': ('acc', 'gold star badge accessory only kids cartoon no person'),
  'acc-bowtie-red': ('acc', 'red bowtie accessory only kids cartoon no person'),
  'acc-crowns-flower': ('acc', 'flower crown accessory only kids cartoon no person'),
  'acc-earrings-hoop-gold': ('acc', 'gold hoop earrings accessory only kids cartoon no person'),
  'acc-halo-angel': ('acc', 'glowing angel halo accessory only kids cartoon no person'),
  'acc-medal-gold': ('acc', 'gold medal on ribbon accessory only kids cartoon no person'),
  'acc-necklace-chain-gold': ('acc', 'gold chain necklace accessory only kids cartoon no person'),
  'acc-scarf-red': ('acc', 'red scarf accessory only kids cartoon no person'),
  'bg-cloudy-sky': ('bg', 'kids game background soft cloudy blue sky cartoon no characters'),
  'bg-sunset': ('bg', 'kids game background warm sunset sky cartoon no characters'),
  'bg-pine-forest': ('bg', 'kids game background pine forest cartoon no characters'),
  'bg-ocean': ('bg', 'kids game background ocean waves cartoon no characters'),
  'bg-starry-space': ('bg', 'kids game background starry outer space cartoon no characters'),
  'bg-snowy-mountain': ('bg', 'kids game background snowy mountains cartoon no characters'),
  'bg-tropical-beach': ('bg', 'kids game background tropical beach cartoon no characters'),
  'bg-jungle': ('bg', 'kids game background dense jungle cartoon no characters'),
  'bg-meadow': ('bg', 'kids game background green meadow flowers cartoon no characters'),
  'bg-waterfall': ('bg', 'kids game background waterfall nature cartoon no characters'),
  'bg-desert': ('bg', 'kids game background sandy desert dunes cartoon no characters'),
  'bg-snowy-forest': ('bg', 'kids game background snowy winter forest cartoon no characters'),
  'bg-castle': ('bg', 'kids game background fairy tale castle cartoon no characters'),
  'bg-brick-wall': ('bg', 'kids game background colorful brick wall cartoon no characters'),
  'bg-candy-land': ('bg', 'kids game background candy land sweets cartoon no characters'),
  'bg-rainbow': ('bg', 'kids game background bright rainbow sky cartoon no characters'),
  'bg-starry-night': ('bg', 'kids game background starry night city cartoon no characters'),
  'bg-coral-reef': ('bg', 'kids game background underwater coral reef cartoon no characters'),
  'bg-volcano': ('bg', 'kids game background volcano landscape cartoon no characters'),
  'bg-city-night': ('bg', 'kids game background night city skyline cartoon no characters'),
}
POS = {
  'pet': 'Place cute pet lower left. White background. Animal only.',
  'acc': 'Place accessory centered. White background. No person.',
  'hand': 'Place prop on right side. White background. No hand no person.',
  'shirt': 'Place clothing torso lower-center. Empty head space. White background. No person.',
  'bg': 'Fill entire square as colorful kids game scene. No characters no text.',
}

def load_remaining():
    if STATE.exists():
        return json.loads(STATE.read_text())
    return list(PROMPTS.keys())

def save_remaining(lst):
    STATE.write_text(json.dumps(lst, indent=2))

def gen(prompt):
    payload = {'model': MODEL, 'prompt': prompt, 'n': 1, 'size': '512x512'}
    body = json.dumps(payload).encode()
    req = urllib.request.Request(BASE + '/images/generations', data=body,
        headers={'Authorization': f'Bearer {KEY}', 'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            j = json.loads(r.read())
        return True, base64.b64decode(j['data'][0]['b64_json']), None
    except urllib.error.HTTPError as e:
        err = e.read().decode('utf-8', 'replace')
        return False, None, f'HTTP {e.code} {err[:200]}'
    except Exception as e:
        return False, None, str(e)[:200]

def to_canvas(raw_bytes, dest, slot):
    im = Image.open(io.BytesIO(raw_bytes)).convert('RGBA')
    if slot == 'bg':
        canvas = Image.new('RGBA', (200, 200), (0, 0, 0, 255))
        scale = max(200 / im.width, 200 / im.height)
        nw, nh = int(im.width * scale), int(im.height * scale)
        rsz = im.resize((nw, nh), Image.Resampling.LANCZOS)
        canvas.paste(rsz, ((200 - nw) // 2, (200 - nh) // 2))
        canvas = canvas.convert('RGB').convert('RGBA')
        canvas.save(dest, 'PNG', optimize=True)
        return
    px = im.load(); w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r > 235 and g > 235 and b > 235:
                px[x, y] = (255, 255, 255, 0)
            elif r > 220 and g > 220 and b > 220 and abs(r - g) < 12 and abs(g - b) < 12:
                px[x, y] = (255, 255, 255, 0)
    bb = im.split()[-1].getbbox()
    if not bb:
        im.resize((200, 200)).save(dest); return
    crop = im.crop(bb)
    canvas = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
    x, y, bw, bh = SLOT_BOX[slot]
    pad = 0.94 if slot != 'acc' else 0.88
    scale = min(int(bw * pad) / crop.width, int(bh * pad) / crop.height)
    nw, nh = max(1, int(crop.width * scale)), max(1, int(crop.height * scale))
    rsz = crop.resize((nw, nh), Image.Resampling.LANCZOS)
    ox = x + (bw - nw) // 2
    oy = y + max(0, (bh - nh) // 3) if slot in ('pet', 'shirt', 'acc') else y + (bh - nh) // 2
    canvas.paste(rsz, (ox, oy), rsz)
    canvas.save(dest, 'PNG', optimize=True)

def main():
    remaining = [s for s in load_remaining() if s in PROMPTS]
    if not remaining:
        print('nothing remaining')
        return 0
    print(f'resuming {len(remaining)} items')
    ok = fail = 0
    still = []
    for i, slug in enumerate(remaining):
        slot, detail = PROMPTS[slug]
        prompt = f"Kids game avatar customizer layer. Square canvas. Soft chunky cartoon. {POS[slot]} {detail}. No text no watermark."
        print(f'[{i+1}/{len(remaining)}] {slug}', flush=True)
        success, data, err = gen(prompt)
        if not success:
            # stop early on quota so we don't burn time
            if err and ('10,00' in err or 'daily free' in err or '429' in err):
                print(f'  QUOTA EXHAUSTED: {err}')
                still.extend(remaining[i:])
                break
            print(f'  FAIL {err}')
            still.append(slug); fail += 1
            continue
        RAW.joinpath(f'{slug}.png').write_bytes(data)
        to_canvas(data, ITEMS / f'{slug}.png', slot)
        print(f'  OK {len(data)}B')
        ok += 1
        time.sleep(0.3)
    save_remaining(still)
    print(f'DONE ok={ok} fail={fail} still={len(still)}')
    return 0 if not still else 2

if __name__ == '__main__':
    raise SystemExit(main())
