// File: frontend/src/services/agent.service.ts
/**
 * @file agent.service.ts
 * @description Defines available AI agents, their configurations, and capabilities.
 * Manages the registry of agents for the application, including mapping to dedicated view components.
 * @version 1.5.0 - Significantly expanded examplePrompts for all functional agents.
 */

import type { Component as VueComponentType } from 'vue';
import {
  ChatBubbleLeftEllipsisIcon,
  CodeBracketSquareIcon,
  UserCircleIcon,
  BookOpenIcon,
  CpuChipIcon,
  AcademicCapIcon,
  DocumentMagnifyingGlassIcon,
  BriefcaseIcon,
  CogIcon,
  SparklesIcon,
  PresentationChartLineIcon,
} from '@heroicons/vue/24/outline';

export type AgentId =
  | 'general_chat'
  | 'public-quick-helper'
  | 'coding_assistant'
  | 'system_designer'
  | 'meeting_summarizer'
  | 'diary_agent'
  | 'coding_interviewer'
  | 'tutor_agent'
  | 'lc_audit_aide'
  // Placeholder/System IDs
  | 'private-dashboard-placeholder'
  | 'rate-limit-exceeded'
  | 'public-welcome-placeholder'
  | 'no-public-agents-placeholder'
  | 'system-error'
  // Legacy/Alias IDs
  | 'general'
  | 'general-ai';

export interface IDetailedCapabilityItem {
  id: string;
  label: string;
  description?: string;
  icon?: VueComponentType | string;
}

export interface IAgentCapability {
  canGenerateDiagrams?: boolean;
  usesCompactRenderer?: boolean;
  acceptsVoiceInput?: boolean;
  maxChatHistory?: number;
  handlesOwnInput?: boolean;
  showEphemeralChatLog?: boolean;
}

export type AgentCategory = 'General' | 'Coding' | 'Productivity' | 'Learning' | 'Auditing' | 'Experimental' | 'Utility';

export interface IAgentDefinition {
  id: AgentId;
  label: string;
  description: string;
  longDescription?: string;
  iconComponent?: VueComponentType | string;
  iconClass?: string;
  avatar?: string;
  iconPath?: string;
  systemPromptKey: string; // Should always be present
  category: AgentCategory;
  capabilities: IAgentCapability;
  examplePrompts?: string[];
  tags?: string[];
  detailedCapabilities?: IDetailedCapabilityItem[];
  inputPlaceholder?: string;
  isPublic: boolean;
  accessTier?: 'public' | 'member' | 'premium';
  themeColor?: string;
  holographicElement?: string;
  defaultVoicePersona?: string | { name?: string, voiceId?: string, lang?: string };
  isBeta?: boolean;
  viewComponentName?: string; // Name of the dedicated Vue component for this agent's UI
}

// --- Expanded Example Prompts ---

const generalChatPrompts: string[] = [
  "What's the capital of Japan?",
  "Explain the theory of relativity simply.",
  "How do I make a good cup of coffee?",
  "Tell me a fun fact about the ocean.",
  "What are the main ingredients in a Margherita pizza?",
  "How tall is Mount Everest?",
  "Who wrote 'Pride and Prejudice'?",
  "What's the weather like in London today?",
  "Give me a recipe for chocolate chip cookies.",
  "Explain the difference between a democracy and a republic.",
  "What are some famous landmarks in Paris?",
  "How does photosynthesis work?",
  "Who was Leonardo da Vinci?",
  "What is the currency of Brazil?",
  "Tell me about the Roman Empire.",
  "How many planets are in our solar system?",
  "What is the boiling point of water in Celsius?",
  "Suggest a good book to read this month.",
  "What are the symptoms of the common cold?",
  "How do I tie a Windsor knot?",
  "Explain the concept of cryptocurrency.",
  "Who won the FIFA World Cup in 2022?",
  "What are some tips for saving money?",
  "Tell me about the Great Wall of China.",
  "How does a car engine work?",
  "What are the benefits of meditation?",
  "Who invented the telephone?",
  "What is the chemical symbol for gold?",
  "Give me a quick summary of Hamlet.",
  "What are primary colors?",
  "How long does it take to fly from New York to Los Angeles?",
  "What is the internet?",
  "Can you recommend a good movie for family night?",
  "What are the different types of renewable energy?",
  "Who is the current President of the United States?",
  "Explain black holes.",
  "What are the Seven Wonders of the Ancient World?",
  "How do I change a flat tire?",
  "What is the meaning of 'carpe diem'?",
  "Tell me a joke.",
  "What are the basic rules of chess?",
  "How is honey made?",
  "What's the speed of light?",
  "Who painted the Mona Lisa?",
  "What are some healthy breakfast ideas?",
  "Explain the water cycle.",
  "What is quantum entanglement?",
  "Can you give me a random number between 1 and 100?",
  "What are the main causes of climate change?",
  "Who discovered penicillin?",
  "What is the largest animal on Earth?",
  "How do I improve my public speaking skills?",
  "What are some common logical fallacies?",
  "Tell me about the French Revolution.",
  "What is the purpose of the United Nations?",
  "How does a microwave oven work?",
  "What are some synonyms for 'happy'?",
  "What are the different blood types?",
  "Explain the stock market for a beginner.",
  "Who was Cleopatra?",
  "What is the significance of the Rosetta Stone?",
  "How do I start learning a new language?",
  "What are some famous classical music composers?",
  "Tell me about a recent scientific discovery.",
  "What is the official language of Australia?",
  "How can I be more productive?",
  "What are the stages of sleep?",
  "Explain the Pythagorean theorem.",
  "Who wrote '1984'?",
  "What are some good exercises for back pain?",
  "What is a leap year?",
  "How do computers store information?",
  "Tell me about the history of jazz music.",
  "What are the pros and cons of social media?",
  "How do I write a resume?",
  "What is the capital of Canada?",
  "Explain the concept of artificial intelligence."
];

