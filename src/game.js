var Game = {
	/* Setup globals */
	width: 768,
	height: 768,
	lives: 0,
	level: 0,
	levels: [
		{
			name: 'clear some rocks',
			big: 3,
			small: 10,
			swirly: 0,
			powerUps: 1,
			music: 'space'
		},
		{
			name: 'big dudes',
			big: 8,
			small: 0,
			swirly: 0,
			powerUps: 1,
			music: 'space'
		}
	],
	start: function () {
		Crafty.init(Game.width, Game.height);
		Crafty.background('#000');
		Crafty.scene('Loading');
	}
};