// backend/agentos/core/ai_utilities/IUtilityAI.ts

/**
 * @fileoverview Defines the comprehensive interface for a Utility AI service in AgentOS.
 * This service provides a wide array of common AI-driven and statistical NLP utility functions
 * such as text summarization, classification, keyword extraction, sentiment analysis,
 * language detection, text normalization, similarity calculation, n-gram generation,
 * and readability assessment. The interface allows for diverse underlying implementations
 * (e.g., LLM-based, statistical NLP libraries like 'natural', or other machine learning models).
 * @module agentos/core/ai_utilities/IUtilityAI
 */

// --- Configuration for Implementations ---
/**
 * Base configuration for any IUtilityAI implementation.
 */
export interface UtilityAIConfigBase {
  /** Default language for processing if not specified in method options (e.g., 'en', 'es'). */
  defaultLanguage?: string;
  /** Path to a directory containing resource files (e.g., stop word lists, lexicons, trained models). */
  resourcePath?: string;
}

// --- Summarization Types ---
/** Options for text summarization. */
export interface SummarizationOptions {
  /**
   * The desired length of the summary.
   * - 'short', 'medium', 'long': Predefined relative lengths.
   * - number (0.0 to 1.0): Interpreted as a percentage of original sentences/content.
   * - number (>1): Interpreted as a target number of sentences or tokens (implementation dependent).
   * @default 'medium' or a sensible number of sentences like 3.
   */
  desiredLength?: 'short' | 'medium' | 'long' | number;
  /**
   * The method or style for summarization.
   * 'extractive_sentence_rank': Selects important sentences (e.g., LexRank-like).
   * 'first_n_sentences': Simple extractive method.
   * 'abstractive_llm': Generates new sentences capturing the essence (requires LLM).
   * 'key_points_llm': A list of bullet points (requires LLM).
   * @default 'extractive_sentence_rank' for statistical, 'abstractive_llm' for LLM.
   */
  method?: 'extractive_sentence_rank' | 'first_n_sentences' | 'abstractive_llm' | 'key_points_llm';
  /** Specific model ID if the method is LLM-based. */
  modelId?: string;
  /** Additional options for the chosen method (e.g., LexRank parameters, LLM provider options). */
  methodOptions?: Record<string, any>; // e.g., { lexRank: { similarityThreshold: 0.1, dampingFactor: 0.85 } }
  /** Maximum input length (characters or tokens) to process. Input might be truncated if exceeded. */
  maxInputLength?: number;
}

// --- Classification Types ---
/** Options for text classification. */
export interface ClassificationOptions {
  /** An array of predefined class labels to classify the text against. */
  candidateClasses: string[];
  /** Whether multiple class labels can be assigned. @default false */
  multiLabel?: boolean;
  /**
   * Method for classification.
   * 'naive_bayes': Uses a Naive Bayes classifier (requires training or pre-trained model).
   * 'llm_zeroshot': Uses an LLM with zero-shot or few-shot prompting.
   * 'keyword_matching': Basic classification based on keyword presence.
   * @default 'keyword_matching' for statistical if no model, 'llm_zeroshot' for LLM.
   */
  method?: 'naive_bayes' | 'llm_zeroshot' | 'keyword_matching';
  /** Specific model ID if the method is LLM-based or uses a specific trained statistical model. */
  modelId?: string; // Can also be a path for statistical models.
  /** Additional options for the chosen method (e.g., Naive Bayes smoothing alpha, LLM provider options). */
  methodOptions?: Record<string, any>;
}

/** Result of a classification task. */
export interface ClassificationResult {
  /** The most likely class label or an array of labels if multiLabel is true. */
  bestClass: string | string[];
  /** Confidence score (0-1) for the bestClass. If multiLabel, this could be an array or average. */
  confidence: number | number[];
  /** Scores for all candidate classes, providing a detailed breakdown. */
  allScores: Array<{ classLabel: string; score: number }>;
}

// --- Keyword Extraction Types ---
/** Options for keyword extraction. */
export interface KeywordExtractionOptions {
  /** Maximum number of keywords/keyphrases to extract. @default 5 */
  maxKeywords?: number;
  /**
   * Method for keyword extraction.
   * 'tf_idf': Uses Term Frequency-Inverse Document Frequency.
   * 'rake': Rapid Automatic Keyword Extraction.
   * 'frequency_based': Simple high-frequency word extraction (after stop word removal).
   * 'llm': Uses an LLM to identify keywords.
   * @default 'rake' or 'tf_idf' for statistical.
   */
  method?: 'tf_idf' | 'rake' | 'frequency_based' | 'llm';
  /** Specific model ID if the method is LLM-based. */
  modelId?: string;
  /** Additional options for the chosen method. */
  methodOptions?: Record<string, any>;
  /** Language of the text, for stop word lists. @default 'en' */
  language?: string;
}

// --- Tokenization Types ---
/** Options for text tokenization. */
export interface TokenizationOptions {
  /** Type of tokenization. @default 'word' */
  type?: 'word' | 'sentence';
  /** Convert tokens to lowercase. @default true */
  toLowerCase?: boolean;
  /** Remove punctuation. @default true */
  removePunctuation?: boolean;
  /** Language for language-specific tokenization rules. @default 'en' */
  language?: string;
}

