import React, { Component } from "react";

class Chat extends Component {
    socket = this.props.socket

    state = {
        message: '',
        messages: []
    };



    componentDidMount = () => {
        // this function not working 
        this.socket.on('new message', data => {
            console.log('Made it back to client, receved server emit new message')
            this.displayMessage(data);
        });

        // listen for ENTER key press
        // send message event 
        document.addEventListener("keydown", event => {
            if (event.which === 13) {
                this.socket.emit('new message', this.state.message)
                console.log(`Message to be sent: ${this.state.message}`)
                console.log("Enter key pressed")
            }
        })
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

    sendMessageToServer() {
        if (this.state.message) {
            this.socket.emit('new message', this.state.message)
        }
    }

    displayMessage(data) {
        // update the state so that it gets automatically re-rendered 
        this.setState(prevState => ({
            messages: [...prevState.messages, data]
        }))
    }

    render() {
        return (
            <div>
                <div className="chatArea">
                    <ul className="messages">
                        {this.state.messages.map(msg =>  
                        <li>{msg.message}</li>)}
                    </ul>
                </div>
                <input className="inputMessage" name="message" value={this.state.message} placeholder="Type here..." onChange={this.handleInputChange} />
            </div>
        )
    }
}

export default Chat;
