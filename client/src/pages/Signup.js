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
      .then(res => {
        // once the user has signed up
        // log them in and take them to their profile page
        this.Auth.login(this.state.email, this.state.password)
          .then(res => {
            window.location.reload();
          })
          .catch(err => {
            alert(err.response.data.message)
          });
      })
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
        <div className="row">
          <div className="form col-md-3">

            <h1>Signup</h1>
            <form onSubmit={this.handleFormSubmit}>
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
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <p>Already have an account?
          <Link to="/login" className="btn btn-success">Login</Link>
            </p>
          </div>
          <div className="col-md-5" >
            <div className="welcome-text">
              <h1 className="text-center">
                Do you want to be the very best, like no one ever was?
            </h1>
              <p className="text-center">Then join The Elite 4 today! Keep up to date on the latest Pokemon news, and battle against your friends in an epic Pokemon faceoff! Sign up today...it's your destiny!</p>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Signup;