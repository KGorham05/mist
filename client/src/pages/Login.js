import React, { Component } from 'react';
import AuthService from './../components/AuthService';
import { Link } from 'react-router-dom';

class Login extends Component {
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

    this.Auth.login(this.state.email, this.state.password)
      .catch(err => {
        alert(err.response.data.message)
      });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <div className="login">
        <div className="container form">
          <h1>Login</h1>
          <form>
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
                placeholder="Password"
                name="password"
                type="password"
                id="pwd"
                onChange={this.handleChange} />
            </div>
          </form>
          <Link to="/" className="btn btn-success" onClick={this.handleFormSubmit}>Submit</Link>
          <Link to="/signup" className="btn btn-primary">Go to Signup</Link>
        </div>
      </div>
    );
  }
}

export default Login;