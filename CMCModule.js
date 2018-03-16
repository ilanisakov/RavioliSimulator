'use strict'

var Discord = require('discord.js');
var request = require('request');

var tokenList = {};

class CoinMarketCapModule {

	constructor(){
		console.log("Coin Market Cap Bot Created");
	}

	getAndDisplayPrice(tokenName, channel){
		tokenName = tokenName.toUpperCase();
		var url = 'https://api.coinmarketcap.com/v1/ticker/' + tokenList[tokenName];
		request(url, function(error, response, body) {
			if(!error){
				var data = JSON.parse(body);
				if(!data.error){
					channel.send(data[0].name + ": $" + data[0].price_usd + " | " + data[0].price_btc + " BTC");
				}else{
					channel.send("That Token Does Not Exist :(");
				}
			} else {
				throw error;
			}
		})
	}

	loadTokenNames(){
		request('https://api.coinmarketcap.com/v1/ticker/?limit=0', function(error, response, body) {
			if(!error){
				var data = JSON.parse(body);

				for(var i = 0; i < data.length; i++){
					tokenList[data[i].symbol] = data[i].id;
				}
				console.log("Token names are loaded!");
			} else {
				throw error;
			}
		});
	}

	// Displays a tweet in a rich embed to the display channel
	displayTweet(data){
		var embed = new Discord.RichEmbed();

		embed.setColor('#01940F');
		embed.setAuthor(data.name + "[" + data.symbol + "]");
		embed.setTitle("Price: $" + data[0].price_usd + " | " + data[0].price_btc + " BTC" + data.price_usd );		
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

		displayChannel.send(embed);
	}

	init(){
		this.loadTokenNames();
	}

}

module.exports = CoinMarketCapModule;