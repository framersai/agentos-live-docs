/**
 * @file backend/utils/errors.ts
 * @module backend/utils/errors
 * @version 1.2.0
 *
 * @description
 * This module centralizes the error handling system for the Voice Chat Assistant backend.
 * It defines a comprehensive set of error codes (`GMIErrorCode`), a custom base error class (`GMIError`),
 * utility functions for creating and inspecting these errors (`createGMIErrorFromError`, `isGMIError`, `isOperationalError`),
 * an `ErrorFactory` for common error types, and an Express error handler middleware factory (`createErrorHandler`).
 *
 * The primary goal is to provide a consistent, structured, and informative approach to error management
 * throughout the application, facilitating easier debugging, robust error responses to clients,
 * and clear logging.
 *
 * Key Dependencies: None external to standard TypeScript/Node.js. Relies on `process.env.NODE_ENV`.
 * Key Assumptions: Errors originating from external libraries or services should ideally be wrapped
 * into `GMIError` instances to maintain consistency.
 */

/**
 * @enum {string} GMIErrorCode
 * @description
 * Enumeration of specific error codes used throughout the Voice Chat Assistant application.
 * These codes offer a granular way to identify and categorize errors, aiding in debugging,
 * client-side error handling, and automated error analysis. Each code corresponds to a
 * distinct error scenario.
 *
 * Naming Convention: `GROUP_SPECIFIC_ERROR_DESCRIPTION`
 * Example: `AUTHENTICATION_TOKEN_INVALID`
 */
export enum GMIErrorCode {
  // --- General System Errors (SYS_xxxx) ---
  /** Indicates an unexpected error occurred on the server that doesn't fit a more specific category. */
  INTERNAL_SERVER_ERROR = 'SYS_INTERNAL_SERVER_ERROR',
  /** Indicates a service or module was used before it was properly initialized. */
  NOT_INITIALIZED = 'SYS_NOT_INITIALIZED',
  /** Indicates a required service or resource is temporarily unavailable. */
  SERVICE_UNAVAILABLE = 'SYS_SERVICE_UNAVAILABLE',
  /** Indicates an error in the application's configuration. */
  CONFIGURATION_ERROR = 'SYS_CONFIGURATION_ERROR',
  /** Indicates that input data failed validation checks. */
  VALIDATION_ERROR = 'SYS_VALIDATION_ERROR',
  /** Indicates that the requested API endpoint does not exist. */
  ENDPOINT_NOT_FOUND = 'SYS_ENDPOINT_NOT_FOUND',
  /** Indicates an operation was attempted on an object in an invalid state. */
  INVALID_STATE = 'SYS_INVALID_STATE',
  /** Indicates an error during parsing of data (e.g., JSON, XML). */
  PARSING_ERROR = 'SYS_PARSING_ERROR',
  /** Indicates an error related to an external dependency or service. */
  DEPENDENCY_ERROR = 'SYS_DEPENDENCY_ERROR',
  /** Indicates a feature or method is not yet implemented. */
  NOT_IMPLEMENTED = 'SYS_NOT_IMPLEMENTED',

  // --- Authentication & Authorization Errors (AUTH_xxxx) ---
  /** Indicates that authentication is required to access the resource, but none was provided. */
  AUTHENTICATION_REQUIRED = 'AUTH_AUTHENTICATION_REQUIRED',
  /** Indicates that provided credentials (e.g., username/password) are invalid. */
  AUTHENTICATION_INVALID_CREDENTIALS = 'AUTH_AUTHENTICATION_INVALID_CREDENTIALS',
  /** Indicates that the user's email address has not been verified, and verification is required. */
  AUTHENTICATION_EMAIL_NOT_VERIFIED = 'AUTH_AUTHENTICATION_EMAIL_NOT_VERIFIED',
  /** Indicates that an authentication token was expected but not found in the request. */
  AUTHENTICATION_TOKEN_MISSING = 'AUTH_AUTHENTICATION_TOKEN_MISSING',
  /** Indicates that the provided authentication token is invalid (e.g., malformed, wrong signature). */
  AUTHENTICATION_TOKEN_INVALID = 'AUTH_AUTHENTICATION_TOKEN_INVALID',
  /** Indicates that the provided authentication token has expired. */
  AUTHENTICATION_TOKEN_EXPIRED = 'AUTH_AUTHENTICATION_TOKEN_EXPIRED',
  /** Indicates that the authenticated user does not have permission to perform the requested action. */
  PERMISSION_DENIED = 'AUTH_PERMISSION_DENIED',
  /** Generic access denied error, often synonymous with PERMISSION_DENIED. */
  ACCESS_DENIED = 'AUTH_ACCESS_DENIED', // Often synonymous with PERMISSION_DENIED
  /** Indicates more specific permission deficiencies. */
  INSUFFICIENT_PERMISSIONS = 'AUTH_INSUFFICIENT_PERMISSIONS',
  /** General authentication error not covered by more specific codes. */
  AUTHENTICATION_ERROR = 'AUTH_AUTHENTICATION_ERROR',

