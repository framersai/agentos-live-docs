#!/usr/bin/env python3
"""
Wiki Generator Script

This script recursively walks through directories to find README and .md files,
then generates a comprehensive wiki structure with automatic TOC generation.

Features:
- Recursively finds all .md and README files
- Ignores common non-source directories
- Generates main index with README files prioritized
- Creates TOC for all markdown files found
- Supports relative linking
- Configurable output options

Usage:
    python wiki_generator.py [--root-dir PATH] [--output-file FILENAME] [--generate-toc] [--max-depth N]
"""

import os
import re
import argparse
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Set
from dataclasses import dataclass
from urllib.parse import quote


@dataclass
class MarkdownFile:
    """Represents a markdown file with metadata"""
    path: Path
    relative_path: Path
    name: str
    title: str
    is_readme: bool
    depth: int
    headings: List[Tuple[int, str]]  # (level, text)
    

class WikiGenerator:
    """Main class for generating wiki documentation"""
    
    # Directories to ignore during traversal
    IGNORED_DIRS = {
        '.git', '.svn', '.hg',  # Version control
        'node_modules', '__pycache__', '.pytest_cache',  # Dependencies/cache
        'build', 'dist', 'out', 'target',  # Build outputs
        '.vscode', '.idea', '.vs',  # IDE files
        'venv', 'env', '.env', 'virtualenv',  # Virtual environments
        'logs', 'tmp', 'temp', 'cache',  # Temporary files
        '.next', '.nuxt', '.vercel',  # Framework specific
        'coverage', '.nyc_output',  # Coverage reports
        'assets', 'static', 'public',  # Static assets (configurable)
        'vendor', 'third_party', 'external',  # Third party code
    }
    
    # File extensions to consider as markdown
    MD_EXTENSIONS = {'.md', '.markdown', '.mdown', '.mkd'}
    
    # README filename patterns (case insensitive)
    README_PATTERNS = {
        'readme.md', 'readme.markdown', 'readme.txt', 'readme.rst',
        'readme', 'index.md', 'index.markdown'
    }
    
    def __init__(self, root_dir: str = ".", max_depth: Optional[int] = None):
        self.root_dir = Path(root_dir).resolve()
        self.max_depth = max_depth
        self.files: List[MarkdownFile] = []
        
    def should_ignore_directory(self, dir_path: Path) -> bool:
        """Check if directory should be ignored"""
        dir_name = dir_path.name.lower()
        return (
            dir_name in self.IGNORED_DIRS or
            dir_name.startswith('.') and dir_name not in {'.github', '.vscode'} or
            dir_name.startswith('_') and dir_name != '_docs'
        )
    
    def is_markdown_file(self, file_path: Path) -> bool:
        """Check if file is a markdown file"""
        return (
            file_path.suffix.lower() in self.MD_EXTENSIONS or
            file_path.name.lower() in self.README_PATTERNS
        )
    
    def is_readme_file(self, file_path: Path) -> bool:
        """Check if file is a README file"""
        name_lower = file_path.name.lower()
        return any(pattern in name_lower for pattern in ['readme', 'index'])
    
    def extract_title_from_content(self, content: str, filename: str) -> str:
        """Extract title from markdown content or use filename"""
        lines = content.split('\n')
        
        # Look for first H1 heading
        for line in lines[:10]:  # Check first 10 lines
            line = line.strip()
            if line.startswith('# '):
                return line[2:].strip()
        
        # Fallback to filename without extension
        return filename.replace('.md', '').replace('.markdown', '').replace('_', ' ').replace('-', ' ').title()
    
    def extract_headings(self, content: str) -> List[Tuple[int, str]]:
        """Extract all headings from markdown content"""
        headings = []
        lines = content.split('\n')
        
        for line in lines:
            line = line.strip()
            if line.startswith('#'):
                # Count the number of # characters
                level = 0
                for char in line:
                    if char == '#':
                        level += 1
                    else:
                        break
                
                if 1 <= level <= 6 and line[level:].strip():
                    heading_text = line[level:].strip()
                    # Remove any trailing #
                    heading_text = heading_text.rstrip('#').strip()
                    headings.append((level, heading_text))
        
        return headings
    
    def calculate_depth(self, file_path: Path) -> int:
        """Calculate directory depth relative to root"""
        try:
            relative_path = file_path.relative_to(self.root_dir)
            return len(relative_path.parts) - 1  # Subtract 1 for the file itself
        except ValueError:
            return 0
    
    def scan_directory(self) -> None:
        """Recursively scan directory for markdown files"""
        print(f"Scanning directory: {self.root_dir}")
        
        for root, dirs, files in os.walk(self.root_dir):
            root_path = Path(root)
            current_depth = self.calculate_depth(root_path)
            
            # Skip if max depth exceeded
            if self.max_depth and current_depth > self.max_depth:
                continue
            
            # Filter out ignored directories
            dirs[:] = [d for d in dirs if not self.should_ignore_directory(root_path / d)]
            
            for file in files:
                file_path = root_path / file
                
                if self.is_markdown_file(file_path):
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                        
                        relative_path = file_path.relative_to(self.root_dir)
                        title = self.extract_title_from_content(content, file_path.stem)
                        headings = self.extract_headings(content)
                        is_readme = self.is_readme_file(file_path)
                        depth = self.calculate_depth(file_path)
                        
                        md_file = MarkdownFile(
                            path=file_path,
                            relative_path=relative_path,
                            name=file_path.name,
                            title=title,
                            is_readme=is_readme,
                            depth=depth,
                            headings=headings
                        )
                        
                        self.files.append(md_file)
                        print(f"Found: {relative_path}")
                        
                    except Exception as e:
                        print(f"Warning: Could not read {file_path}: {e}")
        
        print(f"Found {len(self.files)} markdown files")
    
    def generate_anchor(self, text: str) -> str:
        """Generate GitHub-style anchor from heading text"""
        # Convert to lowercase, replace spaces and special chars with hyphens
        anchor = re.sub(r'[^\w\s-]', '', text.lower())
        anchor = re.sub(r'[\s_-]+', '-', anchor)
        anchor = anchor.strip('-')
        return anchor
    
    def generate_relative_link(self, target_file: MarkdownFile, from_depth: int = 0) -> str:
        """Generate relative link to target file"""
        # Convert backslashes to forward slashes for cross-platform compatibility
        link_path = str(target_file.relative_path).replace('\\', '/')
        
        # URL encode any special characters
        link_path = quote(link_path, safe='/')
        
        return link_path
    
    def generate_directory_tree(self) -> str:
        """Generate a directory tree structure"""
        tree_lines = ["## 📁 Directory Structure\n"]
        
        # Group files by directory
        dir_files: Dict[str, List[MarkdownFile]] = {}
        
        for file in sorted(self.files, key=lambda x: (x.relative_path.parent, x.name)):
            dir_path = str(file.relative_path.parent)
            if dir_path not in dir_files:
                dir_files[dir_path] = []
            dir_files[dir_path].append(file)
        
        # Generate tree
        for dir_path in sorted(dir_files.keys()):
            if dir_path == '.':
                tree_lines.append("### Root Directory\n")
            else:
                depth = dir_path.count('/')
                indent = "  " * depth
                tree_lines.append(f"{indent}- **{dir_path.split('/')[-1]}/**")
            
            # Add files in this directory
            for file in dir_files[dir_path]:
                indent = "  " * (file.depth + 1)
                icon = "📖" if file.is_readme else "📄"
                link = self.generate_relative_link(file)
                tree_lines.append(f"{indent}- {icon} [{file.title}]({link})")
        
        return "\n".join(tree_lines) + "\n\n"
    
    def generate_main_index(self) -> str:
        """Generate main index with README files prioritized"""
        content = [
            "# 📚 Documentation Wiki\n",
            f"*Generated from: `{self.root_dir}`*\n",
            f"*Total files: {len(self.files)}*\n\n",
        ]
        
        # Separate README files and regular files
        readme_files = [f for f in self.files if f.is_readme]
        regular_files = [f for f in self.files if not f.is_readme]
        
        # Sort by depth and name
        readme_files.sort(key=lambda x: (x.depth, x.name))
        regular_files.sort(key=lambda x: (x.depth, x.name))
        
        if readme_files:
            content.append("## 📖 Main Documentation\n")
            for file in readme_files:
                link = self.generate_relative_link(file)
                depth_indicator = "  " * file.depth
                content.append(f"{depth_indicator}- **[{file.title}]({link})**")
                if file.relative_path.parent != Path('.'):
                    content.append(f" *({file.relative_path.parent})*")
            content.append("\n")
        
        if regular_files:
            content.append("## 📄 Other Documentation\n")
            
            # Group by directory for better organization
            current_dir = None
            for file in regular_files:
                file_dir = file.relative_path.parent
                
                if file_dir != current_dir:
                    if file_dir != Path('.'):
                        content.append(f"\n### {file_dir}\n")
                    current_dir = file_dir
                
                link = self.generate_relative_link(file)
                content.append(f"- [{file.title}]({link})")
            content.append("\n")
        
        return "\n".join(content)
    
    def generate_toc_for_file(self, file: MarkdownFile) -> str:
        """Generate table of contents for a specific file"""
        if not file.headings:
            return ""
        
        toc_lines = ["## Table of Contents\n"]
        
        for level, heading in file.headings:
            if level == 1:  # Skip H1 as it's usually the title
                continue
                
            indent = "  " * (level - 2)  # Adjust indentation
            anchor = self.generate_anchor(heading)
            toc_lines.append(f"{indent}- [{heading}](#{anchor})")
        
        return "\n".join(toc_lines) + "\n\n"
    
    def generate_comprehensive_toc(self) -> str:
        """Generate comprehensive TOC for all files"""
        content = [
            "# 📋 Complete Table of Contents\n",
            "*Comprehensive overview of all documentation with section links*\n\n"
        ]
        
        for file in sorted(self.files, key=lambda x: (x.depth, x.is_readme, x.name)):
            link = self.generate_relative_link(file)
            icon = "📖" if file.is_readme else "📄"
            
            # File header
            content.append(f"## {icon} [{file.title}]({link})")
            
            # Add path info
            if file.relative_path.parent != Path('.'):
                content.append(f"*Path: `{file.relative_path}`*")
            
            # Add headings if any
            if file.headings:
                for level, heading in file.headings:
                    if level == 1:  # Skip main title
                        continue
                    indent = "  " * (level - 1)
                    anchor = self.generate_anchor(heading)
                    content.append(f"{indent}- [{heading}]({link}#{anchor})")
            else:
                content.append("*No sections found*")
            
            content.append("")  # Empty line between files
        
        return "\n".join(content)
    
    def generate_wiki_content(self, include_toc: bool = False, include_tree: bool = True) -> str:
        """Generate complete wiki content"""
        content = []
        
        # Main index
        content.append(self.generate_main_index())
        
        # Directory tree
        if include_tree:
            content.append(self.generate_directory_tree())
        
        # Comprehensive TOC
        if include_toc:
            content.append("---\n")
            content.append(self.generate_comprehensive_toc())
        
        # Footer
        content.append("---\n")
        content.append("*This wiki was automatically generated by the Wiki Generator script.*\n")
        content.append(f"*Last updated: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*")
        
        return "\n".join(content)


