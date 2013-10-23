
function Images() {
	
	// block image
	this.block = createImage("images/block.png");

	// puyo image
	this.puyo = new Array(4);
	for( var i=0; i<4; i++ ) {
		this.puyo[i] = createImage("images/puyo" + i + ".png");
	}

	function createImage(path) {
		var i = new Image();
		i.src = path;
		return i;
	}
}

var image = new Images();