const quickHelperPrompts: string[] = [
  "What time is it in New York?",
  "Convert 100 USD to EUR.",
  "Spell 'onomatopoeia'.",
  "Define 'serendipity'.",
  "Boiling point of water?",
  "Capital of France?",
  "2 + 2?",
  "How many days in June?",
  "What's today's date?",
  "Largest planet?",
  "Chemical symbol for water?",
  "Meaning of 'LOL'?",
  "Is it going to rain today in Las Vegas?",
  "Quick translation of 'hello' to Spanish?",
  "Who is the CEO of SpaceX?",
  "What is 5 factorial?",
  "What's a synonym for 'fast'?",
  "Antonym for 'hot'?",
  "How many ounces in a pound?",
  "What is the square root of 64?",
  "Who painted Starry Night?",
  "What currency does Japan use?",
  "How many continents are there?",
  "Is Pluto a planet?",
  "What's a common abbreviation for 'Doctor'?",
  "What does 'FAQ' stand for?",
  "How many sides does a hexagon have?",
  "What is the color of the sky?",
  "What's the main ingredient in bread?",
  "Who wrote Romeo and Juliet?",
  "What is the current year?",
  "How do I say 'thank you' in French?",
  "What is the chemical formula for salt?",
  "Fastest land animal?",
  "What does USB stand for?"
];

const codingAssistantPrompts: string[] = [
  "How to implement quicksort in Python?",
  "Debug this C++ snippet: [paste snippet here]",
  "Explain JavaScript closures.",
  "What are the differences between 'let', 'const', and 'var' in JavaScript?",
  "How do I create a class in Java?",
  "Write a Python function to reverse a string.",
  "Explain REST API principles.",
  "What is a Docker container?",
  "How to handle exceptions in C#?",
  "Generate a regular expression to validate an email.",
  "What is Object-Oriented Programming?",
  "Explain the concept of 'async/await' in Node.js.",
  "How do I connect to a MySQL database using PHP?",
  "What are common Git commands for branching?",
  "Write a simple 'Hello, World!' program in Go.",
  "How do I parse JSON in Swift?",
  "What is SQL injection and how to prevent it?",
  "Explain the difference between TCP and UDP.",
  "How to use CSS Flexbox for layout?",
  "What is a lambda function in Python?",
  "Write a unit test for this TypeScript function: [paste function here]",
  "How do I iterate over a map in C++?",
  "What are SOLID principles in software design?",
  "Explain Big O notation with an example.",
  "How to make an HTTP GET request in Ruby?",
  "What is middleware in the context of web frameworks?",
  "How to set up a virtual environment in Python?",
  "Write a SQL query to find all users with duplicate email addresses.",
  "What is the difference between an interface and an abstract class?",
  "How to manage state in a React application?",
  "Explain CORS (Cross-Origin Resource Sharing).",
  "Write a bash script to count files in a directory.",
  "What is the purpose of a 'finally' block in exception handling?",
  "How to use 'map', 'filter', and 'reduce' in JavaScript?",
  "What are microservices architecture?",
  "How do I declare and use a pointer in C?",
  "Explain dependency injection.",
  "How to sort an array of objects by a property in JavaScript?",
  "What is the difference between NoSQL and SQL databases?",
  "Write a Java method to find the factorial of a number.",
  "How to handle file uploads in Express.js?",
  "What are arrow functions in ES6?",
  "Explain the Event Loop in JavaScript.",
  "How to create a responsive navigation bar using HTML and CSS?",
  "What is polymorphism in OOP?",
  "Write a Python script to read data from a CSV file.",
  "How to use Promises in JavaScript?",
  "What is version control and why is it important?",
  "Explain the concept of recursion using a Python example.",
  "How to style a button with rounded corners using CSS?",
  "What are data structures like arrays, linked lists, and hash tables?",
  "How do I use environment variables in a Node.js application?",
  "Write a function to check if a string is a palindrome in C#.",
  "What is the purpose of an ORM (Object-Relational Mapper)?",
  "How to center a div both horizontally and vertically using CSS Grid?",
  "Explain the differences between GET and POST HTTP methods.",
  "What is a JWT (JSON Web Token) and how is it used for authentication?",
  "How to merge two sorted arrays in Java?",
  "What are some best practices for writing clean code?",
  "Explain the concept of 'this' keyword in JavaScript.",
  "How to perform CRUD operations using Python and SQLite?",
  "What is functional programming?",
  "How to set up a basic web server with Python's Flask?",
  "Explain the difference between '==' and '===' in JavaScript.",
  "What is lazy loading?",
  "How to read command line arguments in a Python script?",
  "What are API rate limits?",
  "Write a simple web scraper in Python using BeautifulSoup.",
  "Explain the concept of prototypal inheritance in JavaScript.",
  "How to use media queries in CSS for responsive design?",
  "What is a CDN (Content Delivery Network)?",
  "How to create and use modules in Python?",
  "What are design patterns? Give an example of the Factory pattern.",
  "How do I work with dates and times in Java?",
  "Explain how SSL/TLS works to secure web communication."
];

