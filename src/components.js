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

Crafty.load(['assets/player.png', 'assets/Background/starBig.png', 'assets/Background/starSmall.png', 'assets/meteorBig.png', 'assets/meteorSmall.png', 'assets/laserRed.png', 'assets/laserRedShot.png'], function () {
	Crafty.sprite(99, 75, 'assets/player.png', { spr_ship: [0, 0] });
	Crafty.sprite(23, 21, 'assets/Background/starBig.png', { spr_bigstar: [0,0]});
	Crafty.sprite(11, 'assets/Background/starSmall.png', { spr_smallstar: [0, 0] });
	Crafty.sprite(136, 111, 'assets/meteorBig.png', { spr_bigmeteor: [0, 0] });
	Crafty.sprite(44, 42, 'assets/meteorSmall.png', { spr_smallmeteor: [0, 0] });
	Crafty.sprite(9, 33, 'assets/laserRed.png', { spr_laserred: [0, 0] });
	Crafty.sprite(56, 54, 'assets/laserRedShot.png', { spr_redshot: [0, 0] });
});

Crafty.c('Meteor', {
	speed: 3,
	health: 3,
	xSpeed: 0,
	ySpeed: 0,
	init: function() {
		rotation = Crafty.math.randomInt(0, 5);
		this.requires('Actor, Collision');
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
		this.health -= 0.5;
		if (this.health < 0.5) {
			Crafty.e('RedShot').at(this.x, this.y);
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
		this.health = 1;
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
	health: 5,
	init: function () {
		var ship = this;
		this.requires('Actor, Fourway, Collision, spr_ship')
			.fourway(8);
		this.attr({ x: Game.width / 2, y: Game.height - 120 });
		this.bind('KeyDown', function () {
			Crafty.e('LaserRed').at(ship.x, ship.y);
			Crafty.e('LaserRed').at(ship.x + 90, ship.y);
		});
	}
});