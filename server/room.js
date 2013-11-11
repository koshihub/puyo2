
exports.Room = Room;

function Room() {
	
	// number of rooms
	this.roomCount = 20;

	// rooms
	this.rooms = new Array(this.roomCount);
	for(var i=0; i<this.roomCount; i++) {
		this.rooms[i] = new RoomState();
	}
}

Room.prototype = {

	// set room related socket events
	setEvents: function(socket) {
		var self = this;

		// enter a room
		socket.on("room:enter", function(message, func) {
			var roomID = message.roomID;

			// check if the roomID is valid
			if( roomID < 0 && roomID >= self.roomCount ) {
				func({result: false, message: "Invalid roomID"});
				return;
			}

			// console.log(socket.handshake.session);

			// save the member
			var members = [];
			if( self.rooms[roomID].member.length < 2 ) {
				// push the member session
				self.rooms[roomID].member.push(socket.handshake.session);

				// create usernames
				for( var i=0; i<self.rooms[roomID].member.length; i++ ) {
					members[i] = self.rooms[roomID].member[i].userInfo;
					console.log(members[i]);
				}
			} else {
				func({result: false, message: "The room is full"});
				return;
			}

			// broadcast
			socket.broadcast.emit("room:entered", {roomID: roomID, userInfo: socket.handshake.session.userIndo});

			// success
			func({result: true, members: members});
		});

		// leave a room
		socket.on("room:leave", function(message) {

		});

	},

};

/*
 * State of Each Room
 */
 function RoomState() {

 	this.member = [];

 }

 RoomState.prototype = {

 };