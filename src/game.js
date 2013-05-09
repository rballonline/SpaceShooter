var Game = {
	width: 768,
	height: 768,
	start: function () {
		Crafty.init(Game.width, Game.height);
		Crafty.background('#000');
		Crafty.scene('Game');
	}
};