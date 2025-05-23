#!/usr/bin/env python3
# ConfluenceV2 - Intelligent Project Context Aggregator for LLMs

import os
import logging
import time
from datetime import datetime
from pathlib import Path
import json
from multiprocessing import Pool, cpu_count
from typing import Optional, List, Generator, Any, Dict, Tuple, Set
import re
import io
import tokenize as py_tokenize # For advanced Python comment stripping

# --- Application Constants ---
APP_NAME = "ConfluenceV2"
VERSION = "2.0.1" # Incremented version for changes

# --- Third-party Library Imports & Availability Check ---
# Attempt to import third-party libraries and set availability flags.
# This allows the script to function in a degraded mode or warn the user
# if optional heavy dependencies (like sentence-transformers) are missing.

try:
    import typer
    from tqdm import tqdm
    import yake
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    import chardet
except ImportError as e:
    print(f"CRITICAL ERROR: Missing one or more core libraries: {e}.")
    print("Please install them by running:")
    print("pip install typer tqdm yake scikit-learn chardet")
    exit(1)

SENTENCE_TRANSFORMERS_AVAILABLE = False
SentenceTransformer = None # Placeholder for type hinting if not available
try:
    from sentence_transformers import SentenceTransformer # type: ignore
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    # This is an optional dependency, a warning will be issued if 'accurate' mode is selected.
    pass

# --- Default Configuration Values ---
# These constants define the default behavior of the script and can be overridden by CLI arguments.

# Output Files
DEFAULT_OUTPUT_JSON: str = "confluence_v2_project_analysis.json"
DEFAULT_OUTPUT_FLAT: str = "confluence_v2_llm_prompt.txt"

# Processing & Filtering
DEFAULT_PRESET_NAME: str = "project_wide" # Default set of files to consider
DEFAULT_PROCESSING_MODE: str = "accurate" # 'accurate' (semantic) or 'fast' (TF-IDF)
DEFAULT_SIMILARITY_THRESHOLD: float = 0.05 # Min relevance score for content inclusion
DEFAULT_KEYWORD_BOOST: float = 1.5 # Multiplier for keyword score contribution
DEFAULT_MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5 MB, max size of a single file to process
DEFAULT_MAX_FLAT_TOKENS: int = 150000 # Approx. max words for the final LLM context
DEFAULT_MINIFY_WHITESPACE: bool = True # Reduce excessive whitespace in content
DEFAULT_STRIP_COMMENTS: bool = False # Attempt to strip comments from code

# LLM Template & Task
DEFAULT_LLM_TASK_DESCRIPTION: str = (
    "Analyze the provided software project context. Be prepared to answer questions, "
    "explain code, suggest improvements, or perform coding tasks based on this context "
    "and further instructions."
)
DEFAULT_GENERATE_LLM_TEMPLATE: bool = True # Wrap output in a system prompt for LLMs

# NLP Specifics
DEFAULT_SEMANTIC_MODEL_NAME: str = "all-MiniLM-L6-v2" # For 'accurate' mode
YAKE_LANGUAGE: str = "en"
YAKE_MAX_NGRAM_SIZE: int = 3
YAKE_NUM_KEYWORDS: int = 10

# UI & Logging
DEFAULT_LOG_LEVEL: str = "INFO"
DEFAULT_PROGRESS_BAR: bool = True
VALID_LOG_LEVELS: Set[str] = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}

# Multiprocessing
DEFAULT_NUM_WORKERS: int = 0 # 0 means use os.cpu_count()

# Output Formatting
SNIPPET_MAX_LINES: int = 8
SNIPPET_MAX_CHARS_PER_LINE: int = 100
MANIFEST_INCLUDED_LIMIT: int = 30 # Max files to list in summary manifest (included)
MANIFEST_SKIPPED_LIMIT: int = 20  # Max files to list in summary manifest (skipped)
FLATTENED_FILE_HEADER_TEMPLATE: str = (
    "--- FILE: {relative_path} (Language: {language}) "
    "(Relevance: {relevance_score:.3f}) (Size: {size_kb:.1f}KB) ---"
)

# --- File Handling Definitions (Ignored Dirs, Extensions, Language Maps) ---
DEFAULT_IGNORE_DIRS: Set[str] = {
    ".git", "__pycache__", "node_modules", "venv", ".venv", "target", "build",
    "dist", ".vscode", ".idea", "logs", "temp", "tmp", ".DS_Store", "Thumbs.db",
    "site-packages", "env", "docs_build", "_build", "htmlcov", ".tox", ".mypy_cache",
    ".pytest_cache", ".hypothesis", "*.egg-info", "dist-info", "coverage"
}

GENERAL_EXCLUDE_EXTENSIONS: Set[str] = {
    # Executables & Libraries
    ".exe", ".dll", ".so", ".o", ".a", ".lib", ".jar", ".war", ".class", ".pyc", ".pyo", ".wasm",
    # Archives
    ".zip", ".tar", ".gz", ".bz2", ".rar", ".7z", ".tgz", ".whl", ".egg", ".pkg", ".deb", ".rpm",
    # Images
    ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".ico", ".webp", ".svg", # SVG can be text but often complex/large
    # Audio/Video
    ".mp3", ".wav", ".ogg", ".mp4", ".avi", ".mov", ".mkv", ".flv", ".webm",
    # Documents (often binary or complex structure not ideal for raw LLM context)
    ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".odt", ".ods", ".odp", ".epub",
    # Databases & Data Dumps
    ".db", ".sqlite", ".mdb", ".accdb", ".dat", ".idx", ".dump", ".bak",
    # Design files
    ".psd", ".ai",
    # Temporary & Lock files
    ".tmp", ".temp", ".swp", ".swo", ".lock",
    # Fonts
    ".woff", ".woff2", ".ttf", ".otf", ".eot",
    # Source Maps (often large and not primary source material)
    ".map",
}
# Specific log files can be noisy; users can include them via --include-ext if needed.
DEFAULT_IGNORE_EXTENSIONS_OVERRIDE_FOR_PRESETS: Set[str] = {".log"}

# Mapping extensions to human-readable language names
LANGUAGE_MAP: Dict[str, str] = {
    ".py": "Python", ".js": "JavaScript", ".ts": "TypeScript", ".jsx": "JSX", ".tsx": "TSX",
    ".java": "Java", ".c": "C", ".cpp": "C++", ".h": "C/C++ Header", ".hpp": "C++ Header",
    ".cs": "C#", ".go": "Go", ".rs": "Rust", ".swift": "Swift", ".kt": "Kotlin", ".kts": "Kotlin Script",
    ".scala": "Scala", ".rb": "Ruby", ".pl": "Perl", ".sh": "Shell Script", ".bash": "Bash Script", ".zsh": "Zsh Script",
    ".ps1": "PowerShell", ".php": "PHP", ".groovy": "Groovy", ".dart": "Dart", ".lua": "Lua",
    ".r": "R", ".m": "Objective-C/MATLAB", ".sql": "SQL", ".html": "HTML", ".htm": "HTML",
    ".css": "CSS", ".scss": "SCSS", ".sass": "SASS", ".less": "LESS",
    ".json": "JSON", ".yaml": "YAML", ".yml": "YAML", ".xml": "XML", ".toml": "TOML", ".ini": "INI",
    ".cfg": "Config", ".conf": "Config", ".properties": "Properties", ".env": "Environment Variables",
    ".md": "Markdown", ".txt": "Text", ".rst": "reStructuredText", ".tex": "LaTeX",
    ".adoc": "AsciiDoc", ".org": "Org Mode", ".asciidoc": "AsciiDoc", ".rtf": "RTF", ".csv": "CSV",
    ".tf": "Terraform HCL", ".hcl": "HCL", "tfvars": "Terraform Vars",
    ".gradle": "Gradle", "pom.xml": "Maven POM", "build.sbt": "SBT Build", # Note: pom.xml, build.sbt are also in FILENAME_LANGUAGE_MAP
    ".ipynb": "Jupyter Notebook", ".http": "HTTP Request File", ".rest": "REST Client File",
    ".patch": "Patch File", ".diff": "Diff File", ".gitattributes": "Git Attributes", ".gitignore": "Git Ignore",
    ".npmrc": "NPM Config", ".yarnrc": "Yarn Config", ".editorconfig": "EditorConfig"
}
# Mapping specific filenames (often without extensions or with common ones) to languages
FILENAME_LANGUAGE_MAP: Dict[str, str] = {
    "dockerfile": "Dockerfile", "makefile": "Makefile", "gradlew": "Gradle Wrapper Script",
    "pom.xml": "Maven POM", "build.sbt": "SBT Build", "gemfile": "Ruby Gemfile", "gemspec": "Ruby Gemspec",
    "rakefile": "Ruby Rakefile", "requirements.txt": "Python Requirements", "pipfile": "Python Pipfile",
    "pyproject.toml": "Python Pyproject", "package.json": "NPM Package", "angular.json": "Angular Config",
    "tsconfig.json": "TypeScript Config", "babel.config.json": "Babel Config", "webpack.config.js": "Webpack Config",
    ".bashrc": "Bash Config", ".zshrc": "Zsh Config", ".profile": "Shell Profile", "nginx.conf": "Nginx Config",
    "httpd.conf": "Apache Config", "vimrc": "Vim Config", ".tmux.conf": "Tmux Config"
}

# Default sets of file extensions and specific filenames for different project types
DEFAULT_PRESETS: Dict[str, Set[str]] = {
    "project_wide": { # Comprehensive set for typical software projects
        # Code
        ".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".c", ".cpp", ".h", ".hpp",
        ".cs", ".go", ".rs", ".swift", ".kt", ".kts", ".scala", ".rb", ".pl",
        ".sh", ".bash", ".zsh", ".ps1", ".php", ".groovy", ".dart", ".lua", ".sql",
        # Web & Markup
        ".html", ".htm", ".css", ".scss", ".sass", ".less",
        # Config & Data
        ".json", ".yaml", ".yml", ".xml", ".toml", ".ini", ".cfg", ".conf", ".properties", ".env",
        # Docs
        ".md", ".txt", ".rst", ".tex", ".adoc", ".org",
        # Build, Infra & Project Files (extensions)
        ".tf", ".hcl", "tfvars", ".gradle", ".ipynb", ".http", ".rest", ".patch", ".diff",
        ".gitattributes", ".gitignore", ".npmrc", ".yarnrc", ".editorconfig",
        # Common project files (lowercase full filenames)
        "dockerfile", "makefile", "requirements.txt", "pipfile", "pyproject.toml",
        "package.json", "gemfile", "rakefile", "pom.xml", "build.sbt",
        "angular.json", "tsconfig.json", "babel.config.json", "webpack.config.js",
    },
    "code_only": {
        ".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".c", ".cpp", ".h", ".hpp",
        ".cs", ".go", ".rs", ".swift", ".kt", ".kts", ".scala", ".rb", ".pl",
        ".sh", ".bash", ".zsh", ".ps1", ".php", ".groovy", ".dart", ".lua", ".sql"
    },
    "docs_only": {".md", ".txt", ".rst", ".tex", ".adoc", ".org", ".asciidoc", ".html"}, # HTML can be docs
    "data_config": {".json", ".yaml", ".yml", ".xml", ".toml", ".ini", ".cfg", ".conf", ".properties", ".env", ".csv"},
    "all_matching_text": set() # Special preset: includes any file not in GENERAL_EXCLUDE_EXTENSIONS
}

