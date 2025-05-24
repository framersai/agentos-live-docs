// File: backend/utils/errors.ts
/**
 * @fileoverview Centralized error handling system for Voice Chat Assistant.
 * Defines error codes, custom error classes, and error handling utilities
 * for consistent error management across the entire application.
 * @module backend/utils/errors
 */

/**
 * Enumeration of all error codes used throughout the Voice Chat Assistant application.
 * These codes provide consistent error identification across different modules.
 * @enum {string}
 */
export enum GMIErrorCode {
  // --- General System Errors ---
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR', // Generic config error
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  ENDPOINT_NOT_FOUND = 'ENDPOINT_NOT_FOUND',
  INVALID_STATE = 'INVALID_STATE', // Added for GMI state issues
  PARSING_ERROR = 'PARSING_ERROR', // Added for JSON parsing etc.
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR', // Added for missing/failed dependencies

  // --- Authentication & Authorization Errors ---
  AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',
  AUTHENTICATION_INVALID_CREDENTIALS = 'AUTHENTICATION_INVALID_CREDENTIALS',
  AUTHENTICATION_EMAIL_NOT_VERIFIED = 'AUTHENTICATION_EMAIL_NOT_VERIFIED',
  AUTHENTICATION_TOKEN_MISSING = 'AUTHENTICATION_TOKEN_MISSING',
  AUTHENTICATION_TOKEN_INVALID = 'AUTHENTICATION_TOKEN_INVALID',
  AUTHENTICATION_TOKEN_EXPIRED = 'AUTHENTICATION_TOKEN_EXPIRED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  ACCESS_DENIED = 'ACCESS_DENIED', // Often synonymous with PERMISSION_DENIED
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS', // More specific than PERMISSION_DENIED

  // --- User Management Errors ---
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_INVALID = 'USER_INVALID',
  REGISTRATION_EMAIL_EXISTS = 'REGISTRATION_EMAIL_EXISTS',
  REGISTRATION_USERNAME_EXISTS = 'REGISTRATION_USERNAME_EXISTS',

  // --- Password Management Errors ---
  PASSWORD_RESET_ERROR = 'PASSWORD_RESET_ERROR',
  PASSWORD_RESET_TOKEN_INVALID = 'PASSWORD_RESET_TOKEN_INVALID',

  // --- Session Management Errors ---
  SESSION_ERROR = 'SESSION_ERROR',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SESSION_INVALID = 'SESSION_INVALID',

  // --- Database & Storage Errors ---
  DATABASE_ERROR = 'DATABASE_ERROR',
  DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND', // General resource not found
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  STORAGE_ERROR = 'STORAGE_ERROR',

  // --- Encryption & Security Errors ---
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  ENCRYPTION_DECRYPTION_ERROR = 'ENCRYPTION_DECRYPTION_ERROR',
  SECURITY_RISK = 'SECURITY_RISK',

  // --- AgentOS & GMI Errors ---
  GMI_ERROR = 'GMI_ERROR', // Generic GMI error
  GMI_NOT_FOUND = 'GMI_NOT_FOUND',
  GMI_INITIALIZATION_ERROR = 'GMI_INITIALIZATION_ERROR', // Use this instead of INITIALIZATION_FAILED
  GMI_PROCESSING_ERROR = 'GMI_PROCESSING_ERROR', // Use this instead of PROCESSING_ERROR
  GMI_CONTEXT_ERROR = 'GMI_CONTEXT_ERROR',
  GMI_MEMORY_ERROR = 'GMI_MEMORY_ERROR',
  GMI_FEEDBACK_ERROR = 'GMI_FEEDBACK_ERROR', // Added for feedback route
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED', // Added for feedback route

  // --- Persona & Agent Errors ---
  PERSONA_NOT_FOUND = 'PERSONA_NOT_FOUND',
  PERSONA_LOAD_ERROR = 'PERSONA_LOAD_ERROR', // Use this instead of PERSONA_LOAD_FAILED
  PERSONA_ACCESS_DENIED = 'PERSONA_ACCESS_DENIED',
  AGENT_ERROR = 'AGENT_ERROR',
  AGENT_UNAVAILABLE = 'AGENT_UNAVAILABLE',

