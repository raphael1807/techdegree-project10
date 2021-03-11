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
  const [errors, setErrors] = useState(false);
  const [firstNameError, setFirstNameError] = useState([]);
  const [lastNameError, setLastNameError] = useState([]);
  const [emailAddressError, setEmailAddressError] = useState([]);
  const [passwordError, setPasswordError] = useState([]);
  const [passwordMatchError, setPasswordMatchError] = useState([]);

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
    userFormErrors();
    // If password matches confirm password, new user object is created with saved data in user state and continue, 
    // else setErrors called to 'password does not match'
    if (user.password === user.confirmPassword) {
      const newUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        password: user.password
      };
      // Calls createUser() from data passed to context
      context.userData.createUser(user)
        .then(errors => {
          if (errors.length) {
            setErrors({ errors });
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
      setErrors([true]);
      setPasswordMatchError("Passwords need to match");
    }
  };

  // ------------------------------------------
  // Method 3 - Form inputs Error
  // Errors in state to be shown if inputs are not good
  // ------------------------------------------
  const userFormErrors = () => {
    if (user.firstName.length === 0) {
      setFirstNameError('Please provide a value for "First Name"');
      setErrors([true]);
    }

    if (user.firstName.length > 0) {
      setFirstNameError("");
      setErrors([false]);
    }
    if (user.lastName.length === 0) {
      setLastNameError('Please provide a value for "Last Name"');
      setErrors([true]);
    }

    if (user.lastName.length > 0) {
      setLastNameError("");
      setErrors([false]);
    }

    function validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    console.log(user.emailAddress);
    console.log(validateEmail(user.emailAddress));

    if (!validateEmail(user.emailAddress)) {
      setEmailAddressError('Please provide a value for "Email Address"');
      setErrors([true]);
    }

    if (validateEmail(user.emailAddress)) {
      setEmailAddressError("");
      setErrors([false]);
    }

    if (user.password.length < 8 || user.password.length > 20) {
      setPasswordError('Password must be between 8 and 20 characters');
      setErrors([true]);
    }

    if (user.password.length >= 8) {
      setPasswordError("");
      setErrors([false]);
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
                    <li>{firstNameError}</li>
                    <li>{lastNameError}</li>
                    <li>{emailAddressError}</li>
                    <li>{passwordError}</li>
                    <li>{passwordMatchError}</li>
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