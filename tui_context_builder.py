#!/usr/bin/env python3
from pathlib import Path
import os
import sys
import json
import argparse
from stat import S_ISREG
import logging

from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Container, VerticalScroll, Horizontal, Vertical
from textual.css.query import NoMatches
from textual.reactive import reactive
from textual.screen import ModalScreen
from textual.widgets import Button, DirectoryTree, Footer, Header, Label, Static, Pretty, TextArea, Markdown

# --- Configuration ---
MAX_FILE_SIZE_MB = 5
DEFAULT_OUTPUT_BASENAME = "llm_context"
CACHE_FILENAME = ".tui_context_builder_cache.json"
LOG_FILENAME = "tui_context_builder.log"

# --- Setup Logging ---
logging.basicConfig(
    filename=LOG_FILENAME,
    level=logging.DEBUG, 
    format="%(asctime)s - %(levelname)s - %(module)s:%(lineno)d - %(message)s",
    filemode='w' 
)
logging.info("TUIContextBuilderApp starting up.")

# --- File Content Utilities ---
def is_likely_binary_file(file_path: Path, chunk_size: int = 1024) -> bool:
    try:
        with open(file_path, 'rb') as f:
            chunk = f.read(chunk_size)
        if not chunk: return False
        if b'\x00' in chunk:
            logging.debug(f"File '{file_path}' detected as binary due to NUL byte.")
            return True
        control_char_count = 0
        for byte_val in chunk:
            if byte_val < 32 and byte_val not in (0, 9, 10, 13): 
                control_char_count += 1
        if len(chunk) > 0 and (control_char_count / len(chunk)) > 0.20:
            logging.debug(f"File '{file_path}' detected as binary due to high control character count ({control_char_count}/{len(chunk)}).")
            return True
        return False
    except Exception as e:
        logging.warning(f"Could not check if file is binary ('{file_path}'): {e}", exc_info=True)
        return True

def try_read_text_file(file_path: Path) -> str:
    logging.debug(f"Attempting to read file: {file_path}")
    try:
        file_stat = file_path.stat()
        if not S_ISREG(file_stat.st_mode):
            msg = "File skipped: Not a regular file."
            logging.info(f"{msg} - Path: {file_path}")
            return msg
        file_size = file_stat.st_size
        if file_size == 0:
            logging.info(f"File is empty: {file_path}")
            return ""
        if file_size > MAX_FILE_SIZE_MB * 1024 * 1024:
            msg = f"File skipped: Exceeds {MAX_FILE_SIZE_MB}MB size limit."
            logging.info(f"{msg} - Path: {file_path}, Size: {file_size}")
            return msg
        if is_likely_binary_file(file_path):
            msg = "File skipped: Detected as likely binary."
            logging.info(f"{msg} - Path: {file_path}")
            return msg
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                logging.debug(f"Successfully read file (UTF-8): {file_path}, Length: {len(content)}")
                return content
        except UnicodeDecodeError:
            logging.warning(f"UTF-8 decoding failed for {file_path}. Trying Latin-1.")
            try:
                with open(file_path, 'r', encoding='latin-1') as f:
                    content = f.read()
                    logging.debug(f"Successfully read file (Latin-1): {file_path}, Length: {len(content)}")
                    return content + "\n[Warning: Read with latin-1 encoding as UTF-8 failed]"
            except Exception as e_latin1:
                msg = "File skipped: Not valid UTF-8 or Latin-1 text."
                logging.error(f"{msg} - Path: {file_path}, Error: {e_latin1}", exc_info=True)
                return msg
    except FileNotFoundError:
        msg = "File skipped: Not found."
        logging.warning(f"{msg} - Path: {file_path}")
        return msg
    except PermissionError:
        msg = "File skipped: Permission denied."
        logging.warning(f"{msg} - Path: {file_path}")
        return msg
    except Exception as e:
        msg = f"File skipped: Error - {type(e).__name__}: {str(e)}"
        logging.error(f"{msg} - Path: {file_path}", exc_info=True)
        return msg

