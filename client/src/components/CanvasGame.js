import React, { Component } from 'react';

class CanvasGame extends Component {
    socket = this.props.socket;

    state = {
        up: false,
        down: false,
        left: false,
        right: false
    }

    componentDidMount() {
        this.socket.emit('new player');
        setInterval(() => {
            this.socket.emit('movement', this.state);
        }, 1000 / 60);

        const canvas = this.refs.canvasGame;
        canvas.width = 800;
        canvas.height = 600;

        // Make it listen for key presses
        canvas.tabIndex = 1000;

        canvas.addEventListener(
            "keydown", this.keyDown, false
        );

        canvas.addEventListener(
            "keyup", this.keyUp, false
        );

        const context = canvas.getContext("2d");

        this.socket.on('state', players => {
            context.clearRect(0, 0, 800, 600);

            for (var id in players) {
                var player = players[id];
                context.fillStyle = (player.predator) ? 'red' : 'green';
                context.beginPath();
                context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
                context.fill();
            }
        });
    }

    keyDown = (event) => {
        console.log(event.keyCode);
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
            default: break;
        }
    }

    render() {
        return <canvas id="canvas" ref="canvasGame"
            width={800} height={600}
            style={
                {
                    width: "800px",
                    height: "600px",
                    border: "5px solid black",
                    marginLeft: "15px",
                    marginTop: "35px"
                }
            } />
    }
}

export default CanvasGame;