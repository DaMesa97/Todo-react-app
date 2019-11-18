import * as actions from './actionTypes'

import firebase from 'firebase'

export const initUserData = (user) => {
   return dispatch => {
      console.log('wykonuje inituserdata w reducerze')
      let displayName, photoUrl, createdOn;

      displayName = user.displayName;
      photoUrl = user.photoURL
      createdOn = user.metadata.creationTime

      if (photoUrl === null) {
         photoUrl = `https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png`
      }
      dispatch(initUserDataSuccess(displayName, photoUrl, createdOn))
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

export const updateUserData = (changingPassword, data) => {
   return dispatch => {
      dispatch(updateUserDataStart())
      const user = firebase.auth().currentUser

      if (changingPassword) {
         user.updatePassword(data)
            .then(response => {
               dispatch(showAlert('success', 'Successfuly changed your data!'))
               dispatch(updateUserDataSuccess())
               setTimeout(() => {
                  dispatch(clearAlert())
               }, 2000)
            })
            .catch(error => {
               dispatch(showAlert('error', error.response.data.error.message))
               setTimeout(() => {
                  dispatch(clearAlert())
               }, 2000)
            })
      }
      else {
         user.updateProfile({
            displayName: data.displayName,
            photoURL: data.photoURL
         }).then(response => {
            dispatch(showAlert('success', 'Successfuly changed your data!'));
            dispatch(updateUserDataSuccess(user.displayName, user.photoURL))
            setTimeout(() => {
               dispatch(clearAlert())
            }, 2000)
         })
            .catch(error => {
               dispatch(showAlert('error', error.response.data.error.message))
               setTimeout(() => {
                  dispatch(clearAlert())
               }, 2000)
            })
      }
   }
}

const updateUserDataSuccess = (displayName, userImg) => {
   return {
      type: actions.UPDATE_DATA_SUCCESS,
      displayName: displayName,
      userImg: userImg
   }
}

const updateUserDataStart = () => {
   return {
      type: actions.UPDATE_DATA_START
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