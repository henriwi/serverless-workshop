'use strict';

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

const TABLE = "demo-sls"

module.exports.demo_sls = (event, context, callback) => {
    console.log("Mottok lambda-event: ", JSON.stringify(event));
};

