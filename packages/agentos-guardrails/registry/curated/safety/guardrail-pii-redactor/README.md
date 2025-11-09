# PII Redactor Guardrail

Redacts personally identifiable information (SSN, email, phone, credit card) from agent inputs and outputs. Supports real-time streaming redaction for immediate protection.

## Installation

```bash
pnpm add @framersai/guardrail-pii-redactor
```

## Usage

### Basic (Final-Only Evaluation)

```typescript
import { PIIRedactorGuardrail } from '@framersai/guardrail-pii-redactor';

const guardrail = new PIIRedactorGuardrail({
  replacementText: '[PII]',
  patterns: {
    ssn: true,
    email: true,
    phone: true,
    creditCard: true,
  },
});

// Wire into AgentOS
const config: AgentOSConfig = {
  guardrailService: guardrail,
};
```

### Streaming (Real-Time Redaction)

```typescript
const guardrail = new PIIRedactorGuardrail({
  enableStreamingRedaction: true, // Real-time redaction during streaming
  maxStreamingEvaluations: 50, // Limit to 50 chunks per request
  replacementText: '[REDACTED]',
});

const config: AgentOSConfig = {
  guardrailService: guardrail,
};
```

## Configuration

### `PIIRedactorConfig`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `enableStreamingRedaction` | `boolean` | No | `false` | Enable real-time redaction during streaming (evaluates TEXT_DELTA chunks). Adds ~1-5ms latency per chunk. |
| `maxStreamingEvaluations` | `number` | No | `undefined` | Maximum number of streaming chunks to evaluate per request. Only applies when `enableStreamingRedaction` is true. |
| `evaluateInput` | `boolean` | No | `true` | Whether to evaluate user input for PII. |
| `evaluateOutput` | `boolean` | No | `true` | Whether to evaluate agent output for PII. |
| `replacementText` | `string` | No | `'[REDACTED]'` | Custom replacement text for redacted PII. |
| `patterns` | `object` | No | See below | Enable/disable specific PII types. |

### Pattern Configuration

```typescript
patterns: {
  ssn?: boolean;        // Social Security Numbers (default: true)
  email?: boolean;     // Email addresses (default: true)
  phone?: boolean;     // Phone numbers (default: true)
  creditCard?: boolean; // Credit card numbers (default: true)
  ipAddress?: boolean;  // IP addresses (default: false)
  macAddress?: boolean; // MAC addresses (default: false)
}
```

## Examples

### Example 1: Basic PII Redaction

```typescript
const guardrail = new PIIRedactorGuardrail();

// Input: "My SSN is 123-45-6789"
// Output: "My SSN is [REDACTED]"

// Input: "Contact me at john@example.com"
// Output: "Contact me at [REDACTED]"
```

### Example 2: Custom Replacement Text

```typescript
const guardrail = new PIIRedactorGuardrail({
  replacementText: '[PII]',
});

// Input: "Call 555-123-4567"
// Output: "Call [PII]"
```

### Example 3: Streaming Redaction (Real-Time)

```typescript
const guardrail = new PIIRedactorGuardrail({
  enableStreamingRedaction: true,
  maxStreamingEvaluations: 100,
});

// PII is redacted as it streams, not just at the end
// Each TEXT_DELTA chunk is evaluated and sanitized immediately
```

### Example 4: Selective Pattern Matching

```typescript
const guardrail = new PIIRedactorGuardrail({
  patterns: {
    ssn: true,
    email: true,
    phone: false,      // Don't redact phone numbers
    creditCard: true,
    ipAddress: true,   // Also redact IP addresses
  },
});
```

## How It Works

### Final-Only Evaluation (Default)

1. Agent generates complete response
2. Guardrail evaluates FINAL_RESPONSE chunk
3. PII patterns detected → text sanitized
4. Sanitized response sent to user

**Performance**: ~1-5ms latency per response  
**Cost**: Minimal (regex-based, no LLM calls)

### Streaming Evaluation (Optional)

1. Agent streams TEXT_DELTA chunks
2. Guardrail evaluates each chunk in real-time
3. PII detected → chunk sanitized immediately
4. Sanitized chunks stream to user

**Performance**: ~1-5ms latency per TEXT_DELTA chunk  
**Cost**: Minimal (regex-based, no LLM calls)  
**Use Case**: Real-time protection, immediate redaction

### Detected PII Types

- **SSN**: `123-45-6789` or `123456789`
- **Email**: `user@example.com`
- **Phone**: `(555) 123-4567` or `555-123-4567`
- **Credit Card**: `1234-5678-9012-3456`
- **IP Address**: `192.168.1.1` (optional)
- **MAC Address**: `00:1B:44:11:3A:B7` (optional)

## Performance & Cost

### Final-Only Evaluation
- **Latency**: ~1-5ms per response
- **Cost**: Negligible (regex matching)
- **Use Case**: Cost-sensitive deployments, batch processing

### Streaming Evaluation
- **Latency**: ~1-5ms per TEXT_DELTA chunk
- **Cost**: Negligible (regex matching)
- **Use Case**: Real-time protection, immediate user feedback
- **Trade-off**: Higher latency but better user experience

**Recommendation**: Use streaming evaluation only when real-time redaction is required. For most use cases, final-only evaluation provides sufficient protection with better performance.

## License

MIT

