import * as actions from './actionTypes'

import { clearModal } from './welcome'

import { clearTodos } from './todoList'
import { clearUserData, showAlert, clearAlert } from './user_profile'

import axios from 'axios'

const checkAuthTimeout = (expirationTime) => {
   return dispatch => {
      setTimeout(() => {
         dispatch(logout())
      }, expirationTime * 1000)
   }
}

export const logout = () => {
   return dispatch => {
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');
      localStorage.removeItem('userId')
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
      const token = localStorage.getItem('token')

      if (token) {
         const expirationDate = (new Date(localStorage.getItem('expiresIn')))

         if (expirationDate > new Date()) {
            const userId = localStorage.getItem('userId')
            dispatch(authSuccess(token, userId))
            dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
         }
         else {
            dispatch(logout())
         }
      }
      else {
         dispatch(logout())
      }
   }
}

export const auth = (email, password, isSignUp) => {
   return dispatch => {
      dispatch(authStart())
      let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=
   AIzaSyDiJ1HOTYokShLVrCFV4veIHOYWhPszNa0`
      if (isSignUp) {
         url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDiJ1HOTYokShLVrCFV4veIHOYWhPszNa0`
      }

      axios.post(url, {
         email: email,
         password: password,
         returnSecureToken: true
      })
         .then(response => {
            dispatch(authFinish())
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000)

            localStorage.setItem('token', response.data.idToken)
            localStorage.setItem('userId', response.data.localId)
            localStorage.setItem('expiresIn', expirationDate)

            dispatch(authSuccess(response.data.idToken, response.data.localId))
            dispatch(checkAuthTimeout(response.data.expiresIn))
            dispatch(clearModal())
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

export const authSuccess = (token, userId) => {
   return {
      type: actions.AUTH_SUCCESS,
      token: token,
      userId: userId
   }
}