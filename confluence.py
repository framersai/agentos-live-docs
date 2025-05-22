#!/usr/bin/env python3

import os
import logging
import time
from datetime import datetime
from pathlib import Path
import json
from multiprocessing import Pool, cpu_count
from typing import Optional, List, Generator, Any, Dict, Tuple, Set
import re

# Third-party libraries
try:
    import typer
    from tqdm import tqdm
    import yake
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    import chardet
except ImportError as e:
    print(f"Missing one or more required libraries: {e}. Please install them.")
    print("You can typically install them using pip:")
    print("pip install typer tqdm yake scikit-learn chardet")
    exit(1)

# --- Configuration (formerly config.py) ---

# Default CLI Parameter Values
DEFAULT_OUTPUT_JSON: str = "confluence_output.json"
DEFAULT_OUTPUT_FLAT: str = "confluence_output.txt"
DEFAULT_PRESET: str = "code"
DEFAULT_SIMILARITY_THRESHOLD: float = 0.05
DEFAULT_KEYWORD_BOOST: float = 1.5
DEFAULT_MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5 MB
DEFAULT_MAX_FLAT_TOKENS: int = 50000
DEFAULT_LOG_LEVEL: str = "INFO"
DEFAULT_PROGRESS_BAR: bool = True

# File Handling Presets & Rules
DEFAULT_IGNORE_DIRS: Set[str] = {
    ".git", "__pycache__", "node_modules", "venv", ".venv", "target", "build",
    "dist", ".vscode", ".idea", "logs", "temp", "tmp", ".DS_Store", "Thumbs.db"
}

DEFAULT_IGNORE_EXTENSIONS: Set[str] = {
    ".exe", ".dll", ".so", ".o", ".a", ".lib", ".jar", ".war", ".class", ".pyc", ".pyo",
    ".zip", ".tar", ".gz", ".bz2", ".rar", ".7z", ".tgz",
    ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".ico", ".svg",
    ".mp3", ".wav", ".ogg", ".mp4", ".avi", ".mov", ".mkv", ".flv",
    ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".odt", ".ods", ".odp",
    ".db", ".sqlite", ".mdb", ".accdb", ".dat", ".idx",
    ".log", ".tmp", ".temp", ".bak", ".swp", ".swo", ".lock",
}

DEFAULT_PRESETS: Dict[str, Set[str]] = {
    "code": {
        ".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".c", ".cpp", ".h", ".hpp",
        ".cs", ".go", ".rs", ".swift", ".kt", ".kts", ".scala", ".rb", ".pl",
        ".sh", ".bash", ".zsh", ".ps1", ".php", ".groovy", ".dart", ".lua",
        ".r", ".m", ".sql", ".yaml", ".yml", ".json", ".xml", ".html", ".css",
        ".tf", ".hcl", ".ini", ".cfg", ".conf", ".properties", ".toml"
    },
    "docs": {
        ".md", ".txt", ".rst", ".tex", ".adoc", ".org", ".asciidoc", ".rtf",
        ".html", ".xml", ".json", ".csv",
        ".yaml", ".yml", ".ini", ".cfg", ".conf", ".properties", ".toml"
    },
    "all_text": set() # Signifies match all not explicitly ignored
}

# NLP Configuration
YAKE_LANGUAGE: str = "en"
YAKE_MAX_NGRAM_SIZE: int = 3
YAKE_NUM_KEYWORDS: int = 10

# Multiprocessing
DEFAULT_NUM_WORKERS: int = 0 # 0 means use os.cpu_count()

# Output Configuration
SNIPPET_MAX_LINES: int = 10
SNIPPET_MAX_CHARS_PER_LINE: int = 120
FLATTENED_FILE_HEADER_TEMPLATE: str = "--- FILE: {relative_path} (Relevance: {relevance_score:.2f}) ---"
VALID_LOG_LEVELS: Set[str] = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}

def approximate_word_count(text: str) -> int:
    return len(text.split())

def get_cpu_count_safe() -> int:
    return os.cpu_count() or 1

# --- Utilities (formerly utils.py) ---

