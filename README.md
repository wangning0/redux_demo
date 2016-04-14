# Redux 学习之旅

## Redux三大原则
* 单一的数据源

    整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。一般来说，你会通过store.dispatch()将action传到store,并且每个action必须是javascript对象

* State是只读的

    惟一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。

* 使用纯函数来执行修改

## Action
* 一般来说，你会通过store.dispatch()将action传到store,并且每个action必须是javascript对象

* 事实上，创建action对象很少用这种每次直接声明对象的方式，更多的是通过一个创建函数，这个函数被称为Action Creator

        function addTodo(text) {
            return {
            type: ADD_TODO,
            text
            };
        }
## Reducer

* Redux中的reducer是一个纯函数，传入state和action，返回一个新的state tree，简单而纯粹的完成某一件具体的事情，没有依赖，简单而纯粹是它的标签。

        const counter = (state=0,action)=>{
             switch (action.type) {
              case 'INCREMENT':
                return state + 1;
              case 'DECREMENT':
                return state - 1;
              default:
                return state;
          }
        }

* 永远不要在reducer里面做这些操作
     
     * 修改传入参数
     * 执行有副作用的操作，如api请求和路由跳转
     * 调用非纯函数 Date.now() Math.random() 
## Store

 store是用来维持应用所有的state树的一个对象。改变store内state唯一的途径是对她dispatcher一个action
 
 Store是一个具有一下四个方法的对象：
 
 * getState() 
     
   返回应用当前的state树
   
 * dispatch(action) 
 
 分发action，触发state变化的唯一途径，会使用当前getState()的结果和传入的action以同步方式的调用store的reduce函数，返回值被作为下一个state。从现在开始，这就成为了getState的返回值，同时变化监听器会触发。
 
 * subscribe(listener)
 
 添加一个变化监听器，每当dispatch action的时候就会执行，state树中的一部分可能已经变化，这是一个底层api，多数情况下，不会直接使用它，会使用一些react的绑定
 
 * replaceReducer(nextReducer)
 
## Redux 的顶层api介绍

*  createStroe 

    * 调用方式：createStrore(reducer,[initialState])
    
* combineReducers

    * 调用方式：comebineReducers(reducers)
           
           
                  combineReducers({todos,counter});
                  
                  import {combineReducers} from 'redux';
                  import * as reducers from './reducers';
                  const todoApp = combineReducers(reducers);
            
* applyMiddleware 

    * 调用方式：applyMiddleware(...middlewares)
   
* bindActionCreators 
    * 调用方式：bindActionCreators(actionCreators, dispatch)
        
            let actions = {
                addItem:(text)=>{
                    type:type.ADD_ITEM,
                    text
                }
            }
            bindActionCreators(actions,dispatch)
            //等价于=>
            /*
            return {
                addItem:(text)=>dispatch({type:type.ADD_ITEM,text})
            }
            */
* compose 

     * 调用方式：compose(...functions)
     * compose 用来实现从右到左来组合传入的多个函数，它做的只是让你不使用深度右括号的情况下来写深度嵌套的函数，仅此而已。
     
## React-redux

* 提供`connect`和`Provider`

* Provider 这个模块作为整个App的容器，在原有的App Container的基础上再包上一层，它的工作很简单，接受Redux的store作为props，可以通过this.context.store访问到。

* 这个模块算是真正意义上连接了redux 和 react，connect就是酱store中的必要数据作为props传递给React组件来render，并包装action creator用于在响应数据操作时dispatcher一个action
* `connect([mapStateToProps],[mapDispatchToProps],[mergeProps],[options])`

    * mapStateToProps是一个函数，返回值表示的是需要merge进props的state。默认值为()=>({})什么都不传。`(state,props)=>({})`
    * mapDispatchToProps是可以是一个函数，返回值表示的是需要merge进props的actionCreators这里的actionCreator应该是已经包装了dispath了的，推荐使用redux的`bindActionCreators`函数
    
                   (dispatch, props) => ({ // 通常会省略第二个参数
                     ...bindActionCreators({
                       ...ResourceActions
                     }, dispatch)
                    })
            
                    //demo
                    import * as actionCreators from './actionCreators'
                    import { bindActionCreators } from 'redux'
                    
                    function mapStateToProps(state) {
                      return { todos: state.todos }
                    }
                    
                    function mapDispatchToProps(dispatch) {
                      return { actions: bindActionCreators(actionCreators, dispatch) }
                    }
                    
                    export default connect(mapStateToProps, mapDispatchToProps)(Component)
                                        

## 超酷的开发工具Redux-devtools

`npm install --save-dev redux-devtools redux-devtools-log-monitor redux-devtools-dock-monitor`

