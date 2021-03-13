import React from 'react';
import { Link } from 'react-router-dom';

const UnhandledError = () => {
    return (
        <div className="bounds">
            <h1>Error</h1>
            <p>Sorry! We just encountered an unexpected error.</p>
            <div className="grid-100 pad-bottom"><Link className="button button-secondary" to="/">Return home</Link></div>
        </div>
    );
}

export default UnhandledError;