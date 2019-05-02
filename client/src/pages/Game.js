import React from "react";
import CanvasGame from '../components/CanvasGame';
import Chat from '../components/Chat'
import Scoreboard from '../components/Scoreboard'

function Game(props) {
    return (
        <div>
            <Scoreboard />
            <CanvasGame socket={props.socket} />
            <Chat username={props.user.username} socket={props.socket} />
        </div>
    )
}

export default Game;