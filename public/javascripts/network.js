
function Network() {
	
	// connect
	this.socket = new io.connect('/');

	// error event
	this.socket.on('error', function(err) {
		main.freeze("disconnected from the sever");
	});

	// connect event
	this.socket.on('connect', function() {

		// someone entered a room
		this.socket.on("room:entered", function(message) {

			// update the dom
			//

			console.log(message);
		});
	});
}

Network.prototype = {

	// send message
	sendMessage: function(message, data, callback) {

		this.socket.emit(message, data, callback);

	},
	
};

var network = new Network();