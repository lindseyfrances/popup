// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(9112);
var nicknames = [];

function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	console.log("The Request is: " + parsedUrl.pathname);
		
	fs.readFile(__dirname + parsedUrl.pathname, 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
  	
}


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);


// io.to(socketid).emit('message', 'for your eyes only');

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
	
		console.log("We have a new client: " + socket.id + ", " + 'senderid');
		
		// When this user emits, client side: socket.emit('otherevent',some data);
		 // When this user emits, client side: socket.emit('otherevent',some data);
        socket.on("chatmessage", function(data) {
            // Data comes in as whatever was sent, including objects
            console.log("got: 'chatmessage' " + data + "senderid");

            // Send it to all of the clients
            socket.broadcast.emit("senderid", socket.id);
            socket.broadcast.emit("chatmessage", data);

            // var choice = Math.floor(colors.length*Math.random())
            // socket.broadcast.emit("color", choice);


        });

        socket.on('disconnect', function() {
            console.log("bye bye client " + socket.id);
        });

});