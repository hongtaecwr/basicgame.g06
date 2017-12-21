/**
 * Level state.
 */
function Level_2() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Level_2.prototype = proto;
var count;

Level_2.prototype.create = function() {
	count =0;
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.arcade.gravity.y = 1000;
	
	this.bg = this.game.add.sprite(0, 0, "game_background_3. 2");
	this.bg.fixedToCamera = true;
	this.bg.width = this.game.width;
	this.bg.height = this.game.height;
	
	this.map = this.game.add.tilemap("stage_2");
	this.map.addTilesetImage('graveyard');
	this.maplayer = this.map.createLayer("Tile Layer 1");
	this.maplayer2 = this.map.createLayer("Tile Layer 2");
	
	this.shoot = this.add.audio("shoot2");
	this.shoot.allowMultiple = true;
	this.die = this.add.audio("die", 1, false);
	this.die.allowMultiple = true;
	
	// ปรับขนาด world ให้กว้าง เท่ากับ ขนาดของ map
	this.maplayer.resizeWorld();
	//this.mapBackgroundLayer.resizeWorld();
	this.map.setCollisionBetween(0,130,true,this.maplayer);
	// สร้าง group ของศัตรู
	this.enemies = this.add.group();
	this.diamond = this.add.group();
	this.goal = this.add.group();
	
	// load object layer
	for(x in this.map.objects.object){
	var obj = this.map.objects.object[x];
	if(obj.type == "player"){
		//console.log(this.player);
			this.player = this.addPlayer(obj.x,obj.y);
			this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
			//this.player.play("walk");
	}else if(obj.type=="enemy1"){
			var c = this.addEnemy1(obj.x,obj.y);
			this.enemies.add(c);
	}else if(obj.type=="enemy2"){
			var c = this.addEnemy2(obj.x,obj.y);
			this.enemies.add(c);
	}else if(obj.type=="goal"){
		var c = this.addgoal(obj.x, obj.y);
		this.goal.add(c);
		}
	else if(obj.type== "diamond"){
		var c = this.adddiamond(obj.x, obj.y);
		this.diamond.add(c);
	}
		}
	
	 this.player.body.bounce.y = 0.5;
	    this.player.body.gravity.y = 500;
	    this.player.body.gravity.x = 10;
	    this.player.body.velocity.x = 70;
	
	 score = 3;
		this.scoreText;
		scoreText = this.game.add.text(16, 16, 'Diamond : 3', {
		    fontSize: '50px',
		    fill: '#ed3465'
		  });
		
		scoreText.fixedToCamera = true;
		
		this.ui      = this.add.group();
		this.ui.fixedToCamera = true;
		
		this.input.keyboard.addKeyCapture([
		                                   Phaser.Keyboard.LEFT,
		                                   Phaser.Keyboard.RIGHT,
		                                   Phaser.Keyboard.SPACEBAR,
		                                   Phaser.Keyboard.X
		                           ]);
		
		this.createWeapon();
		this.player.inputEnabled = true;
		this.player.events.onInputDown.add(this.fireWeapon, this); 
		 
		this.player.maxHealth = 6;
		this.player.setHealth(3);
		//this.game.time.events.add(Phaser.Timer.SECOND * 60, this.onPlayerKilled, this);
		this.player.events.onKilled.addOnce(this.onPlayerKilled,this);
		this.player.canhit = true;
		
		this.heart = [];
		 for(var i=0;i<3;i++){
			 this.heart[i] = this.add.sprite(1000-(60*i),5,"live");
			 this.heart[i].scale.set(0.6);
			 this.heart[i].fixedToCamera = true;
		 } 
	
};

Level_2.prototype.update = function() {
	this.game.physics.arcade.collide(this.player,this.maplayer);
	this.game.physics.arcade.collide(this.enemies,this.maplayer);
	this.game.physics.arcade.collide(this.diamond, this.maplayer);
	this.game.physics.arcade.collide(this.goal, this.maplayer);
	this.game.physics.arcade.collide(this.player,this.diamond, this.putdiamond,null,this);
	this.game.physics.arcade.collide(this.player,this.goal, this.win,null,this);
	
	if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
    	 this.player.scale.x=-0.3;
		 this.player.body.velocity.x = -150;
		 this.weapon1.fireAngle = 180;
		 this.weapon1.trackSprite(this.player,-80,10);
	}
    else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
    	 this.player.scale.x=0.3;
		 this.player.body.velocity.x = 150;	
		 this.weapon1.fireAngle = 360;
		 this.weapon1.trackSprite(this.player,100,10);
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
    if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
    	this.player.play("run");
    	this.fireWeapon();
	}
    
  this.physics.arcade.collide(this.enemies,this.weapon1.bullets,this.onCollide,null,this);
	
	if(this.player.canhit){
		//this.player.play("die");
		this.game.physics.arcade.collide(this.player,this.enemies, this.onPlayerCollide,null,this);
		this.player.canhit = false;
	}
	
	if(this.physics.arcade.collide(this.player,this.enemies,this.onPlayerCollide,null,this)){
		 count++;
		 console.log(count);
	 }
	
	//Enemy Follow Player
	this.playerx = this.player.x;
	this.playery = this.player.y;
	
	 this.enemies.forEachAlive(function(a){
		 if(this.playerx > a.x-500 && this.playerx < a.x && this.playery == a.y){
			 a.x-=2;
			 a.scale.x = -0.2;
		 } else if(this.playerx > a.x && this.playerx < a.x+500 && this.playery == a.y){
			 a.x+=2;
			 a.scale.x = 0.2;
		 }	 		 		 
	 },this);
};

