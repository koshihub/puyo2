

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

	// current puyo object
	this.cur = null;


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
			this.cur.draw(g, 0, 0);
		}
	},

	// create new current puyo
	createCurrentPuyo: function() {

	},

	// start game
	startGame: function() {
		// prepare current puyo
		this.createCurrentPuyo();


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
	draw: function(g, offx, offy) {
		g.drawImage( 
			image.puyo[this.types[0]-1], 
			offx+this.pos[0], 
			offy+this.pos[1] + Game.OJAMA_H,
			Game.BLOCK_SIZE, Game.BLOCK_SIZE);
		g.drawImage( 
			image.puyo[this.types[1]-1], 
			offx+this.pos[0] + ((this.rot-2)%2)*Game.BLOCK_SIZE, 
			offy+this.pos[1] + ((1-this.rot)%2)*Game.BLOCK_SIZE + Game.OJAMA_H,
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





