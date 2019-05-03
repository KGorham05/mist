import React, { Component } from 'react';
import withAuth from './../components/withAuth';
import API from './../utils/API';

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

    API.getSavedArticles(this.props.user.id)
      .then(res => {
        this.setState({ articles: res.data[0].articles })

      })
  }
  handleDelete = (id) => {
    API.deleteArticle(id, this.props.user.id)
       .then(res => {
         API.getSavedArticles(this.props.user.id)
         .then(res => {
          // console.log(res.data[0].articles)
          this.setState({ articles: res.data[0].articles })
  
        })
       })
      
  }
  render() {
    return (
      <div className="articles">
        <div className="home-image profile">
          <h1 id="welcome">Welcome Trainer {this.state.username}!</h1>
          <iframe width="560" height="315" title="theme song" src="https://www.youtube.com/embed/rg6CiPI6h2g" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          <br></br>
          <div className="text-center">
            <div className="profileBtns">
              <a href="#articles"><button className="btn prof-saved">Saved Articles</button></a>
              <a href="/events"><button className="btn prof-news">News</button></a>
              <a href="/game"><button className="btn prof-battle">Battle!</button></a>
            </div>
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