# --- LLM System Prompt Template ---
# This template is used when --generate-llm-template is active.
# It provides structure and instructions to the LLM on how to use the provided context.
LLM_SYSTEM_PROMPT_TEMPLATE: str = """
You are ConfluenceAI (v{app_version}), an expert AI Pair Programmer. Your primary function is to assist with software development tasks by deeply understanding the provided project context and generating high-quality, well-documented, and robust code.

**Objective:**
{user_llm_task}

**Project Context Provided by {app_name} Script:**
The following sections contain a structured dump of files and summaries from a software project. This context was prepared to help you address the objective above. It includes:
1.  An overall summary/manifest of discovered, included, and potentially skipped files.
2.  The processed content of relevant files. Content may be minified (e.g., whitespace reduced, comments possibly stripped) to optimize for token limits. Files are demarcated by "--- FILE: [path] (Language: LLL) (Relevance: X.XX) (Size: Y.YYKB) ---".
3.  Indicators like "[CONTENT TRUNCATED DUE TO TOKEN LIMITS]" or "[FILE SKIPPED - REASON]" may appear in the manifest or content.

{project_context_summary_block}

--- START OF AGGREGATED FILE CONTENTS ---

{aggregated_file_content_block}

--- END OF AGGREGATED FILE CONTENTS ---

**Core Directives for Your Operation:**

1.  **Code Quality & Standards:**
    * **Cleanliness & Robustness:** All code you generate must be clean, efficient, robust, and adhere to idiomatic best practices for the identified language(s) in the context.
    * **Documentation:** Provide thorough docstrings (e.g., Google-style for Python, Javadoc for Java, TSDoc for TypeScript) for all functions, classes, and methods.
    * **Type Hinting:** Utilize static type hints extensively where the language supports them.
    * **Comments:** Include concise comments to explain complex logic, assumptions, or non-obvious decisions. Avoid redundant comments.
    * **Error Handling:** Implement appropriate error handling, validation, and logging where necessary.

2.  **Contextual Understanding & Utilization:**
    * Thoroughly analyze all provided file contents, metadata (like relevance scores if applicable, language, size), and the initial manifest.
    * Synthesize information across multiple files to understand the overall architecture, dependencies, data structures, and existing coding patterns.
    * If a `search_prompt` was used to generate this context (indicated in the summary), pay close attention to the relevance scores.

3.  **Addressing Missing Information & Limitations (Crucial):**
    * The provided context, while extensive, might not be exhaustive or could have skipped files (check the manifest and "SKIPPED" indicators).
    * If, after reviewing the context, you determine that critical information or specific files are missing to accurately and robustly complete the stated **Objective**, **you MUST explicitly state what is missing and ask me (the user) to provide it.**
    * Examples of how to ask:
        * "To implement the user profile update logic, I need to see the schema definition, which seems to be in `models/user_profile.py` but wasn't included. Could you provide its content?"
        * "The error log mentions `PaymentGatewayService`, but this service's definition is not in the context. Can you provide the file defining it or describe its interface?"
    * **Do not invent or hallucinate critical missing code, configurations, or APIs.** Prioritize asking for clarification or missing pieces. Be specific about what you need and why.

4.  **Interactive Collaboration & Output:**
    * If the **Objective** is ambiguous, ask clarifying questions before generating extensive code.
    * For complex tasks, you may propose a high-level plan or a series of steps.
    * Clearly demarcate all code blocks using triple backticks, specifying the language (e.g., ```python ... ```).
    * Provide explanations before or after code blocks as needed to clarify your solution.
    * If you are providing multiple file changes, clearly indicate the filename for each code block.

Begin by confirming you understand the **Objective** and the provided context structure. Then, proceed with the task, keeping these directives in mind.
"""

# --- Global Variables ---
# These are initialized in main_cli or utility functions.
# Global logger instance.
logger: Optional[logging.Logger] = None

# NLP models/vectors - global for access by multiprocessing workers (on POSIX via fork).
tfidf_vectorizer_global: Optional[TfidfVectorizer] = None
prompt_tfidf_vector_global: Optional[Any] = None # Stores the TF-IDF vector of the search prompt.

semantic_model_global: Optional[SentenceTransformer] = None # Stores the loaded Sentence Transformer model.
prompt_semantic_embedding_global: Optional[Any] = None # Stores the embedding of the search prompt.


# --- Utility Functions ---

def get_cpu_count_safe() -> int:
    """Safely gets CPU count, defaulting to 1 if undetermined."""
    return os.cpu_count() or 1

def approximate_word_count(text: str) -> int:
    """Approximates word count by splitting the text by whitespace."""
    return len(text.split())

def setup_global_logger(level: str = "INFO") -> logging.Logger:
    """
    Configures and returns the global logger instance.
    Clears existing handlers to prevent duplicate logs if called multiple times.
    """
    global logger
    logger = logging.getLogger(APP_NAME)
    logger.setLevel(level.upper())

    if logger.hasHandlers():
        logger.handlers.clear()

    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        f'%(asctime)s - %(process)d - {APP_NAME} - %(levelname)s - %(message)s'
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger

def get_language_from_path(file_path: Path) -> str:
    """
    Determines the programming/markup language of a file based on its name and extension.
    Uses FILENAME_LANGUAGE_MAP first, then LANGUAGE_MAP.
    """
    name_lower = file_path.name.lower()
    if name_lower in FILENAME_LANGUAGE_MAP:
        return FILENAME_LANGUAGE_MAP[name_lower]
    ext = file_path.suffix.lower()
    return LANGUAGE_MAP.get(ext, "Unknown")

def minify_whitespace_content(text: str) -> str:
    """
    Reduces excessive whitespace from text content.
    - Strips trailing whitespace from lines.
    - Compacts multiple blank lines into a single blank line.
    - Removes leading/trailing blank lines from the whole content.
    """
    if not text: return ""
    lines = [line.rstrip() for line in text.splitlines()]
    compacted_lines: List[str] = []
    previous_line_blank = False
    for line in lines:
        is_blank = not line.strip()
        if is_blank:
            if not previous_line_blank: # Add a blank line only if the previous wasn't blank
                compacted_lines.append("")
            previous_line_blank = True
        else:
            compacted_lines.append(line)
            previous_line_blank = False

    # Remove leading blank lines from the result
    while compacted_lines and not compacted_lines[0].strip():
        compacted_lines.pop(0)
    # Remove trailing blank lines from the result
    while compacted_lines and not compacted_lines[-1].strip():
        compacted_lines.pop()

    return "\n".join(compacted_lines)

def strip_python_comments_and_docstrings(code: str) -> str:
    """
    Strips comments and attempts to strip docstrings from Python code.
    Uses Python's `tokenize` module for more accurate comment handling.
    Docstring removal is heuristic: it identifies multi-line strings that appear
    at the beginning of a module, class, or function definition. This might
    incorrectly remove multi-line strings used as values in those positions.
    A full AST parse would be more robust but adds complexity.
    """
    if not code.strip(): return ""
    io_obj = io.StringIO()
    prev_tok_type = py_tokenize.INDENT # Initialize to a type that allows first string to be docstring
    last_lineno = -1
    last_col = 0
    tokens_to_process = []
    try:
        # First pass to identify potential docstrings
        # A string is a docstring if it's the first non-comment, non-whitespace token
        # after INDENT, DEDENT, NEWLINE, NL, or a colon (e.g., after 'def foo():')
        # This is still heuristic.
        g = py_tokenize.generate_tokens(io.StringIO(code).readline)
        for tok in g:
            tokens_to_process.append(tok)

        is_potential_docstring_context = True # Start of module
        for i, tok_info in enumerate(tokens_to_process):
            tok_type = tok_info[0]
            tok_string = tok_info[1]

            if tok_type == py_tokenize.COMMENT:
                continue # Skip comments entirely

            if tok_type == py_tokenize.STRING and is_potential_docstring_context:
                if tok_string.startswith('"""') or tok_string.startswith("'''"):
                    # It's a multi-line string in a docstring position, skip it
                    is_potential_docstring_context = False # Next string on same level isn't docstring
                    continue # Skip this token

            # If it's not a comment or a docstring identified above, write it
            # Spacing logic from the original script (can be refined for perfect reconstruction)
            start_line, start_col = tok_info[2]
            end_line, end_col = tok_info[3]
            if start_line > last_lineno:
                last_col = 0
            spacing = ""
            if start_col > last_col:
                spacing = tok_info.line[last_col:start_col] if tok_info.line else " " * (start_col - last_col)
            
            io_obj.write(spacing + tok_string)
            last_lineno = end_line
            last_col = end_col

            # Update context for next token
            if tok_type in (py_tokenize.INDENT, py_tokenize.DEDENT, py_tokenize.NEWLINE, py_tokenize.NL) or \
               (tok_type == py_tokenize.OP and tok_string == ':'):
                is_potential_docstring_context = True
            elif tok_type not in (py_tokenize.NL, py_tokenize.NEWLINE, py_tokenize.INDENT, py_tokenize.DEDENT, py_tokenize.COMMENT, py_tokenize.ENCODING):
                # Any other significant token means the next string isn't a docstring at this level
                is_potential_docstring_context = False
            
            if tok_type in (py_tokenize.NEWLINE, py_tokenize.NL):
                last_col = 0


    except (py_tokenize.TokenError, IndentationError) as e:
        # Fallback for tokenization or indentation errors (e.g., in incomplete/malformed code)
        if logger:
            logger.debug(f"Python tokenize error during stripping for code snippet starting with "
                         f"'{code[:100].splitlines()[0] if code else ''}...': {e}. Returning original snippet.")
        return code # Return original code on error
    
    return io_obj.getvalue()


