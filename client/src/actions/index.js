import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';

/* export const fetchUser = () => {
        return function(dispatch) {
                axios
                    .get('/api/current_user')
                    .then(res => dispatch({ type: FETCH_USER, payload: res}));
        };
}; */

// Same as above but ES6 syntax.
export const fetchUser = () => async dispatch => {     // note ES6 syntax. return keyword and curly  braces removed.
        const res = await axios.get('/api/current_user')
        dispatch( {type: FETCH_USER, payload: res.data} );
};

export const handleToken = (token) => async dispatch => {
        const res = await axios.post('/api/stripe', token);
        dispatch( {type: FETCH_USER, payload: res.data} );
};

export const submitSurvey = (values, history) => async dispatch => {
        const res = await axios.post('/api/surveys/', values);

        history.push('/surveys'); // history comes from the React-Router. This push('/surveys') will just route us back to the surveys page.

        dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchSurveys = () => async dispatch => {
        const res = await axios.get('/api/surveys');

        dispatch({ type: FETCH_SURVEYS, payload: res.data });
}