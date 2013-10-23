
/*
 * Dom
 */

Dom.LOBBY = 0;
Dom.BATTLE = 1;


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

//----------------------------------------------
// values
//----------------------------------------------

// FPS
Game.FPS = 30;

// Gravity
Game.GRAVITY = 2;