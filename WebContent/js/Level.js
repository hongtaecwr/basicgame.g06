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
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.arcade.gravity.y = 1000;
	
	this.bg = this.game.add.sprite(0, 0, "game_background_4");
	this.bg.fixedToCamera = true;
	this.bg.width = this.game.width;
	this.bg.height = this.game.height;
	
	this.map = this.game.add.tilemap("stage_1");
	this.map.addTilesetImage('winter');
	this.maplayer = this.map.createLayer("Tile Layer 1");
	this.maplayer2 = this.map.createLayer("Tile Layer 2");
	
	// ปรับขนาด world ให้กว้าง เท่ากับ ขนาดของ map
	this.maplayer.resizeWorld();
	//this.mapBackgroundLayer.resizeWorld();
	this.map.setCollisionBetween(0,130,true,this.maplayer);
	// สร้าง group ของศัตรู
	this.enemies = this.add.group();
	this.diamond = this.add.group();
	
	// load object layer
	for(x in this.map.objects.object){
	var obj = this.map.objects.object[x];
	if(obj.type == "player"){
		//console.log(this.player);
			this.player = this.addPlayer(obj.x,obj.y);
			this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
			this.player.play("walk");
	}else if(obj.type=="enemy1"){
			var c = this.addEnemy1(obj.x,obj.y);
			this.enemies.add(c);
	}else if(obj.type=="enemy2"){
			var c = this.addEnemy2(obj.x,obj.y);
			this.enemies.add(c);
	}else if(obj.type=="goal"){
		// เพิ่ม sprite goal
		// this.goal = this.addGoal(obj.x,obj.y);
		}
	else if(obj.type== "diamond"){
		var c = this.adddiamond(obj.x, obj.y);
		this.diamond.add(c);
	}
		}
	//Set some physics on the sprite
   this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 500;
    this.player.body.gravity.x = 10;
    this.player.body.velocity.x = 70;
    
    this.game.score = 0;
	this.scoreText;
	this.scoreText = this.game.add.text(16, 16, 'Diamond : ' + this.game.score, {
	    fontSize: '50px',
	    fill: '#ed3465'
	  });
this.scoreText.fixedToCamera = true;
	
	//this.actors  = this.add.group();
	//this.coin	 = this.add.group();
	//this.enemy   = this.add.group();
	this.goal    = this.add.group();
	this.ui      = this.add.group();
	this.ui.fixedToCamera = true;
	
	this.player.canhit = true;
};

Level.prototype.update = function() {
	this.game.physics.arcade.collide(this.player,this.maplayer);
	this.game.physics.arcade.collide(this.enemies,this.maplayer);
	this.game.physics.arcade.collide(this.diamond, this.maplayer);
	this.game.physics.arcade.collide(this.player,this.enemies, this.onCollide);
	this.game.physics.arcade.collide(this.player,this.diamond, this.putdiamond);
	
	if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
    	 this.player.scale.x=-0.3;
		 this.player.body.velocity.x = -150;		 
	}
    else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
    	 this.player.scale.x=0.3;
		 this.player.body.velocity.x = 150;		 
	}
    else if (this.input.keyboard.isDown(Phaser.Keyboard.UP) && this.player.body.onFloor() )
    {
    	 this.player.body.velocity.y = -900;
	}
    
	if(this.player.body.onFloor())
	{
		if(this.player.body.velocity.x>0)
		{
			this.player.play("walk");
		}else if(this.player.body.velocity.x<0)
		{
			this.player.play("walk");
		}else
		{
			this.player.play("idle");
		}
	}else
	{
		this.player.play("jump");
	}
    if(this.input.keyboard.isDown(Phaser.Keyboard.UP) && this.player.body.onFloor())
    {
   	 	this.player.body.velocity.y = -900;
	}
};

function gframes(key,n){
		var f=[ ];
		for(var i=0;i<=n;i++){
		var kf=key+"_"+(("00" + i).slice (-3));
		f.push(kf);
		}
		return f;
};

