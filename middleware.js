//第一步解析middleware 假设要实现一个纪录日志
let action = addTodo('Use Redux');

console.log('dispatching',action);
store.dispatch(action);
console.log('next state',store.getState());

//第二步,封装Dispatch

function dispatchAndLog(store,action){
    console.log('dispatching',action);
    store.dispatch(action);
    console.log('next state',store.getState());
}

dispatchAndLog(store,addTodo('Use Redux'));

//第三步,monkeypatching Dispatch  (monkeypatching 给内置对象拓展方法)

let next = store.dispatch;
store.dispatch = function dispatchAndLog(action){
    console.log('dispatching',action);
    let result = next(action); //返回值为action
    console.log('next state',store.getState());
    return result;
};

//不用的模块

function patchStoreToAddLogging(store) {
    let next = store.dispatch;
    store.dispatch = function dispatchAndLog(action){
        console.log('dispatching',action);
        let result = next(action); //返回值为action
        console.log('next state',store.getState());
        return result;
    }
}

function patchStoreToAddCrashReporting(store){
    let next = store.dispatch
    store.dispatch = function dispatchAndReportErrors(action) {
        try {
            return next(action)
        } catch (err) {
            console.error('捕获一个异常!', err)
            Raven.captureException(err, {
                extra: {
                    action,
                    state: store.getState()
                }
            })
            throw err
        }
    }
}

//使用
patchStoreToAddLogging(store);
patchStoreToAddCrashReporting(store);


//第四步,隐藏Monkeypatching
//Monkeypatching 本质上也是一种hack"将任意的方法替换成你想要的",在之前,我们用自己的函数替换掉了
//store.dispatch.如果我们不这么做,而是在函数中返回新的dispatch呢?

function logger(store) {
    let next = store.dispatch;

    return function dispatchAndLog(action) {
        console.log('dispatching',action);
        let result = next(action);
        console.log('next state',store.getState());
        return result;
    }
}

//在Redux内部提供一个可以将实际的monkeypatching应用到store.dispatch中的辅助方法

function applyMiddlewareByMonkeypatching(store,middlewares) {
    middlewares = middlewares.slice();
    middlewares.reverse();

    middlewares.forEach(middleware=>
        store.dispatch = middleware(store); //会每个函数都会执行,返回值都是action会赋值给store.dispatch
    )
}

//然后像这样应用多个middleware

applyMiddlewareByMonkeypatching(store,[logger,patchStoreToAddCrashReporting]);


//第五步 移除Monkeypatching

//为什么我们要替换原来的dispatch呢?

function logger(store) {
    return function wrapDispatchToAddLogging(next) {
        return function dispatchAndLog(action) {
            console.log('dispatching',action);
            let result = next(action);
            console.log('next state',store.getState());
            return result;
        }
    }
}

//将ES6的箭头函数可以使其柯里化,从而看起来更舒服一些

const logger = store => next => action => {
    console.log('dispatching',action);
    let result = next(action);
    console.log('next state',store.getState());
    return result;
};

const crashReporter = store => next => action => {
    try {
        return next(action)
    } catch (err) {
        console.error('Caught an exception!', err)
        Raven.captureException(err, {
            extra: {
                action,
                state: store.getState()
            }
        })
        throw err
    }
};

function applyMiddleware(store,middlewares) {
    middlewares = middlewares.slice();
    middlewares.reverse();

    let dispatch = store.dispatch;

    middlewares.forEach(middleware=>
        dispatch = middleware(store)(dispatch);
    )

    return Object.assign({},store,{dispatch});

}