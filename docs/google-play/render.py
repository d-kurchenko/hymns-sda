#!/usr/bin/env python3
"""Render editable Google Play artwork into the Git-ignored out/ directory."""

from __future__ import annotations

import argparse
import json
import re
import sys
from functools import lru_cache
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import Image, ImageColor, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "out"
RESAMPLE = Image.Resampling.LANCZOS


class Renderer:
    def __init__(self, config: dict):
        self.config = config
        self.colors = config["colors"]
        self.font_path = ROOT / config["font"]

    @lru_cache(maxsize=128)
    def font(self, size: int, weight: int = 400) -> ImageFont.FreeTypeFont:
        font = ImageFont.truetype(str(self.font_path), size)
        font.set_variation_by_axes([32, weight])
        return font

    def text(self, draw, position, value, size, color="text", weight=400):
        draw.text(position, value, font=self.font(round(size), weight),
                  fill=self.colors[color], anchor="lt")

    def fitted_text(self, value, max_width, max_lines, preferred_size, min_size,
                    weight=400):
        """Wrap on words, respect explicit newlines, and never truncate copy."""
        for size in range(round(preferred_size), round(min_size) - 1, -1):
            font = self.font(size, weight)
            lines = []
            for paragraph in value.splitlines():
                line = ""
                for word in paragraph.split():
                    if font.getlength(word) > max_width:
                        break
                    candidate = f"{line} {word}".strip()
                    if font.getlength(candidate) > max_width:
                        lines.append(line)
                        line = word
                    else:
                        line = candidate
                else:
                    lines.append(line)
                    continue
                # One word cannot fit at this size; try a smaller font.
                break
            else:
                if len(lines) <= max_lines:
                    return lines, size
        raise ValueError(f"Текст не помещается в макет; сократите его: {value!r}")

    def background(self, width, height):
        base = ImageColor.getrgb(self.colors["background"])
        glow = ImageColor.getrgb(self.colors["glow"])
        gradient = Image.new("RGB", (160, 160))
        pixels = gradient.load()
        for y in range(160):
            for x in range(160):
                strength = max(0, 1 - ((x / 159 - .94) ** 2
                                      + (y / 159 - .60) ** 2) / .75)
                pixels[x, y] = tuple(round(a + (b - a) * strength)
                                     for a, b in zip(base, glow))
        image = gradient.resize((width, height), Image.Resampling.BICUBIC).convert("RGBA")
        ornament = Image.new("RGBA", image.size)
        draw = ImageDraw.Draw(ornament)
        accent = ImageColor.getrgb(self.colors["accent"]) + (22,)
        center_x, center_y = width * .91, height * .64
        for fraction in (.22, .32, .43):
            radius = height * fraction
            draw.ellipse((center_x - radius, center_y - radius,
                          center_x + radius, center_y + radius),
                         outline=accent, width=max(1, round(width / 720)))
        image.alpha_composite(ornament)
        return image

    def brand(self, image, x, y, scale):
        with Image.open(ROOT / self.config["icon"]) as source:
            icon = source.convert("RGBA").resize((round(56 * scale),) * 2, RESAMPLE)
        image.alpha_composite(icon, (round(x), round(y)))
        self.text(ImageDraw.Draw(image), (x + 76 * scale, y + 11 * scale),
                  self.config["app_name"], 34 * scale, weight=650)

    def screenshot(self, image, path, area, scale):
        """Contain the entire screenshot; accept replacement aspect ratios."""
        area_x, area_y, area_width, area_height = area
        with Image.open(path) as source:
            shot = ImageOps.exif_transpose(source).convert("RGB")
        shot = ImageOps.contain(shot, (round(area_width), round(area_height)), RESAMPLE)
        width, height = shot.size
        x = round(area_x + (area_width - width) / 2)
        y = round(area_y + (area_height - height) / 2)
        margin = round(12 * scale)
        radius = round(34 * scale)
        shadow = Image.new("RGBA", image.size)
        ImageDraw.Draw(shadow).rounded_rectangle(
            (x - margin, y + 16 * scale, x + width + margin, y + height + 24 * scale),
            radius, fill=(0, 0, 0, 105))
        image.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(24 * scale)))
        ImageDraw.Draw(image).rounded_rectangle(
            (x - margin, y - margin, x + width + margin, y + height + margin),
            radius, fill=self.colors["frame"], outline=self.colors["outline"],
            width=max(1, round(2 * scale)))
        mask = Image.new("L", shot.size)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, width - 1, height - 1),
                                               round(24 * scale), fill=255)
        image.paste(shot, (x, y), mask)

    def poster(self, format_spec, slide):
        width, height = format_spec["width"], format_spec["height"]
        image = self.background(width, height)
        draw = ImageDraw.Draw(image)
        if height > width:
            scale = width / 1440
            self.brand(image, 64 * scale, 46 * scale, scale)
            title_lines, title_size = self.fitted_text(
                slide["title"], 1312 * scale, 2, 100 * scale, 72 * scale, 750)
            draw = ImageDraw.Draw(image)
            leading = title_size * 1.05
            for index, line in enumerate(title_lines):
                self.text(draw, (64 * scale, 140 * scale + index * leading),
                          line, title_size, weight=750)
            subtitle_lines, subtitle_size = self.fitted_text(
                slide["subtitle"], 1312 * scale, 1, 40 * scale, 30 * scale)
            self.text(draw, (64 * scale, 370 * scale), subtitle_lines[0],
                      subtitle_size, "muted")
            # Compact header; screenshot takes all remaining space above the footer.
            area = (60 * scale, 448 * scale, 1320 * scale, 1932 * scale)
            footer_y, footer_size = height - 67 * scale, 29 * scale
            footer_x, counter_x = 64 * scale, width - 110 * scale
        else:
            scale = width / 3840
            self.brand(image, 190 * scale, 142 * scale, 1.6 * scale)
            title_lines, title_size = self.fitted_text(
                slide["title"], 1400 * scale, 2, 166 * scale, 126 * scale, 750)
            draw = ImageDraw.Draw(image)
            for index, line in enumerate(title_lines):
                self.text(draw, (190 * scale, 650 * scale + index * title_size * 1.1),
                          line, title_size, weight=750)
            subtitle_lines, subtitle_size = self.fitted_text(
                slide["subtitle"], 1350 * scale, 2, 54 * scale, 44 * scale)
            for index, line in enumerate(subtitle_lines):
                self.text(draw, (200 * scale, 1120 * scale + index * subtitle_size * 1.3),
                          line, subtitle_size, "muted")
            area = (1685 * scale, 360 * scale, 1958 * scale, 1424 * scale)
            footer_y, footer_size = 2000 * scale, 39 * scale
            footer_x, counter_x = 200 * scale, 3544 * scale
        screenshot = ROOT / slide["screenshots"][format_spec["screenshots"]]
        self.screenshot(image, screenshot, area, scale)
        draw = ImageDraw.Draw(image)
        draw.line((footer_x, footer_y - 28 * scale,
                   width - footer_x, footer_y - 28 * scale),
                  fill=self.colors["outline"], width=max(1, round(scale)))
        self.text(draw, (footer_x, footer_y), self.config["footer"],
                  footer_size, "muted")
        self.text(draw, (counter_x, footer_y), slide["id"].split("-")[0],
                  footer_size, "accent", 550)
        return image.convert("RGB")


