/** Standard prompts for single persona conversations */
export const EXAMPLE_PROMPTS: string[] = [
  "Hi",
  "Summarize the latest AI news.",
  "Find key points about LLM context windows.",
  "Draft a friendly announcement about our new feature.",
  "What's trending in open-source AI this week?",
  "Explain RAG in simple terms with an analogy.",
  "Outline a plan to evaluate model quality on our dataset.",
  "Generate a concise release note for version 1.2.3.",
  "Compare Claude, GPT-4, and Llama for coding tasks.",
  "Turn these bullets into a short email announcement.",
  "Suggest 5 titles for a blog post on agents.",
  "Draft FAQs for our onboarding flow.",
  "Summarize the provided transcript into 5 bullets.",
  "Propose A/B test ideas for the landing page.",
  "Create a checklist for a production rollout.",
  "Turn this JSON into a readable table.",
  "Extract action items and owners from this text.",
  "Rewrite this in a friendlier tone.",
  "Rewrite this as a formal memo.",
  "Convert the notes into a step-by-step SOP.",
  "Generate interview questions for a frontend role.",
  "Propose metrics to track agent performance.",
  "Create a timeline for a 2-week sprint.",
  "Suggest prompts to debug a failing tool call.",
  "Summarize differences between SSE and WebSockets.",
  "Explain vector databases to a PM.",
  "Produce a privacy policy outline for an AI app.",
  "Draft a tweet thread about our AgentOS update.",
  "Turn these logs into a readable incident report.",
  "List risks and mitigations for our launch.",
  "Create a user onboarding walkthrough.",
  "Suggest database indexes from these queries.",
  "Summarize this RFC into key decisions.",
  "Generate a changelog from commit messages.",
  "Propose a content calendar for the next 4 weeks.",
  "Turn this long message into an executive summary.",
  "Suggest 5 user research questions for agents.",
  "Estimate costs for 10k daily requests with this model."
];

/** 
 * Agency-specific prompts that demonstrate multi-GMI coordination needs.
 * Note: True parallel execution requires workflow start endpoint (not yet wired).
 */
export const AGENCY_EXAMPLE_PROMPTS: string[] = [
  "Research quantum computing breakthroughs and draft a summary",
  "Analyze competitor features and create a comparison matrix",
  "Review codebase security, document findings, and propose fixes",
  "Research market trends, synthesize insights, and draft strategy doc",
  "Gather user feedback, identify patterns, and create feature roadmap",
  "Monitor social media for mentions and prepare weekly report",
  "Audit infrastructure costs and recommend optimizations",
  "Coordinate release: test coverage, docs update, changelog",
];


