

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
	this.dom_freeze.innerHTML = "<a href='/login'>login page</a>";
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
				obj.setAttribute("onclick", "main.roomEnter(" + i + ");");
				obj.setAttribute("id", "room_button" + i);
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

			// leave button
			obj = document.createElement("a");
			obj.innerHTML = "leave";
			obj.setAttribute("onclick", "main.roomLeave()");
			document.body.appendChild(obj);
			break;
			
		// freeze
		case Dom.FREEZE:
			document.body.innerHTML = "";

			// freeze
			var obj = this.dom_freeze.cloneNode(true);
			document.body.appendChild(obj);
			break;
		}
	},

	// change room state
	changeRoomState: function(id, members) {

		var obj = document.getElementById("room_button" + id);
		var html = "";

		for(var i=0; i<members.length; i++) {
			html += members[i].name + "(" + members[i].rate + ")<br>";
		}
		obj.innerHTML = html;

		// full
		if( members.length == 2 ) {
			obj.setAttribute("class", "room_button_full");
		} else {
			obj.setAttribute("class", "room_button");
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