# Global logger instance, configured in main_cli
logger: Optional[logging.Logger] = None

def setup_logger_global(level: str = "INFO") -> logging.Logger:
    """Configures and returns the global logger."""
    global logger
    logger = logging.getLogger("Confluence")
    logger.setLevel(level.upper())
    # Clear existing handlers to avoid duplicates if called multiple times
    if logger.hasHandlers():
        logger.handlers.clear()
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger

def get_file_metadata(file_path: Path, search_root: Path) -> Dict[str, Any]:
    try:
        stat = file_path.stat()
        return {
            "file_path": str(file_path.resolve()),
            "relative_path": str(file_path.relative_to(search_root)),
            "file_name": file_path.name,
            "extension": file_path.suffix.lower(),
            "size_bytes": stat.st_size,
            "last_modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
        }
    except Exception as e:
        if logger:
            logger.debug(f"Could not get metadata for {file_path}: {e}")
        return {
            "file_path": str(file_path.resolve()),
            "relative_path": str(file_path.relative_to(search_root) if search_root and search_root in file_path.parents else file_path.name),
            "file_name": file_path.name,
            "extension": file_path.suffix.lower(),
            "size_bytes": -1,
            "last_modified": datetime.fromtimestamp(0).isoformat(),
        }

def read_file_content(file_path: Path, max_file_size: int) -> Optional[str]:
    if logger is None: # Should not happen if setup_logger_global is called
        local_fallback_logger = logging.getLogger("Confluence.ReadFileFallback")
        local_fallback_logger.warning("Global logger not initialized during read_file_content.")
    current_logger = logger or logging.getLogger("Confluence.ReadFile")

    try:
        if file_path.stat().st_size > max_file_size:
            current_logger.debug(f"Skipping large file: {file_path} (size > {max_file_size} bytes)")
            return None
        if file_path.stat().st_size == 0:
            current_logger.debug(f"Skipping empty file: {file_path}")
            return ""

        with open(file_path, 'rb') as f_binary:
            raw_data = f_binary.read()

        detected_encoding = chardet.detect(raw_data)['encoding']

        if detected_encoding:
            try:
                return raw_data.decode(detected_encoding)
            except (UnicodeDecodeError, TypeError) as e:
                current_logger.warning(f"Could not decode {file_path} with detected encoding {detected_encoding}: {e}. Trying UTF-8.")
                try:
                    return raw_data.decode('utf-8')
                except UnicodeDecodeError as e_utf8:
                    current_logger.error(f"UTF-8 fallback failed for {file_path}: {e_utf8}. Skipping file.")
                    return None
        else:
            current_logger.debug(f"Chardet could not detect encoding for {file_path}. Trying common fallbacks.")
            for enc in ['utf-8', 'latin-1', 'ascii']:
                try:
                    return raw_data.decode(enc)
                except UnicodeDecodeError:
                    continue
            current_logger.error(f"Could not decode {file_path} with any common fallback encodings. Skipping.")
            return None
    except FileNotFoundError:
        current_logger.error(f"File not found during read: {file_path}")
        return None
    except PermissionError:
        current_logger.warning(f"Permission denied reading file: {file_path}")
        return None
    except Exception as e:
        current_logger.error(f"Error reading file {file_path}: {e}")
        return None

