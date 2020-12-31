let Validator = require('validatorjs');

class OrderDataValidator {
    validate () {
        const rules = {
            order_id: 'required',
            customer_id: 'required',
            customer_email: 'required',
            reason: 'required',
            comment: 'required',
            items: 'required'
        };

        let validation = new Validator(this.orderData, rules);
        if (validation.failes()) {
            throw validation.errors;
        }

    }

    constructor (orderData) {
        this.orderData = orderData;
    }
}

module.exports = OrderDataValidator;
