# StreamingManager Module

**Module Path**: `backend/agentos/core/streaming/StreamingManager.ts`

## 1. Overview 📜

The `StreamingManager` is a crucial component within AgentOS responsible for the lifecycle management of real-time data streams. It facilitates the distribution of `AgentOSResponse` chunks from the agent's processing pipeline to one or more subscribed clients. This module is designed to be robust, abstracting away the complexities of direct stream manipulation and providing a centralized point for stream control.

Key responsibilities include:

* **Stream Lifecycle Management**: Creating, tracking, and closing data streams.
* **Client Subscription**: Registering and deregistering clients (e.g., WebSocket connections) to specific streams.
* **Data Distribution**: Efficiently pushing data chunks (`AgentOSResponse`) to all clients subscribed to a particular stream.
* **Error Handling**: Managing errors that occur during streaming operations, including client send failures and stream-level errors.
* **Configuration**: Allowing customization of stream behavior, such as limits on concurrent streams or clients per stream.

## 2. Core Components 🧩

### 2.1. `IStreamClient` Interface

**File**: `backend/agentos/core/streaming/IStreamClient.ts`

This interface defines the contract for any client that will receive streamed data. Implementations of `IStreamClient` are responsible for the actual data transport to the end-user (e.g., via a WebSocket connection facade).

* `id: StreamClientId` (readonly): Unique identifier for the client.
* `sendChunk(chunk: AgentOSResponse): Promise<void>`: Sends a data chunk to the client.
* `notifyStreamClosed(reason?: string): Promise<void>`: Informs the client that its stream has been closed.
* `isActive(): boolean`: Checks if the client connection is active.
* `close?(reason?: string): Promise<void>`: Optional method to gracefully close the client connection.

### 2.2. `StreamingManagerConfig` Interface

This interface defines the configuration options for the `StreamingManager`:

* `maxConcurrentStreams?: number`: Max number of active streams (Default: `Infinity`, effectively 1000 in code).
* `defaultStreamInactivityTimeoutMs?: number`: Timeout for inactive streams (Default: 5 minutes). (Conceptual, active tracking to be implemented if needed).
* `maxClientsPerStream?: number`: Max clients per stream (Default: `Infinity`, effectively 10 in code).
* `onClientSendErrorBehavior?: 'log_and_continue' | 'deregister_client' | 'throw'`: Behavior on client send error (Default: `'log_and_continue'`).

### 2.3. `StreamError` Class

A custom error class extending `GMIError` for StreamingManager-specific errors. It includes `streamId` and `clientId` for better context.

### 2.4. `IStreamingManager` Interface

Defines the public API of the `StreamingManager`.

### 2.5. `StreamingManager` Class

The concrete implementation of `IStreamingManager`.

## 3. API Reference (IStreamingManager) 🛠️

### `initialize(config: StreamingManagerConfig): Promise<void>`

Initializes the manager. Must be called before any other methods.

* **Parameters**:
    * `config: StreamingManagerConfig` - Configuration object.
* **Throws**: `GMIError` if config is invalid.

---

### `createStream(requestedStreamId?: StreamId): Promise<StreamId>`

Creates a new data stream.

* **Parameters**:
    * `requestedStreamId?: StreamId` (optional) - A specific ID to use for the stream. A UUID is generated if not provided or if the ID clashes and was auto-generated.
* **Returns**: `Promise<StreamId>` - The unique ID of the created stream.
* **Throws**: `StreamError` (e.g., if `maxConcurrentStreams` reached, or `requestedStreamId` is a duplicate).

---

### `registerClient(streamId: StreamId, client: IStreamClient): Promise<void>`

Registers a client to receive data for a specific stream.

* **Parameters**:
    * `streamId: StreamId` - The ID of the stream.
    * `client: IStreamClient` - The client instance.
* **Throws**: `StreamError` (e.g., if stream not found, client already registered, `maxClientsPerStream` reached).

---

### `deregisterClient(streamId: StreamId, clientId: StreamClientId): Promise<void>`

Deregisters a client from a stream.

* **Parameters**:
    * `streamId: StreamId` - The ID of the stream.
    * `clientId: StreamClientId` - The ID of the client.
* **Throws**: `StreamError` (e.g., if stream or client not found).

---

### `pushChunk(streamId: StreamId, chunk: AgentOSResponse): Promise<void>`

Pushes a data chunk to all clients of a stream.

* **Parameters**:
    * `streamId: StreamId` - The ID of the stream.
    * `chunk: AgentOSResponse` - The data chunk.
* **Throws**: `StreamError` (e.g., if stream not found, or if `onClientSendErrorBehavior` is 'throw' and a client send fails).

---

### `closeStream(streamId: StreamId, reason?: string): Promise<void>`

Closes a stream and notifies/deregisters all its clients.

* **Parameters**:
    * `streamId: StreamId` - The ID of the stream.
    * `reason?: string` (optional) - Reason for closure.
