var Discord = require('discord.js');
var client = new Discord.Client();
var twit = require('twit');
var config = require('./config.js');

var Twitter = new twit(config);

var channel;
var lastStatusID = "";
var toDisplay = [];

// Commands from user message
client.on('message', (message) => {
	if(message.content == "ping"){ message.channel.send('pong'); }
})

client.on('ready', () => {
	
	channel = client.channels.get(config.channel_id);

	console.log('ready');

	getTweets();
	setInterval(getTweets, 2 * 1000); //Refresh every five seconds
})

var getTweets = function(){
	// This code is so inefficient, I'll optimize it.....one day
	Twitter.get('lists/statuses', config.params, function(err, data){
		if(!err){
			toDisplay = [];
			data.some(function(status){
				if(status.id_str == lastStatusID){
					return true; // Breaks the some if true
				} else {
					addTweetToDisplay(status);
				}
			});	

			lastStatusID = data[0].id_str;
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
	toDisplay.push(status);
}

var displayTweet = function(data){
	var embed = new Discord.RichEmbed();
	embed.setColor('#086A87');
	embed.setThumbnail(data.user.profile_image_url);
	embed.setAuthor(data.user.name,
					'https://www.seeklogo.net/wp-content/uploads/2015/11/twitter-logo.png',
					data.user.url);
	embed.setDescription(data.full_text);
	embed.setTimestamp();
	embed.setFooter("Volos Group LLC", 'https://cdn.discordapp.com/attachments/190320907032592385/413870182356877312/Updated_Icon.png');

	if(data.entities.media != undefined){
		embed.setImage(data.entities.media[0].media_url);
	}

	channel.send(embed);
}

client.login(config.discord_token);