* redux-devtools：redux的开发工具包，而且DevTools支持自定义的 monitor 组件，所以我们可以完全自定义一个我们想要的 monitor 组件的UI展示风格，以下两个是我们示例中用到的。
* redux-devtools-log-monitor： 这是Redux Devtools 默认的 monitor ，它可以展示state 和 action 的一系列信息，而且我们还可以在monitor改变它们的值。
* redux-devtools-dock-monitor：这monitor支持键盘的快捷键来轻松的改变tree view在浏览器中的展示位置，比如不断的按‘ctrl + q’组合键可以让展示工具停靠在浏览器的上下左右不同的位置，按“ctrl+h”组合键则可以控制展示工具在浏览器的显示或隐藏的状态。

        
        import React from 'react';
        import { createDevTools } from 'redux-devtools';
        import LogMonitor from 'redux-devtools-log-monitor';
        import DockMonitor from 'redux-devtools-dock-monitor';
        
        export default createDevTools(
          <DockMonitor toggleVisibilityKey='ctrl-h'
                       changePositionKey='ctrl-q'>
            <LogMonitor />
          </DockMonitor>
        );
        
        //
        import React from 'react'
        import { render } from 'react-dom'
        import { Provider } from 'react-redux'
        import App from './containers/App'
        import DevTools from './containers/DevTools'
        import { createStore, compose } from 'redux';
        import todoApp from './reducers'
        
        // 把多个 store 增强器从右到左来组合起来，依次执行
        // 这个地方完全可以不用compose，演示一下compose的使用
        const enhancer = compose(
          DevTools.instrument()
        );
        
        let store = createStore(todoApp, enhancer)
        let rootElement = document.getElementById('app')
        
        render(
          <Provider store={store}>
            <div>
              <App />
              <DevTools />
            </div>
          </Provider>,
          rootElement
        )
        
# 理解和使用Middleware

  Redux中的middleware就是接受不同类型的action对象作为输入，负责改变store中的dispatch方法，从而达到我们预期的需求。它提供的是位于action被发起之后，到达reducer之前的扩展点
  
  我们可以利用 Redux middleware 来进行日志记录、创建崩溃报告、调用异步接口或者路由等等。
  
  可以使用redux的applyMiddleware方法将middlewares串起来，并返回一个增强型的 createStore 。
  
compose 将从右到左来传入的多个函数组合起来

## 开发建议

开发复杂的应用时，不可避免的会有一些数据相互引用，建议尽可能的把state范式化，不存在嵌套。把所有数据放到一个对象里，每个数据以id为主键，不同数据相互应用时通过id来查找，把应用的state想象成数据库。`normalizr`文档有详细阐述，例如在实际开发中，在state里同时存放`todosById:{id->todo}`和`todos:array<id>`是比较好的方式。

很多时候，我们经常要先把前面和后面都切开，可以选择帮助类[ React.addons.update](https://facebook.github.io/react/docs/update.html) [updeep](https://github.com/substantial/updeep) [Immutable](http://facebook.github.io/immutable-js/) 时刻谨记永远不要在克隆`state`前修改它

尽可能将嵌套的API响应范式化

        {
          selectedsubreddit: 'frontend',
          postsBySubreddit: {
            frontend: {
              isFetching: true,
              didInvalidate: false,
              items: []
            },
            reactjs: {
              isFetching: false,
              didInvalidate: false,
              lastUpdated: 1439478405547,
              items: [
                {
                  id: 42,
                  title: 'Confusion about Flux and Relay'
                },
                {
                  id: 500,
                  title: 'Creating a Simple Application Using React JS and Flux Architecture'
                }
              ]
            }
          }
        }
        
        //===>转化为
        
        {
          selectedsubreddit: 'frontend',
          entities: {
            users: {
              2: {
                id: 2,
                name: 'Andrew'
              }
            },
            posts: {
              42: {
                id: 42,
                title: 'Confusion about Flux and Relay',
                author: 2
              },
              100: {
                id: 100,
                title: 'Creating a Simple Application Using React JS and Flux Architecture',
                author: 2
              }
            }
          },
          postsBySubreddit: {
            frontend: {
              isFetching: true,
              didInvalidate: false,
              items: []
            },
            reactjs: {
              isFetching: false,
              didInvalidate: false,
              lastUpdated: 1439478405547,
              items: [ 42, 100 ]
            }
          }
        }
## 理解Middleware
    [Middleware](https://github.com/wangning0/redux_demo/blob/master/middleware.js)
## 长用的react插件
* `redux-thunk`
* `redux-promise`
* `redux-actions`

## 异步Action
当调用异步API时，有两个非常关键的时刻：发起请求的时刻，和接收到响应的时刻（也可能时超时）。每个API请求都至少需要dispatch三个不同的action

* 一个通知reducer请求开始的action
* 一个通知reducer请求成功结束的action
* 一个通知reducer请求失败的action

可是设置不同的字段来作为标记位

### 异步Action Creator
把定义的同步action creator 和网络请求结合起来呢？标准的做法是使用`redux thunk`middleware. 通过使用指定的 middleware,action creator  除了返回action对象外还可以返回函数，这个函数可以执行异步api请求，还可以dispatch action.就像dispatch前面定义的同步action一样

## 用于生成action creator 的函数
