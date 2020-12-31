# Return orders plugin
Plugin allows to create and fetch returns.

Return is where a customer is not satisfied with the product or the deliverable,
& businesses need to create a return the good, based on customer return request.

## API
Plugin exposes 3 endpoints to handle order return:
* `GET /vendor/returns/single/${returnId}` - returns single order-return object
* `GET /vendor/returns/${customerId}` - returns list of customer order-returns
* `POST /vendor/returns` - creates order-return

## Filtering return order list
Return orders list can be filtered and sorted via additional query parameters on 
endpoint `GET /vendor/returns/${customerId}`:
* pageSize - `{number}`
* currentPage - `{number}`
* sortBy - field by which list will be sorted
* sortDir - sort direction `{asc|desc}`

## Entry point
Entry point for plugin is a /src/index.js file. It contains a template function
for api plugin.
