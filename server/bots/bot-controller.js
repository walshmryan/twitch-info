var Bot = require('./bot.js');

module.exports = class BotController {

    constructor() {
        this.bots = [];
    }

    createNewBot(channels) {
        var bot = this.checkChannels(channels);
        if(bot != null){
            return bot.getBotID();
        }
        console.log('creating new bot, no bots found for channel');
        let bot1 = new Bot(channels);
        this.bots.push(bot1);
        return bot1.getBotID();
    }

    checkChannels(channel) {
        for(let i = 0; i < this.bots.length; i++) {
            var bot = this.bots[i];
            if(bot.channels[0] == ('#'+channel)) {
                return bot;
            }
        }
        return null;
    }
    
    getBotForID(botID) {
        if(botID == 0 && this.bots.length > 0) return this.bots[0]; // return first bot
        for(let i = 0; i < this.bots.length; i++) {
            if(this.bots[i].getBotID() == botID) {
                return this.bots[i];
            }
        }
        return null;
    }


}