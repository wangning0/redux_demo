/**
 * Created by wangning on 16/4/14.
 */
export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTRE = 'DECREMENT_COUNTRE';

export function increment() {
    return {
        type:INCREMENT_COUNTER
    }
}

export function decrement() {
    return {
        type:DECREMENT_COUNTRE
    }
}

export function incrementIfOdd() {
    return (dispatch,getState) => {
        const {counter} = getState()

        if( counter % 2 == 0 ){
            return
        }
        dispatch(increment())
    }
}

export function incrementAsync(delay = 1000) {
    return dispatch =>{
        setTimeout(()=>{
            dispatch(increment())
        },delay)
    }
}