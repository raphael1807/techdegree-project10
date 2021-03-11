import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

function UserSignIn(props) {
    // Context from props, get state from context
    const { context } = props;
    const { actions } = context;

    // History object
    const history = useHistory();

    // ------------------------------------------
    //  Statefull variables
    // ------------------------------------------
    const [user, setUser] = useState({ emailAddress: '', password: '' });
    const [errors, setErrors] = useState(false);

    // ------------------------------------------
    //  Method 1 - Change state of the values with input form values
    // ------------------------------------------
    const change = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUser({ ...user, ...{ [name]: value } });
    };

    // ------------------------------------------
    // Method 2 - Submit a new user
    // submitUser method calls createUser function from context and create the new user
    // ------------------------------------------
    const submitSignIn = (event) => {
        event.preventDefault();
        const { from } = props.location.state || { from: { pathname: '/' } }
        const { emailAddress, password } = user;
        context.actions.signIn(emailAddress, password)
            .then(user => {
                if (user === null) {
                    setErrors(['Provide valid informations']);
                } else {
                    history.push(from);
                    console.log(`SUCCESS! ${emailAddress} is now signed in!`);
                }
            })
            .catch(err => {
                console.log(err);
                history.push('/error');
            });
    };

    return (
        <div className="bounds">
            <div className="grid-33 centered signin">
                <h1>Sign In</h1>
                <div>
                    <div>
                        {errors ?
                            <React.Fragment>
                                <h2 className="validation--errors--label">Validation errors</h2>
                                <div className="validation-errors">
                                    <ul>
                                        <li>{errors}</li>
                                    </ul>
                                </div>
                            </React.Fragment>
                            :
                            null
                        }
                    </div>
                    <form onSubmit={submitSignIn}>
                        <div>
                            <input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" onChange={change} />
                        </div>
                        <div>
                            <input id="password" name="password" type="password" className="" placeholder="Password" onChange={change} />
                        </div>
                        <div className="grid-100 pad-bottom">
                            <button className="button" type="submit">Sign In</button>
                            <Link className="button button-secondary" to="/">Cancel</Link>
                        </div>
                    </form>
                </div>
                <p>&nbsp;</p>
                <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
            </div>
        </div>
    )
}

export default UserSignIn;