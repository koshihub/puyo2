
var key = new (function() {

	this.keyQueue = new keyList();
	this.keyState = new keyList();

	function keyList() {
		this.z = false;
		this.x = false;
		this.u = false;
		this.d = false;
		this.l = false;
		this.r = false;
		
		this.reset = function() {
			this.z = false;
			this.x = false;
			this.u = false;
			this.d = false;
			this.l = false;
			this.r = false;
		};
	}

	this.keyActivate = function(code, act) {
		switch( code ) {
			case 37: // left
				if( !this.keyState.l ) this.keyQueue.l |= act;
				this.keyState.l = act;
			break;
			case 38: // up
				if( !this.keyState.u ) this.keyQueue.u |= act;
				this.keyState.u = act;
			break;
			case 39: // right
				if( !this.keyState.r ) this.keyQueue.r |= act;
				this.keyState.r = act;
			break;
			case 40: // down
				if( !this.keyState.d ) this.keyQueue.d |= act;
				this.keyState.d = act;
			break;
			case 90: // z
				if( !this.keyState.z ) this.keyQueue.z |= act;
				this.keyState.z = act;
			break;
			case 88: // x
				if( !this.keyState.x ) this.keyQueue.x |= act;
				this.keyState.x = act;
			break;
		}
	}
});

$('html').keydown( function(e) {
	key.keyActivate( e.which, true );
});

$('html').keyup( function(e) {
	key.keyActivate( e.which, false );
});
