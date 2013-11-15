
function Main() {

	this.dom = null;
	this.game = null;
	this.network = null;
	this.canvas = null;

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
	enterRoom: function(n) {
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
};

var main = new Main();