# --- Formatting & Stats Utilities ---
def get_content_stats(content: str) -> dict:
    if content.startswith("File skipped:"):
        return {"characters": 0, "words": 0, "estimated_tokens_openai": 0, "is_skip_message": True}
    char_count = len(content)
    word_count = len(content.split())
    estimated_tokens_openai = round(char_count / 4) 
    return {
        "characters": char_count, 
        "words": word_count, 
        "estimated_tokens_openai": estimated_tokens_openai, 
        "is_skip_message": False
    }

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
    for key in ["total_files_successfully_read", "total_files_skipped", "total_characters_read", "total_words_read", "estimated_openai_tokens_read", "aggregation_timestamp"]:
        if key in scan_info:
            txt_parts.append(f"  {key.replace('_', ' ').title()}: {scan_info[key]}\n")
    txt_parts.append(f"  Initial Start Path Cli Arg: {scan_info.get('initial_start_path_cli_arg', 'N/A')}\n")
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
        self._original_text_on_mount = initial_text 
    def compose(self) -> ComposeResult:
        yield Container(
            Label("Enter Preamble / Task Description (Markdown supported):"),
            TextArea(text=self.initial_text, id="preamble_text_area", language="markdown"),
            Horizontal(
                Button("Save Preamble", variant="primary", id="save_preamble"),
                Button("Cancel", variant="default", id="cancel_preamble"),
                id="preamble_buttons"
            ),id="preamble_dialog")
    def on_mount(self) -> None:
        self.query_one("#preamble_text_area", TextArea).focus()
        self._original_text_on_mount = self.query_one("#preamble_text_area", TextArea).text
    def on_button_pressed(self, event: Button.Pressed) -> None:
        if event.button.id == "save_preamble":
            self.dismiss(self.query_one("#preamble_text_area", TextArea).text)
        elif event.button.id == "cancel_preamble":
            self.dismiss(self._original_text_on_mount) 

