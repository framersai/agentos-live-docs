#!/usr/bin/env python3
from pathlib import Path
import os
import sys
import json
import argparse
from stat import S_ISREG

from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Container, VerticalScroll, Horizontal
from textual.css.query import NoMatches # Trying original location for NoMatches
from textual.reactive import reactive
from textual.screen import ModalScreen
from textual.widgets import Button, DirectoryTree, Footer, Header, Label, Static, Pretty, TextArea

# --- Configuration ---
MAX_FILE_SIZE_MB = 5
DEFAULT_OUTPUT_BASENAME = "llm_context"

# --- File Content Utilities ---

def is_likely_binary_file(file_path: Path, chunk_size: int = 1024) -> bool:
    try:
        with open(file_path, 'rb') as f:
            chunk = f.read(chunk_size)
        if not chunk: return False
        control_chars_set = {bytes([i]) for i in range(32) if i not in (9, 10, 13)}
        null_byte_count = chunk.count(0)
        other_control_count = sum(chunk.count(char_byte) for char_byte in control_chars_set)
        if null_byte_count > 0 or (null_byte_count + other_control_count) > len(chunk) * 0.20:
            return True
        return False
    except Exception: return True

def try_read_text_file(file_path: Path) -> str:
    try:
        file_stat = file_path.stat()
        if not S_ISREG(file_stat.st_mode):
             return "File skipped: Not a regular file."
        file_size = file_stat.st_size
        if file_size == 0: return ""
        if file_size > MAX_FILE_SIZE_MB * 1024 * 1024:
            return f"File skipped: Exceeds {MAX_FILE_SIZE_MB}MB size limit."
        if is_likely_binary_file(file_path):
            return "File skipped: Detected as likely binary."
        try:
            with open(file_path, 'r', encoding='utf-8') as f: return f.read()
        except UnicodeDecodeError:
            try:
                with open(file_path, 'r', encoding='latin-1') as f:
                    return f.read() + "\n[Warning: Read with latin-1 encoding as UTF-8 failed]"
            except Exception: return "File skipped: Not valid UTF-8 or Latin-1 text."
    except FileNotFoundError: return "File skipped: Not found."
    except PermissionError: return "File skipped: Permission denied."
    except Exception as e: return f"File skipped: Error - {type(e).__name__}: {str(e)}"

# --- Formatting Utilities ---

def format_as_text(aggregated_data_dict: dict) -> str:
    scan_info = aggregated_data_dict.get("scan_info", {})
    aggregated_files = aggregated_data_dict.get("aggregated_files", [])
    preamble = scan_info.get("preamble_task_description", "")

    txt_parts = ["LLM Context Aggregation\n\n"]
    if preamble:
        txt_parts.append("Preamble / Task Description:\n")
        txt_parts.append(preamble + "\n\n")
        txt_parts.append("-" * 40 + "\n\n")

    txt_parts.append("Scan Information:\n")
    for key, value in scan_info.items():
        if key == "preamble_task_description": continue
        txt_parts.append(f"  {key.replace('_', ' ').title()}: {value}\n")
    txt_parts.append("\n" + "="*40 + "\nAggregated Files\n" + "="*40 + "\n\n")

    for file_data in aggregated_files:
        txt_parts.append(f"--- File: {file_data['file_path']} ---\n")
        txt_parts.append(file_data['content'])
        txt_parts.append("\n\n" + "-"*40 + "\n\n")
    return "".join(txt_parts)

def format_as_markdown(aggregated_data_dict: dict) -> str:
    scan_info = aggregated_data_dict.get("scan_info", {})
    aggregated_files = aggregated_data_dict.get("aggregated_files", [])
    preamble = scan_info.get("preamble_task_description", "")

    md_parts = ["# LLM Context Aggregation\n\n"]
    if preamble:
        md_parts.append("## Preamble / Task Description\n\n")
        md_parts.append(preamble + "\n\n")
        md_parts.append("---\n\n")

    md_parts.append("## Scan Information\n\n")
    for key, value in scan_info.items():
        if key == "preamble_task_description": continue
        md_parts.append(f"- **{key.replace('_', ' ').title()}:** `{value}`\n")
    md_parts.append("\n---\n\n## Aggregated Files\n\n---\n")

    lang_map = {
        ".py": "python", ".js": "javascript", ".html": "html", ".css": "css",
        ".java": "java", ".c": "c", ".cpp": "cpp", ".h": "c", ".hpp": "cpp",
        ".rs": "rust", ".go": "go", ".rb": "ruby", ".php": "php", ".sh": "bash",
        ".json": "json", ".yaml": "yaml", ".yml": "yaml", ".xml": "xml", ".md": "markdown",
        ".ts": "typescript", ".sql": "sql", ".txt": "text"
    }
    for file_data in aggregated_files:
        md_parts.append(f"### `{file_data['file_path']}`\n\n")
        ext = Path(file_data["file_path"]).suffix.lower()
        lang_hint = lang_map.get(ext, "")
        content_for_md = file_data['content'].replace("```", "\\```")
        md_parts.append(f"```{lang_hint}\n{content_for_md}\n```\n\n---\n")
    return "".join(md_parts)

