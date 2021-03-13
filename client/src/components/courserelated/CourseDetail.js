import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import Context from '../../Context';
import axios from 'axios';
import config from '../../config';

const CourseDetail = (props) => {
  // Context from props
  const { context } = props;

  // State from context
  const authUser = context.authenticatedUser;

  // History object
  const history = useHistory();

  // id parameter of the URL
  let { id } = useParams();

  // ------------------------------------------
  //  Statefull variables
  // ------------------------------------------
  const [course, setCourse] = useState([]);
  const [user, setUser] = useState([]);

  // ------------------------------------------
  // Method 1 - Fetch course course{id}
  // Retrieves the course{id} details from the REST API 
  // ------------------------------------------
  useEffect(() => {
    axios(`${config.apiBaseUrl}/courses/${id}`)
      .then(response => {
        console.log(response);
        // If api returns null, redirect to '/notfound` route
        if (response.data === null) {
          history.push('/notfound');
        } else {
          setCourse(response.data);
          setUser(response.data.User);
        }
      })
      // If api responds with a 500 status code, redirect to '/error' route
      .catch(err => {
        if (err.response === 500) {
          history.push('/error');
        }
      });
  }, []);

  // ------------------------------------------
  // Method 2 - Delete Course
  // Delete the Course data in the DB of the rendered page
  // ------------------------------------------
  const deleteCourse = async () => {
    const result = window.confirm("Confirm the deletion of this course");
    if (result) {
      const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
      const url = `${config.apiBaseUrl}/courses/${id}`;
      const options = {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${encodedCredentials}`
        }
      };
      fetch(url, options)
        .then(data => {
          if (data.status === 204) {
            alert('Course deleted');
            history.push('/');
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
          history.push('/error');
        });
    }
  };

  return (
    <div>
      <div className="actions--bar">
        <div className="bounds">
          <div className="grid-100">
            {authUser && authUser.id === user.id ?
              <React.Fragment>
                <div className="grid-100"><span><Link className="button" to={`/courses/${course.id}/update`}>Update Course</Link>
                  <button className="button" onClick={deleteCourse}>Delete Course</button></span>
                  <Link className="button button-secondary" to="/">Return to List</Link></div>
              </React.Fragment>
              :
              <React.Fragment>
                <div className="grid-100"><span></span>
                  <Link className="button button-secondary" to="/">Return to List</Link></div>
              </React.Fragment>
            }
          </div>
        </div>
      </div>
      <div className="bounds course--detail">
        <div className="grid-66">
          <div className="course--header">
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{course.title}</h3>
            <p>By {user.firstName} {user.lastName}</p>
          </div>
          <div className="course--description">
            <ReactMarkdown source={course.description} />
          </div>
        </div>
        <div className="grid-25 grid-right">
          <div className="course--stats">
            <ul className="course--stats--list">
              <li className="course--stats--list--item">
                <h4>Estimated Time</h4>
                <h3>{course.estimatedTime}</h3>
              </li>
              <li className="course--stats--list--item">
                <h4>Materials Needed</h4>
                <ul>
                  <ReactMarkdown source={course.materialsNeeded} />
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;