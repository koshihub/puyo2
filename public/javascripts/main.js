
function Main() {

	this.dom = null;
	this.game = null;
	this.canvas = null;

}

Main.prototype = {
	// initialize
	init: function() {

		this.dom = new Dom();

		// canvas check
		if( !this.dom.checkCanvas() ) {
			document.body.innerHTML = "canvas対応ブラウザで遊んでください";
			return;
		}

		// set dom
		this.dom.set(Dom.LOBBY);

	},

	// enter room
	enterRoom: function(n) {

		// check if the user can enter the room
		// ******

		// set dom
		this.dom.set(Dom.BATTLE);

		// init game object
		this.game = new Game();
		this.game.init();

		this.game.startGame();
	},
};

var main = new Main();