def validate_config(config, categories):
    """Fail before rendering if a source or upload size is invalid."""
    renderer = Renderer(config)
    if not config["slides"]:
        raise ValueError("В config.json должен быть хотя бы один постер")
    ids = [slide["id"] for slide in config["slides"]]
    if len(ids) != len(set(ids)) or any(not re.fullmatch(r"[a-z0-9-]+", value) for value in ids):
        raise ValueError("id постеров должны быть уникальными: латиница, цифры, дефисы")
    renderer.font(40, 750)
    with Image.open(ROOT / config["icon"]) as icon:
        icon.verify()
    for color in config["colors"].values():
        ImageColor.getrgb(color)
    for category in categories:
        spec = config["formats"][category]
        if not re.fullmatch(r"[a-z0-9-]+", category):
            raise ValueError(f"Недопустимое имя категории: {category}")
        width, height = spec["width"], spec["height"]
        if width * 16 != height * 9 and width * 9 != height * 16:
            raise ValueError(f"{category}: размеры должны иметь пропорцию 16:9 или 9:16")
        if min(width, height) < spec["min_side"] or max(width, height) > spec["max_side"]:
            raise ValueError(f"{category}: размеры выходят за ограничения Google Play")
        for slide in config["slides"]:
            for field in ("title", "subtitle"):
                if not isinstance(slide[field], str) or not slide[field].strip():
                    raise ValueError(f"{slide['id']}: {field} должен содержать текст")
            path = ROOT / slide["screenshots"][spec["screenshots"]]
            if not path.is_file():
                raise ValueError(f"Скриншот не найден: {path}")
            with Image.open(path) as source:
                if source.format not in {"JPEG", "PNG"}:
                    raise ValueError(f"Нужен скриншот PNG или JPEG: {path}")
                source.verify()
    return renderer


