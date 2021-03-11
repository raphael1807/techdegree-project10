import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = (props) => {

    const { context } = props;
    const authUser = context.authenticatedUser;

    return (
        <div className="header">
            <div className="bounds">
                <h1 className="header--logo">Courses</h1>
                <nav>
                    {authUser ?
                        <React.Fragment>
                            <span>Welcome, {authUser.name}!</span>
                            <Link className="signout" to="/signout">Sign Out</Link>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <NavLink className="signup" to="/signup">Sign Up</NavLink>
                            <NavLink className="signin" to="/signin">Sign In</NavLink>
                        </React.Fragment>
                    }
                </nav>
            </div>
        </div>
    );
}

export default Header;