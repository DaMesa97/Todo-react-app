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
import { firebaseReducer, ReactReduxFirebaseProvider, getFirebase } from 'react-redux-firebase'
import firebase from 'firebase'
import thunk from 'redux-thunk'
import { BrowserRouter } from 'react-router-dom'

const firebaseConfig = {
   apiKey: "AIzaSyDiJ1HOTYokShLVrCFV4veIHOYWhPszNa0",
   authDomain: "todo-react-app-53813.firebaseapp.com",
   databaseURL: "https://todo-react-app-53813.firebaseio.com",
   projectId: "todo-react-app-53813",
   storageBucket: "todo-react-app-53813.appspot.com",
   messagingSenderId: "755394308572",
   appId: "1:755394308572:web:7b12565cf93cdf40030719"
};

const rrfConfig = {
   userProfile: 'users'
}

firebase.initializeApp(firebaseConfig)

const rootReducer = combineReducers({
   auth: authReducer,
   todoList: todoListReducer,
   welcome: welcomeReducer,
   profile: profileReducer,
   firebase: firebaseReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const rrfProps = {
   firebase,
   config: rrfConfig,
   dispatch: store.dispatch,
}

firebase.auth().onAuthStateChanged(user => {
   if (user) {
      console.log(user)
   } else {
      console.log(`Niezalogowoano`)
   }
})

const app = (
   <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
         <BrowserRouter>
            <App />
         </BrowserRouter>
      </ReactReduxFirebaseProvider>
   </Provider>
)

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
