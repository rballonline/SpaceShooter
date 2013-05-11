/// <reference path="crafty.js" />
Crafty.scene('Loading', function () {
	Crafty.e('Actor, Text').attr({
		w: Game.width,
		h: 20,
		x: Game.width / 2,
		y: 120
	}).text('Loading');

	Crafty.load(['assets/player.png', 'assets/Background/starBig.png', 'assets/Background/starSmall.png', 'assets/meteorBig.png', 'assets/meteorSmall.png', 'assets/laserRed.png', 'assets/laserRedShot.png', 'assets/Sounds/laser1.mp3', 'assets/Sounds/laser1.wav', 'assets/Sounds/laser1.ogg', 'assets/sounds/explode1.wav', 'assets/sounds/explode1.mp3', 'assets/sounds/explode1.ogg', 'assets/music/through-space.mp3', 'assets/music/through-space.ogg', 'assets/life.png'], function () {
		Crafty.sprite(99, 75, 'assets/player.png', { spr_ship: [0, 0] });
		Crafty.sprite(23, 21, 'assets/Background/starBig.png', { spr_bigstar: [0, 0] });
		Crafty.sprite(11, 'assets/Background/starSmall.png', { spr_smallstar: [0, 0] });
		Crafty.sprite(136, 111, 'assets/meteorBig.png', { spr_bigmeteor: [0, 0] });
		Crafty.sprite(44, 42, 'assets/meteorSmall.png', { spr_smallmeteor: [0, 0] });
		Crafty.sprite(9, 33, 'assets/laserRed.png', { spr_laserred: [0, 0] });
		Crafty.sprite(56, 54, 'assets/laserRedShot.png', { spr_redshot: [0, 0] });
		Crafty.sprite(35, 27, 'assets/life.png', { spr_life: [0, 0] });

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

		Game.newGame();
	});
});

Crafty.scene('Game', function () {
	function makeLevel() {
		Game.level++;
		var level = Game.levels[Game.level];
		Crafty.e('DisplayText')
			.at((Game.height/2)-20)
			.text(level.name)
			.tween({alpha: 0}, 90)
			.bind('TweenEnd', function() {
				this.destroy();
			});
			
		setTimeout(function() {
			for (i = 0; i < level.big; i++) {
				var m = Crafty.e('BigMeteor');
				m.ySpeed = Crafty.math.randomInt(3, 6);
				m.xSpeed = Crafty.math.randomInt(-2, 2);
				m.rSpeed = Crafty.math.randomInt(-5, 5);
			}
			for (i = 0; i < level.small; i++) {
				var m = Crafty.e('SmallMeteor');
				m.ySpeed = Crafty.math.randomInt(3, 6);
				m.xSpeed = Crafty.math.randomInt(-2, 2);
				m.rSpeed = Crafty.math.randomInt(-5, 5);
			}
		}, 3000);
	}
	
	for (i = 0; i < 8; i++) {
		Crafty.e('BigStar');
	}
	for (i = 0; i < 25; i++) {
		Crafty.e('SmallStar');
	}
	makeLevel();
	this.bind('MeteorDestoyed', function() {
		console.log(Crafty('Meteor').length);
		if(Crafty('Meteor').length === 0) { // Level complete
			makeLevel();
		}
	});
	Crafty.audio.play("space",-1); //Play background music and repeat
	Crafty.e('Ship');
	Crafty.e('StatusBar');	
});

Crafty.scene('GameOver', function () {
	Crafty.e('DisplayText').at(120).text('Oh nos! Game over!<br />Press key to try again').bind('KeyDown', function () {
		Game.newGame();
	});
});