  // --- LLM Provider Errors ---
  LLM_PROVIDER_ERROR = 'LLM_PROVIDER_ERROR', // Use this instead of PROVIDER_ERROR
  LLM_PROVIDER_UNAVAILABLE = 'LLM_PROVIDER_UNAVAILABLE',
  LLM_PROVIDER_API_KEY_INVALID = 'LLM_PROVIDER_API_KEY_INVALID',
  LLM_PROVIDER_RATE_LIMIT = 'LLM_PROVIDER_RATE_LIMIT',
  LLM_PROVIDER_QUOTA_EXCEEDED = 'LLM_PROVIDER_QUOTA_EXCEEDED',
  LLM_MODEL_NOT_FOUND = 'LLM_MODEL_NOT_FOUND',

  // --- Tool System Errors ---
  TOOL_ERROR = 'TOOL_ERROR', // Generic tool error
  TOOL_NOT_FOUND = 'TOOL_NOT_FOUND',
  TOOL_EXECUTION_ERROR = 'TOOL_EXECUTION_ERROR', // General execution error
  TOOL_EXECUTION_FAILED = 'TOOL_EXECUTION_FAILED', // Specific failure state
  TOOL_PERMISSION_DENIED = 'TOOL_PERMISSION_DENIED',
  TOOL_VALIDATION_ERROR = 'TOOL_VALIDATION_ERROR', // Argument validation

  // --- RAG & Vector Store Errors ---
  RAG_ERROR = 'RAG_ERROR', // Generic RAG error
  RAG_INGESTION_FAILED = 'RAG_INGESTION_FAILED', // Added
  VECTOR_STORE_ERROR = 'VECTOR_STORE_ERROR',
  VECTOR_STORE_CONNECTION_ERROR = 'VECTOR_STORE_CONNECTION_ERROR',
  EMBEDDING_ERROR = 'EMBEDDING_ERROR',
  RETRIEVAL_ERROR = 'RETRIEVAL_ERROR',

  // --- Voice & Audio Processing Errors ---
  VOICE_PROCESSING_ERROR = 'VOICE_PROCESSING_ERROR',
  AUDIO_TRANSCRIPTION_ERROR = 'AUDIO_TRANSCRIPTION_ERROR',
  AUDIO_SYNTHESIS_ERROR = 'AUDIO_SYNTHESIS_ERROR',
  WHISPER_STT_ERROR = 'WHISPER_STT_ERROR',
  TTS_ERROR = 'TTS_ERROR',

  // --- Streaming & Communication Errors ---
  STREAM_ERROR = 'STREAM_ERROR',
  STREAMING_INITIALIZATION_ERROR = 'STREAMING_INITIALIZATION_ERROR',
  WEBSOCKET_ERROR = 'WEBSOCKET_ERROR',

  // --- Subscription & Payment Errors ---
  SUBSCRIPTION_ERROR = 'SUBSCRIPTION_ERROR',
  SUBSCRIPTION_TIER_NOT_FOUND = 'SUBSCRIPTION_TIER_NOT_FOUND',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  PAYMENT_PROVIDER_ERROR = 'PAYMENT_PROVIDER_ERROR',
  WEBHOOK_VALIDATION_FAILED = 'WEBHOOK_VALIDATION_FAILED',
  WEBHOOK_PROCESSING_ERROR = 'WEBHOOK_PROCESSING_ERROR',

  // --- Rate Limiting & Usage Errors ---
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  COST_THRESHOLD_EXCEEDED = 'COST_THRESHOLD_EXCEEDED',
  USAGE_LIMIT_EXCEEDED = 'USAGE_LIMIT_EXCEEDED',

  // --- Configuration & Environment Errors ---
  // CONFIG_ERROR already exists from general system errors
  ENVIRONMENT_ERROR = 'ENVIRONMENT_ERROR',
  MISSING_ENV_VAR = 'MISSING_ENV_VAR',

