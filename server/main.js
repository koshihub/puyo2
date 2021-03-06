
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
		    	if( socket.handshake && socket.handshake.session ) {
			        socket.handshake.session.reload(function() {
			            socket.handshake.session.touch().save();

		                // Make it easy to retrieve user data
		                socket.handshake.userInfo = {
		                	username: socket.handshake.session.passport.user.username,
		                	rate: 1500,
		                };
			        });
		    	} else {
		    		clearInterval(sessionReloadIntervalID);
		    	}
		    }, 	2*60*1000);

		    // disconnect
		    socket.on('disconnect', function() {
		    	console.log(socket.handshake.userInfo.username + " was disconnected.");
		    	self.room.disconnectedUser(socket);
		    });

		    // set room related event
		    self.room.setEvents(socket);

		});

	},


};


exports.start = function(io){

	var server = new Server(io);
	server.init();

};