// --- Stemming Types ---
/** Options for token stemming. */
export interface StemmingOptions {
  /** Stemming algorithm. @default 'porter' */
  algorithm?: 'porter' | 'lancaster'; // Add more as supported
  /** Language for language-specific stemmers. @default 'en' */
  language?: string;
}

// --- Similarity Calculation Types ---
/** Options for calculating text similarity. */
export interface SimilarityOptions {
  /** Method for similarity calculation. @default 'cosine' */
  method?: 'cosine' | 'jaccard' | 'levenshtein';
  /** Whether to stem tokens before comparison. @default true */
  stem?: boolean;
  /** Whether to remove stop words before comparison. @default true */
  removeStopWords?: boolean;
  /** Language for stop words and stemming. @default 'en' */
  language?: string;
  /** For TF-IDF based cosine similarity, an optional corpus for more accurate IDF. If not provided, IDF is based on the two input texts. */
  corpusForIDF?: string[];
}

// --- Sentiment Analysis Types ---
/** Options for sentiment analysis. */
export interface SentimentAnalysisOptions {
  /**
   * Method for sentiment analysis.
   * 'lexicon_based': Uses a sentiment lexicon (e.g., AFINN-like).
   * 'llm': Uses an LLM to determine sentiment.
   * 'trained_classifier': Uses a pre-trained sentiment classification model (e.g., Naive Bayes).
   * @default 'lexicon_based' for statistical.
   */
  method?: 'lexicon_based' | 'llm' | 'trained_classifier';
  /** Specific model ID if method is 'llm' or 'trained_classifier'. Can also be a path for statistical models. */
  modelId?: string;
  /** Path to a custom sentiment lexicon file if method is 'lexicon_based'. */
  lexiconPath?: string;
  /** Language of the text, for lexicon selection or LLM prompting. @default 'en' */
  language?: string;
  /** Additional method-specific options. */
  methodOptions?: Record<string, any>;
}

/** Result of sentiment analysis. */
export interface SentimentResult {
  /** Overall sentiment score (e.g., sum of scores from lexicon, or a value from LLM/classifier). Interpretation depends on method. */
  score: number;
  /** Categorical polarity derived from the score. */
  polarity: 'positive' | 'negative' | 'neutral';
  /**
   * Comparative score, typically normalized (e.g., average score of sentiment-bearing words).
   * For lexicon-based, often score / number_of_sentiment_words.
   */
  comparative: number;
  /** Tokens (and their scores) identified as positive contributors. */
  positiveTokens: Array<{ token: string; score: number }>;
  /** Tokens (and their scores) identified as negative contributors. */
  negativeTokens: Array<{ token: string; score: number }>;
  /** Tokens considered neutral or not matched in the sentiment lexicon. */
  neutralTokens: Array<{ token: string; score?: number }>; // Score might be 0 or undefined
  /** Estimated intensity of the sentiment (e.g., magnitude of comparative score, or a separate LLM judgment). */
  intensity?: number;
}

// --- Language Detection Types ---
/** Options for language detection. */
export interface LanguageDetectionOptions {
  /** Maximum number of candidate languages to return, sorted by confidence. @default 1 */
  maxCandidates?: number;
  /**
   * Method for language detection.
   * 'n_gram': Based on character n-gram frequency profiles.
   * 'llm': Uses an LLM to identify the language.
   * 'heuristic': Other rule-based or simple heuristics.
   * @default 'n_gram' or 'heuristic' for statistical.
   */
  method?: 'n_gram' | 'llm' | 'heuristic';
  /** Additional method-specific options. */
  methodOptions?: Record<string, any>;
}

/** Result of language detection for a single candidate language. */
export interface LanguageDetectionResult {
  /** Detected language code (ISO 639-1 or 639-2, e.g., 'en', 'es', 'fra'). */
  language: string;
  /** Confidence score for this detection (0-1). */
  confidence: number;
}

// --- Text Normalization Types ---
/** Options for text normalization. */
export interface TextNormalizationOptions {
  /** Convert text to lowercase. @default true */
  toLowerCase?: boolean;
  /** Remove punctuation. @default true */
  removePunctuation?: boolean;
  /** Remove stop words. If true, requires language to be set or defaulted. @default false */
  removeStopWords?: boolean;
  /** Perform stemming. If true, requires language and algorithm. @default false */
  stem?: boolean;
  /** Stemming algorithm if `stem` is true. @default 'porter' */
  stemAlgorithm?: 'porter' | 'lancaster';
  /** Expand common contractions (e.g., "don't" to "do not"). @default true */
  expandContractions?: boolean;
  /** Replace numerical digits/words with a placeholder string, or null to remove. @default null (no replacement) */
  replaceNumbersWith?: string | null;
  /** Remove HTML tags. @default false */
  stripHtml?: boolean;
  /** Language for stop words, stemming, contraction rules, etc. @default 'en' */
  language?: string;
}