* **Throws**: `StreamError` (e.g., if stream not found).

---

### `handleStreamError(streamId: StreamId, error: Error, terminateStream?: boolean): Promise<void>`

Handles an error occurring on a stream, notifies clients, and optionally closes the stream.

* **Parameters**:
    * `streamId: StreamId` - The ID of the stream.
    * `error: Error` - The error object.
    * `terminateStream?: boolean` (optional) - Whether to close the stream (Default: `true`).
* **Throws**: `StreamError` (e.g., if stream not found).

---

### `getActiveStreamIds(): Promise<StreamId[]>`

Returns a list of all currently active stream IDs.

* **Returns**: `Promise<StreamId[]>`

---

### `getClientCountForStream(streamId: StreamId): Promise<number>`

Returns the number of clients for a specific stream.

* **Parameters**:
    * `streamId: StreamId` - The ID of the stream.
* **Returns**: `Promise<number>`
* **Throws**: `StreamError` (if stream not found).

---

### `shutdown(): Promise<void>`

Gracefully shuts down the manager, closing all active streams.

## 4. Workflow Example 🌊

1.  **Initialization**:
    * An instance of `StreamingManager` is created and initialized with a `StreamingManagerConfig` during application startup.
    * `await streamingManager.initialize({ maxConcurrentStreams: 500 });`

2.  **Stream Creation (e.g., when `AgentOSOrchestrator` starts processing a request)**:
    * `const streamId = await streamingManager.createStream();`
    * The `streamId` is then associated with the user's request/session.

3.  **Client Registration (e.g., when a WebSocket connection is established for a user session)**:
    * A transport-specific wrapper implementing `IStreamClient` is created (e.g., `myWebSocketClient`).
    * `await streamingManager.registerClient(streamId, myWebSocketClient);`

4.  **Pushing Data (e.g., `AgentOSOrchestrator` yields `AgentOSResponse` chunks)**:
    * As the GMI produces output chunks, they are pushed to the stream.
    * `await streamingManager.pushChunk(streamId, agentResponseChunk);`
    * The `StreamingManager` iterates through all `IStreamClient` instances registered to `streamId` and calls their `sendChunk` method.

5.  **Error Handling**:
    * If an error occurs during GMI processing related to this stream:
        `await streamingManager.handleStreamError(streamId, new Error("GMI processing failed"), true);`
    * If a client fails to receive a chunk, behavior is dictated by `onClientSendErrorBehavior`.

6.  **Stream Closure (e.g., GMI finishes, user disconnects, or error)**:
    * `await streamingManager.closeStream(streamId, "Interaction complete.");`
    * All registered clients are notified via `notifyStreamClosed` and potentially `client.close()`.

7.  **Client Deregistration (e.g., WebSocket connection closes)**:
    * The transport layer informs the system, leading to:
        `await streamingManager.deregisterClient(streamId, myWebSocketClient.id);`

8.  **Shutdown**:
    * During application shutdown: `await streamingManager.shutdown();`

## 5. Configuration Details ⚙️

* **`maxConcurrentStreams`**: Prevents the system from being overwhelmed by too many active streams. Important for resource management.
* **`defaultStreamInactivityTimeoutMs`**: (Conceptual) Intended for automatically cleaning up streams that are idle for too long. Requires an active monitoring mechanism.
* **`maxClientsPerStream`**: Limits how many clients can listen to a single stream, useful for scenarios like shared broadcasts or to prevent resource exhaustion on a single stream.
* **`onClientSendErrorBehavior`**:
    * `'log_and_continue'`: Most resilient for the stream itself; other clients continue to receive data.
    * `'deregister_client'`: Automatically removes clients that consistently fail to receive data, potentially due to disconnection.
    * `'throw'`: More disruptive; use if a single client failure for a chunk is critical.

## 6. Future Considerations & Extensibility ✨

* **Stream Metadata**: The internal `ManagedStream` interface includes a `metadata` field. This could be expanded to store more context about the stream (e.g., `userId`, `gmiInstanceId`, `personaId`, creation parameters) which can be useful for logging, analytics, or more advanced stream management logic.
* **Advanced Inactivity/Timeout Management**: Implement a robust timer-based mechanism to automatically close streams based on `defaultStreamInactivityTimeoutMs` and `lastActivityAt`.
* **Message Buffering/Retries**: For unreliable client connections, a buffering or retry mechanism could be added at the `IStreamClient` level or within the `StreamingManager` for certain chunk types.
* **Prioritized Streams**: Introduce concepts of stream priority for resource allocation under load.
* **Backpressure Handling**: If clients consume data slower than it's produced, mechanisms to handle backpressure could be implemented.
* **Different Stream Types**: Support for different types of streams (e.g., request-response over stream vs. long-lived subscriptions) could be added if needed.

This `StreamingManager` provides a flexible and robust foundation for handling real-time data flow in AgentOS.