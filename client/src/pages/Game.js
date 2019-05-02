import React from "react";
import CanvasGame from '../components/CanvasGame';
import Chat from '../components/Chat'

function Game(props) {

    return (
        <div class="game">
            <CanvasGame socket={props.socket} />
            <Chat username={props.user.username} socket={props.socket} />
        </div>
    )
}

export default Game;