  // --- OAuth Specific Errors (AUTH_OAUTH_xxxx) ---
  /** Indicates that the specified OAuth provider is not configured on the server. */
  OAUTH_PROVIDER_NOT_CONFIGURED = 'AUTH_OAUTH_PROVIDER_NOT_CONFIGURED',
  /** General failure during the OAuth authentication process with an external provider. */
  OAUTH_AUTHENTICATION_FAILED = 'AUTH_OAUTH_AUTHENTICATION_FAILED',
  /** Indicates the OAuth provider did not return an expected ID token. */
  OAUTH_ID_TOKEN_MISSING = 'AUTH_OAUTH_ID_TOKEN_MISSING',
  /** Indicates the payload of the received ID token is invalid or missing required fields. */
  OAUTH_INVALID_TOKEN_PAYLOAD = 'AUTH_OAUTH_INVALID_TOKEN_PAYLOAD',
  /** Indicates the OAuth callback from the provider is missing the authorization code. */
  OAUTH_MISSING_AUTH_CODE = 'AUTH_OAUTH_MISSING_AUTH_CODE',

  // --- User Management & Email Verification Errors (USER_xxxx) ---
  /** Indicates that a user with the specified identifier could not be found. */
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  /** Indicates that a user account is invalid or in a state that prevents the operation. */
  USER_INVALID = 'USER_INVALID',
  /** Indicates an attempt to register with an email address that already exists. */
  REGISTRATION_EMAIL_EXISTS = 'USER_REGISTRATION_EMAIL_EXISTS',
  /** Indicates an attempt to register with a username that is already taken. */
  REGISTRATION_USERNAME_EXISTS = 'USER_REGISTRATION_USERNAME_EXISTS',
  /** Indicates that an email verification token is invalid, expired, or already used. */
  EMAIL_VERIFICATION_TOKEN_INVALID = 'USER_EMAIL_VERIFICATION_TOKEN_INVALID',

  // --- Password Management Errors (USER_PWD_xxxx) ---
  /** General error during a password reset operation. */
  PASSWORD_RESET_ERROR = 'USER_PWD_RESET_ERROR',
  /** Indicates that a password reset token is invalid, expired, or already used. */
  PASSWORD_RESET_TOKEN_INVALID = 'USER_PWD_RESET_TOKEN_INVALID',

  // --- Session Management Errors (SESSION_xxxx) ---
  /** Generic error related to user session management. */
  SESSION_ERROR = 'SESSION_ERROR',
  /** Indicates that the user session has expired. */
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  /** Indicates that the session identifier is invalid or the session does not exist. */
  SESSION_INVALID = 'SESSION_INVALID',

  // --- Database & Resource Errors (DB_xxxx, RES_xxxx) ---
  /** Generic database operation error. */
  DATABASE_ERROR = 'DB_DATABASE_ERROR',
  /** Error establishing a connection to the database. */
  DATABASE_CONNECTION_ERROR = 'DB_DATABASE_CONNECTION_ERROR',
  /** Indicates a requested resource (e.g., a specific record) was not found. */
  RESOURCE_NOT_FOUND = 'RES_RESOURCE_NOT_FOUND',
  /** Indicates an attempt to create a resource that already exists (violating a unique constraint). */
  RESOURCE_ALREADY_EXISTS = 'RES_RESOURCE_ALREADY_EXISTS',
  /** Generic error related to data storage operations. */
  STORAGE_ERROR = 'RES_STORAGE_ERROR',

  // --- Encryption & Security Errors (SEC_xxxx) ---
  /** Generic error during an encryption operation. */
  ENCRYPTION_ERROR = 'SEC_ENCRYPTION_ERROR',
  /** Generic error during a decryption operation. */
  DECRYPTION_ERROR = 'SEC_DECRYPTION_ERROR', // For consistency, use this or ENCRYPTION_DECRYPTION_ERROR
  /** Failure during decryption of an API key. */
  API_KEY_DECRYPTION_FAILED = 'SEC_API_KEY_DECRYPTION_FAILED',
  /** Generic error during encryption or decryption. */
  ENCRYPTION_DECRYPTION_ERROR = 'SEC_ENCRYPTION_DECRYPTION_ERROR',
  /** Indicates a potential security risk or vulnerability was detected. */
  SECURITY_RISK = 'SEC_SECURITY_RISK',

