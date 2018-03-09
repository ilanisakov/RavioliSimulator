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
				if(!data.error)
					channel.send(data[0].name + ": $" + data[0].price_usd + " | " + data[0].price_btc + " BTC");
				else
					channel.send("That Token Does Not Exist :(");
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

	init(){
		this.loadTokenNames();
	}

}

module.exports = CoinMarketCapModule;