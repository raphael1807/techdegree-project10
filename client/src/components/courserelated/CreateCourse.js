import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';
import config from '../../config';

function CreateCourse(props) {
  // Context from props, 
  const { context } = props;

  // State from context
  const authUser = context.authenticatedUser;
  const { authPassword, actions } = context;

  // History object
  const history = useHistory();

  // id parameter of the URL
  let { id } = useParams();

  // ------------------------------------------
  //  Statefull variables
  // ------------------------------------------
  const [course, setCourse] = useState({ title: '', description: '', estimatedTime: '', materialsNeeded: '' });
  const [errors, setErrors] = useState();

  // ------------------------------------------
  //  Method 1 - Change state of the values with input form values
  // ------------------------------------------
  const change = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCourse({ ...course, ...{ [name]: value } });
  }

  // ------------------------------------------
  // Method 2 - Create a new course
  // Submit function uses course object saved in state to make a call to the api to create the new course in the database
  // ------------------------------------------
  const courseSubmit = (event) => {
    event.preventDefault();
    // Use values saved in state to create new course object
    const newCourse = {
      title: course.title,
      description: course.description,
      estimatedTime: course.estimatedTime,
      materialsNeeded: course.materialsNeeded,
      userId: authUser.id,
    };
    console.log(newCourse);
    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
    const url = `${config.apiBaseUrl}/courses/`;
    const options = {
      body: JSON.stringify(newCourse),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${encodedCredentials}`
      }
    };
    // POST request to api
    fetch(url, options)
      .then(data => {
        if (data.status === 201) {
          console.log('201');
          history.push('/');
        } else if (data.status === 400) {
          console.log('400');
          return data.json().then(data => {
            setErrors(data.errors);
          });
          // Redirects to "/error" on status of 500
        } else if (data.status === 500) {
          console.log('500');
          history.push('/error');
        }
      })
      // Handle rejected promises
      .catch(err => {
        console.log('error');
        history.push('/error');
      });
  };

  return (
    <div className="bounds course--detail">
      <h1>Create Course</h1>
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
        <form onSubmit={courseSubmit}>
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <div>
                <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." onChange={change} />
              </div>
              <p>By {authUser.firstName} {authUser.lastName}</p>
            </div>
            <div className="course--description">
              <div>
                <textarea id="description" name="description" className="" placeholder="Course description..." onChange={change}></textarea>
              </div>
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <div>
                    <input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" onChange={change} />
                  </div>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <div>
                    <textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange={change}></textarea>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid-100 pad-bottom"
          ><button className="button" type="submit">Create Course</button>
            <Link className="button button-secondary" to="/">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCourse;