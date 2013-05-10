var Game = {
	/* Setup globals */
	width: 768,
	height: 768,
	lives: 0,
	level: 0,
	start: function () {
		Crafty.init(Game.width, Game.height);
		Crafty.background('#000');
		Crafty.scene('Loading');
	}
};