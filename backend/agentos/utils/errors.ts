 // utils/errors.ts
 export enum GMIErrorCode {
    CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
    INITIALIZATION_ERROR = 'INITIALIZATION_ERROR',
    PROCESSING_ERROR = 'PROCESSING_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    PERMISSION_ERROR = 'PERMISSION_ERROR',
    TOOL_ERROR = 'TOOL_ERROR',
    LLM_ERROR = 'LLM_ERROR'
  }
  
  export class GMIError extends Error {
    public readonly code: GMIErrorCode;
    public readonly component?: string;
    public readonly httpStatusCode?: number;
    public readonly details?: any;
  
    constructor(
      message: string,
      code: GMIErrorCode,
      details?: any,
      component?: string,
      httpStatusCode?: number
    ) {
      super(message);
      this.name = 'GMIError';
      this.code = code;
      this.component = component;
      this.httpStatusCode = httpStatusCode;
      this.details = details;
    }
  }
  