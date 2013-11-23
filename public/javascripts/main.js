
function Main() {

	// class
	this.dom = null;
	this.game = null;
	this.network = null;
	this.canvas = null;

	// rooms
	this.roomCount = 20;
	this.rooms = new Array(this.roomCount);
	for (var i=0; i<this.roomCount; i++) {
		this.rooms[i] = new RoomState();
	}

	// variables
	this.roomID = -1;
}

Main.prototype = {
	// initialize
	init: function() {
		// network
		this.network = new Network();
		network.init();

		// dom
		this.dom = new Dom();

		// canvas check
		if( !this.dom.checkCanvas() ) {
			document.body.innerHTML = "canvas対応ブラウザで遊んでください";
			return;
		}

		// set dom
		this.dom.set(Dom.LOBBY);
	},

	// freeze the application
	freeze: function(err) {
		console.log(err);

		// show freeze dialog
		this.dom.set(Dom.FREEZE);
	},

	// enter room
	roomEnter: function(n) {
		var self = this;

		// send enter room request
		network.sendMessage('room:enter', {roomID: n}, function(ret) {
			if( ret.result ) {
				// set dom
				self.dom.set(Dom.BATTLE);

				// save roomID
				self.roomID = n;

				// init game object
				self.game = new Game();
				self.game.init();
			}
			else {
				console.log(ret.message);
			}
		});
	},

	// leave room
	roomLeave: function() {
		var self = this;

		// send leave room request
		network.sendMessage('room:leave', {roomID: this.roomID}, function(ret) {

			if( ret.result ) {
				// end game
				self.game.endGame();

				// free game object
				self.game = null;

				// set dom
				self.dom.set(Dom.LOBBY);
			}
			else {
				console.log(ret.message);
			}
		});
	},

	// someone entered a room
	roomEntered: function(roomID, user) {
		if(roomID >= 0 && roomID < this.roomCount) {
			if( this.rooms[roomID].members.length < 2 ) {
				// push the member
				this.rooms[roomID].members.push(user);
			}

			// change state
			this.dom.changeRoomState(roomID, this.rooms[roomID].members);
		}
	},

	// someone leaved a room
	roomLeaved: function(roomID, user) {
		if(roomID >= 0 && roomID < this.roomCount) {
			var members = this.rooms[roomID].members;
			for(var i=0; i<members.length; i++) {
				if(members[i].name == user.name) {
					// remove
					members.splice(i, 1);

					// change state
					this.dom.changeRoomState(roomID, members);
					break;
				}
			}
		}
	},

	// recieve a seed
	recieveSeed: function(seed) {
		if( this.game != null ) {
			console.log("recieve seed:" + seed);
			xors.seed(seed);
		}
	}
};

var main = new Main();


/*
 * State of Each Room
 */
function RoomState() {

	this.members = [];

}

RoomState.prototype = {

};