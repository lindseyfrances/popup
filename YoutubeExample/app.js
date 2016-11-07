var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	nicknames = [];

server.listen(8080);

app.get('/', function(req, res){
	res.sendfile(_dirname + '/index.html');
});


io.sockets.on('connection', function(socket){
	socket.on('new user', function(data, callback){
		if (nickname.indexOf(data) != -1){
				callback(false);
		}else{
			callback(true);
			socket.nicknames = data;
			nicknames.push(socket.nickname);
			io.sockets.emit('usernames', nicknames);
		}
	});

	function updateNicknames(){
		io.sockets.emit('usernames', nicknames);
	}

	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, nick: socket.nickname});

	});

	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		nicknames.splice(nicknames.indexOf(socket.nickname), 1)
		updateNicknames();
	})
});