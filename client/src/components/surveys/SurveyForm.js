// SurveyForm shows a form for a user to add input.
import _ from 'lodash'
import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {Link} from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {
    renderFields() {
        return _.map(formFields, ({label, name}) => {
            return ( 
                <Field
                    key={name}
                    component={SurveyField} 
                    type="text" 
                    label={label} 
                    name={name} 
                />
            );
        });
    }

    render() {
        return (
            <div>
                <form 
                    onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)} // remember handleSubmit is from redux-form and onSurveySubmit is what we passed to SurveyForm in 
                                                                                  // note this is the same as () => this.props.onSurveySubmit()
                                                                                  // when we remove the () after onSurveySubmit then we are just saying we don't want to invoke immediately
                                                                                  // but only after the onSubmit() is called. 
                > 
                    {this.renderFields()}
                    <Link to="/surveys" className="red btn-flat white-text">
                        Cancel
                        <i className="material-icons right">cancel</i>
                    </Link>
                    <button type="submit" className="teal btn-flat right white-text">
                        Next
                        <i className="material-icons right">navigate_next</i>
                    </button>
                </form>
            </div>
        );
    }
}

// values is an object containing key-value pairs where each key corresponds to each "name" property
// in each of the input Fields and the value is the corresponding value inside the input.
function validate(values) {
    const errors = {};

    errors.recipients = validateEmails(values.recipients || ''); // pass an recipients emails array if no recipients yet defined

    _.each(formFields, ({ name }) => {
        if (!values[name])
        {
            errors[name] = `You must provide a ${name}`;
        }
    });
    
    return errors;
}

// Wire up reddux form with this component
export default reduxForm({
    validate,
    form: 'surveyForm',   // this is the name of the "form" we are giving to the redux-form state.
    destroyOnUnmount: false // this makes sure that when the user submits the form the values in the form are still shown
})(SurveyForm);