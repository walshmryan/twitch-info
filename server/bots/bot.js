const tmi = require('tmi.js');
var Stopwatch = require('statman-stopwatch');

module.exports = class Bot {

	constructor(channels) {
		this.channels = channels;
		this.messageCount = 0;
		this.stopwatch = new Stopwatch(true); // auto starts

		this.options = {
			options: {
				debug: false
			},
			connection: {
				cluster: "aws",
				reconnect: true
			},
			identity: {
				username: process.env.USERNAME,
				password: "oauth:" + process.env.OAUTH
			},
			channels: this.channels
		}
		this.botID = '_' + Math.random().toString(36).substr(2, 9);
		console.log('messages ' + this.messageCount);
		this.connect();
	}

	getBotID() {
		return this.botID;
	}

	getAnalytics() {
		var minutes = this.stopwatch.time() / 60000;
		var mpm = this.messageCount / minutes;
		return Math.round(mpm);
	}

	connect() {
		var client = new tmi.client(this.options);

		client.on('message', this.messageHandler.bind(this));
		client.on('connected', this.connectedHandler);
		client.on('disconnected', this.disconnectedHandler);
		client.connect();
	}

	messageHandler(target, context, msg, self) {
		// console.log(msg);
		this.messageCount++;
	}

 	connectedHandler (addr, port) {
  		console.log(`* Connected to ${addr}:${port}`)
	}

	disconnectedHandler (reason) {
  		console.log(`Disconnected: ${reason}`)
  		process.exit(1)
	}

}