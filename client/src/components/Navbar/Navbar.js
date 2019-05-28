import React, { Component } from "react";
import { Link } from 'react-router-dom';
import AuthService from '../AuthService';

class Navbar extends Component {
    constructor() {
        super();
        this.Auth = new AuthService();
    }

    showNavigation = () => {
        if (this.Auth.loggedIn()) {
            return (
                <div>
                    <Link className="nav-link" to="/">Profile</Link>

                    <Link className="nav-link" to="/game">Battle</Link>

                    <Link className="nav-link" to="/events">News</Link>

                    {/* this is not using the Link component to logout or user and then refresh the application to the start */}
                    <a className="nav-link" href="/" onClick={() => this.Auth.logout()}>Logout</a>
                </div>
            );
        } else {
            return (
                <div>
                    <Link className="nav-link" to="/signup">Signup</Link>


                    <Link className="nav-link" to="/login">Login</Link>
                </div>
            );
        }
    };

    render() {
        return (
            <div className="navbar">
                <div class="dropdown">
                    <button class="btn dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                        <i class="fas fa-bars"></i>
                    </button>
                    <Link className="navbar-brand" to="/">The Elite 4</Link>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                        {this.showNavigation()}
                    </div>
                </div>
                {/* <!--Full Navbar--> */}
                <nav id="nav-bar">
                    <div className="text-center">
                        <Link className="navbar-brand" to="/">The Elite 4</Link>
                        <div className="navbar-links">
                            {this.showNavigation()}
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}

export default Navbar;