  // --- AgentOS & GMI Errors (AGENTOS_GMI_xxxx) ---
  /** Generic error related to GMI operations. */
  GMI_ERROR = 'AGENTOS_GMI_ERROR',
  /** Specified GMI instance not found. */
  GMI_NOT_FOUND = 'AGENTOS_GMI_NOT_FOUND',
  /** Error during GMI initialization. */
  GMI_INITIALIZATION_ERROR = 'AGENTOS_GMI_INITIALIZATION_ERROR',
  /** Error during GMI processing of input or tasks. */
  GMI_PROCESSING_ERROR = 'AGENTOS_GMI_PROCESSING_ERROR',
  /** Error related to GMI conversational context management. */
  GMI_CONTEXT_ERROR = 'AGENTOS_GMI_CONTEXT_ERROR',
  /** Error related to GMI memory operations (short-term or long-term). */
  GMI_MEMORY_ERROR = 'AGENTOS_GMI_MEMORY_ERROR',
  /** Error processing feedback for a GMI. */
  GMI_FEEDBACK_ERROR = 'AGENTOS_GMI_FEEDBACK_ERROR',

  // --- Persona & Agent Errors (AGENTOS_PERSONA_xxxx) ---
  /** Specified persona definition not found. */
  PERSONA_NOT_FOUND = 'AGENTOS_PERSONA_NOT_FOUND',
  /** Error loading a persona definition. */
  PERSONA_LOAD_ERROR = 'AGENTOS_PERSONA_LOAD_ERROR',
  /** Access denied to a specific persona based on user entitlements. */
  PERSONA_ACCESS_DENIED = 'AGENTOS_PERSONA_ACCESS_DENIED',
  /** Generic error related to agent operations. */
  AGENT_ERROR = 'AGENTOS_AGENT_ERROR',
  /** An agent or GMI required for an operation is unavailable. */
  AGENT_UNAVAILABLE = 'AGENTOS_AGENT_UNAVAILABLE',

  // --- LLM Provider Errors (LLM_xxxx) ---
  /** Generic error from an LLM provider. */
  LLM_PROVIDER_ERROR = 'LLM_PROVIDER_ERROR',
  /** LLM provider service is currently unavailable. */
  LLM_PROVIDER_UNAVAILABLE = 'LLM_PROVIDER_UNAVAILABLE',
  /** API key for the LLM provider is invalid or missing. */
  LLM_PROVIDER_API_KEY_INVALID = 'LLM_PROVIDER_API_KEY_INVALID',
  /** Rate limit exceeded for the LLM provider's API. */
  LLM_PROVIDER_RATE_LIMIT = 'LLM_PROVIDER_RATE_LIMIT',
  /** Usage quota exceeded for the LLM provider. */
  LLM_PROVIDER_QUOTA_EXCEEDED = 'LLM_PROVIDER_QUOTA_EXCEEDED',
  /** Requested LLM model not found or not supported by the provider. */
  LLM_MODEL_NOT_FOUND = 'LLM_MODEL_NOT_FOUND',

  // --- Tool System Errors (TOOL_xxxx) ---
  /** Generic error related to the tool system. */
  TOOL_ERROR = 'TOOL_ERROR',
  /** Requested tool not found or not registered. */
  TOOL_NOT_FOUND = 'TOOL_NOT_FOUND',
  /** General error during tool execution. */
  TOOL_EXECUTION_ERROR = 'TOOL_EXECUTION_ERROR',
  /** Tool execution explicitly failed (e.g., script error, non-zero exit code). */
  TOOL_EXECUTION_FAILED = 'TOOL_EXECUTION_FAILED',
  /** User or agent does not have permission to use the requested tool. */
  TOOL_PERMISSION_DENIED = 'TOOL_PERMISSION_DENIED',
  /** Input arguments provided to a tool failed validation. */
  TOOL_VALIDATION_ERROR = 'TOOL_VALIDATION_ERROR', // For tool argument validation

  // --- RAG & Vector Store Errors (RAG_xxxx) ---
  /** Generic error related to Retrieval Augmented Generation. */
  RAG_ERROR = 'RAG_ERROR',
  /** Error during ingestion of data into the RAG system. */
  RAG_INGESTION_FAILED = 'RAG_INGESTION_FAILED',
  /** Generic error from the vector store. */
  VECTOR_STORE_ERROR = 'RAG_VECTOR_STORE_ERROR',
  /** Error connecting to the vector store. */
  VECTOR_STORE_CONNECTION_ERROR = 'RAG_VECTOR_STORE_CONNECTION_ERROR',
  /** Error during generation of embeddings. */
  EMBEDDING_ERROR = 'RAG_EMBEDDING_ERROR',
  /** Error during retrieval of documents/chunks from the vector store. */
  RETRIEVAL_ERROR = 'RAG_RETRIEVAL_ERROR',