def strip_generic_comments(code: str, language: str) -> str:
    """
    Strips common comment types from code based on the language.
    - Line comments (e.g., //, #)
    - Block comments (e.g., /* ... */)
    This is regex-based and simpler than Python-specific stripping.
    """
    if not code: return ""
    
    # Regex for common line and block comments
    if language in ["JavaScript", "TypeScript", "Java", "C", "C++", "C#", "Go", "Rust", "Swift", "Kotlin", "Scala", "PHP", "CSS", "JSX", "TSX"]:
        # Remove // comments, preserving the newline if the comment was on its own line or adding one if it was inline.
        code = re.sub(r"//.*?(\n|$)", "\n", code)
        # Remove /* ... */ block comments
        code = re.sub(r"/\*.*?\*/", "", code, flags=re.DOTALL)
    elif language in ["Python", "Ruby", "Perl", "Shell Script", "Bash Script", "Zsh Script", "YAML", "R", "Makefile", "Properties", "INI", "Config", "Dockerfile", "Git Ignore", "EditorConfig", "Python Requirements"]:
        # Remove # comments, preserving the newline similarly.
        code = re.sub(r"#.*?(\n|$)", "\n", code)
    elif language in ["HTML", "XML", "Maven POM"]:
        # Remove comments
        code = re.sub(r"", "", code, flags=re.DOTALL)
    
    # Clean up lines that became entirely empty after comment removal,
    # but try to preserve single blank lines that might separate code blocks.
    lines = code.splitlines()
    cleaned_lines: List[str] = []
    for i, line in enumerate(lines):
        if line.strip(): # Keep lines with content
            cleaned_lines.append(line)
        elif i > 0 and lines[i-1].strip() and (i < len(lines) - 1 and lines[i+1].strip()):
            # Keep a blank line if it's between two non-blank lines (original intent)
            cleaned_lines.append("")
    return "\n".join(cleaned_lines)


def process_content_for_llm(content: str, language: str, minify_ws: bool, strip_com: bool) -> str:
    """
    Applies selected processing steps (comment stripping, whitespace minification) to content.
    """
    processed_content = content
    if strip_com:
        if language == "Python":
            processed_content = strip_python_comments_and_docstrings(processed_content)
        else:
            processed_content = strip_generic_comments(processed_content, language)
    
    if minify_ws:
        # Apply whitespace minification after comment stripping, as stripping can create new whitespace patterns.
        processed_content = minify_whitespace_content(processed_content)
            
    return processed_content.strip() # Final strip of leading/trailing whitespace from the whole content

def get_file_metadata(file_path: Path, search_root: Path) -> Dict[str, Any]:
    """
    Extracts metadata for a given file path.
    Includes path details, size, modification date, and detected language.
    """
    f_logger = logger or logging.getLogger(f"{APP_NAME}.Metadata") # Fallback logger
    try:
        stat = file_path.stat()
        language = get_language_from_path(file_path)
        return {
            "file_path": str(file_path.resolve()),
            "relative_path": str(file_path.relative_to(search_root)),
            "file_name": file_path.name,
            "extension": file_path.suffix.lower(),
            "language": language,
            "size_bytes": stat.st_size,
            "last_modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
        }
    except Exception as e:
        f_logger.debug(f"Could not get full metadata for {file_path}: {e}")
        # Return partial metadata even on error
        return {
            "file_path": str(file_path.resolve()),
            "relative_path": str(file_path.relative_to(search_root) if search_root and search_root in file_path.parents else file_path.name),
            "file_name": file_path.name,
            "extension": file_path.suffix.lower(),
            "language": get_language_from_path(file_path), # Attempt language detection
            "size_bytes": -1, # Indicate error or unknown size
            "last_modified": datetime.fromtimestamp(0).isoformat(), # Default timestamp
        }

def read_file_content_robust(file_path: Path, max_file_size: int) -> Tuple[Optional[str], str]:
    """
    Reads file content with robustness for size and encoding.
    Returns (content_string|None, status_message).
    Status messages: "ok", "skipped_size", "skipped_empty", "skipped_decode_error", "skipped_read_error"
    """
    f_logger = logger or logging.getLogger(f"{APP_NAME}.ReadFile")
    try:
        file_size = file_path.stat().st_size
        if file_size > max_file_size:
            f_logger.debug(f"Skipping large file: {file_path} (size {file_size} > {max_file_size} bytes)")
            return None, "skipped_size"
        if file_size == 0:
            f_logger.debug(f"Skipping empty file: {file_path}")
            return "", "processed_empty" # Empty content is valid

        with open(file_path, 'rb') as f_binary:
            raw_data = f_binary.read()

        detected_encoding = chardet.detect(raw_data)['encoding']

        if detected_encoding:
            try:
                return raw_data.decode(detected_encoding), "ok_detected_encoding"
            except (UnicodeDecodeError, TypeError) as e_dec:
                f_logger.warning(f"Could not decode {file_path} with detected encoding '{detected_encoding}': {e_dec}. Trying UTF-8.")
                # Fall through to UTF-8 and other fallbacks
        
        # Try common encodings if chardet fails or its result fails
        for enc_try_name, enc_try_val in [("UTF-8", "utf-8"), ("Latin-1", "latin-1"), ("ASCII", "ascii")]:
            try:
                return raw_data.decode(enc_try_val), f"ok_fallback_{enc_try_name}"
            except UnicodeDecodeError:
                f_logger.debug(f"Failed to decode {file_path} with {enc_try_name}.")
                continue
        
        f_logger.error(f"Could not decode {file_path} with any common fallback encodings. Skipping.")
        return None, "skipped_decode_error"

    except FileNotFoundError:
        f_logger.error(f"File not found during read: {file_path}")
        return None, "skipped_read_error_not_found"
    except PermissionError:
        f_logger.warning(f"Permission denied reading file: {file_path}")
        return None, "skipped_read_error_permission"
    except Exception as e:
        f_logger.error(f"Unexpected error reading file {file_path}: {e}")
        return None, "skipped_read_error_generic"


def get_processed_file_data(
    file_path: Path,
    search_root: Path,
    max_f_size: int,
    minify_ws_flag: bool,
    strip_com_flag: bool
) -> Tuple[Optional[str], Dict[str, Any], str]:
    """
    Orchestrates metadata extraction, file reading, and content processing for a single file.
    Returns (processed_content|None, metadata_dict, overall_status_string).
    """
    f_logger = logger or logging.getLogger(f"{APP_NAME}.GetProcData")
    metadata = get_file_metadata(file_path, search_root)
    processing_status = "initial" # Will be updated based on outcomes

    if metadata["size_bytes"] != -1 and metadata["size_bytes"] > max_f_size: # Check size from reliable metadata
        processing_status = f"skipped_size_limit"
        metadata["processing_status_detail"] = f"File size {metadata['size_bytes']} > max {max_f_size}"
        return None, metadata, processing_status
    
    # If size_bytes is -1 (error in stat), read_file_content_robust will re-check if it can.

    raw_content, read_status = read_file_content_robust(file_path, max_f_size)

    if raw_content is None: # File skipped during read (size, empty, decode, other read error)
        processing_status = read_status # e.g. "skipped_size", "skipped_decode_error"
        metadata["processing_status_detail"] = f"Read failure: {read_status}"
        return None, metadata, processing_status
    
    if read_status == "processed_empty":
        processing_status = "processed_empty"
        metadata["processing_status_detail"] = "File is empty."
        # Add char counts for consistency, though they are zero
        metadata["original_char_count"] = 0
        metadata["processed_char_count"] = 0
        metadata["approx_original_word_count"] = 0
        metadata["approx_processed_word_count"] = 0
        return raw_content, metadata, processing_status # Return empty string as content

    # Content was successfully read
    lang_for_processing = metadata.get("language", "Unknown")
    try:
        processed_content_str = process_content_for_llm(raw_content, lang_for_processing, minify_ws_flag, strip_com_flag)
        processing_status = "processed_content_ok"
    except Exception as e_proc:
        f_logger.warning(f"Error during LLM content processing for {file_path} (lang: {lang_for_processing}): {e_proc}. Using raw content.")
        processed_content_str = raw_content # Fallback to raw content if processing fails
        processing_status = "processed_content_fallback_raw"

    metadata["original_char_count"] = len(raw_content)
    metadata["processed_char_count"] = len(processed_content_str)
    metadata["approx_original_word_count"] = approximate_word_count(raw_content)
    metadata["approx_processed_word_count"] = approximate_word_count(processed_content_str)
    
    return processed_content_str, metadata, processing_status


# --- NLP Functions ---

def initialize_nlp_resources(mode: str, search_prompt_content: Optional[str]):
    """
    Initializes global NLP resources (TF-IDF vectorizer, Sentence Transformer model)
    based on the processing mode and search prompt.
    These resources are stored in global variables for access by worker processes.
    """
    global tfidf_vectorizer_global, prompt_tfidf_vector_global
    global semantic_model_global, prompt_semantic_embedding_global
    nlp_logger = logger or logging.getLogger(f"{APP_NAME}.NLPInit")

    if search_prompt_content: # TF-IDF is always initialized if there's a prompt (for keywords/fast mode)
        nlp_logger.debug(f"Initializing TF-IDF vectorizer for search prompt.")
        tfidf_vectorizer_global = TfidfVectorizer(
            stop_words='english',
            lowercase=True,
            norm='l2',
            token_pattern=r"(?u)\b\w\w+\b" # Standard token pattern
        )
        try:
            prompt_tfidf_vector_global = tfidf_vectorizer_global.fit_transform([search_prompt_content])
            nlp_logger.debug("Search prompt TF-IDF vector successfully initialized.")
        except Exception as e:
            nlp_logger.error(f"Failed to initialize search prompt TF-IDF vector: {e}")
            prompt_tfidf_vector_global = None # Ensure it's None on failure

    if mode == "accurate":
        if not SENTENCE_TRANSFORMERS_AVAILABLE:
            msg = ("Sentence Transformers library not found, which is required for 'accurate' mode. "
                   "Please install it ('pip install sentence-transformers') or use '--mode fast'.")
            nlp_logger.error(msg)
            # Critical if no prompt to fall back on TF-IDF scoring, or if accurate mode explicitly chosen.
            # The main CLI function will also check this and exit if 'accurate' is chosen without the lib.
            return # Cannot proceed with semantic model initialization

        nlp_logger.info(f"Loading semantic model '{DEFAULT_SEMANTIC_MODEL_NAME}' for 'accurate' mode. This may take time...")
        try:
            semantic_model_global = SentenceTransformer(DEFAULT_SEMANTIC_MODEL_NAME)
            nlp_logger.info(f"Semantic model '{DEFAULT_SEMANTIC_MODEL_NAME}' loaded successfully.")
            if search_prompt_content:
                nlp_logger.debug("Generating semantic embedding for the search prompt.")
                # Models typically handle tokenization and batching internally.
                prompt_semantic_embedding_global = semantic_model_global.encode([search_prompt_content], show_progress_bar=False)[0]
                nlp_logger.debug("Search prompt semantic embedding generated.")
        except Exception as e:
            nlp_logger.error(f"Failed to load semantic model or generate prompt embedding: {e}. "
                             "'accurate' mode prompt similarity may not function correctly.")
            semantic_model_global = None # Ensure it's None on failure
            prompt_semantic_embedding_global = None


