import { LlmProviderId } from './llm.config.service.js';
let currentStatus = {
    ready: false,
    code: 'BOOTSTRAP_PENDING',
    message: 'LLM services have not completed initialization.',
    timestamp: new Date().toISOString(),
    providers: {},
};
export const setLlmBootstrapStatus = (status) => {
    currentStatus = {
        ...status,
        timestamp: status.timestamp ?? new Date().toISOString(),
        providers: { ...status.providers },
    };
};
export const updateLlmBootstrapStatus = (partial) => {
    currentStatus = {
        ...currentStatus,
        ...partial,
        timestamp: new Date().toISOString(),
        providers: partial.providers ? { ...partial.providers } : currentStatus.providers,
    };
};
export const getLlmBootstrapStatus = () => ({
    ...currentStatus,
    providers: { ...currentStatus.providers },
});
export const mapAvailabilityToStatus = (availability) => {
    const summary = {};
    for (const provider of Object.values(LlmProviderId)) {
        const providerStatus = availability[provider];
        summary[provider] = providerStatus
            ? { ...providerStatus }
            : { available: false, reason: 'Provider not configured.' };
    }
    return summary;
};
//# sourceMappingURL=llm.status.js.map