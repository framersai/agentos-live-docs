# Voice Chat Assistant - Backend Service

---

## 🌐 API Endpoints

The backend exposes a RESTful API, versioned under the base path `/api/v1`.
All protected routes require a Bearer token (JWT) in the `Authorization` header, which is typically managed by an HttpOnly cookie set upon login.

Error responses are standardized. A typical error response will have the following structure:

```json
{
  "error": {
    "code": "ERROR_CODE_FROM_GMIErrorCode",
    "message": "User-friendly error message.",
    "details": { /* Optional: additional details about the error */ },
    "timestamp": "ISO_DATE_STRING"
  }
}
```

In development mode (`NODE_ENV=development`), the error response may include `originalMessage` and `stack` for debugging.

---

## Authentication (`/api/v1/auth`)

Handles user registration, login, session management, profile updates, and password recovery.

| Method | Path | Access | Description | Key Request Body/Params | Success Response (Status) | Common Error Codes |
|--------|------|--------|-------------|-------------------------|---------------------------|-------------------|
| POST | `/register` | Public | Registers a new user. | RegisterUserDto | 201 Created | VALIDATION_ERROR, REGISTRATION_USERNAME_EXISTS, REGISTRATION_EMAIL_EXISTS |
| POST | `/login` | Public | Logs in an existing user with email/password. Sets authToken cookie. | LoginUserDto | 200 OK | VALIDATION_ERROR, AUTHENTICATION_INVALID_CREDENTIALS, AUTHENTICATION_EMAIL_NOT_VERIFIED |
| GET | `/google` | Public | Initiates Google OAuth2 flow. Redirects to Google. | - | 302 Redirect | OAUTH_PROVIDER_NOT_CONFIGURED |
| GET | `/google/callback` | Public | Handles Google OAuth2 callback. Sets authToken cookie. | Query: code | 200 OK / Redirect | OAUTH_MISSING_AUTH_CODE, OAUTH_AUTHENTICATION_FAILED |
| POST | `/logout` | Authenticated | Logs out the current user, invalidates session. Clears authToken cookie. | - | 200 OK | AUTHENTICATION_TOKEN_MISSING |
| POST | `/verify-email` | Public | Verifies user's email with a token. | VerifyEmailDto | 200 OK | VALIDATION_ERROR, EMAIL_VERIFICATION_TOKEN_INVALID |
| GET | `/me` | Authenticated | Retrieves profile and subscription of the current user. | - | 200 OK | USER_NOT_FOUND |
| PUT | `/me` | Authenticated | Updates current user's profile (username, email). | UserProfileUpdateData | 200 OK | VALIDATION_ERROR, REGISTRATION_USERNAME_EXISTS, REGISTRATION_EMAIL_EXISTS |
| POST | `/me/change-password` | Authenticated | Changes current user's password. | ChangePasswordDto | 200 OK | VALIDATION_ERROR, AUTHENTICATION_INVALID_CREDENTIALS |
| POST | `/request-password-reset` | Public | Initiates password reset for an email. | RequestPasswordResetDto | 200 OK (Generic msg) | (Handles USER_NOT_FOUND silently) |
| POST | `/reset-password` | Public | Resets password using a valid token. | ResetPasswordDto | 200 OK | VALIDATION_ERROR, PASSWORD_RESET_TOKEN_INVALID |
| POST | `/me/api-keys` | Authenticated | Adds/updates an API key for the user. | UserApiKeyDto | 201 Created | VALIDATION_ERROR, CONFIGURATION_ERROR |
| GET | `/me/api-keys` | Authenticated | Lists user's API keys. | - | 200 OK | - |
| DELETE | `/me/api-keys/:apiKeyRecordId` | Authenticated | Deletes a specific user API key. | Param: apiKeyRecordId | 200 OK / 204 No Content | VALIDATION_ERROR, RESOURCE_NOT_FOUND |
| GET | `/me/subscription` | Authenticated | Gets user's current subscription tier and usage. | - | 200 OK | - |
| GET | `/tiers` | Public | Lists all available subscription tiers. | - | 200 OK | - |
| POST | `/admin/assign-tier` | Admin | Assigns a subscription tier to a user. | AssignTierDto (userId, newTierId) | 200 OK | VALIDATION_ERROR, PERMISSION_DENIED, USER_NOT_FOUND, RESOURCE_NOT_FOUND |
| GET | `/admin/users` | Admin | Lists all users (placeholder). | Query: page, limit, search | 501 Not Implemented | PERMISSION_DENIED |

