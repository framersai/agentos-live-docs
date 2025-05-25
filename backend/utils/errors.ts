// File: backend/utils/errors.ts
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

import { Request, Response, NextFunction } from 'express'; // Added import for Express types

// TODO: Define AuthenticatedRequest (e.g., import { Request as ExpressRequest } from 'express'; export interface AuthenticatedRequest extends ExpressRequest { user?: { userId: string; /* ... other user props ... */ } })
// For now, using 'any' or 'Request' where AuthenticatedRequest was.
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    // other user properties can be defined here
  };
}


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
  INTERNAL_SERVER_ERROR = 'SYS_INTERNAL_SERVER_ERROR',
  NOT_INITIALIZED = 'SYS_NOT_INITIALIZED',
  SERVICE_UNAVAILABLE = 'SYS_SERVICE_UNAVAILABLE',
  CONFIGURATION_ERROR = 'SYS_CONFIGURATION_ERROR', // Referenced in PersonaLoader, AgentOS
  VALIDATION_ERROR = 'SYS_VALIDATION_ERROR',
  ENDPOINT_NOT_FOUND = 'SYS_ENDPOINT_NOT_FOUND',
  INVALID_STATE = 'SYS_INVALID_STATE',
  PARSING_ERROR = 'SYS_PARSING_ERROR', // Referenced in GMI
  DEPENDENCY_ERROR = 'SYS_DEPENDENCY_ERROR', // Referenced in GMIManager
  NOT_IMPLEMENTED = 'SYS_NOT_IMPLEMENTED',

  // --- Authentication & Authorization Errors (AUTH_xxxx) ---
  AUTHENTICATION_REQUIRED = 'AUTH_AUTHENTICATION_REQUIRED',
  AUTHENTICATION_INVALID_CREDENTIALS = 'AUTH_AUTHENTICATION_INVALID_CREDENTIALS',
  AUTHENTICATION_EMAIL_NOT_VERIFIED = 'AUTH_AUTHENTICATION_EMAIL_NOT_VERIFIED',
  AUTHENTICATION_TOKEN_MISSING = 'AUTH_AUTHENTICATION_TOKEN_MISSING',
  AUTHENTICATION_TOKEN_INVALID = 'AUTH_AUTHENTICATION_TOKEN_INVALID',
  AUTHENTICATION_TOKEN_EXPIRED = 'AUTH_AUTHENTICATION_TOKEN_EXPIRED',
  PERMISSION_DENIED = 'AUTH_PERMISSION_DENIED',
  ACCESS_DENIED = 'AUTH_ACCESS_DENIED',
  INSUFFICIENT_PERMISSIONS = 'AUTH_INSUFFICIENT_PERMISSIONS',
  AUTHENTICATION_ERROR = 'AUTH_AUTHENTICATION_ERROR',

  // --- OAuth Specific Errors (AUTH_OAUTH_xxxx) ---
  OAUTH_PROVIDER_NOT_CONFIGURED = 'AUTH_OAUTH_PROVIDER_NOT_CONFIGURED',
  OAUTH_AUTHENTICATION_FAILED = 'AUTH_OAUTH_AUTHENTICATION_FAILED',
  OAUTH_ID_TOKEN_MISSING = 'AUTH_OAUTH_ID_TOKEN_MISSING',
  OAUTH_INVALID_TOKEN_PAYLOAD = 'AUTH_OAUTH_INVALID_TOKEN_PAYLOAD',
  OAUTH_MISSING_AUTH_CODE = 'AUTH_OAUTH_MISSING_AUTH_CODE',

  // --- User Management & Email Verification Errors (USER_xxxx) ---
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_INVALID = 'USER_INVALID',
  REGISTRATION_EMAIL_EXISTS = 'USER_REGISTRATION_EMAIL_EXISTS',
  REGISTRATION_USERNAME_EXISTS = 'USER_REGISTRATION_USERNAME_EXISTS',
  EMAIL_VERIFICATION_TOKEN_INVALID = 'USER_EMAIL_VERIFICATION_TOKEN_INVALID',

  // --- Password Management Errors (USER_PWD_xxxx) ---
  PASSWORD_RESET_ERROR = 'USER_PWD_RESET_ERROR',
  PASSWORD_RESET_TOKEN_INVALID = 'USER_PWD_RESET_TOKEN_INVALID',

  // --- Session Management Errors (SESSION_xxxx) ---
  SESSION_ERROR = 'SESSION_ERROR',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SESSION_INVALID = 'SESSION_INVALID',

  // --- Database & Resource Errors (DB_xxxx, RES_xxxx) ---
  DATABASE_ERROR = 'DB_DATABASE_ERROR',
  DATABASE_CONNECTION_ERROR = 'DB_DATABASE_CONNECTION_ERROR',
  RESOURCE_NOT_FOUND = 'RES_RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RES_RESOURCE_ALREADY_EXISTS',
  STORAGE_ERROR = 'RES_STORAGE_ERROR',

  // --- Encryption & Security Errors (SEC_xxxx) ---
  ENCRYPTION_ERROR = 'SEC_ENCRYPTION_ERROR',
  DECRYPTION_ERROR = 'SEC_DECRYPTION_ERROR',
  API_KEY_DECRYPTION_FAILED = 'SEC_API_KEY_DECRYPTION_FAILED',
  ENCRYPTION_DECRYPTION_ERROR = 'SEC_ENCRYPTION_DECRYPTION_ERROR',
  SECURITY_RISK = 'SEC_SECURITY_RISK',

  // --- AgentOS & GMI Errors (AGENTOS_GMI_xxxx) ---
  GMI_ERROR = 'AGENTOS_GMI_ERROR',
  GMI_NOT_FOUND = 'AGENTOS_GMI_NOT_FOUND',
  GMI_INITIALIZATION_ERROR = 'AGENTOS_GMI_INITIALIZATION_ERROR', // Referenced in AgentOS, GMI, GMIManager
  GMI_PROCESSING_ERROR = 'AGENTOS_GMI_PROCESSING_ERROR', // Referenced in AgentOS, GMI
  GMI_CONTEXT_ERROR = 'AGENTOS_GMI_CONTEXT_ERROR',
  GMI_MEMORY_ERROR = 'AGENTOS_GMI_MEMORY_ERROR',
  GMI_FEEDBACK_ERROR = 'AGENTOS_GMI_FEEDBACK_ERROR', // Referenced in AgentOS
  GMI_SHUTDOWN_ERROR = 'AGENTOS_GMI_SHUTDOWN_ERROR', // Referenced in AgentOS

  // --- Persona & Agent Errors (AGENTOS_PERSONA_xxxx) ---
  PERSONA_NOT_FOUND = 'AGENTOS_PERSONA_NOT_FOUND',
  PERSONA_LOAD_ERROR = 'AGENTOS_PERSONA_LOAD_ERROR', // Referenced in GMIManager, PersonaLoader
  PERSONA_ACCESS_DENIED = 'AGENTOS_PERSONA_ACCESS_DENIED',
  AGENT_ERROR = 'AGENTOS_AGENT_ERROR',
  AGENT_UNAVAILABLE = 'AGENTOS_AGENT_UNAVAILABLE',

  // --- LLM Provider Errors (LLM_xxxx) ---
  LLM_PROVIDER_ERROR = 'LLM_PROVIDER_ERROR', // Referenced in GMI
  LLM_PROVIDER_UNAVAILABLE = 'LLM_PROVIDER_UNAVAILABLE',
  LLM_PROVIDER_API_KEY_INVALID = 'LLM_PROVIDER_API_KEY_INVALID',
  LLM_PROVIDER_RATE_LIMIT = 'LLM_PROVIDER_RATE_LIMIT',
  LLM_PROVIDER_QUOTA_EXCEEDED = 'LLM_PROVIDER_QUOTA_EXCEEDED',
  LLM_MODEL_NOT_FOUND = 'LLM_MODEL_NOT_FOUND',

  // --- Tool System Errors (TOOL_xxxx) ---
  TOOL_ERROR = 'TOOL_ERROR', // Referenced in AgentOS
  TOOL_NOT_FOUND = 'TOOL_NOT_FOUND',
  TOOL_EXECUTION_ERROR = 'TOOL_EXECUTION_ERROR',
  TOOL_EXECUTION_FAILED = 'TOOL_EXECUTION_FAILED',
  TOOL_PERMISSION_DENIED = 'TOOL_PERMISSION_DENIED',
  TOOL_VALIDATION_ERROR = 'TOOL_VALIDATION_ERROR',

  // --- RAG & Vector Store Errors (RAG_xxxx) ---
  RAG_ERROR = 'RAG_ERROR',
  RAG_INGESTION_FAILED = 'RAG_INGESTION_FAILED', // Referenced in GMI
  VECTOR_STORE_ERROR = 'RAG_VECTOR_STORE_ERROR',
  VECTOR_STORE_CONNECTION_ERROR = 'RAG_VECTOR_STORE_CONNECTION_ERROR',
  EMBEDDING_ERROR = 'RAG_EMBEDDING_ERROR',
  RETRIEVAL_ERROR = 'RAG_RETRIEVAL_ERROR',

  // --- Voice & Audio Processing Errors (AUDIO_xxxx) ---
  VOICE_PROCESSING_ERROR = 'AUDIO_VOICE_PROCESSING_ERROR',
  AUDIO_TRANSCRIPTION_ERROR = 'AUDIO_TRANSCRIPTION_ERROR',
  AUDIO_SYNTHESIS_ERROR = 'AUDIO_SYNTHESIS_ERROR',
  WHISPER_STT_ERROR = 'AUDIO_WHISPER_STT_ERROR',
  TTS_ERROR = 'AUDIO_TTS_ERROR',

  // --- Streaming & Communication Errors (COMM_xxxx) ---
  STREAM_ERROR = 'COMM_STREAM_ERROR',
  STREAMING_INITIALIZATION_ERROR = 'COMM_STREAMING_INITIALIZATION_ERROR',
  WEBSOCKET_ERROR = 'COMM_WEBSOCKET_ERROR',

  // --- Subscription & Payment Errors (BILLING_xxxx) ---
  SUBSCRIPTION_ERROR = 'BILLING_SUBSCRIPTION_ERROR',
  SUBSCRIPTION_TIER_NOT_FOUND = 'BILLING_SUBSCRIPTION_TIER_NOT_FOUND',
  PAYMENT_ERROR = 'BILLING_PAYMENT_ERROR',
  PAYMENT_PROVIDER_ERROR = 'BILLING_PAYMENT_PROVIDER_ERROR',
  WEBHOOK_VALIDATION_FAILED = 'BILLING_WEBHOOK_VALIDATION_FAILED',
  WEBHOOK_PROCESSING_ERROR = 'BILLING_WEBHOOK_PROCESSING_ERROR',

  // --- Rate Limiting & Usage Errors (LIMIT_xxxx) ---
  RATE_LIMIT_EXCEEDED = 'LIMIT_RATE_LIMIT_EXCEEDED', // Referenced in AgentOSOrchestrator
  COST_THRESHOLD_EXCEEDED = 'LIMIT_COST_THRESHOLD_EXCEEDED',
  USAGE_LIMIT_EXCEEDED = 'LIMIT_USAGE_LIMIT_EXCEEDED',

  // --- Configuration & Environment Errors (ENV_xxxx) ---
  ENVIRONMENT_ERROR = 'ENV_ENVIRONMENT_ERROR',
  MISSING_ENV_VAR = 'ENV_MISSING_ENV_VAR',

  // --- UI & Frontend Integration Errors (UI_xxxx) ---
  UI_ORCHESTRATION_ERROR = 'UI_ORCHESTRATION_ERROR',
  DYNAMIC_UI_ERROR = 'UI_DYNAMIC_UI_ERROR',

  // --- Memory Lifecycle Errors (MEM_xxxx) ---
  MEMORY_LIFECYCLE_ERROR = 'MEM_MEMORY_LIFECYCLE_ERROR',
  MEMORY_EVICTION_ERROR = 'MEM_MEMORY_EVICTION_ERROR',

  // --- General Argument/Input Errors (ARG_xxxx) ---
  INVALID_ARGUMENT = 'ARG_INVALID_ARGUMENT',
  ALREADY_EXISTS = 'ARG_ALREADY_EXISTS',

  // --- General Initialization Error ---
  INITIALIZATION_ERROR = 'INITIALIZATION_ERROR',

  // --- General Operation Error ---
  OPERATION_FAILED = 'OPERATION_FAILED',

  // --- No Auth Method Allowed ---
  AUTHENTICATION_METHOD_NOT_AVAILABLE = 'AUTHENTICATION_METHOD_NOT_AVAILABLE',
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
 * @param {string} [component] - The component or module where the error originated.
 *
 * @example
 * // Throwing a GMIError
 * if (!user) {
 * throw new GMIError("User not found.", GMIErrorCode.USER_NOT_FOUND, { userId: '123' }, undefined, 404, true, 'AuthService');
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

  /**
   * The component or module where the error originated.
   * @type {string | undefined}
   * @readonly
   */
  public readonly component?: string;


  constructor(
    message: string,
    code: GMIErrorCode,
    details?: any,
    context?: Record<string, any>,
    httpStatusCode?: number,
    isOperational: boolean = true,
    component?: string, // Added component parameter
  ) {
    super(message);

    this.name = this.constructor.name; // Set name to 'GMIError'
    this.code = code;
    this.details = details;
    this.context = context;
    this.timestamp = new Date();
    this.httpStatusCode = httpStatusCode;
    this.isOperational = isOperational;
    this.component = component; // Assign component

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.setPrototypeOf(this, GMIError.prototype);
  }

  /**
   * Converts the GMIError instance into a plain JavaScript object suitable for JSON serialization.
   * Includes the error stack in non-production environments for debugging.
   *
   * @method toJSON
   * @returns {object} A plain object representation of the error.
   */
  public toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      httpStatusCode: this.getHttpStatusCode(), // Use getter for consistency
      isOperational: this.isOperational,
      component: this.component,
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
    return statusCodeMap[this.code] || 500;
  }

  /**
   * Static method to wrap an existing error in a GMIError.
   * Useful for standardizing errors caught from external libraries or unforeseen issues.
   * @static
   * @param {any} error - The error to wrap.
   * @param {GMIErrorCode} code - The GMIErrorCode to assign.
   * @param {string} [message] - An optional message to override the original error's message. If not provided, the original message is used.
   * @param {string} [component] - Optional component where error originated or is being wrapped.
   * @param {Record<string, any>} [context] - Optional additional context.
   * @returns {GMIError} A new GMIError instance.
   */
  public static wrap(
    error: any,
    code: GMIErrorCode,
    message?: string,
    component?: string,
    context?: Record<string, any>
  ): GMIError {
    const originalMessage = error instanceof Error ? error.message : String(error);
    const newMessage = message || originalMessage;
    const details = error instanceof GMIError ? error.details : { underlyingError: error, originalMessage };
    const baseComponent = error instanceof GMIError ? error.component : undefined;

    return new GMIError(
      newMessage,
      code,
      details,
      error instanceof GMIError ? { ...error.context, ...context } : context,
      error instanceof GMIError ? error.httpStatusCode : undefined,
      error instanceof GMIError ? error.isOperational : true, // Default wrapped errors to operational unless specified
      component || baseComponent
    );
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
 * @param {string} [component] - Optional component.
 * @returns {GMIError} A `GMIError` instance.
 */
export function createGMIErrorFromError(
  error: unknown,
  defaultCode: GMIErrorCode = GMIErrorCode.INTERNAL_SERVER_ERROR,
  context?: Record<string, any>,
  defaultMessage: string = 'An unexpected error occurred.',
  component?: string,
): GMIError {
  if (error instanceof GMIError) {
    const mergedContext = context ? { ...error.context, ...context } : error.context;
    const mergedComponent = component || error.component;
    if (context || component) { // Only create new if context or component needs updating
        return new GMIError(
            error.message,
            error.code,
            error.details,
            mergedContext,
            error.httpStatusCode,
            error.isOperational,
            mergedComponent
        );
    }
    return error;
  }

  const errInstance = error instanceof Error ? error : new Error(String(error || defaultMessage));

  return new GMIError(
    errInstance.message || defaultMessage,
    defaultCode,
    { originalErrorName: errInstance.name, originalErrorMessage: errInstance.message, stack: errInstance.stack },
    context,
    undefined, // httpStatusCode
    true, // isOperational (default for newly wrapped non-GMIError)
    component
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
    error.name === 'GMIError' &&
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
  return false;
}

/**
 * @namespace ErrorFactory
 * @description A collection of factory functions for creating common `GMIError` types
 * with predefined error codes and suggested HTTP status codes. This simplifies error creation
 * and ensures consistency.
 */
export const ErrorFactory = {
  validation: (message: string, details?: any, component?: string): GMIError =>
    new GMIError(message, GMIErrorCode.VALIDATION_ERROR, details, undefined, 400, true, component),

  authentication: (message: string, details?: any, code: GMIErrorCode = GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS, component?: string): GMIError =>
    new GMIError(message, code, details, undefined, 401, true, component),

  permissionDenied: (message: string, details?: any, component?: string): GMIError =>
    new GMIError(message, GMIErrorCode.PERMISSION_DENIED, details, undefined, 403, true, component),

  notFound: (message: string, details?: any, code: GMIErrorCode = GMIErrorCode.RESOURCE_NOT_FOUND, component?: string): GMIError =>
    new GMIError(message, code, details, undefined, 404, true, component),

  rateLimit: (message: string, details?: any, component?: string): GMIError =>
    new GMIError(message, GMIErrorCode.RATE_LIMIT_EXCEEDED, details, undefined, 429, true, component),

  internal: (message: string, details?: any, component?: string): GMIError =>
    new GMIError(message, GMIErrorCode.INTERNAL_SERVER_ERROR, details, undefined, 500, true, component),

  serviceUnavailable: (message: string, details?: any, component?: string): GMIError =>
    new GMIError(message, GMIErrorCode.SERVICE_UNAVAILABLE, details, undefined, 503, true, component),

  configuration: (message: string, details?: any, component?: string): GMIError =>
    new GMIError(message, GMIErrorCode.CONFIGURATION_ERROR, details, undefined, 500, true, component),
};

/**
 * Creates an Express error handling middleware function.
 * This middleware catches errors passed via `next(error)`, standardizes them into `GMIError` format,
 * logs them, and sends a structured JSON error response to the client.
 *
 * @function createErrorHandler
 * @param {boolean} [includeSensitiveDetailsInResponse=false] - If true, includes potentially sensitive details like
 * original error messages and stack traces in the JSON response. **Should only be `true` in development environments.**
 * @returns {(err: any, req: Request, res: Response, next: NextFunction) => void} The Express error handling middleware.
 *
 * @example
 * // In server.ts
 * app.use(createErrorHandler(process.env.NODE_ENV === 'development'));
 */
export function createErrorHandler(includeSensitiveDetailsInResponse: boolean = false) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: any, req: Request, res: Response, next: NextFunction): void => {
    const gmiError = createGMIErrorFromError(err, GMIErrorCode.INTERNAL_SERVER_ERROR, {url: req.originalUrl, method: req.method}, "ErrorHandler");

    console.error(
      `[${gmiError.timestamp.toISOString()}] GMIError processing ${req.method} ${req.originalUrl}:`,
      {
        code: gmiError.code,
        message: gmiError.message,
        clientMessage: gmiError.getUserFriendlyMessage(),
        isOperational: gmiError.isOperational,
        httpStatusCode: gmiError.getHttpStatusCode(),
        details: gmiError.details,
        context: gmiError.context,
        component: gmiError.component,
        userId: (req as AuthenticatedRequest).user?.userId || 'N/A',
        ip: req.ip,
        stack: gmiError.stack,
      }
    );

    if (res.headersSent) {
      console.error("[ErrorHandler] Headers were already sent. Cannot send JSON error response. This may indicate an error during streaming or a double error handling.");
      return;
    }

    const responsePayload: { error: Record<string, any> } = {
      error: {
        code: gmiError.code,
        message: gmiError.getUserFriendlyMessage(),
        timestamp: gmiError.timestamp.toISOString(),
        component: gmiError.component,
      }
    };

    if (includeSensitiveDetailsInResponse) {
      responsePayload.error.originalMessage = gmiError.message;
      if (gmiError.details) responsePayload.error.details = gmiError.details;
      if (gmiError.context) responsePayload.error.context = gmiError.context;
      if (gmiError.stack) responsePayload.error.stack = gmiError.stack?.split('\n').map(s => s.trim());
    }

    res.status(gmiError.getHttpStatusCode()).json(responsePayload);
  };
}