const systemDesignerPrompts: string[] = [
  "Design a URL shortening service like bit.ly.",
  "How would you design a real-time chat application?",
  "Outline the architecture for a video streaming platform like Netflix.",
  "Design a distributed key-value store.",
  "What are the components of a food delivery app like Uber Eats?",
  "Design an API for a weather service.",
  "How would you architect a social media feed system like Twitter's timeline?",
  "Design a system for online ticket booking.",
  "What considerations are important for designing a scalable e-commerce website?",
  "Outline the architecture for a recommendation engine.",
  "Design a system to handle flash sales or high-traffic events.",
  "How would you design a search engine for a large document corpus?",
  "Design a distributed task scheduler.",
  "What are the trade-offs between microservices and monolithic architectures?",
  "Design a logging and monitoring system for a large-scale application.",
  "How to ensure high availability for a critical web service?",
  "Design a system for processing large volumes of IoT data.",
  "What are different database sharding strategies?",
  "Design a caching layer for a web application.",
  "How would you design a global leaderboard for a game?",
  "Outline the architecture for a ride-sharing app like Uber.",
  "Design a system for detecting plagiarism in documents.",
  "What are the key considerations for API security in a distributed system?",
  "Design a content delivery network (CDN).",
  "How would you handle data consistency in a distributed database system?",
  "Design an online code collaboration platform like Google Docs.",
  "What are different load balancing techniques?",
  "Design a system for personalized news aggregation.",
  "How to design a fault-tolerant system?",
  "Outline the architecture for a cloud storage service like Dropbox.",
  "Design a job processing queue.",
  "What are CAP theorem and its implications in system design?",
  "Design a system for tracking user analytics on a website.",
  "How would you approach designing a scalable notification system?",
  "Design a system for A/B testing features.",
  "What are the challenges in designing for multi-tenancy?",
  "Design an authentication and authorization system.",
  "How would you manage data replication across different regions?",
  "Design a rate limiting system for an API.",
  "What are the design considerations for a low-latency trading system?",
  "Design a web crawler.",
  "How to handle data migrations in a large-scale system?",
  "Design a system for managing online polls and surveys.",
  "What are the pros and cons of eventual consistency vs. strong consistency?",
  "Design a distributed message queue like Kafka.",
  "How would you design a system for managing digital coupons?",
  "Outline an architecture for a spam detection filter.",
  "Design a system that can handle a sudden surge of 10x traffic.",
  "What are common bottlenecks in web applications and how to address them?",
  "Design a password storage system with security best practices."
];

const meetingSummarizerPrompts: string[] = [
  "Summarize this meeting transcript: [paste transcript]",
  "Identify key decisions from these notes: [paste notes]",
  "Extract action items and owners from the following text: [paste text]",
  "Provide a concise summary of our marketing strategy discussion.",
  "What were the main outcomes of the project kickoff meeting?",
  "Generate a list of follow-up tasks based on this conversation.",
  "Condense this one-hour meeting into a 5-point summary.",
  "Who is responsible for what after our weekly sync?",
  "Summarize the client feedback from this call transcript.",
  "What were the main topics discussed in the Q3 planning session?",
  "Create a brief overview of the budget review meeting.",
  "Highlight any unresolved issues from this team huddle.",
  "Turn these rambling notes into a structured meeting summary.",
  "What are the next steps agreed upon in the design review?",
  "Summarize the arguments for and against the proposed feature.",
  "Extract all questions asked during this Q&A session.",
  "Provide a high-level summary of the sales team meeting.",
  "What commitments were made during the stakeholder update?",
  "Condense this project status update into key bullet points.",
  "Summarize the discussion points about the new product launch.",
  "Identify any risks or blockers mentioned in these notes.",
  "What was the consensus reached on the new UI design?",
  "Create a summary focusing on deadlines and timelines mentioned.",
  "Extract any assigned tasks with their due dates from this meeting log.",
  "Summarize the feedback received on the latest prototype.",
  "What were the key performance indicators discussed?",
  "Generate an executive summary from this lengthy meeting report.",
  "List all participants and their main contributions from this transcript.",
  "What solutions were proposed for the current production issue?",
  "Summarize the brainstorming session for new marketing slogans."
];