  // --- UI & Frontend Integration Errors ---
  UI_ORCHESTRATION_ERROR = 'UI_ORCHESTRATION_ERROR',
  DYNAMIC_UI_ERROR = 'DYNAMIC_UI_ERROR',

  // --- Memory Lifecycle Errors ---
  MEMORY_LIFECYCLE_ERROR = 'MEMORY_LIFECYCLE_ERROR',
  MEMORY_EVICTION_ERROR = 'MEMORY_EVICTION_ERROR',

  // Added from ITool
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  ALREADY_EXISTS = 'ALREADY_EXISTS',

  // Added based on GMI.ts need (if not using more specific errors from above)
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR', // General auth error
}

/**
 * Base error class for all Voice Chat Assistant application errors.
 * Extends the native Error class with additional properties for better error handling.
 * @class GMIError
 * @extends {Error}
 */
export class GMIError extends Error {
  public readonly code: GMIErrorCode;
  public readonly details?: any;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;
  public readonly statusCode?: number;
  public readonly isOperational: boolean;

  /**
   * Creates an instance of GMIError.
   * @param {string} message - Human-readable error message
   * @param {GMIErrorCode} code - Specific error code for categorization
   * @param {any} [details] - Additional error details or underlying error
   * @param {Record<string, any>} [context] - Additional context information
   * @param {number} [statusCode] - HTTP status code if applicable
   * @param {boolean} [isOperational=true] - Whether this is an operational error
   */
  constructor(
    message: string,
    code: GMIErrorCode,
    details?: any,
    context?: Record<string, any>,
    statusCode?: number,
    isOperational: boolean = true
  ) {
    super(message);
    
    this.name = 'GMIError';
    this.code = code;
    this.details = details;
    this.context = context;
    this.timestamp = new Date();
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintain proper stack trace for where the error was thrown (Node.js only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GMIError);
    }

    // Set the prototype explicitly for proper instanceof checks
    Object.setPrototypeOf(this, GMIError.prototype);
  }

  /**
   * Converts the error to a JSON-serializable object.
   * @returns {object} JSON representation of the error
   */
  public toJSON(): object { // Renamed to toPlainObject in GMI.ts, but toJSON is standard
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      stack: process.env.NODE_ENV !== 'production' ? this.stack : undefined,
    };
  }

   /**
   * Converts the error to a plain object, useful for logging or serialization without methods.
   * @returns {object} Plain object representation of the error
   */
  public toPlainObject(): object { // Added to match GMI.ts usage if intended
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      stack: process.env.NODE_ENV !== 'production' ? this.stack : undefined,
    };
  }


  /**
   * Creates a user-friendly error message suitable for frontend display.
   * @returns {string} User-friendly error message
   */
  public getUserFriendlyMessage(): string {
    const userFriendlyMessages: Partial<Record<GMIErrorCode, string>> = {
      [GMIErrorCode.AUTHENTICATION_REQUIRED]: 'Please log in to continue.',
      [GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS]: 'Invalid username or password.',
      [GMIErrorCode.AUTHENTICATION_EMAIL_NOT_VERIFIED]: 'Please verify your email address before logging in.',
      [GMIErrorCode.PERMISSION_DENIED]: 'You don\'t have permission to perform this action.',
      [GMIErrorCode.USER_NOT_FOUND]: 'User account not found.',
      [GMIErrorCode.REGISTRATION_EMAIL_EXISTS]: 'An account with this email already exists.',
      [GMIErrorCode.REGISTRATION_USERNAME_EXISTS]: 'This username is already taken.',
      [GMIErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please wait a moment and try again.',
      [GMIErrorCode.COST_THRESHOLD_EXCEEDED]: 'Usage limit reached for your current plan.',
      [GMIErrorCode.LLM_PROVIDER_UNAVAILABLE]: 'AI service temporarily unavailable. Please try again.',
      [GMIErrorCode.VOICE_PROCESSING_ERROR]: 'Voice processing failed. Please try again.',
      [GMIErrorCode.INTERNAL_SERVER_ERROR]: 'Something went wrong. Please try again later.',
    };

    return userFriendlyMessages[this.code] || this.message || 'An unexpected error occurred.';
  }

  /**
   * Determines the appropriate HTTP status code for this error.
   * @returns {number} HTTP status code
   */
  public getHttpStatusCode(): number {
    if (this.statusCode) {
      return this.statusCode;
    }

    const statusCodeMap: Partial<Record<GMIErrorCode, number>> = {
      [GMIErrorCode.VALIDATION_ERROR]: 400,
      [GMIErrorCode.AUTHENTICATION_REQUIRED]: 401,
      [GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS]: 401,
      [GMIErrorCode.AUTHENTICATION_TOKEN_INVALID]: 401,
      [GMIErrorCode.AUTHENTICATION_TOKEN_EXPIRED]: 401,
      [GMIErrorCode.PERMISSION_DENIED]: 403,
      [GMIErrorCode.ACCESS_DENIED]: 403,
      [GMIErrorCode.INSUFFICIENT_PERMISSIONS]: 403,
      [GMIErrorCode.USER_NOT_FOUND]: 404,
      [GMIErrorCode.RESOURCE_NOT_FOUND]: 404,
      [GMIErrorCode.PERSONA_NOT_FOUND]: 404,
      [GMIErrorCode.ENDPOINT_NOT_FOUND]: 404,
      [GMIErrorCode.REGISTRATION_EMAIL_EXISTS]: 409,
      [GMIErrorCode.REGISTRATION_USERNAME_EXISTS]: 409,
      [GMIErrorCode.RESOURCE_ALREADY_EXISTS]: 409,
      [GMIErrorCode.RATE_LIMIT_EXCEEDED]: 429,
      [GMIErrorCode.LLM_PROVIDER_RATE_LIMIT]: 429,
      [GMIErrorCode.SERVICE_UNAVAILABLE]: 503,
      [GMIErrorCode.LLM_PROVIDER_UNAVAILABLE]: 503,
    };

    return statusCodeMap[this.code] || 500;
  }
}

