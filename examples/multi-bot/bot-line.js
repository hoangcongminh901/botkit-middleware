require('dotenv').load();

var lineBot = require('linebot');
var returnedBot = lineBot({
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    verify: false
});

//Conversation start
// ----------------------------------------------------------------------
var Conversation = require("watson-developer-cloud/conversation/v1");

// Create the service wrapper
var conversation = new Conversation({
    username: process.env.CONVERSATION_USERNAME,
    password: process.env.CONVERSATION_PASSWORD,
    path: {workspace_id: process.env.WORKSPACE_ID},
    url: 'https://gateway.watsonplatform.net/conversation/api',
    version_date: '2016-07-11',
    version: 'v1'
});

const NodeCache = require( "node-cache" );
const myCache = new NodeCache({context: {}});

function requestConvo(event) {
    // Start conversation with empty message.
    conversation.message({
        input: {
            text: event.message.text
        },
        context: myCache.get("context")
    }, processResponse);

    // Process the conversation response.
    function processResponse(err, response) {
        if (err) {
            console.error(err); // something went wrong
            return;
        }

        // If an intent was detected, log it out to the console.
        if (response.intents.length > 0) {
            console.log('Detected intent: #' + response.intents[0].intent);
        }

        // Display the output from dialog, if any.
        if (response.output.text.length != 0) {
            console.log(response.output.text[0]);
        }

        // Prompt for the next round of input.
        // Send back the context to maintain state.

        myCache.set("context", response.context);
        event.reply(response.output.text[0]);
    }
}

returnedBot.on('message', function (event) {
    switch (event.message.type) {
        case 'text':
            requestConvo(event);
        // conversation.message({
        //     input: {
        //         text: event.message.text,
        //         context : context
        //     }
        // }, processResponse);
        // function processResponse(err, response) {
        //     if (err){
        //         console.error(err);
        //         return;
        //     }
        //     event.reply(response.output.text[0]);
        // }
    }
});

module.exports = returnedBot;