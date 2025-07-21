// api/types/AgentOSInput.ts
export interface AgentOSInput {
    userId: string;
    sessionId: string;
    textInput?: string;
    visionInputs?: any[];
    audioInput?: any;
    selectedPersonaId?: string;
    userApiKeys?: Record<string, string>;
    conversationId?: string;
    options?: {
      streaming?: boolean;
      maxTokens?: number;
      temperature?: number;
      [key: string]: any;
    };
  }
  
  export interface UserFeedbackPayload {
    rating: number;
    comment?: string;
    responseId: string;
    sessionId: string;
  }

  // Mock Prisma Client for development
  export class MockPrismaClient {
    async $connect(): Promise<void> {
      console.log('Mock Prisma: Connected to database');
    }
  
    async $disconnect(): Promise<void> {
      console.log('Mock Prisma: Disconnected from database');
    }
  }