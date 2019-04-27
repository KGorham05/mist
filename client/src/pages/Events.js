import React from "react";
import withAuth from './../components/withAuth';
import API from "../utils/API";


class Events extends React.Component {
    
    componentDidMount() {
        API.scrape()
    }

    render() {
        return(
            <div>Hello World</div>
        )
    }
}

export default withAuth(Events)