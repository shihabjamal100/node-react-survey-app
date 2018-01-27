// SurveyFormReview shows users their form inputs for review.
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions/index';

// formValues comes from mapStateToProps submitSurvey comes from action creator 
// history comes from withRouter from the React-Router.
const SurveyFormReview = ({ onBack, formValues, submitSurvey, history }) => { 
    const reviewFields = _.map(formFields, ({ name, label }) => {    // ES6 destructuring name and label from the fields
        return (
            <div key={name}>
                <label>{label}</label>
                <div>
                    {formValues[name]}
                </div>
            </div>
        );
    });

    return (
        <div>
            <h5>Please confirm your entries</h5>
            {reviewFields}
            <button
                className="yellow darken-3 white-text btn-flat"
                onClick={onBack}
            >
                Back
            </button>
            <button 
                onClick={() => submitSurvey(formValues, history)} // note this is different from onClick={submitSurvey(formValues)} the arrow function syntax delays the execution instead of immediate execution
                className="green white-text btn-flat right"
            >
                Send Survey
                <i className="material-icons right">email</i>
            </button>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        formValues: state.form.surveyForm.values  // remember we named our form survey form when we wired up redux form in SurveyForm
    }
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));