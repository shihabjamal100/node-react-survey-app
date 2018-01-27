// SurveyField contains logic to render a single
// label and text input.
import React from 'react';

export default ({ input, label, meta: { error, touched } }) => {  // ES6 nested destructuring
    // Note passing {...input} to the <input/> is basically saying
    // pass on all the objects on the {input} to the <input/>. So
    // for example the {input} object has functions like onBlur
    // etc. So this is the same as saying <input onBlur={input.onBlur} /> 
    // and so on for all the other key value pairs {input} has.
    return (
        <div>
            <label>{label}</label>
            <input {...input} style={{marginBottom: '5px'}} />
            <div className="red-text" style={{marginBottom: '20px'}}>
                {touched && error}
            </div>
        </div>
    );
};