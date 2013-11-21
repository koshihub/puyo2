
var User = function() {
	
	this.name = null;
	this.rate = null;

};

User.prototype = {

	// initialize
	init: function(name, rate) {
		this.name = name;
		this.rate = rate;
	}

	// check if given user is same as self
	equal: function(user) {
		if( this.name == user.name ) {
			return true;
		} else {
			return false;
		}
	}

};