---

## AgentOS Core (`/api/v1/agentos`)

Main interaction points with the AgentOS facade for chat turns and tool results. These routes primarily stream responses.

| Method | Path | Access | Description | Key Request Body/Params | Success Response (Status) | Common Error Codes |
|--------|------|--------|-------------|-------------------------|---------------------------|-------------------|
| POST | `/chat/turn` | Authenticated | Processes a user turn; streams AgentOSResponse chunks. | AgentOSInput | 200 OK (Streaming application/x-ndjson) | VALIDATION_ERROR, GMI_PROCESSING_ERROR, STREAM_ERROR |
| POST | `/chat/tool_result` | Authenticated | Submits tool execution result; streams AgentOSResponse chunks. | ToolResultDto & { streamId: string } | 200 OK (Streaming application/x-ndjson) | VALIDATION_ERROR, TOOL_ERROR, STREAM_ERROR |

---

## GMI Interactions (`/api/v1/gmi`)

Routes for direct interaction and management of Generalized Mind Instances (GMIs).

| Method | Path | Access | Description | Key Request Body/Params | Success Response (Status) | Common Error Codes |
|--------|------|--------|-------------|-------------------------|---------------------------|-------------------|
| POST | `/interact/:personaId` | Public / Optionally Authenticated | Interact with a GMI; streams or returns full response. | GMIInteractionRequest | 200 OK (Streaming or JSON) | VALIDATION_ERROR, GMI_PROCESSING_ERROR, PERSONA_NOT_FOUND, STREAM_ERROR |
| POST | `/interact/:personaId/:sessionId/tool-result` | Authenticated | Submit tool results to a GMI session. | GMIToolResultRequest | 200 OK (JSON GMIOutput) | VALIDATION_ERROR, TOOL_ERROR, RESOURCE_NOT_FOUND |
| GET | `/status/:personaId/:sessionId` | Authenticated | Get status of a GMI instance. | Params: personaId, sessionId | 200 OK (JSON GMIStatus) | RESOURCE_NOT_FOUND |
| DELETE | `/:personaId/:sessionId` | Authenticated | Deactivate a GMI instance and clear context. | Params: personaId, sessionId | 200 OK | RESOURCE_NOT_FOUND |
| GET | `/conversations/:sessionId` | Authenticated | Get conversation history for a session. | Param: sessionId | 200 OK (JSON ConversationContext) | RESOURCE_NOT_FOUND, PERMISSION_DENIED |
| POST | `/feedback/:personaId/:sessionId` | Authenticated | Submit feedback for a GMI interaction. | Param: personaId, sessionId. Body: feedbackData | 200 OK / 501 Not Implemented | VALIDATION_ERROR, RESOURCE_NOT_FOUND, NOT_IMPLEMENTED, GMI_FEEDBACK_ERROR |

---

## Personas (`/api/v1/personas`)

Routes for listing and retrieving details about available AI personas.

| Method | Path | Access | Description | Key Request Body/Params | Success Response (Status) | Common Error Codes |
|--------|------|--------|-------------|-------------------------|---------------------------|-------------------|
| GET | `/` | Public / Optionally Authenticated | Retrieves list of available personas. | - | 200 OK (Partial<IPersonaDefinition>[]) | INTERNAL_SERVER_ERROR |
| GET | `/:personaId` | Public / Optionally Authenticated | Retrieves details of a specific persona. | Param: personaId | 200 OK (Partial<IPersonaDefinition>) | VALIDATION_ERROR, PERSONA_NOT_FOUND |

---

## Utility LLM Functions (`/api/v1/utility`)

Provides general-purpose LLM-powered utilities. All routes here are protected by authentication by default.

