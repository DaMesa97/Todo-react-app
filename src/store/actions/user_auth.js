import * as actions from './actionTypes'

import { clearTodos } from './todoList'
import { clearUserData, showAlert, clearAlert, initUserData } from './user_profile'

import firebase from 'firebase'

export const logout = () => {
   return dispatch => {
      firebase.auth().signOut()
         .then(response => {
            console.log(response)
         })
         .catch(error => {
            console.log(error)
         });
      dispatch(clearTodos())
      dispatch(clearUserData())
      dispatch(logoutFinished())
   }
}

const logoutFinished = () => {
   return {
      type: actions.AUTH_LOGOUT
   }
}

export const authCheckState = () => {
   return dispatch => {
      dispatch(authStart())
      firebase.auth().onAuthStateChanged(user => {
         if (user) {
            dispatch(authSuccess(user.uid))
            dispatch(initUserData(user))
         } else {
            dispatch(logout())
         }
      })
   }
}

export const auth = (email, password, nick, isSignUp) => {
   return dispatch => {
      dispatch(authStart())
      if (isSignUp) {
         firebase.auth().signInWithEmailAndPassword(email, password)
            .then(response => {
               authSuccess(response.user.uid)
               authFinish()
            })
            .catch(error => {
               dispatch(authFinish())
               dispatch(authFailed())
               dispatch(showAlert('error', error.response.data.error.message))
               setTimeout(() => {
                  dispatch(clearAlert())
               }, 3000)
            })
      }
      else {
         firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(response => {
               authSuccess(response.user.uid);
               saveUserData(nick, response.user.uid, email);
               authFinish();
            })
            .catch(error => {
               dispatch(authFinish())
               dispatch(authFailed())
               dispatch(showAlert('error', error.response.data.error.message))
               setTimeout(() => {
                  dispatch(clearAlert())
               }, 3000)
            })
      }
   }
}

const authStart = () => {
   return {
      type: actions.AUTH_START
   }
}

const authFinish = () => {
   return {
      type: actions.AUTH_FINISH
   }
}

const authFailed = () => {
   return {
      type: actions.AUTH_FAILED
   }
}

export const authSuccess = (userId) => {
   return {
      type: actions.AUTH_SUCCESS,
      userId: userId
   }
}

const saveUserData = (nick, userId, email) => {
   console.log(`log z saveuserdata`)
   const userData = {
      displayName: nick,
      email: email,
      groups: null
   }
   firebase.database().ref(`/users/${userId}`).set(userData)
      .then(response => {
         console.log(response)
      })
   const user = firebase.auth().currentUser
   user.updateProfile({
      displayName: nick
   })
}