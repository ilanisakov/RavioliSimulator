'use strict'

var Discord = require('discord.js');
var twit = require('twit');

var lastStatusID = [];
var toDisplay = [];
var displayChannel;

class TwitterModule {

	constructor(config, channel) {
		this._Twitter = new twit(config);
		this.params = config.params;
		this.name = "Twitter Module";
		this.postingChannel = channel;

		displayChannel = channel;

		console.log("TwitterModule Created");
	}

	// Adds a tweet to be displayed
	addTweetToDisplay(status){
		var d = new Date(); console.log(status.id_str + ":" + status.user.screen_name + "@" + d.toUTCString());

		toDisplay.push(status);
	}

	// Displays a tweet in a rich embed to the display channel
	displayTweet(data){
		//console.log(data.entities)
		var embed = new Discord.RichEmbed();
		var urls = data.entities.urls;
		var text = "";
		var tweetUrl = "";
		var profileUrl = "";

		// If the tweet is a retweet
		if(data.full_text.indexOf("RT ") == 0){
			text = data.retweeted_status.full_text;
			tweetUrl = "https://twitter.com/" + data.retweeted_status.user.screen_name + "/status/" + data.id_str;
			profileUrl = "https://twitter.com/" + data.retweeted_status.user.screen_name;
			embed.setColor('#01940F');
			embed.setAuthor("@" + data.retweeted_status.user.screen_name, data.retweeted_status.user.profile_image_url, profileUrl);
			embed.setTitle("Retweeted by " + data.user.name);
		} else {
			text = data.full_text;
			tweetUrl = "https://twitter.com/" + data.user.screen_name + "/status/" + data.id_str;
			profileUrl = "https://twitter.com/" + data.user.screen_name;
			embed.setColor('#086A87');
			embed.setAuthor(data.user.name, data.user.profile_image_url, profileUrl);			
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
		embed.setURL(tweetUrl);

		displayChannel.send(embed);
	}

	// Display all tweets
	displayTweets(){
		// Going backwards to display the oldest tweets first
		for(var i = toDisplay.length - 1; i >= 0; i--){ 
			this.displayTweet(toDisplay[i]);
		}	
	}

	// Gets a list of tweets from the list specified in config.js, and displays them if they are new
	getTweets(){
		var self = this;
		this._Twitter.get('lists/statuses', this.params, function(err, data){
			if(!err){
				toDisplay = [];
				data.some(function(status){
					if(status.id_str == lastStatusID[0] || status.id_str == lastStatusID[1]){
						return true; // Breaks the some if true
					} else {
						self.addTweetToDisplay(status);
					}
				});	

				lastStatusID[0] = data[0].id_str;
				lastStatusID[1] = data[1].id_str;
				self.displayTweets();

			} else {
				console.log(err.toString());
			}
		}).bind(this);
	}

	// Run the twitter bot
	run(){
		this.getTweets();
		setInterval(this.getTweets.bind(this), 4 * 1000); //Refresh every five seconds
	}
}

module.exports = TwitterModule;