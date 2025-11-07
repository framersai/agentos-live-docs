/** 
 * Self-contained prompts for single persona conversations.
 * No external context required - all inputs provided inline.
 */
export const EXAMPLE_PROMPTS: string[] = [
  "Calculate fibonacci(20) and explain the time complexity",
  "Write a function that reverses a string without using .reverse()",
  "Explain the difference between const, let, and var in JavaScript",
  "Sort these numbers ascending: 42, 7, 93, 15, 8, 61, 3",
  "Find all prime numbers between 1 and 100",
  "Convert 'hello world' to title case, camelCase, and snake_case",
  "Explain how HTTP cookies work in 3 paragraphs",
  "Calculate the area and perimeter of a rectangle: width=12, height=7",
  "List 5 ways to optimize a slow SQL query",
  "Convert 1024 bytes to KB, MB, and GB",
  "Explain what happens when you type 'google.com' in a browser",
  "Write a regex that matches valid email addresses",
  "Compare merge sort vs quick sort: time complexity, space, stability",
  "Generate a random UUID v4 and explain its format",
  "Explain the CAP theorem with database examples",
  "Calculate compound interest: $10,000 at 5% annual for 10 years",
  "List the 7 layers of the OSI model with examples",
  "Convert RGB(255, 87, 51) to hexadecimal color code",
  "Explain how JWT authentication works with diagrams",
  "Parse this JSON and extract all email values: {\"users\":[{\"email\":\"a@b.c\"},{\"email\":\"x@y.z\"}]}",
  "Calculate how many seconds in 30 days",
  "Explain the difference between TCP and UDP",
  "Generate 5 strong password examples (12+ chars, mixed case, numbers, symbols)",
  "Compare REST vs GraphQL vs gRPC in a table",
  "Calculate the factorial of 12",
  "Explain how DNS resolution works step-by-step",
  "Convert timestamp 1699392000 (unix seconds) to human-readable date",
  "List all HTTP status codes in the 4xx range with meanings",
  "Explain how git merge differs from git rebase",
  "Calculate average of [15, 23, 8, 42, 31, 19]",
];

/** 
 * Self-contained agency prompts showing multi-GMI coordination.
 * Each role gets specific, grounded tasks with NO external context needed.
 * Currently only first seat responds (workflow start endpoint not wired).
 */
export const AGENCY_EXAMPLE_PROMPTS: string[] = [
  "[Mathematician] Calculate fibonacci(30), [Analyst] identify pattern in sequence, [Teacher] explain recursion vs iteration tradeoffs",
  "[Researcher] List 10 sorting algorithms with O(n) notation, [Coder] implement quicksort in TypeScript, [Tester] write test cases",
  "[Architect] Design REST API for todo app (CRUD endpoints), [Developer] write OpenAPI 3.0 spec, [QA] create curl test commands",
  "[Linguist] Analyze etymology of 'serendipity', [Poet] write haiku about it, [Teacher] create 3 example sentences",
  "[Chef] Create recipe for chocolate chip cookies (exact measurements), [Nutritionist] calculate calories per cookie, [Writer] format as markdown card",
  "[Cartographer] List all continents by size (km²), [Statistician] calculate total land area, [Visualizer] create ASCII art world map",
  "[Economist] Explain compound interest formula, [Calculator] compute $5000 at 7% for 15 years monthly, [Teacher] show work step-by-step",
  "[Chemist] Write balanced equation for photosynthesis, [Biologist] explain each molecule's role, [Artist] create ASCII diagram of process",
  "[Physicist] Derive E=mc², [Mathematician] show dimensional analysis, [Teacher] explain each symbol with units",
  "[Cryptographer] Generate 3 UUID v4s, [Analyst] calculate collision probability for 1 billion UUIDs, [Developer] write validation regex",
  "[Astronomer] List planets by distance from sun (million km), [Mathematician] calculate orbital period ratios, [Writer] create comparison table",
  "[Musician] Explain musical intervals (semitones), [Mathematician] calculate frequency ratio for perfect fifth, [Teacher] show on piano keyboard ASCII art",
  "[Logician] Create truth table for (A AND B) OR C, [Programmer] implement as TypeScript function, [Tester] generate all 8 test cases",
  "[Geometer] Calculate area/volume formulas for sphere, [Mathematician] derive them from calculus, [Visualizer] create ASCII cross-section",
  "[Colorist] Convert RGB(72, 209, 204) to HSL and hex, [Designer] suggest 5 complementary colors, [Developer] write CSS with color variables",
];


