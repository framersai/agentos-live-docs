// backend/agentos/core/ai_utilities/StatisticalUtilityAI.ts

import {
  IUtilityAI,
  SummarizationOptions,
  ClassificationOptions,
  ClassificationResult,
  KeywordExtractionOptions,
  TokenizationOptions,
  StemmingOptions,
  SimilarityOptions,
  SentimentAnalysisOptions,
  SentimentResult,
  LanguageDetectionOptions,
  LanguageDetectionResult,
  TextNormalizationOptions,
  NGramOptions,
  ReadabilityOptions,
  ReadabilityResult,
} from './IUtilityAI'; // Assuming IUtilityAI.ts is in the same directory

import * as natural from 'natural';
import { PorterStemmer, LancasterStemmer, WordTokenizer, SentenceTokenizer, TfIdf } from 'natural';


// Basic English stop words list. In a real system, this should be more comprehensive and externalized.
const DEFAULT_ENGLISH_STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves',
  'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their',
  'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
  'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about',
  'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up',
  'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don',
  'should', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn',
  'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn',
  // Added common contractions and short words
  'com', 'edu', 'gov', 'org', 'www', 'http', 'https', // Common URL parts
  'e.g.', 'i.e.', // Common abbreviations
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', // Numbers as words (basic)
  'mr', 'mrs', 'ms', 'dr', 'prof' // Titles
]);


export interface StatisticalUtilityAIConfig {
  resourcePath?: string; // Path to directory for models, lexicons, stop words etc.
  defaultLanguage?: string; // e.g., 'en'
  summarizerConfig?: {
    lexRank?: {
      similarityThreshold?: number;
      dampingFactor?: number;
    }
  };
  classifierConfig?: {
    naiveBayes?: {
      // Path to pre-trained model or configuration for on-the-fly training
      modelPath?: string;
      defaultAlpha?: number; // For Laplace smoothing
    }
  };
  sentimentConfig?: {
    lexiconPath?: string; // Path to a sentiment lexicon (e.g., AFINN-like)
  };
  // Configs for other modules if needed
}

/**
 * @fileoverview Implementation of IUtilityAI using statistical and
 * conventional NLP methods, leveraging the 'natural' library for core tasks.
 * @module agentos/core/ai_utilities/StatisticalUtilityAI
 */
export class StatisticalUtilityAI implements IUtilityAI {
  public readonly utilityId = 'statistical_utility_service_v2';
  private config?: StatisticalUtilityAIConfig;
  private wordTokenizer: natural.WordTokenizer;
  private sentenceTokenizer: natural.SentenceTokenizer;
  private stemmers: { [key: string]: natural.Stemmer } = {};
  private stopWords: Set<string>;

  // Placeholder for a Naive Bayes classifier instance
  private naiveBayesClassifier?: natural.BayesClassifier;
  // Placeholder for a sentiment lexicon
  private sentimentLexicon: Record<string, number> = {};


  constructor() {
    this.wordTokenizer = new WordTokenizer();
    this.sentenceTokenizer = new SentenceTokenizer();
    this.stemmers['porter'] = PorterStemmer;
    this.stemmers['lancaster'] = LancasterStemmer;
    this.stopWords = DEFAULT_ENGLISH_STOP_WORDS; // Default, can be overridden in init
  }

