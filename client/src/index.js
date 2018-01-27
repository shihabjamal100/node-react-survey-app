import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';

// Development only
import axios from 'axios';
window.axios = axios;

const store = createStore( reducers, {}, applyMiddleware(reduxThunk) );

ReactDom.render(
    <Provider store = {store}><App/></Provider>,
    document.querySelector('#root')
);

// console logging the keys from the environment files.
/* console.log('STRIPE KEY is', process.env.REACT_APP_STRIPE_KEY);
console.log('Our environment is', process.env.NODE_ENV); */