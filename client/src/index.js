import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import registerServiceWorker from './registerServiceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import axios from "axios";

// Our Components
import Login from './pages/Login';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import CanvasGame from './components/CanvasGame';
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
        <div>
            <Navbar />
            <Route exact path="/" component={withAuth(App)} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/profile" component={withAuth(Profile)} />
            <Route exact path="/game" component={withAuth(CanvasGame)} />
            <Route exact path="/events" component={withAuth(Events)} />
        </div>
    </Router>
    , document.getElementById('root')
);
registerServiceWorker();
