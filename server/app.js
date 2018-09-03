require('dotenv').config();
var express = require('express');
const path = require('path');
var BotController = require('./bots/bot-controller.js');

var app = express();
var botController = new BotController();

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/', function (req, res) {
   res.send('Hello World');
});

app.get('/bot/:channel', function (req, res) {
    var botID = botController.createNewBot([req.params.channel]);
    res.send(botID);
});

app.get('/bot/status/:botID', function (req, res) {
    let bot = botController.getBotForID(req.params.botID);

    if(bot == null) {
        throw new Error('No bot found for ID');
    } else {
        res.json({'mpm':bot.getAnalytics()});
    }
});

app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

var server = app.listen(process.env.PORT || 8080, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("App running on http://%s:%s", host, port)
});


// links
// https://expressjs.com/en/guide/error-handling.html
// https://reactjs.org/tutorial/tutorial.html
// https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0