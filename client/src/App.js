import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import AuthService from './components/AuthService';
const Auth = new AuthService();

class App extends Component {

  handleLogout = () => {
    Auth.logout();
  };

  render = () => {
    // console.log(process.env.REACT_APP_SECRET_CODE);
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome {this.props.user.email}</h2>
        </div>
        <p className="App-intro">
          <Link to="/" className="btn btn-primary">Go to Profile</Link>
          <Link to="/signup" className="btn btn-danger" onClick={this.handleLogout}>Logout</Link>
        </p>
      </div>
    );
  }
}

export default App;
