#!/usr/bin/env python3
import os
import argparse
import sys # For Python version check
from pathlib import Path
import traceback

# --- Python Version Check ---
if sys.version_info < (3, 7): # F-strings generally available, Pathlib benefits
    sys.exit("This script requires Python 3.7 or higher.")

# Core conversion libraries
try:
    from svglib.svglib import svg2rlg
    from reportlab.graphics import renderPM, renderPDF
    from PIL import Image, ImageColor
except ImportError as e:
    sys.exit(
        f"Error: Missing required libraries. {e}. "
        "Please install them using: pip install svglib reportlab Pillow"
    )

def convert_svg_file(
    input_svg_path: str,
    output_path_template: str, # e.g., "output_dir/filename_base"
    output_formats: list[str],
    target_width_px: int | None,
    target_height_px: int | None,
    scale_factor: float | None,
    dpi: int,
    png_background: str | None, # Hex or color name, or 'transparent'
) -> bool:
    """
    Converts a single SVG file to specified formats (PNG, PDF).
    """
    if not os.path.exists(input_svg_path):
        print(f"[ERROR] Input SVG file not found: {input_svg_path}")
        return False

    print(f"Processing: '{Path(input_svg_path).name}' (DPI: {dpi}, TargetW: {target_width_px}px, TargetH: {target_height_px}px, ScaleF: {scale_factor})")

    try:
        drawing = svg2rlg(input_svg_path)
        if not drawing:
            print(f"[ERROR] Could not parse SVG with svglib: {input_svg_path}")
            return False

        original_svg_width_pt = drawing.width if drawing.width is not None else 0
        original_svg_height_pt = drawing.height if drawing.height is not None else 0
        
        sx = sy = 1.0 # Default scale
        
        # Determine scaling factor
        if target_width_px is not None or target_height_px is not None:
            # Calculate sx
            if target_width_px is not None and original_svg_width_pt > 0:
                target_w_pt = (target_width_px / dpi) * 72.0
                sx = target_w_pt / original_svg_width_pt
            elif target_width_px is not None: # target width given but no original width
                sx = 1.0 # Cannot determine scale based on width, keep aspect for height or use 1.0
            
            # Calculate sy
            if target_height_px is not None and original_svg_height_pt > 0:
                target_h_pt = (target_height_px / dpi) * 72.0
                sy = target_h_pt / original_svg_height_pt
            elif target_height_px is not None: # target height given but no original height
                sy = 1.0 # Cannot determine scale based on height, keep aspect for width or use 1.0

            # Maintain aspect ratio if only one dimension is specified and the other is determinable
            if target_width_px is not None and original_svg_width_pt > 0 and \
               (target_height_px is None or original_svg_height_pt == 0):
                sy = sx
            elif target_height_px is not None and original_svg_height_pt > 0 and \
                 (target_width_px is None or original_svg_width_pt == 0):
                sx = sy
            elif original_svg_width_pt == 0 and original_svg_height_pt == 0: # SVG has no dimensions
                # Cannot scale based on target_width/height if SVG has no inherent size.
                # If scale_factor is also provided, it might be ambiguous.
                # Fallback to scale_factor if present, otherwise 1.0
                sx = sy = scale_factor if scale_factor is not None else 1.0
        elif scale_factor is not None:
            sx = sy = scale_factor
        
        # Ensure scales are not zero if dimensions were zero
        if sx == 0: sx = 1.0
        if sy == 0: sy = 1.0

        # Create a new drawing instance for scaling to avoid modifying the original `drawing` object
        # if it were to be used again (though it's not in this specific flow currently)
        scaled_drawing = svg2rlg(input_svg_path) 
        if not scaled_drawing: # Should not happen if first read worked
            print(f"[ERROR] Failed to re-read SVG for scaling: {input_svg_path}")
            return False

        scaled_drawing.scale(sx, sy)
        # Update drawing dimensions based on actual scaling applied
        scaled_drawing.width = original_svg_width_pt * sx
        scaled_drawing.height = original_svg_height_pt * sy
        
        if "pdf" in output_formats:
            pdf_output_path = f"{output_path_template}.pdf"
            renderPDF.drawToFile(scaled_drawing, pdf_output_path, f"Converted from {Path(input_svg_path).name}")
            print(f"  [SUCCESS] Converted to PDF: '{pdf_output_path}'")

        if "png" in output_formats:
            png_output_path = f"{output_path_template}.png"
            bg_color_pil = None 
            if png_background and png_background.lower() != 'transparent':
                try:
                    color_tuple_rgba = ImageColor.getcolor(png_background, "RGBA")
                    if color_tuple_rgba[3] == 255: # Fully opaque
                         bg_color_pil = color_tuple_rgba[:3] # RGB tuple
                    else: # Has transparency
                         bg_color_pil = color_tuple_rgba # RGBA tuple
                except ValueError:
                    print(f"  [WARN] Invalid PNG background color '{png_background}'. Using transparent.")
            
            pil_image = renderPM.drawToPIL(scaled_drawing, dpi=dpi, bg=None) # bg=None for transparency from svglib

            if bg_color_pil and pil_image.mode != 'RGBA': # If source isn't RGBA for compositing, convert it
                 pil_image = pil_image.convert("RGBA")

            if bg_color_pil: # User wants a specific background
                final_image_mode = "RGBA" if len(bg_color_pil) == 4 and bg_color_pil[3] < 255 else "RGB"
                final_image = Image.new(final_image_mode, pil_image.size, bg_color_pil)
                
                pil_image_for_composite = pil_image
                
                if final_image.mode == 'RGBA': 
                    if pil_image_for_composite.mode != 'RGBA':
                        pil_image_for_composite = pil_image_for_composite.convert('RGBA')
                    final_image.alpha_composite(pil_image_for_composite)
                else: 
                    if pil_image_for_composite.mode == 'RGBA':
                         final_image.paste(pil_image_for_composite, (0,0), pil_image_for_composite)
                    else: 
                         final_image.paste(pil_image_for_composite.convert('RGB'), (0,0))
                pil_image = final_image

            pil_image.save(png_output_path, format="PNG", dpi=(dpi, dpi))
            img_width = pil_image.width if hasattr(pil_image, 'width') else 0
            img_height = pil_image.height if hasattr(pil_image, 'height') else 0
            print(f"  [SUCCESS] Converted to PNG: '{png_output_path}' (Size: {img_width}x{img_height}px)")
        
        return True

    except Exception as e:
        print(f"[ERROR] An unexpected error occurred while converting {input_svg_path}: {e}")
        print(traceback.format_exc()) # Print full traceback for debugging
        return False

