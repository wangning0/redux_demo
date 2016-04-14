/**
 * Created by wangning on 16/4/14.
 */

import {combineReducers} from 'redux';
import counter from './counter';

const rootReducer = combineReducers({
    counter
});

export default rootReducer;