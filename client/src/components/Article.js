import React from 'react';

class Article extends React.Component {
    render() {
        if (this.props.handleSave) {
            var action = "Save";
            var handleClick = this.props.handleSave;
        } else if (this.props.handleDelete) {
            var action = "Delete";
            var handleClick = this.props.handleDelete;
        }
        const { article } = this.props;
        return (
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
                        <button className="save btn" onClick={handleClick}>{action}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Article;