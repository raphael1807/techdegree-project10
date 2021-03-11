import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';

import CourseElement from './CourseElement';

const Courses = (props) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`${config.apiBaseUrl}/courses`)
            .then(data => { setData(data.data) })
            .catch(err => {
                console.log(err);
                props.history.push('/error');
            });
    }, []);

    return (
        <div className="bounds">
            {/* Iterates over state data to create a card for each item returned from the database */}
            {data.map((course, index) => <CourseElement key={index} title={course.title} id={course.id} />)}
            <div className="grid-33">
                <Link className="course--module course--add--module" to="/courses/create">
                    <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        viewBox="0 0 13 13" className="add">
                        <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                    </svg>New Course</h3>
                </Link>
            </div>
        </div>
    );
}

export default Courses;