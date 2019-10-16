const dialogflow = require('dialogflow');
const uuid = require('uuid');

exports.run = async (client, message, args) => {
    if (!args.length || args.length < 1) return message.reply('You will need a argument for that !');

    const projectId = 'a-e-g-i-s--nbnlib';
    const sessionId = 'AIzaSyDNjR7m7ekNJ-XoV6tQnAZJ3v6wATOVRZM';

    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: args.join(' '),
                languageCode: 'fr-FR'
            }
        }
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
    } else {
        console.log(`  No intent matched.`);
    }
    message.channel.send(result.fulfillmentText);
};