const diaryAgentPrompts: string[] = [
  "How was your day today?",
  "What's on your mind right now?",
  "Write about something you're grateful for.",
  "What's a challenge you faced recently and how did you handle it?",
  "Describe a goal you're working towards.",
  "What made you smile today?",
  "Reflect on a recent learning experience.",
  "Is there anything you're worried or anxious about?",
  "Write down three things you accomplished today.",
  "What are you looking forward to this week?",
  "Describe a place you'd love to visit and why.",
  "What's a book, movie, or song that resonated with you lately?",
  "Jot down some ideas that have been brewing.",
  "How are you feeling, really?",
  "What's a small act of kindness you witnessed or performed?",
  "Write about a childhood memory.",
  "What are your top priorities for tomorrow?",
  "Is there a decision you're mulling over?",
  "What does success mean to you right now?",
  "Describe a moment when you felt proud of yourself.",
  "What's something new you learned or tried?",
  "How can you take better care of yourself this week?",
  "Write a letter to your future self.",
  "What's a personal boundary you're trying to maintain?",
  "Reflect on your progress towards a long-term goal.",
  "What's a limiting belief you want to overcome?",
  "Describe a moment of peace or quiet you experienced.",
  "What inspires you?",
  "How can you make tomorrow a little bit better than today?",
  "What are you passionate about?",
  "Let's explore my feelings about a recent event.",
  "I need to vent about something frustrating.",
  "Help me process a difficult conversation I had.",
  "What are some of my strengths I can leverage?",
  "I want to set some intentions for the coming month.",
  "Let's brainstorm solutions to a problem I'm facing.",
  "Record my thoughts on the current project I'm working on.",
  "What are my hopes for the future?",
  "Reflect on my values and if I'm living by them.",
  "I need a space to just write freely without judgment."
];

const codingInterviewerPrompts: string[] = [
  "I'm ready for a mock coding interview.",
  "Give me a coding problem suitable for a junior developer.",
  "Can we do a data structures and algorithms question?",
  "Ask me an easy-level array manipulation problem.",
  "I'd like to practice a medium-difficulty string problem.",
  "Let's focus on tree traversal algorithms.",
  "Give me a problem that can be solved with dynamic programming.",
  "I want to try a graph algorithm question.",
  "Can you ask me a question about linked lists?",
  "Let's simulate a system design question for a junior role.",
  "Propose a coding challenge related to sorting.",
  "I'm looking for a problem that tests my understanding of hash maps.",
  "Present a scenario where I need to optimize code for performance.",
  "What's a common interview question about recursion?",
  "Let's simulate the first 20 minutes of a technical screen.",
  "Ask me to write a function and then discuss its time complexity.",
  "Give me a problem that involves bit manipulation.",
  "I'm ready for a Python-focused coding challenge.",
  "Can we work through a JavaScript-based problem?",
  "Let's try a Java interview question.",
  "Ask me a conceptual question about software engineering principles before the coding.",
  "I'm prepared for a challenging algorithm problem.",
  "Start with a warm-up coding question.",
  "Can you evaluate my approach to solving a problem?",
  "Let's discuss different solutions to a given problem.",
  "Give me a problem, I'll code it, then you provide feedback.",
  "I'd like to practice explaining my thought process as I code.",
  "Ask me about debugging a piece of code.",
  "Let's work on a problem involving stacks or queues.",
  "Give me a problem that might appear in a FAANG interview.",
  "I'm ready for a problem involving matrix manipulation.",
  "Can we cover a search algorithm, like binary search?",
  "Let's simulate a pair programming interview exercise.",
  "Test my knowledge of fundamental data structures.",
  "Ask me to design a simple class or API.",
  "Give me a problem that can be solved in multiple ways.",
  "I'm ready. Ask your first coding question.",
  "Challenge me with a problem that requires careful edge case handling.",
  "Let's do a whiteboard-style coding problem.",
  "Can you give me a problem where I have to write unit tests as well?"
];

