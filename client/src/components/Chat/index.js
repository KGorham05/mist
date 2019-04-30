import React, { Component } from "react";

class Chat extends Component {
    socket = this.props.socket

    state = {
        message: '',
        messages: []
    };



    componentDidMount() {
        this.socket.on('new message', (data) => {
            this.setState({ messages: this.state.messages.push(data) });
          });
    }

    handleInputChange = event => {
        // Getting the value and name of the input which triggered the change
        const { name, value } = event.target;
        // Updating the input's state
        this.setState({
            [name]: value
        });
    };

    sendMessageToServer() {
        if (this.state.message) {
            this.socket.emit('new message', this.state.message)
        }
    }

    displayMessage() {
        
    }

    render() {
        return (
            <div>
                <div className="chatArea">
                    <ul className="messages">{this.state.messages.map(msg => 
                        <p>{msg}</p>)}</ul>
                </div>
                <input className="inputMessage" name="message" value={this.state.message}placeholder="Type here..." onChange={this.handleInputChange} />
            </div>
        )
    }
}

export default Chat;