  public async initialize(config: StatisticalUtilityAIConfig): Promise<void> {
    this.config = config;
    console.log(`StatisticalUtilityAI (${this.utilityId}) initializing with config:`, config);

    // Load resources if path is provided
    if (config.resourcePath) {
      // Example: Load custom stop words list
      // try {
      //   const customStopWords = await this.loadResourceFile(path.join(config.resourcePath, 'stopwords_en.txt'));
      //   this.stopWords = new Set(customStopWords.split('\n').map(sw => sw.trim().toLowerCase()).filter(Boolean));
      //   console.log(`Loaded ${this.stopWords.size} custom stop words.`);
      // } catch (error) {
      //   console.warn("Could not load custom stop words, using default:", error);
      // }

      // Example: Load sentiment lexicon
      if (config.sentimentConfig?.lexiconPath) {
        try {
          const lexiconData = await this.loadResourceFile(config.sentimentConfig.lexiconPath);
          this.sentimentLexicon = JSON.parse(lexiconData);
          console.log(`Loaded sentiment lexicon with ${Object.keys(this.sentimentLexicon).length} entries.`);
        } catch (error) {
          console.warn("Could not load sentiment lexicon:", error);
          this.sentimentLexicon = {}; // Fallback to empty
        }
      } else {
         // Basic AFINN-111 like lexicon (very small subset for example)
        this.sentimentLexicon = {
            'good': 3, 'great': 3, 'excellent': 4, 'happy': 3, 'joy': 3, 'love': 3,
            'bad': -3, 'terrible': -4, 'awful': -3, 'sad': -2, 'hate': -3, 'poor':-2,
            'recommend': 2, 'avoid': -2, 'problem': -2, 'issue': -1, 'nice': 2,
            'horrible': -3, 'amazing': 4, 'worth': 2, 'worthless': -3,
            'like': 2, 'dislike': -2, 'support': 1, 'critical': -1,
            'fun': 2, 'boring': -2, 'easy': 1, 'difficult': -2
        };
        console.log("Using basic built-in sentiment lexicon.");
      }


      // Example: Initialize or load Naive Bayes classifier
      if (config.classifierConfig?.naiveBayes?.modelPath) {
        try {
          const modelJson = await this.loadResourceFile(config.classifierConfig.naiveBayes.modelPath);
          this.naiveBayesClassifier = natural.BayesClassifier.restore(JSON.parse(modelJson));
          console.log("Naive Bayes classifier model loaded.");
        } catch (error) {
          console.warn("Could not load Naive Bayes model, classifier will need training:", error);
          this.naiveBayesClassifier = new natural.BayesClassifier(this.stemmers['porter'], config.classifierConfig.naiveBayes.defaultAlpha || 0.05);
        }
      } else {
        this.naiveBayesClassifier = new natural.BayesClassifier(this.stemmers['porter'], config.classifierConfig?.naiveBayes?.defaultAlpha || 0.05);
        console.log("Initialized new Naive Bayes classifier (requires training).");
      }
    } else {
        this.naiveBayesClassifier = new natural.BayesClassifier(this.stemmers['porter'], config?.classifierConfig?.naiveBayes?.defaultAlpha || 0.05);
        console.log("Initialized new Naive Bayes classifier (requires training, no resource path).");
        // Fallback sentiment lexicon if no path and no lexicon path
        if (Object.keys(this.sentimentLexicon).length === 0) {
            this.sentimentLexicon = { /* ... same as above ... */ };
        }
    }
    console.log("StatisticalUtilityAI initialized.");
  }

  // Helper to load resource files (conceptual, replace with actual fs/http calls)
  private async loadResourceFile(filePath: string): Promise<string> {
    // In a real Node.js environment, use fs.readFile
    // For browser, use fetch
    // This is a placeholder.
    console.warn(`Placeholder: loadResourceFile called for ${filePath}. Implement actual file loading.`);
    // Simulating file not found for some paths if not configured properly
    if (filePath.includes("non_existent_model.json")) throw new Error("File not found");
    if (filePath.endsWith(".json")) return Promise.resolve(JSON.stringify({ "sample": "data" }));
    return Promise.resolve("sample file content");
  }