def write_previews(config, categories):
    for category in categories:
        portrait = config["formats"][category]["height"] > config["formats"][category]["width"]
        cell_width, cell_height = (420, 768) if portrait else (600, 368)
        board = Image.new("RGB", (cell_width * len(config["slides"]), cell_height), "#e8eeec")
        for index, slide in enumerate(config["slides"]):
            with Image.open(OUTPUT / category / f"{slide['id']}.png") as source:
                thumb = ImageOps.contain(source, (cell_width - 24, cell_height - 36), RESAMPLE)
            board.paste(thumb, (index * cell_width + (cell_width - thumb.width) // 2, 18))
        board.save(OUTPUT / f"preview-{category}.jpg", quality=94)


def export(renderer, config, categories):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    for category in categories:
        spec = config["formats"][category]
        directory = OUTPUT / category
        directory.mkdir(exist_ok=True)
        expected = {f"{slide['id']}.png" for slide in config["slides"]}
        for slide in config["slides"]:
            image = renderer.poster(spec, slide)
            path = directory / f"{slide['id']}.png"
            image.save(path, optimize=True)
            size = path.stat().st_size
            if size > spec["max_mb"] * 1024 * 1024:
                raise ValueError(f"{path.name}: файл больше {spec['max_mb']} МБ")
            manifest.append({"file": path.relative_to(OUTPUT).as_posix(),
                             "width": image.width, "height": image.height, "bytes": size})
        # Delete only stale PNGs recorded by the previous successful export.
        previous_manifest = OUTPUT / "manifest.json"
        if previous_manifest.exists():
            for previous in json.loads(previous_manifest.read_text(encoding="utf-8")):
                old = Path(previous["file"])
                if old.parent.as_posix() == category and old.name not in expected:
                    (directory / old.name).unlink(missing_ok=True)
        print(f"{category}: {len(expected)} PNG, {spec['width']} × {spec['height']}")
    # Keep metadata and ZIP accurate for selective exports as well.
    previous_manifest = OUTPUT / "manifest.json"
    if previous_manifest.exists():
        previous = json.loads(previous_manifest.read_text(encoding="utf-8"))
        manifest += [entry for entry in previous
                     if Path(entry["file"]).parent.as_posix() not in categories
                     and (OUTPUT / entry["file"]).is_file()
                     and Path(entry["file"]).parent.as_posix() in config["formats"]]
    manifest.sort(key=lambda entry: entry["file"])
    previous_manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
                                 encoding="utf-8")
    with ZipFile(OUTPUT / "google-play-posters.zip", "w", ZIP_DEFLATED) as archive:
        for entry in manifest:
            archive.write(OUTPUT / entry["file"], entry["file"])
    write_previews(config, categories)
    print(f"Готово: {len(manifest)} изображений в {OUTPUT}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, default=ROOT / "config.json")
    parser.add_argument("--only", nargs="+", help="Экспортировать только указанные категории")
    parser.add_argument("--check", action="store_true", help="Проверить конфигурацию и исходники")
    args = parser.parse_args()
    config = json.loads(args.config.read_text(encoding="utf-8"))
    categories = list(dict.fromkeys(args.only or config["formats"]))
    unknown = set(categories) - config["formats"].keys()
    if unknown:
        raise ValueError(f"Неизвестные категории: {', '.join(sorted(unknown))}")
    renderer = validate_config(config, categories)
    if args.check:
        print("Конфигурация и все исходники проверены")
    else:
        export(renderer, config, categories)


if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, OSError) as error:
        print(f"Ошибка генерации: {error}", file=sys.stderr)
        sys.exit(1)
