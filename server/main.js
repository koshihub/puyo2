
/*
 * Server
 */

function Server(io) {

	this.room = new (require('./room.js').Room)();
	this.io = io;

}

Server.prototype = {

	// initialize server
	init: function() {
		var self = this;

		// setting connection
		this.io.sockets.on('connection', function(socket) {

			//Expressのセッションを定期的に更新する
		    var sessionReloadIntervalID = setInterval(function() {
		        socket.handshake.session.reload(function() {
		            socket.handshake.session.touch().save();
		        });
		    }, 60 * 2 * 1000);

		    // set room related event
		    self.room.setEvents(socket);

		});

	},


};


exports.start = function(io){

	var server = new Server(io);
	server.init();

};