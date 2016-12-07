'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

const dynamo_tablename = "serverless-ws"

const frontend_origin = "http://henriwi-serverless.s3-website.eu-central-1.amazonaws.com";


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
module.exports.todo = (event, context, callback) => {
    console.log("Mottok lambda-event: ", JSON.stringify(event));

    const done = (err, res) => {
        if (err) {
            console.log("Feil ved " + event.httpMethod + "'ing: " + err);
        } else {
            console.log("Resultat ved " + event.httpMethod + "'ing: " + res);
        }
        return callback(null, {
            statusCode: err ? '400' : '200',
            body: err ? err.message : JSON.stringify(res),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': frontend_origin
            },
        })
    };

    switch (event.httpMethod) {
        case 'DELETE':
            dynamo.deleteItem({ TableName: dynamo_tablename, Key: JSON.parse(event.body) }, done);
            break;
        case 'GET':
            dynamo.scan({ TableName: dynamo_tablename }, done);
            break;
        case 'POST':
            dynamo.putItem({ TableName: dynamo_tablename, Item: JSON.parse(event.body) }, done)
            break;
        default:
            done(new Error(`Ukjent HTTP-metode. Du sendte inn følgende greier:` + JSON.stringify(event)));
    }
};

