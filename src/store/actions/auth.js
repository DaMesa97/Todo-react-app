import * as actions from './actionTypes'

import axios from 'axios'

const checkAuthTimeout = (expirationTime) => {
   return dispatch => {
      setTimeout(() => {
         dispatch(logout())
      }, expirationTime * 1000)
   }
}

export const logout = () => {
   localStorage.removeItem('token');
   localStorage.removeItem('expirationDate');
   localStorage.removeItem('userId')
   return {
      type: actions.AUTH_LOGOUT
   }
}

export const authCheckState = () => {
   return dispatch => {
      const token = localStorage.getItem('token')

      if (token) {
         const expirationDate = new Date(localStorage.getItem('expiresIn'))

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
            localStorage.setItem('token', response.data.idToken)
            localStorage.setItem('userId', response.data.localId)
            localStorage.setItem('expiresIn', response.data.expiresIn)

            console.log(response)

            dispatch(authSuccess(response.data.idToken, response.data.localId))
         })
         .catch(error => {
            dispatch(authFail(error.response.data.error))
         })
   }
}

const authStart = () => {
   return {
      type: actions.AUTH_START
   }
}

const authSuccess = (token, userId) => {
   return {
      type: actions.AUTH_SUCCESS,
      token: token,
      userId: userId
   }
}

const authFail = (error) => {
   return {
      type: actions.AUTH_FAILED,
      error: error
   }
}