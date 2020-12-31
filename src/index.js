module.exports = ({ config, db, router, cache, apiStatus, apiError, getRestApiClient }) => {
    console.warn('----> Plugin initialized');
    
    return {
        domainName: '{{domainName}}',
        pluginName: '{{pluginName}}',
        route: '{{restRoute}}',
        router
    };
};
