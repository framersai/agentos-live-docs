import { getLlmBootstrapStatus } from '../../core/llm/llm.status.js';
export function getLlmStatus(req, res) {
    try {
        const status = getLlmBootstrapStatus();
        const httpStatus = status.ready ? 200 : 503;
        if (httpStatus !== 200) {
            console.warn('[System] LLM status check not ready.', {
                code: status.code,
                message: status.message,
                providers: status.providers,
            });
        }
        else if (process.env.NODE_ENV !== 'production') {
            console.debug('[System] LLM status ready.', { timestamp: status.timestamp });
        }
        res.status(httpStatus).json({
            status: status.ready ? 'ready' : 'unavailable',
            ...status,
        });
    }
    catch (error) {
        console.error('[System] Failed to read LLM bootstrap status:', error);
        res.status(500).json({
            status: 'error',
            code: 'STATUS_READ_FAILED',
            message: 'Unable to read LLM bootstrap status.',
            error: error?.message ?? 'UNKNOWN_ERROR',
        });
    }
}
//# sourceMappingURL=system.routes.js.map