  // --- Voice & Audio Processing Errors (AUDIO_xxxx) ---
  /** Generic error in voice or audio processing. */
  VOICE_PROCESSING_ERROR = 'AUDIO_VOICE_PROCESSING_ERROR',
  /** Error during audio transcription (STT). */
  AUDIO_TRANSCRIPTION_ERROR = 'AUDIO_TRANSCRIPTION_ERROR',
  /** Error during audio synthesis (TTS). */
  AUDIO_SYNTHESIS_ERROR = 'AUDIO_SYNTHESIS_ERROR',
  /** Specific error from Whisper STT service. */
  WHISPER_STT_ERROR = 'AUDIO_WHISPER_STT_ERROR',
  /** Specific error from TTS service. */
  TTS_ERROR = 'AUDIO_TTS_ERROR',

  // --- Streaming & Communication Errors (COMM_xxxx) ---
  /** Generic error related to data streaming. */
  STREAM_ERROR = 'COMM_STREAM_ERROR',
  /** Error initializing a data stream. */
  STREAMING_INITIALIZATION_ERROR = 'COMM_STREAMING_INITIALIZATION_ERROR',
  /** Error related to WebSocket communication. */
  WEBSOCKET_ERROR = 'COMM_WEBSOCKET_ERROR',

  // --- Subscription & Payment Errors (BILLING_xxxx) ---
  /** Generic error related to subscriptions or payments. */
  SUBSCRIPTION_ERROR = 'BILLING_SUBSCRIPTION_ERROR',
  /** Requested subscription tier not found. */
  SUBSCRIPTION_TIER_NOT_FOUND = 'BILLING_SUBSCRIPTION_TIER_NOT_FOUND',
  /** Generic error during payment processing. */
  PAYMENT_ERROR = 'BILLING_PAYMENT_ERROR',
  /** Error from the payment provider (e.g., LemonSqueezy, Stripe). */
  PAYMENT_PROVIDER_ERROR = 'BILLING_PAYMENT_PROVIDER_ERROR',
  /** Webhook signature validation failed. */
  WEBHOOK_VALIDATION_FAILED = 'BILLING_WEBHOOK_VALIDATION_FAILED',
  /** Error processing a webhook event. */
  WEBHOOK_PROCESSING_ERROR = 'BILLING_WEBHOOK_PROCESSING_ERROR',

  // --- Rate Limiting & Usage Errors (LIMIT_xxxx) ---
  /** General rate limit exceeded for an API or service. */
  RATE_LIMIT_EXCEEDED = 'LIMIT_RATE_LIMIT_EXCEEDED',
  /** User or system cost threshold exceeded. */
  COST_THRESHOLD_EXCEEDED = 'LIMIT_COST_THRESHOLD_EXCEEDED',
  /** Specific usage limit for a feature or resource exceeded. */
  USAGE_LIMIT_EXCEEDED = 'LIMIT_USAGE_LIMIT_EXCEEDED',

  // --- Configuration & Environment Errors (ENV_xxxx) ---
  /** Generic error related to environment setup. (Covered by SYS_CONFIGURATION_ERROR if preferred) */
  ENVIRONMENT_ERROR = 'ENV_ENVIRONMENT_ERROR',
  /** A required environment variable is missing or invalid. */
  MISSING_ENV_VAR = 'ENV_MISSING_ENV_VAR',

  // --- UI & Frontend Integration Errors (UI_xxxx) ---
  /** Error orchestrating UI updates commanded by the backend. */
  UI_ORCHESTRATION_ERROR = 'UI_ORCHESTRATION_ERROR',
  /** Error related to dynamic UI component rendering or management. */
  DYNAMIC_UI_ERROR = 'UI_DYNAMIC_UI_ERROR',

  // --- Memory Lifecycle Errors (MEM_xxxx) ---
  /** Generic error in the memory lifecycle management system. */
  MEMORY_LIFECYCLE_ERROR = 'MEM_MEMORY_LIFECYCLE_ERROR',
  /** Error during memory eviction process. */
  MEMORY_EVICTION_ERROR = 'MEM_MEMORY_EVICTION_ERROR',

  // --- General Argument/Input Errors (ARG_xxxx) ---
  /** An argument provided to a function or method is invalid. */
  INVALID_ARGUMENT = 'ARG_INVALID_ARGUMENT',
  /** Attempted to create a resource that already exists (general case). */
  ALREADY_EXISTS = 'ARG_ALREADY_EXISTS',
}


