'use strict';

exports.handler = (event, context, callback) => {
    console.log("Mottok lambda-event: ", JSON.stringify(event));

    if (event.type === "testevent") {
        callback(null, event.message);
    } else if (event.httpMethod) {
        callback(null, { statusCode: 200, body: "Hello World via API Gateway" });
    } else {
        callback("Mottok ukjent Lambda-event");
    }
}