const tutorAgentPrompts: string[] = [
  "Explain the basics of quantum physics.",
  "Teach me about the French Revolution.",
  "Can you help me understand calculus concepts like derivatives?",
  "I want to learn about ancient Egyptian mythology.",
  "Explain the process of cellular respiration.",
  "What are the key principles of macroeconomics?",
  "Teach me the fundamentals of music theory.",
  "I'm struggling with Python list comprehensions, can you explain?",
  "Let's review the causes of World War I.",
  "Can you explain Newton's Laws of Motion with examples?",
  "I want to understand how DNA replication works.",
  "Teach me about different types of chemical bonds.",
  "Explain the significance of the Renaissance period.",
  "Help me grasp the concept of machine learning.",
  "What are the main branches of philosophy?",
  "Let's discuss the theory of evolution by natural selection.",
  "Can you explain the structure of the Earth's atmosphere?",
  "I need help understanding Shakespearean sonnets.",
  "Teach me about the basics of astronomy and celestial bodies.",
  "What is the difference between mitosis and meiosis?",
  "Explain the core concepts of blockchain technology.",
  "I want to learn about the history of art in the 20th century.",
  "Can you break down the components of a good argumentative essay?",
  "Teach me about the human digestive system.",
  "What are the fundamental data structures in computer science?",
  "Explain the principles of supply and demand.",
  "Let's explore the works of famous philosophers like Plato and Aristotle.",
  "Can you teach me about different poetic devices?",
  "I want to understand the basics of electricity and circuits.",
  "Explain the importance of biodiversity.",
  "Teach me about the different forms of government.",
  "What are common logical fallacies I should be aware of?",
  "Let's dive into the history of the internet.",
  "Can you help me with stoichiometry in chemistry?",
  "Teach me about the major world religions.",
  "Explain the concept of compound interest.",
  "I want to learn how to analyze a historical document.",
  "What are the key elements of storytelling?",
  "Teach me about the basics of web development (HTML, CSS, JS).",
  "Explain the difference between weather and climate.",
  "Let's review the periodic table of elements.",
  "Can you help me understand literary themes in 'To Kill a Mockingbird'?",
  "Teach me about the scientific method.",
  "What are the different types of galaxies?",
  "Explain the basics of statistics, like mean, median, and mode.",
  "I want to learn about the Cold War.",
  "Can you explain the concept of 'algorithm' in simple terms?",
  "Teach me about the key figures of the Civil Rights Movement.",
  "What is the role of the Federal Reserve?",
  "Explain the basic principles of photography.",
  "Let's study the anatomy of the human brain.",
  "Can you teach me about impressionist painters?",
  "I want to understand the basics of genetics.",
  "Explain the concepts of force and motion.",
  "Teach me about the geography of South America.",
  "What are some key events in early American history?",
  "Can you help me prepare for a debate on renewable energy?",
  "Explain the theory of plate tectonics.",
  "I want to learn about different programming paradigms.",
  "Teach me about the solar system's planets in detail.",
  "What are the main features of Gothic architecture?",
  "Explain the basics of critical thinking.",
  "Let's discuss the impact of social media on society.",
  "Can you teach me how to solve quadratic equations?",
  "I want to learn about the key concepts in psychology.",
  "Explain the process of cloud formation.",
  "Teach me about the history of the Roman Republic.",
  "What are the ethical considerations in artificial intelligence?",
  "Can you help me understand the stock market basics?",
  "Explain the difference between eukaryotes and prokaryotes.",
  "Let's study the different ecosystems on Earth.",
  "Teach me about the main ideas of the Enlightenment.",
  "What are the functions of different parts of a plant?",
  "Explain the basics of cybersecurity.",
  "I want to learn about famous speeches in history.",
  "Can you help me improve my essay writing skills?",
  "Teach me about the layers of the ocean."
];

const lcAuditPrompts: string[] = [
  "Analyze LeetCode problem 20: Valid Parentheses.",
  "Provide a detailed breakdown of the 'Two Sum' problem (LC #1).",
  "Explain common pitfalls for LeetCode problem 15: 3Sum.",
  "Generate a visual slideshow for the solution to LC #206: Reverse Linked List.",
  "Give me an exhaustive commented code solution in Python for LC #53: Maximum Subarray.",
  "Compare different approaches (e.g., brute-force, optimal) for LC #121: Best Time to Buy and Sell Stock.",
  "Audit my Python solution for LC #70: Climbing Stairs. [provide solution]",
  "What are the time and space complexity for typical solutions to LC #21: Merge Two Sorted Lists?",
  "Discuss edge cases for LeetCode problem 'Median of Two Sorted Arrays'.",
  "Show me how dynamic programming applies to LC #322: Coin Change.",
  "Explain the sliding window technique with an example like LC #3: Longest Substring Without Repeating Characters.",
  "Provide hints for LeetCode problem 'Container With Most Water'.",
  "Analyze the constraints and potential optimizations for LC #42: Trapping Rain Water.",
  "Help me understand the intuition behind the solution to LC #146: LRU Cache.",
  "Generate test cases for LeetCode problem 'Word Break' (LC #139).",
  "What data structures are most useful for graph problems like LC #200: Number of Islands?",
  "Explain the backtracking approach for LC #78: Subsets.",
  "Provide a step-by-step walkthrough of a solution for LC #199: Binary Tree Right Side View.",
  "Analyze the complexity of different sorting algorithms in the context of LeetCode problems.",
  "Discuss common mistakes made when solving tree traversal problems (e.g., LC #94, #144, #145).",
  "Provide commented C++ code for LC #5: Longest Palindromic Substring.",
  "How can I optimize a recursive solution for a LeetCode problem to avoid TLE?",
  "Explain the use of heaps/priority queues in problems like LC #215: Kth Largest Element in an Array.",
  "Analyze the problem statement for LC #102: Binary Tree Level Order Traversal.",
  "What are some follow-up questions an interviewer might ask after solving LC #238: Product of Array Except Self?",
  "Provide a deep dive into the solution for LC #56: Merge Intervals.",
  "Explain the two-pointer technique for problems like LC #11: Container With Most Water.",
  "How does memoization improve performance in recursive solutions for LeetCode problems?",
  "Analyze the trade-offs between iterative and recursive solutions for tree problems.",
  "Generate a list of related LeetCode problems if I'm practicing graph traversals.",
  "What are some key patterns to recognize in array manipulation problems on LeetCode?",
  "Explain the 'fast and slow pointer' technique for linked list problems like LC #141: Linked List Cycle.",
  "Provide a commented Java solution for LC #125: Valid Palindrome.",
  "Discuss how to approach problems involving binary search on the answer space.",
  "Analyze the constraints for LC #79: Word Search and how they affect the solution approach."
];


