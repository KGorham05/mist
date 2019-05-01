import React, { Component } from "react";
import "./style.css";

class Chat extends Component {
    socket = this.props.socket

    state = {
        message: '',
        messages: []
    };

    componentDidMount = () => {
        // this function not working 
        this.socket.on('new message', data => {
            console.log('display message was hit');
            this.displayMessage(data);
        });
    }

    sendMessage = e => {
        console.log("Enter key pressed");
        e.preventDefault();
        this.socket.emit('new message', {message: this.state.message, username: this.props.username});
        this.setState({message: ""});
    }

    handleInputChange = event => {
        // Getting the value and name of the input which triggered the change
        const { name, value } = event.target;
        // Updating the input's state
        this.setState({
            [name]: value
        });
        console.log(`Current message: ${this.state.message}`)
    };

    displayMessage(data) {
        // update the state so that it gets automatically re-rendered 
        this.setState({
            messages: [...this.state.messages, data]
        })
    }

    render() {
        return (
            <div className="chatComponent">
                <div className="messageArea">
                    <ul className="messages">
                        {this.state.messages.map((item, i) =>  
                            <p key={i}><span id="userNameText">{`${item.username}`}</span>{`: ${item.message}`}</p>)}
                    </ul>
                </div>
                <form onSubmit={this.sendMessage}>
                    <input className="inputMessage" name="message" value={this.state.message} placeholder="Type here..." onChange={this.handleInputChange} />
                    <button type="submit">Send</button>
                </form>
            </div>
        )
    }
}

export default Chat;
