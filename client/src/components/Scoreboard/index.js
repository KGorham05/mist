import React from "react";
import "./style.css";

function Scoreboard(props) {
    return (
        <div className="scoreboard">
            <h1>USERNAME</h1>
            <h2>Total KOs: 10</h2>
            <ul>Rules</ul>
            <li>Use WASD to move!</li>
        </div>
    )
}

export default Scoreboard;