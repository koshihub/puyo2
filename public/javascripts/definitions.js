
/*
 * Dom
 */

Dom.LOBBY = 0;
Dom.BATTLE = 1;
Dom.FREEZE = 2;

/*
 * Game
 */

//----------------------------------------------
// sizes
//----------------------------------------------

// size of block
Game.BLOCK_SIZE = 32;

// size of field
Game.FIELD_W = Game.BLOCK_SIZE * 6;
Game.FIELD_H = Game.BLOCK_SIZE * 12;

// size of center space
Game.CENTER_W = 200;

// size of ojama area
Game.OJAMA_H = 72;

// size of canvas
Game.CANVAS_W = Game.FIELD_W * 2 + Game.CENTER_W;
Game.CANVAS_H = Game.FIELD_H + Game.OJAMA_H;

// next area position
Game.NEXT_X0 = Game.FIELD_W + Game.CENTER_W/4;
Game.NEXT_X1 = Game.FIELD_W + Game.CENTER_W/4*3 - Game.BLOCK_SIZE;
Game.NEXT_Y = Game.OJAMA_H + Game.BLOCK_SIZE;
Game.NEXTNEXT_X0 = Game.NEXT_X0 + Game.BLOCK_SIZE/2;
Game.NEXTNEXT_X1 = Game.NEXT_X1 - Game.BLOCK_SIZE/2;
Game.NEXTNEXT_Y = Game.NEXT_Y + Game.BLOCK_SIZE*2;


//----------------------------------------------
// values
//----------------------------------------------

// FPS
Game.FPS = 30;

// Gravity
Game.GRAVITY = 2;
Game.MAXSPEED = 8;

// Frames
Game.PUYOANIME_FRAMES = 12;	// animation Frames
Game.FALL_FRAMES = 1;	// natural fall frames