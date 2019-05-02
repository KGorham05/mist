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
  handleDelete = function () {

  }
  render() {
    return (
      // <div className="Profile">
      //   <h1>Welcome Trainer!</h1>
      //   <p>Username: {this.state.username}</p>
      //   <p>Email: {this.state.email}</p>
      //   <Link to="/">Go home</Link>

      //   <div className="savedArticles">
      //     {this.state.articles.map(article => (
      //       <h1>{article.title}</h1>
      //     ))}

      //   </div>
      // </div>
      <div className="articles">
        <div className="home-image profile">
          <h1 id="welcome">Welcome Trainer!</h1>
          <iframe width="560" height="315" title="theme song" src="https://www.youtube.com/embed/rg6CiPI6h2g" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          <br></br>
          <div className="profileBtns">
            <a href="#articles"><button className="btn prof-saved">Saved Articles</button></a>
            <a href="/events"><button className="btn prof-news">News</button></a>
            <a href="#articles"><button className="btn prof-battle">Battle!</button></a>
          </div>
        </div>
        {/* Articles */}
        <div className="articles row" id="articles">
          {this.state.articles.map(article => (
            <div className="card bg-dark text-white col-md-4">
              <h3 className="card-title">
                {article.title}
              </h3>
              <img src={article.image} className="card-img" alt="article img"></img>

              <div className="card-img-overlay">
                <div className="transbox">
                  <p className="card-text">
                    {article.summary}
                  </p>
                  <a href={article.link}><button className="read btn">Read</button></a>
                  <button className="save btn" onClick={() => this.handleDelete(article._id)}>Delete</button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default withAuth(Profile);