class OutputScreen(ModalScreen):
    def __init__(self, aggregated_output_dict: dict, base_filename: str):
        super().__init__()
        self.aggregated_output_dict = aggregated_output_dict
        self.base_filename = base_filename
        self._plain_text_content_cache = None 

    def _get_plain_text_content(self) -> str:
        if self._plain_text_content_cache is None:
            self._plain_text_content_cache = format_as_text(self.aggregated_output_dict)
        return self._plain_text_content_cache

    def compose(self) -> ComposeResult:
        scan_info = self.aggregated_output_dict.get("scan_info", {})
        stats_summary_lines = []
        stat_keys_ordered = [
            ("total_files_successfully_read", "Files Read"),
            ("total_files_skipped", "Files Skipped"),
            ("total_characters_read", "Chars Read"),
            ("estimated_openai_tokens_read", "Est. Tokens") 
        ]
        for key, display_name in stat_keys_ordered:
            if key in scan_info:
                stats_summary_lines.append(f"[b]{display_name}:[/b] {scan_info[key]:,}")
        stats_summary = " | ".join(stats_summary_lines) if stats_summary_lines else "No content stats available."

        with VerticalScroll(id="output_scroll_container"):
            yield Label("Aggregation Summary", classes="title")
            yield Static(stats_summary, id="stats_summary_display", classes="summary-stats")
            yield Label("[dim]\nSee previews below. Full details in exported files and log.[/dim]")
            yield Label("\nFormatted Text Preview (Scrollable):", classes="preview-title")
            yield TextArea(
                self._get_plain_text_content(),
                id="text_preview", read_only=True, language=None,
                classes="preview-area text-preview-area"
            )
            yield Label("\nFull Aggregation Data (JSON Format - Scrollable):", classes="preview-title")
            yield Pretty(self.aggregated_output_dict, id="json_pretty_preview", classes="preview-area json-preview-area")
            with Container(id="output_buttons_container"):
                yield Button("Copy as TXT", id="copy_txt", variant="default")
                yield Button("Copy JSON", id="copy_json", variant="primary")
                yield Button("Save as JSON", id="save_json", variant="success")
                yield Button("Export as TXT", id="export_txt", variant="warning")
                yield Button("Export as MD", id="export_md", variant="warning")
                yield Button("Close", id="close_output", variant="error")
                
    async def on_button_pressed(self, event: Button.Pressed) -> None:
        content_to_save: str = ""
        file_ext: str = ""
        action_taken = True
        export_type = ""
        if event.button.id == "copy_txt":
            export_type = "Copy TXT"
            text_to_copy = self._get_plain_text_content()
            try:
                import pyperclip
                pyperclip.copy(text_to_copy)
                self.notify("Plain text copied to clipboard!")
                logging.info("Plain text content copied to clipboard.")
            except ImportError:
                self.notify("pyperclip not found. Install to enable copy.", severity="warning", timeout=8)
                logging.warning("pyperclip not found for copy TXT action.")
            except Exception as e: 
                self.notify(f"Clipboard error: {e}", severity="error")
                logging.error(f"Clipboard error (Copy TXT): {e}", exc_info=True)
            return
        elif event.button.id == "copy_json":
            export_type = "Copy JSON"
            json_str = json.dumps(self.aggregated_output_dict, indent=2)
            try:
                import pyperclip 
                pyperclip.copy(json_str)
                self.notify("JSON copied to clipboard!")
                logging.info("JSON content copied to clipboard.")
            except ImportError:
                self.notify("pyperclip not found. Install to enable copy.", severity="warning", timeout=8)
                logging.warning("pyperclip not found for copy JSON action.")
            except Exception as e: 
                self.notify(f"Clipboard error: {e}", severity="error")
                logging.error(f"Clipboard error (Copy JSON): {e}", exc_info=True)
            return 
        elif event.button.id == "save_json":
            export_type = "Save JSON"
            content_to_save = json.dumps(self.aggregated_output_dict, indent=2)
            file_ext = ".json"
        elif event.button.id == "export_txt":
            export_type = "Export TXT"
            content_to_save = self._get_plain_text_content()
            file_ext = ".txt"
        elif event.button.id == "export_md":
            export_type = "Export MD"
            content_to_save = format_as_markdown(self.aggregated_output_dict)
            file_ext = ".md"
        elif event.button.id == "close_output":
            self.dismiss(); return
        else: action_taken = False
        if not action_taken or not file_ext: return 
        output_dir = self.app.initial_start_path 
        output_filename_with_ext = output_dir / (self.base_filename + file_ext)
        try:
            with open(output_filename_with_ext, "w", encoding="utf-8") as f: f.write(content_to_save)
            self.notify(f"Saved to {output_filename_with_ext.resolve()}")
            logging.info(f"{export_type} successful. Saved to {output_filename_with_ext.resolve()}")
        except Exception as e:
            self.notify(f"Error saving file '{output_filename_with_ext}': {e}", severity="error")
            logging.error(f"Error during {export_type} to '{output_filename_with_ext}': {e}", exc_info=True)

