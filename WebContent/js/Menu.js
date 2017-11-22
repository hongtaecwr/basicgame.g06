/**
 * Menu state.
 */
function Menu() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Menu.prototype = proto;

Menu.prototype.preload = function() {
	this.load.pack("start", "assets/assets-pack.json");
};

Menu.prototype.create = function() {
	
	this.music = this.add.sound("music",1,true);
	this.music.play(); 
	
	this.bg = this.game.add.sprite(0, 0, "Menu2");	
	var sprite = this.add.sprite(this.world.centerX, this.world.centerY,
			"Play");
	sprite.anchor.set(0.5,-1);
	this.input.onDown.add(this.startGame, this);
};

Menu.prototype.startGame = function() {
	this.game.state.start("Story");
};