var xors = new function() {
	this.x = 123456789;
	this.y = 362436069;
	this.z = 521288629;
	this.w = 88675123;

	this.seed = function(s) {
		this.w = s;
	}

	this.rand = function(min, max) {
		var t = this.x ^ (this.x << 11);
		this.x = this.y;
		this.y = this.z;
		this.z = this.w;
		this.w = (this.w^(this.w>>19))^(t^(t>>8));
		return (this.w>>1)%(max-min+1)+min;
	}
};