  /**
   * Summarizes text using different strategies.
   */
  public async summarize(textToSummarize: string, options?: SummarizationOptions): Promise<string> {
    const method = options?.method || 'first_n_sentences'; // Default method
    const sentences = this.sentenceTokenizer.tokenize(textToSummarize);

    if (sentences.length === 0) return "";
    if (sentences.length <= 2 && method !== 'lex_rank') return textToSummarize; // Already very short

    let numSentencesToReturn = 3; // Default for 'first_n_sentences'

    if (options?.desiredLength) {
      if (options.desiredLength === 'short') numSentencesToReturn = 2;
      else if (options.desiredLength === 'medium') numSentencesToReturn = Math.max(3, Math.floor(sentences.length * 0.3));
      else if (options.desiredLength === 'long') numSentencesToReturn = Math.max(4, Math.floor(sentences.length * 0.5));
      else if (typeof options.desiredLength === 'number') {
        if (options.desiredLength <=1 ) numSentencesToReturn = options.desiredLength * sentences.length; // As a percentage
        else numSentencesToReturn = options.desiredLength; // As absolute sentence count
      }
    }
    numSentencesToReturn = Math.min(numSentencesToReturn, sentences.length);
    numSentencesToReturn = Math.max(1, numSentencesToReturn);


    if (method === 'first_n_sentences') {
      return sentences.slice(0, numSentencesToReturn).join(" ").trim();
    } else if (method === 'lex_rank' || method === 'extractive_sentence_rank') { // Using LexRank concept
      if (sentences.length < 3) return textToSummarize; // LexRank needs a few sentences

      const tfidf = new TfIdf();
      sentences.forEach(sentence => tfidf.addDocument(this.wordTokenizer.tokenize(sentence.toLowerCase())));

      const sentenceVectors: number[][] = [];
      for (let i = 0; i < sentences.length; i++) {
        const vec: number[] = [];
        // Create a common vocabulary across all sentences for consistent vector dimensions
        // This is a simplified approach. A more robust one would build a global term index.
        const termsInDoc = tfidf.listTerms(i);
        const allTerms = new Set<string>();
        sentences.forEach((s,idx) => tfidf.listTerms(idx).forEach(t => allTerms.add(t.term)));

        allTerms.forEach(term => {
            const termData = termsInDoc.find(t => t.term === term);
            vec.push(termData ? termData.tfidf : 0);
        });
        sentenceVectors.push(vec);
      }


      // Cosine similarity matrix
      const similarityMatrix: number[][] = Array(sentences.length).fill(null).map(() => Array(sentences.length).fill(0));
      for (let i = 0; i < sentences.length; i++) {
        for (let j = 0; j < sentences.length; j++) {
          if (i === j) continue;
          similarityMatrix[i][j] = this._cosineSimilarity(sentenceVectors[i], sentenceVectors[j]);
        }
      }

      // PageRank-like scoring (simplified)
      let scores = Array(sentences.length).fill(1 / sentences.length);
      const damping = this.config?.summarizerConfig?.lexRank?.dampingFactor || 0.85;
      const maxIterations = 30;

      for (let iter = 0; iter < maxIterations; iter++) {
        const newScores = Array(sentences.length).fill(0);
        for (let i = 0; i < sentences.length; i++) {
          let rankSum = 0;
          for (let j = 0; j < sentences.length; j++) {
            if (i === j) continue;
            const sumOutgoingWeights = similarityMatrix[j].reduce((a, b) => a + b, 0);
            if (sumOutgoingWeights > 0) {
              rankSum += (similarityMatrix[j][i] / sumOutgoingWeights) * scores[j];
            }
          }
          newScores[i] = (1 - damping) / sentences.length + damping * rankSum;
        }
        // Check for convergence (simplified)
        let diff = 0;
        for(let k=0; k<scores.length; k++) diff += Math.abs(newScores[k] - scores[k]);
        if (diff < 1e-4) break;

        scores = newScores;
      }

      const rankedSentences = sentences
        .map((sentence, index) => ({ sentence, score: scores[index], originalIndex: index }))
        .sort((a, b) => b.score - a.score);

      // Select top N sentences and sort them by original appearance
      const topSentences = rankedSentences.slice(0, numSentencesToReturn)
                                           .sort((a,b) => a.originalIndex - b.originalIndex);

      return topSentences.map(s => s.sentence).join(" ").trim();
    }

    console.warn(`Summarization method "${method}" not fully implemented. Falling back to first N sentences.`);
    return sentences.slice(0, numSentencesToReturn).join(" ").trim();
  }

  private _cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Classifies text using Naive Bayes or keyword matching.
   */
  public async classifyText(textToClassify: string, options: ClassificationOptions): Promise<ClassificationResult> {
    const method = options.method || (this.naiveBayesClassifier && this.naiveBayesClassifier.docs.length > 0 ? 'naive_bayes' : 'keyword_matching');
    const tokens = await this.tokenize(textToClassify, { type: 'word', toLowerCase: true, removePunctuation: true });
    const stemmedTokens = await this.stemTokens(tokens, { algorithm: 'porter' });

    if (method === 'naive_bayes' && this.naiveBayesClassifier) {
      if (this.naiveBayesClassifier.docs.length === 0) {
         console.warn("Naive Bayes classifier has not been trained. Falling back to keyword matching.");
         return this._classifyByKeyword(textToClassify, options);
      }
      try {
        const classifications = this.naiveBayesClassifier.getClassifications(stemmedTokens.join(' '));
        const best = classifications[0];
        return {
          bestClass: best.label,
          confidence: best.value, // This is probability, adjust interpretation if needed
          allScores: classifications.map(c => ({ classLabel: c.label, score: c.value })),
        };
      } catch (e) {
        console.error("Error during Naive Bayes classification:", e);
        return { bestClass: "unknown", confidence: 0, allScores: [] };
      }
    } else {
      return this._classifyByKeyword(textToClassify, options);
    }
  }

