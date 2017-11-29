var express = require('express');
var Twitter = require('twitter');
var socket = require('socket.io');
exports.socketServer = function(app,server){
	var io = socket.listen(server,{path:"/streaming"});	
	//io.emit('index',{title: 'Express'});
	io.sockets.on('connect',function(socket)
	{
		io.emit('message',{"text":"Connect recieved"});
		console.log("Connect");
	});
	io.sockets.on("connection",function(socket)
	{
		io.emit('message',{"text":"You have connected to mighty esperer"});	
		console.log("Connected");
		socket.on('dissconnect',function()
		{
			//disconnect from twitter;
		}
		socket.on('client',function(data,words)
		{
			
			var parseData = JSON.parse(data);
			//console.log(parseData.apiKey);
			
			var clientAuth = new Twitter({
			consumer_key: parseData.apiKey,
			consumer_secret: parseData.apiSecret,
			access_token_key: parseData.accessToken,
			access_token_secret: parseData.accessTokenSecret
			});

			
			var parsedWords = JSON.parse(words);
			//console.log(parsedWords[0]);
			var track ={
			track : parsedWords};
			//console.log(track);
			var response = [];
			var tweet= {};
			var counter =0;
			clientAuth.stream('statuses/filter', { track : parsedWords[0]}, function(stream){
				stream.on('data',function(event){
				tweet = new Object;
				tweet.name= event.user.screen_name;
				tweet.text = event.text;
				response.push(tweet);
				//console.log(event.user.screen_name+" :: "+event.text);
				counter++;
					setInterval(function(){
						console.log(response);
						socket.emit("streamData",response,counter);
						response = new Array;
					},10000);
					
				});
				
				stream.on('error',function(error){					
					throw error;
				});
				
			});
	
			

		});
	});
	
	io.emit('message',{"text":"Push Message"});


}


