/**
 * Menu state.
 */
function Credit() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Credit.prototype = proto;

Credit.prototype.preload = function() {
	this.load.pack("start", "assets/assets-pack.json");
};

Credit.prototype.create = function() {
		
	this.bg = this.game.add.sprite(0,0, "Creditbg");
	
	var sprite1 = this.add.sprite((this.game.width/2),(this.game.height/2+200),
	"back");
	sprite1.anchor.set(0.5,-1);
	sprite1.inputEnabled = true;
	sprite1.events.onInputDown.add(this.startMenu, this);
	
};

Credit.prototype.startMenu = function() {
	this.game.state.start("Menu");
};