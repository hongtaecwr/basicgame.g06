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
	var sprite = this.add.sprite((this.game.width/2),(this.game.height/2),
			"Play");
	sprite.anchor.set(0.5,-1);
	sprite.inputEnabled = true;
	sprite.events.onInputDown.add(this.startGame, this);
	
	var sprite1 = this.add.sprite((this.game.width/2+530),(this.game.height/2+290),
	"credit");
	sprite1.anchor.set(0.5,-1);
	sprite1.inputEnabled = true;
	sprite1.events.onInputDown.add(this.startCredit, this);
	
	
};

Menu.prototype.startCredit = function() {
	this.game.state.start("Credit");
};

Menu.prototype.startGame = function() {
	this.game.state.start("Story");
};