/**
 * @class GMIError
 * @extends {Error}
 * @description
 * Base custom error class for the Voice Chat Assistant application.
 * It standardizes error handling by including a specific `GMIErrorCode`,
 * optional details, context, an HTTP status code suggestion, and an operational flag.
 * This class aims to provide rich error information for logging, debugging, and client responses.
 *
 * @param {string} message - A human-readable description of the error.
 * @param {GMIErrorCode} code - A `GMIErrorCode` enum value identifying the type of error.
 * @param {any} [details] - Additional details or the original error object that caused this error.
 * @param {Record<string, any>} [context] - Key-value pairs providing extra context about the error scenario.
 * @param {number} [httpStatusCode] - A suggested HTTP status code to be used if this error is sent in an API response.
 * @param {boolean} [isOperational=true] - Flag indicating if the error is operational (expected, known failure mode)
 * or a programmer error (unexpected bug). Defaults to true.
 *
 * @example
 * // Throwing a GMIError
 * if (!user) {
 * throw new GMIError("User not found.", GMIErrorCode.USER_NOT_FOUND, { userId: '123' }, undefined, 404);
 * }
 *
 * @see GMIErrorCode For the list of possible error codes.
 */
export class GMIError extends Error {
  /**
   * The specific error code from the `GMIErrorCode` enum.
   * @type {GMIErrorCode}
   * @readonly
   */
  public readonly code: GMIErrorCode;

  /**
   * Additional details about the error. This can be any type, often an underlying error object or structured data.
   * @type {any | undefined}
   * @readonly
   */
  public readonly details?: any;

  /**
   * Timestamp of when the error instance was created.
   * @type {Date}
   * @readonly
   */
  public readonly timestamp: Date;

  /**
   * An optional record of key-value pairs providing extra context about the state of the application or
   * relevant variables when the error occurred. Useful for debugging.
   * @type {Record<string, any> | undefined}
   * @readonly
   */
  public readonly context?: Record<string, any>;

  /**
   * A suggested HTTP status code that is appropriate for this error if it's being translated into an API response.
   * This can be overridden by specific error handling logic. If not provided, `getHttpStatusCode()` will attempt to infer one.
   * @type {number | undefined}
   * @readonly
   */
  public readonly httpStatusCode?: number;

