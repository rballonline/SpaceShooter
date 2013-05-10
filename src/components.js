Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas');
  },
  at: function (x, y) {
  	this.x = x;
  	this.y = y;
  	return this;
  }
});

Crafty.load(['assets/player.png', 'assets/Background/starBig.png', 'assets/Background/starSmall.png', 'assets/meteorBig.png', 'assets/meteorSmall.png', 'assets/laserRed.png', 'assets/laserRedShot.png', 'assets/Sounds/laser1.mp3', 'assets/Sounds/laser1.wav', 'assets/Sounds/laser1.ogg', 'assets/sounds/explode1.wav',	'assets/sounds/explode1.mp3', 'assets/sounds/explode1.ogg', "assets/music/through-space.mp3", "assets/music/through-space.ogg"], function () {
	Crafty.sprite(99, 75, 'assets/player.png', { spr_ship: [0, 0] });
	Crafty.sprite(23, 21, 'assets/Background/starBig.png', { spr_bigstar: [0,0]});
	Crafty.sprite(11, 'assets/Background/starSmall.png', { spr_smallstar: [0, 0] });
	Crafty.sprite(136, 111, 'assets/meteorBig.png', { spr_bigmeteor: [0, 0] });
	Crafty.sprite(44, 42, 'assets/meteorSmall.png', { spr_smallmeteor: [0, 0] });
	Crafty.sprite(9, 33, 'assets/laserRed.png', { spr_laserred: [0, 0] });
	Crafty.sprite(56, 54, 'assets/laserRedShot.png', { spr_redshot: [0, 0] });
});

Crafty.audio.add({
	shoot: ["assets/sounds/laser1.wav",
			"assets/sounds/laser1.mp3",
			"assets/sounds/laser1.ogg"],
	explosion: ["assets/sounds/explode1.wav",
			"assets/sounds/explode1.mp3",
			"assets/sounds/explode1.ogg"],
	space: [
		"assets/music/through-space.mp3",
		"assets/music/through-space.ogg"]
});

Crafty.c('TextElement', {
	init: function() {
		this.requires('Actor, Color, Text')
			.textFont({size:'50px', type: 'italic', family: 'Arial' })
			.textColor('#ffffff')
			.attr({z: 101});
			
	}
});

Crafty.c('StatusBar', {
	init: function() {
		this.requires('Actor, Color')
			.attr({ x: 0, y: Game.height - 30, w: Game.width, h: 30, z: 100})
			.color('blue');2			
			
		var health = Crafty.e('TextElement')
			.at(50, Game.height - 10)
			.text('Health: 10')
			.bind('HealthChanged', function(shipHealth) {
				health.text('Health: ' + shipHealth);				
			});
		
	}
	
});

Crafty.c('Meteor', {
	speed: 3,
	health: 5,
	xSpeed: 0,
	ySpeed: 0,
	init: function() {
		rotation = Crafty.math.randomInt(0, 5);
		this.requires('Actor');
		this.attr({ x: Crafty.math.randomInt(10, Game.width - 10), y: Crafty.math.randomInt(-50, -800) });
		this.bind('EnterFrame', function () {
			this.origin('center');
			this.rotation += rotation;
			this.y += this.ySpeed;
			this.x += this.xSpeed;
			if (this.y > Game.height) {
				this.reset();
			}
		});
	},
	reset: function () {
		this.attr({ x: Crafty.math.randomInt(10, Game.width - 10), y: -10 });
	},
	gotHit: function () {
		this.health -= 1;
		if (this.health < 1) {
			Crafty.e('RedShot').at(this.x, this.y);
			Crafty.audio.play('explosion');
			this.goBoom();
		}
	}
});

Crafty.c('BigMeteor', {
	init: function () {
		this.requires('Meteor, spr_bigmeteor');
	},
	goBoom: function () {
		for (i = 0; i < 2; i++) {
			var m = Crafty.e('SmallMeteor').at(this.x, this.y);
			m.ySpeed = Crafty.math.randomInt(3, 6);
			m.xSpeed = Crafty.math.randomInt(-2, 2);
		}
		this.destroy();
	}
});

Crafty.c('SmallMeteor', {
	init: function () {
		this.requires('Meteor, spr_smallmeteor');
		this.health = 2;
		this.speed = 5;
	},
	goBoom: function () {
		this.destroy();
	}
});

Crafty.c('RedShot', {
	init: function () {
		var shot = this;
		this.requires('Actor, Tween, spr_redshot')
			.tween({ h: 0, w: 0, y: 260, x: 45, alpha: 0 }, 30);
		setTimeout(function () {
			shot.destroy();
		}, 500);
	}
});

Crafty.c('Star', {
	speed: 5,
	init: function () {
		this.requires('Actor');
		this.attr({ x: Crafty.math.randomInt(10, Game.width - 10), y: Crafty.math.randomInt(0, Game.height) });
		this.bind('EnterFrame', function () {
			this.y += this.speed;
			if (this.y > Game.height) {
				this.reset();
			}
		});
	},
	reset: function () {
		this.attr({ x: Crafty.math.randomInt(10, Game.width - 10), y: -10 });
	}
});

Crafty.c('BigStar', {
	init: function () {
		this.requires('Star, spr_bigstar');
	}
});

Crafty.c('SmallStar', {
	init: function () {
		this.requires('Star, spr_smallstar');
		this.speed = 3;
	}
});

Crafty.c('LaserRed', {
	speed: 15,
	init: function () {
		var laser = this;
		this.requires('Actor, Collision, spr_laserred');
		this.bind('EnterFrame', function () {
			this.y -= this.speed;
			if (this.y < -33) {
				this.destroy();
			}
		});
		this.onHit('Meteor', function (ent) {
			var meteor = ent[0].obj;
			laser.destroy();
			meteor.gotHit();
		});
	},
	at: function (x, y) {
		this.attr({ x: x, y: y });
	}
});

Crafty.c('Ship', {
	health: 10,
	init: function () {
		var ship = this;
		this.requires('Actor, Fourway, Collision, spr_ship')
			.fourway(8)
			.attr({ x: Game.width / 2, y: Game.height - 120, z: 100 })
			.bind('KeyDown', function (e) {
				if(e.keyCode === 32) {
					Crafty.audio.play('shoot');
					Crafty.e('LaserRed').at(ship.x, ship.y);
					Crafty.e('LaserRed').at(ship.x + 90, ship.y);
				}
			})
			.bind('Moved', function(from) {
				// Don't allow to move the player out of Screen
				if(this.x+this.w > Crafty.viewport.width || this.x+this.w < this.w || this.y+this.h < this.h || this.y+this.h+30 > Crafty.viewport.height || this.preparing){
					this.attr({
						x:from.x, 
						y:from.y
					});
				}
			})
			.onHit('Meteor', function (ent) {
				var meteor = ent[0].obj;
				ship.health -= 1;
				Crafty.trigger('HealthChanged', ship.health);
				meteor.gotHit();
				if(ship.health === 0) {
					ship.destroy();
					Crafty.e('RedShot').at(ship.x, ship.y);
					Crafty.audio.play('explosion');
				}				
			});
	}
});