import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import config from '../../config';

function UserSignUp(props) {
  // Context from props
  const { context } = props;
  const { actions } = context;

  // History object
  const history = useHistory();

  // ------------------------------------------
  //  Statefull variables
  // ------------------------------------------
  const [user, setUser] = useState({ firstName: '', lastName: '', emailAddress: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState();

  // ------------------------------------------
  //  Method 1 - Change state of the values with input form values
  // ------------------------------------------
  const change = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUser({ ...user, ...{ [name]: value } });
  }

  // ------------------------------------------
  // Method 2 - Submit a new user
  // submitUser method calls createUser function from context and create the new user
  // ------------------------------------------
  const submitUser = (event) => {
    event.preventDefault();
    // If password matches confirm password, new user object is created with saved data in user state and continue, 
    // else setErrors called to 'password does not match'
    if (user.password === user.confirmPassword) {
      const newUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        password: user.password
      }
      // Calls createUser() from data passed to context
      context.userData.createUser(newUser)
        .then(errors => {
          if (errors.length) {
            setErrors(errors);
          } else {
            // Signs new user in + redirects them to main page
            context.actions.signIn(user.emailAddress, user.password)
              .then(() => {
                history.push('/');
              });
          }
        })
        .catch(err => {
          console.log(err);
          history.push('/error');
        });
    } else {
      setErrors(['Passwords need to match']);
    }
  };

  return (
    <div className="bounds">
      <div className="grid-33 centered signin">
        <h1>Sign Up</h1>
        <div>
          <div>
            {errors ?
              <React.Fragment>
                <h2 className="validation--errors--label">Validation errors</h2>
                <div className="validation-errors">
                  <ul>
                    {errors.map((error, i) => <li key={i}>{error}</li>)}
                  </ul>
                </div>
              </React.Fragment>
              :
              <span></span>
            }
          </div>
          <form onSubmit={submitUser}>
            <div><input id="firstName" name="firstName" type="text" className="" placeholder="First Name" onChange={change} /></div>
            <div><input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" onChange={change} /></div>
            <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" onChange={change} /></div>
            <div><input id="password" name="password" type="password" className="" placeholder="Password" onChange={change} /></div>
            <div><input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password" onChange={change} /></div>
            <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign Up</button><Link className="button button-secondary" to="/">Cancel</Link></div>
          </form>
        </div>
        <p>&nbsp;</p>
        <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
      </div>
    </div>
  )
}

export default UserSignUp;