  // Helper for keyword-based classification
  private async _classifyByKeyword(textToClassify: string, options: ClassificationOptions): Promise<ClassificationResult> {
    console.warn("StatisticalUtilityAI.classifyText is using basic keyword matching.");
    const textLower = textToClassify.toLowerCase();
    let bestClass = "unknown";
    let maxScore = 0;
    const allScores: { classLabel: string; score: number }[] = [];

    const textTokens = new Set(await this.tokenize(textLower, { type: 'word', toLowerCase: true, removePunctuation: true }));

    options.candidateClasses.forEach(className => {
      const classKeywords = className.toLowerCase().split(/\s+/).map(kw => kw.replace(/[^a-z0-9]/gi, '')).filter(Boolean);
      let currentScore = 0;
      classKeywords.forEach(kw => {
        if (textTokens.has(kw) || textLower.includes(kw)) { // Check for whole word and substring
            currentScore += (textLower.split(kw).length -1); // Count occurrences
        }
      });
      allScores.push({ classLabel: className, score: currentScore });
      if (currentScore > maxScore) {
        maxScore = currentScore;
        bestClass = className;
      }
    });
     // Normalize scores to a pseudo-confidence (0-1)
    const totalScoreSum = allScores.reduce((sum, s) => sum + s.score, 0);
    const normalizedScores = allScores.map(s => ({
        ...s,
        score: totalScoreSum > 0 ? s.score / totalScoreSum : 0
    }));

    const finalBest = normalizedScores.find(s => s.classLabel === bestClass);

    return {
      bestClass: bestClass,
      confidence: finalBest ? finalBest.score : (maxScore > 0 ? Math.min(0.9, maxScore / (textTokens.size * 0.5)) : 0.1), // Adjusted confidence
      allScores: normalizedScores,
    };
  }

  /**
   * Extracts keywords using TF-IDF, RAKE, or frequency-based methods.
   */
  public async extractKeywords(textToAnalyze: string, options?: KeywordExtractionOptions): Promise<string[]> {
    const method = options?.method || 'tf_idf';
    const maxKeywords = options?.maxKeywords || 5;
    const tokens = await this.tokenize(textToAnalyze, { type: 'word', toLowerCase: true, removePunctuation: true });
    const filteredTokens = tokens.filter(token => !this.stopWords.has(token) && token.length > 2);

    if (method === 'frequency_based') {
      const freq: Record<string, number> = {};
      filteredTokens.forEach(word => {
        freq[word] = (freq[word] || 0) + 1;
      });
      const sortedKeywords = Object.entries(freq).sort(([, a], [, b]) => b - a).map(([word]) => word);
      return sortedKeywords.slice(0, maxKeywords);
    } else if (method === 'tf_idf') {
      // For single document keyword extraction with TF-IDF, IDF part is tricky.
      // We can use TF as a proxy or assume a generic IDF context.
      // Here, we use simple term frequency as TF, as IDF requires a corpus.
      const tfidf = new TfIdf();
      tfidf.addDocument(filteredTokens); // Using filtered tokens directly

      const terms = tfidf.listTerms(0); // We added one document (the input text)
      return terms.sort((a, b) => b.tfidf - a.tfidf)
                  .slice(0, maxKeywords)
                  .map(term => term.term);
    } else if (method === 'rake') {
      // RAKE (Rapid Automatic Keyword Extraction) - simplified implementation
      // 1. Split text into sentences, then into words, removing stop words.
      // 2. Identify candidate phrases (sequences of non-stop words).
      // 3. Score phrases: sum of word scores (degree/frequency or word_score/frequency).
      const sentences = this.sentenceTokenizer.tokenize(textToAnalyze);
      const phraseList: string[][] = [];
      sentences.forEach(sentence => {
          const words = (await this.tokenize(sentence, {type: 'word', toLowerCase: true, removePunctuation: false}))
                            .map(w => w.replace(/[^a-zA-Z0-9'-]/g, '')); // Allow apostrophes and hyphens within words

          let currentPhrase: string[] = [];
          words.forEach(word => {
              if (this.stopWords.has(word.toLowerCase()) || word.length < 2) {
                  if (currentPhrase.length > 0) {
                      phraseList.push(currentPhrase);
                      currentPhrase = [];
                  }
              } else {
                  currentPhrase.push(word.toLowerCase());
              }
          });
          if (currentPhrase.length > 0) phraseList.push(currentPhrase);
      });

      const wordScores: Record<string, { degree: number, frequency: number }> = {};
      phraseList.forEach(phrase => {
          phrase.forEach(word => {
              if (!wordScores[word]) wordScores[word] = { degree: 0, frequency: 0 };
              wordScores[word].frequency++;
              wordScores[word].degree += phrase.length -1; // Degree: sum of co-occurrences
          });
      });

      const candidateKeywords: Record<string, number> = {};
      phraseList.forEach(phrase => {
          const phraseText = phrase.join(' ');
          let score = 0;
          phrase.forEach(word => {
              // RAKE score: sum of (degree(w) / frequency(w)) for each word w in phrase
              if (wordScores[word] && wordScores[word].frequency > 0) {
                score += (wordScores[word].degree + wordScores[word].frequency) / wordScores[word].frequency; // slight variation adding freq to degree
              }
          });
          candidateKeywords[phraseText] = score;
      });

      return Object.entries(candidateKeywords)
          .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
          .slice(0, maxKeywords)
          .map(([phrase]) => phrase);

    }

    console.warn(`Keyword extraction method "${method}" not fully implemented. Falling back to frequency_based.`);
    return this.extractKeywords(textToAnalyze, {...options, method: 'frequency_based'});
  }

  public async tokenize(text: string, options?: TokenizationOptions): Promise<string[]> {
    let processedText = text;
    if (options?.toLowerCase) processedText = processedText.toLowerCase();
    if (options?.removePunctuation) processedText = processedText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]]/g,"");

    if (options?.type === 'sentence') {
      return this.sentenceTokenizer.tokenize(processedText);
    }
    // Default to word tokenization
    return this.wordTokenizer.tokenize(processedText) || [];
  }

