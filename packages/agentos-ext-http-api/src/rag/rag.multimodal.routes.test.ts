import { describe, expect, it, vi } from 'vitest';
import express from 'express';
import { createAgentOSRagRouter } from './rag.routes.js';

describe('createAgentOSRagRouter multimodal routes', () => {
  it('ingests an image via multipart/form-data and forwards parsed fields', async () => {
    const ingestImageAsset = vi.fn().mockResolvedValue({
      success: true,
      assetId: 'asset_123',
      modality: 'image',
      collectionId: 'media_images',
      documentId: 'asset_123',
    });

    const ragService = {
      ingestImageAsset,
    } as any;

    const app = express();
    app.use(
      '/api/agentos/rag',
      createAgentOSRagRouter({
        isEnabled: () => true,
        ragService,
      })
    );

    const server = app.listen(0);
    try {
      const address = server.address();
      const port =
        typeof address === 'object' && address && 'port' in address ? (address as any).port : null;
      expect(typeof port).toBe('number');

      const payloadBytes = new Uint8Array([1, 2, 3, 4, 5]);
      const form = new FormData();
      form.append('image', new Blob([payloadBytes], { type: 'image/png' }), 'test.png');
      form.append('assetId', 'asset_123');
      form.append('collectionId', 'media_images');
      form.append('storePayload', 'true');
      form.append('tags', 'a,b');
      form.append('metadata', JSON.stringify({ hello: 'world' }));
      form.append('userId', 'user_1');
      form.append('agentId', 'agent_1');
      form.append('textRepresentation', '[Image] caption');

      const response = await fetch(
        `http://127.0.0.1:${port}/api/agentos/rag/multimodal/images/ingest`,
        { method: 'POST', body: form }
      );

      expect(response.status).toBe(201);
      const json = (await response.json()) as any;
      expect(json.success).toBe(true);
      expect(ingestImageAsset).toHaveBeenCalledTimes(1);

      const call = ingestImageAsset.mock.calls[0]?.[0] as any;
      expect(call.assetId).toBe('asset_123');
      expect(call.collectionId).toBe('media_images');
      expect(call.mimeType).toBe('image/png');
      expect(call.originalFileName).toBe('test.png');
      expect(call.storePayload).toBe(true);
      expect(call.tags).toEqual(['a', 'b']);
      expect(call.metadata).toEqual({ hello: 'world' });
      expect(call.userId).toBe('user_1');
      expect(call.agentId).toBe('agent_1');
      expect(call.textRepresentation).toBe('[Image] caption');
      expect(Buffer.isBuffer(call.payload)).toBe(true);
      expect(Buffer.from(payloadBytes).toString('hex')).toBe(call.payload.toString('hex'));
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('serves stored asset bytes from GET /assets/:assetId/content', async () => {
    const assetId = 'asset_payload';
    const buffer = Buffer.from('hello-bytes');

    const ragService = {
      getMediaAssetContent: vi.fn().mockResolvedValue({ mimeType: 'image/png', buffer }),
    } as any;

    const app = express();
    app.use(
      '/api/agentos/rag',
      createAgentOSRagRouter({
        isEnabled: () => true,
        ragService,
      })
    );

    const server = app.listen(0);
    try {
      const address = server.address();
      const port =
        typeof address === 'object' && address && 'port' in address ? (address as any).port : null;
      expect(typeof port).toBe('number');

      const response = await fetch(
        `http://127.0.0.1:${port}/api/agentos/rag/multimodal/assets/${assetId}/content`
      );
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toBe('image/png');
      const bytes = new Uint8Array(await response.arrayBuffer());
      expect(Buffer.from(bytes).toString('hex')).toBe(buffer.toString('hex'));
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('ingests a document via multipart/form-data and forwards parsed fields', async () => {
    const ingestDocumentAsset = vi.fn().mockResolvedValue({
      success: true,
      assetId: 'doc_asset_123',
      modality: 'document',
      collectionId: 'media_documents',
      documentId: 'doc_asset_123',
    });

    const ragService = {
      ingestDocumentAsset,
    } as any;

    const app = express();
    app.use(
      '/api/agentos/rag',
      createAgentOSRagRouter({
        isEnabled: () => true,
        ragService,
      })
    );

    const server = app.listen(0);
    try {
      const address = server.address();
      const port =
        typeof address === 'object' && address && 'port' in address ? (address as any).port : null;
      expect(typeof port).toBe('number');

      const payloadBytes = new Uint8Array(Buffer.from('Quarterly revenue grew 30 percent.'));
      const form = new FormData();
      form.append('document', new Blob([payloadBytes], { type: 'text/plain' }), 'report.txt');
      form.append('assetId', 'doc_asset_123');
      form.append('collectionId', 'media_documents');
      form.append('storePayload', 'true');
      form.append('tags', 'finance,q4');
      form.append('metadata', JSON.stringify({ department: 'finance' }));
      form.append('textRepresentation', '[Document]\nContent:\nQuarterly revenue grew 30 percent.');

      const response = await fetch(
        `http://127.0.0.1:${port}/api/agentos/rag/multimodal/documents/ingest`,
        { method: 'POST', body: form }
      );

      expect(response.status).toBe(201);
      expect(ingestDocumentAsset).toHaveBeenCalledTimes(1);
      const call = ingestDocumentAsset.mock.calls[0]?.[0] as any;
      expect(call.assetId).toBe('doc_asset_123');
      expect(call.collectionId).toBe('media_documents');
      expect(call.mimeType).toBe('text/plain');
      expect(call.originalFileName).toBe('report.txt');
      expect(call.storePayload).toBe(true);
      expect(call.tags).toEqual(['finance', 'q4']);
      expect(call.metadata).toEqual({ department: 'finance' });
      expect(String(call.textRepresentation).replace(/\r\n/g, '\n')).toBe(
        '[Document]\nContent:\nQuarterly revenue grew 30 percent.'
      );
      expect(Buffer.isBuffer(call.payload)).toBe(true);
      expect(Buffer.from(payloadBytes).toString('hex')).toBe(call.payload.toString('hex'));
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('parses comma-separated query fields and retrieval mode for image search multipart requests', async () => {
    const queryMediaAssetsByImage = vi.fn().mockResolvedValue({
      success: true,
      query: '[Image] red square',
      assets: [],
      totalResults: 0,
      processingTimeMs: 3,
      retrieval: { requestedMode: 'hybrid', resolvedMode: 'text' },
    });

    const ragService = {
      queryMediaAssetsByImage,
    } as any;

    const app = express();
    app.use(
      '/api/agentos/rag',
      createAgentOSRagRouter({
        isEnabled: () => true,
        ragService,
      })
    );

    const server = app.listen(0);
    try {
      const address = server.address();
      const port =
        typeof address === 'object' && address && 'port' in address ? (address as any).port : null;
      expect(typeof port).toBe('number');

      const form = new FormData();
      form.append('image', new Blob([new Uint8Array([9, 8, 7])], { type: 'image/png' }), 'query.png');
      form.append('modalities', 'image,audio');
      form.append('collectionIds', 'media_images,shared_media');
      form.append('topK', '7');
      form.append('includeMetadata', 'true');
      form.append('textRepresentation', '[Image] red square');
      form.append('retrievalMode', 'hybrid');

      const response = await fetch(
        `http://127.0.0.1:${port}/api/agentos/rag/multimodal/images/query`,
        { method: 'POST', body: form }
      );

      expect(response.status).toBe(200);
      expect(queryMediaAssetsByImage).toHaveBeenCalledTimes(1);
      expect(queryMediaAssetsByImage).toHaveBeenCalledWith(
        expect.objectContaining({
          modalities: ['image', 'audio'],
          collectionIds: ['media_images', 'shared_media'],
          topK: 7,
          includeMetadata: true,
          textRepresentation: '[Image] red square',
          retrievalMode: 'hybrid',
        })
      );
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('parses comma-separated query fields and retrieval mode for audio search multipart requests', async () => {
    const queryMediaAssetsByAudio = vi.fn().mockResolvedValue({
      success: true,
      query: '[Audio] hello world',
      assets: [],
      totalResults: 0,
      processingTimeMs: 4,
      retrieval: { requestedMode: 'native', resolvedMode: 'native' },
    });

    const ragService = {
      queryMediaAssetsByAudio,
    } as any;

    const app = express();
    app.use(
      '/api/agentos/rag',
      createAgentOSRagRouter({
        isEnabled: () => true,
        ragService,
      })
    );

    const server = app.listen(0);
    try {
      const address = server.address();
      const port =
        typeof address === 'object' && address && 'port' in address ? (address as any).port : null;
      expect(typeof port).toBe('number');

      const form = new FormData();
      form.append('audio', new Blob([new Uint8Array([1, 3, 5])], { type: 'audio/webm' }), 'query.webm');
      form.append('modalities', 'audio,image');
      form.append('collectionIds', 'media_audio,shared_media');
      form.append('topK', '6');
      form.append('includeMetadata', 'true');
      form.append('textRepresentation', '[Audio] hello world');
      form.append('retrievalMode', 'native');
      form.append('userId', 'user_42');

      const response = await fetch(
        `http://127.0.0.1:${port}/api/agentos/rag/multimodal/audio/query`,
        { method: 'POST', body: form }
      );

      expect(response.status).toBe(200);
      expect(queryMediaAssetsByAudio).toHaveBeenCalledTimes(1);
      expect(queryMediaAssetsByAudio).toHaveBeenCalledWith(
        expect.objectContaining({
          modalities: ['audio', 'image'],
          collectionIds: ['media_audio', 'shared_media'],
          topK: 6,
          includeMetadata: true,
          textRepresentation: '[Audio] hello world',
          retrievalMode: 'native',
          userId: 'user_42',
        })
      );
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});
