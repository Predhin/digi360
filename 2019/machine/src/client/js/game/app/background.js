

export class Background {

	constructor(game) {
		this.game = game;
		this.color = "#000000";
	}

	__toString() {
		return "Background";
	}

	update(currentTime) {

	}

	draw() {
		this.game.drawRectangle(this.color, 0, 0, this.game.client.width, this.game.client.height);

		this.game.context.fillStyle = '#333333';
		this.game.context.font = 'bold 80px sans-serif';
		this.game.context.textBaseline = 'middle';
		this.game.context.textAlign = 'center';


		if (typeof (this.game.opponent) != "undefined" && typeof (this.game.player) != "undefined") {
			this.game.drawRectangle("#333333", this.game.client.width/2, 0, 1 , this.game.client.height);
			this.game.context.fillText(this.game.opponent.score, this.game.client.width / 4, this.game.client.height / 2);
			this.game.context.fillText(this.game.player.score, (this.game.client.width - (this.game.client.width / 4)) ,this.game.client.height / 2);
		}
		else {
			this.game.context.font = 'bold 50px sans-serif';
			this.game.context.fillStyle = '#FF0000';
			this.game.context.fillText("Please Wait", this.game.client.width / 2, this.game.client.height / 2);
		}
	}
}