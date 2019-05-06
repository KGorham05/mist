import React from "react";
import withAuth from './../components/withAuth';
import API from "../utils/API";
import Article from "../components/Article";


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
        API.scrape().then(() => {
            API.getAllArticles()
                .then(res => {
                    this.setState({ articles: res.data })
                    console.log(res.data)
                })
        })

    }

    handleClear = () => {
        API.clear().then(() => {
            API.getAllArticles()
                .then(res => {
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
                        <Article key={article._id} handleSave={() => this.handleSave(article._id)} article={article} user={this.props.user} />
                    ))}
                </div>
            </div>
        )
    }
}

export default withAuth(Events)