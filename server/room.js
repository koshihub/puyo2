
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
			if( roomID < 0 || roomID >= self.roomCount ) {
				func({result: false, message: "Invalid roomID"});
				return;
			}

			// save the member
			var members = self.rooms[roomID].members;
			if( members.length < 2 ) {
				// push the user data
				members.push(socket.handshake.user);
			} else {
				func({result: false, message: "The room is full"});
				return;
			}

			// broadcast
			socket.broadcast.emit("room:entered", {roomID: roomID, user: socket.handshake.user});

			// success
			func({result: true, members: members});

			// if there are two members, start to prepare for the battle
			if( members.length == 2 ) {
				// create a random seed and send it to client
				var seed = 9909090;
				members[0].socket.emit("game:seed", {seed: seed});
				members[1].socket.emit("game:seed", {seed: seed});
			}

			//------------------------------------------
			// for debug
			//------------------------------------------
			self.printStatus();
		});

		// leave a room
		socket.on("room:leave", function(message, func) {
			var roomID = message.roomID;

			// check if the roomID is valid
			if( roomID < 0 || roomID >= self.roomCount ) {
				func({result: false, message: "Invalid roomID"});
				return;
			}

			// remove the member
			var leaved = false;
			for( var i=0; i<self.rooms[roomID].members.length; i++ ) {
				if( self.rooms[roomID].members[i].equal(socket.handshake.user) ) {
					self.rooms[roomID].members.splice(i,1);
					leaved = true;
				}
			}

			if( !leaved ) {
				func({result:false, message: "No such a user"});
				return;
			}

			// broadcast
			socket.broadcast.emit("room:leaved", {roomID: roomID, user: socket.handshake.user});

			// success
			func({result: true, members: self.rooms[roomID].members});
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
					socket.broadcast.emit("room:leaved", {roomID: i, user: handshake.user});
					break;
				}
			}
		}

		//------------------------------------------
		// for debug
		//------------------------------------------
		this.printStatus();
	},

	// debug
	printStatus: function() {
		for( var i=0; i<this.roomCount; i++ ) {
			console.log("room[" + i + "] : ");
			for( var j=0; j<this.rooms[i].members.length; j++ ) {
				console.log(this.rooms[i].members[j].name);
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