/**
 * Creates a GMIError from a generic Error object.
 * @param {Error} error - The original error
 * @param {GMIErrorCode} [code] - Optional error code override
 * @param {Record<string, any>} [context] - Additional context
 * @param {string} [defaultMessage] - Optional default message if error.message is empty
 * @returns {GMIError} A GMIError instance
 */
export function createGMIErrorFromError(
  error: Error,
  code?: GMIErrorCode,
  context?: Record<string, any>,
  defaultMessage?: string
): GMIError {
  if (error instanceof GMIError) {
    // If a new code or context is provided, re-wrap to update them
    if (code && error.code !== code) {
        return new GMIError(error.message, code, error.details, context || error.context, error.statusCode, error.isOperational);
    }
    if (context) { // merge contexts if new one provided
        return new GMIError(error.message, error.code, error.details, {...error.context, ...context}, error.statusCode, error.isOperational);
    }
    return error;
  }

  const errorCode = code || GMIErrorCode.INTERNAL_SERVER_ERROR;
  const message = error.message || defaultMessage || 'An unexpected error occurred.';
  
  return new GMIError(
    message,
    errorCode,
    { originalErrorName: error.name, originalErrorMessage: error.message, stack: error.stack },
    context
  );
}


/**
 * Checks if an error is a GMIError instance.
 * @param {any} error - The error to check
 * @returns {boolean} True if the error is a GMIError
 */
export function isGMIError(error: any): error is GMIError {
  return error instanceof GMIError || (error && error.name === 'GMIError' && error.code && error.message);
}

/**
 * Checks if an error is operational (expected) vs programming error.
 * @param {any} error - The error to check
 * @returns {boolean} True if the error is operational
 */
export function isOperationalError(error: any): boolean {
  if (isGMIError(error)) {
    return error.isOperational;
  }
  return false; // Native errors are generally not considered operational unless explicitly wrapped
}

/**
 * Utility function to create common error types with less boilerplate.
 */