  /**
   * Indicates whether this error is considered "operational".
   * Operational errors are typically known failure modes of the system (e.g., invalid input, resource not found,
   * external service timeout) rather than programmer errors (bugs). This flag can be used by error handlers
   * to decide on logging verbosity or process termination strategies.
   * @type {boolean}
   * @default true
   * @readonly
   */
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: GMIErrorCode,
    details?: any,
    context?: Record<string, any>,
    httpStatusCode?: number,
    isOperational: boolean = true
  ) {
    super(message);

    this.name = this.constructor.name; // Set name to 'GMIError'
    this.code = code;
    this.details = details;
    this.context = context;
    this.timestamp = new Date();
    this.httpStatusCode = httpStatusCode;
    this.isOperational = isOperational;

    // Maintain a proper stack trace (if `Error.captureStackTrace` is available, e.g., in Node.js).
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Required for proper `instanceof` checks with custom errors in TypeScript.
    Object.setPrototypeOf(this, GMIError.prototype);
  }

  /**
   * Converts the GMIError instance into a plain JavaScript object suitable for JSON serialization.
   * Includes the error stack in non-production environments for debugging.
   *
   * @method toJSON
   * @returns {object} A plain object representation of the error.
   * @example
   * const err = new GMIError("Sample error", GMIErrorCode.INTERNAL_SERVER_ERROR);
   * const errJson = JSON.stringify(err); // Uses err.toJSON()
   */
  public toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details, // `details` might contain non-serializable parts if it's a complex object/error. Consider a custom serializer for details if needed.
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      httpStatusCode: this.httpStatusCode,
      isOperational: this.isOperational,
      stack: process.env.NODE_ENV !== 'production' ? this.stack : undefined,
    };
  }

  /**
   * Alias for `toJSON()`. Provides a consistent way to get a plain object representation.
   *
   * @method toPlainObject
   * @returns {object} A plain object representation of the error.
   */
  public toPlainObject(): object {
    return this.toJSON();
  }


  /**
   * Generates a user-friendly message for this error, suitable for display in a client application.
   * It maps specific error codes to more generic, less technical messages.
   * If no specific user-friendly message is mapped for the error code, it defaults to the error's `message` property,
   * or a generic "An unexpected error occurred." message.
   *
   * @method getUserFriendlyMessage
   * @returns {string} A user-friendly error message.
   */
  public getUserFriendlyMessage(): string {
    const userFriendlyMessages: Partial<Record<GMIErrorCode, string>> = {
      [GMIErrorCode.AUTHENTICATION_REQUIRED]: 'Please log in to continue.',
      [GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS]: 'Invalid username or password.',
      [GMIErrorCode.AUTHENTICATION_EMAIL_NOT_VERIFIED]: 'Please verify your email address before logging in.',
      [GMIErrorCode.EMAIL_VERIFICATION_TOKEN_INVALID]: 'The email verification link is invalid or has expired. Please request a new one.',
      [GMIErrorCode.PERMISSION_DENIED]: "You don't have permission to perform this action.",
      [GMIErrorCode.USER_NOT_FOUND]: 'User account not found.',
      [GMIErrorCode.REGISTRATION_EMAIL_EXISTS]: 'An account with this email address already exists. Try logging in or use a different email.',
      [GMIErrorCode.REGISTRATION_USERNAME_EXISTS]: 'This username is already taken. Please choose another one.',
      [GMIErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please wait a moment and try again.',
      [GMIErrorCode.COST_THRESHOLD_EXCEEDED]: 'Your usage limit has been reached for the current period.',
      [GMIErrorCode.LLM_PROVIDER_UNAVAILABLE]: 'The AI service is temporarily unavailable. Please try again shortly.',
      [GMIErrorCode.VOICE_PROCESSING_ERROR]: 'There was an issue processing your voice input. Please try again.',
      [GMIErrorCode.OAUTH_AUTHENTICATION_FAILED]: 'Authentication with the external provider failed. Please try again or use a different login method.',
      [GMIErrorCode.OAUTH_PROVIDER_NOT_CONFIGURED]: 'Login with this provider is currently not available.',
      [GMIErrorCode.INTERNAL_SERVER_ERROR]: 'An unexpected error occurred on our end. We are looking into it. Please try again later.',
    };
    return userFriendlyMessages[this.code] || this.message || 'An unexpected error occurred.';
  }

  /**
   * Determines an appropriate HTTP status code for this error.
   * If `this.httpStatusCode` is set, it's returned. Otherwise, it maps `GMIErrorCode`
   * to common HTTP status codes. Defaults to 500 for unmapped errors.
   *
   * @method getHttpStatusCode
   * @returns {number} An HTTP status code.
   */
  public getHttpStatusCode(): number {
    if (this.httpStatusCode) {
      return this.httpStatusCode;
    }

    const statusCodeMap: Partial<Record<GMIErrorCode, number>> = {
      [GMIErrorCode.VALIDATION_ERROR]: 400,
      [GMIErrorCode.INVALID_ARGUMENT]: 400,
      [GMIErrorCode.PARSING_ERROR]: 400,
      [GMIErrorCode.OAUTH_ID_TOKEN_MISSING]: 400,
      [GMIErrorCode.OAUTH_INVALID_TOKEN_PAYLOAD]: 400,
      [GMIErrorCode.OAUTH_MISSING_AUTH_CODE]: 400,
      [GMIErrorCode.EMAIL_VERIFICATION_TOKEN_INVALID]: 400,
      [GMIErrorCode.PASSWORD_RESET_TOKEN_INVALID]: 400,

      [GMIErrorCode.AUTHENTICATION_REQUIRED]: 401,
      [GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS]: 401,
      [GMIErrorCode.AUTHENTICATION_TOKEN_INVALID]: 401,
      [GMIErrorCode.AUTHENTICATION_TOKEN_EXPIRED]: 401,
      [GMIErrorCode.OAUTH_AUTHENTICATION_FAILED]: 401,


      [GMIErrorCode.PERMISSION_DENIED]: 403,
      [GMIErrorCode.ACCESS_DENIED]: 403,
      [GMIErrorCode.INSUFFICIENT_PERMISSIONS]: 403,
      [GMIErrorCode.AUTHENTICATION_EMAIL_NOT_VERIFIED]: 403,


      [GMIErrorCode.USER_NOT_FOUND]: 404,
      [GMIErrorCode.RESOURCE_NOT_FOUND]: 404,
      [GMIErrorCode.PERSONA_NOT_FOUND]: 404,
      [GMIErrorCode.ENDPOINT_NOT_FOUND]: 404,
      [GMIErrorCode.TOOL_NOT_FOUND]: 404,

      [GMIErrorCode.REGISTRATION_EMAIL_EXISTS]: 409,
      [GMIErrorCode.REGISTRATION_USERNAME_EXISTS]: 409,
      [GMIErrorCode.RESOURCE_ALREADY_EXISTS]: 409,
      [GMIErrorCode.ALREADY_EXISTS]: 409,

      [GMIErrorCode.RATE_LIMIT_EXCEEDED]: 429,
      [GMIErrorCode.LLM_PROVIDER_RATE_LIMIT]: 429,

      [GMIErrorCode.SERVICE_UNAVAILABLE]: 503,
      [GMIErrorCode.LLM_PROVIDER_UNAVAILABLE]: 503,
      [GMIErrorCode.DATABASE_CONNECTION_ERROR]: 503,
      [GMIErrorCode.OAUTH_PROVIDER_NOT_CONFIGURED]: 503,
    };
    return statusCodeMap[this.code] || 500; // Default to 500 Internal Server Error
  }
}