def main():
    """Main function with CLI interface"""
    parser = argparse.ArgumentParser(
        description="Generate wiki documentation from markdown files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python wiki_generator.py
  python wiki_generator.py --root-dir ./src --output-file docs/WIKI.md
  python wiki_generator.py --generate-toc --max-depth 3
  python wiki_generator.py --no-tree --output-file INDEX.md
        """
    )
    
    parser.add_argument(
        '--root-dir', '-r',
        default='.',
        help='Root directory to scan (default: current directory)'
    )
    
    parser.add_argument(
        '--output-file', '-o',
        default='WIKI.md',
        help='Output filename (default: WIKI.md)'
    )
    
    parser.add_argument(
        '--generate-toc', '-t',
        action='store_true',
        help='Generate comprehensive table of contents'
    )
    
    parser.add_argument(
        '--no-tree',
        action='store_true',
        help='Skip directory tree generation'
    )
    
    parser.add_argument(
        '--max-depth', '-d',
        type=int,
        help='Maximum directory depth to scan'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose output'
    )
    
    args = parser.parse_args()
    
    # Create wiki generator
    generator = WikiGenerator(args.root_dir, args.max_depth)
    
    # Scan for files
    generator.scan_directory()
    
    if not generator.files:
        print("No markdown files found!")
        return
    
    # Generate wiki content
    wiki_content = generator.generate_wiki_content(
        include_toc=args.generate_toc,
        include_tree=not args.no_tree
    )
    
    # Write output
    output_path = Path(args.output_file)
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(wiki_content)
        
        print(f"\n✅ Wiki generated successfully!")
        print(f"📄 Output: {output_path.resolve()}")
        print(f"📊 Files processed: {len(generator.files)}")
        
        if args.verbose:
            print("\nFiles included:")
            for file in generator.files:
                status = "📖 README" if file.is_readme else "📄 MD"
                print(f"  {status} {file.relative_path}")
        
    except Exception as e:
        print(f"❌ Error writing output file: {e}")


if __name__ == "__main__":
    main()