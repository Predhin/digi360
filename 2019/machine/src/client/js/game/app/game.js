import { Background } from './background.js';
import { Player } from './player.js';
import { Opponent } from './opponent.js';
import { Ball } from './ball.js';

export const NUM_OF_PLAYERS = 1;
export const DIFFICULTY_LEVEL = 3;


export class Game {
	constructor(canvas_id) {
		this.fps = 10; // Frames per second; limits the loop speed

		this.canvas = document.getElementById(canvas_id);
		this.context = this.canvas.getContext("2d");
		this.client = { width: this.canvas.width, height: this.canvas.height };
		this.number_of_players = NUM_OF_PLAYERS;
		this.difficulty = DIFFICULTY_LEVEL;
		this.state = "start";

		// Controls
		this.keysPressed =
			{
				"left": false,
				"up": false,
				"right": false,
				"down": false,
				"paused": false
			};
		//import background			
		this.background = new Background(this);

		this.refreshInterval = setInterval(() => {
			this.update();
			this.draw();
		}, this.fps);
		this.initEventHandlers();
	}

	initEventHandlers() {
		document.onkeydown = (event) => {
			var keyCode;

			if (event == null) {
				keyCode = window.event.keyCode;
			} else {
				keyCode = event.keyCode;
			}


			switch (keyCode) {
				case 38:
					this.keysPressed.up = true;
					break;
				case 40:
					this.keysPressed.down = true;
					break;
				case 87:
					this.keysPressed.p2_up = true;
					break;
				case 83:
					this.keysPressed.p2_down = true;
					break;
				case 80:
				case 32:
				case 27:
					this.keysPressed.paused = (this.keysPressed.paused == false) ? true : false;
					break;
			}
		}

		document.onkeyup = (event) => {
			var keyCode;

			if (event == null) {
				keyCode = window.event.keyCode;
			} else {
				keyCode = event.keyCode;
			}

			switch (keyCode) {
				case 38:
					this.keysPressed.up = false;
					break;
				case 40:
					this.keysPressed.down = false;
					break;
				case 87:
					this.keysPressed.p2_up = false;
					break;
				case 83:
					this.keysPressed.p2_down = false;
					break;
			}
		}
	}

	__toString() {
		return "Game";
	}
	update() {
		var timestamp = new Date().getTime();

		this.background.update(timestamp);
		if (this.state == "play") {
			// player update is done via handtracking
			//this.player.update(timestamp);
			this.opponent.update(timestamp);
			this.ball.update(timestamp);
		}
	}

	draw() {
		if (this.state == "play") {
			if (!this.keysPressed.paused) {
				this.background.draw();
				this.player.draw();
				this.opponent.draw();
				this.ball.draw();
			}
			else {
				this.context.fillStyle = '#FF0000';
				this.context.font = 'bold 80px sans-serif';
				this.context.textBaseline = 'middle';
				this.context.textAlign = 'center';			
				/* Uncomment for debugging pupose only
				this.background.draw();
				this.player.draw();
				this.opponent.draw();
				this.ball.draw();*/
				this.context.fillText("Paused", this.client.width / 2, this.client.height / 2);

			}
		}
		else if (this.state == "start") {
			this.background.draw();
		}
	}

	drawRectangle(color, x, y, width, height) {
		this.context.fillStyle = color;
		this.context.fillRect(x, y, width, height);
	}

	start() {
		// Add Game Objects
		//import Player
		this.player = new Player(this);

		// Add opponent (2 player optional)
		if (this.number_of_players == 2) {
			this.opponent = new Player(this);
			this.opponent.keyset = "player_2";
			this.opponent.default_position = { x: 10, y: (this.client.height / 2) - (this.opponent.paddle.height / 2) }
			this.opponent.paddle.position = this.opponent.default_position;
		}
		else {
			//import Opponent
			this.opponent = new Opponent(this);
			this.opponent.difficulty = this.difficulty;
		}

		// Add the ball
		//import Ball
		this.ball = new Ball(this);

		this.state = "play";
	}

	restart() {
		this.player.score = 0;
		this.opponent.score = 0;
		this.resetLevel();
	}

	resetLevel() {
		this.keysPressed.left = false;
		this.keysPressed.right = false;
		this.keysPressed.up = false;
		this.keysPressed.down = false;
		this.keysPressed.paused = false;
		this.state = "play";

		this.opponent.resetLevel();
		this.player.resetLevel();
		this.ball.resetLevel();
	}
}