import React from "react";
import withAuth from './../components/withAuth';
import API from "../utils/API";


class Events extends React.Component {
    state = {
        articles: []
    }
    componentDidMount() {
        //API.scrape()
        API.getAllArticles()
            .then(res => {
                this.setState({ articles: res.data })
                console.log(this.state.articles)
            })
    }

    handleScrape() {
        API.scrape()
    }

    render() {
        return (
            <div className="articles">
                <div class="home-image">
                    <h1 class="home-title">Pokemon News</h1>
                    <h2 class="home-subtitle">NintendoLife Edition</h2>
                    <button className="btn btn-primary" onClick={this.handleScrape()}>Scrape</button>
                </div>
                {/* Articles */}
                <div class="articles row">
                    {this.state.articles.map(article => (
                        <div className="card bg-dark text-white col-md-4">
                            <img src={article.image} className="card-img" alt="article img"></img>
                            <div className="card-img-overlay">
                                <a href="#" target="_blank">
                                    <h3 className="card-title">
                                        {article.title}
                                    </h3>
                                </a>
                                <p className="card-text">
                                    Summary goes here
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default withAuth(Events)