// --- Agent Definitions ---
const agents: IAgentDefinition[] = [
  {
    id: 'general_chat',
    label: 'Nerf',
    description: 'Your friendly general assistant for quick questions and information. Streamlined for efficiency.',
    iconComponent: ChatBubbleLeftEllipsisIcon,
    iconClass: 'text-orange-400 dark:text-orange-500',
    systemPromptKey: 'general_chat',
    category: 'General',
    capabilities: { canGenerateDiagrams: false, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 8, showEphemeralChatLog: true, handlesOwnInput: true },
    examplePrompts: generalChatPrompts,
    tags: ['general knowledge', 'q&a', 'information', 'quick help', 'concise'],
    inputPlaceholder: 'Ask Nerf a quick question...',
    isPublic: true,
    accessTier: 'public',
    viewComponentName: 'GeneralAgentView',
  },
  {
    id: 'public-quick-helper',
    label: 'Quick Helper',
    description: 'A streamlined public assistant for very brief answers to common questions.',
    iconComponent: SparklesIcon,
    iconClass: 'text-sky-400 dark:text-sky-500',
    systemPromptKey: 'general_chat', // Could have its own highly constrained prompt
    category: 'Utility',
    capabilities: { canGenerateDiagrams: false, usesCompactRenderer: false, acceptsVoiceInput: true, maxChatHistory: 2, showEphemeralChatLog: true },
    examplePrompts: quickHelperPrompts,
    inputPlaceholder: 'Ask a very short question...',
    isPublic: true,
    accessTier: 'public',
    // No viewComponentName, will use default MainContentView
  },
  {
    id: 'coding_assistant',
    label: 'CodePilot',
    description: 'Expert coding assistance, debugging, and explanations across multiple languages.',
    iconComponent: CodeBracketSquareIcon,
    iconClass: 'text-rose-400 dark:text-rose-500',
    systemPromptKey: 'coding',
    category: 'Coding',
    capabilities: { canGenerateDiagrams: true, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 15, showEphemeralChatLog: true, handlesOwnInput: true },
    examplePrompts: codingAssistantPrompts,
    tags: ['programming', 'dev', 'code', 'debug', 'algorithms', 'data structures'],
    inputPlaceholder: 'Ask CodePilot about code...',
    isPublic: true,
    accessTier: 'public',
    viewComponentName: 'CodingAgentView',
  },
  {
    id: 'system_designer',
    label: 'Architecton',
    description: 'Collaboratively design and diagram complex software and system architectures.',
    iconComponent: CpuChipIcon,
    iconClass: 'text-indigo-400 dark:text-indigo-500',
    systemPromptKey: 'system_design',
    category: 'Coding',
    capabilities: { canGenerateDiagrams: true, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 12, handlesOwnInput: true, showEphemeralChatLog: true },
    examplePrompts: systemDesignerPrompts,
    inputPlaceholder: 'Describe the system to design...',
    isPublic: true, 
    accessTier: 'public',
    viewComponentName: 'SystemsDesignAgentView',
  },
  {
    id: 'meeting_summarizer',
    label: 'Meeting Scribe',
    description: 'Processes your meeting notes or transcripts into clear, structured summaries with action items.',
    iconComponent: BriefcaseIcon,
    iconClass: 'text-cyan-400 dark:text-cyan-500',
    systemPromptKey: 'meeting',
    category: 'Productivity',
    capabilities: { canGenerateDiagrams: true, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 5, handlesOwnInput: true, showEphemeralChatLog: false },
    examplePrompts: meetingSummarizerPrompts,
    inputPlaceholder: 'Paste notes or dictate discussion for summary...',
    isPublic: false,
    accessTier: 'member',
    viewComponentName: 'BusinessMeetingAgentView',
  },
  {
    id: 'diary_agent',
    label: 'Echo',
    description: 'Your personal, empathetic AI diary and notetaker for reflection and organizing thoughts.',
    iconComponent: BookOpenIcon,
    iconClass: 'text-purple-400 dark:text-purple-500',
    systemPromptKey: 'diary',
    category: 'Productivity',
    capabilities: { canGenerateDiagrams: true, usesCompactRenderer: false, acceptsVoiceInput: true, maxChatHistory: 20, handlesOwnInput: true, showEphemeralChatLog: true },
    examplePrompts: diaryAgentPrompts,
    inputPlaceholder: 'Share your thoughts with Echo...',
    isPublic: false,
    accessTier: 'member',
    viewComponentName: 'DiaryAgentView',
  },
  {
    id: 'coding_interviewer',
    label: 'AI Interviewer',
    description: 'Simulates a technical coding interview, providing problems and evaluating solutions.',
    iconComponent: UserCircleIcon,
    iconClass: 'text-purple-500 dark:text-purple-600',
    systemPromptKey: 'coding_interviewer',
    category: 'Learning',
    capabilities: { canGenerateDiagrams: false, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 20, handlesOwnInput: true, showEphemeralChatLog: true },
    examplePrompts: codingInterviewerPrompts,
    inputPlaceholder: 'Ready for your mock coding interview?',
    isPublic: true,
    accessTier: 'public',
    viewComponentName: 'CodingInterviewerAgentView',
  },
  {
    id: 'tutor_agent',
    label: 'Professor Astra',
    description: 'Your adaptive AI tutor for exploring subjects and mastering concepts.',
    iconComponent: AcademicCapIcon,
    iconClass: 'text-amber-500 dark:text-amber-400',
    systemPromptKey: 'tutor',
    category: 'Learning',
    capabilities: { canGenerateDiagrams: true, usesCompactRenderer: true, acceptsVoiceInput: true, maxChatHistory: 15, handlesOwnInput: true, showEphemeralChatLog: true },
    examplePrompts: tutorAgentPrompts,
    inputPlaceholder: 'What topic shall we learn today?',
    isPublic: true,
    accessTier: 'public',
    viewComponentName: 'TutorAgentView',
  },
  {
    id: 'lc_audit_aide',
    label: 'LC-Audit',
    description: 'In-depth LeetCode problem analysis and interview aide. (Private)',
    iconComponent: DocumentMagnifyingGlassIcon,
    iconClass: 'text-teal-500 dark:text-teal-400',
    systemPromptKey: 'lc_audit_aide',
    category: 'Auditing',
    capabilities: {
      canGenerateDiagrams: true, usesCompactRenderer: true, acceptsVoiceInput: false,
      maxChatHistory: 25, handlesOwnInput: true, showEphemeralChatLog: false,
    },
    examplePrompts: lcAuditPrompts,
    tags: ['leetcode', 'audit', 'interview prep', 'algorithms', 'data structures', 'problem solving'],
    detailedCapabilities: [
        { id: 'deep-analysis', label: 'Deep Problem Analysis', icon: CogIcon },
        { id: 'slideshow-viz', label: 'Visual Slideshows', icon: PresentationChartLineIcon },
        { id: 'commented-code', label: 'Exhaustive Code Comments', icon: CodeBracketSquareIcon },
    ],
    inputPlaceholder: 'Provide problem context for LC-Audit analysis...',
    isPublic: false,
    accessTier: 'premium',
    isBeta: true,
    viewComponentName: 'LCAuditAgentView',
  },
  // Alias definitions (they don't need their own viewComponentName as getAgentById resolves to canonical)
  { id: 'general', label: 'Nerf (General)', description: 'Alias for Nerf', iconComponent: ChatBubbleLeftEllipsisIcon, systemPromptKey: 'general_chat', category: 'General', capabilities: {}, isPublic: true, accessTier: 'public' },
  { id: 'general-ai', label: 'Nerf (AI General)', description: 'Alias for Nerf', iconComponent: ChatBubbleLeftEllipsisIcon, systemPromptKey: 'general_chat', category: 'General', capabilities: {}, isPublic: true, accessTier: 'public' },
  // System/Placeholder definitions
  { id: 'private-dashboard-placeholder', label: 'Dashboard', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: false },
  { id: 'rate-limit-exceeded', label: 'Rate Limited', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: true },
  { id: 'public-welcome-placeholder', label: 'Welcome', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: true },
  { id: 'no-public-agents-placeholder', label: 'No Agents', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: true },
  { id: 'system-error', label: 'Error', description: '', iconComponent: SparklesIcon, systemPromptKey: 'general_chat', category: 'Utility', capabilities: {}, isPublic: false },
];

