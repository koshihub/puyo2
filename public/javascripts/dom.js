

function Dom() {
	// doms
	this.dom_roombutton = document.createElement("div");
	this.dom_roombutton.setAttribute("class", "room_button");

	this.dom_canvas = document.createElement("canvas");
	this.dom_canvas.setAttribute("id", "canvas");
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
		}
	},

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
