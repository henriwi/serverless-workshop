'use strict';

var POST_OPTIONS = {
    hostname: 'hooks.slack.com',
    path: '<webhook-path>',
    method: 'POST',
};


module.exports.demo_slack = (event, context, callback) => {
    console.log("Slackloggeren mottok event: ", JSON.stringify(event));

    // Hent ut riktige deler av eventet

    // Post til Slack

    var message = {
        channel: 'din-kanal-her',
        text: 'Din melding her'
    };

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