  public async stemTokens(tokens: string[], options?: StemmingOptions): Promise<string[]> {
    const algorithm = options?.algorithm || 'porter';
    const stemmer = this.stemmers[algorithm.toLowerCase()] || PorterStemmer; // Default to Porter
    return tokens.map(token => stemmer.stem(token));
  }

  public async calculateSimilarity(text1: string, text2: string, options?: SimilarityOptions): Promise<number> {
    const method = options?.method || 'cosine';

    let tokens1 = this.wordTokenizer.tokenize(text1.toLowerCase()) || [];
    let tokens2 = this.wordTokenizer.tokenize(text2.toLowerCase()) || [];

    if (options?.stem) {
        tokens1 = await this.stemTokens(tokens1, { algorithm: 'porter' });
        tokens2 = await this.stemTokens(tokens2, { algorithm: 'porter' });
    }

    if (method === 'jaccard') {
        const set1 = new Set(tokens1);
        const set2 = new Set(tokens2);
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        return union.size === 0 ? 0 : intersection.size / union.size;
    } else if (method === 'levenshtein') {
        // Using natural's Levenshtein distance (0 is identical, higher is more different)
        // Normalize to similarity: 1 - (distance / max_len)
        const distance = natural.LevenshteinDistance(text1, text2, {search: false}); // insertion_cost, deletion_cost, substitution_cost
        const maxLength = Math.max(text1.length, text2.length);
        if (maxLength === 0) return 1; // Both empty
        return 1 - (distance / maxLength);

    } else if (method === 'cosine') {
        const tfidf = new TfIdf();
        tfidf.addDocument(tokens1);
        tfidf.addDocument(tokens2);

        const terms1 = tfidf.listTerms(0); // terms for doc 1
        const terms2 = tfidf.listTerms(1); // terms for doc 2

        const vector1: Record<string, number> = {};
        const vector2: Record<string, number> = {};
        const allTerms = new Set<string>();

        terms1.forEach(t => { vector1[t.term] = t.tfidf; allTerms.add(t.term); });
        terms2.forEach(t => { vector2[t.term] = t.tfidf; allTerms.add(t.term); });

        const vecA: number[] = [];
        const vecB: number[] = [];
        allTerms.forEach(term => {
            vecA.push(vector1[term] || 0);
            vecB.push(vector2[term] || 0);
        });
        return this._cosineSimilarity(vecA, vecB);
    }
    throw new Error(`Similarity method "${method}" not supported.`);
  }