// --- N-gram Generation Types ---
/** Options for N-gram generation. */
export interface NGramOptions {
  /** The size(s) of N-grams to generate (e.g., 2 for bigrams, [2, 3] for bigrams and trigrams). */
  n: number | number[];
  /** Whether to include partial N-grams at the end of the token sequence if it's shorter than N. @default false */
  includePartial?: boolean;
}

// --- Readability Assessment Types ---
/** Options for readability assessment. */
export interface ReadabilityOptions {
  /** Readability formula to use. */
  formula:
    | 'flesch_kincaid_reading_ease'
    | 'flesch_kincaid_grade_level'
    | 'gunning_fog'
    | 'smog_index'
    | 'coleman_liau_index'
    | 'automated_readability_index'; // Added ARI
}

/** Result of readability assessment. */
export interface ReadabilityResult {
  /** The calculated score based on the chosen formula. */
  score: number;
  /** A qualitative interpretation of the score, if available. */
  interpretation?: string;
  /** Estimated U.S. school grade level, if applicable to the formula. */
  gradeLevel?: string;
}

/**
 * @interface IUtilityAI
 * Defines the contract for a comprehensive Utility AI service.
 * Implementations can leverage LLMs, statistical NLP libraries (like 'natural'),
 * or other machine learning models to provide these functionalities.
 * All methods are asynchronous, returning Promises.
 */
export interface IUtilityAI {
  /** A unique identifier for this utility AI implementation (e.g., "llm_utility_v2", "statistical_natural_v1"). */
  readonly utilityId: string;

  /**
   * Initializes the utility AI service with necessary configuration.
   * @param {UtilityAIConfigBase & Record<string, any>} config - Service-specific configuration,
   * extending base configuration. For example, `LLMUtilityAIConfig` or `StatisticalUtilityAIConfig`.
   * @returns {Promise<void>} A promise that resolves when initialization is complete.
   */
  initialize: (config: UtilityAIConfigBase & Record<string, any>) => Promise<void>;

  // --- Core NLP Methods ---
  summarize: (textToSummarize: string, options?: SummarizationOptions) => Promise<string>;
  classifyText: (textToClassify: string, options: ClassificationOptions) => Promise<ClassificationResult>;
  extractKeywords: (textToAnalyze: string, options?: KeywordExtractionOptions) => Promise<string[]>;
  tokenize: (text: string, options?: TokenizationOptions) => Promise<string[]>;
  stemTokens: (tokens: string[], options?: StemmingOptions) => Promise<string[]>;
  calculateSimilarity: (text1: string, text2: string, options?: SimilarityOptions) => Promise<number>;
  analyzeSentiment: (text: string, options?: SentimentAnalysisOptions) => Promise<SentimentResult>;
  detectLanguage: (text: string, options?: LanguageDetectionOptions) => Promise<LanguageDetectionResult[]>;
  normalizeText: (text: string, options?: TextNormalizationOptions) => Promise<string>;
  generateNGrams: (tokens: string[], options: NGramOptions) => Promise<Record<number, string[][]>>; // Returns map of N to list of N-grams
  calculateReadability: (text: string, options: ReadabilityOptions) => Promise<ReadabilityResult>;
  
  /**
   * Provides a health check or validates configuration.
   * @returns {Promise<boolean | { error: string }>} True if healthy/valid, error object otherwise.
   */
  isHealthy?: () => Promise<boolean | { error: string }>;

  // --- Optional training/management methods for statistical models ---
  /**
   * Optional: Trains an internal model if the utility supports on-the-fly training.
   * @param {Array<{text: string, label: string}>} trainingData - Data for training a classifier, for example.
   * @param {string} modelType - Type of model to train (e.g., 'text_classifier_naive_bayes').
   * @param {Record<string, any>} [trainingOptions] - Specific options for training.
   * @returns {Promise<{success: boolean; message?: string; modelId?: string}>} Result of the training operation.
   */
  trainModel?: (
    trainingData: Array<{text: string, label: string} | any>, // More generic training data
    modelType: string,
    trainingOptions?: Record<string, any>
  ) => Promise<{success: boolean; message?: string; modelId?: string}>;

  /**
   * Optional: Saves a trained internal model to a specified path or store.
   * @param {string} modelTypeOrId - Type or ID of the model to save.
   * @param {string} [path] - Optional path to save to (if filesystem based).
   * @returns {Promise<{success: boolean; path?: string; message?: string}>} Result of the save operation.
   */
  saveTrainedModel?: (modelTypeOrId: string, path?: string) => Promise<{success: boolean; path?: string; message?: string}>;

   /**
   * Optional: Loads a pre-trained internal model from a specified path or store.
   * @param {string} modelTypeOrId - Type or ID of the model to load.
   * @param {string} [path] - Optional path to load from (if filesystem based).
   * @returns {Promise<{success: boolean; message?: string}>} Result of the load operation.
   */
  loadTrainedModel?: (modelTypeOrId: string, path?: string) => Promise<{success: boolean; message?: string}>;
}