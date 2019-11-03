import * as actions from './actionTypes'

import axios from 'axios'

export const initUserData = (token) => {
   return dispatch => {
      axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDiJ1HOTYokShLVrCFV4veIHOYWhPszNa0`, { idToken: token })
         .then(response => {
            dispatch(initUserDataSuccess(response.data.users[0].displayName, response.data.users[0].photoUrl))
         })
         .catch(error => {
         })
   }
}

const initUserDataSuccess = (displayName, userImg) => {
   return {
      type: actions.INIT_USER_DATA_SUCCESS,
      displayName: displayName,
      userImg: userImg
   }
}

export const updateUserData = (url, data) => {
   return dispatch => {
      axios.post(url, { ...data })
         .then(response => {
            dispatch(showAlert('success', 'Successfuly changed your data!'))
            dispatch(updateUserDataSuccess(response.data.displayName, response.data.photoUrl))
            setTimeout(() => {
               dispatch(clearAlert())
            }, 3000)
         })
         .catch(error => {
            dispatch(showAlert('error', error.response.data.error.message))
            setTimeout(() => {
               dispatch(clearAlert())
            }, 3000)
         })
   }
}

const updateUserDataSuccess = (displayName, userImg) => {
   return {
      type: actions.UPDATE_DATA_SUCCESS,
      displayName: displayName,
      userImg: userImg
   }
}

export const showAlert = (type, message) => {
   return {
      type: actions.SHOW_ALERT,
      alertType: type,
      message: message
   }
}

export const clearAlert = () => {
   return {
      type: actions.CLEAR_ALERT
   }
}

export const clearUserData = () => {
   return {
      type: actions.CLEAR_USER_DATA
   }
}