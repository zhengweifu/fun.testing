import React from 'react';

import ReactDOM from 'react-dom';


import {createStore} from 'redux';

import {Provider} from 'react-redux';

import App from './containers/App';

import todoApp from './reducers/index';

import { addTodo, completeTode } from './actions';
let store = createStore(todoApp);

let rootElement = document.getElementById('app');

// console.log(store.getState());

// let unsubscribe = store.subscribe(() => {
// 	console.log(store.getState());
// });

// store.dispatch(addTodo('fun.zheng'));

// store.dispatch(completeTode(1));

// store.dispatch(addTodo('fun.zheng'));

// store.dispatch(completeTode(2));

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,

	rootElement
);