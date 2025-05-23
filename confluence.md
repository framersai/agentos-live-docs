# ConfluenceV2 - Intelligent Project Context Aggregator for LLMs

**ConfluenceV2 (v2.0.1)** intelligently scans your project directories, processes relevant files, and aggregates their content into a format optimized for Large Language Models (LLMs). It can build general project context or focus on files relevant to a specific **search prompt** (text or from a file).

The output is a detailed JSON analysis and a flattened text file, optionally wrapped in a ready-to-use system prompt for LLMs, perfect for tasks like code analysis, Q&A, or AI-assisted development.

---

## Key Features ✨

* **Flexible Prompting:** Provide a search prompt as direct text or a path to a `.txt` file. Optional – can gather general context too!
* **Dual NLP Modes:**
    * `--mode fast`: Quick TF-IDF and keyword-based relevance.
    * `--mode accurate`: Deep semantic understanding via Sentence Transformers (e.g., `all-MiniLM-L6-v2`). Requires `pip install sentence-transformers`.
* **Smart Content Processing:**
    * `--minify-ws`: Reduces excessive whitespace.
    * `--strip-com`: Attempts to remove comments (including Python docstrings heuristically) to save tokens.
* **Advanced File Filtering:** Uses presets (`project_wide`, `code_only`, etc.), custom include/exclude rules for extensions *and* specific filenames (e.g., `Makefile`).
* **Comprehensive Outputs:**
    * **JSON Analysis (`confluence_v2_project_analysis.json`):** Detailed run summary, file metadata, scores, and processing status for all considered files.
    * **LLM-Ready Text (`confluence_v2_llm_prompt.txt`):** Includes a project summary manifest and aggregated content of selected files, respecting token limits. Optionally wrapped in a powerful system prompt template.
* **Efficient & Customizable:** Leverages multiprocessing, handles various encodings, and offers numerous CLI options.

---

## Installation 🚀

1.  **Prerequisites:** Python 3.7+ and `pip`.
2.  **Save Script:** Save the code above as `confluence_v2.py`.
3.  **Install Dependencies:**
    ```bash
    # It's highly recommended to use a virtual environment
    python3 -m venv confluence_env
    source confluence_env/bin/activate  # On Windows: confluence_env\Scripts\activate

    # Core dependencies
    pip install typer tqdm yake scikit-learn chardet

    # For '--mode accurate' (OPTIONAL but recommended for best results)
    pip install sentence-transformers
    ```
4.  **(Optional) Make Executable (Linux/macOS):**
    ```bash
    chmod +x confluence_v2.py
    ```

---

## Usage 🛠️

```bash
python confluence_v2.py <DIRECTORY> [SEARCH_PROMPT_OR_FILE] [OPTIONS]

Or if executable: ./confluence_v2.py <DIRECTORY> [SEARCH_PROMPT_OR_FILE] [OPTIONS]

Core Arguments:

    DIRECTORY: (Required) Root project directory to scan.
    SEARCH_PROMPT_OR_FILE: (Optional) The search prompt text or path to a .txt file containing the prompt. If omitted, general project context is gathered.

Common Options:
Option	Short	Default	Description
--llm-task TEXT	-lt	(uses search_prompt)	Specific task for the LLM (e.g., "Refactor this code").
--mode MODE	-m	accurate	Relevance mode: fast (TF-IDF) or accurate (semantic).
--preset NAME	-p	project_wide	File filter preset (e.g., code_only, docs_only).
--output-json PATH	-oj	...project_analysis.json	Path for JSON output.
--output-flat PATH	-of	...llm_prompt.txt	Path for flattened LLM text output.
--max-flat-tokens INT	-mft	150000	Approx. max words for the LLM text output.
--log-level LEVEL	-ll	INFO	Logging verbosity (DEBUG, INFO, WARNING, ERROR).
--[no-]llm-template		--llm-template	Wrap flat output in a system prompt.
--[no-]minify-ws		--minify-ws	Reduce excessive whitespace.
--[no-]strip-com		--no-strip-com	Attempt to strip comments.
-h, --help			Show full help message.

Run with --help to see all available options and their details.
Outputs 📝

    JSON Analysis File (e.g., confluence_v2_project_analysis.json):
        Contains a full summary of the execution (parameters, file counts).
        Detailed list of llm_context_files_details with their processed content, scores, language, etc.
        List of other_cataloged_files_details (skipped, low relevance, etc.).
        Essential for debugging and understanding what context was built.

    Flattened Text Output (e.g., confluence_v2_llm_prompt.txt):
        Project Context Summary Block (Manifest): Lists key run parameters, top included files, and notable skipped files.
        Aggregated File Content Block: Concatenated processed content of selected files, each prefixed with a header like --- FILE: path/to/file.py (Language: Python) (Relevance: 0.875) (Size: 10.2KB) ---.
        Optional LLM System Prompt Wrapper: If --llm-template (default) is used, the above two blocks are embedded within a powerful system prompt designed to guide the LLM effectively. This prompt instructs the AI on code quality, contextual understanding, and crucially, to ask for missing information rather than hallucinating.

Examples 💡

    Gather General Context of a Project (No Prompt):
    Bash

python confluence_v2.py ./my_project

(Uses project_wide preset and accurate mode by default if sentence-transformers is available)

Search for "User Authentication Logic" (Text Prompt, Fast Mode):
Bash

python confluence_v2.py ./my_webapp "User authentication flow and security measures" -m fast

Use a Prompt from a File (Accurate Mode, Custom LLM Task):
Create my_prompt.txt with your detailed query.
Bash

# my_prompt.txt content:
# Analyze the primary data processing pipeline in this project.
# Focus on its efficiency, error handling, and potential bottlenecks.
# How can the data validation steps be improved?

python confluence_v2.py ./data_etl_project my_prompt.txt -m accurate --llm-task "Provide a detailed review of the data pipeline based on the prompt's focus areas."

Focus on Python Code, Strip Comments, Output Raw Context (No LLM Template):
Bash

python confluence_v2.py ./python_lib "core algorithms" --preset code_only --strip-com --no-llm-template -of raw_context.txt

Include Specific Files, Change Output Paths & Token Limit:
Bash

python confluence_v2.py ./k8s_configs "Service A deployment" \
    --include-ext .yaml,Dockerfile \
    -oj service_a_analysis.json \
    -of service_a_prompt.txt \
    -mft 50000

Debug a Run with Max Verbosity:
Bash

    python confluence_v2.py ./my_project "complex feature X" --log-level DEBUG

Quick Tips & Notes 📌

    --mode accurate: Provides the best semantic relevance but requires pip install sentence-transformers and can be slower (downloads a model on first run).
    search_prompt_or_file_path vs. --llm-task: The first helps find relevant files; the second tells the LLM what to do with the context.
    Token Limits: Adjust --max-flat-tokens for your LLM. Stripping comments (--strip-com) and minifying whitespace (--minify-ws) can help reduce token count.
    JSON Output: Always check the JSON output to understand exactly what context was built and why files might have been included or excluded.
    LLM System Prompt: The default LLM template encourages the AI to ask for missing information, which is crucial for high-quality, non-hallucinated responses.
    Experiment! The best settings depend on your project and your specific goals.

Happy Context Building! 🧠🛠️