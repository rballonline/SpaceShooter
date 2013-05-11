/// <reference path="crafty.js" />
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

Crafty.c('Life', {
	init: function() {
		this.requires('Actor, spr_life')
				.attr({ z: 101 });
	}
});

Crafty.c('Lives', {
	init: function () {
		var lives = [];
		for (i = 0; i < Game.lives; i++) {
			var life = Crafty.e('Life')
				.at(Game.width - 120 + (i * 40), Game.height - 30);
			lives.push(life);
		}
		this.bind('ShipDeath', function () {
			lives[Game.lives - 1].destroy();
		});
	}
});

Crafty.c('StatusBarText', {
	init: function () {
		this.requires('Actor, Color, Text')
			.textFont({ size: '40px', type: 'italic', family: 'Consolas' })
			.textColor('#ffffff')
			.attr({ z: 101 });
	}
});

Crafty.c('DisplayText', {
	init: function() {
		this.requires('2D, DOM, Text, Tween')			
			.textFont({ size: '30px', type: 'normal', family: 'Consolas' })
			.textColor('#ffffff')
			.attr({ w: Game.width, h: 80, z: 101 })
			.css('text-align: center');		
	},
	at: function(y) {
		this.attr({y: y});
		return this;
	}
});

Crafty.c('StatusBar', {
	score: 0,
	init: function() {
		var statusBar = this;
		this.requires('Actor, Color')
			.attr({ x: 0, y: Game.height - 30, w: Game.width, h: 30, z: 100})
			.color('blue');2			
			
		var health = Crafty.e('StatusBarText')
			.at(20, Game.height - 5)
			.text('Health: 10')
			.bind('HealthChanged', function(shipHealth) {
				health.text('Health: ' + shipHealth);				
			});
			
		var score = Crafty.e('StatusBarText')
			.at(280, Game.height - 5)
			.text('Score: ' + this.score)
			.bind('ScoreChanged', function(scoreDelta) {
				statusBar.score += scoreDelta;
				score.text('Score: ' + statusBar.score);				
			});
		
		Crafty.e('Lives');
	}
	
});

Crafty.c('Meteor', {
	speed: 3,
	health: 5,
	xSpeed: 0,
	ySpeed: 0,
	rSpeed: 0,
	init: function() {
		rotation = Crafty.math.randomInt(0, 5);
		this.requires('Actor')
		.at(Crafty.math.randomInt(10, Game.width - 10), Crafty.math.randomInt(-50, -800))
		.bind('EnterFrame', function () {
			this.origin('center');
			this.rotation += this.rSpeed;
			this.y += this.ySpeed;
			this.x += this.xSpeed;
			if (this.y > Game.height || this.x < -60 || this.x > Game.width + 60 ) {
				this.attr({ x: Crafty.math.randomInt(10, Game.width - 10), y: -111 }); // put it back up at the top of the screen
			}
		})
		;
	},
	gotHit: function () {
		this.health -= 1;
		if (this.health < 1) {
			Crafty.e('RedShot').at(this.x, this.y);
			Crafty.audio.play('explosion');
			this.goBoom();
		}
		return this;
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
			m.rSpeed = Crafty.math.randomInt(-5, 5);
		}
		Crafty.trigger('ScoreChanged', 5);
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
		Crafty.trigger('ScoreChanged', 2);
		Crafty.trigger('MeteorDestoyed');
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
				this.attr({ x: Crafty.math.randomInt(10, Game.width - 10), y: -10 }); // put it back up at the top of the screen
			}
		});
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
	}
});

Crafty.c('Ship', {
	health: 10,
	vunerable: true,
	init: function () {
		var ship = this;
		this.requires('Actor, Fourway, Collision, Tween, SolidHitBox, spr_ship')
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
				if (ship.vunerable) {
					var meteor = ent[0].obj;
					meteor.gotHit();

					ship.health -= 1;
					Crafty.trigger('HealthChanged', ship.health);
					Crafty.trigger('ScoreChanged', -1);
					if (ship.health === 0) {
						Crafty.trigger('ShipDeath');
						Game.lives--;
						ship.destroy();
						Crafty.e('RedShot').at(ship.x, ship.y);
						Crafty.audio.play('explosion');
						
						if (Game.lives > 0) { // throw in a new ship
							var newShip = Crafty.e('Ship').attr({ y: Game.height + 100 }).tween({ y: Game.height - 120 }, 120);
							setInterval
							newShip.vunerable = false;
							setTimeout(function () { newShip.vunerable = true; }, 4000);
						}
						else {
							Crafty.scene('GameOver');
						}
					}
				}
			});
	}
});