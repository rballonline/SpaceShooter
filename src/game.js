var Game = {
	/* Setup globals */
	width: 768,
	height: 768,
	lives: 3,
	level: -1,
	levels: [
		{
			name: 'simple beginnings, yup',
			big: 0,
			small: 10,
			swirlies: [],
			shooters: [],
			powerUps: [],
			music: 'space'
		},
		{
			name: 'big dudes, they break apart!',
			big: 4,
			small: 0,
			swirlies: [],
			shooters: [],
			powerUps: [],
			music: 'space'
		},
		{
			name: 'a nice mix of pebbles',
			big: 2,
			small: 15,
			swirlies: [],
			shooters: [],
			powerUps: [],
			music: 'space'
		},
		{
			name: 'reeeoooowwwrrr',
			big: 4,
			small: 25,
			swirlies: [],
			shooters: [],
			powerUps: [],
			music: 'space'
		}
	],
	start: function () {
		Crafty.init(Game.width, Game.height);
		Crafty.background('#000');
		Crafty.scene('Loading');
	},
	newGame: function() {
		Game.lives = 1;
		Game.level = -1;
		Crafty.scene('Game');
	}
};