Level.prototype.addPlayer = function(x, y) {
	var t = this.add.sprite(x, y, "wizard");
	t.animations.add("idle", mframe("Idle", 5), 12, true);
	t.animations.add("attack", mframe("Attack", 5), 12, true);
	t.animations.add("die", mframe("Die", 4), 12, true);
	t.animations.add("hurt", mframe("Hurt", 6), 12, true);
	t.animations.add("jump", mframe("Jump", 6), 12, true);
	t.animations.add("run", mframe("Run", 6), 12, true);
	t.animations.add("walk", mframe("Walk", 5), 12, true);
	t.anchor.set(0,0.1);
	t.scale.set(0.3);
	t.smoothed = false;
	this.game.physics.arcade.enable(t);
	t.play("idle");
	this.game.physics.enable(t);
	t.body.collideWorldBounds = true;
	t.body.drag.setTo(500, 0);
	t.body.setSize(32, 32, 250, 300);
	return t;
	
};
function mframe(key,n){
		f=[ ];
		for(var i=1;i<n;i++){
		f.push(key+" ("+i+")");
		}
		return f;
}


function mframe(key,n){
		f=[ ];
		for(var i=1;i<n;i++){
		f.push(key+" ("+i+")");
		}
		return f;
}
	

Level.prototype.addEnemy1 = function(x, y) {
		c = this.add.sprite(x,y, "enemy1");
		//c.scale.set(0.4);
		c.animations.add("attack", mframe("Attack",7), 12, true);
		c.animations.add("die", mframe("Die",7), 12, true);
		c.animations.add("hurt", mframe("Hurt",7), 12, true);
		c.animations.add("idle", mframe("Idle",7), 12, true);
		c.animations.add("jump", mframe("Jump",7), 12, true);
		c.animations.add("run", mframe("Run",7), 12, true);
		c.animations.add("walk", mframe("Walk",7), 12, true);
		c.play("idle");
		c.anchor.set(0,0.9);
		c.scale.set(0.2);
		this.game.physics.enable(c);
		c.body.collideWorldBounds = true;
		c.body.setSize(32, 32, 250, 420);
		return c;
		};
		
Level.prototype.addEnemy2 = function(x, y) {
		c = this.add.sprite(x,y, "enemy2");
		//c.scale.set(0.4);
		c.animations.add("attack", mframe("Attack",7), 12, true);
		c.animations.add("die", mframe("Die",7), 12, true);
		c.animations.add("hurt", mframe("Hurt",7), 12, true);
		c.animations.add("idle", mframe("Idle",7), 12, true);
		c.animations.add("jump", mframe("Jump",7), 12, true);
		c.animations.add("run", mframe("Run",7), 12, true);
		c.animations.add("walk", mframe("Walk",7), 12, true);
		c.play("idle");
		c.anchor.set(0,0.9);
		this.game.physics.enable(c);
		c.body.collideWorldBounds = true;
		c.body.setSize(32, 32, 250, 420);
		return c;
		};
		
		
////////////////////////////////////////////////////////////////////
Level.prototype.onCollide = function(player,enemies){
			enemies.play("hurt");
			//enemies.kill();
};		

	Level.prototype.putdiamond = function(player,diamond){
		diamond.kill();
	};
			
Level.prototype.adddiamond = function(x, y) {
				k = this.add.sprite(x, y, "diamond");
				k.anchor.set(0, 0.9);
				k.scale.x = 0.2;
				k.scale.y = 0.2;
				
				this.game.physics.enable(k);
				k.body.collideWorldBounds = true;
				k.body.setSize(32, 32, 250, 420);
				return k;
			};
			
Level.prototype.onCoinCollect = function(c,player){
				c.destroy();
				this.game.score += 10;
				this.scoreText.text = 'Diamond : ' + this.game.score;
				
			};

			

Level.prototype.onPlayerCollide = function(e,player){
			player.canhit = false;
			player.alpha = 0.1;
			var tw = this.add.tween(player);
			tw.to({alpha:1},200, "Linear",true,0,5);
			tw.onComplete.addOnce(function(){this.alpha=1;this.canhit=true;}, player);
				
			if(this.game.score > 0){
			this.game.score -= 10;
			this.scoreText.text = 'Diamond : ' + this.game.score;
				
			}else if (this.game.score == 0){
				this.quitGame();
			}
				
				return true;
			};

Level.prototype.quitGame = function() {
	this.game.state.start("Menu");
};