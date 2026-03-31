# Type Alias: CallState

> **CallState** = `"initiated"` \| `"ringing"` \| `"answered"` \| `"active"` \| `"speaking"` \| `"listening"` \| `"completed"` \| `"hangup-user"` \| `"hangup-bot"` \| `"timeout"` \| `"error"` \| `"failed"` \| `"no-answer"` \| `"busy"` \| `"voicemail"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:79](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/types.ts#L79)

States a voice call can be in.

Transitions follow a monotonic order
(`initiated` -> `ringing` -> `answered` -> `active` -> `speaking`/`listening`),
except `speaking` <-> `listening` which can cycle during conversation turns.
Terminal states can be reached from **any** non-terminal state.

## Non-terminal states (forward-only progression)
- `initiated` -- Call record created, provider request sent.
- `ringing`   -- Provider confirmed the destination phone is ringing.
- `answered`  -- Callee picked up; media channel not yet established.
- `active`    -- Bidirectional media stream is established.

## Conversation cycling states (can alternate freely)
- `speaking`  -- Agent TTS is playing audio to the caller.
- `listening` -- Agent STT is listening for caller speech.

## Terminal states (once reached, no further transitions)
- `completed`   -- Normal call completion (both parties done).
- `hangup-user` -- The remote caller hung up.
- `hangup-bot`  -- The agent initiated the hangup.
- `timeout`     -- Call exceeded `maxDurationSeconds`.
- `error`       -- Unrecoverable error during the call.
- `failed`      -- Provider could not place the call at all.
- `no-answer`   -- Callee did not pick up within the ring timeout.
- `busy`        -- Callee line is busy.
- `voicemail`   -- Answering machine / voicemail detected.