class HelpScreen(ModalScreen):
    BINDINGS = [Binding("escape,q", "dismiss_help", "Close Help", show=True)]
    def compose(self) -> ComposeResult:
        full_help_text = f"""
## LLM Context Builder - Help 📖

This tool helps you select files and directories to aggregate their content for use as context with Large Language Models.

### Main View Controls:

-   **Arrow Keys**: Navigate the directory tree.
-   **Enter**: Expand/collapse a directory. (Default tree behavior)
-   **Space**: Toggle selection of the currently highlighted file/directory for aggregation.
-   **A**: Aggregate content from all currently selected items.
-   **Backspace**: Navigate to the parent directory.
-   **P**: Edit or set the Preamble/Task Description.
-   **Ctrl+Space**: Clear all current selections.
-   **Ctrl+L**: Load previously selected files from cache (merges with current selection).
-   **Ctrl+R**: Refresh tree view / focus directory tree.
-   **H / F1**: Show this Help screen.
-   **Q**: Quit the application (saves current selections to cache).

### Selection:

-   Selected items are visually indicated in the tree.
-   If a directory is selected, all valid text files within it (recursively) will be included during aggregation.
-   The list of selected items is shown in the right-hand panel.

### Preamble:

-   The preamble is text you can include at the beginning of the aggregated output. Markdown formatting is supported.

### Aggregation (Press 'A'):

-   Pressing **A** triggers the aggregation process for currently selected items.
-   An output screen will appear showing:
    1.  A summary of content statistics (files read, characters, estimated tokens).
    2.  A scrollable preview of the formatted plain text.
    3.  A scrollable preview of the full aggregation data in JSON format.
-   From this screen, you can copy the text or JSON, or save/export as JSON, TXT, or Markdown. Output files are saved in the directory where the application was initially started.

### Caching Selections 💾:

-   The set of selected files is automatically saved to `~/{CACHE_FILENAME}` when you quit.
-   Use **Ctrl+L** to reload these selections in a new session.

### File Handling:

-   Files larger than **{MAX_FILE_SIZE_MB}MB** are skipped.
-   Files detected as binary are skipped.
-   UTF-8 encoding is attempted first; Latin-1 is a fallback.

### Logging 📝:
- A log file named `{LOG_FILENAME}` is created in the directory where you run the script. It contains debug information.

Press **Esc** or **Q** to close this help dialog.
"""
        yield Container(
            Markdown(full_help_text, id="help_markdown"), 
            Button("Close Help", variant="primary", id="close_help_button"),
            id="help_dialog_container")
    def on_mount(self) -> None: self.query_one(Markdown).focus()
    def on_button_pressed(self, event: Button.Pressed) -> None:
        if event.button.id == "close_help_button": self.dismiss()
    def action_dismiss_help(self) -> None: self.dismiss()