# --- TUI Widgets ---

class CustomDirectoryTree(DirectoryTree):
    BINDINGS = [Binding("space", "toggle_node_selection", "Toggle Select", show=False)]
    def action_toggle_node_selection(self) -> None:
        if self.cursor_node and self.cursor_node.data:
            self.app.toggle_item_selection(self.cursor_node.data.path.resolve())

class PreambleInputScreen(ModalScreen[str]):
    def __init__(self, initial_text: str = ""):
        super().__init__()
        self.initial_text = initial_text

    def compose(self) -> ComposeResult:
        yield Container(
            Label("Enter Preamble / Task Description:"),
            TextArea(text=self.initial_text, id="preamble_text_area", language="markdown"),
            Horizontal(
                Button("Save Preamble", variant="primary", id="save_preamble"),
                Button("Cancel", variant="default", id="cancel_preamble"),
                id="preamble_buttons"
            ),
            id="preamble_dialog"
        )

    def on_mount(self) -> None:
        self.query_one("#preamble_text_area", TextArea).focus()

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if event.button.id == "save_preamble":
            text_area = self.query_one("#preamble_text_area", TextArea)
            self.dismiss(text_area.text)
        elif event.button.id == "cancel_preamble":
            self.dismiss("")

class OutputScreen(ModalScreen):
    def __init__(self, aggregated_output_dict: dict, base_filename: str):
        super().__init__()
        self.aggregated_output_dict = aggregated_output_dict
        self.base_filename = base_filename

    def compose(self) -> ComposeResult:
        yield VerticalScroll(
            Label("Aggregated Content (JSON Preview):"),
            Pretty(self.aggregated_output_dict, id="json_pretty"),
            Container(
                Button("Copy JSON", id="copy_json", variant="primary"),
                Button("Save as JSON", id="save_json", variant="success"),
                Button("Export as TXT", id="export_txt", variant="warning"),
                Button("Export as MD", id="export_md", variant="warning"),
                Button("Close", id="close_output", variant="error"),
                id="output_buttons_container"
            ),
            id="output_scroll_container"
        )

    async def on_button_pressed(self, event: Button.Pressed) -> None:
        content_to_save: str = ""
        file_ext: str = ""
        if event.button.id == "copy_json":
            json_str = json.dumps(self.aggregated_output_dict, indent=2)
            try:
                import pyperclip
                pyperclip.copy(json_str)
                self.notify("JSON copied to clipboard!")
            except ImportError: self.notify("pyperclip not found.", severity="warning")
            except Exception as e: self.notify(f"Clipboard error: {e}", severity="error")
            return
        elif event.button.id == "save_json":
            content_to_save = json.dumps(self.aggregated_output_dict, indent=2)
            file_ext = ".json"
        elif event.button.id == "export_txt":
            content_to_save = format_as_text(self.aggregated_output_dict)
            file_ext = ".txt"
        elif event.button.id == "export_md":
            content_to_save = format_as_markdown(self.aggregated_output_dict)
            file_ext = ".md"
        elif event.button.id == "close_output":
            self.dismiss(); return
        else: return

        output_filename_with_ext = self.base_filename + file_ext
        try:
            with open(output_filename_with_ext, "w", encoding="utf-8") as f:
                f.write(content_to_save)
            self.notify(f"Saved to {Path(output_filename_with_ext).resolve()}")
        except Exception as e:
            self.notify(f"Error saving file '{output_filename_with_ext}': {e}", severity="error")

