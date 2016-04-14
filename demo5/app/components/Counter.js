/**
 * Created by wangning on 16/4/14.
 */
import React , {Component,PropTypes} from 'react';

class Counter extends Component{
    static propTypes = {
        increment:PropTypes.func.isRequired,
        incrementIfOdd:PropTypes.func.isRequired,
        incrementAsync:PropTypes.func.isRequired,
        decrement:PropTypes.func.isRequired,
        counter:PropTypes.number.isRequired
    }

    render(){
        const {increment,incrementIfOdd,incrementAsync,decrement,counter} = this.props;
        console.log(this.props);
        return (
            <p>
                Clicked:{counter} times
                {' '}
                <button onClick={increment}>+</button>
                {' '}
                <button onClick={decrement}>-</button>
                {' '}
                <button onClick={incrementIfOdd}>increment if odd</button>
                {' '}
                <button onClick={()=>incrementAsync()}>increment if async </button>
            </p>
        )
    }
}

export default Counter;/**
 * Created by wangning on 16/4/14.
 */
