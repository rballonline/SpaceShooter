Crafty.scene('Game', function () {
	for (i = 0; i < 5; i++) {
		Crafty.e('BigStar');
	}
	for (i = 0; i < 15; i++) {
		Crafty.e('SmallStar');
	}
	for (i = 0; i < 5; i++) {
		var m = Crafty.e('BigMeteor');
		m.ySpeed = Crafty.math.randomInt(3, 6);
		m.xSpeed = Crafty.math.randomInt(-2, 2);
		m.rSpeed = Crafty.math.randomInt(-5, 5);
	}
	for (i = 0; i < 10; i++) {
		var m = Crafty.e('SmallMeteor');
		m.ySpeed = Crafty.math.randomInt(3, 6);
		m.xSpeed = Crafty.math.randomInt(-2, 2);
		m.rSpeed = Crafty.math.randomInt(-5, 5);
	}
	Crafty.e('Ship');
	Crafty.e('StatusBar');
    //Play background music and repeat
    Crafty.audio.play("space",-1);
});