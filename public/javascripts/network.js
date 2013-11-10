
function Network() {
	
	// connect
	this.socket = new io.connect('/');

	// connect event
	this.socket.on('connect', function() {

	});
}

Network.prototype = {

	// send message
	sendMessage: function(message, data, callback) {

		this.socket.emit(message, data, callback);

	},
	
};

var network = new Network();