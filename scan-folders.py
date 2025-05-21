#!/usr/bin/env python3
import os
import sys
import argparse
import json

# Default directories/files to ignore
DEFAULT_IGNORE = {
    'node_modules',
    'venv',
    '.venv',
    'env',
    '__pycache__',
    '.git',
    '.idea',
    '.vscode',
    'dist',
    'build',
    '.DS_Store',
    '.pytest_cache',
    '.coverage',
    '.tox',
    'htmlcov',
    '*.pyc',
    '*.pyo',
    '*.pyd',
    '.ipynb_checkpoints'
}

def should_ignore(path, ignore_patterns):
    """
    Check if a path should be ignored based on the ignore patterns.
    """
    path_name = os.path.basename(path)
    
    # Check if the path matches any of the ignore patterns
    for pattern in ignore_patterns:
        # Exact match for directory/file name
        if pattern == path_name:
            return True
        # Handle wildcard patterns (e.g., *.pyc)
        if pattern.startswith('*') and path_name.endswith(pattern[1:]):
            return True
    
    return False

def build_directory_tree(dir_path, ignore_patterns):
    """
    Recursively builds a dictionary representing the directory tree structure,
    ignoring specified patterns.
    """
    abs_path = os.path.abspath(dir_path)
    node_name = os.path.basename(abs_path)

    if not node_name and abs_path.endswith(os.path.sep):  # Handle root like "/" or "C:\"
        node_name = abs_path

    tree_node = {
        "type": "directory",
        "name": node_name,
        "path": abs_path,
        "children": []
    }

    try:
        with os.scandir(abs_path) as entries:
            for entry in entries:
                if should_ignore(entry.path, ignore_patterns):
                    continue
                
                entry_abs_path = os.path.abspath(entry.path)
                if entry.is_dir(follow_symlinks=False):
                    tree_node["children"].append(build_directory_tree(entry_abs_path, ignore_patterns))
                elif entry.is_file(follow_symlinks=False):
                    tree_node["children"].append({
                        "type": "file",
                        "name": entry.name,
                        "path": entry_abs_path
                    })
    except OSError as e:
        tree_node["error"] = f"Could not scan directory: {str(e)}"

    tree_node["children"].sort(key=lambda x: (x["type"] != "directory", x["name"].lower()))
    return tree_node

def get_flat_relative_file_list(dir_path, ignore_patterns):
    """
    Walks a directory and returns a sorted flat list of relative file paths
    from the given dir_path, using '/' as path separator.
    Skips ignored directories and files.
    """
    abs_root_path = os.path.abspath(dir_path)
    relative_file_paths = []

    for root, dirs, files in os.walk(abs_root_path, topdown=True, onerror=None, followlinks=False):
        # Remove ignored directories from the dirs list to prevent walking them
        dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d), ignore_patterns)]
        
        # Sort dirs and files for consistent order
        dirs.sort()
        files.sort()
        
        for filename in files:
            file_path = os.path.join(root, filename)
            if should_ignore(file_path, ignore_patterns):
                continue
                
            relative_path = os.path.relpath(file_path, abs_root_path)
            # Normalize path separators to '/' for consistency
            relative_file_paths.append(relative_path.replace(os.sep, '/'))

    relative_file_paths.sort()  # Final sort of all collected paths
    return relative_file_paths

def main():
    parser = argparse.ArgumentParser(
        description="Scan a directory and output its structure in JSON format.",
        formatter_class=argparse.RawTextHelpFormatter,
        epilog="""
Example usage:
  %(prog)s /path/to/your/folder
  %(prog)s .
  %(prog)s /path/to/your/folder --format hierarchical
  %(prog)s /path/to/your/folder --format flat
  %(prog)s /path/to/your/folder --ignore "logs,temp,cache"

Output Formats:
  hierarchical: Detailed JSON tree of directories and files (default).
  flat:         Minimized JSON list of relative file paths to save LLM tokens.
        """
    )
    parser.add_argument(
        "folder_path",
        type=str,
        help="The path to the root folder to scan."
    )
    parser.add_argument(
        "--format",
        type=str,
        choices=['hierarchical', 'flat'],
        default='hierarchical',
        help="Output format. 'hierarchical' (default) or 'flat'."
    )
    parser.add_argument(
        "--ignore",
        type=str,
        default="",
        help="Comma-separated list of additional folders/files to ignore."
    )
    parser.add_argument(
        "--no-default-ignore",
        action="store_true",
        help="Disable default ignore patterns (node_modules, venv, etc.)."
    )
    args = parser.parse_args()

    target_path = args.folder_path
    abs_target_path = os.path.abspath(target_path)

    if not os.path.exists(abs_target_path):
        print(f"Error: Path '{abs_target_path}' does not exist.", file=sys.stderr)
        sys.exit(1)

    if not os.path.isdir(abs_target_path):
        print(f"Error: Path '{abs_target_path}' is not a directory.", file=sys.stderr)
        sys.exit(1)

    # Build the set of patterns to ignore
    ignore_patterns = set()
    if not args.no_default_ignore:
        ignore_patterns.update(DEFAULT_IGNORE)
    
    if args.ignore:
        # Add user-specified ignore patterns
        user_ignores = [item.strip() for item in args.ignore.split(',') if item.strip()]
        ignore_patterns.update(user_ignores)

    output_data = {}
    try:
        scan_info = {
            "root_requested": target_path,
            "root_absolute": abs_target_path,
            "ignored_patterns": sorted(list(ignore_patterns))
        }

        if args.format == 'flat':
            scan_info["format"] = "flat_relative_file_list"
            file_list = get_flat_relative_file_list(abs_target_path, ignore_patterns)
            output_data = {
                "scan_info": scan_info,
                "files": file_list
            }
        else:  # 'hierarchical'
            scan_info["format"] = "hierarchical_tree"
            directory_structure = build_directory_tree(abs_target_path, ignore_patterns)
            output_data = {
                "scan_info": scan_info,
                "directory_tree": directory_structure
            }

        print(json.dumps(output_data, indent=2))

    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()