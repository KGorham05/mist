import React, { Component } from 'react';

class CanvasGame extends Component {
	socket = this.props.socket;

	state = {
		up: false,
		down: false,
		left: false,
		right: false,
		fire: false
	}
	keyDown = (event) => {
		event.preventDefault();
		switch (event.keyCode) {
			case 65: // A
				this.setState({ left: true });
				break;
			case 87: // W
				this.setState({ up: true });
				break;
			case 68: // D
				this.setState({ right: true });
				break;
			case 83: // S
				this.setState({ down: true });
				break;
			case 32: // space
				this.setState({ fire: true });
			default: break;
		}
	}

	keyUp = (event) => {
		switch (event.keyCode) {
			case 65: // A
				this.setState({ left: false });
				break;
			case 87: // W
				this.setState({ up: false });
				break;
			case 68: // D
				this.setState({ right: false });
				break;
			case 83: // S
				this.setState({ down: false });
				break;
			case 32: // space
				this.setState({ fire: false });
			default: break;
		}
	}

	componentDidMount = () => {
		this.socket.emit('new player', this.props.username);
		const canvas = this.refs.canvasGame;
		canvas.width = 800;
		canvas.height = 600;
		const context = canvas.getContext("2d");
		// Make it listen for key presses
		canvas.tabIndex = 1000;
		canvas.addEventListener("keydown", this.keyDown, false);
		canvas.addEventListener("keyup", this.keyUp, false);
		//music
		this.audio.play();
		this.audio.addEventListener('ended', function () {
			this.currentTime = 0;
			this.play();
		}, false);
		//left pointing images are in row of index 1 in sheet
		var srcLeft = 1;
		//right facing images are in row of index 2 in sheet
		var srcRight = 2;
		var srcX = 0;
		var srcY = 0;
		//sprite sheet dimensions
		var sheetWidth = 256;
		var sheetHeight = 256;
		var cols = 4;
		var rows = 4
		//width and height of each frame:
		var width = sheetWidth / cols; //64
		var height = sheetHeight / rows //64
		//left pointing images are in row of index 1 in sheet
		var srcLeft = 1;
		//right facing images are in row of index 2 in sheet
		var srcRight = 2;
		var srcX = 0;
		var srcY = 0;
		//sprite sheet dimensions
		var sheetWidth = 256;
		var sheetHeight = 256;
		var cols = 4;
		var rows = 4
		//width and height of each frame:
		var width = sheetWidth / cols; //64
		var height = sheetHeight / rows //64

		var currentFrame = 0;

		var bulb = new Image();
		var pika = new Image();
		var char = new Image();
		bulb.src = "/bulb.png";
		pika.src = "/pika.png";
		char.src = "/char.png";
		this.socket.on('state', function (obj) {
			// console.log(obj.players);
			context.clearRect(0, 0, 800, 600);
			for (var id in obj.players) {
				var player = obj.players[id];
				if (player.lastPredator) {
					if (player.predator) {
						context.drawImage(char, player.frameX * width, getSrcY(player.facing), width, height, player.x, player.y, width, height);
					} else {
						context.drawImage(pika, player.frameX * width, getSrcY(player.facing), width, height, player.x, player.y, width, height);

					}
				} else if (player.predator) {
					context.drawImage(char, player.frameX * width, getSrcY(player.facing), width, height, player.x, player.y, width, height);

				} else {
					// console.log(player.facing);

					context.drawImage(bulb, player.frameX * width, getSrcY(player.facing), width, height, player.x, player.y, width, height);
				}
			}
			for (var p in obj.projectiles) {
				var prj = obj.projectiles[p];
				context.fillStyle = 'red';
				context.beginPath();
				context.arc(prj.x, prj.y, 4, 0, 2 * Math.PI);
				context.fill();
			}
		});




		function getSrcY(facing) {
			if (facing.slice(0, 4) == "left") {
				return 1 * height;
			}
			if (facing.slice(0, 5) == "right") {
				return 2 * height;
			}
			if (facing == "up") {
				return 3 * height;
			}
			if (facing == "down") {
				return 0 * height;
			} if (facing == "else") {
				return 0 * height;
			}

		}



		setInterval(() => {
			//calc facing
			if (this.state.right) {
				if (this.state.up) {
					this.setState({ facing: "right-up" });
				}
				else if (this.state.down) {
					this.setState({ facing: "right-down" });
				}
				else {
					this.setState({ facing: "right" });
				}
			} else if (this.state.left) {
				if (this.state.up) {
					this.setState({ facing: "left-up" });
				}
				else if (this.state.down) {
					this.setState({ facing: "left-down" });
				}
				else {
					this.setState({ facing: "left" });
				}
			} else if (this.state.up) {
				this.setState({ facing: "up" });
			} else if (this.state.down) {
				this.setState({ facing: "down" });
			} else {
				this.setState({ facing: "else" });
			}
			this.socket.emit('movement', this.state);
		}, 1000 / 60);


	}
	render() {
		return (
			<div class="gamediv">
				<canvas id="canvas" ref="canvasGame"
					width={800} height={600}
					style={
						{
							width: "100%",
							height: "100%",
							border: "5px solid black"

						}
					} />
				<audio
					id="beep"
					preload="auto"
					src="http://66.90.93.122/ost/pokemon-yellow-blue-red-gb/hzswlzyv/16_Battle%20%28VS%20Trainer%29.mp3"
					// src="http://66.90.93.122/ost/pokemon-yellow-blue-red-gb/wpmvfxjd/11_Pokemon%20Center.mp3"
					//http://66.90.93.122/ost/pokemon-yellow-blue-red-gb/hzswlzyv/16_Battle%20%28VS%20Trainer%29.mp3
					ref={ref => (this.audio = ref)} />
			</div>
		)
	}
}
export default CanvasGame;
