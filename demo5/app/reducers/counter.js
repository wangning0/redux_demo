/**
 * Created by wangning on 16/4/14.
 */
import {INCREMENT_COUNTER,DECREMENT_COUNTRE} from '../actions/counter';

export default function counter(state = 0,action) {
    switch (action.type){
        case INCREMENT_COUNTER:
            return state+1;
        case DECREMENT_COUNTRE:
            return state-1;
        default:
            return state;
    }
}