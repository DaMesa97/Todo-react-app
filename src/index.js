import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import todoListReducer from './store/reducers/todoList'
import authReducer from './store/reducers/user_auth'
import welcomeReducer from './store/reducers/welcome'
import profileReducer from './store/reducers/user_profile'

import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { BrowserRouter } from 'react-router-dom'

const rootReducer = combineReducers({
   auth: authReducer,
   todoList: todoListReducer,
   welcome: welcomeReducer,
   profile: profileReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const app = (
   <Provider store={store}>
      <BrowserRouter>
         <App />
      </BrowserRouter>
   </Provider>
)

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
