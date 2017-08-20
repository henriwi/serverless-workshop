'use strict';

var url = require('url');
var https = require('https');
var util = require('util');

var POST_OPTIONS = {
    hostname: 'hooks.slack.com',
    path: '/services/T6N1U8Z0U/B6MTAKYFM/9HCWE90lhMIj4ktMHghecRDG',
    method: 'POST',
};


module.exports.demo_slack = (event, context, callback) => {
  console.log("Slackloggeren mottok event: ", JSON.stringify(event));

  /*console.log(event.Records[0]);
  console.log(event.Records[0].dynamodb);
  console.log(event.Records[0].dynamodb.NewImage);
  console.log(event.Records[0].dynamodb.NewImage.text);
  console.log(event.Records[0].dynamodb.NewImage.text.S);*/

  //var record = event.Records[0]["dynamodb"]["Keys"];
  var record = event.Records[0].dynamodb.Keys;
  var eventName = event.Records[0].eventName;


  console.log(record)

    var message = {
        channel: 'testing',
        text: "text: " + record.text.S + ". Eventname: " + eventName
    };
    console.log('Melding som postes:', message);
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
