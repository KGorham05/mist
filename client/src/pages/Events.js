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
               this.setState({articles: res.data})
               console.log(this.state.articles)
           })
    }

    handleScrape(){
        API.scrape()
    }

    render() {
        return(
            <div className="articles">
                <button className="btn btn-primary" onClick={this.handleScrape()}>Scrape</button>
                <h1>Articles: </h1>
                {this.state.articles.map(article => (
                    <h2 key={article._id}>
                        {article.title}
                    </h2>
                ))}
            </div>
        )
    }
}

export default withAuth(Events)