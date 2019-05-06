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
            })
    }

    handleScrape = () => {
        API.scrape()
           .then(() => {
            API.getAllArticles()
                .then(res => {
                    console.log(res)
                    this.setState({ articles: res.data })
                })
        })

    }

    handleClear = () => {
        API.clear().then(() => {
            API.getAllArticles()
                .then(res => {
                    console.log(res.data)
                    this.setState({ articles: res.data })
                })
        })

    }
    handleSave(id) {
        API.saveArticle(id, this.props.user.id)
    }

    render() {
        return (
            <div className="articles">
                <div className="home-image">
                    <h1 className="home-title">Pokemon News</h1>
                    <h2 className="home-subtitle">NintendoLife Edition</h2>
                    <button className="btn btn-primary scrape" onClick={this.handleScrape}>Scrape</button>
                    <button className="btn btn-primary clear" onClick={this.handleClear}>Clear</button>
                </div>
                {/* Articles */}
                <div className="articles row">
                    {this.state.articles.map(article => (
                        <div key={article._id} className="card bg-dark text-white col-md-4">
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
                                    <button className="save btn" onClick={() => this.handleSave(article._id)}>Save</button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default withAuth(Events)