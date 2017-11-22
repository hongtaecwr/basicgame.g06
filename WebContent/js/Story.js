/**
 * Story state.
 */
function Story() {
	Phaser.State.call(this);
	// TODO: generated method.
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State.prototype);
Story.prototype = proto;
Story.prototype.constructor = Story;

var content = [
               "มีพ่อมดอยู่คนหนึ่ง เขาเป็นผู้นำของหมู่บ้านของเหล่าพ่อมดและแม่มดทั้งหลาย",
               "แต่แล้ววันหนึ่ง... ได้มีกองทัพสัตว์ประหลาดร้ายจะมายึดครองหมู่บ้านของเค้า และยากที่จะเอาชนะพวกมันได้",
               "แต่มีทางเดียวเท่านั้นคือ...",
               "พ่อมดต้องไปตามเก็บสะสมพลังให้ครบ 3 ดวงเท่านั้น จึงจะสามารถชนะพวกเหล่าสัตว์ประหลาดร้ายคิงส์โทรลได้ !!!",

           ];
//text
var text;
var index = 0;
var line = '';

//picture
var pictureA;
var pictureB;
var pictureC;
var timer;
var current = 3;

Story.prototype.preload = function() {
	this.load.pack("start", "assets/assets-pack.json");
	this.load.pack("level", "assets/assets-pack.json");
};

Story.prototype.create = function() {

	//picture
	pictureA = this.add.sprite(this.world.centerX, this.world.centerY, 'story1');
    pictureA.anchor.setTo(0.5, 0.5);
    
    pictureB = this.add.sprite(this.world.centerX, this.world.centerY, 'story2');
    pictureB.anchor.setTo(0.5, 0.5);
    pictureB.alpha = 0;
    
    timer = this.time.create(false);

    //  Set a TimerEvent to occur after 9 seconds
    timer.add(12000, this.fadePictures, this);
    timer.start();

	
	//text
	this.story = this.game.add.text(10, 650, '', { font: "25pt TH Sarabun New", fill: "#837397", stroke: "#000", strokeThickness: 15 });

    this.game.time.events.repeat(7000, content.length , this.nextLine, this);
    this.input.onDown.add(this.startGame, this);
};

Story.prototype.fadePictures = function() {

    //  Cross-fade the two pictures
    var tween;

    if (pictureA.alpha === 1)
    {
        tween = this.add.tween(pictureA).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
        this.add.tween(pictureB).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
        
    }
    else
    {
        this.add.tween(pictureA).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
        tween = this.add.tween(pictureB).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    }
    

    //  When the cross-fade is complete we swap the image being shown by the now hidden picture
    tween.onComplete.add(this.changePicture, this);

};

Story.prototype.changePicture = function() {

    if (pictureA.alpha === 0)
    {
        pictureA.loadTexture('story' + current);
    }
    else
    {
        pictureB.loadTexture('story' + current);
    }

    current++;

    if (current > 3)
    {
        current = 3;
    }

    //  And set a new TimerEvent to occur after 7 seconds
    timer.add(7000, this.fadePictures, this);

};


Story.prototype.nextLine = function() {

    this.story.text = '' + content[index];
    index++;
};

Story.prototype.update = function() {
	// TODO: generated method.
};

Story.prototype.startGame = function() { 
	this.game.state.start("Level");
};