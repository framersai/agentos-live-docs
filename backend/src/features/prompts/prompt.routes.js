import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __projectRoot = path.resolve(path.dirname(__filename), '../../../..');
const PROMPT_DIR = path.join(__projectRoot, 'backend/prompts');

export async function GET(req, res) {
  try {
    const { filename } = req.params;

    if (!filename || !filename.endsWith('.md')) {
      res.status(400).json({ message: 'Filename must be a .md file.' });
      return;
    }

    const filePath = path.join(PROMPT_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');

    res.status(200).type('text/markdown').send(content);
  } catch (error) {
    console.error('PromptRoutes: Failed to serve markdown file:', error.message);
    res.status(404).json({ message: 'Prompt file not found.', error: error.message });
  }
}