# --- Main Application ---
class TUIContextBuilderApp(App[None]):
    TITLE = "LLM Context Builder"
    CSS_PATH = "tui_context_builder.tcss"
    BINDINGS = [
        Binding("q", "quit", "Quit", priority=True),
        Binding("p", "edit_preamble", "Edit Preamble"),
        Binding("backspace", "go_to_parent", "Parent Dir"),
        Binding("ctrl+space", "clear_selections", "Clear Selections"),
        Binding("enter", "aggregate_selected", "Aggregate Selected"),
        Binding("ctrl+r", "refresh_tree_focus", "Refresh Tree View")
    ]
    selected_items_display = reactive("Selected: 0 items")
    preamble_text: str | None = None

    def __init__(self, start_path_str: str = "."):
        super().__init__()
        self.initial_start_path_cli_arg = start_path_str
        self.initial_start_path = Path(start_path_str).resolve()
        self.current_display_root = self.initial_start_path
        self.user_selected_paths: set[Path] = set()

    def compose(self) -> ComposeResult:
        yield Header()
        with Container(id="app_grid"):
            yield CustomDirectoryTree(self.current_display_root, id="dir_tree")
            with VerticalScroll(id="info_panel_scroll"):
                 yield Static(id="info_panel_content", markup=True)
        yield Footer()

    def on_mount(self) -> None:
        try:
            self.query_one(CustomDirectoryTree).focus()
        except NoMatches:
             self.notify("Failed to focus DirectoryTree on mount.", severity="error")
        self.update_info_panel()

    def action_edit_preamble(self) -> None:
        def_text = self.preamble_text if self.preamble_text is not None else ""
        def preamble_callback(saved_text: str):
            if saved_text is not None:
                self.preamble_text = saved_text
                if saved_text:
                    self.notify("Preamble saved.")
                else:
                    self.notify("Preamble cleared/set to empty.")
            else:
                 self.notify("Preamble edit cancelled or no change.", severity="warning")
            self.update_info_panel()
        self.push_screen(PreambleInputScreen(initial_text=def_text), preamble_callback)


    def action_go_to_parent(self) -> None:
        original_dir_tree_widget: CustomDirectoryTree
        try:
            original_dir_tree_widget = self.query_one(CustomDirectoryTree)
        except NoMatches:
            self.notify("Directory tree widget not found. Cannot navigate.", severity="error")
            return

        current_root_in_tree = original_dir_tree_widget.path.resolve()
        parent_root = current_root_in_tree.parent.resolve()

        if parent_root == current_root_in_tree:
            self.notify("Already at filesystem root.", severity="info")
            return

        previous_display_root = self.current_display_root
        self.current_display_root = parent_root
        self.notify(f"Navigated to: {self.current_display_root}")

        if self.user_selected_paths:
            self.user_selected_paths.clear()
            self.notify("Selections cleared due to navigation.")
        self.update_info_panel()

        try:
            original_dir_tree_widget.remove()
            new_tree = CustomDirectoryTree(self.current_display_root, id="dir_tree")
            app_grid = self.query_one("#app_grid")
            info_panel = self.query_one("#info_panel_scroll")
            app_grid.mount(new_tree, before=info_panel)
            new_tree.focus()
        except Exception as e:
            self.notify(f"Error changing directory: {e}", severity="error")
            self.current_display_root = previous_display_root
            self.update_info_panel()
            try: 
                app_grid_fb = self.query_one("#app_grid")
                try:
                    app_grid_fb.query_one("#dir_tree", CustomDirectoryTree).remove()
                except NoMatches: pass
                
                self.notify(f"Attempting to restore view to: {self.current_display_root}")
                fallback_tree = CustomDirectoryTree(self.current_display_root, id="dir_tree")
                info_panel_fb = self.query_one("#info_panel_scroll")
                app_grid_fb.mount(fallback_tree, before=info_panel_fb)
                fallback_tree.focus()
            except Exception as fe:
                 self.notify(f"CRITICAL error restoring tree: {fe}. Please restart.", severity="error")

    def toggle_item_selection(self, path_to_toggle: Path) -> None:
        if path_to_toggle in self.user_selected_paths:
            self.user_selected_paths.remove(path_to_toggle); self.notify(f"Deselected: {path_to_toggle.name}")
        else:
            self.user_selected_paths.add(path_to_toggle); self.notify(f"Selected: {path_to_toggle.name}")
        self.update_info_panel()

    def update_info_panel(self) -> None:
        selected_count = len(self.user_selected_paths)
        self.selected_items_display = f"Selected: {selected_count} item{'s' if selected_count != 1 else ''}"
        content = f"[b]Current View Root:[/b]\n{self.current_display_root}\n\n"
        content += f"[b]Output Paths Relative To:[/b]\n{self.initial_start_path}\n\n"

        if self.preamble_text is not None:
            preamble_snippet = (self.preamble_text[:70] + '...') if len(self.preamble_text) > 70 else self.preamble_text
            content += f"[b]Preamble/Task:[/b] {preamble_snippet if self.preamble_text else '[Empty]'}\n\n"
        else:
            content += f"[b]Preamble/Task:[/b] [Not Set]\n\n"

        content += f"[b]{self.selected_items_display}[/b]\n\n"
        if self.user_selected_paths:
            content += "[u]Selected Paths:[/u] (shown relative to initial start path)\n"
            sorted_selection = sorted(list(self.user_selected_paths), key=lambda p: str(p))
            for item_path in sorted_selection:
                display_path_str: str; item_type = "[D]" if item_path.is_dir() else "[F]"
                try:
                    if hasattr(item_path, "is_relative_to") and item_path.is_relative_to(self.initial_start_path):
                        display_path_str = str(item_path.relative_to(self.initial_start_path))
                    else: display_path_str = str(item_path.resolve()) + " (absolute)"
                except (ValueError, AttributeError): display_path_str = str(item_path.resolve()) + " (absolute)"
                content += f"- {item_type} {display_path_str}\n"
        else: content += "No items selected.\n"
        content += "\n[b]Controls:[/b]\n"
        content += "- [yellow]Nav[/yellow]: Arrows | [yellow]Select[/yellow]: Space | [yellow]Parent Dir[/yellow]: Backspace\n"
        content += "- [yellow]Preamble[/yellow]: P | [yellow]Aggregate[/yellow]: Enter | [yellow]Clear Sel[/yellow]: Ctrl+Space\n"
        content += "- [yellow]Refresh[/yellow]: Ctrl+R | [yellow]Quit[/yellow]: Q"
        try:
            self.query_one("#info_panel_content", Static).update(content)
        except NoMatches:
            self.notify("Info panel not found to update.", severity="warning")


    def action_clear_selections(self) -> None:
        self.user_selected_paths.clear(); self.notify("Selections cleared."); self.update_info_panel()

    def action_refresh_tree_focus(self) -> None:
        try:
            self.query_one(CustomDirectoryTree).focus(); self.notify("Directory tree focused.")
        except NoMatches:
            self.notify("Directory tree not found for refresh/focus.", severity="warning")


    def _perform_aggregation(self) -> list[dict]:
        agg_data: list[dict] = []; processed_paths: set[Path] = set()
        sorted_sel = sorted(list(self.user_selected_paths), key=lambda p: str(p))
        for sel_path in sorted_sel:
            if sel_path.is_file():
                if sel_path not in processed_paths:
                    content = try_read_text_file(sel_path)
                    try: rel_path = sel_path.relative_to(self.initial_start_path).as_posix()
                    except ValueError: rel_path = sel_path.resolve().as_posix() + " (abs path)"
                    agg_data.append({"file_path": rel_path, "content": content}); processed_paths.add(sel_path)
            elif sel_path.is_dir():
                try:
                    for root, _, files in os.walk(sel_path):
                        for fname in sorted(files):
                            abs_fpath = Path(root) / fname
                            if abs_fpath not in processed_paths:
                                content = try_read_text_file(abs_fpath)
                                try: rel_path = abs_fpath.relative_to(self.initial_start_path).as_posix()
                                except ValueError: rel_path = abs_fpath.resolve().as_posix() + " (abs path)"
                                agg_data.append({"file_path": rel_path, "content": content}); processed_paths.add(abs_fpath)
                except Exception as e: self.notify(f"Err walking {sel_path.name}: {e}", severity="error")
        agg_data.sort(key=lambda x: x["file_path"])
        return agg_data

    async def action_aggregate_selected(self) -> None:
        if not self.user_selected_paths: self.notify("No items to aggregate.", severity="warning"); return
        self.notify("Aggregating content..."); agg_files = await self.run_worker(self._perform_aggregation, thread=True)
        if not agg_files: self.notify("No readable content found.", severity="warning"); return
        output_data = {
            "scan_info": {
                "preamble_task_description": self.preamble_text if self.preamble_text is not None else "",
                "initial_start_path_cli": self.initial_start_path_cli_arg,
                "initial_start_path_resolved": str(self.initial_start_path),
                "view_root_at_aggregation": str(self.current_display_root),
                "total_files_processed": len(agg_files)
            },
            "aggregated_files": agg_files
        }
        self.notify("Aggregation complete."); self.push_screen(OutputScreen(output_data, DEFAULT_OUTPUT_BASENAME))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="TUI Context Builder for LLM Pair Programming.")
    parser.add_argument("start_directory", nargs="?", default=".", help="Initial directory (default: current).")
    args = parser.parse_args()
    resolved_start_path = Path(args.start_directory).resolve()
    if not resolved_start_path.is_dir():
        print(f"Error: Start path '{args.start_directory}' (-> '{resolved_start_path}') is not a valid directory.", file=sys.stderr)
        sys.exit(1)
    app = TUIContextBuilderApp(start_path_str=args.start_directory)
    app.run()