class AgentService {
  private agentsMap: Map<AgentId, IAgentDefinition>;
  private defaultPublicAgentId: AgentId = 'general_chat';
  private defaultPrivateAgentId: AgentId = 'general_chat';

  constructor() {
    this.agentsMap = new Map();
    const canonicalAgents = new Map<AgentId, IAgentDefinition>();
    agents.forEach(agent => {
      // Prioritize first definition if multiple have same ID (e.g. canonical vs alias stub)
      if (!canonicalAgents.has(agent.id)) {
        canonicalAgents.set(agent.id, agent);
      }
    });

    // Ensure aliases point to the full canonical definition from `canonicalAgents`
    const generalChatCanonical = canonicalAgents.get('general_chat');
    if (generalChatCanonical) {
        this.agentsMap.set('general_chat', generalChatCanonical); // Ensure canonical is in
        if (agents.some(a => a.id === 'general')) this.agentsMap.set('general', generalChatCanonical);
        if (agents.some(a => a.id === 'general-ai')) this.agentsMap.set('general-ai', generalChatCanonical);
    }

    // Add all other canonical definitions
    canonicalAgents.forEach((agentDef, agentId) => {
        if (!this.agentsMap.has(agentId)){ // Add if not an alias already handled
            this.agentsMap.set(agentId, agentDef);
        }
    });


    const firstPublic = Array.from(this.agentsMap.values()).find(a => a.isPublic && a.id === 'general_chat') || Array.from(this.agentsMap.values()).find(a => a.isPublic);
    if (firstPublic) this.defaultPublicAgentId = firstPublic.id;
    else if (this.agentsMap.get('general_chat')) this.defaultPublicAgentId = 'general_chat';

    const privateDefault = Array.from(this.agentsMap.values()).find(a => !a.isPublic && a.viewComponentName) ||
                                this.agentsMap.get('lc_audit_aide') || // Specific preference
                                this.agentsMap.get(this.defaultPublicAgentId); // Fallback to public default if no other private default
    if (privateDefault) this.defaultPrivateAgentId = privateDefault.id;
  }

