// File: backend/agentos/core/vision/types/VisionInput.ts
/**
 * @file VisionInput.ts
 * @module backend/agentos/core/vision/types/VisionInput
 * @version 1.0.0
 * @description Defines the data structures for providing visual input to the AgentOS vision subsystem.
 * This includes raw image data, frame metadata, and an envelope to package them together,
 * particularly for inputs originating from streaming sources like webcams.
 *
 * Key structures:
 * - `VisionInputData`: Represents the actual image data, supporting URL or base64 encoding.
 * - `FrameResolution`: Defines the width and height of a frame.
 * - `FrameMetadata`: Contains contextual information about a single video frame.
 * - `VisionInputEnvelope`: A container for sending a frame and its metadata together.
 */

/**
 * @interface VisionInputData
 * @description Represents the raw visual data for a single image or frame.
 * This structure is designed to be compatible with various vision model providers.
 */
export interface VisionInputData {
  /**
   * @property {'image_url' | 'base64'} type
   * @description Specifies the format of the image data.
   * - `image_url`: The `data` field contains a publicly accessible URL to the image.
   * - `base64`: The `data` field contains a base64 encoded string of the image.
   */
  type: 'image_url' | 'base64';

  /**
   * @property {string} data
   * @description The image data itself. If `type` is 'image_url', this is the URL.
   * If `type` is 'base64', this is the base64 encoded image string.
   * Data URIs (e.g., "data:image/jpeg;base64,...") are also acceptable if `type` is 'base64'.
   * @example "https://example.com/image.jpg" or "data:image/jpeg;base64,/9j/4AAQSkZJRg..." or "/9j/4AAQSkZJRg..." (pure base64 string)
   */
  data: string;

  /**
   * @property {string} [mimeType]
   * @description Optional. The MIME type of the image (e.g., 'image/jpeg', 'image/png', 'image/webp').
   * Crucial for base64 encoded data if not included in the data URI scheme.
   * If `data` is a data URI, this field can be omitted if the MIME type is present in the URI.
   * @example "image/png"
   */
  mimeType?: string;

  /**
   * @property {string} [description]
   * @description Optional. A human-readable description or context for this visual input,
   * which might be used to guide the GMI or vision model.
   * @example "User pointing at the screen."
   */
  description?: string;

  /**
   * @property {string} [sourceId]
   * @description Optional. An identifier for the source of this image (e.g., 'webcam-front', 'file-upload-xyz').
   * Useful for context if multiple visual sources are active.
   */
  sourceId?: string;
}

/**
 * @interface FrameResolution
 * @description Represents the resolution of an image or video frame.
 */
export interface FrameResolution {
  /**
   * @property {number} width
   * @description The width of the frame in pixels.
   */
  width: number;

  /**
   * @property {number} height
   * @description The height of the frame in pixels.
   */
  height: number;
}

/**
 * @interface FrameMetadata
 * @description Contains metadata associated with a single video frame, crucial for
 * sequencing, context, and efficient processing.
 */
export interface FrameMetadata {
  /**
   * @property {number} timestamp
   * @description The timestamp when the frame was captured or received by the system (Unix epoch in milliseconds).
   * Essential for ordering, calculating FPS, and managing temporal context.
   */
  timestamp: number;

  /**
   * @property {string} [frameId]
   * @description Optional. A unique identifier for this specific frame, if available from the source or generated locally.
   * Can be used for precise tracking and debugging. If not provided, a UUID might be generated upon envelope creation.
   * @default uuidv4()
   */
  frameId?: string;

  /**
   * @property {string} [streamId]
   * @description Optional. Identifier for the video stream this frame belongs to,
   * useful if multiple streams are being processed.
   * @example "webcam_main_feed", "screen_share_presentation"
   */
  streamId?: string;

  /**
   * @property {FrameResolution} [resolution]
   * @description Optional. The resolution (width and height) of the frame.
   * This might be derived from the image data itself if not provided here.
   */
  resolution?: FrameResolution;

  /**
   * @property {number} [sequenceNumber]
   * @description Optional. A sequence number for frames within a stream, if provided by the source.
   * Helps in detecting dropped frames or out-of-order delivery.
   */
  sequenceNumber?: number;

  /**
   * @property {Record<string, any>} [customData]
   * @description Optional. A flexible field for any other source-specific metadata or
   * annotations associated with the frame.
   * @example { "cameraAngle": "front_facing", "lightingCondition": "bright", "isKeyFrame": true }
   */
  customData?: Record<string, any>;

  /**
   * @property {string} [digest]
   * @description Optional. A pre-calculated digest or hash of the frame content (e.g., MD5, SHA256, perceptual hash).
   * If provided by a client-side pre-processor, it can help the backend quickly identify
   * duplicate or unchanged frames before full data transfer or processing. The type of digest
   * should ideally be indicated (e.g., by a prefix like "phash:").
   * @example "phash:a1b2c3d4e5f67890"
   */
  digest?: string;
}

/**
 * @interface VisionInputEnvelope
 * @description A container object that packages the raw visual data (`VisionInputData`)
 * along with its associated `FrameMetadata`. This is the typical structure expected by the
 * `VisionProcessorService` for incoming visual inputs, especially from streaming sources.
 */
export interface VisionInputEnvelope {
  /**
   * @property {string} envelopeId
   * @description A unique identifier for this envelope, typically generated upon creation.
   */
  readonly envelopeId: string;

  /**
   * @property {VisionInputData} frameData
   * @description The core visual data for the frame.
   */
  frameData: VisionInputData;

  /**
   * @property {FrameMetadata} metadata
   * @description Contextual metadata about the frame.
   */
  metadata: FrameMetadata;

  /**
   * @property {string} [correlationId]
   * @description Optional. A correlation ID to link this visual input with other events or
   * requests in the system (e.g., a specific user turn, GMI interaction ID, or a session ID).
   */
  correlationId?: string;

  /**
   * @property {number} receivedAt
   * @description Timestamp (Unix epoch ms) when this envelope was received or created by the system component
   * that first handled it (e.g., API gateway, VisionProcessorService).
   */
  readonly receivedAt: number;
}