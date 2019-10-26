import { Paddle } from './paddle.js';

export class Opponent {
	constructor(game) {
		this.game = game;
		//import Paddle
		this.paddle = new Paddle(this);
		this.updateTime = new Date().getTime();

		// Setup the paddle
		this.paddle.position =
			{
				x: 10,
				y: (this.game.client.height / 2) - (this.paddle.height / 2)
			}

		this.difficulty = game.difficulty;
		this.score = 0;
		this.state = "still";
	}

	__toString() {
		return "Opponent";
	}

	update(currentTime) {
		if (!this.game.keysPressed.paused) {
			var elapsedTime = currentTime - this.updateTime;

			if ((this.game.ball.position.y > this.paddle.position.y + (this.paddle.height / 2)) && (this.game.ball.velocity.y > 0) && (this.paddle.position.y < (this.game.client.height - this.paddle.height))) {
				this.paddle.velocity.y = 100 * this.difficulty;
				if (this.paddle.velocity.y > this.game.ball.velocity.y) {
					// No point running faster than the ball - makes it look laggy
					this.paddle.velocity.y = this.game.ball.velocity.y;
				}
			}
			else if ((this.game.ball.position.y < this.paddle.position.y + (this.paddle.height / 2)) && (this.game.ball.velocity.y < 0) && (this.paddle.position.y > 0)) {
				this.paddle.velocity.y = -100 * this.difficulty;
				if (this.paddle.velocity.y < this.game.ball.velocity.y) {
					// No point running faster than the ball - makes it look laggy
					this.paddle.velocity.y = this.game.ball.velocity.y;
				}
			}
			else {
				this.paddle.velocity.y = 0;
			}
		}
		this.paddle.update(currentTime);
		this.updateTime = currentTime;
	}

	draw() {
		this.paddle.draw();
	}

	resetLevel() {
		// Position the player at the bottom of the screen in the center
		this.paddle.position =
			{
				x: 10,
				y: (this.game.client.height / 2) - (this.paddle.height / 2)
			}
		this.paddle.resetLevel();
	}
}