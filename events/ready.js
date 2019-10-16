module.exports = (client, message) => {
    console.log(`${client.user.tag} operationnal`, "Launching");
    client.user.setPresence({
        clientStatus: "web",
        game: {
            name: 'potatoes lover | PatHelp',
            details: 'Use PatHelp for more infos !',
            type: 'STREAMING'
        }
    });
};