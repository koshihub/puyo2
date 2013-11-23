
exports.User = User;

function User() {
	
	// user info
	this.name = null;
	this.rate = null;

	// connection info
	this.socket = null;

};

User.prototype = {

	// initialize
	init: function(name, rate) {
		this.name = name;
		this.rate = rate;
	},

	// set socket
	setSocket: function(socket) {
		this.socket = socket;
	},

	// check if given user is same as self
	equal: function(user) {
		if( this.name == user.name ) {
			return true;
		} else {
			return false;
		}
	},

};