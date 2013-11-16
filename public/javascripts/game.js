

/*-----------------------------------------------
 * Game Class
 *----------------------------------------------- */
function Game() {

	// graphics
	this.g = null;

	// thread
	this.thread = null;
	this.timer_old = null;

	// frame count
	this.frameCount = 0;

	/*-----------------------------------------------
	 * Game Variables
	 *----------------------------------------------- */
	// array of battle field
	this.field = null;

	// puyo objects
	this.cur = null;
	this.next = null;
	this.nextnext = null;


}

/*
 * game functions
 */
Game.prototype = {

	// initialize conditions
	init: function() {

		// field
		this.field = new Array(2);
		for( var i=0; i<2; i++ ) {
			this.field[i] = new Array(6);
			for( var j=0; j<6; j++ ) {
				this.field[i][j] = new Array(13);
				for( var k=0; k<13; k++ ) this.field[i][j][k] = 0;
			}
		}

		// canvas
		this.g = document.getElementById("canvas").getContext("2d");

		// prepare puyos
		this.next = new CurrentPuyo([xors.rand(1,4), xors.rand(1,4)]);
		this.nextnext = new CurrentPuyo([xors.rand(1,4), xors.rand(1,4)]);
		this.cur = new CurrentPuyo([xors.rand(1,4), xors.rand(1,4)]);
	},

	// draw
	draw: function() {
		var g = this.g;

		g.clearRect(0, 0, Game.CANVAS_W, Game.CANVAS_H);

		// background
		for( var v=0; v<2; v++ ) {
			for( var x=0; x<6; x++ ) {
				for( var y=0; y<12; y++ ) {
					var offsetx = v * (Game.FIELD_W + Game.CENTER_W);
					var offsety = Game.OJAMA_H;
					var dx = offsetx + x*Game.BLOCK_SIZE;
					var dy = offsety + (11-y)*Game.BLOCK_SIZE;
					
					g.drawImage(image.block, dx, dy, Game.BLOCK_SIZE, Game.BLOCK_SIZE);
				}
			}
		}

		// current puyo
		if( this.cur != null ) {
			this.cur.draw(g, 0);
		}

		// next, nextnext puyo
		if( this.next != null ) {
			this.next.draw(g, 0, Game.NEXT_X0, Game.NEXT_Y);
		}
		if( this.nextnext != null ) {
			this.nextnext.draw(g, 0, Game.NEXTNEXT_X0, Game.NEXTNEXT_Y);
		}
	},

	// prepare new current puyo
	nextPuyo: function() {
		// set puyos
		this.cur = this.next;
		this.next = this.nextnext;
		this.nextnext = new CurrentPuyo([xors(1,4), xors(1,4)]);
	},

	// start game
	startGame: function() {
		// run thread
		this.timer_old = (new Date).getTime();
		this.thread = setInterval( function(self){ self.mainLoop() }, 1, this);
	},

	// main loop
	mainLoop: function() {
		var wasteTime = (new Date).getTime() - this.timer_old;
		if( wasteTime > 1000/Game.FPS ) {
			// calculate frame
			var advancedFrameCount = Math.floor( wasteTime / (1000/Game.FPS) );
			this.frameCount += advancedFrameCount;

			if( advancedFrameCount > 1 ) {
				console.log("skipped frame count:" + (advancedFrameCount-1));
			}

			// draw
			this.draw();

			this.timer_old += advancedFrameCount * (1000/Game.FPS);
		}
	},
};


/*-----------------------------------------------
 * PairPuyo Class
 *----------------------------------------------- */
function PairPuyo(types, pos, rot) {

	this.types = [types[0], types[1]];
	this.pos = [pos[0], pos[1]];
	this.rot = rot;

}

PairPuyo.prototype = {

	// draw
	draw: function(g, field, x, y) {
		if( x == null || y == null ) {
			x = this.pos[0] + (field == 0 ? 0 : Game.FIELD_W+Game.CENTER_W);
			y = this.pos[1] + Game.OJAMA_H;
		}
		g.drawImage(
			image.puyo[this.types[0]-1],
			x, 
			y, 
			Game.BLOCK_SIZE, Game.BLOCK_SIZE);
		g.drawImage(
			image.puyo[this.types[1]-1],
			x + ((this.rot-2)%2)*Game.BLOCK_SIZE, 
			y + ((1-this.rot)%2)*Game.BLOCK_SIZE,
			Game.BLOCK_SIZE, Game.BLOCK_SIZE);
	},

};


/*-----------------------------------------------
 * CurrentPuyo Class
 *----------------------------------------------- */
function CurrentPuyo(types) {

	PairPuyo.call(this, types, [Game.BLOCK_SIZE*2, -Game.BLOCK_SIZE], 2);

}

CurrentPuyo.prototype = Object.create(PairPuyo.prototype);
CurrentPuyo.prototype.constructor = CurrentPuyo;

/*-----------------------------------------------
 * Puyo Class
 *----------------------------------------------- */
function Puyo(type, pos, which) {

	this.type = type;
	this.pos = [pos[0], pos[1]];
	this.which = which;

}

Puyo.prototype = {

	// draw
	draw: function(g) {
		g.drawImage(
			image.puyo[this.type-1],
			this.pos[0] + ( Game.CENTER_W + Game.FIELD_W) * this.which,
			this.pos[1] + Game.OJAMA_H,
			Game.BLOCK_SIZE, Game.BLOCK_SIZE);
	},

	// let the puyo fall n boxes
	fall : function(n) {
		
	}

};





