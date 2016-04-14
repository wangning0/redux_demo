/**
 * Created by wangning on 16/4/14.
 */

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter';

function mapStatetoProps(state) {
    return {
        counter:state.counter
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(CounterActions,dispatch)
}

export default connect(mapStatetoProps,mapDispatchToProps)(Counter);