def main():
    parser = argparse.ArgumentParser(
        description="Batch convert SVG files to PNG and/or PDF. Processes directories recursively by default.",
        formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument(
        "input_path", 
        nargs="?", # Makes the argument optional
        default=".", # Default to current directory if no path is given
        help=(
            "Path to an input SVG file or a directory containing SVG files.\n"
            "If a directory is provided, it will be processed recursively.\n"
            "If no path is provided, processes SVGs in the current directory recursively."
        )
    )
    parser.add_argument(
        "-o", "--output-dir", 
        default=".", 
        help="Directory to save converted files (default: current directory)."
    )
    parser.add_argument(
        "-f", "--formats", 
        nargs="+", 
        default=["png"], 
        choices=["png", "pdf"], 
        help="Output format(s) (default: ['png']). Choose 'png', 'pdf', or both."
    )
    
    size_group = parser.add_mutually_exclusive_group()
    size_group.add_argument("--width", type=int, help="Target width for PNG output in pixels. Height will scale proportionally.")
    size_group.add_argument("--height", type=int, help="Target height for PNG output in pixels. Width will scale proportionally.")
    size_group.add_argument("--scale", type=float, help="Scale factor for output (e.g., 2.0 for 200%% size).")

    parser.add_argument("--dpi", type=int, default=300, help="DPI for PNG output (default: 300).")
    parser.add_argument("--png-background", type=str, default="transparent", help="Background color for PNGs (e.g., '#FFFFFF', 'white', 'transparent') (default: 'transparent').")

    args = parser.parse_args()

    output_dir_path = Path(args.output_dir)
    output_dir_path.mkdir(parents=True, exist_ok=True)

    svg_files_to_process = []
    input_path_arg = Path(args.input_path)

    if input_path_arg.is_dir():
        print(f"Scanning directory recursively: {input_path_arg.resolve()}")
        svg_files_to_process.extend(list(input_path_arg.rglob("*.svg")))
        svg_files_to_process.extend(list(input_path_arg.rglob("*.svgz")))
    elif input_path_arg.is_file() and input_path_arg.suffix.lower() in [".svg", ".svgz"]:
        svg_files_to_process.append(input_path_arg)
    else:
        if not input_path_arg.exists():
             print(f"[ERROR] Input path does not exist: {input_path_arg}")
        else:
             print(f"[ERROR] Input path is not a valid SVG file or directory: {input_path_arg}")
        sys.exit(1) # Exit if input path is invalid

    if not svg_files_to_process:
        print(f"[INFO] No SVG files found to process in: {input_path_arg.resolve()}")
        return

    svg_files_to_process = sorted(list(set(svg_files_to_process))) # Remove duplicates

    print(f"Found {len(svg_files_to_process)} SVG file(s) to process.")
    successful_conversions = 0
    failed_conversions = 0

    for svg_file_path in svg_files_to_process:
        # Construct relative path from input_dir to svg_file_path for output structure
        # This helps maintain folder structure in the output directory if input was a folder
        relative_path_to_svg = svg_file_path.relative_to(input_path_arg if input_path_arg.is_dir() else input_path_arg.parent)
        
        # For single file input, relative_path_to_svg would be just the filename.
        # We want the output filename base to be relative_path_to_svg.stem
        # And the output sub-directory structure to be relative_path_to_svg.parent
        
        output_sub_dir = output_dir_path
        if relative_path_to_svg.parent != Path("."): # If the SVG was in a subdirectory of the input_path
            output_sub_dir = output_dir_path / relative_path_to_svg.parent
            output_sub_dir.mkdir(parents=True, exist_ok=True)
            
        base_filename = svg_file_path.stem
        output_template = str(output_sub_dir / base_filename)
        
        if convert_svg_file(
            input_svg_path=str(svg_file_path),
            output_path_template=output_template,
            output_formats=args.formats,
            target_width_px=args.width,
            target_height_px=args.height,
            scale_factor=args.scale,
            dpi=args.dpi,
            png_background=args.png_background
        ):
            successful_conversions += 1
        else:
            failed_conversions += 1
            
    print("\n--- Conversion Summary ---")
    print(f"Successfully converted: {successful_conversions}")
    print(f"Failed conversions: {failed_conversions}")
    print(f"Output directory: {output_dir_path.resolve()}")

if __name__ == "__main__":
    main()