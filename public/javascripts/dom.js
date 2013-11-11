

function Dom() {
	// doms
	// room button
	this.dom_roombutton = document.createElement("div");
	this.dom_roombutton.setAttribute("class", "room_button");

	// canvas
	this.dom_canvas = document.createElement("canvas");
	this.dom_canvas.setAttribute("id", "canvas");

	// freeze dialog
	this.dom_freeze = document.createElement("div");
};

Dom.prototype = {
	// set doms
	set: function(type) {
		switch(type) {

		// lobby
		case Dom.LOBBY:
			document.body.innerHTML = "";

			// room buttons
			for( var i=0; i<20; i++ ) {
				var obj = this.dom_roombutton.cloneNode(true);
				obj.setAttribute("onclick", "main.enterRoom(" + i + ");");
				document.body.appendChild(obj);
			}
			break;

		// battle
		case Dom.BATTLE:
			document.body.innerHTML = "";

			// canvas
			var obj = this.dom_canvas.cloneNode(true);
			obj.width = Game.CANVAS_W;
			obj.height = Game.CANVAS_H;
			document.body.appendChild(obj);
			break;
			
		// freeze
		case Dom.FREEZE:
			document.body.innerHTML = "";

			// freeze
			var obj = this.dom_freeze.cloneNode(true);
			obj.innerHTML = "reload";
			document.body.appendChild(obj);
			break;
		}
	},

/*
	// debugging window
	showDebug: function() {
		var textarea = document.createElement("div");
		textarea.setAttribute("id", "debug");
		document.body.appendChild(textarea);
	},

	// debugPrint
	debugPrint: function(text) {
		var obj = document.getElementByID("debug");
		var t = obj.innerHTML + "<br>" + text;
		if( obj ) {
			obj.innerHTML = t;
		}
	}
*/

	// check canvas
	checkCanvas: function() {
		if( this.dom_canvas.getContext ) {
			return true;
		}
		else {
			return false;
		}
	},
};
