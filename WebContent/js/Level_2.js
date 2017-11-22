/**
 * Level state.
 */
function Level() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Level.prototype = proto;

Level.prototype.create = function() {
	this.map = this.game.add.tilemap("stage_2");
	this.map.addTilesetImage('graveyard');
	this.maplayer = this.map.createLayer("Tile Layer 2");
};


Level.prototype.quitGame = function() {
	this.game.state.start("Menu");
};