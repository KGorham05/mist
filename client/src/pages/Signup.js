import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../components/AuthService';
import API from '../utils/API';
import "./signup.css"
class Signup extends Component {
  constructor() {
    super();
    this.Auth = new AuthService();
  }

  componentWillMount() {
    if (this.Auth.loggedIn()) {
      this.props.history.replace('/');
    }
  }

  handleFormSubmit = event => {
    event.preventDefault();
    API.signUpUser(this.state.username, this.state.email, this.state.password)
      .catch(err => alert(err));
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <div className="signUp">
        <div className="container form">

          <h1>Signup</h1>
          <form>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input className="form-control"
                placeholder="Username"
                name="username"
                type="text"
                id="username"
                onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email address:</label>
              <input className="form-control"
                placeholder="Email"
                name="email"
                type="email"
                id="email"
                onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="pwd">Password:</label>
              <input className="form-control"
                placeholder="Password goes here..."
                name="password"
                type="password"
                id="pwd"
                onChange={this.handleChange} />
            </div>
          </form>
          <Link to="/login" onClick={this.handleFormSubmit} className="btn btn-primary">Submit</Link>
          <Link to="/login" className="btn btn-success">Go to Login</Link>
        </div>
      </div>
    );
  }
}

export default Signup;