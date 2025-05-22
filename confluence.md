# 📜 Confluence – Intelligent File Crawler & Aggregator for LLMs

Confluence is a Python-based command-line tool that **recursively crawls directories, identifies the files most relevant to a user prompt, and aggregates their content into formats ready for Large Language Models (LLMs)**.  
It relies on local, offline NLP techniques (YAKE! keyword extraction and TF-IDF cosine-similarity ranking) and is optimized for speed with multiprocessing.

---

## ✨ Features

- **Recursive folder crawling** – efficiently scans deeply nested directory structures.  
- **Prompt-based matching**
  - **Automatic keyword extraction** with YAKE!  
  - **TF-IDF + cosine similarity** for textual relevance.  
  - Scores are **combined** for robust ranking.  
- **Multiprocessing** – uses all available CPU cores (configurable).  
- **Fully local / offline NLP** – no network calls after installation.  
- **Dual output formats**
  - **Structured JSON** with rich metadata.  
  - **Flattened text** tailor-made for LLM input, respecting token limits.  
- **Highly customizable filtering**
  - Include / exclude by extension.  
  - Ignore specific directories.  
  - Handy **presets**: `code`, `docs`, `all_text`.  
- **Configurable thresholds & limits** – similarity, keyword boost, token caps, and more.  
- **User-friendly CLI** built with **Typer**.  
- **Informative logging** and **progress bar** for visibility.

---

## ⚙️ Requirements

- **Python 3.8+**
- Python libraries:
  - `typer`
  - `tqdm`
  - `yake`
  - `scikit-learn`
  - `chardet`

---

## 🚀 Installation

1. **Save the script**

   Copy the full Python source (see *confluence.py* in this repo) to your machine.

2. **Create & activate a virtual environment (recommended)**

   ```bash
   python -m venv venv
   # macOS / Linux
   source venv/bin/activate
   # Windows
   venv\Scripts\activate
Install dependencies

bash
Copy
Edit
pip install typer tqdm yake scikit-learn chardet
▶️ How to Use
bash
Copy
Edit
python confluence.py "YOUR SEARCH PROMPT HERE" /path/to/search_directory [OPTIONS]
CLI options (most common)
Option	Shorthand	Purpose / Example	Default
PROMPT	–	Search text: "async database connection patterns"	required
DIRECTORY	–	Root directory to crawl: ~/projects/my_app	required
--output-json PATH	-oj	Structured JSON file	confluence_output.json
--output-flat PATH	-of	Flattened text file	confluence_output.txt
--preset {code,docs,all_text}	–	Quick extension filter	code
--include-ext .py,.md	-ie	Extra extensions to include	–
--exclude-ext .log,.tmp	-ee	Extra extensions to exclude	–
--ignore-dir NAME	-id	Directory names to ignore (repeatable)	.git, __pycache__, …
--similarity-threshold FLOAT	-st	Min combined relevance (0–1)	0.05
--keyword-boost FLOAT	-kb	Weight of keyword matches	1.5
--max-file-size BYTES	-mfs	Skip larger files	5_242_880 (5 MB)
--max-flat-tokens INT	-mft	Word cap for flat output	50 000
--num-workers INT	-nw	Worker processes (0 = auto)	0
--log-level {DEBUG,INFO,…}	-ll	Verbosity	INFO
--progress / --no-progress	–	Show progress bar	on

💡 Examples
1. Find Python code about async DB connections
bash
Copy
Edit
python confluence.py "async database connection patterns" ~/dev/my_web_project
2. Search Markdown docs for API rate-limiting strategies
bash
Copy
Edit
python confluence.py "API rate limiting strategies" ./docs/api_guides \
  --preset docs \
  --output-json api_docs_analysis.json \
  --output-flat llm_api_input.txt
3. Look for roadmap notes (custom extensions, extra logging)
bash
Copy
Edit
python confluence.py "project Q3 roadmap discussion" /company/planning_documents \
  --preset all_text \
  --include-ext .md,.txt,.notes \
  --exclude-ext .tmp,.swp \
  --log-level DEBUG
4. Scan C# code for dependency injection (ignore build/test dirs)
bash
Copy
Edit
python confluence.py "dependency injection in C#" D:\source\enterprise_app \
  --include-ext .cs \
  --ignore-dir Test --ignore-dir Tests --ignore-dir bin --ignore-dir obj \
  --num-workers 4 \
  --similarity-threshold 0.1
5. Produce a concise flat summary (~10 000 words)
bash
Copy
Edit
python confluence.py "user session management best practices" /var/www/my_app_code \
  --max-flat-tokens 10000 \
  --output-flat session_summary_for_llm.txt
📖 Output Formats
1. JSON (--output-json)
jsonc
Copy
Edit
[
  {
    "rank": 1,
    "file_path": "/path/to/project/module/file.py",
    "relative_path": "module/file.py",
    "file_name": "file.py",
    "extension": ".py",
    "size_bytes": 2048,
    "last_modified": "2025-05-20T14:30:00",
    "relevance_score": 0.785,
    "similarity_score": 0.650,
    "keyword_score": 0.890,
    "match_type": "keyword_similarity",
    "matched_keywords": ["keyword1", "keyword2"],
    "content_snippet": "def relevant_function():\n  # ...\n  return True",
    "full_content": " ... ",
    "approx_token_count": 350,
    "full_content_included_in_flat": true
  }
  /* … additional file objects … */
]
2. Flattened text (--output-flat)
text
Copy
Edit
--- FILE: module/file.py (Relevance: 0.79) ---
def relevant_function():
  # ... full content of file.py ...
  return True

--- FILE: another_module/important_notes.md (Relevance: 0.72) ---
# Project Notes on X
This document outlines key decisions…
… (truncated)
🛠️ How It Works
Initialization – parse CLI args, set up logging.

NLP setup – extract prompt keywords (YAKE!), fit TF-IDF on prompt.

File discovery – recursive walk with extension & directory filters.

Parallel processing (worker pool)

Read content (encoding detected via chardet).

Scoring – TF-IDF similarity + keyword frequency → combined relevance.

Metadata collection (size, mtime, …).

Aggregation & ranking – keep files above threshold, sort by relevance.

Output generation

JSON – rich metadata per file.

Flattened text – concatenate ranked files until max-flat-tokens reached (truncating the last file if required).

🔧 Advanced Customization
Default filters – tweak DEFAULT_IGNORE_DIRS, DEFAULT_IGNORE_EXTENSIONS, DEFAULT_PRESETS at the top of confluence.py.

NLP parameters – change YAKE_LANGUAGE, YAKE_MAX_NGRAM_SIZE, etc.

Scoring logic – edit calculate_combined_relevance() to adjust weights or add new factors.

⚠️ Troubleshooting tips
Issue	Possible cause / remedy
Encoding errors	Ensure source files use common encodings (UTF-8 preferred).
Slow performance / high memory	Use stricter filters, lower max-file-size, or tune --num-workers.
Dependencies missing	Verify the libraries in Requirements are installed in the active venv.
“No relevant files found”	Broaden the prompt, lower --similarity-threshold, review filter options, or enable --log-level DEBUG for more details.

Made with ❤️ for faster, smarter code & document exploration.