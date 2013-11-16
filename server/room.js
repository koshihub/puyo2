
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

			// save the member
			var members = [];
			if( self.rooms[roomID].members.length < 2 ) {
				// push the member session
				self.rooms[roomID].members.push(socket.handshake);

				// create usernames
				for( var i=0; i<self.rooms[roomID].members.length; i++ ) {
					members[i] = self.rooms[roomID].members[i].userInfo;
				}
			} else {
				func({result: false, message: "The room is full"});
				return;
			}

			// broadcast
			socket.broadcast.emit("room:entered", {roomID: roomID, userInfo: socket.handshake.userInfo});

			// success
			func({result: true, members: members});

			//------------------------------------------
			// for debug
			//------------------------------------------
			self.printStatus();
		});

		// leave a room
		socket.on("room:leave", function(message) {

		});

	},

	// disconnected event
	disconnectedUser: function(socket) {
		var handshake = socket.handshake;

		// remove the user from rooms
		for(var i=0; i<this.roomCount; i++) {
			var members = this.rooms[i].members;
			for(var j=0; j<members.length; j++) {
				if(members[j].sessionID == handshake.sessionID) {
					// remove
					members.splice(j, 1);

					// broadcast
					socket.broadcast.emit("room:leaved", {roomID: i, userInfo: handshake.userInfo});
					break;
				}
			}
		}

		//------------------------------------------
		// for debug
		//------------------------------------------
		self.printStatus();
	},

	// debug
	printStatus: function() {
		for( var i=0; i<this.roomCount; i++ ) {
			console.log("room[" + i + "] : ");
			for( var j=0; j<this.rooms[i].members.length; j++ ) {
				console.log(this.rooms[i].members[j].userInfo);
			}
		}
	}

};

/*
 * State of Each Room
 */
 function RoomState() {

 	this.members = [];

 }

 RoomState.prototype = {

 };