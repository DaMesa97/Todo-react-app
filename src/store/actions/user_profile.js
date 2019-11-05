import * as actions from './actionTypes'

import axios from 'axios'

import { logout } from './user_auth'

export const initUserData = (token) => {
   return dispatch => {
      axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDiJ1HOTYokShLVrCFV4veIHOYWhPszNa0`, { idToken: token })
         .then(response => {
            const date = new Date(response.data.users[0].createdAt / 1)
            const day = date.getDate() > 10 ? date.getDate() : '0' + date.getDate()
            const month = date.getMonth() > 10 ? date.getMonth() : '0' + date.getMonth()
            const year = date.getFullYear()

            const createdAt = `${day}/${month}/${year}`

            dispatch(initUserDataSuccess(response.data.users[0].displayName, response.data.users[0].photoUrl, createdAt))
         })
         .catch(error => {
         })
   }
}

const initUserDataSuccess = (displayName, userImg, createdAt) => {
   return {
      type: actions.INIT_USER_DATA_SUCCESS,
      displayName: displayName,
      userImg: userImg,
      createdAt: createdAt
   }
}

export const updateUserData = (url, data) => {
   return dispatch => {
      axios.post(url, { ...data })
         .then(response => {
            dispatch(showAlert('success', 'Successfuly changed your data, please login again to refresh!'))
            dispatch(updateUserDataSuccess(response.data.displayName, response.data.photoUrl))
            setTimeout(() => {
               dispatch(clearAlert())
            }, 4000)
            setTimeout(() => {
               dispatch(logout())
            }, 4000)
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