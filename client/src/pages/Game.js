import React from "react";
import CanvasGame from '../components/CanvasGame';
import Chat from '../components/Chat'
import Scoreboard from '../components/Scoreboard'

function Game(props) {
    return (
        <div className="game">
            {/* <Scoreboard />
            <CanvasGame socket={props.socket} />
            <Chat username={props.user.username} socket={props.socket} /> */}
            <div className="row gamerow no-gutters">
                <div className="col-md-3">
                <Scoreboard />
                </div>
                <div className="col-md-6">
                <CanvasGame socket={props.socket} />
                </div>
                <div className="col-md-3">
                <Chat username={props.user.username} socket={props.socket} />
                </div>
            </div>
        </div>
    )
}

export default Game;