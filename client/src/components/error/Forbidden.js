import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = (props) => {
    return (
        <div className="bounds">
            <h1>Forbidden</h1>
            <p>{props.location.state.message}</p>
            <div className="grid-100 pad-bottom"><Link className="button button-secondary" to="/">Return home</Link></div>
        </div>
    );
}

export default Forbidden;