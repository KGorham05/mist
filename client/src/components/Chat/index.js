import React, { Component } from "react";

class Chat extends Component {

    state = {
        message: ''
    };

    componentDidMount() {

    }

    handleInputChange = event => {
        // Getting the value and name of the input which triggered the change
        const { name, value } = event.target;

        // Updating the input's state
        this.setState({
            [name]: value
        });
    };

    render() {
        return (
            <div>
                <div className="chatArea">
                    <ul className="messages"></ul>
                </div>
                <input className="inputMessage" name="message" value={this.state.message}placeholder="Type here..." onChange={this.handleInputChange} />
            </div>
        )
    }
}

export default Chat;
