# Conversation & Language Improvements Implementation Plan

## Overview
This document outlines the implementation plan to fix conversation flow, language detection, and memory management issues in the Voice Chat Assistant.

## Problems to Solve

### 1. Repetitive Responses
- System treats all messages equally, leading to repeated answers
- No clear distinction between current query and historical context
- Context bundle doesn't properly emphasize the current user request

### 2. Language Handling
- Responses are not in the same language as user input
- No automatic language detection
- STT language setting is disconnected from response language

### 3. Memory Management
- Simple mode: Only keeps last 20 messages
- Advanced mode: Complex but not properly tuned for conversation flow
- No proper weighting of message importance

## Implementation Steps

### Phase 1: Fix Conversation Context (Priority: HIGH)

#### 1.1 Update Backend Prompt Building
**File**: `backend/src/features/chat/chat.routes.ts`

```typescript
// Add to system prompt construction (line ~360)
const conversationContextInstructions = `
## CONVERSATION CONTEXT RULES:
1. The LAST user message is the PRIMARY query you must respond to
2. Previous messages provide context but should NOT be re-answered
3. Avoid repeating information already provided in this conversation
4. Focus on answering ONLY what the user is asking NOW
5. If referencing previous answers, acknowledge them briefly (e.g., "As mentioned earlier...")
`;

// Update bundleUsageInstructions to include this
```

#### 1.2 Improve Message History Preparation
**File**: `frontend/src/store/chat.store.ts`

```typescript
// Modify getHistoryForApi to mark recent messages
async function getHistoryForApi(...) {
  // Add metadata to distinguish current vs historical
  const processedHistory = selectedHistoryForManager.map((m, idx) => ({
    ...m,
    isCurrentTurn: idx === selectedHistoryForManager.length - 1,
    recency: idx / selectedHistoryForManager.length // 0 = oldest, 1 = newest
  }));
}
```

### Phase 2: Implement Language Detection & Response (Priority: HIGH)

#### 2.1 Add Language Detection
**File**: `backend/src/features/chat/chat.routes.ts`

```typescript
// Add language detection function
function detectLanguage(text: string): string {
  // Simple detection based on character sets
  const languagePatterns = {
    'zh': /[\u4e00-\u9fff]/,     // Chinese
    'ja': /[\u3040-\u309f\u30a0-\u30ff]/,  // Japanese
    'ko': /[\uac00-\ud7af]/,     // Korean
    'ar': /[\u0600-\u06ff]/,     // Arabic
    'ru': /[\u0400-\u04ff]/,     // Cyrillic
    'es': /[áéíóúñ¿¡]/i,         // Spanish indicators
    'fr': /[àâæçéèêëïîôùûüÿœ]/i, // French indicators
    'de': /[äöüßÄÖÜ]/,           // German indicators
    'pt': /[ãõçáéíóúâêô]/i,      // Portuguese indicators
    'it': /[àèéìíòóùú]/i,        // Italian indicators
  };

  for (const [lang, pattern] of Object.entries(languagePatterns)) {
    if (pattern.test(text)) return lang;
  }

  // Default to English
  return 'en';
}

// Add to prompt construction
const userInputLanguage = detectLanguage(currentUserQuery);
const languageInstruction = `
## LANGUAGE INSTRUCTION:
The user's message appears to be in "${userInputLanguage}" language.
YOU MUST respond in the SAME language as the user's input.
If the detected language is incorrect, infer from the content and respond appropriately.
`;
```

#### 2.2 Update System Prompts
**File**: `backend/src/features/chat/chat.routes.ts`

```typescript
// Modify systemPromptForAgentLLM construction (around line 355)
systemPromptForAgentLLM = templateContent
  .replace(/{{LANGUAGE}}/g, userInputLanguage) // Use detected language
  .replace(/{{LANGUAGE_INSTRUCTION}}/g, languageInstruction)
  .replace(/{{CONVERSATION_CONTEXT}}/g, conversationContextInstructions)
  // ... rest of replacements
```

### Phase 3: Optimize Memory Management (Priority: MEDIUM)

#### 3.1 Tune Advanced Conversation Manager
**File**: `frontend/src/services/advancedConversation.manager.ts`

