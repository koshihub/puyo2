

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
		this.next = new CurrentPuyo([xors.rand(1,4), xors.rand(1,4)], this);
		this.nextnext = new CurrentPuyo([xors.rand(1,4), xors.rand(1,4)], this);
		this.cur = new CurrentPuyo([xors.rand(1,4), xors.rand(1,4)], this);
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
		this.nextnext = new CurrentPuyo([xors.rand(1,4), xors.rand(1,4)], this);
	},

	// check collision
	checkCollision: function(index) {
		if( index[0] < 0 || index[0] >= 6 || this.field[0][index[0]][index[1]] != 0 ) {
			return true;
		} else {
			return false;
		}
	},

	// start game
	startGame: function() {
		var p = new Puyo(1, [1, 3], 0);
		//this.fallQueue.push(p);
		//p.fall(3);

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

			// rotation of current puyo
			if( this.cur != null ) {
				if( key.keyQueue.z ) {
					this.cur.rotate( 1 );
				}
				else if( key.keyQueue.x ) {
					this.cur.rotate( -1 );
				}
				else {
					this.cur.rotate();
				}
			}

			// natural fall of current puyo
			if( this.cur != null ) {
				if( !this.cur.nFall() ) {
					this.cur = null;
				}
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

			// new current puyo
			if( this.cur == null && this.fallQueue.length == 0 && this.animeQueue.length == 0 ) {
				this.nextPuyo();
			}

			// draw
			this.draw();

			// reset the key state
			key.keyQueue.reset();

			this.timer_old += advancedFrameCount * (1000/Game.FPS);
		}
	},
};


/*-----------------------------------------------
 * PairPuyo Class
 *----------------------------------------------- */
function PairPuyo(types, pos, rot, obj) {

	this.game = obj;

	this.types = [types[0], types[1]];
	this.pos = [pos[0], pos[1]];
	this.rot = rot;

	// for rotate animation
	this.angle = this.rot * 90;
	this.rotateSpeed = 0;
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
		/*
		g.drawImage(
			image.puyo[this.types[1]-1],
			x + ((this.rot-2)%2)*Game.BLOCK_SIZE, 
			y + ((1-this.rot)%2)*Game.BLOCK_SIZE,
			Game.BLOCK_SIZE, Game.BLOCK_SIZE);
		*/

		var center = [x + Game.BLOCK_SIZE/2, y + Game.BLOCK_SIZE/2];
		var a = this.angle / 180 * Math.PI;
		var p = [center[0]-Math.sin(a)*Game.BLOCK_SIZE, center[1]+Math.cos(a)*Game.BLOCK_SIZE];
		g.drawImage(
			image.puyo[this.types[1]-1],
			p[0] - Game.BLOCK_SIZE/2, p[1] - Game.BLOCK_SIZE/2,
			Game.BLOCK_SIZE, Game.BLOCK_SIZE);
	},

	// get index
	getIndex: function() {
		var p1 = [this.pos[0], this.pos[1]];
		var p2 = [this.pos[0] + ((this.rot-2)%2)*Game.BLOCK_SIZE, this.pos[1] + ((1-this.rot)%2)*Game.BLOCK_SIZE];

		return [ [p1[0]/Game.BLOCK_SIZE, 11-p1[1]/Game.BLOCK_SIZE],
				 [p2[0]/Game.BLOCK_SIZE, 11-p2[1]/Game.BLOCK_SIZE] ];
	},

};


/*-----------------------------------------------
 * CurrentPuyo Class
 *----------------------------------------------- */
function CurrentPuyo(types, obj) {

	PairPuyo.call(this, types, [Game.BLOCK_SIZE*2, -Game.BLOCK_SIZE], 2, obj);

	// timers
	this.fallTimer = 0;

}

CurrentPuyo.prototype = Object.create(PairPuyo.prototype);
CurrentPuyo.prototype.constructor = CurrentPuyo;

// Natural fall
CurrentPuyo.prototype.nFall = function() {
	if( this.fallTimer == 0 ) {
		this.fallTimer = Game.FALL_FRAMES;

		// fall
		var p;
		this.pos[1] += Game.BLOCK_SIZE;
		p = this.getIndex();
		if( this.game.field[0][p[0][0]][p[0][1]] != 0 || 
			this.game.field[0][p[1][0]][p[1][1]] != 0 ||
			p[0][1] < 0 || p[1][1] < 0 ) 
		{
			// fix
			this.pos[1] -= Game.BLOCK_SIZE;
			this.fix();
			return false;
		}
	} else {
		this.fallTimer --;
	}

	return true;
};

// Fix puyo
CurrentPuyo.prototype.fix = function() {
	var p = this.getIndex();

	// count fall blocks and fix
	for( var t=0; t<2; t++ ) {
		var fallBlocks = 0;
		for( var i=p[t][1]-1; i>=0; i-- ) {
			if( this.game.field[0][p[t][0]][i] != 0 ) {
				break;
			}
			fallBlocks ++;
		}

		// adjust fallBlocks
		if( this.rot == 0 && t == 0 ) {
			fallBlocks --;
		} else if( this.rot == 2 && t == 1 ) {
			fallBlocks --;
		}

		// fix
		var puyo = new Puyo(this.types[t], p[t], 0);
		if( fallBlocks == 0 ) {
			this.game.animeQueue.push(puyo);
			puyo.animate(true);
		} else {
			this.game.fallQueue.push(puyo);
			puyo.fall(fallBlocks);
		}
	}
};

// Rotate puyo
CurrentPuyo.prototype.rotate = function(d) {
	if( d != null ) {
		// rotate
		this.rot = (this.rot + d + 4) % 4;

		// set rotate speed
		if( d > 0 ) {
			this.rotateSpeed = Game.ROTATE_SPEED;
		} else {
			this.rotateSpeed = -Game.ROTATE_SPEED;
		}
		
		// check collision
		var p = this.getIndex();
		if( this.game.checkCollision(p[0]) || this.game.checkCollision(p[1]) ) {
			switch( this.rot ) {
			case 0:
				// move upward
				this.pos[1] = (10-p[0][1])*Game.BLOCK_SIZE;

				// reset natural fall timer
				this.fallTimer = Game.FALL_FRAMES;
				break;
			case 1:
			case 3:
				var sign = 2-this.rot;
			
				// move position
				this.pos[0] += sign*Game.BLOCK_SIZE;
				
				// check collision once more
				p = this.getIndex();
				if( this.game.checkCollision(p[0]) || this.game.checkCollision(p[1]) ) {
					// rotate once more
					this.pos[0] -= sign*Game.BLOCK_SIZE;
					this.rotate(d);
					return;
				}
				break;
			}
		}
	}

	// move angle
	if( this.angle != this.rot*90 ) {
		this.angle = (this.angle + this.rotateSpeed + 360) % 360;
	}
};

/*-----------------------------------------------
 * Puyo Class
 *----------------------------------------------- */
function Puyo(type, index, which) {

	this.type = type;
	this.pos = [index[0] * Game.BLOCK_SIZE, (11-index[1]) * Game.BLOCK_SIZE];
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
			this.pos[1] + Game.OJAMA_H + (this.animeFrame%4)*2,
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
				this.pos[1] += this.fallDistance;
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





