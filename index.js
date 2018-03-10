'use strict'

//import TwitterModule from 'TwitterModule';
var TwitterModule = require('./TwitterModule');
var TwitterBot;

var CoinMarketCapModule = require('./CMCModule');
var CMCBot;

var Discord = require('discord.js');
var client = new Discord.Client();
var config = require('./config.js');

var channel;

// Commands from user message
client.on('message', (message) => {
	if(message.content == "ping"){ message.channel.send('pong'); }
	// if(message.content.indexOf("!") == 0){
	// 	// Right now we are only getting CMCBot updates from commands
	// 	var token;
	// 	var space = message.content.indexOf(" ");
	// 	if(space != -1){
	// 		token = message.content.substring(1,space);
	// 	} else {
	// 		token = message.content.substring(1);
	// 	}
	// 	CMCBot.getAndDisplayPrice(token, message.channel);
	// }
})

client.on('ready', () => {
		
	channel = client.channels.get(config.channel_id);

	TwitterBot = new TwitterModule(config,channel);
	TwitterBot.run();

	CMCBot = new CoinMarketCapModule();
	CMCBot.init();

	console.log('Bot Ready');

})

client.login(config.discord_token);