'use strict'

var Discord = require('discord.js');
var client = new Discord.Client();
var twit = require('twit');
var config = require('./config.js');

var Twitter = new twit(config);

var channel;
var lastStatusID = [];
var toDisplay = [];

// Commands from user message
client.on('message', (message) => {
	if(message.content == "ping"){ message.channel.send('pong'); }
})

client.on('ready', () => {
	
	channel = client.channels.get(config.channel_id);

	console.log('ready');

	getTweets();
	setInterval(getTweets, 4 * 1000); //Refresh every five seconds
})

var getTweets = function(){
	Twitter.get('lists/statuses', config.params, function(err, data){
		if(!err){
			toDisplay = [];
			data.some(function(status){
				if(status.id_str == lastStatusID[0] || status.id_str == lastStatusID[1]){
					return true; // Breaks the some if true
				} else {
					addTweetToDisplay(status);
				}
			});	

			lastStatusID[0] = data[0].id_str;
			lastStatusID[1] = data[1].id_str;
			displayTweets();

		} else {
			console.log(err.toString());
		}
	})
}

var displayTweets = function(){
	// Going backwards to display the oldest tweets first
	for(var i = toDisplay.length - 1; i >= 0; i--){ 
		displayTweet(toDisplay[i]);
	}	
}

var addTweetToDisplay = function(status){
	var d = new Date(); console.log(status.id_str + ":" + status.user.screen_name + "@" + d.toUTCString());

	toDisplay.push(status);
}

var displayTweet = function(data){
	var embed = new Discord.RichEmbed();
	var urls = data.entities.urls;
	var text = "";

	// If the tweet is a retweet
	if(data.full_text.indexOf("RT ") == 0){
		embed.setColor('#01940F');
		embed.setAuthor("@" + data.retweeted_status.user.screen_name, 'https://www.seeklogo.net/wp-content/uploads/2015/11/twitter-logo.png', data.retweeted_status.user.url);
		embed.setTitle("Retweeted by " + data.user.name);
		text = data.retweeted_status.full_text;
	} else {
		embed.setColor('#086A87');
		embed.setAuthor(data.user.name, 'https://www.seeklogo.net/wp-content/uploads/2015/11/twitter-logo.png', data.user.url);
		text = data.full_text;
	}
	
	embed.setThumbnail(data.user.profile_image_url);
	embed.setTimestamp();
	embed.setFooter("Volos Group LLC", 'https://cdn.discordapp.com/attachments/190320907032592385/413870182356877312/Updated_Icon.png');

	if(data.entities.media != undefined){
		embed.setImage(data.entities.media[0].media_url);
	}

	if(urls != undefined){
		//Swap Twitter Links for their display name, so you know where the link goes
		for(var i = 0; i < urls.length; i++){
			text = text.replace(urls[i].url,"[" + urls[i].display_url + "](" + urls[i].url + ")");
		}
	}

	embed.setDescription(text);

	channel.send(embed);
}

client.login(config.discord_token);