  public getAgentById(id?: AgentId | null): IAgentDefinition | undefined {
    if (!id) return undefined;
    if (id === 'general' || id === 'general-ai') return this.agentsMap.get('general_chat');
    return this.agentsMap.get(id);
  }

  public getAllAgents(): IAgentDefinition[] {
    // Return only canonical versions for UI selectors, no aliases
    const uniqueAgentDefinitions = new Map<AgentId, IAgentDefinition>();
    this.agentsMap.forEach(agent => {
        // Resolve alias to its canonical ID to ensure we only add canonical versions
        const canonicalId = (agent.id === 'general' || agent.id === 'general-ai') ? 'general_chat' : agent.id;
        const canonicalAgent = this.agentsMap.get(canonicalId);
        if (canonicalAgent && !uniqueAgentDefinitions.has(canonicalId)) {
            // Ensure we're adding the fully defined canonical agent
            if (canonicalAgent.systemPromptKey && !placeholderAgentIds.includes(canonicalId)) { // Filter out placeholders
                uniqueAgentDefinitions.set(canonicalId, canonicalAgent);
            }
        }
    });
    return Array.from(uniqueAgentDefinitions.values());
  }
 
  public getPublicAgents(): IAgentDefinition[] {
    return this.getAllAgents().filter(agent => agent.isPublic);
  }

  public getPrivateAgents(): IAgentDefinition[] {
    return this.getAllAgents().filter(agent => !agent.isPublic || agent.accessTier !== 'public');
  }
 
  public getDefaultAgent(): IAgentDefinition { // For authenticated users
    const agent = this.getAgentById(this.defaultPrivateAgentId);
    if (agent && !placeholderAgentIds.includes(agent.id)) return agent;
   
    const publicDefault = this.getDefaultPublicAgent();
    if (publicDefault && !placeholderAgentIds.includes(publicDefault.id)) return publicDefault;
   
    const firstValidAgent = Array.from(this.agentsMap.values()).find(a => a.systemPromptKey && !placeholderAgentIds.includes(a.id));
    if (firstValidAgent) return firstValidAgent;

    throw new Error("CRITICAL: No valid agents defined in AgentService. Cannot determine a default agent.");
  }

  public getDefaultPublicAgent(): IAgentDefinition {
    const agent = this.getAgentById(this.defaultPublicAgentId);
    if (agent && agent.isPublic && !placeholderAgentIds.includes(agent.id)) return agent;
   
    const firstPublicInList = this.getPublicAgents().find(a => !placeholderAgentIds.includes(a.id));
    if (firstPublicInList) return firstPublicInList;

    const generalChatAgent = this.agentsMap.get('general_chat');
    if (generalChatAgent && !placeholderAgentIds.includes(generalChatAgent.id)) return generalChatAgent; // Fallback, ensure it's not a placeholder
       
    const firstEverValidAgent = Array.from(this.agentsMap.values()).find(a => a.systemPromptKey && !placeholderAgentIds.includes(a.id));
    if (firstEverValidAgent) return firstEverValidAgent;

    throw new Error("CRITICAL: No public agents available in AgentService.");
  }
}

const placeholderAgentIds: AgentId[] = [
    'private-dashboard-placeholder',
    'rate-limit-exceeded',
    'public-welcome-placeholder',
    'no-public-agents-placeholder',
    'system-error'
];


export const agentService = new AgentService();