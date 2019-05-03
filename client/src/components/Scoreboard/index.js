import React from "react";
import "./style.css";

function Scoreboard(props) {
    return (
        <div className="scoreboard">
        <h1 id="score-title">Pokemon Battle Royale!</h1>
            <h3 id="rules">Rules</h3>
            <li className="text-rules">Use WASD to move!</li>
            <li className="text-rules">Use Space Bar to shoot if you're moving, or lay a mine if you're standing still!</li>
            <li className="text-rules">If you get hit 10 times, you're out!</li>
            <li className="text-rules">The first character to connect starts as Charizard!</li>
            <li className="text-rules">Charizard can run over other players to damage them!</li>
            <li className="text-rules">Charizard turns into Pikachu when he runs someone over, and they become the new Charizard!</li>
            <li className="text-rules">No tag backs! Pikachu's too small and fast to be run over! </li>
        </div>
    )
}

export default Scoreboard;