import {FETCH_USER} from '../actions/types';

export default function(state = null, action) 
{   
    switch(action.type) 
    {
        case FETCH_USER:
            return action.payload || false; // when user not logged in payload will be an empty string which is 'falsy' so we want to return a false state

        default:
            return state;
    }
}