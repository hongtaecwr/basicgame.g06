/**
 * Prelevel state.
 */
function Prelevel() {
	Phaser.State.call(this);
}

function preload() {

    game.add.text(100, 100, "Loading videos ...", { font: "65px Arial", fill: "#ff0044" });

    game.load.video('space', 'assets/video/intro.mp4');

}

var video;

function create() {

    video = game.add.video('space');

    video.play(true);

    //  x, y, anchor x, anchor y, scale x, scale y
    video.addToWorld();

    
}
Prelevel.prototype.startGame = function() {
	this.input.onDown.active = false;
	var tw = this.add.tween(this.player);
	this.player.play("Walk");
	tw.to({
		x : 650
	}, 2000, "Linear", true);
	tw.onComplete.addOnce(this.startPrelevel, this);
};

Prelevel.prototype.startPrelevel = function() {
	this.game.state.start("Level1");
};