def generate_snippet(content: str, keywords: Optional[List[str]] = None) -> str:
    if not content: return ""
    lines = content.splitlines()
    if not lines: return ""

    best_snippet_lines: List[str] = []
    if keywords:
        keyword_lines_indices: Set[int] = set()
        for kw in keywords:
            kw_lower = kw.lower()
            for i, line in enumerate(lines):
                if kw_lower in line.lower():
                    keyword_lines_indices.add(i)
        
        if keyword_lines_indices:
            # Try to get context around keyword lines
            contextual_indices: Set[int] = set()
            for idx in sorted(list(keyword_lines_indices)): # Process in order to build contiguous blocks
                start = max(0, idx - SNIPPET_MAX_LINES // 4)
                end = min(len(lines), idx + (SNIPPET_MAX_LINES // 4) + 1)
                for i in range(start, end):
                    contextual_indices.add(i)
                    if len(contextual_indices) >= SNIPPET_MAX_LINES * 2: # Buffer a bit more
                        break
                if len(contextual_indices) >= SNIPPET_MAX_LINES * 2:
                        break
            # Select unique lines, keep order as much as possible, limit to SNIPPET_MAX_LINES
            best_snippet_lines = [lines[i] for i in sorted(list(contextual_indices))[:SNIPPET_MAX_LINES]]


    if not best_snippet_lines:
        best_snippet_lines = lines[:SNIPPET_MAX_LINES]

    truncated_snippet_lines: List[str] = []
    for line in best_snippet_lines:
        if len(line) > SNIPPET_MAX_CHARS_PER_LINE:
            truncated_snippet_lines.append(line[:SNIPPET_MAX_CHARS_PER_LINE-3] + "...")
        else:
            truncated_snippet_lines.append(line)
    return "\n".join(truncated_snippet_lines)

def format_results_to_flat_text(results: List[Dict[str, Any]], max_tokens: int, header_template: str) -> str:
    current_logger = logger or logging.getLogger("Confluence.FormatFlat")
    flat_text_parts: List[str] = []
    current_token_count: int = 0
    files_included_count: int = 0

    for result in results:
        file_header = header_template.format(
            relative_path=result["relative_path"],
            relevance_score=result["relevance_score"]
        )
        header_token_count = approximate_word_count(file_header)
        # Use full_content if available, otherwise empty string
        file_full_content = result.get("full_content", "")
        content_token_count = approximate_word_count(file_full_content)

        if current_token_count + header_token_count + content_token_count <= max_tokens:
            flat_text_parts.append(file_header)
            flat_text_parts.append(file_full_content)
            current_token_count += header_token_count + content_token_count
            result["full_content_included_in_flat"] = True
            files_included_count += 1
        elif current_token_count + header_token_count < max_tokens:
            remaining_tokens = max_tokens - current_token_count - header_token_count
            words = file_full_content.split()
            truncated_content = " ".join(words[:remaining_tokens])
            if len(words) > remaining_tokens:
                 truncated_content += " ... (truncated)"

            flat_text_parts.append(file_header)
            flat_text_parts.append(truncated_content)
            current_token_count += header_token_count + approximate_word_count(truncated_content)
            result["full_content_included_in_flat"] = "partial"
            files_included_count += 1
            break
        else:
            result["full_content_included_in_flat"] = False
            break
    current_logger.info(f"Included content from {files_included_count} files in flattened output (approx. {current_token_count} tokens).")
    return "\n\n".join(flat_text_parts)

# --- NLP Utilities (formerly nlp_utils.py) ---

# Global TF-IDF related objects. They are initialized by `initialize_prompt_vector`.
# This is necessary because the vectorizer needs to be fitted (trained) on the prompt's vocabulary.
tfidf_vectorizer_global: Optional[TfidfVectorizer] = None
prompt_tfidf_vector_global: Optional[Any] = None # Scipy sparse matrix

def extract_keywords_from_prompt(prompt: str) -> List[str]:
    current_logger = logger or logging.getLogger("Confluence.NLP")
    try:
        custom_kw_extractor = yake.KeywordExtractor(
            lan=YAKE_LANGUAGE,
            n=YAKE_MAX_NGRAM_SIZE,
            dedupLim=0.9,
            dedupFunc='seqm',
            windowsSize=1,
            top=YAKE_NUM_KEYWORDS,
            features=None
        )
        keywords_with_scores = custom_kw_extractor.extract_keywords(prompt)
        keywords = [kw for kw, score in keywords_with_scores]
        current_logger.debug(f"Extracted YAKE keywords: {keywords}")
        return keywords
    except Exception as e:
        current_logger.error(f"Error extracting keywords with YAKE: {e}")
        return list(set(re.findall(r'\b\w+\b', prompt.lower())))[:YAKE_NUM_KEYWORDS]

def initialize_prompt_vector(prompt_text: str) -> None:
    global tfidf_vectorizer_global, prompt_tfidf_vector_global
    current_logger = logger or logging.getLogger("Confluence.NLP")
    tfidf_vectorizer_global = TfidfVectorizer(
        stop_words='english',
        lowercase=True,
        norm='l2',
        token_pattern=r"(?u)\b\w\w+\b"
    )
    try:
        prompt_tfidf_vector_global = tfidf_vectorizer_global.fit_transform([prompt_text])
        current_logger.debug("Prompt TF-IDF vector initialized.")
    except Exception as e:
        current_logger.error(f"Failed to initialize prompt TF-IDF vector: {e}")
        prompt_tfidf_vector_global = None

def calculate_tfidf_cosine_similarity(file_content: str) -> float:
    global tfidf_vectorizer_global, prompt_tfidf_vector_global
    current_logger = logger or logging.getLogger("Confluence.NLP")
    if prompt_tfidf_vector_global is None or tfidf_vectorizer_global is None or not file_content:
        return 0.0
    try:
        file_vector = tfidf_vectorizer_global.transform([file_content])
        similarity = cosine_similarity(prompt_tfidf_vector_global, file_vector)[0][0]
        return float(similarity)
    except Exception as e:
        current_logger.debug(f"Could not calculate TF-IDF similarity for content starting with '{file_content[:50]}...': {e}")
        return 0.0

def calculate_keyword_score(file_content: str, keywords: List[str]) -> float:
    if not keywords or not file_content: return 0.0
    score: float = 0.0
    content_lower = file_content.lower()
    num_keywords_found: int = 0
    total_frequency: int = 0

    for kw in keywords:
        kw_lower = kw.lower()
        matches = re.findall(r'\b' + re.escape(kw_lower) + r'\b', content_lower)
        if matches:
            num_keywords_found += 1
            total_frequency += len(matches)

    if not num_keywords_found: return 0.0
    
    # Score for distinct keywords found
    distinct_kw_score = (num_keywords_found / len(keywords)) * 0.6 # Weight distinctness more

    # Score for total frequency, normalized by content length (approx words)
    content_words = len(content_lower.split()) + 1 # Add 1 to avoid div by zero
    # Normalize frequency to avoid overly biasing long documents.
    # Max frequency component contribution is 0.4.
    # This scaling factor (e.g., 10) is heuristic.
    frequency_component = min((total_frequency / content_words) * 10, 0.4) 
    
    score = distinct_kw_score + frequency_component
    return min(score, 1.0)

def calculate_combined_relevance(
    file_content: str,
    prompt_keywords: List[str],
    keyword_boost_factor: float
) -> Tuple[float, float, float, str]:
    if not file_content:
        return 0.0, 0.0, 0.0, "none"

    similarity_score = calculate_tfidf_cosine_similarity(file_content)
    keyword_match_score = calculate_keyword_score(file_content, prompt_keywords)

    combined_score: float = 0.0
    match_type: str = "none"

    # Weighted average: (w1*s1 + w2*s2) / (w1+w2)
    # Here, w1=1 for similarity, w2=keyword_boost_factor for keyword score
    if similarity_score > 0.001 or keyword_match_score > 0.001: # If either contributes meaningfully
        combined_score = (similarity_score + (keyword_match_score * keyword_boost_factor)) / (1 + keyword_boost_factor)
    
    # Determine match type for reporting
    sim_threshold_type = 0.02 # Small threshold to be considered a 'similarity' match contributor
    kw_threshold_type = 0.05  # Small threshold to be considered a 'keyword' match contributor

    has_sim = similarity_score >= sim_threshold_type
    has_kw = keyword_match_score >= kw_threshold_type

    if has_sim and has_kw:
        match_type = "keyword_similarity"
    elif has_kw:
        match_type = "keyword"
    elif has_sim:
        match_type = "similarity"
        
    return min(combined_score, 1.0), similarity_score, keyword_match_score, match_type

# --- File Processor (formerly file_processor.py) ---

class FileProcessor:
    def __init__(self, search_root: Path, cli_args: Dict[str, Any]):
        self.search_root: Path = search_root
        self.args: Dict[str, Any] = cli_args # Parsed CLI arguments + derived values

        self.prompt_keywords: List[str] = cli_args.get("prompt_keywords", [])
        self.similarity_threshold: float = cli_args.get("similarity_threshold", DEFAULT_SIMILARITY_THRESHOLD)
        self.max_file_size: int = cli_args.get("max_file_size", DEFAULT_MAX_FILE_SIZE)
        self.keyword_boost: float = cli_args.get("keyword_boost", DEFAULT_KEYWORD_BOOST)
        
        self.current_logger = logger or logging.getLogger("Confluence.FileProcessor")

        # Determine effective file extensions and ignored directories
        preset_name: str = cli_args.get("preset", DEFAULT_PRESET)
        include_ext_str: Optional[str] = cli_args.get("include_ext")
        exclude_ext_str: Optional[str] = cli_args.get("exclude_ext")
        cli_ignore_dirs: Optional[List[str]] = cli_args.get("ignore_dir")

        self.included_extensions: Set[str]
        self.active_exclusions: Set[str] = set(DEFAULT_IGNORE_EXTENSIONS) # Start with default ignores

        if exclude_ext_str:
            additional_exclusions = {f".{ext.strip().lstrip('.')}" for ext in exclude_ext_str.split(',') if ext.strip()}
            self.active_exclusions.update(additional_exclusions)
            self.current_logger.debug(f"Adding explicit exclude extensions: {additional_exclusions}")

        if include_ext_str: # Explicit includes override presets and default ignores for these specific extensions
            self.included_extensions = {f".{ext.strip().lstrip('.')}" for ext in include_ext_str.split(',') if ext.strip()}
            self.current_logger.info(f"Using explicit include extensions: {self.included_extensions}")
        elif preset_name == "all_text":
            self.included_extensions = set() # Signifies match all not in active_exclusions
            self.current_logger.info(f"'all_text' preset: will include files not in exclusions: {self.active_exclusions}")
        else: # Use preset extensions, filtering out any active exclusions
            preset_extensions = DEFAULT_PRESETS.get(preset_name, set())
            self.included_extensions = {ext for ext in preset_extensions if ext not in self.active_exclusions}
            self.current_logger.info(f"Using preset '{preset_name}', target extensions: {self.included_extensions}, excluded: {self.active_exclusions.intersection(preset_extensions)}")
        
        self.ignored_dirs: Set[str] = {d.lower() for d in (cli_ignore_dirs or [])}.union(DEFAULT_IGNORE_DIRS)
        self.current_logger.debug(f"Effective ignored directories: {self.ignored_dirs}")


    def _is_relevant_file_by_rules(self, file_path: Path) -> bool:
        if not file_path.is_file(): return False

        if any(ignored_dir in part.lower() for ignored_dir in self.ignored_dirs for part in file_path.parts):
            self.current_logger.debug(f"Skipping file in ignored directory: {file_path}")
            return False

        file_ext = file_path.suffix.lower()
        
        # If --include-ext was used, only those extensions are allowed
        if self.args.get("include_ext"): # Check original CLI arg presence
            return file_ext in self.included_extensions

        # Otherwise, check against active_exclusions
        if file_ext in self.active_exclusions:
            self.current_logger.debug(f"Skipping file with actively excluded extension '{file_ext}': {file_path}")
            return False
        
        # If 'all_text' preset (and no --include-ext), it passed exclusion, so it's good
        if self.args.get("preset") == "all_text" and not self.args.get("include_ext"):
             self.current_logger.debug(f"Including '{file_ext}' file due to 'all_text' preset and not excluded: {file_path}")
             return True
        
        # For other presets (code, docs) or if self.included_extensions has items
        if self.included_extensions: # This means it's a preset like 'code' or 'docs' after filtering
            return file_ext in self.included_extensions
        
        # Fallback: if no specific extensions defined for the preset (e.g., after all exclusions),
        # and it's not 'all_text', then no files of this type are targeted.
        # This path should ideally not be hit if presets are well-defined.
        if not self.included_extensions and self.args.get("preset") != "all_text":
            self.current_logger.warning(f"No target extensions effectively defined for preset '{self.args.get('preset')}' for file '{file_path}'. It will be skipped.")
            return False
        
        # Should be covered: if it got here, it wasn't excluded and didn't need specific inclusion.
        return True


    def discover_files(self) -> Generator[Path, None, None]:
        self.current_logger.info(f"Starting file discovery in '{self.search_root}'...")
        count = 0
        for item in self.search_root.rglob("*"):
            if self._is_relevant_file_by_rules(item):
                yield item
                count += 1
        self.current_logger.info(f"File discovery complete. Found {count} potentially relevant files to check.")

# --- Worker function for multiprocessing (must be top-level) ---

def process_file_task_worker(
    file_path_str: str,
    search_root_str: str,
    prompt_keywords_list: List[str],
    keyword_boost_val: float,
    similarity_thresh_val: float,
    max_fsize: int,
    log_level_str: str # Added to set up logger in worker
) -> Optional[Dict[str, Any]]:
    
    # Logger setup for this worker process
    # Each worker needs its own logger instance, or logging might get messy
    worker_logger = logging.getLogger(f"Confluence.Worker.{os.getpid()}")
    worker_logger.setLevel(log_level_str)
    if not worker_logger.handlers: # Avoid adding handlers repeatedly if pool reuses processes with same pid (less likely)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(process)d - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        worker_logger.addHandler(handler)
    
    # Re-Pathify
    current_file_path = Path(file_path_str)
    search_root_path = Path(search_root_str)
    worker_logger.debug(f"Processing {current_file_path}")

    # Content reading
    # Note: read_file_content uses the global `logger`. This might be an issue if not careful.
    # It's better if utility functions take a logger instance. For now, assume it works or falls back.
    # Pass worker_logger to utilities if they are refactored to accept it.
    content = read_file_content(current_file_path, max_fsize) # read_file_content uses global logger
    if content is None:
        worker_logger.debug(f"No content for {current_file_path}, skipping.")
        return None

    # Scoring
    # calculate_combined_relevance also uses global logger and NLP globals
    combined_score, sim_score, kw_score, match_type = calculate_combined_relevance(
        content,
        prompt_keywords_list,
        keyword_boost_val
    )

    if combined_score < similarity_thresh_val:
        worker_logger.debug(f"File {current_file_path} below relevance {similarity_thresh_val} (score: {combined_score:.3f}). Skipping.")
        return None

    # Metadata
    metadata = get_file_metadata(current_file_path, search_root_path) # Uses global logger
    metadata.update({
        "relevance_score": combined_score,
        "similarity_score": sim_score,
        "keyword_score": kw_score,
        "match_type": match_type,
        "matched_keywords": [kw for kw in prompt_keywords_list if re.search(r'\b' + re.escape(kw.lower()) + r'\b', content.lower())],
        "content_snippet": generate_snippet(content, prompt_keywords_list), # Uses global logger
        "full_content": content,
        "approx_token_count": approximate_word_count(content),
        "full_content_included_in_flat": False
    })
    worker_logger.info(f"Relevant: {current_file_path} (Score: {combined_score:.3f}, Type: {match_type})")
    return metadata

# --- Main CLI Application (formerly main.py) ---

app = typer.Typer(
    name="Confluence",
    help="Recursively crawls folders, aggregates file contents for LLMs based on prompt similarity and keywords.",
    add_completion=False
)

@app.command(context_settings={"max_content_width": 120})
def main_cli(
    prompt: str = typer.Argument(..., help="The text prompt to guide the file search."),
    directory: Path = typer.Argument(..., exists=True, file_okay=False, dir_okay=True, readable=True, resolve_path=True, help="Root directory to crawl."),
    output_json: Path = typer.Option(lambda: Path(DEFAULT_OUTPUT_JSON), "--output-json", "-oj", help="Path for structured JSON output.", show_default=True),
    output_flat: Path = typer.Option(lambda: Path(DEFAULT_OUTPUT_FLAT), "--output-flat", "-of", help="Path for flattened text output for LLMs.", show_default=True),
    preset: str = typer.Option(DEFAULT_PRESET, "--preset", "-p", help=f"File filter preset. Options: {list(DEFAULT_PRESETS.keys())}", show_default=True),
    include_ext: Optional[str] = typer.Option(None, "--include-ext", "-ie", help="Comma-separated extensions to include (e.g., .py,.md). Overrides preset logic."),
    exclude_ext: Optional[str] = typer.Option(None, "--exclude-ext", "-ee", help="Comma-separated extensions to exclude (e.g., .log,.tmp). Appends to default/preset ignores."),
    ignore_dir: Optional[List[str]] = typer.Option(None, "--ignore-dir", "-id", help=f"Directory names to ignore (case-insensitive). Can be specified multiple times. Defaults: {list(DEFAULT_IGNORE_DIRS)}."),
    similarity_threshold: float = typer.Option(DEFAULT_SIMILARITY_THRESHOLD, "--similarity-threshold", "-st", min=0.0, max=1.0, help="Minimum combined relevance score.", show_default=True),
    keyword_boost: float = typer.Option(DEFAULT_KEYWORD_BOOST, "--keyword-boost", "-kb", min=0.0, help="Multiplier for keyword match score contribution.", show_default=True),
    max_file_size: int = typer.Option(DEFAULT_MAX_FILE_SIZE, "--max-file-size", "-mfs", min=0, help="Maximum file size in bytes to process.", show_default=True),
    max_flat_tokens: int = typer.Option(DEFAULT_MAX_FLAT_TOKENS, "--max-flat-tokens", "-mft", min=0, help="Approximate max words for flattened output.", show_default=True),
    num_workers: int = typer.Option(DEFAULT_NUM_WORKERS, "--num-workers", "-nw", min=0, help="Number of worker processes (0 for auto = CPU cores).", show_default="auto"),
    log_level: str = typer.Option(DEFAULT_LOG_LEVEL, "--log-level", "-ll", case_sensitive=False, help=f"Logging level. Options: {list(VALID_LOG_LEVELS)}", show_default=True),
    progress: bool = typer.Option(DEFAULT_PROGRESS_BAR, "--progress/--no-progress", help="Show progress bar.", show_default=True)
):
    """
    Confluence: Crawl, Understand, Aggregate.
    Finds relevant files based on your prompt and prepares them for an LLM.
    """
    global logger # Allow modification of the global logger instance
    if log_level.upper() not in VALID_LOG_LEVELS:
        typer.echo(f"Error: Invalid log level '{log_level}'. Choose from {list(VALID_LOG_LEVELS)}.", err=True)
        raise typer.Exit(code=1)
    logger = setup_logger_global(log_level) # Sets up the global logger

    start_time = time.time()
    logger.info("Confluence process started.")
    logger.info(f"Prompt: '{prompt}'")
    logger.info(f"Directory: '{directory}'")

    # NLP Initialization
    prompt_keywords = extract_keywords_from_prompt(prompt)
    initialize_prompt_vector(prompt) # This sets tfidf_vectorizer_global and prompt_tfidf_vector_global
    if prompt_tfidf_vector_global is None:
         logger.critical("Prompt TF-IDF vector could not be initialized. This is critical. Exiting.")
         typer.echo("Error: NLP model for prompt could not be initialized. Cannot continue.", err=True)
         raise typer.Exit(code=1)
    logger.info(f"Prompt keywords extracted: {prompt_keywords}")

    # Prepare FileProcessor arguments
    effective_ignore_dirs = list(ignore_dir) if ignore_dir else list(DEFAULT_IGNORE_DIRS)
    
    processor_cli_args = {
        "prompt_keywords": prompt_keywords,
        "preset": preset, "include_ext": include_ext, "exclude_ext": exclude_ext,
        "ignore_dir": effective_ignore_dirs, # Pass the resolved list
        "similarity_threshold": similarity_threshold, "keyword_boost": keyword_boost,
        "max_file_size": max_file_size,
        # These are not directly used by FileProcessor init but needed for worker or other logic
        "search_root_str": str(directory.resolve()), 
        "log_level": log_level.upper(),
    }
    file_processor_instance = FileProcessor(search_root=directory, cli_args=processor_cli_args)

    # File Discovery
    discovered_files_list = list(file_processor_instance.discover_files())
    if not discovered_files_list:
        logger.warning("No files found matching discovery criteria. Exiting.")
        typer.echo("No files found matching your criteria to process.")
        raise typer.Exit(code=0)
    logger.info(f"Discovered {len(discovered_files_list)} files to analyze.")

    # Parallel Processing
    actual_num_workers = num_workers if num_workers > 0 else get_cpu_count_safe()
    logger.info(f"Using {actual_num_workers} worker processes.")

    # Prepare arguments for each worker task. Must be picklable.
    tasks_for_pool = [
        (
            str(fp), # file_path_str
            str(directory.resolve()), # search_root_str
            prompt_keywords, # prompt_keywords_list
            keyword_boost, # keyword_boost_val
            similarity_threshold, # similarity_thresh_val
            max_file_size, # max_fsize
            log_level.upper() # log_level_str
        )
        for fp in discovered_files_list
    ]

    processed_results: List[Dict[str, Any]] = []
    # The TF-IDF vectorizer and prompt vector are global.
    # On POSIX, fork will make them available. On Windows, this can be an issue.
    # Scikit-learn objects are generally picklable, so they *could* be passed,
    # but that adds complexity to the worker function signature and pickling overhead.
    # Current setup relies on fork or that Python's default pickling handles it sufficiently.

    if progress:
        with Pool(processes=actual_num_workers) as pool:
            results_iterator = pool.starmap(process_file_task_worker, tasks_for_pool)
            for result in tqdm(results_iterator, total=len(tasks_for_pool), desc="Processing files", unit="file"):
                if result:
                    processed_results.append(result)
    else: # No progress bar
        with Pool(processes=actual_num_workers) as pool:
            raw_mp_results = pool.starmap(process_file_task_worker, tasks_for_pool)
        processed_results = [res for res in raw_mp_results if res] # Filter out None results

    if not processed_results:
        logger.warning("No files met the relevance criteria after NLP processing.")
        typer.echo("No files were found to be relevant enough to your prompt after analysis.")
        raise typer.Exit(code=0)

    # Aggregation & Ranking
    processed_results.sort(key=lambda x: x["relevance_score"], reverse=True)
    for i, result in enumerate(processed_results):
        result["rank"] = i + 1
    logger.info(f"Aggregated {len(processed_results)} relevant files.")

    # JSON Output
    try:
        with output_json.open('w', encoding='utf-8') as f:
            json.dump(processed_results, f, indent=2, ensure_ascii=False)
        logger.info(f"Structured JSON output saved to: {output_json}")
        typer.echo(f"JSON output saved to: {output_json}")
    except IOError as e:
        logger.error(f"Error writing JSON output to {output_json}: {e}")
        typer.echo(f"Error: Could not write JSON output to {output_json}.", err=True)

    # Flattened Text Output
    flat_text_content = format_results_to_flat_text(
        processed_results, max_flat_tokens, FLATTENED_FILE_HEADER_TEMPLATE
    )
    try:
        with output_flat.open('w', encoding='utf-8') as f:
            f.write(flat_text_content)
        logger.info(f"Flattened text output saved to: {output_flat}")
        typer.echo(f"Flattened text output saved to: {output_flat}")
    except IOError as e:
        logger.error(f"Error writing flattened text output to {output_flat}: {e}")
        typer.echo(f"Error: Could not write flattened text output to {output_flat}.", err=True)

    end_time = time.time()
    logger.info(f"Confluence process finished in {end_time - start_time:.2f} seconds.")
    typer.echo(f"Processing complete in {end_time - start_time:.2f} seconds. Found {len(processed_results)} relevant files.")

if __name__ == "__main__":
    # For multiprocessing, especially on Windows when freezing with PyInstaller or similar.
    # It ensures that child processes re-importing the script don't re-execute app().
    # from multiprocessing import freeze_support
    # freeze_support() # Uncomment if you plan to freeze this script
    app()