/**
 * Creates a `GMIError` instance from a generic `Error` object or any caught exception.
 * This utility helps in standardizing unknown errors into the `GMIError` format.
 *
 * @function createGMIErrorFromError
 * @param {unknown} error - The original error or exception caught.
 * @param {GMIErrorCode} [defaultCode=GMIErrorCode.INTERNAL_SERVER_ERROR] - The default `GMIErrorCode` to use if the original error is not a `GMIError`.
 * @param {Record<string, any>} [context] - Additional context to add to the new `GMIError`.
 * @param {string} [defaultMessage] - A default message if the original error has no message.
 * @returns {GMIError} A `GMIError` instance.
 */
export function createGMIErrorFromError(
  error: unknown, // Changed to unknown for broader catch compatibility
  defaultCode: GMIErrorCode = GMIErrorCode.INTERNAL_SERVER_ERROR,
  context?: Record<string, any>,
  defaultMessage: string = 'An unexpected error occurred.'
): GMIError {
  if (error instanceof GMIError) {
    // If a new context is provided, merge it with the existing error's context.
    if (context) {
      return new GMIError(
        error.message,
        error.code,
        error.details,
        { ...error.context, ...context }, // Merge contexts
        error.httpStatusCode,
        error.isOperational
      );
    }
    return error; // Return original GMIError if no new context to add
  }

  const errInstance = error instanceof Error ? error : new Error(String(error || defaultMessage));

  return new GMIError(
    errInstance.message || defaultMessage,
    defaultCode,
    { originalErrorName: errInstance.name, originalErrorMessage: errInstance.message, stack: errInstance.stack },
    context
  );
}


/**
 * Type guard to check if an error is an instance of `GMIError`.
 *
 * @function isGMIError
 * @param {any} error - The error object to check.
 * @returns {error is GMIError} True if the error is a `GMIError`, false otherwise.
 */
export function isGMIError(error: any): error is GMIError {
  return error instanceof GMIError || (
    typeof error === 'object' && error !== null &&
    error.name === 'GMIError' && // Check constructor name for robustness
    typeof (error as GMIError).code === 'string' &&
    typeof (error as GMIError).message === 'string'
  );
}

/**
 * Checks if an error is likely an "operational" error (i.e., an expected failure mode, not a bug).
 *
 * @function isOperationalError
 * @param {any} error - The error object to check.
 * @returns {boolean} True if the error is a `GMIError` flagged as operational, false otherwise. Native errors are generally not considered operational by this check unless wrapped.
 */
export function isOperationalError(error: any): boolean {
  if (isGMIError(error)) {
    return error.isOperational;
  }
  // By default, non-GMIError instances are not considered operational unless explicitly handled.
  return false;
}

/**
 * @namespace ErrorFactory
 * @description A collection of factory functions for creating common `GMIError` types
 * with predefined error codes and suggested HTTP status codes. This simplifies error creation
 * and ensures consistency.
 */
