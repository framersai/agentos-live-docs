import test from 'node:test';
import assert from 'node:assert/strict';
import { ragService } from '../integrations/agentos/agentos.rag.service.js';

test('Multimodal RAG ingests, queries, and serves asset payloads', async () => {
  // Ensure a clean store for this test run.
  await ragService.shutdown();

  // Force an in-memory SQLite database for deterministic tests.
  process.env.RAG_DATABASE_PATH = '';
  process.env.RAG_STORAGE_PRIORITY = 'sqljs';
  process.env.AGENTOS_RAG_VECTOR_PROVIDER = 'sql';

  const imageAssetId = `test_image_${Date.now()}`;
  const audioAssetId = `test_audio_${Date.now()}`;

  const imageBytes = Buffer.from('not-a-real-png');
  const audioBytes = Buffer.from('not-a-real-audio');

  const imageIngest = await ragService.ingestImageAsset({
    assetId: imageAssetId,
    mimeType: 'image/png',
    originalFileName: 'test.png',
    payload: imageBytes,
    storePayload: true,
    textRepresentation: '[Image]\nCaption: a red square\nTags: red, square',
    tags: ['manual_tag'],
    metadata: { test: true, kind: 'unit_test' },
    userId: 'test_user',
    agentId: 'test_agent',
  });
  assert.equal(imageIngest.success, true);

  const audioIngest = await ragService.ingestAudioAsset({
    assetId: audioAssetId,
    mimeType: 'audio/webm',
    originalFileName: 'test.webm',
    payload: audioBytes,
    storePayload: false,
    textRepresentation: '[Audio]\nTranscript: hello world',
    userId: 'test_user',
    agentId: 'test_agent',
  });
  assert.equal(audioIngest.success, true);

  const imageQuery = await ragService.queryMediaAssets({
    query: 'red square',
    modalities: ['image'],
    topK: 5,
    includeMetadata: true,
  });
  assert.equal(imageQuery.success, true);
  assert.ok(imageQuery.assets.some((a) => a.asset.assetId === imageAssetId));

  const audioQuery = await ragService.queryMediaAssets({
    query: 'hello',
    modalities: ['audio'],
    topK: 5,
  });
  assert.equal(audioQuery.success, true);
  assert.ok(audioQuery.assets.some((a) => a.asset.assetId === audioAssetId));

  const assetMeta = await ragService.getMediaAsset(imageAssetId);
  assert.ok(assetMeta, 'expected image asset metadata');
  assert.equal(assetMeta?.assetId, imageAssetId);
  assert.equal(assetMeta?.modality, 'image');

  const storedImage = await ragService.getMediaAssetContent(imageAssetId);
  assert.ok(storedImage, 'expected stored image payload');
  assert.equal(storedImage?.mimeType, 'image/png');
  assert.deepEqual(storedImage?.buffer, imageBytes);

  const storedAudio = await ragService.getMediaAssetContent(audioAssetId);
  assert.equal(storedAudio, null, 'expected no stored audio payload when storePayload=false');

  const deleted = await ragService.deleteMediaAsset(audioAssetId);
  assert.equal(deleted, true);

  const audioQueryAfterDelete = await ragService.queryMediaAssets({
    query: 'hello',
    modalities: ['audio'],
    topK: 5,
  });
  assert.equal(audioQueryAfterDelete.success, true);
  assert.equal(
    audioQueryAfterDelete.assets.some((a) => a.asset.assetId === audioAssetId),
    false
  );

  await ragService.shutdown();
});
