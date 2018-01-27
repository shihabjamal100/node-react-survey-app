// SurveyNew shows SurveyForm and SurveyFormReview.
import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyFormReview';

class SurveyNew extends Component {
    /* constructor() {
        super(props);

        this.state = {showFormReview: false};
    } */

    // Note this is the same as initialiising the state in
    // the constructor as above. This is just a shorter
    // syntax provided with the help of create-react--app.
    state = { showFormReview: false };

    renderContent() {
        if (this.state.showFormReview) {
            return <SurveyFormReview
                        onBack={() => this.setState({ showFormReview: false })}
                    />
        }

        return <SurveyForm 
                   onSurveySubmit={() => this.setState({ showFormReview: true })}
                />
    }

    render() {
        return (
            <div>
                {this.renderContent()}
            </div>
        );
    }
}

export default reduxForm({
    form: 'surveyForm'
})(SurveyNew);