| Method | Path | Access | Description | Key Request Body/Params | Success Response (Status) | Common Error Codes |
|--------|------|--------|-------------|-------------------------|---------------------------|-------------------|
| POST | `/direct-prompt` | Authenticated | Sends a raw prompt to an LLM. | DirectPromptRequestDto | 200 OK (DirectPromptResponseDto) | VALIDATION_ERROR, LLM_PROVIDER_ERROR |
| POST | `/summarize` | Authenticated | Generates a summary for the provided text. | SummarizationRequestDto | 200 OK (SummarizationResponseDto) | VALIDATION_ERROR, LLM_PROVIDER_ERROR |
| POST | `/translate` | Authenticated | Translates text to a target language. | TranslationRequestDto | 200 OK (TranslationResponseDto) | VALIDATION_ERROR, LLM_PROVIDER_ERROR |
| POST | `/seo/keywords` | Authenticated | Generates SEO keywords from content. | SeoKeywordRequestDto | 200 OK (SeoKeywordResponseDto) | VALIDATION_ERROR, LLM_PROVIDER_ERROR |
| POST | `/classify` | Authenticated | Classifies content into predefined categories. | ContentClassificationRequestDto | 200 OK (ContentClassificationResponseDto) | VALIDATION_ERROR, LLM_PROVIDER_ERROR |
| POST | `/sentiment` | Authenticated | Analyzes sentiment of the provided text. | SentimentAnalysisRequestDto | 200 OK (SentimentAnalysisResponseDto) | VALIDATION_ERROR, LLM_PROVIDER_ERROR |

---

## Request/Response Examples

### Authentication Examples

#### User Registration
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### User Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Utility LLM Examples

#### Direct Prompt
```bash
POST /api/v1/utility/direct-prompt
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "prompt": "Explain quantum computing in simple terms",
  "context": "For a high school audience",
  "modelId": "gpt-4",
  "completionOptions": {
    "temperature": 0.7,
    "maxTokens": 500
  }
}
```

#### Text Summarization
```bash
POST /api/v1/utility/summarize
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "textToSummarize": "Long article text here...",
  "desiredLength": "medium",
  "format": "paragraph",
  "context": "News article about technology"
}
```

#### Translation
```bash
POST /api/v1/utility/translate
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "textToTranslate": "Hello, how are you today?",
  "targetLanguage": "es",
  "sourceLanguage": "en"
}
```

#### SEO Keywords Generation
```bash
POST /api/v1/utility/seo/keywords
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "content": "Article about sustainable energy solutions and renewable resources...",
  "maxKeywords": 10,
  "language": "en"
}
```

#### Content Classification
```bash
POST /api/v1/utility/classify
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "content": "This product review discusses the excellent battery life and camera quality...",
  "categories": ["Technology", "Reviews", "Electronics", "Mobile"],
  "allowMultiple": true
}
```

#### Sentiment Analysis
```bash
POST /api/v1/utility/sentiment
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "text": "I absolutely love this new feature! It makes everything so much easier.",
  "granularity": "document"
}
```

---

## Error Handling

All endpoints follow a consistent error response format. Here are some common error scenarios:

### Validation Error (400)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "A non-empty prompt string is required.",
    "details": {
      "field": "prompt"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Authentication Error (401)
```json
{
  "error": {
    "code": "AUTHENTICATION_TOKEN_MISSING",
    "message": "Authentication token is required for this endpoint.",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Resource Not Found (404)
```json
{
  "error": {
    "code": "PERSONA_NOT_FOUND",
    "message": "The specified persona could not be found.",
    "details": {
      "personaId": "invalid-persona-id"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Server Error (500)
```json
{
  "error": {
    "code": "LLM_PROVIDER_ERROR",
    "message": "An error occurred while processing your request with the LLM provider.",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Rate Limiting

API requests are subject to rate limiting based on the user's subscription tier:

- **Free Tier**: 100 requests per hour
- **Pro Tier**: 1,000 requests per hour  
- **Enterprise Tier**: 10,000 requests per hour

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Timestamp when the rate limit resets

---

## Streaming Responses

Some endpoints (particularly in AgentOS Core and GMI Interactions) support streaming responses using Server-Sent Events (SSE) or newline-delimited JSON (NDJSON).

### Example Streaming Response
```
Content-Type: application/x-ndjson

{"type":"chunk","data":{"text":"Hello"}}
{"type":"chunk","data":{"text":" world"}}
{"type":"done","data":{"totalTokens":15}}
```