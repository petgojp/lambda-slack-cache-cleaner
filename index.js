var https   = require('https');
var util    = require('util');
var Promise = require('bluebird');
var AWS     = require('aws-sdk');
var env     = require('node-env-file');

env(__dirname + '/.env');
var slack = {
    channelName: process.env['SLACK_CHANNEL_NAME'],
    incomingWebhookURL: process.env['SLACK_INCOMING_WEBHOOK_URL'],
    userName: process.env['SLACK_USER_NAME'],
    iconEmoji: process.env['SLACK_ICON_EMOJI']
};
var stackIds = {
    news:   process.env['STACK_ID_NEWS'],
    corp:   process.env['STACK_ID_CORP'],
    match:  process.env['STACK_ID_MATCH']
};

AWS.config.update({
    accessKeyId: process.env['CACHE_CLEANER_AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['CACHE_CLEANER_AWS_SECRET_ACCESS_KEY'],
    region: 'us-east-1'
});
var opsworks = new AWS.OpsWorks();

exports.handler = function(event, context) {

    var stackId = '';
    switch (event.text) {
        case 'clean news':
            stackId = stackIds.news;
            break;
        case 'clean corp':
            stackId = stackIds.corp;
            break;
        case 'clean match':
            stackId = stackIds.match;
            break;
        default:
            break;
    }

    if (stackId) {

        var params = {
            Command: {
                Name: 'execute_recipes',
                Args: {
                    recipes: [
                        'nginx::purge_cache',
                    ]
                }
            },
            StackId: stackId
        };
        opsworks.createDeployment(params, function(err, data) {

            if (err) {
                send('bow...(error)').then(function(){
                    console.log('ENV', process.env);
                    context.done(err);
                });
            } else {
                send('bow wow!(success)').then(function(){
                    context.done();
                });
            }

        });

    } else {
        context.done();
    }

};

function send(text){
    return new Promise(function(resolve, reject){
        var options = {
            method: 'POST',
            hostname: 'hooks.slack.com',
            port: 443,
            path: slack.incomingWebhookURL
        };

        var data = {
            "channel": "#" + slack.channelName,
            "username": slack.userName,
            "text": text,
            "icon_emoji": slack.iconEmoji
        };

        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                resolve(null, 'success');
            });
        });

        req.on('error', function (e) {
            reject(e);
        });

        req.write(util.format("%j", data));
        req.end();
    });
}
