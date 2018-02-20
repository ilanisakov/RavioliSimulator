//config.js
/** TWITTER APP CONFIGURATION
 * consumer_key
 * consumer_secret
 * access_token
 * access_token_secret
 */

// For List/Statuses
var params = {
	slug: '<SLUG>', // List we want to get
	user_id: '<USER_ID>', // Owner ID of the list's owner
	owner_screen_name: '<USER_NAME>', // Twitter handle of the list's owner		
	count: 3, // How many tweets we want to grab each time
	tweet_mode: 'extended' // We want full tweet texts
}

module.exports = {
  consumer_key: '<CONSUMER_KEY>',  
  consumer_secret: '<CONSUMER_SECRET>',
  access_token: '<ACCESS_TOKEN>',  
  access_token_secret: '<ACCESS_TOKEN_SECRET>',
  discord_token: '<DISCORD_TOKEN>',
  channel_id: "<CHANNEL_ID>",	// ID of the channel we want the bot to post in (Twitter Posts)
  params: params
}