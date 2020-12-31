const Validator = require('./validator/order-data-validator');

module.exports = ({ config, db, router, cache, apiStatus, apiError, getRestApiClient }) => {
    const createMage2RestClient = () => {
        const client = getRestApiClient();
        client.addMethods('returnOrders', (restClient) => {
            const module = {};
            module.createReturnOrder = (returnOrderData) => {
                const url = `/kmk-returns/create`;
                return restClient.post(url, returnOrderData);
            };

            module.getReturnOrder = (returnId) => {
                const url = `/kmk-returns/get/${returnId}`;
                return restClient.get(url);
            };

            module.getReturnOrderList = () => {
                const url = `/kmk-returns/getList`;
                return restClient.get(url);
            };

            return module;
        });

        return client;
    };

    /**
     * Creates return order
     */
    router.post('/', (req, res) => {
        const returnOrderData = req.body;
        try {
            new Validator(returnOrderData).validate();
            client.returnOrders.createReturnOrder(returnOrderData)
                .then(response => apiStatus(200, response))
                .catch(err => apiError(res, err));
        } catch (e) {
            apiError(res, e);
        }
    });

    return {
        domainName: '@grupakmk',
        pluginName: 'return-orders-plugin',
        route: '/returns',
        router
    };
};
