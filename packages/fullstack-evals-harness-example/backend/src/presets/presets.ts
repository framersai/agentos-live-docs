/**
 * Pre-built grader and dataset configurations.
 * Load via the UI or POST /api/presets/seed.
 */

export interface GraderPreset {
  id: string;
  name: string;
  description: string;
  type:
    | 'exact-match'
    | 'llm-judge'
    | 'semantic-similarity'
    | 'faithfulness'
    | 'contains'
    | 'regex'
    | 'json-schema'
    | 'answer-relevancy'
    | 'context-relevancy';
  rubric?: string;
  config?: Record<string, unknown>;
  tooltip: string;
}

export interface DatasetPreset {
  id: string;
  name: string;
  description: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    context?: string;
  }>;
  tooltip: string;
}

export const GRADER_PRESETS: GraderPreset[] = [
  {
    id: 'faithfulness-strict',
    name: 'Faithfulness (Strict)',
    description: 'All claims must be supported by context (>90%)',
    type: 'faithfulness',
    config: { threshold: 0.9 },
    tooltip: 'RAGAS-inspired: extracts atomic claims, verifies each against context',
  },
  {
    id: 'faithfulness-moderate',
    name: 'Faithfulness (Moderate)',
    description: 'Most claims must be supported by context (>70%)',
    type: 'faithfulness',
    config: { threshold: 0.7 },
    tooltip: 'Looser faithfulness — allows some inference',
  },
  {
    id: 'llm-judge-helpful',
    name: 'Helpfulness Judge',
    description: 'LLM evaluates if response is helpful and accurate',
    type: 'llm-judge',
    rubric: `Evaluate if the response is helpful, accurate, and addresses the user's question.

Pass if:
- The response directly answers the question
- Information is accurate and relevant
- Response is clear and well-structured

Fail if:
- Response is off-topic or doesn't answer the question
- Contains factual errors
- Is confusing or poorly written`,
    tooltip: 'General-purpose quality check',
  },
  {
    id: 'semantic-high',
    name: 'Semantic Match (High)',
    description: 'Output meaning must be very similar (>85%)',
    type: 'semantic-similarity',
    config: { threshold: 0.85 },
    tooltip: 'Cosine similarity on embeddings, strict threshold',
  },
  {
    id: 'semantic-moderate',
    name: 'Semantic Match (Moderate)',
    description: 'Output meaning must be somewhat similar (>70%)',
    type: 'semantic-similarity',
    config: { threshold: 0.7 },
    tooltip: 'Looser semantic match for creative rewrites',
  },
  {
    id: 'json-extraction-schema',
    name: 'Paper Extraction Schema',
    description: 'Validates JSON output against the research paper schema',
    type: 'json-schema',
    config: {
      schema: {
        type: 'object',
        required: ['title', 'authors', 'keyFindings', 'keywords'],
        properties: {
          title: { type: ['string', 'null'] },
          authors: { type: 'array', items: { type: 'string' } },
          publicationDate: { type: ['string', 'null'] },
          source: { type: ['string', 'null'] },
          abstract: { type: ['string', 'null'] },
          keyFindings: { type: 'array', items: { type: 'string' } },
          methodology: { type: ['string', 'null'] },
          keywords: { type: 'array', items: { type: 'string' } },
          limitations: { type: 'array', items: { type: 'string' } },
          citations: { type: ['number', 'null'] },
        },
      },
      strictMode: false,
    },
    tooltip: 'JSON Schema for structured paper extraction',
  },
  {
    id: 'extraction-completeness',
    name: 'Extraction Completeness Judge',
    description: 'LLM evaluates extraction quality, completeness, and grounding',
    type: 'llm-judge',
    rubric: `Evaluate the quality of a JSON extraction from a source document.

Compare the extracted output against the expected extraction:

1. COMPLETENESS: All relevant fields populated? All authors, findings, keywords captured?
2. ACCURACY: Values match source text? No fabricated data?
3. GROUNDING: Every value traces to source text? Null for fields without evidence?
4. STRUCTURE: Valid JSON matching expected schema?

Pass if all information is captured accurately with no fabrication.
Fail if key data is missing, fabricated, or schema is wrong.`,
    tooltip: 'LLM judge for extraction quality and grounding',
  },
];