def extract_search_prompt_keywords(search_prompt_content: str) -> List[str]:
    """
    Extracts keywords from the search prompt using YAKE (Yet Another Keyword Extractor).
    Falls back to simple word extraction if YAKE fails.
    """
    kw_logger = logger or logging.getLogger(f"{APP_NAME}.Keywords")
    if not search_prompt_content.strip():
        return []
    
    try:
        kw_extractor = yake.KeywordExtractor(
            lan=YAKE_LANGUAGE,
            n=YAKE_MAX_NGRAM_SIZE,
            dedupLim=0.9, # Deduplication threshold
            top=YAKE_NUM_KEYWORDS,
            features=None # Use default YAKE features
        )
        keywords_with_scores = kw_extractor.extract_keywords(search_prompt_content)
        extracted_keywords = [kw for kw, score in keywords_with_scores]
        kw_logger.debug(f"Extracted YAKE keywords: {extracted_keywords}")
        return extracted_keywords
    except Exception as e:
        kw_logger.error(f"YAKE keyword extraction failed: {e}. Falling back to simple word extraction.")
        # Fallback: extract unique words from the prompt, limit to YAKE_NUM_KEYWORDS
        words = list(dict.fromkeys(re.findall(r'\b\w{3,}\b', search_prompt_content.lower()))) # min 3 char words
        return words[:YAKE_NUM_KEYWORDS]


def calculate_tfidf_cosine_similarity(file_content: str) -> float:
    """Calculates TF-IDF cosine similarity between file content and the global prompt TF-IDF vector."""
    if prompt_tfidf_vector_global is None or tfidf_vectorizer_global is None or not file_content:
        return 0.0
    try:
        file_vector = tfidf_vectorizer_global.transform([file_content])
        similarity = cosine_similarity(prompt_tfidf_vector_global, file_vector)[0][0]
        return float(similarity)
    except Exception as e:
        if logger: logger.debug(f"TF-IDF similarity calculation error for content snippet "
                                f"'{file_content[:50].replace(os.linesep, ' ')}...': {e}")
        return 0.0

def calculate_semantic_similarity(file_content: str) -> float:
    """Calculates semantic similarity using the global Sentence Transformer model and prompt embedding."""
    if semantic_model_global is None or prompt_semantic_embedding_global is None or not file_content:
        return 0.0
    try:
        # Models often have max sequence lengths; they usually truncate longer inputs.
        # For very large files, chunking and averaging/max-pooling similarities would be more robust,
        # but for simplicity here, we encode the whole (potentially processed) content.
        content_embedding = semantic_model_global.encode([file_content], show_progress_bar=False)[0]
        # Reshape for cosine_similarity which expects 2D arrays
        similarity = cosine_similarity(
            prompt_semantic_embedding_global.reshape(1, -1),
            content_embedding.reshape(1, -1)
        )[0][0]
        return float(similarity)
    except Exception as e:
        if logger: logger.debug(f"Semantic similarity calculation error for content snippet "
                                f"'{file_content[:50].replace(os.linesep, ' ')}...': {e}")
        return 0.0

def calculate_keyword_score(file_content: str, keywords: List[str]) -> float:
    """
    Calculates a keyword matching score based on presence and frequency of keywords in content.
    Score combines distinct keyword coverage and normalized total frequency.
    """
    if not keywords or not file_content:
        return 0.0
    
    score: float = 0.0
    content_lower = file_content.lower()
    num_keywords_found: int = 0
    total_frequency: int = 0

    for kw in keywords:
        kw_lower = kw.lower() # Assuming keywords from YAKE might not be lowercase
        # Use word boundaries to match whole words
        matches = re.findall(r'\b' + re.escape(kw_lower) + r'\b', content_lower)
        if matches:
            num_keywords_found += 1
            total_frequency += len(matches)

    if not num_keywords_found:
        return 0.0
    
    # Score component for distinct keywords found (0.0 to 0.6)
    # This rewards finding more of the different keywords from the prompt.
    distinct_keyword_score_component = (num_keywords_found / len(keywords)) * 0.6

    # Score component for total frequency, normalized by content length (approx words)
    # This rewards higher density of keywords, but normalized to avoid unfairly
    # penalizing short documents or over-rewarding very long ones.
    # The scaling factor (e.g., 10) and max cap (0.4) are heuristic.
    content_words_approx = len(content_lower.split()) + 1 # Add 1 to avoid division by zero
    frequency_score_component = min((total_frequency / content_words_approx) * 10, 0.4)
    
    score = distinct_keyword_score_component + frequency_score_component
    return min(score, 1.0) # Ensure score is capped at 1.0


def calculate_relevance_scores_for_content(
    content: str,
    search_prompt_content: Optional[str], # The actual search prompt text
    search_prompt_keywords: List[str],   # Keywords derived from search_prompt_content
    processing_mode: str,                # 'fast' or 'accurate'
    keyword_boost_factor: float
) -> Tuple[float, float, float, str]:
    """
    Calculates combined relevance, primary similarity, and keyword scores for a file's content.
    Returns: (combined_score, primary_similarity_score, keyword_match_score, match_type_description)
    If no search_prompt_content is provided, scores default to neutral values,
    and match_type indicates no scoring was performed.
    """
    if not content:
        return 0.0, 0.0, 0.0, "no_content_to_score"

    keyword_sim_score = 0.0
    # Keyword scoring only makes sense if there were keywords derived from a search prompt
    if search_prompt_content and search_prompt_keywords:
        keyword_sim_score = calculate_keyword_score(content, search_prompt_keywords)

    primary_sim_score = 0.0
    similarity_method_label = "none" # e.g., "tfidf", "semantic"

    if search_prompt_content: # Primary similarity scoring only if there's a search prompt
        if processing_mode == "accurate" and semantic_model_global and prompt_semantic_embedding_global is not None:
            similarity_method_label = "semantic"
            primary_sim_score = calculate_semantic_similarity(content)
        elif tfidf_vectorizer_global and prompt_tfidf_vector_global is not None: # 'fast' mode or fallback
            similarity_method_label = "tfidf"
            primary_sim_score = calculate_tfidf_cosine_similarity(content)
        # If neither NLP model is available (e.g., init failed), primary_sim_score remains 0.0

    # Combine scores if a search prompt was used for scoring
    combined_score = 0.0
    final_match_type_description = "not_scored_no_search_prompt" # Default if no search_prompt

    if search_prompt_content:
        # Weighted average: (w1*s1 + w2*s2) / (w1+w2)
        # Here, w1=1 for primary_sim_score, w2=keyword_boost_factor for keyword_sim_score
        if primary_sim_score > 0.001 or keyword_sim_score > 0.001: # Only if at least one score is meaningful
            combined_score = (primary_sim_score + (keyword_sim_score * keyword_boost_factor)) / (1 + keyword_boost_factor)
        
        # Determine match type description for reporting/debugging
        # Thresholds for considering a score type as "contributing" to the match type label
        primary_sim_threshold_for_label = 0.02
        keyword_sim_threshold_for_label = 0.05

        has_significant_primary_sim = primary_sim_score >= primary_sim_threshold_for_label
        has_significant_keyword_sim = keyword_sim_score >= keyword_sim_threshold_for_label

        if has_significant_primary_sim and has_significant_keyword_sim:
            final_match_type_description = f"{similarity_method_label}_and_keyword"
        elif has_significant_keyword_sim:
            final_match_type_description = "keyword_dominant"
        elif has_significant_primary_sim:
            final_match_type_description = f"{similarity_method_label}_dominant"
        else:
            final_match_type_description = "low_scores_no_dominant_match_type"
            if combined_score == 0.0 : final_match_type_description = "no_discernible_match" # If truly zero
    else:
        # No search prompt, so no relevance scoring against a prompt.
        # Assign a neutral base score (e.g., 0.5) if these files need to be ordered
        # relative to scored files, or 0.0 if they are just "included by filter".
        # For simplicity, if no prompt, all scores related to prompt are 0.
        # Sorting will rely on path or other criteria if scores are all 0.
        combined_score = 0.0 # Or a fixed value like 0.5 if they need a "base" score
        primary_sim_score = 0.0
        keyword_sim_score = 0.0
        # match_type already set to "not_scored_no_search_prompt"

    return min(combined_score, 1.0), primary_sim_score, keyword_sim_score, final_match_type_description


