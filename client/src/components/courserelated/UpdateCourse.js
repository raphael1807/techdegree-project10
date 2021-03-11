import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import Context from '../../Context';
import { Link } from 'react-router-dom';
import config from '../../config';
import axios from 'axios';

function UpdateCourse(props) {
  // Context from props
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
  const [user, setUser] = useState([]);
  const [errors, setErrors] = useState(false);
  const [titleError, setTitleError] = useState([]);
  const [description, setDescription] = useState([]);
  const [descriptionError, setDescriptionError] = useState([]);

  // ------------------------------------------
  //  Method 1 - Change state of the values with input form values
  // ------------------------------------------
  const change = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCourse({ ...course, ...{ [name]: value } });
  };

  // ------------------------------------------
  // Method 2 - Fetch course data{id}
  // Retrieves the courses{id} details from the REST API 
  // ------------------------------------------
  useEffect(() => {
    axios.get(`${config.apiBaseUrl}/courses/${id}`)
      .then(response => {
        console.log(response);
        if (response.data.User.id !== authUser.id) {
          history.push({ pathname: '/forbidden', state: { message: 'Access Denied' } })
        } else {
          if (response.data) {
            setCourse(response.data);
            setUser(response.data.User);
          } else {
            history.push('/notfound');
          }
        }
      })
      .catch(err => {
        console.log(err);
        history.push('/notfound');
      });
  }, []);

  // ------------------------------------------
  // Method 3 - Update course
  // Update the Course data in the DB of the rendered page
  // ------------------------------------------
  const updateSubmit = (event) => {
    event.preventDefault();
    userFormErrors();
    // Use state to create new updatedCourse object
    const updatedCourse = {
      id,
      title: course.title,
      description: course.description,
      estimatedTime: course.estimatedTime,
      materialsNeeded: course.materialsNeeded,
      userId: authUser.id,
    };
    console.log(updatedCourse);
    const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
    const url = `${config.apiBaseUrl}/courses/${id}`;
    const options = {
      body: JSON.stringify(updatedCourse),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${encodedCredentials}`
      }
    };
    // POST request to api
    fetch(url, options)
      .then(data => {
        if (data.status === 204) {
          history.push(`/courses/${id}`);
        } else if (data.status === 400) {
          return data.json().then(data => {
            setErrors({ errors: data.errors });
          });
          // If user not the author of course data,
          // Return errors and redirect to "/forbidden" with location state prop
        } else if (data.status === 403 || data.status === 401) {
          return data.json().then(data => {
            history.push({ pathname: '/forbidden', state: { message: data.error } })
          });
          // Redirects to "/error" on status of 500
        } else if (data.status === 500) {
          history.push('/error');
        }
      })
      .catch(err => {
        console.log(err);
        history.push('/error');
      });
  };

  // ------------------------------------------
  // Method 4 - Components Error
  // Sets errors in state to be shown to the user if there is enough info in the relevant inputs
  // ------------------------------------------
  const userFormErrors = () => {
    if (course.title.length === 0) {
      setTitleError('Please provide a value for "Title"');
      setErrors([true]);
    }

    if (course.title.length > 0) {
      setTitleError("");
      setErrors("");
    }

    if (course.description.length === 0) {
      setDescriptionError('Please provide a value for "Description"');
      setErrors([true]);
    }

    if (course.description.length > 0) {
      setDescriptionError("");
      setErrors("");
    }
  };

  return (
    <div className="bounds course--detail">
      <h1>Update Course</h1>
      <div>
        <div>
          {errors ?
            <React.Fragment>
              <h2 className="validation--errors--label">Validation errors</h2>
              <div className="validation-errors">
                <ul>
                  <li>{titleError}</li>
                  <li>{descriptionError}</li>
                </ul>
              </div>
            </React.Fragment>
            :
            <span></span>
          }
        </div>
        <form onSubmit={updateSubmit}>
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." value={course.title} onChange={change} /></div>
              <p>By {user.firstName} {user.lastName}</p>
            </div>
            <div className="course--description">
              <div><textarea id="description" name="description" className='' placeholder="Course description..." value={course.description} onChange={change} /></div>
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" value={course.estimatedTime} onChange={change} /></div>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <div><textarea id="materialsNeeded" name="materialsNeeded" className='' placeholder="List materials..." value={course.materialsNeeded} onChange={change} /></div>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid-100 pad-bottom"><button className="button" type="submit">Update Course</button><Link className="button button-secondary" to={`/courses/${id}`}>Cancel</Link></div>
        </form>
      </div>
    </div>
  )
}

export default UpdateCourse;