export const DATASET_PRESETS: DatasetPreset[] = [
  {
    id: 'context-qa',
    name: 'Q&A with Context',
    description: 'Questions with provided context for faithfulness testing',
    tooltip: 'Pair with faithfulness graders',
    testCases: [
      {
        input: 'When was the company founded?',
        expectedOutput: 'The company was founded in 2015.',
        context: 'Acme Corp was founded in 2015 by Jane Smith. The company is headquartered in San Francisco and has 500 employees.',
      },
      {
        input: 'Where is the headquarters located?',
        expectedOutput: 'The headquarters is in San Francisco.',
        context: 'Acme Corp was founded in 2015 by Jane Smith. The company is headquartered in San Francisco and has 500 employees.',
      },
      {
        input: 'How many employees does the company have?',
        expectedOutput: 'The company has 500 employees.',
        context: 'Acme Corp was founded in 2015 by Jane Smith. The company is headquartered in San Francisco and has 500 employees.',
      },
    ],
  },
  {
    id: 'research-paper-extraction',
    name: 'Research Paper Extraction',
    description: '5 real AI paper abstracts for structured JSON extraction',
    tooltip: 'Pair with json-extractor candidates and extraction graders',
    testCases: [
      {
        input: `Title: Attention Is All You Need\nAuthors: Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin\nPublished: June 12, 2017. Conference: NeurIPS 2017.\n\nAbstract: The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs.`,
        expectedOutput: JSON.stringify({ title: 'Attention Is All You Need', authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Lukasz Kaiser', 'Illia Polosukhin'], publicationDate: '2017-06-12', source: 'NeurIPS 2017', keyFindings: ['Transformer architecture based solely on attention mechanisms', '28.4 BLEU on WMT 2014 English-to-German', '41.8 BLEU on WMT 2014 English-to-French'], keywords: ['transformer', 'attention mechanism', 'machine translation'] }),
      },
      {
        input: `Title: RAGAS: Automated Evaluation of Retrieval Augmented Generation\nAuthors: Shahul Es, Jithin James, Luis Espinosa-Anke, Steven Schockaert\nPublished: 2023-09-29. Journal: arXiv preprint arXiv:2309.15217.\n\nAbstract: We introduce RAGAS, a framework for reference-free evaluation of RAG pipelines. RAGAS proposes three metrics — faithfulness, answer relevance, and context relevance — that can be computed automatically without reference to ground-truth answers. We demonstrate that RAGAS metrics correlate well with human judgments.\n\nLimitations: Metrics rely on LLM calls which introduce cost and latency. Faithfulness detection may miss subtle hallucinations. Primarily evaluated on English-language datasets.`,
        expectedOutput: JSON.stringify({ title: 'RAGAS: Automated Evaluation of Retrieval Augmented Generation', authors: ['Shahul Es', 'Jithin James', 'Luis Espinosa-Anke', 'Steven Schockaert'], publicationDate: '2023-09-29', source: 'arXiv preprint arXiv:2309.15217', keyFindings: ['Three automatic metrics: faithfulness, answer relevance, context relevance', 'Reference-free evaluation', 'Correlates with human judgments'], keywords: ['RAG evaluation', 'faithfulness', 'answer relevance'], limitations: ['LLM calls add cost/latency', 'May miss subtle hallucinations', 'English-only evaluation'] }),
      },
      {
        input: `Title: Language Models are Few-Shot Learners\nAuthors: Tom B. Brown et al.\nPublished: 2020-05-28. Conference: NeurIPS 2020. Citations: 30,000+.\n\nAbstract: We show that scaling up language models greatly improves task-agnostic, few-shot performance. We train GPT-3, an autoregressive language model with 175 billion parameters, and test its performance in the few-shot setting. GPT-3 achieves strong performance on many NLP benchmarks without any gradient updates or fine-tuning.`,
        expectedOutput: JSON.stringify({ title: 'Language Models are Few-Shot Learners', authors: ['Tom B. Brown et al.'], publicationDate: '2020-05-28', source: 'NeurIPS 2020', keyFindings: ['Scaling improves few-shot performance', 'GPT-3 with 175B parameters', 'Strong NLP results without fine-tuning'], keywords: ['few-shot learning', 'GPT-3', 'scaling'], citations: 30000 }),
      },
      {
        input: `Title: Constitutional AI: Harmlessness from AI Feedback\nAuthors: Yuntao Bai et al.\nPublished: 2022-12-15. Source: Anthropic Research.\n\nAbstract: We experiment with training a harmless AI assistant through "constitutional AI" (CAI). The method uses a set of principles that the AI follows via self-critique and revision, then reinforcement learning from AI feedback (RLAIF). The result is helpful and harmless without extensive human labels.\n\nLimitations: Constitution is hand-crafted. Depends on base model capability. Tested primarily with Claude.`,
        expectedOutput: JSON.stringify({ title: 'Constitutional AI: Harmlessness from AI Feedback', authors: ['Yuntao Bai et al.'], publicationDate: '2022-12-15', source: 'Anthropic Research', keyFindings: ['Constitutional AI uses principles-based self-critique', 'RLAIF replaces human harmfulness labels', 'Helpful and harmless without extensive labeling'], keywords: ['constitutional AI', 'RLAIF', 'AI safety'], limitations: ['Hand-crafted constitution', 'Depends on base model capability', 'Tested with Claude only'] }),
      },
      {
        input: `Title: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks\nAuthors: Patrick Lewis et al.\nPublished: 2020-05-22. Conference: NeurIPS 2020.\n\nAbstract: We explore retrieval-augmented generation (RAG) — models which combine pre-trained parametric and non-parametric memory for language generation. RAG models generate more specific, diverse and factual language than parametric-only baselines.`,
        expectedOutput: JSON.stringify({ title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', authors: ['Patrick Lewis et al.'], publicationDate: '2020-05-22', source: 'NeurIPS 2020', keyFindings: ['RAG combines parametric and non-parametric memory', 'More specific, diverse and factual output'], keywords: ['RAG', 'retrieval-augmented generation', 'knowledge-intensive NLP'] }),
      },
    ],
  },
];