```typescript
// Update DEFAULT_ADVANCED_HISTORY_CONFIG
export const DEFAULT_ADVANCED_HISTORY_CONFIG = {
  strategyPreset: HistoryStrategyPreset.BALANCED_HYBRID,
  maxContextTokens: 3000, // Reduced from 4000 for faster processing
  relevancyThreshold: 0.35, // Increased from 0.25 for better filtering
  numRecentMessagesToPrioritize: 6, // Reduced from 10 - last 3 exchanges
  numRelevantOlderMessagesToInclude: 3, // Reduced from 5
  simpleRecencyMessageCount: 12, // Reduced from 20
  filterHistoricalSystemMessages: true,
  charsPerTokenEstimate: 3.8,
};
```

#### 3.2 Add Conversation Importance Scoring
**File**: `frontend/src/services/advancedConversation.manager.ts`

```typescript
// Add importance scoring based on message position
private scoreMessageImportance(message: ProcessedConversationMessage, position: number, totalMessages: number): number {
  const recencyScore = position / totalMessages; // 0-1, higher is more recent
  const roleWeight = message.role === 'user' ? 1.2 : 1.0; // Prioritize user messages
  const lengthWeight = Math.min(message.content.length / 500, 1); // Longer = more important up to a point

  return (recencyScore * 0.6 + lengthWeight * 0.2) * roleWeight;
}
```

### Phase 4: STT Language Configuration (Priority: LOW)

#### 4.1 Add Auto Language Detection Option
**File**: `frontend/src/services/voice.settings.service.ts`

```typescript
export interface VoiceApplicationSettings {
  // Add new settings
  sttAutoDetectLanguage?: boolean;  // Enable auto language detection
  responseLanguageMode?: 'auto' | 'fixed' | 'follow-stt'; // How to determine response language
  fixedResponseLanguage?: string; // If mode is 'fixed'
  // ... existing settings
}
```

#### 4.2 Update STT Handler for Auto Detection
**File**: `frontend/src/components/voice-input/handlers/BrowserSpeechHandler.vue`

```typescript
// Modify recognizer configuration
if (props.settings.sttAutoDetectLanguage) {
  recognizer.value.lang = ''; // Let browser auto-detect
} else {
  recognizer.value.lang = props.settings.speechLanguage || navigator.language || 'en-US';
}
```

### Phase 5: Testing & Validation

#### 5.1 Test Scenarios
1. **Multi-language conversations**: Test switching languages mid-conversation
2. **Context retention**: Verify system doesn't repeat previous answers
3. **Memory efficiency**: Test with long conversation histories
4. **STT accuracy**: Test recognition in different languages

#### 5.2 Performance Metrics
- Response relevance score (no repetition)
- Language detection accuracy
- Memory usage with large histories
- Response time with optimized context

## Configuration Changes

### Frontend Settings Update
```javascript
// voiceSettingsManager default settings
{
  // Conversation
  useAdvancedMemory: true,
  conversationContextMode: 'smart', // new: 'full' | 'smart' | 'minimal'

  // Language
  sttAutoDetectLanguage: false,
  responseLanguageMode: 'auto', // new
  fixedResponseLanguage: 'en-US',

  // Memory limits
  maxHistoryMessages: 12, // reduced from 20
  maxContextTokens: 3000, // reduced from 4000
}
```

### Backend Environment Variables
```env
# Add to .env
DEFAULT_RESPONSE_LANGUAGE_MODE=auto
ENABLE_LANGUAGE_DETECTION=true
MAX_CONTEXT_MESSAGES=12
CONVERSATION_CONTEXT_STRATEGY=smart
```

## Migration Notes

1. **Backward Compatibility**: All changes maintain backward compatibility
2. **Settings Migration**: Add migration logic for existing user settings
3. **Database**: No schema changes required (SQLite adapter unchanged)
4. **API**: No breaking changes to API contracts

## Timeline

- **Week 1**: Implement Phase 1 & 2 (Critical fixes)
- **Week 2**: Implement Phase 3 (Memory optimization)
- **Week 3**: Implement Phase 4 (STT improvements)
- **Week 4**: Testing & refinement

## Success Metrics

1. **No repeated answers** in 95% of conversations
2. **Correct language response** in 90% of cases
3. **Reduced context size** by 40% without quality loss
4. **Improved response time** by 20%

## Notes

- AgentOS is currently unused and can be integrated later
- Focus on client-side optimizations first
- Consider adding a feedback mechanism to tune language detection
- May need to add language-specific prompt templates in the future