  public async analyzeSentiment(text: string, options?: SentimentAnalysisOptions): Promise<SentimentResult> {
    const tokens = (await this.tokenize(text, { type: 'word', toLowerCase: true, removePunctuation: true }))
                    .filter(t => t.length > 1); // Filter out very short/empty tokens

    let totalScore = 0;
    let wordCount = 0;
    const positiveTokens: { token: string, score?: number }[] = [];
    const negativeTokens: { token: string, score?: number }[] = [];
    const neutralTokens: { token: string, score?: number }[] = [];


    // More sophisticated: handle negations (basic)
    const negations = ["not", "no", "n't", "never", "hardly", "barely"];
    const intensifiers = {"very": 1.5, "extremely": 2.0, "somewhat": 0.7, "slightly": 0.5, "really": 1.7};


    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        let score = this.sentimentLexicon[token] || 0;
        let effectiveScore = score;

        // Check for preceding intensifiers
        if (i > 0 && intensifiers[tokens[i-1]]) {
            effectiveScore *= intensifiers[tokens[i-1]];
        }

        // Check for preceding negations (simple window)
        if (i > 0 && negations.includes(tokens[i-1])) {
            effectiveScore *= -1;
        } else if (i > 1 && negations.includes(tokens[i-2]) && tokens[i-1].length < 3) { // e.g. "not so good"
            effectiveScore *= -1;
        }


        if (score !== 0) { // Only count words found in lexicon for comparative score
            totalScore += effectiveScore;
            wordCount++;
            if (effectiveScore > 0) positiveTokens.push({ token, score: effectiveScore });
            else if (effectiveScore < 0) negativeTokens.push({ token, score: effectiveScore });
            else neutralTokens.push({ token, score: effectiveScore });
        } else if (token.length > 2 && !this.stopWords.has(token)) { // Non-lexicon, non-stopwords
            neutralTokens.push({token});
        }
    }

    const comparative = wordCount > 0 ? totalScore / wordCount : 0;
    let polarity: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (totalScore > 0.5) polarity = 'positive'; // Thresholding totalScore
    else if (totalScore < -0.5) polarity = 'negative';

    // Intensity could be average absolute score of sentiment words or magnitude of total score
    const intensity = wordCount > 0 ? positiveTokens.reduce((s,t)=>s+(t.score||0),0) - negativeTokens.reduce((s,t)=>s+(t.score||0),0) / wordCount : 0;


