import React, { Component } from 'react';
import openSocket from 'socket.io-client';

openSocket('http://localhost', {
    rejectUnauthorized: false
});

class CanvasGame extends Component {

    movement = {
        up: false,
        down: false,
        left: false,
        right: false
    }

    componentDidMount() {
        const socket = openSocket('http://localhost');

        socket.emit('new player');
        setInterval(function () {
            socket.emit('movement', this.movement);
        }, 1000 / 60);

        const canvas = this.refs.canvasGame;
        canvas.width = 600;
        canvas.height = 800;

        const context = canvas.getContext("2d");

        socket.on('state', function (players) {
            console.log(players);
            context.clearRect(0, 0, 800, 600);
            context.fillStyle = 'green';
            for (var id in players) {
                var player = players[id];
                if (player.predator) {
                    context.fillStyle = 'red';
                    context.beginPath();
                    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
                    context.fill();
                    context.fillStyle = 'green';
                    continue;
                }
                context.beginPath();
                context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
                context.fill();
            }
        });
    }

    keyDown(event) {
        switch (event.keyCode) {
            case 65: // A
                this.movement.left = true;
                break;
            case 87: // W
                this.movement.up = true;
                break;
            case 68: // D
                this.movement.right = true;
                break;
            case 83: // S
                this.movement.down = true;
                break;
            default: break;
        }
    }

    keyUp(event) {
        switch (event.keyCode) {
            case 65: // A
                this.movement.left = false;
                break;
            case 87: // W
                this.movement.up = false;
                break;
            case 68: // D
                this.movement.right = false;
                break;
            case 83: // S
                this.movement.down = false;
                break;
            default: break;
        }
    }

    render() {
        return <canvas id="canvas" ref="canvasGame"
            onKeyUp={this.keyUp} onKeyDown={this.keyDown}
            width={800} height={600}
            style={
                {
                    width: "800px",
                    height: "600px",
                    border: "5px solid black"
                }
            } />
    }
}

export default CanvasGame;