
function Network() {
	
	// connect
	this.socket = null; //new io.connect('/');

}

Network.prototype = {

	// initialize
	init: function() {
		var self = this;

		// connect to server
		self.socket = new io.connect('/');

		// error event
		self.socket.on('error', function(err) {
			main.freeze("disconnected from the sever");
		});

		// connect event
		self.socket.on('connect', function() {

			// someone entered a room
			self.socket.on("room:entered", function(message) {
				// update the dom
				main.roomEntered(message.roomID, message.user);
			});

			// someone leaved a room
			self.socket.on("room:leaved", function(message) {
				// update the dom
				main.roomLeaved(message.roomID, message.user);
			});

			// recieve a seed
			self.socket.on("game:seed", function(message) {
				main.recieveSeed(message.seed);
			});

		});

		// dissconnect event
		self.socket.on('disconnect', function() {
			console.log("disconnect");
			main.freeze("disconnected from the sever");
		});

	},

	// send message
	sendMessage: function(message, data, callback) {

		this.socket.emit(message, data, callback);

	},
	
};

var network = new Network();