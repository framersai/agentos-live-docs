/**
 * Browser-compatible EventEmitter stub for Node.js 'node:events' module
 * Used to replace Node.js EventEmitter in browser environments
 */
import { EventEmitter as EventEmitter3 } from 'eventemitter3';

export class EventEmitter extends EventEmitter3 {
  // EventEmitter3 is already browser-compatible
  // This class extends it to match Node.js EventEmitter API
}

export default EventEmitter;

