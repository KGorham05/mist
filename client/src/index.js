import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import registerServiceWorker from './registerServiceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import axios from "axios";

// Our Components
import Login from './pages/Login';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Game from './pages/Game';
import Events from './pages/Events';

// Our authorization service for locked content
import withAuth from './components/withAuth';

// Here is if we have an id_token in localStorage
if(localStorage.getItem("id_token")) {
  // then we will attach it to the headers of each request from react application via axios
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('id_token')}`;
}

ReactDOM.render(
    <Router>
        <div className="full">
            <Navbar />
            <Route exact path="/" component={withAuth(Profile)} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/game" component={withAuth(Game)} />
            <Route exact path="/events" component={withAuth(Events)} />
        </div>
    </Router>
    , document.getElementById('root')
);
registerServiceWorker();
