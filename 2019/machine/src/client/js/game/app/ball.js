
export class Ball {
	constructor(game) {
		this.game = game;
		this.updateTime = new Date().getTime();

		this.width = 10;
		this.height = 10;
		this.position = { x: 0, y: 0 }
		this.velocity = { x: 0, y: 0 }
		this.state = "start";

		this.resetLevel();
		this.color = "#00FF00";
	}

	__toString() {
		return "Ball";
	}

	update(currentTime) {
		if (!this.game.keysPressed.paused) {
			this.checkCollisions();

			// When the ball resets, we want to pause for a bit
			if ((currentTime - this.startTime) > 1000) {
				this.state = "moving";
				var elapsedTime = currentTime - this.updateTime;
				this.position.x += this.velocity.x * (elapsedTime / 1000);
				this.position.y += this.velocity.y * (elapsedTime / 1000);
			}
			else {
				this.state = "still";
			}
		}
		this.updateTime = currentTime;
	}

	draw() {
		this.game.drawRectangle(this.color, this.position.x, this.position.y, this.width, this.height);
	}

	checkCollisions() {
		// Check to see if the ball is outside of the canvas area (on y-axis only)
		if (this.position.x < (0 - this.width)) {
			this.game.player.score++;
			this.game.resetLevel();
		}
		else if (this.position.x > this.game.client.width) {
			this.game.opponent.score++;
			this.game.resetLevel();
		}

		// Check for collisions with the sidewall
		if ((this.position.y < 0) || (this.position.y > (this.game.client.height - this.height))) {
			if (this.state != "collidingSidewall") {
				// Reverse the direction
				this.velocity.y *= -1;
				if (this.position.y < 0) {
					this.position.y = 0;
				}
				else {
					this.position.y = this.game.client.height - this.height;
				}

				this.state = "collidingSidewall";
			}
		}
		else {
			this.state = "moving";
		}

		// Check for collision with the paddle
		var min_y = this.game.player.paddle.position.y;
		var max_y = min_y + this.game.player.paddle.height;
		var min_y_opp = this.game.opponent.paddle.position.y;
		var max_y_opp = min_y_opp + this.game.opponent.paddle.height;

		// Check for collisions with the players paddle
		if (((this.position.x + this.width) >= this.game.player.paddle.position.x) && (this.position.y >= min_y && this.position.y <= max_y)) {
			this.position.x = (this.game.player.paddle.position.x - this.width + 1);
			this.game.player.paddle.hitBall();
		}
		else if (((this.position.x) <= (this.game.opponent.paddle.position.x + this.game.opponent.paddle.width)) && (this.position.y >= min_y_opp && this.position.y <= max_y_opp)) {
			this.position.x = (this.game.opponent.paddle.position.x + this.game.opponent.paddle.width + 1);
			this.game.opponent.paddle.hitBall();
		}
	}

	resetLevel() {
		this.state = "start";
		this.position =
			{
				x: (this.game.client.width / 2) - (this.width / 2),
				y: (this.game.client.height / 2) - (this.height / 2)
			}

		var random_Y = (Math.floor(Math.random() * 50) + 100) * 2;
		this.velocity =
			{
				x: (Math.floor(Math.random() * 2) == 0) ? 150 : -150,
				y: (Math.floor(Math.random() * 2) == 0) ? random_Y : random_Y * -1				
			}

		this.startTime = new Date().getTime();
	}
}