import React from 'react';

const Forbidden = (props) => {
    return (
        <div className="bounds">
            <h1>Forbidden</h1>
            <p>{props.location.state.message}</p>
        </div>
    );
}

export default Forbidden;