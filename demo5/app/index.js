import {render} from 'react-dom';
import React from 'react';
import {Provider} from 'react-redux';
import App from './containers/App';
import configureStore from './store/configureStore';

let rootElement = document.getElementById('app');
const store = configureStore();

render(
    <Provider store={store}>
        <App></App>
    </Provider>,
    rootElement
);