'use strict';

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

const TABLE = "demo-sls"

module.exports.demo_sls = (event, context, callback) => {
    console.log("Mottok lambda-event: ", JSON.stringify(event));
const done = (err, res) => {
        if (err) {
            console.log("Feil ved " + event.httpMethod + ": " + err);
        } else {
            console.log("Resultat ved " + event.httpMethod + ": " + res);
        }
        return callback(null, {
            statusCode: err ? '400' : '200',
            body: err ? err.message : JSON.stringify(res),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    };

    if (!event.httpMethod) {
        done(new Error(`Fant ingen HTTP-metode på eventet. Du sendte inn følgende event: ` + JSON.stringify(event)));
    }

    switch (event.httpMethod) {
        case 'DELETE':
            dynamo.deleteItem({ TableName: TABLE, Key: JSON.parse(event.body) }, done);
            break;
        case 'GET':
            dynamo.scan({ TableName: TABLE }, done);
            break;
        case 'POST':
            dynamo.putItem({ TableName: TABLE, Item: JSON.parse(event.body) }, done)
            break;
        default:
            done(new Error(`Ulovlig HTTP-metode. Kun GET, POST og DELETE er tillatt. Du sendte inn følgende event:` + JSON.stringify(event)));
    }
};

