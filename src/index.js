const Validator = require('./validator/order-data-validator');
const qs = require('qs');

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
                const url = `/kmk-returns/returns/${returnId}`;
                return restClient.get(url);
            };

            module.getReturnOrderList = ({ customerId, pageSize, currentPage, sortBy, sortDir }, token) => {
                const searchCriteria = {
                    filterGroups: [
                        {
                            filters: [
                                { field: 'customer_id', value: customerId }
                            ]
                        }
                    ],
                    ...(sortBy && { sortOrders: [{ field: sortBy, direction: sortDir || 'asc' }] }),
                    pageSize: pageSize || 50,
                    currentPage: currentPage || 1
                };

                const url = `/kmk-returns/returns/search?searchCriteria=${qs.stringify(searchCriteria, { arrayFormat: 'bracket' })}`;
                return restClient.get(url, token);
            };

            return module;
        });

        return client;
    };

    /**
     * Creates return order
     * @req.body order data
     */
    router.post('/', (req, res) => {
        const returnOrderData = req.body;
        const client = createMage2RestClient();
        try {
            new Validator(returnOrderData).validate();
            client.returnOrders.createReturnOrder(returnOrderData)
                .then(response => apiStatus(res, response, 200))
                .catch(err => apiError(res, err));
        } catch (e) {
            apiError(res, e);
        }
    });

    /**
     * Returns single returns details
     * @req.params.returnId Return order identifier
     */
    router.get('/single/:returnId', (req, res) => {
        const { returnId } = req.params;
        const client = createMage2RestClient();
        try {
            if (!returnId) { throw new Error('Return id is required'); }
            client.returnOrders.getReturnOrder(returnId)
                .then(response => apiStatus(res, response, 200))
                .catch(err => apiError(res, err));
        } catch (e) {
            apiError(res, e);
        }
    });

    /**
     * Returns list of return orders for customer
     * @req.params.customerId - Customer identifier
     */
    router.get('/:customerId', (req, res) => {
        const { customerId } = req.params;
        const {token} = req.query;
        const additionalParams = req.query;
        const client = createMage2RestClient();
        try {
            if (!customerId) { throw new Error('Customer id is required'); }
            client.returnOrders.getReturnOrderList({ customerId, ...additionalParams }, token)
                .then(response => apiStatus(res, response, 200))
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
