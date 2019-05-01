import React, { Component } from 'react';
import withAuth from './../components/withAuth';
import API from './../utils/API';
import { Link } from 'react-router-dom';

class Profile extends Component {

  state = {
    username: "",
    email: "",
    articles: []
  };

  componentDidMount() {
    API.getUser(this.props.user.id).then(res => {
      this.setState({
        username: res.data.username,
        email: res.data.email
      })
    });

    API.getsavedArticles()
       .then(res => {
        this.setState({ articles: res.data })
        })
  }

  render() {
    return (
      <div className="Profile">
        <h1>On the profile page!</h1>
        <p>Username: {this.state.username}</p>
        <p>Email: {this.state.email}</p>
        <Link to="/">Go home</Link>

        <div className="savedArticles">
          {this.state.articles.map(article => (
            <h1>{article.title}</h1>
          ))}
         
        </div>
      </div>
    )
  }
}

export default withAuth(Profile);