export const ErrorFactory = {
  /**
   * Creates a validation error.
   */
  validation(message: string, details?: any): GMIError {
    return new GMIError(message, GMIErrorCode.VALIDATION_ERROR, details, undefined, 400);
  },

  /**
   * Creates an authentication error.
   */
  authentication(message: string, details?: any, code: GMIErrorCode = GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS): GMIError {
    return new GMIError(message, code, details, undefined, 401);
  },

  /**
   * Creates a permission denied error.
   */
  permissionDenied(message: string, details?: any): GMIError {
    return new GMIError(message, GMIErrorCode.PERMISSION_DENIED, details, undefined, 403);
  },

  /**
   * Creates a not found error.
   */
  notFound(message: string, details?: any, code: GMIErrorCode = GMIErrorCode.RESOURCE_NOT_FOUND): GMIError {
    return new GMIError(message, code, details, undefined, 404);
  },

  /**
   * Creates a rate limit error.
   */
  rateLimit(message: string, details?: any): GMIError {
    return new GMIError(message, GMIErrorCode.RATE_LIMIT_EXCEEDED, details, undefined, 429);
  },

  /**
   * Creates an internal server error.
   */
  internal(message: string, details?: any): GMIError {
    return new GMIError(message, GMIErrorCode.INTERNAL_SERVER_ERROR, details, undefined, 500);
  },

  /**
   * Creates a service unavailable error.
   */
  serviceUnavailable(message: string, details?: any): GMIError {
    return new GMIError(message, GMIErrorCode.SERVICE_UNAVAILABLE, details, undefined, 503);
  },
   /**
   * Creates a configuration error.
   */
  configuration(message: string, details?: any): GMIError {
    return new GMIError(message, GMIErrorCode.CONFIGURATION_ERROR, details, undefined, 500);
  },
};

/**
 * Error handler middleware factory for Express applications.
 * @param {boolean} [includeStackTraceInResponse=false] - Whether to include stack traces in JSON responses (dev only).
 * @returns {Function} Express error handling middleware
 */
export function createErrorHandler(includeStackTraceInResponse: boolean = false) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: any, req: any, res: any, next: any) => { // req and next made any to satisfy Express error middleware signature
    // Ensure error is a GMIError
    const gmiError = isGMIError(err) ? err : createGMIErrorFromError(err, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, "An internal error occurred.");
    
    // Log the full error for monitoring, regardless of environment for server-side logs
    console.error(
        `[${new Date().toISOString()}] GMIError Caught: Code=${gmiError.code}, Msg='${gmiError.message}'`,
        {
            path: req?.originalUrl,
            method: req?.method,
            userId: req?.user?.id || req?.user?.userId || 'N/A', // Attempt to get user ID
            details: JSON.stringify(gmiError.details), // Stringify for better logging of objects
            context: JSON.stringify(gmiError.context),
            stack: gmiError.stack, // Always log stack server-side
        }
    );

    const responsePayload: any = {
      error: {
        code: gmiError.code,
        message: gmiError.getUserFriendlyMessage(), // Use user-friendly message for response
        timestamp: gmiError.timestamp.toISOString(),
      }
    };

    // Include additional sensitive details like full original message, details, and stack only in development
    if (process.env.NODE_ENV === 'development' || includeStackTraceInResponse) {
      responsePayload.error.originalMessage = gmiError.message; // Include original for dev
      if (gmiError.details) responsePayload.error.details = gmiError.details;
      if (gmiError.context) responsePayload.error.context = gmiError.context;
      if (includeStackTraceInResponse && gmiError.stack) { // Only include stack if explicitly asked
          responsePayload.error.stack = gmiError.stack;
      }
    }
    
    if (res.headersSent) {
        // If headers already sent, delegate to default Express error handler
        // This usually means an error occurred during streaming.
        console.error("Error handler called after headers were sent. Cannot send JSON error response.");
        // return next(err); // This might not be what `next` expects here if it's the final handler.
        // It's often best to just terminate the response if possible or let it hang if stream already closed.
        if (!res.writableEnded) {
            res.end(); // Try to end the response.
        }
        return;
    }

    res.status(gmiError.getHttpStatusCode()).json(responsePayload);
  };
}