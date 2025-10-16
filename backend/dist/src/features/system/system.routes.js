import { getLlmBootstrapStatus } from '../../core/llm/llm.status.js';
export function getLlmStatus(req, res) {
    const status = getLlmBootstrapStatus();
    const httpStatus = status.ready ? 200 : 503;
    res.status(httpStatus).json({
        status: status.ready ? 'ready' : 'unavailable',
        ...status,
    });
}
//# sourceMappingURL=system.routes.js.map