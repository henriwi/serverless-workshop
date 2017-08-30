'use strict';

var url = require('url');
var https = require('https');
var util = require('util');

var POST_OPTIONS = {
    hostname: 'hooks.slack.com',
    path: '/services/T6N1U8Z0U/B6MTAKYFM/9HCWE90lhMIj4ktMHghecRDG',
    method: 'POST',
};


module.exports.poster = (event, context, callback) => {
    console.log("Slackloggeren mottok event: ", JSON.stringify(event));

    var record = event.Records[0].dynamodb.Keys;
    var eventName = event.Records[0].eventName;

    var message = {
        channel: 'general',
        text: "Todo: " + record.text.S + ". Eventname: " + eventName
    };
    console.log('Melding som postes til Slack: ', message);
    var r = https.request(POST_OPTIONS, function(res) {
                        res.setEncoding('utf8');
                        res.on('data', function (data) {
                            context.succeed("Message Sent: " + data);
                     });
    }).on("error", function(e) {context.fail("Failed: " + e);} );
    r.write(util.format("%j", message));
    r.end();

    callback(null, { statusCode: '200' });
}