    return {
      score: totalScore,
      polarity,
      comparative: parseFloat(comparative.toFixed(3)),
      positiveTokens,
      negativeTokens,
      neutralTokens,
      intensity: parseFloat(Math.abs(intensity).toFixed(3)),
    };
  }


  public async detectLanguage(text: string, options?: LanguageDetectionOptions): Promise<LanguageDetectionResult[]> {
    // This is a very basic placeholder. Real language detection uses n-gram profiles.
    // 'natural' library doesn't have a direct language detector.
    // One would typically use a dedicated library or pre-calculated n-gram frequency profiles.
    console.warn("detectLanguage is a very basic placeholder and not reliable.");
    const textLower = text.toLowerCase();
    const candidates: LanguageDetectionResult[] = [];

    // Extremely naive check
    if (textLower.includes(" the ") || textLower.includes(" and ")) {
      candidates.push({ language: 'en', confidence: 0.3 });
    }
    if (textLower.includes(" la ") || textLower.includes(" el ") || textLower.includes(" es ")) {
      candidates.push({ language: 'es', confidence: 0.3 });
    }
    if (textLower.includes(" le ") || textLower.includes(" la ") || textLower.includes(" et ")) { // "la" is ambiguous
      candidates.push({ language: 'fr', confidence: 0.25 });
    }
     if (textLower.includes(" der ") || textLower.includes(" die ") || textLower.includes(" und ")) {
      candidates.push({ language: 'de', confidence: 0.25 });
    }

    if (candidates.length === 0) {
        candidates.push({ language: 'unknown', confidence: 0.1});
    }
    // Sort by a pseudo-confidence and limit
    return candidates.sort((a,b) => b.confidence - a.confidence).slice(0, options?.maxCandidates || 1);
  }

  public async normalizeText(text: string, options?: TextNormalizationOptions): Promise<string> {
    let normalizedText = text;

    if (options?.toLowerCase !== false) { // Default true
      normalizedText = normalizedText.toLowerCase();
    }

    if (options?.expandContractions) {
        // Very basic contraction expansion, would need a more comprehensive map
        normalizedText = normalizedText.replace(/\bwon't\b/g, "will not")
                                     .replace(/\bcan't\b/g, "cannot")
                                     .replace(/\bn't\b/g, " not")
                                     .replace(/\b're\b/g, " are")
                                     .replace(/\b's\b/g, " is") // Ambiguous: 's can be possessive or "is" or "has"
                                     .replace(/\b'd\b/g, " would")
                                     .replace(/\b'll\b/g, " will")
                                     .replace(/\b've\b/g, " have")
                                     .replace(/\b'm\b/g, " am");
    }

    if (options?.removePunctuation) {
      normalizedText = normalizedText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]?"“”]/g, " "); // Replace with space
      normalizedText = normalizedText.replace(/\s+/g, ' ').trim(); // Consolidate multiple spaces
    }

    let tokens = this.wordTokenizer.tokenize(normalizedText) || [];

    if (options?.removeStopWords) {
      const langStopWords = this.stopWords; // Later, this could be language-specific via config
      tokens = tokens.filter(token => !langStopWords.has(token));
    }

    if (options?.stem) {
      tokens = await this.stemTokens(tokens, { algorithm: 'porter' });
    }

    if (options?.replaceNumbers) {
        tokens = tokens.map(token => /^\d+(\.\d+)?$/.test(token) ? options.replaceNumbers! : token);
    }

    return tokens.join(" ");
  }

  public async generateNGrams(tokens: string[], options: NGramOptions): Promise<Record<number, string[][]>> {
    const nValues = Array.isArray(options.n) ? options.n : [options.n];
    const result: Record<number, string[][]> = {};

    nValues.forEach(n => {
        if (n <= 0) {
            result[n] = [];
            return;
        }
        const ngrams = [];
        const maxStartIndex = options.includePartial ? tokens.length -1 : tokens.length - n;

        for (let i = 0; i <= maxStartIndex; i++) {
            const ngram = tokens.slice(i, i + n);
            if (!options.includePartial && ngram.length < n) continue;
            ngrams.push(ngram);
        }
        result[n] = ngrams;
    });
    return result;
  }

  public async calculateReadability(text: string, options?: ReadabilityOptions): Promise<ReadabilityResult> {
    const formula = options?.formula || 'flesch_kincaid_reading_ease';

    const sentences = this.sentenceTokenizer.tokenize(text) || [text];
    const words = this.wordTokenizer.tokenize(text.toLowerCase())?.filter(w => w.length > 0) || [];
    const numSentences = sentences.length || 1;
    const numWords = words.length || 1;

    // Syllable count (very approximate)
    const countSyllables = (word: string): number => {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, ''); // Remove common endings
        word = word.replace(/^y/, ''); // Replace y at start
        const matches = word.match(/[aeiouy]{1,2}/g); // Count vowel groups
        return matches ? matches.length : 1;
    };
    const numSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0) || 1;


    let score = 0;
    let interpretation = "N/A";
    let gradeLevel : string | undefined = undefined;

    if (formula === 'flesch_kincaid_reading_ease') {
      // Formula: 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
      score = 206.835 - 1.015 * (numWords / numSentences) - 84.6 * (numSyllables / numWords);
      score = parseFloat(score.toFixed(2));
      if (score > 90) interpretation = "Very easy to read. Easily understood by an average 11-year-old student.";
      else if (score > 80) interpretation = "Easy to read. Conversational English for consumers.";
      else if (score > 70) interpretation = "Fairly easy to read.";
      else if (score > 60) interpretation = "Plain English. Easily understood by 13- to 15-year-old students.";
      else if (score > 50) interpretation = "Fairly difficult to read.";
      else if (score > 30) interpretation = "Difficult to read.";
      else interpretation = "Very difficult to read. Best understood by university graduates.";
    } else if (formula === 'flesch_kincaid_grade_level') {
      // Formula: 0.39 * (total words / total sentences) + 11.8 * (total syllables / total words) - 15.59
      score = 0.39 * (numWords / numSentences) + 11.8 * (numSyllables / numWords) - 15.59;
      score = parseFloat(score.toFixed(1));
      gradeLevel = `Approx. Grade ${Math.round(score)}`;
      interpretation = `Corresponds to a U.S. school grade level.`;
    } else if (formula === 'gunning_fog') {
        // Formula: 0.4 * ((words / sentences) + 100 * (complex_words / words))
        // Complex words: 3+ syllables (approximate here)
        const complexWords = words.filter(w => countSyllables(w) >= 3).length;
        score = 0.4 * ((numWords / numSentences) + 100 * (complexWords / numWords));
        score = parseFloat(score.toFixed(1));
        gradeLevel = `Approx. Grade ${Math.round(score)}`;
        interpretation = `Estimates the years of formal education needed to understand the text on a first reading.`;
    } else if (formula === 'smog_index') {
        // SMOG = 1.0430 * sqrt(polysyllables * (30 / sentences)) + 3.1291
        // Polysyllables = words with 3 or more syllables. Calculated on a sample of 30 sentences if text is long.
        // Simplified: use all sentences and words if fewer than 30 sentences.
        const polysyllables = words.filter(w => countSyllables(w) >= 3).length;
        if (numSentences > 0) {
            score = 1.0430 * Math.sqrt(polysyllables * (30 / numSentences)) + 3.1291;
            score = parseFloat(score.toFixed(1));
            gradeLevel = `Approx. Grade ${Math.round(score)}`;
        } else {
            score = 0; // Cannot calculate
            gradeLevel = 'N/A';
        }
        interpretation = `Estimates years of education needed to understand a piece of writing.`;
    } else if (formula === 'coleman_liau_index') {
        // CLI = 0.0588 * L - 0.296 * S - 15.8
        // L = average number of letters per 100 words
        // S = average number of sentences per 100 words
        const numLetters = words.join('').length;
        const L = (numLetters / numWords) * 100;
        const S = (numSentences / numWords) * 100;
        score = 0.0588 * L - 0.296 * S - 15.8;
        score = parseFloat(score.toFixed(1));
        gradeLevel = `Approx. Grade ${Math.round(score)}`;
        interpretation = `Relies on characters per word rather than syllables.`;
    } else {
      throw new Error(`Readability formula "${formula}" not supported.`);
    }

    return { score, interpretation, gradeLevel };
  }

  public async isHealthy(): Promise<boolean | { error: string; }> {
    // Can add checks here, e.g., if critical resources failed to load
    if (this.config && this.config.classifierConfig?.naiveBayes?.modelPath && !this.naiveBayesClassifier?.classifier.classFeatures) {
        // If a model path was specified but the classifier doesn't seem loaded/trained
        // return { error: "Naive Bayes model specified in config but not properly loaded." };
    }
    return true; // Basic implementation assumes healthy if initialized
  }

  // --- Training methods for Naive Bayes (example) ---
  public async trainClassifier(data: Array<{text: string, label: string}>): Promise<void> {
    if (!this.naiveBayesClassifier) {
        console.warn("Cannot train: Naive Bayes classifier not initialized.");
        this.naiveBayesClassifier = new natural.BayesClassifier(this.stemmers['porter'], this.config?.classifierConfig?.naiveBayes?.defaultAlpha || 0.05);
    }
    console.log(`Training Naive Bayes classifier with ${data.length} samples.`);
    for (const item of data) {
        const tokens = await this.tokenize(item.text, { type: 'word', toLowerCase: true, removePunctuation: true });
        const stemmedTokens = await this.stemTokens(tokens, { algorithm: 'porter' });
        this.naiveBayesClassifier.addDocument(stemmedTokens, item.label);
    }
    this.naiveBayesClassifier.train();
    console.log("Naive Bayes classifier training complete.");
  }

  public async saveClassifierModel(): Promise<string | null> {
    if (this.naiveBayesClassifier && this.naiveBayesClassifier.docs.length > 0) {
        return new Promise((resolve, reject) => {
            // The 'natural' library's save method uses a callback.
            // For actual saving to a file, you'd pass a file path and fs.writeFile.
            // Here we just get the JSON string.
            // A true save for `natural.BayesClassifier.restore` needs the classifier structure.
            // This is tricky because `classifier.toJSON()` isn't directly exposed.
            // A common way is to serialize the object that `BayesClassifier.restore` expects.
            // For simplicity, let's simulate the JSON string it would produce.
             const classifierJson = JSON.stringify(this.naiveBayesClassifier);
             resolve(classifierJson);
        });
    }
    console.warn("Cannot save: Naive Bayes classifier not trained or not available.");
    return null;
  }
}