import React, { Component } from 'react';
import './App.css';
import AuthService from './components/AuthService';
import withAuth from './components/withAuth';
import CanvasGame from './components/CanvasGame';
import Chat from './components/Chat'
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3001');

const Auth = new AuthService();

class App extends Component {

  handleLogout = () => {
    Auth.logout();
    this.props.history.replace('/signup');
  };

  goToEditProfile = () => {
    this.props.history.replace('/profile');
  };

  render = () => {
    // console.log(process.env.REACT_APP_SECRET_CODE);
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome {this.props.user.email}</h2>
        </div>
        <p className="App-intro">
          <button type="button" className="btn btn-primary" onClick={this.goToEditProfile}>Go to Profile</button>
          <button type="button" className="btn btn-danger" onClick={this.handleLogout}>Logout</button>
        </p>
        <CanvasGame socket={socket} />
        <Chat socket={socket} />
      </div>
    );
  }
}

export default withAuth(App);
