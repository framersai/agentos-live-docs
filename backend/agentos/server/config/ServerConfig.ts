import { AgentOSConfig } from '../../api/AgentOS';

export interface AgentOSServerConfig {
  // Server settings
  port: number;
  host: string;
  environment: 'development' | 'staging' | 'production';
  
  // Security
  corsOrigins: string[];
  jwtSecret: string;
  apiKeyHeader: string;
  
  // Rate limiting
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
  };
  
  // WebSocket settings
  webSocket: {
    maxConnections: number;
    heartbeatInterval: number;
    connectionTimeout: number;
    maxMessageSize: number;
  };
  
  // Streaming settings
  streaming: {
    maxConcurrentStreams: number;
    streamTimeout: number;
    bufferSize: number;
  };
  
  // Monitoring
  metrics: {
    enabled: boolean;
    endpoint: string;
    collectDefaultMetrics: boolean;
  };
  
  // Logging
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
    format: 'json' | 'simple';
    enableRequestLogging: boolean;
  };
  
  // Integration
  webhooks: {
    enabled: boolean;
    endpoints: Array<{
      url: string;
      events: string[];
      secret: string;
    }>;
  };
}

export function createServerConfig(): AgentOSServerConfig {
  return {
    port: parseInt(process.env.AGENTOS_SERVER_PORT || '3000'),
    host: process.env.AGENTOS_SERVER_HOST || '0.0.0.0',
    environment: (process.env.NODE_ENV as any) || 'development',
    
    corsOrigins: process.env.AGENTOS_CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    jwtSecret: process.env.AGENTOS_JWT_SECRET || 'agentos-secret-key',
    apiKeyHeader: process.env.AGENTOS_API_KEY_HEADER || 'x-agentos-api-key',
    
    rateLimit: {
      windowMs: parseInt(process.env.AGENTOS_RATE_LIMIT_WINDOW_MS || '60000'),
      maxRequests: parseInt(process.env.AGENTOS_RATE_LIMIT_MAX_REQUESTS || '100'),
      skipSuccessfulRequests: process.env.AGENTOS_RATE_LIMIT_SKIP_SUCCESS === 'true',
    },
    
    webSocket: {
      maxConnections: parseInt(process.env.AGENTOS_WS_MAX_CONNECTIONS || '1000'),
      heartbeatInterval: parseInt(process.env.AGENTOS_WS_HEARTBEAT_INTERVAL || '25000'),
      connectionTimeout: parseInt(process.env.AGENTOS_WS_CONNECTION_TIMEOUT || '60000'),
      maxMessageSize: parseInt(process.env.AGENTOS_WS_MAX_MESSAGE_SIZE || '1048576'),
    },
    
    streaming: {
      maxConcurrentStreams: parseInt(process.env.AGENTOS_MAX_CONCURRENT_STREAMS || '100'),
      streamTimeout: parseInt(process.env.AGENTOS_STREAM_TIMEOUT || '300000'),
      bufferSize: parseInt(process.env.AGENTOS_STREAM_BUFFER_SIZE || '1024'),
    },
    
    metrics: {
      enabled: process.env.AGENTOS_METRICS_ENABLED === 'true',
      endpoint: process.env.AGENTOS_METRICS_ENDPOINT || '/metrics',
      collectDefaultMetrics: process.env.AGENTOS_COLLECT_DEFAULT_METRICS !== 'false',
    },
    
    logging: {
      level: (process.env.AGENTOS_LOG_LEVEL as any) || 'info',
      format: (process.env.AGENTOS_LOG_FORMAT as any) || 'json',
      enableRequestLogging: process.env.AGENTOS_ENABLE_REQUEST_LOGGING !== 'false',
    },
    
    webhooks: {
      enabled: process.env.AGENTOS_WEBHOOKS_ENABLED === 'true',
      endpoints: JSON.parse(process.env.AGENTOS_WEBHOOK_ENDPOINTS || '[]'),
    },
  };
}