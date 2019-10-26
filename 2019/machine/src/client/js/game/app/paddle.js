export class Paddle {

	constructor(parent) {
		this.parent = parent;
		this.updateTime = new Date().getTime();

		this.width = 10;
		this.height = 100;

		this.position = { x: 0, y: 0 }
		this.velocity = { x: 0, y: 0 }
		this.color = "#FFFFFF";
	}

	__toString() {
		return "Paddle";
	}

	update(currentTime) {
		if (!this.parent.game.keysPressed.paused) {
			this.checkCollisions();
			var elapsedTime = currentTime - this.updateTime;
			this.position.x += this.velocity.x * (elapsedTime / 1000);
			this.position.y += this.velocity.y * (elapsedTime / 1000);
		}
		this.updateTime = currentTime;
	}

	updatewithTracking(updatedVal) {
		this.checkCollisions();
		this.position.y = updatedVal;
		this.updateTime = new Date().getTime();
	}

	draw() {
		this.parent.game.drawRectangle(this.color, this.position.x, this.position.y, this.width, this.height);
	}

	checkCollisions() {
		if (this.position.y > (this.parent.game.client.height - this.height)) {
			this.position.y = (this.parent.game.client.height - this.height);
		}
		else if (this.position.y < 0) {
			this.position.y = 0;
		}
	}

	hitBall() {
		if (this.parent.game.ball.state != "coliding") {
			this.parent.game.ball.state = "colliding";

			// The ball has hit the paddle
			this.parent.game.ball.velocity.x *= -1;

			// Increase the speed of game
			this.parent.game.ball.velocity.x *= 1.1;
			this.parent.game.ball.velocity.y *= 1.1;
		}
	}

	resetLevel() {
	}
}