Level_2.prototype.addPlayer = function(x, y) {
	var t = this.add.sprite(x, y, "wizard");
	t.animations.add("idle", mframe("Idle", 5), 12, true);
	t.animations.add("attack", mframe("Attack", 5), 12, true);
	t.animations.add("die", mframe("Die", 4), 12, false);
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

Level_2.prototype.addEnemy1 = function(x, y) {
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
		//c.body.setSize(32, 32, 250, 420);
		return c;
		};
		
Level_2.prototype.addEnemy2 = function(x, y) {
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
		c.scale.set(0.2);
		this.game.physics.enable(c);
		c.body.collideWorldBounds = true;
		//c.body.setSize(32, 32, 250, 420);
		c.maxHealth = 9;
		c.setHealth(c.maxHealth);
		return c;
		};
		
		Level_2.prototype.addgoal = function(x, y) {
			k = this.add.sprite(x, y, "doorOpen_top");
			k.anchor.set(0, 0.9);
			//k.scale.x = 0.25;
			//k.scale.y = 0.25;
			
			this.game.physics.enable(k);
			k.body.collideWorldBounds = true;
			//k.body.setSize(32, 32, 250, 420);
			return k;
		};
		
		Level_2.prototype.createWeapon = function() {
			this.weapon1 = this.add.weapon(1,"pow",1);
			this.weapon1.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
			this.weapon1.trackSprite(this.player,100,10);
			this.weapon1.bulletSpeed = 800;	
			this.weapon1.bulletAngleOffset = 90;
			this.weapon1.fireAngle = 360;
			this.weapon1.rate = 5;
			this.weapon1.bulletGravity.y = -1000;
			
			};
			Level_2.prototype.fireWeapon = function(){
				if(this.weapon1.fire() !=null){
					
					this.shoot.play();
				}
				
				};
		
////////////////////////////////////////////////////////////////////

Level_2.prototype.onCollide = function(alien,bullet){
	bullet.kill();
	alien.play("walk");
	//alien.scale.x = -0.2;
					//this.boom.play();
					//this.game.score++;
					//this.scoreText.text = this.game.score;
					//exp = this.add.sprite(alien.x, alien.y, "download");
					 //exp.anchor.set(0.5);
					 //exp.animations.add("all",null,12,false).play().killOnComplete=true; 
	alien.damage(3);
	if (alien.health <= 3) {
		this.die.play();
		alien.isDie = true;

		alien.play("die", 12, false, true);
	}

};
				
Level_2.prototype.onPlayerKilled = function(){
	this.gameover=true;
	lose = this.add.sprite(this.game.width/2, this.game.height/2,"lose");
	lose.fixedToCamera = true;
	lose.anchor.set(0.5,0.5);
	lose.scale.set(0.1);
	tw = this.add.tween(lose.scale);
	tw.to({x:1,y:1},1000, "Linear",true,0);
	delay = this.add.tween(lose);
	delay.to({y:-360},1000, "Linear",true,4000);
	tw.chain(delay);
	delay.onComplete.addOnce(this.quitGame, this);
	
};	

Level_2.prototype.onPlayerCollide = function(player,enemies){
	player.damage(1);
	player.canhit = false;
	player.alpha = 0.1;
	var tw = this.add.tween(player);
	tw.to({alpha:1},200, "Linear",true,0,5);
	tw.onComplete.addOnce(function(){this.alpha=1;this.canhit=true;}, player);
	//enemies.kill();
	console.log("Player kill "+ count);
	if(count==0)
		this.heart[2].kill();
	else if(count==1)
		this.heart[1].kill();
	else if(count==2)
		this.heart[0].kill();
	//return true;
	
	};
			
Level_2.prototype.adddiamond = function(x, y) {
				k = this.add.sprite(x, y, "diamond");
				k.anchor.set(0, 0.9);
				k.scale.x = 0.2;
				k.scale.y = 0.2;
				
				this.game.physics.enable(k);
				k.body.collideWorldBounds = true;
				return k;
			};
			
Level_2.prototype.putdiamond = function(player, diamond) {

			    // Removes the star from the screen
				diamond.kill();

			    //  Add and update the score
			    score += 1;
			    scoreText.text = 'Diamond: ' + score;

};
Level_2.prototype.win = function(player,Goal){
				//player.kill();
		if(score>=6){
			this.game.state.start("Level_3");
			}
				
};

Level_2.prototype.quitGame = function() {
	this.game.state.start("Menu");
};