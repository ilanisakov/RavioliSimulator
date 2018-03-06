'use strict'

//import TwitterModule from 'TwitterModule';
var TwitterModule = require('./TwitterModule');
var TwitterBot;

var Discord = require('discord.js');
var client = new Discord.Client();
var config = require('./config.js');

var channel;

// Commands from user message
client.on('message', (message) => {
	if(message.content == "ping"){ message.channel.send('pong'); }
})

client.on('ready', () => {
		
	channel = client.channels.get(config.channel_id);

	TwitterBot = new TwitterModule(config,channel);
	TwitterBot.run();

	console.log('Bot Ready');

})

client.login(config.discord_token);