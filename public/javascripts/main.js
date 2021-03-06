
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

				// init game object
				self.game = new Game();
				self.game.init();

				self.game.startGame();
			}
			else {
				console.log(ret.message);
			}

		});
	},

	// someone entered a room
	roomEntered: function(roomID, userInfo) {

		if(roomID >= 0 && roomID < this.roomCount) {
			if( this.rooms[roomID].members.length < 2 ) {
				// push the member
				this.rooms[roomID].members.push(userInfo);
			}

			// change state
			this.dom.changeRoomState(roomID, this.rooms[roomID].members);
		}

	},

	// someone leaved a room
	roomLeaved: function(roomID, userInfo) {

		if(roomID >= 0 && roomID < this.roomCount) {
			var members = this.rooms[roomID].members;
			for(var i=0; i<members.length; i++) {
				if(members[i].username == userInfo.username) {
					// remove
					members.splice(i, 1);

					// change state
					this.dom.changeRoomState(roomID, members);
					break;
				}
			}
		}

	},
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