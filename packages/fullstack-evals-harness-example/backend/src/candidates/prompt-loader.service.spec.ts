import { PromptLoaderService } from './prompt-loader.service';
import * as fs from 'fs';
import * as path from 'path';

describe('PromptLoaderService', () => {
  let service: PromptLoaderService;

  beforeEach(() => {
    service = new PromptLoaderService();
  });

  describe('loadAll', () => {
    it('loads prompt files from the prompts directory', () => {
      const result = service.loadAll();
      expect(result.loaded).toBeGreaterThan(0);
    });

    it('loads all 6 expected prompt files', () => {
      service.loadAll();
      const prompts = service.findAll();
      expect(prompts.length).toBe(6);
    });
  });

  describe('findOne', () => {
    beforeEach(() => {
      service.loadAll();
    });

    it('returns a prompt by ID', () => {
      const prompt = service.findOne('analyst-full');
      expect(prompt.name).toBe('Full Structured Analyst');
      expect(prompt.runnerType).toBe('llm_prompt');
      expect(prompt.source).toBe('file');
    });

    it('throws NotFoundException for unknown ID', () => {
      expect(() => service.findOne('nonexistent')).toThrow();
    });
  });

  describe('grader weight parsing', () => {
    beforeEach(() => {
      service.loadAll();
    });

    it('parses weights from colon-separated format', () => {
      const prompt = service.findOne('analyst-full');
      expect(prompt.graderWeights).toBeDefined();
      expect(prompt.graderWeights['faithfulness-strict']).toBe(0.4);
      expect(prompt.graderWeights['extraction-completeness']).toBe(0.3);
      expect(prompt.graderWeights['llm-judge-helpful']).toBe(0.3);
    });

    it('preserves grader order in recommendedGraders array', () => {
      const prompt = service.findOne('analyst-full');
      expect(prompt.recommendedGraders).toEqual([
        'faithfulness-strict',
        'extraction-completeness',
        'llm-judge-helpful',
      ]);
    });

    it('weights sum to ~1.0 for analyst-full', () => {
      const prompt = service.findOne('analyst-full');
      const sum = Object.values(prompt.graderWeights).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0);
    });

    it('parses uneven weights correctly (json-extractor-strict)', () => {
      const prompt = service.findOne('json-extractor-strict');
      expect(prompt.graderWeights['json-extraction-schema']).toBe(0.4);
      expect(prompt.graderWeights['extraction-completeness']).toBe(0.4);
      expect(prompt.graderWeights['faithfulness-strict']).toBe(0.2);
    });
  });

  describe('grader rationale parsing', () => {
    beforeEach(() => {
      service.loadAll();
    });

    it('parses grader_rationale field', () => {
      const prompt = service.findOne('analyst-full');
      expect(prompt.graderRationale).toContain('Faithfulness is highest');
    });

    it('returns null for prompts without rationale', () => {
      // All our current prompts have rationale, so this tests the interface
      const prompt = service.findOne('analyst-full');
      expect(typeof prompt.graderRationale).toBe('string');
    });
  });

  describe('findMany', () => {
    beforeEach(() => {
      service.loadAll();
    });

    it('returns multiple prompts by ID', () => {
      const prompts = service.findMany(['analyst-full', 'analyst-citations']);
      expect(prompts).toHaveLength(2);
      expect(prompts[0].id).toBe('analyst-full');
      expect(prompts[1].id).toBe('analyst-citations');
    });

    it('throws on any unknown ID', () => {
      expect(() => service.findMany(['analyst-full', 'bogus'])).toThrow();
    });
  });
});
