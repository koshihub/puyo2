

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

	// puyo queues
	this.fallQueue = []; // fall puyo
	this.animeQueue = []; // animation puyo

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

		// field
		for( var v=0; v<2; v++ ) {
			for( var x=0; x<6; x++ ) {
				for( var y=0; y<12; y++ ) {
					var type = this.field[v][x][y] - 1;
					if( type >= 0 ) {
						var offsetx = v * (Game.FIELD_W + Game.CENTER_W);
						var offsety = Game.OJAMA_H;
						var dx = offsetx + x*Game.BLOCK_SIZE;
						var dy = offsety + (11-y)*Game.BLOCK_SIZE;
						
						g.drawImage(image.puyo[type], dx, dy, Game.BLOCK_SIZE, Game.BLOCK_SIZE);
					}
				}
			}
		}

		// falling puyo
		for(var i=0, j=this.fallQueue.length; i<j; i++) {
			this.fallQueue[i].draw(g);
		}

		// animating puyo
		for(var i=0, j=this.animeQueue.length; i<j; i++) {
			this.animeQueue[i].draw(g);
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
		var p = new Puyo(1, [0, 0], 0);
		this.fallQueue.push(p);
		p.fall(6);

		// run thread
		this.timer_old = (new Date).getTime();
		this.thread = setInterval( function(self){ self.mainLoop() }, 1, this);
	},

	// main loop
	mainLoop: function() {
		var wasteTime = (new Date).getTime() - this.timer_old;
		if( wasteTime > 1000/Game.FPS ) {
			var len;

			// calculate frame
			var advancedFrameCount = Math.floor( wasteTime / (1000/Game.FPS) );
			this.frameCount += advancedFrameCount;

			if( advancedFrameCount > 1 ) {
				console.log("skipped frame count:" + (advancedFrameCount-1));
			}

			// animate puyos
			len = this.animeQueue.length;
			for(var i=0; i<len; i++) {
				var puyo = this.animeQueue[i];
				if( !puyo.animate() ) {
					// set the field value
					var index = puyo.getIndex();
					this.field[0][index[0]][index[1]] = puyo.type;

					// remove from animate queue
					this.animeQueue.splice(i, 1);
					i--;
					len--;
				}
			}

			// fall puyos
			len = this.fallQueue.length;
			for(var i=0; i<len; i++) {
				var puyo = this.fallQueue[i];
				if( !puyo.fall() ) {
					// start animation
					this.animeQueue.push(puyo);
					puyo.animate(true);

					// remove from fall queue
					this.fallQueue.splice(i, 1);
					i--;
					len--;
				}
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

	// fall related
	this.spy = 0;
	this.fallDistance = 0;

	// anime related
	this.animeFrame = 0;
}

Puyo.prototype = {

	// draw
	draw: function(g) {
		g.drawImage(
			image.puyo[this.type-1],
			this.pos[0] + (Game.CENTER_W + Game.FIELD_W) * this.which,
			this.pos[1] + Game.OJAMA_H,
			Game.BLOCK_SIZE, Game.BLOCK_SIZE - (this.animeFrame%4)*2);
	},

	// let the puyo fall n blocks
	fall : function(n) {
		if( n == null ) {
			// accel
			if( this.spy < Game.MAXSPEED ) {
				this.spy += Game.GRAVITY;
			}

			if( this.fallDistance - this.spy <= 0 ) {
				// fall end
				this.pos[1] += this.spy - this.fallDistance;
				this.fallDistance = 0;
				return false;
			} else {
				this.fallDistance -= this.spy;
				this.pos[1] += this.spy;
			}
		} else {
			this.fallDistance = n * Game.BLOCK_SIZE;
		}

		return true;
	},

	// let the puyo animate
	animate: function(isStart) {
		if( isStart == true ) {
			// start animation
			this.animeFrame = Game.PUYOANIME_FRAMES;
		} else {
			if( this.animeFrame == 0 ) {
				// end animation
				return false;
			} else {
				this.animeFrame --;
			}
		}

		return true;
	},

	// get index
	getIndex: function() {
		return [this.pos[0]/Game.BLOCK_SIZE, 11-this.pos[1]/Game.BLOCK_SIZE];
	},

};