export const ErrorFactory = {
  /**
   * Creates a validation error, typically for invalid user input.
   * @method validation
   * @param {string} message - Custom error message.
   * @param {any} [details] - Details about the validation failure (e.g., field errors).
   * @returns {GMIError} A `GMIError` with code `VALIDATION_ERROR` and HTTP status 400.
   */
  validation: (message: string, details?: any): GMIError =>
    new GMIError(message, GMIErrorCode.VALIDATION_ERROR, details, undefined, 400),

  /**
   * Creates an authentication error.
   * @method authentication
   * @param {string} message - Custom error message.
   * @param {any} [details] - Additional details.
   * @param {GMIErrorCode} [code=GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS] - Specific authentication error code.
   * @returns {GMIError} A `GMIError` with the specified code and HTTP status 401.
   */
  authentication: (message: string, details?: any, code: GMIErrorCode = GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS): GMIError =>
    new GMIError(message, code, details, undefined, 401),

  /**
   * Creates a permission denied error.
   * @method permissionDenied
   * @param {string} message - Custom error message.
   * @param {any} [details] - Additional details.
   * @returns {GMIError} A `GMIError` with code `PERMISSION_DENIED` and HTTP status 403.
   */
  permissionDenied: (message: string, details?: any): GMIError =>
    new GMIError(message, GMIErrorCode.PERMISSION_DENIED, details, undefined, 403),

  /**
   * Creates a resource not found error.
   * @method notFound
   * @param {string} message - Custom error message.
   * @param {any} [details] - Additional details.
   * @param {GMIErrorCode} [code=GMIErrorCode.RESOURCE_NOT_FOUND] - Specific not found error code.
   * @returns {GMIError} A `GMIError` with the specified code and HTTP status 404.
   */
  notFound: (message: string, details?: any, code: GMIErrorCode = GMIErrorCode.RESOURCE_NOT_FOUND): GMIError =>
    new GMIError(message, code, details, undefined, 404),

  /**
   * Creates a rate limit exceeded error.
   * @method rateLimit
   * @param {string} message - Custom error message.
   * @param {any} [details] - Additional details (e.g., retry-after time).
   * @returns {GMIError} A `GMIError` with code `RATE_LIMIT_EXCEEDED` and HTTP status 429.
   */
  rateLimit: (message: string, details?: any): GMIError =>
    new GMIError(message, GMIErrorCode.RATE_LIMIT_EXCEEDED, details, undefined, 429),

  /**
   * Creates a generic internal server error.
   * @method internal
   * @param {string} message - Custom error message.
   * @param {any} [details] - Underlying error or details.
   * @returns {GMIError} A `GMIError` with code `INTERNAL_SERVER_ERROR` and HTTP status 500.
   */
  internal: (message: string, details?: any): GMIError =>
    new GMIError(message, GMIErrorCode.INTERNAL_SERVER_ERROR, details, undefined, 500),

  /**
   * Creates a service unavailable error.
   * @method serviceUnavailable
   * @param {string} message - Custom error message.
   * @param {any} [details] - Additional details.
   * @returns {GMIError} A `GMIError` with code `SERVICE_UNAVAILABLE` and HTTP status 503.
   */
  serviceUnavailable: (message: string, details?: any): GMIError =>
    new GMIError(message, GMIErrorCode.SERVICE_UNAVAILABLE, details, undefined, 503),

  /**
   * Creates a configuration error.
   * @method configuration
   * @param {string} message - Custom error message detailing the configuration issue.
   * @param {any} [details] - Specifics about the misconfiguration.
   * @returns {GMIError} A `GMIError` with code `CONFIGURATION_ERROR` and HTTP status 500.
   */
  configuration: (message: string, details?: any): GMIError =>
    new GMIError(message, GMIErrorCode.CONFIGURATION_ERROR, details, undefined, 500),
};

/**
 * Creates an Express error handling middleware function.
 * This middleware catches errors passed via `next(error)`, standardizes them into `GMIError` format,
 * logs them, and sends a structured JSON error response to the client.
 *
 * @function createErrorHandler
 * @param {boolean} [includeSensitiveDetailsInResponse=false] - If true, includes potentially sensitive details like
 * original error messages and stack traces in the JSON response. **Should only be `true` in development environments.**
 * @returns {(err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => void} The Express error handling middleware.
 *
 * @example
 * // In server.ts
 * app.use(createErrorHandler(process.env.NODE_ENV === 'development'));
 */
export function createErrorHandler(includeSensitiveDetailsInResponse: boolean = false) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: any, req: Request, res: Response, next: NextFunction): void => {
    const gmiError = createGMIErrorFromError(err); // Standardize any error into GMIError

    // Comprehensive server-side logging
    console.error(
      `[${gmiError.timestamp.toISOString()}] GMIError processing ${req.method} ${req.originalUrl}:`,
      {
        code: gmiError.code,
        message: gmiError.message, // Log the original, more detailed message
        clientMessage: gmiError.getUserFriendlyMessage(), // What client would see
        isOperational: gmiError.isOperational,
        httpStatusCode: gmiError.getHttpStatusCode(),
        details: gmiError.details, // Might be an original error object
        context: gmiError.context,
        userId: (req as AuthenticatedRequest).user?.userId || 'N/A', // If using AuthenticatedRequest
        ip: req.ip,
        stack: gmiError.stack, // Always log stack server-side for debugging
      }
    );

    if (res.headersSent) {
      console.error("[ErrorHandler] Headers were already sent. Cannot send JSON error response. This may indicate an error during streaming or a double error handling.");
      // When headers are sent, Express's default error handler will close the connection.
      // Avoid calling next(err) here as it might lead to infinite loops if this is the last error handler.
      return;
    }

    const responsePayload: { error: Record<string, any> } = {
      error: {
        code: gmiError.code,
        message: gmiError.getUserFriendlyMessage(), // User-friendly message for the client
        timestamp: gmiError.timestamp.toISOString(),
      }
    };

    // Only include sensitive details in development or if explicitly configured
    if (includeSensitiveDetailsInResponse) {
      responsePayload.error.originalMessage = gmiError.message; // The original, potentially more technical message
      if (gmiError.details) responsePayload.error.details = gmiError.details;
      if (gmiError.context) responsePayload.error.context = gmiError.context;
      if (gmiError.stack) responsePayload.error.stack = gmiError.stack.split('\n').map(s => s.trim()); // Clean up stack for readability
    }

    res.status(gmiError.getHttpStatusCode()).json(responsePayload);
  };
}