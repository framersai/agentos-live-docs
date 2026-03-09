/**
 * Common chat prompts to test on both CLIs for comparison.
 */

import type { ChatPrompt } from '../lib/types.js';

export const CHAT_PROMPTS: ChatPrompt[] = [
  {
    id: 'greeting',
    prompt: 'Hello! What can you help me with?',
    description: 'Basic greeting — tests personality and introduction style',
    timeoutMs: 30000,
  },
  {
    id: 'web-search',
    prompt: 'Search the web for the latest news about AI agents in 2026',
    description: 'Web search tool invocation — tests tool calling',
    timeoutMs: 45000,
  },
  {
    id: 'code-gen',
    prompt: 'Write a Python function that calculates Fibonacci numbers using memoization',
    description: 'Code generation — tests LLM output quality',
    timeoutMs: 30000,
  },
  {
    id: 'multi-step',
    prompt: "Find a funny GIF about programming and tell me why it's funny",
    description: 'Multi-tool chain — tests Giphy + reasoning',
    timeoutMs: 45000,
  },
];
