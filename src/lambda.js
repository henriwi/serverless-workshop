'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();


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
    //console.log('Received event:', JSON.stringify(event, null, 2));
    console.log("Received lambda event: ", JSON.stringify(event));

    const done = (err, res) => {
        if (err) {
            console.log("Error when " + event.httpMethod + "'ing: " + err);
        } else {
            console.log("Result when " + event.httpMethod + "'ing: " + res);
        }
        return callback(null, {
            statusCode: err ? '400' : '200',
            body: err ? err.message : JSON.stringify(res),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    };

		/* Post objekt på form {"key": "1234", "text": "todo" } */
    switch (event.httpMethod) {
        case 'DELETE':
            console.log(JSON.parse(event.body));
            dynamo.deleteItem({ TableName: "todos", Key: JSON.parse(event.body) }, done);
            break;
        case 'GET':
            //dynamo.putItem({TableName: "testtabell", Item: {name: "Votes", votes: 3}}, function() {});
            //dynamo.putItem({TableName: "testtabell", Item: {name: "Name", value: "Petter"}}, function() {});
            //dynamo.scan({ TableName: event.queryStringParameters.TableName }, done);
            dynamo.scan({ TableName: "todos" }, done);
            break;
        case 'POST':
            console.log("Adding todo: " + event.body)
            ///dynamo.putItem(({TableName: "testtabell", Item: {name: "Fredrik"}}), done);
            dynamo.putItem({ TableName: "todos", Item: JSON.parse(event.body) }, done)
            break;
        //case 'PUT':
        //    dynamo.updateItem(JSON.parse(event.body), done);
            //break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};

