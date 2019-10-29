import { Paddle } from './paddle.js';

export class Player {

	constructor(game) {
		this.game = game;
		//import Paddle
		this.paddle = new Paddle(this);
		this.updateTime = new Date().getTime();
		this.keyset = "player_1";

		// Setup the paddle
		// Position the player at the bottom of the screen in the center
		this.default_position = { x: this.game.client.width - (this.paddle.width + 10), y: (this.game.client.height / 2) - (this.paddle.height / 2) };
		this.paddle.position = { x: this.default_position.x, y: this.default_position.y };

		this.score = 0;
	}

	__toString() {
		return "Player";
	}

	//This is not used as update is done via Handtracking
	update(currentTime) {
		if (!this.game.keysPressed.paused) {
			var elapsedTime = currentTime - this.updateTime;

			if (this.keyset == "player_1") {
				if (this.game.keysPressed.up) {
					this.paddle.velocity.y = -800;
				}
				else if (this.game.keysPressed.down) {
					this.paddle.velocity.y = 800;
				}
				else {
					this.paddle.velocity.y = 0;
				}
			}
			else if (this.keyset == "player_2") {
				if (this.game.keysPressed.p2_up) {
					this.paddle.velocity.y = -800;
				}
				else if (this.game.keysPressed.p2_down) {
					this.paddle.velocity.y = 800;
				}
				else {
					this.paddle.velocity.y = 0;
				}
			}
			this.paddle.update(currentTime);
		}
		this.updateTime = currentTime;
	}

	draw() {
		this.paddle.draw();
	}

	resetLevel() {
		// Position the player at the bottom of the screen in the center
		this.paddle.position =
			{
				x: this.default_position.x,
				y: this.default_position.y
			}
		this.paddle.resetLevel();
	}
}