def generate_snippet(content: str, keywords: Optional[List[str]] = None) -> str:
    """
    Generates a concise text snippet from content.
    If keywords are provided, it tries to find lines containing them.
    Otherwise, it takes the initial lines.
    Snippets are truncated by line count and character width per line.
    """
    if not content: return ""
    lines = content.splitlines()
    if not lines: return ""

    best_snippet_lines: List[str] = []
    if keywords:
        keyword_lines_indices: Set[int] = set()
        for kw in keywords:
            kw_lower = kw.lower()
            for i, line_content in enumerate(lines):
                if kw_lower in line_content.lower():
                    keyword_lines_indices.add(i)
        
        if keyword_lines_indices:
            # Attempt to get context around keyword lines
            contextual_indices: Set[int] = set()
            # Sort indices to build contiguous blocks where possible
            for idx in sorted(list(keyword_lines_indices)):
                # Define context window around the keyword line
                # SNIPPET_MAX_LINES // 4 gives 2 lines before, 2 lines after for an 8 line snippet
                start_context = max(0, idx - SNIPPET_MAX_LINES // 4)
                end_context = min(len(lines), idx + (SNIPPET_MAX_LINES // 4) + 1)
                for i_context in range(start_context, end_context):
                    contextual_indices.add(i_context)
                # If we have enough lines for a decent snippet (e.g., 2x max lines for buffer), break
                if len(contextual_indices) >= SNIPPET_MAX_LINES * 2:
                    break 
            
            # Select unique lines, keep original order as much as possible, limit to SNIPPET_MAX_LINES
            best_snippet_lines = [lines[i] for i in sorted(list(contextual_indices))[:SNIPPET_MAX_LINES]]

    if not best_snippet_lines: # Fallback if no keywords found or no keywords provided
        best_snippet_lines = lines[:SNIPPET_MAX_LINES]

    # Truncate long lines within the selected snippet lines
    truncated_snippet_lines: List[str] = []
    for line in best_snippet_lines:
        if len(line) > SNIPPET_MAX_CHARS_PER_LINE:
            truncated_snippet_lines.append(line[:SNIPPET_MAX_CHARS_PER_LINE-3] + "...")
        else:
            truncated_snippet_lines.append(line)
            
    return "\n".join(truncated_snippet_lines)


# --- FileProcessor Class ---

class FileProcessor:
    """
    Handles file discovery based on specified rules (presets, includes, excludes, ignored dirs).
    It identifies files that are candidates for further processing and relevance scoring.
    """
    def __init__(self, search_root: Path, cli_args: Dict[str, Any]):
        """
        Initializes the FileProcessor with search root and CLI arguments.
        Sets up rules for including/excluding files and directories.

        Args:
            search_root: The root directory Path object to start scanning from.
            cli_args: A dictionary of parsed CLI arguments relevant to file filtering.
        """
        self.search_root: Path = search_root
        self.args: Dict[str, Any] = cli_args # Store relevant CLI args
        self.current_logger = logger or logging.getLogger(f"{APP_NAME}.FileProcessor")

        # Store files skipped during the initial discovery walk for later reporting
        self.initial_skipped_files_info: List[Dict[str, Any]] = []
        
        # --- Determine effective file matching rules ---
        preset_name: str = cli_args.get("preset", DEFAULT_PRESET_NAME)
        include_items_str: Optional[str] = cli_args.get("include_ext") # Can be ext or filename
        exclude_ext_str: Optional[str] = cli_args.get("exclude_ext")
        cli_ignore_dirs_list: Optional[List[str]] = cli_args.get("ignore_dir")

        # 1. Determine active extension exclusions
        self.active_extension_exclusions: Set[str] = set(GENERAL_EXCLUDE_EXTENSIONS).union(DEFAULT_IGNORE_EXTENSIONS_OVERRIDE_FOR_PRESETS)
        if exclude_ext_str:
            additional_exclusions = {
                f".{ext.strip().lstrip('.')}" for ext in exclude_ext_str.split(',') if ext.strip() and ext.strip().startswith('.')
            }
            self.active_extension_exclusions.update(additional_exclusions)
            self.current_logger.debug(f"Added explicit exclude extensions: {additional_exclusions}")

        # 2. Determine target match items (extensions OR full filenames)
        self.target_match_items: Set[str] # Extensions start with '.', filenames don't (after lowercasing)
        self.match_mode_is_explicit_include: bool = False

        if include_items_str:
            # Explicit includes override presets. Items can be ".ext" or "filename"
            self.target_match_items = {item.strip().lower() for item in include_items_str.split(',') if item.strip()}
            self.match_mode_is_explicit_include = True
            self.current_logger.info(f"Using explicit include items (extensions/filenames): {self.target_match_items}")
        else:
            # Use preset logic
            preset_defined_items = DEFAULT_PRESETS.get(preset_name, set())
            if preset_name == "all_matching_text":
                # Special meaning: match any file not in active_extension_exclusions
                self.target_match_items = set() # Empty set signifies this mode for _is_file_match_rules
                self.current_logger.info(f"'all_matching_text' preset: will include files not generally excluded by extension.")
            else:
                # Filter preset items:
                # - An item is an extension if it starts with '.'
                # - An item is a filename otherwise (e.g., "makefile")
                # Only extensions are checked against active_extension_exclusions.
                # Filenames in presets are assumed to be desirable unless explicitly excluded by name via --exclude-ext (if that was a feature).
                # Current --exclude-ext only handles extensions.
                self.target_match_items = {
                    item.lower() for item in preset_defined_items
                    if not (item.startswith(".") and item.lower() in self.active_extension_exclusions)
                }
                self.current_logger.info(f"Using preset '{preset_name}'. Effective target items: {self.target_match_items}")
        
        # 3. Determine ignored directories
        self.ignored_dirs_set: Set[str] = {d.lower().strip() for d in (cli_ignore_dirs_list or []) if d.strip()}
        self.ignored_dirs_set.update(DEFAULT_IGNORE_DIRS)
        self.current_logger.debug(f"Effective ignored directories: {self.ignored_dirs_set}")

    def _is_file_match_rules_discovery(self, file_path: Path) -> bool:
        """
        Checks if a given file path matches the established filtering rules.
        This method is called during the initial directory scan.
        It also records information about files skipped by these initial rules.

        Args:
            file_path: The Path object of the file to check.

        Returns:
            True if the file matches rules and should be processed, False otherwise.
        """
        if not file_path.is_file():
            return False # Not a file, skip

        # Rule 1: Check ignored directories
        # Any part of the path matching an ignored directory name causes skipping.
        file_path_parts_lower = {part.lower() for part in file_path.parts}
        if any(ign_dir in file_path_parts_lower for ign_dir in self.ignored_dirs_set):
            self.current_logger.debug(f"Skipping (ignored dir): {file_path}")
            self.initial_skipped_files_info.append({
                "path": str(file_path.relative_to(self.search_root, walk_up=True)), # walk_up for safety if search_root is parent
                "reason": "ignored_directory",
                "size_bytes": file_path.stat().st_size if file_path.exists() else -1 # Best effort size
            })
            return False

        file_ext_lower = file_path.suffix.lower()
        file_name_lower = file_path.name.lower()

        # Rule 2: Apply matching logic based on mode (explicit include vs. preset/all_text)
        passes_match_criteria = False
        if self.match_mode_is_explicit_include:
            # Only include if explicitly listed (either as ".ext" or "filename")
            if file_ext_lower in self.target_match_items or file_name_lower in self.target_match_items:
                passes_match_criteria = True
        elif not self.target_match_items: # This means 'all_matching_text' preset was chosen
            # Include if its extension is NOT in the active general exclusions
            if file_ext_lower not in self.active_extension_exclusions:
                passes_match_criteria = True
        else: # Standard preset logic: include if in the preset's effective item list
            if file_ext_lower in self.target_match_items or file_name_lower in self.target_match_items:
                passes_match_criteria = True
        
        if not passes_match_criteria:
            self.current_logger.debug(f"Skipping (no rule match): {file_path}")
            self.initial_skipped_files_info.append({
                "path": str(file_path.relative_to(self.search_root, walk_up=True)),
                "reason": "no_matching_include_rule",
                "size_bytes": file_path.stat().st_size if file_path.exists() else -1
            })
            return False
        
        # If it passed all above, it's a candidate
        self.current_logger.debug(f"Candidate for processing: {file_path}")
        return True

    def discover_files_for_processing(self) -> Tuple[List[Path], int, int]:
        """
        Scans the search_root directory, applies filtering rules, and returns a list of files
        that are candidates for detailed processing.

        Returns:
            A tuple: (list_of_paths_to_process, total_paths_scanned, count_matching_rules_for_processing)
        """
        self.current_logger.info(f"Starting file discovery in '{self.search_root}' using effective rules...")
        candidate_paths: List[Path] = []
        
        all_items_in_scan_root: List[Path] = []
        try:
            # rglob can be slow on very large directories.
            # Consider os.walk for more control if performance becomes an issue here.
            # For now, rglob is simpler.
            for item in self.search_root.rglob("*"):
                all_items_in_scan_root.append(item)
        except PermissionError:
            self.current_logger.error(f"Permission denied during directory scan of '{self.search_root}'. Cannot discover files.")
            return [], 0, 0 # Return empty and zero counts
        except Exception as e_rglob:
            self.current_logger.error(f"Error during directory scan of '{self.search_root}': {e_rglob}")
            return [], 0, 0

        total_paths_scanned = len(all_items_in_scan_root)
        self.current_logger.info(f"Scanning {total_paths_scanned} total paths found under '{self.search_root}'.")

        # Iterate with progress bar if enabled
        discovered_paths_iterable = all_items_in_scan_root
        if self.args.get("progress_bar", DEFAULT_PROGRESS_BAR):
            discovered_paths_iterable = tqdm(all_items_in_scan_root, desc="Discovering files", unit="path", disable=not self.args.get("progress_bar"))

        for item_path in discovered_paths_iterable:
            if self._is_file_match_rules_discovery(item_path):
                candidate_paths.append(item_path)
        
        count_matching_rules = len(candidate_paths)
        self.current_logger.info(f"File discovery complete. Found {count_matching_rules} files matching rules for further analysis.")
        
        # `self.initial_skipped_files_info` is populated by `_is_file_match_rules_discovery`
        # and can be accessed after this method call to get info on files skipped at this stage.
        
        return candidate_paths, total_paths_scanned, count_matching_rules


# --- Worker Function for Multiprocessing ---

def process_single_file_task_worker(
    file_path_str: str,
    search_root_str: str,
    processing_args_dict: Dict[str, Any] # Contains all necessary args for processing
) -> Optional[Dict[str, Any]]:
    """
    Worker function executed by each process in the multiprocessing pool.
    It processes a single file: reads content, applies transformations,
    calculates relevance scores (if applicable), and returns metadata.

    Args:
        file_path_str: String representation of the file's Path.
        search_root_str: String representation of the project's root Path.
        processing_args_dict: Dictionary containing all other necessary parameters:
            - log_level, max_file_size, minify_whitespace, strip_comments
            - mode (fast/accurate), search_prompt_content, search_prompt_keywords
            - keyword_boost, similarity_threshold

    Returns:
        A dictionary containing metadata and processing results for the file,
        or None if a critical error occurs that prevents even basic metadata generation (rare).
        The dictionary *always* includes at least basic path info and a 'processing_status' field.
    """
    pid = os.getpid() # Get current process ID for distinct logging
    # Setup a logger instance for this worker process if not already configured by main logger.
    # This helps in tracing logs back to specific workers.
    worker_logger = logging.getLogger(f"{APP_NAME}.Worker.{pid}")
    if not worker_logger.handlers: # Avoid adding handlers repeatedly if process is reused (less common with Pool)
        worker_logger.setLevel(processing_args_dict.get("log_level", "INFO").upper())
        handler = logging.StreamHandler() # TODO: Consider QueueHandler for centralized logging from workers
        formatter = logging.Formatter(f'%(asctime)s - %(process)d - {APP_NAME}.Worker - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        worker_logger.addHandler(handler)

    current_file_path = Path(file_path_str)
    search_root_path = Path(search_root_str)
    worker_logger.debug(f"Assigned to process: {current_file_path.relative_to(search_root_path, walk_up=True)}")

    # 1. Get processed content and initial metadata (including language, size, processing status)
    # This function handles reading, initial size checks, and content transformations.
    processed_content, metadata, content_proc_status = get_processed_file_data(
        current_file_path,
        search_root_path,
        processing_args_dict["max_file_size"],
        processing_args_dict["minify_whitespace"],
        processing_args_dict["strip_comments"]
    )
    metadata["overall_processing_status"] = content_proc_status # Store the status from get_processed_file_data

    # If content is None, it means the file was skipped during get_processed_file_data (e.g., too large, read error)
    # In this case, metadata already contains info, and we just return it.
    if processed_content is None:
        worker_logger.info(f"Skipped {metadata.get('relative_path', file_path_str)} during content processing stage: {content_proc_status}")
        return metadata # Return metadata for skipped files (contains reason)

    # 2. Relevance Scoring (only if a search_prompt_content was provided)
    search_prompt_val = processing_args_dict.get("search_prompt_content")
    
    combined_score, primary_sim_score, kw_score, match_type_desc = 0.0, 0.0, 0.0, "not_applicable_no_search_prompt"
    
    if search_prompt_val: # Scoring is only performed if there's a search prompt
        combined_score, primary_sim_score, kw_score, match_type_desc = calculate_relevance_scores_for_content(
            processed_content, # Use the processed content for scoring
            search_prompt_val,
            processing_args_dict.get("search_prompt_keywords", []),
            processing_args_dict["mode"],
            processing_args_dict["keyword_boost"]
        )
        metadata.update({
            "relevance_score": combined_score,
            "similarity_score": primary_sim_score, # TF-IDF or Semantic score
            "keyword_score": kw_score,
            "match_type": match_type_desc,
            # Store which keywords were actually found in this specific file's content
            "matched_keywords": [
                kw for kw in processing_args_dict.get("search_prompt_keywords", [])
                if re.search(r'\b' + re.escape(kw.lower()) + r'\b', processed_content.lower())
            ] if processed_content else []
        })

        # If scored and below threshold, mark as skipped due to low relevance
        if combined_score < processing_args_dict["similarity_threshold"]:
            worker_logger.debug(f"File {metadata.get('relative_path', file_path_str)} relevance ({combined_score:.3f}) "
                                f"is below threshold ({processing_args_dict['similarity_threshold']}). Will be cataloged as low relevance.")
            metadata["overall_processing_status"] = f"skipped_low_relevance_{combined_score:.3f}"
            # Do not include 'full_content' or 'content_snippet' for files skipped due to low relevance
            # to save space in JSON if they are numerous, but keep metadata.
            return metadata
    else: # No search prompt, so no relevance scoring against a prompt
        metadata.update({ # Set default scoring fields for consistent JSON structure
            "relevance_score": 0.0, "similarity_score": 0.0, "keyword_score": 0.0,
            "match_type": "not_scored_no_search_prompt", "matched_keywords": []
        })
        # overall_processing_status is already set from get_processed_file_data (e.g. "processed_content_ok")
            
    # 3. Store full processed content and generate snippet for relevant/included files
    metadata["full_content"] = processed_content # This is the (potentially minified/stripped) content
    metadata["content_snippet"] = generate_snippet(
        processed_content,
        processing_args_dict.get("search_prompt_keywords") if search_prompt_val else None
    )
    # 'full_content_included_in_flat' will be determined later during flat output generation.
    
    worker_logger.info(f"Successfully processed: {metadata.get('relative_path', file_path_str)}. "
                       f"Status: {metadata['overall_processing_status']}, "
                       f"Relevance: {metadata.get('relevance_score', 0.0):.3f}")
    return metadata


# --- Typer CLI Application Definition ---

# Custom help text formatter for Typer
def typer_help_text(text: str) -> str:
    """Formats multi-line help text for Typer options by removing common leading whitespace."""
    return "\n" + text.strip().replace("        ", "") # Adjust space count if needed

app = typer.Typer(
    name=APP_NAME,
    help=f"{APP_NAME} (v{VERSION}): Intelligent project context aggregator for LLMs.",
    add_completion=False, # Disable shell completion for simplicity
    context_settings={"help_option_names": ["-h", "--help"]} # Standard help flags
)

@app.command(context_settings={"max_content_width": 120}) # Wider help text
def main_cli(
    directory: Path = typer.Argument(
        ..., # Ellipsis means it's required
        exists=True, file_okay=False, dir_okay=True, readable=True, resolve_path=True,
        help="Root directory of the project to crawl for context."
    ),
    search_prompt_or_file_path: Optional[str] = typer.Argument(
        None, # Optional argument
        metavar="SEARCH_PROMPT_OR_FILE", # Displayed in help instead of arg name
        help=typer_help_text("""
        Optional: The text prompt to guide file relevance scoring, OR a path to a UTF-8 encoded .txt file containing the prompt.
        If omitted, the script gathers general project context based on filters without prompt-specific scoring.
        This prompt also serves as the default LLM task if --llm-task is not provided.
        """),
        show_default=False # Don't show "None" as default in help
    ),
    llm_task: Optional[str] = typer.Option(
        None, "--llm-task", "-lt",
        help=typer_help_text("""
        Specific task, question, or objective for the LLM (e.g., "Refactor this class for better readability").
        If not provided, the SEARCH_PROMPT (if any) will be used as the task objective.
        If neither is set, a generic 'understand and analyze context' task is used.
        """),
        show_default=False
    ),
    generate_llm_template: bool = typer.Option(
        DEFAULT_GENERATE_LLM_TEMPLATE, "--llm-template/--no-llm-template",
        help=typer_help_text("""
        Wrap the aggregated context in a full, predefined LLM system prompt template.
        If --no-llm-template, the flat output contains only the summary manifest and raw aggregated content.
        """),
        show_default=True
    ),
    output_json: Path = typer.Option(
        lambda: Path(DEFAULT_OUTPUT_JSON), "--output-json", "-oj",
        help="Path for the structured JSON analysis output file.",
        show_default=True # Shows the default value which is resolved by lambda
    ),
    output_flat: Path = typer.Option(
        lambda: Path(DEFAULT_OUTPUT_FLAT), "--output-flat", "-of",
        help="Path for the flattened text output (LLM prompt or raw context).",
        show_default=True
    ),
    preset: str = typer.Option(
        DEFAULT_PRESET_NAME, "--preset", "-p",
        help=f"File filter preset. Options: {list(DEFAULT_PRESETS.keys())}",
        show_default=True
    ),
    include_ext: Optional[str] = typer.Option(
        None, "--include-ext", "-ie",
        help=typer_help_text("""
        Comma-separated specific extensions or full filenames to include (e.g., ".py,.tsx,Makefile,my_custom_config.json").
        This will OVERRIDE the chosen --preset's file selection logic.
        Items are case-insensitive. Extensions should start with a dot.
        """),
        show_default=False
    ),
    exclude_ext: Optional[str] = typer.Option(
        None, "--exclude-ext", "-ee",
        help=typer_help_text("""
        Comma-separated extensions to explicitly exclude (e.g., ".log,.tmp,.bkp").
        These are ADDED to the general internal exclusion list. Case-insensitive, start with a dot.
        """),
        show_default=False
    ),
    ignore_dir: Optional[List[str]] = typer.Option(
        None, "--ignore-dir", "-id",
        help=typer_help_text(f"""
        Directory names to ignore (case-insensitive). Can be specified multiple times (e.g., -id build -id temp_data).
        Defaults include common ones like: {', '.join(list(DEFAULT_IGNORE_DIRS)[:3])}... (see script for full list).
        """),
        show_default=False # Default list is long, better to state it in help or docs
    ),
    mode: str = typer.Option(
        DEFAULT_PROCESSING_MODE, "--mode", "-m",
        help=typer_help_text("""
        Processing mode for relevance scoring (if a search prompt is provided):
        'fast': Uses TF-IDF, quicker.
        'accurate': Uses Sentence Transformers for deeper semantic understanding (requires 'sentence-transformers' library, can be slower).
        """),
        case_sensitive=False, show_default=True
    ),
    similarity_threshold: float = typer.Option(
        DEFAULT_SIMILARITY_THRESHOLD, "--similarity-threshold", "-st",
        min=0.0, max=1.0, # Clamp values
        help="Minimum combined relevance score (0.0-1.0) for a file to be included in the LLM context if a search prompt is used.",
        show_default=True
    ),
    keyword_boost: float = typer.Option(
        DEFAULT_KEYWORD_BOOST, "--keyword-boost", "-kb",
        min=0.0, # Can be greater than 1.0
        help="Multiplier for keyword match score contribution to the combined relevance (if search prompt used). Higher values give more weight to keyword matches.",
        show_default=True
    ),
    max_file_size: int = typer.Option(
        DEFAULT_MAX_FILE_SIZE, "--max-file-size", "-mfs",
        min=0, help="Maximum individual file size in bytes to process.",
        show_default=True
    ),
    minify_whitespace: bool = typer.Option(
        DEFAULT_MINIFY_WHITESPACE, "--minify-ws/--no-minify-ws",
        help="Reduce excessive newlines and trailing whitespace in file content to save tokens.",
        show_default=True
    ),
    strip_comments: bool = typer.Option(
        DEFAULT_STRIP_COMMENTS, "--strip-com/--no-strip-com",
        help="Attempt to strip comments (and Python docstrings heuristically) from file content to save tokens.",
        show_default=True
    ),
    max_flat_tokens: int = typer.Option(
        DEFAULT_MAX_FLAT_TOKENS, "--max-flat-tokens", "-mft",
        min=0, help="Approximate maximum number of words (tokens) for the aggregated content in the flattened output.",
        show_default=True
    ),
    num_workers: int = typer.Option(
        DEFAULT_NUM_WORKERS, "--num-workers", "-nw",
        min=0, help="Number of worker processes for file analysis (0 for auto = number of CPU cores).",
        show_default="auto (CPU cores)"
    ),
    log_level: str = typer.Option(
        DEFAULT_LOG_LEVEL, "--log-level", "-ll",
        help=f"Set the logging verbosity. Options: {list(VALID_LOG_LEVELS)}",
        case_sensitive=False, show_default=True
    ),
    progress_bar: bool = typer.Option(
        DEFAULT_PROGRESS_BAR, "--pbar/--no-pbar",
        help="Show/hide progress bars during file discovery and analysis.",
        show_default=True
    )
):
    """
    ConfluenceV2: Crawls a project directory, intelligently selects and processes files,
    and aggregates their content into a context suitable for Large Language Models (LLMs).
    Can be guided by an optional search prompt for relevance or gather general project context.
    """
    global logger # Allow main_cli to set up the global logger instance
    if log_level.upper() not in VALID_LOG_LEVELS:
        # Use Typer's echo for early messages before logger is fully set up if needed
        typer.echo(f"Error: Invalid log level '{log_level}'. Choose from {list(VALID_LOG_LEVELS)}.", err=True)
        raise typer.Exit(code=1)
    logger = setup_global_logger(log_level) # Initialize the global logger

    # --- Preliminary Checks & Setup ---
    start_time = time.time()
    logger.info(f"{APP_NAME} v{VERSION} starting process...")

    processing_mode_actual = mode.lower()
    if processing_mode_actual not in ["fast", "accurate"]:
        logger.warning(f"Invalid mode '{mode}' specified. Defaulting to '{DEFAULT_PROCESSING_MODE}'.")
        processing_mode_actual = DEFAULT_PROCESSING_MODE
    
    if processing_mode_actual == "accurate" and not SENTENCE_TRANSFORMERS_AVAILABLE:
        logger.critical("Mode 'accurate' was selected, but the 'sentence-transformers' library is NOT installed.")
        logger.critical("Please install it ('pip install sentence-transformers') or use '--mode fast'.")
        typer.echo("CRITICAL ERROR: 'sentence-transformers' library not found for 'accurate' mode. Exiting.", err=True)
        raise typer.Exit(code=1)

    # --- Handle Search Prompt (Text or File Path) ---
    actual_search_prompt_content: Optional[str] = None
    if search_prompt_or_file_path:
        prompt_as_path = Path(search_prompt_or_file_path)
        if prompt_as_path.is_file():
            logger.info(f"Attempting to read search prompt from file: {prompt_as_path.resolve()}")
            try:
                actual_search_prompt_content = prompt_as_path.read_text(encoding='utf-8').strip()
                if not actual_search_prompt_content: # File was empty
                    logger.warning(f"Search prompt file '{prompt_as_path.resolve()}' is empty. "
                                   "Proceeding as if no search prompt was provided.")
                else:
                    logger.info(f"Successfully read search prompt from file. Length: {len(actual_search_prompt_content)} chars.")
            except IOError as e:
                logger.error(f"IOError reading search prompt file '{prompt_as_path.resolve()}': {e}")
                typer.echo(f"Error: Could not read search prompt file: {search_prompt_or_file_path}", err=True)
                raise typer.Exit(code=1)
            except Exception as e_gen: # Catch any other unexpected errors during file read
                logger.error(f"Unexpected error reading search prompt file '{prompt_as_path.resolve()}': {e_gen}")
                typer.echo(f"Error: Unexpected issue reading prompt file: {search_prompt_or_file_path}", err=True)
                raise typer.Exit(code=1)
        else:
            # Not a file (or path doesn't exist), so treat as a direct string prompt
            actual_search_prompt_content = search_prompt_or_file_path.strip()
            if not actual_search_prompt_content: # Input was just whitespace
                 logger.warning(f"Provided search prompt string is empty after stripping whitespace. "
                                   "Proceeding as if no search prompt was provided.")
                 actual_search_prompt_content = None # Treat as no prompt
            # No specific log for direct string prompt unless it's very long / for debug
            
    # Log effective prompt (or lack thereof)
    if actual_search_prompt_content:
        logger.info(f"Effective Search Prompt (first 100 chars): '{actual_search_prompt_content[:100]}{'...' if len(actual_search_prompt_content) > 100 else ''}'")
    else:
        logger.info("No search prompt provided or prompt was empty. Gathering general project context based on filters.")
    if llm_task: logger.info(f"LLM Task specified: '{llm_task}'")
    logger.info(f"Target Directory: '{directory.resolve()}'")
    logger.info(f"Processing Mode: {processing_mode_actual.upper()}")

    # --- NLP Resource Initialization (based on actual_search_prompt_content) ---
    search_prompt_keywords_list: List[str] = []
    if actual_search_prompt_content:
        search_prompt_keywords_list = extract_search_prompt_keywords(actual_search_prompt_content)
        logger.info(f"Extracted keywords from search prompt: {search_prompt_keywords_list}")
    
    initialize_nlp_resources(processing_mode_actual, actual_search_prompt_content)
    # Check if critical NLP resources failed to initialize if a prompt was given
    if actual_search_prompt_content:
        if processing_mode_actual == "accurate" and (semantic_model_global is None or prompt_semantic_embedding_global is None):
            logger.critical("Failed to initialize semantic model or prompt embedding for 'accurate' mode with a search prompt. Cannot proceed with scoring.")
            # Depending on strictness, could exit. For now, it will proceed but scoring will be impaired.
        if tfidf_vectorizer_global is None or prompt_tfidf_vector_global is None: # TF-IDF should always init if prompt
             logger.critical("Failed to initialize TF-IDF vectorizer or prompt vector with a search prompt. Scoring will be impaired.")


    # --- File Discovery ---
    # Prepare arguments for FileProcessor constructor
    file_processor_init_args = {
        "preset": preset, "include_ext": include_ext, "exclude_ext": exclude_ext,
        "ignore_dir": list(ignore_dir) if ignore_dir else [], # Ensure it's a list
        "log_level": log_level.upper(), # For FileProcessor's own logger use
        "progress_bar": progress_bar, # To disable its own progress bar if main one is off
    }
    file_processor_instance = FileProcessor(search_root=directory, cli_args=file_processor_init_args)
    
    candidate_paths_for_processing, total_paths_scanned_count, discovered_matching_rules_count = \
        file_processor_instance.discover_files_for_processing()
    
    # `all_discovered_metadata` will store results for ALL files encountered:
    # those skipped by initial discovery, those processed by workers (and then possibly skipped by relevance),
    # and those included in final context.
    all_processed_or_skipped_metadata: List[Dict[str, Any]] = list(file_processor_instance.initial_skipped_files_info)


    # --- Parallel File Processing & Analysis ---
    if not candidate_paths_for_processing:
        logger.warning("No files found matching discovery rules for detailed analysis stage. Only initial skips will be logged.")
    else:
        logger.info(f"Preparing to analyze {len(candidate_paths_for_processing)} candidate files using {processing_mode_actual.upper()} mode...")
        
        # Common arguments for all worker tasks, avoids pickling them repeatedly per task item.
        worker_common_processing_args = {
            "log_level": log_level.upper(), "max_file_size": max_file_size,
            "minify_whitespace": minify_whitespace, "strip_comments": strip_comments,
            "mode": processing_mode_actual,
            "search_prompt_content": actual_search_prompt_content, # The actual prompt string
            "search_prompt_keywords": search_prompt_keywords_list,
            "keyword_boost": keyword_boost,
            "similarity_threshold": similarity_threshold # Worker needs this to mark low-relevance skips
        }
        
        tasks_for_pool = [
            (str(fp), str(directory.resolve()), worker_common_processing_args)
            for fp in candidate_paths_for_processing
        ]

        actual_num_workers = num_workers if num_workers > 0 else get_cpu_count_safe()
        logger.info(f"Using {actual_num_workers} worker processes for file analysis.")

        # Multiprocessing Pool execution
        # Note: Global NLP models (TF-IDF vectorizer, Sentence Transformer) are assumed to be
        # available to worker processes via fork on POSIX systems. On Windows (spawn),
        # these would need to be passed or re-initialized if not picklable by default methods.
        # Scikit-learn and SentenceTransformer objects are generally picklable.
        if progress_bar:
            with Pool(processes=actual_num_workers) as pool:
                results_iterator = pool.starmap(process_single_file_task_worker, tasks_for_pool)
                for result_meta in tqdm(results_iterator, total=len(tasks_for_pool), desc="Analyzing files", unit="file"):
                    if result_meta: all_processed_or_skipped_metadata.append(result_meta)
        else: # No progress bar
            with Pool(processes=actual_num_workers) as pool:
                raw_multiprocessing_results = pool.starmap(process_single_file_task_worker, tasks_for_pool)
            for result_meta in raw_multiprocessing_results:
                if result_meta: all_processed_or_skipped_metadata.append(result_meta)

    # --- Result Aggregation & Final Sorting ---
    # Categorize files based on their processing status and relevance (if applicable)
    final_llm_context_files: List[Dict[str, Any]] = []
    other_cataloged_files_summary: List[Dict[str, Any]] = [] # For files not making it to LLM context

    for item_metadata in all_processed_or_skipped_metadata:
        status = item_metadata.get("overall_processing_status", "unknown_status_missing")
        
        # A file is a candidate for LLM context if it was successfully processed
        # (status "processed_content_ok" or "processed_empty") AND
        # if a search_prompt was used, its relevance score meets the threshold.
        # If no search_prompt, all successfully processed files are context candidates.
        
        is_content_processed_successfully = status in ["processed_content_ok", "processed_empty", "processed_content_fallback_raw"]
        
        if is_content_processed_successfully:
            if actual_search_prompt_content: # Relevance scoring applies
                if item_metadata.get("relevance_score", 0.0) >= similarity_threshold:
                    final_llm_context_files.append(item_metadata)
                else: # Processed successfully but below relevance threshold
                    # Ensure status reflects this if not already set by worker (e.g. worker might set "skipped_low_relevance...")
                    if "low_relevance" not in status: # Check if worker already marked it
                         item_metadata["overall_processing_status"] = f"info_processed_below_threshold_{item_metadata.get('relevance_score',0.0):.3f}"
                    other_cataloged_files_summary.append(item_metadata)
            else: # No search prompt, so all successfully processed files are context candidates
                final_llm_context_files.append(item_metadata)
        else: # File was skipped for other reasons (initial discovery, size, read error, etc.)
            other_cataloged_files_summary.append(item_metadata)
            
    # Sort files for LLM context: by relevance score (desc) if search prompt was used,
    # otherwise by relative path (asc) for consistent ordering.
    if actual_search_prompt_content:
        final_llm_context_files.sort(key=lambda x: x.get("relevance_score", 0.0), reverse=True)
    else: # Sort by path for general context gathering
        final_llm_context_files.sort(key=lambda x: x.get("relative_path", ""))
    
    # Assign rank for files included in the LLM context
    for i, item_data in enumerate(final_llm_context_files):
        item_data["rank_in_llm_context"] = i + 1
    
    # Sort other cataloged files by path for easier review in JSON
    other_cataloged_files_summary.sort(key=lambda x: x.get("path", x.get("relative_path", "")))

    logger.info(f"Final aggregation: {len(final_llm_context_files)} files selected for LLM context.")
    logger.info(f"{len(other_cataloged_files_summary)} other files were cataloged (e.g., skipped, low relevance). See JSON for details.")


    # --- Output Generation: JSON Analysis File ---
    # This file contains a comprehensive summary of the run and detailed info for all files.
    json_output_data = {
        "confluence_run_summary": {
            "app_name": APP_NAME, "app_version": VERSION,
            "execution_timestamp_utc": datetime.utcnow().isoformat() + "Z",
            "target_directory_crawled": str(directory.resolve()),
            "processing_mode_used": processing_mode_actual.upper(),
            "search_prompt_provided": bool(actual_search_prompt_content),
            "search_prompt_content_snippet": (f"{actual_search_prompt_content[:100]}..." if actual_search_prompt_content and len(actual_search_prompt_content)>100 else actual_search_prompt_content) if actual_search_prompt_content else None,
            "llm_task_directive_specified": llm_task,
            "total_paths_scanned_in_target_dir": total_paths_scanned_count,
            "files_matching_discovery_rules": discovered_matching_rules_count,
            "files_selected_for_llm_context": len(final_llm_context_files),
            "other_files_cataloged_count": len(other_cataloged_files_summary)
        },
        "llm_context_files_details": final_llm_context_files, # Contains full_content for these
        "other_cataloged_files_details": other_cataloged_files_summary # Does not contain full_content
    }
    try:
        with output_json.open('w', encoding='utf-8') as f_json:
            json.dump(json_output_data, f_json, indent=2, ensure_ascii=False)
        logger.info(f"Comprehensive JSON analysis report saved to: {output_json.resolve()}")
        typer.echo(f"JSON analysis saved to: {output_json.resolve()}")
    except IOError as e_json_write:
        logger.error(f"Error writing JSON analysis output to {output_json.resolve()}: {e_json_write}")
        typer.echo(f"Error: Could not write JSON output to {output_json.resolve()}.", err=True)


    # --- Output Generation: Flattened Text for LLM ---
    # Part 1: Create the Project Context Summary Block (Manifest) for the flat file
    included_files_manifest_lines = [
        f"- {item['relative_path']} (Lang: {item.get('language','N/A')}, "
        f"Score: {item.get('relevance_score',0.0):.2f}, Size: {item.get('size_bytes',0)/1024.0:.1f}KB)"
        for item in final_llm_context_files[:MANIFEST_INCLUDED_LIMIT] # Show top N
    ]
    if len(final_llm_context_files) > MANIFEST_INCLUDED_LIMIT:
        included_files_manifest_lines.append(f"- ... and {len(final_llm_context_files) - MANIFEST_INCLUDED_LIMIT} more files (see JSON output).")
    if not included_files_manifest_lines: included_files_manifest_lines.append("- None (no files selected for LLM context).")

    # Summarize notable skipped files (those not making it to LLM context)
    notable_skipped_files_lines = [
        f"- {item.get('path', item.get('relative_path','N/A'))} "
        f"(Reason: {item.get('overall_processing_status','skipped')}, Size: {item.get('size_bytes',-1):,d} bytes)" # Use item.get for safety
        for item in other_cataloged_files_summary # Iterate through all non-LLM context files
        # Filter for common "skipped" reasons to be concise, or just show top N of all non-context files
        if "skipped" in item.get("overall_processing_status","") or "low_relevance" in item.get("overall_processing_status","") or "threshold" in item.get("overall_processing_status","")
    ][:MANIFEST_SKIPPED_LIMIT]
    
    num_actually_skipped_or_low_relevance = sum(
        1 for item in other_cataloged_files_summary 
        if "skipped" in item.get("overall_processing_status","") or "low_relevance" in item.get("overall_processing_status","") or "threshold" in item.get("overall_processing_status","")
    )
    if num_actually_skipped_or_low_relevance > MANIFEST_SKIPPED_LIMIT:
        notable_skipped_files_lines.append(f"- ... and {num_actually_skipped_or_low_relevance - MANIFEST_SKIPPED_LIMIT} more skipped/low-relevance files (see JSON output).")
    if not notable_skipped_files_lines: notable_skipped_files_lines.append("- None (or all processed files were included in context).")

    project_context_summary_text_block = f"""
PROJECT CONTEXT SUMMARY (Generated by {APP_NAME} v{VERSION})
----------------------------------------------------
Target Directory: {str(directory.resolve())}
Processing Mode: {processing_mode_actual.upper()}
Search Prompt Used: {'Yes' if actual_search_prompt_content else 'No (general context gathering)'}
Total Paths Scanned: {total_paths_scanned_count}
Files Matching Discovery Rules: {discovered_matching_rules_count}
Files Selected for LLM Context: {len(final_llm_context_files)}
Approx. Max Words for File Contents in LLM Prompt: ~{max_flat_tokens:,d}

Included Files Manifest (Top up to {MANIFEST_INCLUDED_LIMIT}):
{os.linesep.join(included_files_manifest_lines)}

Notable Skipped/Low-Relevance Files (Up to {MANIFEST_SKIPPED_LIMIT}):
{os.linesep.join(notable_skipped_files_lines)}
----------------------------------------------------
"""

    # Part 2: Create the Aggregated File Content Block for the flat file
    aggregated_file_content_text_block = ""
    current_word_count_for_flat_output = 0
    files_included_in_flat_output_count = 0
    flat_content_parts_list: List[str] = []

    for item_meta_data in final_llm_context_files: # Assumed sorted by relevance or path
        if "full_content" not in item_meta_data: # Should have content if it's in final_llm_context_files
            logger.warning(f"File {item_meta_data.get('relative_path')} was in final context list but lacked 'full_content'. Skipping for flat output.")
            item_meta_data["full_content_included_in_flat"] = "error_missing_content"
            continue

        file_header_text = FLATTENED_FILE_HEADER_TEMPLATE.format(
            relative_path=item_meta_data["relative_path"],
            language=item_meta_data.get("language", "N/A"),
            relevance_score=item_meta_data.get("relevance_score", 0.0), # Will be 0 if no prompt
            size_kb=item_meta_data.get("size_bytes", 0) / 1024.0
        )
        content_to_add_str = item_meta_data["full_content"] # This is already processed (minified, comments stripped)
        
        header_word_count = approximate_word_count(file_header_text)
        content_word_count = approximate_word_count(content_to_add_str)

        if current_word_count_for_flat_output + header_word_count + content_word_count <= max_flat_tokens:
            flat_content_parts_list.append(file_header_text + "\n" + content_to_add_str)
            current_word_count_for_flat_output += header_word_count + content_word_count
            item_meta_data["full_content_included_in_flat"] = True # Mark in JSON data
            files_included_in_flat_output_count += 1
        elif current_word_count_for_flat_output + header_word_count < max_flat_tokens:
            # Can fit header and partial content
            remaining_tokens_for_content = max_flat_tokens - current_word_count_for_flat_output - header_word_count
            words_in_content = content_to_add_str.split() # Simple word split
            truncated_content_str = " ".join(words_in_content[:remaining_tokens_for_content])
            if len(words_in_content) > remaining_tokens_for_content:
                truncated_content_str += f"{os.linesep}... [CONTENT TRUNCATED DUE TO TOKEN LIMITS ({max_flat_tokens} words max)] ..."
            
            flat_content_parts_list.append(file_header_text + "\n" + truncated_content_str)
            current_word_count_for_flat_output += header_word_count + approximate_word_count(truncated_content_str)
            item_meta_data["full_content_included_in_flat"] = "partial_due_to_token_limit"
            files_included_in_flat_output_count += 1
            logger.info(f"Max token limit reached. Last file '{item_meta_data['relative_path']}' was partially included.")
            break # Stop adding more files
        else: # Cannot even fit the header of the next file
            item_meta_data["full_content_included_in_flat"] = False # Mark as not included
            logger.info(f"Max token limit reached. File '{item_meta_data['relative_path']}' and subsequent files not included in flat output.")
            break # Stop adding more files
            
    aggregated_file_content_text_block = "\n\n".join(flat_content_parts_list)
    logger.info(f"Aggregated content from {files_included_in_flat_output_count} files into flat output "
                f"(~{current_word_count_for_flat_output:,d} words).")

    # Part 3: Assemble final flat output based on --generate-llm-template
    final_flat_output_content_str: str
    if generate_llm_template:
        # Determine the effective LLM task description for the template
        effective_llm_task_for_template = DEFAULT_LLM_TASK_DESCRIPTION # Default if nothing else provided
        if llm_task: # User explicitly provided an LLM task
            effective_llm_task_for_template = llm_task
        elif actual_search_prompt_content: # No explicit LLM task, but search prompt was given
            effective_llm_task_for_template = (
                f"Address the following query, topic, or objective based on the provided project context: "
                f"'{actual_search_prompt_content}'"
            )
        
        final_flat_output_content_str = LLM_SYSTEM_PROMPT_TEMPLATE.format(
            app_name=APP_NAME, # Pass app name to template
            app_version=VERSION,
            user_llm_task=effective_llm_task_for_template,
            project_context_summary_block=project_context_summary_text_block.strip(),
            aggregated_file_content_block=aggregated_file_content_text_block
        ).strip()
        logger.info("Generated full LLM system prompt template with context and summary.")
    else: # No LLM template wrapper, just summary + aggregated content
        final_flat_output_content_str = (
            project_context_summary_text_block.strip() +
            "\n\n--- START OF AGGREGATED FILE CONTENTS ---\n\n" +
            aggregated_file_content_text_block
        )
        logger.info("Generated context summary and aggregated file content (LLM template wrapper explicitly disabled).")

    try:
        with output_flat.open('w', encoding='utf-8') as f_flat:
            f_flat.write(final_flat_output_content_str)
        logger.info(f"Flattened text output (for LLM) saved to: {output_flat.resolve()}")
        typer.echo(f"Flattened LLM output saved to: {output_flat.resolve()}")
    except IOError as e_flat_write:
        logger.error(f"Error writing flattened text output to {output_flat.resolve()}: {e_flat_write}")
        typer.echo(f"Error: Could not write flat output to {output_flat.resolve()}.", err=True)

    # --- Final Summary ---
    end_time = time.time()
    total_duration_seconds = end_time - start_time
    logger.info(f"{APP_NAME} process finished in {total_duration_seconds:.2f} seconds.")
    typer.echo(f"Processing complete in {total_duration_seconds:.2f} seconds. "
               f"{len(final_llm_context_files)} files selected for LLM context.")


if __name__ == "__main__":
    # Initial check for sentence-transformers if default mode is accurate to provide an early warning
    # This is helpful if the user just runs the script without '--mode fast' and doesn't have the lib.
    # The main_cli function also has a more robust check that will cause an exit.
    if DEFAULT_PROCESSING_MODE == "accurate" and not SENTENCE_TRANSFORMERS_AVAILABLE:
        print(f"WARNING: Default processing mode is 'accurate', but 'sentence-transformers' library is NOT installed.")
        print(f"         'accurate' mode will fail unless you explicitly use '--mode fast'.")
        print(f"         To enable 'accurate' mode, please install it: 'pip install sentence-transformers'")
    
    # For PyInstaller or similar packaging, especially on Windows, multiprocessing might need freeze_support()
    # from multiprocessing import freeze_support
    # freeze_support()
    
    app()