# --- Main Application ---
class TUIContextBuilderApp(App[None]):
    TITLE = "LLM Context Builder"
    CSS = """
    Screen { overflow: hidden; }
    #app_grid { height: 1fr; border-top: heavy $primary-lighten-2; border-bottom: heavy $primary-lighten-2; }
    #dir_tree { width: 2fr; height: 100%; border: round $primary; padding: 0 1; }
    #info_panel_scroll { width: 1fr; height: 100%; border: round $secondary; padding: 1; overflow-y: auto; }
    
    PreambleInputScreen #preamble_dialog, HelpScreen #help_dialog_container {
        padding: 1 2; width: 80vw; max-width: 100; height: 80vh; max-height: 40;
        border: thick $primary-background-lighten-2; background: $surface; }
    PreambleInputScreen TextArea, HelpScreen Markdown { height: 1fr; margin-bottom: 1; }
    PreambleInputScreen #preamble_buttons, HelpScreen Button#close_help_button { width: 100%; align-horizontal: right; }
    
    OutputScreen #output_scroll_container { padding: 1; height: 100%; }
    OutputScreen Label.title { text-style: bold; margin-bottom: 1; text-align: center;} /* Removed font-size */
    OutputScreen Static#stats_summary_display { width: 100%; text-align: center; margin-bottom: 1; padding: 1; border: round $primary; background: $primary-background-lighten-2;}
    OutputScreen Label.preview-title { margin-top: 1; text-style: bold; }
    OutputScreen TextArea.preview-area { width: 100%; height: 12; margin-bottom: 1; border: round $background-lighten-2; } 
    OutputScreen Pretty.preview-area { width: 100%; height: 1fr; border: round $background-lighten-2; } 
    
    OutputScreen #output_buttons_container { 
        height: auto; margin-top: 1; 
        layout: grid; grid-size: 2 3; /* 2 rows, 3 columns for 6 buttons */ 
        grid-gutter: 1; 
        align: center middle;
    }
    OutputScreen Button { width: 100%; margin: 0; }
    """
    BINDINGS = [
        Binding("q", "quit", "Quit", priority=True),
        Binding("p", "edit_preamble", "Preamble"),
        Binding("backspace", "go_to_parent", "Parent Dir"),
        Binding("ctrl+space", "clear_selections", "Clear Sel."),
        Binding("a", "aggregate_selected", "Aggregate Sel."),
        Binding("ctrl+l", "load_cached_selections", "Load Cache"),
        Binding("h,f1", "show_help", "Help"),
        Binding("ctrl+r", "refresh_tree_focus", "Refresh Tree")
    ]
    selected_items_display = reactive("Selected: 0 items")
    preamble_text: str | None = None

    def __init__(self, start_path_str: str = "."):
        super().__init__()
        self.initial_start_path_cli_arg = start_path_str
        self.initial_start_path = Path(start_path_str).resolve()
        self.current_display_root = self.initial_start_path
        self.user_selected_paths: set[Path] = set()
        self._cache_file_path = Path.home() / CACHE_FILENAME
        logging.info(f"App initialized. Start path: {self.initial_start_path_cli_arg} (resolved: {self.initial_start_path})")

    def compose(self) -> ComposeResult:
        yield Header()
        with Horizontal(id="app_grid"):
            yield CustomDirectoryTree(str(self.current_display_root), id="dir_tree")
            with VerticalScroll(id="info_panel_scroll"):
                yield Static(id="info_panel_content", markup=True)
        yield Footer()

    def on_mount(self) -> None:
        try:
            self.query_one(CustomDirectoryTree).focus()
        except NoMatches:
            logging.error("Failed to focus DirectoryTree on mount.")
            self.notify("Failed to focus DirectoryTree on mount.", severity="error")
        self.update_info_panel()
        if self._cache_file_path.exists():
            self.notify(f"Cached selections found (Ctrl+L to load). Path: {self._cache_file_path}", timeout=7)
            logging.info(f"Cache file exists at {self._cache_file_path}")

    def on_unmount(self) -> None:
        self._save_cached_selections()
        logging.info("TUIContextBuilderApp stopped.")

    def _save_cached_selections(self) -> None:
        paths_relative_to_initial, paths_absolute_stored = [], []
        resolved_initial_start = self.initial_start_path.resolve()
        for p_selected_abs in self.user_selected_paths:
            try:
                paths_relative_to_initial.append(str(p_selected_abs.relative_to(resolved_initial_start)))
            except ValueError: paths_absolute_stored.append(str(p_selected_abs))
        if not paths_relative_to_initial and not paths_absolute_stored and not self._cache_file_path.exists():
            logging.debug("No selections to save and no existing cache file."); return
        cache_data = {"cached_from_initial_path": str(resolved_initial_start), "relative_paths": paths_relative_to_initial, "absolute_paths": paths_absolute_stored}
        try:
            with open(self._cache_file_path, "w", encoding="utf-8") as f: json.dump(cache_data, f, indent=2)
            logging.info(f"Selections cached to {self._cache_file_path}. Rel: {len(paths_relative_to_initial)}, Abs: {len(paths_absolute_stored)}")
        except Exception as e:
            logging.error(f"Error caching selections to '{self._cache_file_path}': {e}", exc_info=True)
            print(f"Error caching selections on quit to '{self._cache_file_path}': {e}", file=sys.stderr)

    async def action_load_cached_selections(self) -> None:
        logging.info("Attempting to load cached selections.")
        if not self._cache_file_path.exists():
            self.notify(f"No cache file found at '{self._cache_file_path}'.", severity="warning"); logging.warning("Cache file not found."); return
        try:
            with open(self._cache_file_path, "r", encoding="utf-8") as f: cache_data = json.load(f)
        except Exception as e:
            self.notify(f"Error reading cache: {e}", severity="error"); logging.error(f"Error reading cache: {e}", exc_info=True); return
        cached_base_path_str = cache_data.get("cached_from_initial_path")
        relative_strings, absolute_strings = cache_data.get("relative_paths", []), cache_data.get("absolute_paths", [])
        if not cached_base_path_str and relative_strings:
            self.notify("Cache error: base path missing.", severity="error"); logging.error("Cache base path missing.");
        base = Path(cached_base_path_str).resolve() if cached_base_path_str else None
        loaded_paths, not_found = set(), 0
        for rel_s in relative_strings:
            if base: p = (base / rel_s).resolve(); (loaded_paths.add(p) if p.exists() else (not_found:=not_found+1, logging.warning(f"Cached rel path missing: {p}")))
        for abs_s in absolute_strings:
            p = Path(abs_s).resolve(); (loaded_paths.add(p) if p.exists() else (not_found:=not_found+1, logging.warning(f"Cached abs path missing: {p}")))
        if not_found: self.notify(f"{not_found} cached path(s) not found.", severity="warning")
        if loaded_paths:
            newly_added = loaded_paths - self.user_selected_paths; self.user_selected_paths.update(loaded_paths)
            msg = f"Loaded {len(loaded_paths)} path(s). {len(newly_added)} new."
            self.notify(msg); logging.info(msg); self.update_info_panel()
        elif not_found == 0: self.notify("Cache empty or no new valid paths.", severity="info"); logging.info("Cache load no new paths.")

    def action_show_help(self) -> None: self.push_screen(HelpScreen())
    def action_edit_preamble(self) -> None:
        current_preamble, original_text = self.preamble_text or "", self.preamble_text or ""
        def cb(returned: str | None):
            if returned is not None:
                if returned != original_text: 
                    self.preamble_text = returned; self.notify("Preamble updated." if returned else "Preamble cleared.")
                    logging.info(f"Preamble updated. Len: {len(self.preamble_text or '')}")
                else: self.notify("Preamble unchanged.", severity="information")
            else: self.notify("Preamble edit cancelled.", severity="warning"); logging.warning("Preamble cb None.")
            self.update_info_panel()
        self.push_screen(PreambleInputScreen(initial_text=current_preamble), cb)

    def action_go_to_parent(self) -> None:
        try: tree = self.query_one(CustomDirectoryTree)
        except NoMatches: self.notify("Dir tree missing.", severity="error"); logging.error("Parent: Dir tree missing."); return
        current_p, parent_p = tree.path.resolve(), tree.path.resolve().parent
        if parent_p == current_p: self.notify("At root.", severity="info"); return
        logging.info(f"Navigating parent: {self.current_display_root} to {parent_p}")
        self.current_display_root = parent_p
        if self.user_selected_paths: self.user_selected_paths.clear(); self.notify("Selections cleared."); logging.info("Selections cleared on nav.")
        self.update_info_panel()
        try: tree.path = str(self.current_display_root); tree.focus(); self.notify(f"Navigated to: {self.current_display_root}")
        except Exception as e: self.notify(f"Error nav to '{self.current_display_root}': {e}", severity="error"); logging.error(f"Error nav parent: {e}", exc_info=True)

    def toggle_item_selection(self, path: Path) -> None:
        if path in self.user_selected_paths: self.user_selected_paths.remove(path); msg = f"Deselected: {path}"
        else: self.user_selected_paths.add(path); msg = f"Selected: {path}"
        self.notify(path.name); logging.info(msg); self.update_info_panel()

    def update_info_panel(self) -> None:
        count = len(self.user_selected_paths); self.selected_items_display = f"Selected: {count} item{'s' if count != 1 else ''}"
        root, initial_root = self.current_display_root.resolve(), self.initial_start_path.resolve()
        content = f"[b]View Root:[/b]\n{root}\n\n[b]Output Base:[/b]\n{initial_root}\n\n"
        preamble = "[Not Set]"
        if self.preamble_text is not None: 
            if not self.preamble_text: preamble = "[Empty]"
            else: s = (self.preamble_text[:70] + '...') if len(self.preamble_text) > 70 else self.preamble_text; preamble = s.replace('\n', '↵ ')
        content += f"[b]Preamble:[/b] {preamble}\n\n[b]{self.selected_items_display}[/b]\n\n"
        if self.user_selected_paths:
            content += "[u]Selected Paths:[/u] (rel to output base if possible)\n"
            for item in sorted(list(self.user_selected_paths), key=str): 
                t = "[D]" if item.is_dir() else "[F]"
                try: p_str = str(item.relative_to(initial_root))
                except ValueError: p_str = str(item) + " (absolute)"
                content += f"- {t} {p_str}\n"
        else: content += "No items selected.\n"
        content += "\n[b]Controls:[/b] ([yellow]H/F1[/yellow] for Help)\n"
        content += "- [cyan]Nav/Enter Dir[/cyan]: Arrows/Enter | [cyan]Select[/cyan]: Space\n"
        content += "- [cyan]Aggregate Sel.[/cyan]: A | [cyan]Parent Dir[/cyan]: Bksp | [cyan]Preamble[/cyan]: P\n"
        content += "- [cyan]Clear Sel[/cyan]: Ctrl+Space | [cyan]Load Cache[/cyan]: Ctrl+L\n"
        content += "- [cyan]Refresh[/cyan]: Ctrl+R | [cyan]Quit[/cyan]: Q"
        try: self.query_one("#info_panel_content", Static).update(content)
        except NoMatches: pass

    def action_clear_selections(self) -> None:
        if not self.user_selected_paths: self.notify("No selections to clear.", severity="information")
        else: self.user_selected_paths.clear(); self.notify("Selections cleared."); logging.info("All selections cleared.")
        self.update_info_panel()

    def action_refresh_tree_focus(self) -> None:
        try: tree = self.query_one(CustomDirectoryTree); tree.focus(); self.notify("Tree refreshed & focused.")
        except NoMatches: self.notify("Dir tree missing.", severity="warning"); logging.warning("Refresh: Dir tree missing.")

    def _perform_aggregation(self) -> list[dict] | None:
        logging.info(f"Aggregating: {[str(p) for p in self.user_selected_paths]}")
        data, processed = [], set()
        try:
            initial_root = self.initial_start_path.resolve()
            for sel_p in sorted(list(self.user_selected_paths), key=str):
                logging.debug(f"Processing: {sel_p}")
                if sel_p.is_file():
                    if sel_p not in processed:
                        content = try_read_text_file(sel_p)
                        try: rel_p = sel_p.relative_to(initial_root).as_posix()
                        except ValueError: rel_p = sel_p.as_posix() + " (abs path)"
                        data.append({"file_path": rel_p, "content": content}); processed.add(sel_p)
                elif sel_p.is_dir():
                    for root_s, dirs, files in os.walk(sel_p):
                        dirs[:] = [d for d in dirs if d not in {'.git','.hg','.svn','__pycache__','node_modules','venv','.venv','target','build','dist'}]
                        root_p = Path(root_s).resolve()
                        for fname in sorted(files):
                            abs_f = (root_p / fname).resolve()
                            if abs_f not in processed:
                                logging.debug(f"Reading from dir: {abs_f}")
                                content = try_read_text_file(abs_f)
                                try: rel_f = abs_f.relative_to(initial_root).as_posix()
                                except ValueError: rel_f = abs_f.as_posix() + " (abs path)"
                                data.append({"file_path": rel_f, "content": content}); processed.add(abs_f)
            data.sort(key=lambda x: x["file_path"])
            logging.info(f"Aggregation done. {len(data)} entries."); return data
        except Exception as e: logging.error(f"Critical error in aggregation: {e}", exc_info=True); return None

    async def action_aggregate_selected(self) -> None:
        if not self.user_selected_paths:
            self.notify("No items to aggregate.", severity="warning"); logging.warning("Aggro attempt no items."); return
        self.notify("Aggregating...", timeout=3); logging.info("User triggered aggregation (A).")
        worker = self.run_worker(self._perform_aggregation, thread=True)
        agg_data: list[dict] | None = None
        try: agg_data = await worker.wait(); logging.debug("Worker done.")
        except AttributeError: 
            try: logging.warning("worker.wait() missing, trying direct await."); agg_data = await worker # type: ignore 
            except TypeError: self.notify("FATAL: Worker API error.", severity="error",timeout=0); logging.critical("Worker unawaitable.", exc_info=True); return
            except Exception as e: self.notify(f"Await worker err: {e}", severity="error"); logging.error(f"Direct await worker err: {e}", exc_info=True); return
        except Exception as e: self.notify(f"Aggro worker err: {e}", severity="error"); logging.error(f"Await worker.wait() err: {e}", exc_info=True); return
        if agg_data is None: self.notify("Aggregation failed.", severity="error"); logging.error("Aggro worker returned None."); return
        if not agg_data: self.notify("No readable content found.", severity="warning"); logging.warning("Aggro empty list."); return
        
        chars,words,tokens,read_ok,skipped = 0,0,0,0,0
        for fd in agg_data:
            stats = get_content_stats(fd['content'])
            if not stats["is_skip_message"]: chars+=stats["characters"]; words+=stats["words"]; tokens+=stats["estimated_tokens_openai"]; read_ok+=1
            else: skipped+=1
        
        output_data = {
            "scan_info": {
                "preamble_task_description": self.preamble_text or "",
                "initial_start_path_cli_arg": self.initial_start_path_cli_arg,
                "initial_start_path_resolved": str(self.initial_start_path.resolve()),
                "view_root_at_aggregation": str(self.current_display_root.resolve()),
                "total_selected_items_input": len(self.user_selected_paths),
                "total_files_processed_output": len(agg_data),
                "total_files_successfully_read": read_ok, "total_files_skipped": skipped,
                "total_characters_read": chars, "total_words_read": words,
                "estimated_openai_tokens_read": tokens,
                "aggregation_timestamp": logging.Formatter().formatTime(logging.LogRecord(None,None,"",0,"",(),None,None),datefmt=None)
            },"aggregated_files": agg_data
        }
        logging.info(f"Aggregation OK. Scan info: {json.dumps(output_data['scan_info'], indent=2)}")
        self.notify(f"Aggregation OK. {read_ok} file(s) read. See '{LOG_FILENAME}'.")
        self.push_screen(OutputScreen(output_data, DEFAULT_OUTPUT_BASENAME))

# --- Script Entry Point ---
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="TUI Context Builder.", formatter_class=argparse.RawTextHelpFormatter)
    parser.add_argument("start_directory", nargs="?", default=".", help="Initial directory (default: current).")
    args = parser.parse_args()
    try:
        res_start_p = Path(args.start_directory).resolve(strict=True) 
        if not res_start_p.is_dir(): print(f"Error: '{res_start_p}' not a dir.", file=sys.stderr); logging.critical(f"Start path err: '{res_start_p}' not dir."); sys.exit(1)
    except FileNotFoundError: print(f"Error: Start path '{args.start_directory}' not found.", file=sys.stderr); logging.critical(f"Start path err: '{args.start_directory}' not found."); sys.exit(1)
    except Exception as e: print(f"Error resolving start path '{args.start_directory}': {e}", file=sys.stderr); logging.critical(f"Start path err: {e}", exc_info=True); sys.exit(1)
    app = TUIContextBuilderApp(start_path_str=args.start_directory)
    app.run()