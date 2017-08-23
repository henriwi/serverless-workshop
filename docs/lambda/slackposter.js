'use strict';

var POST_OPTIONS = {
    hostname: 'hooks.slack.com',
    path: '/services/T6N1U8Z0U/B6MTAKYFM/9HCWE90lhMIj4ktMHghecRDG',
    method: 'POST',
};


module.exports.demo_slack = (event, context, callback) => {
    console.log("Slackloggeren mottok event: ", JSON.stringify(event));

    // Hent ut riktige deler av eventet og post til Slack

    // Post til kanalen #general på Slack

    callback(null, { statusCode: '200' });
}
