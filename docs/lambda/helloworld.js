'use strict';


/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = (event, context, callback) => {
    console.log("Mottok lambda-event: ", JSON.stringify(event));

    if (event.type === "testevent") {
        callback(null, event.message);
    } else if (event.httpMethod) {
        callback(null, "Hello World via API Gateway);
    }else {
        callback("Mottok ukjent Lambda-event");
    }
}
