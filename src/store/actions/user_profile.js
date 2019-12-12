import * as actions from './actionTypes'

import firebase from 'firebase'

export const initUserData = (user) => {
   return dispatch => {
      let displayName, photoUrl, createdOn;

      displayName = user.displayName;
      photoUrl = user.photoURL
      createdOn = user.metadata.creationTime

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
            const userDataInDatabase = firebase.database().ref(`/users/${user.uid}/displayName`)
            userDataInDatabase.set(user.displayName)
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

export const startNotificationsTrack = (userId) => {
   return dispatch => {
      console.log('Zaczynam sledzic notyfikacje')
      const usersNotificationsRef = firebase.database().ref(`/notifications/${userId}`)

      dispatch(trackingNotificationsStart())
      usersNotificationsRef.on('child_added', snapshot => {
         console.log(snapshot.val())
         dispatch(pushNotificationToArray({ ...snapshot.val(), notificationId: snapshot.key }))
      })
   }
}

export const stopNotificationsTrack = (userId) => {
   return dispatch => {
      console.log('Przestaje sledzic notyfikacje')
      const userNotificationsRef = firebase.database().ref(`/notifications/${userId}`)
      userNotificationsRef.off();
      dispatch(trackingNotificationsStop())
   }
}

const pushNotificationToArray = (notification) => {
   return {
      type: actions.PUSH_NOTIFICATION_TO_ARRAY,
      notification: notification
   }
}

export const deleteNotification = (userId, notificationId) => {
   return (dispatch, getState) => {
      const state = getState()
      const notificationdRef = firebase.database().ref(`notifications/${userId}/${notificationId}`)
      notificationdRef.remove()

      const updatedState = state.profile.notifications.filter(notification => {
         return notification.notificationId !== notificationId
      })
      dispatch(deleteNotificationFromState(updatedState))
   }
}

const deleteNotificationFromState = (updatedState) => {
   return {
      type: actions.REMOVE_NOTIFICATION_FROM_STATE,
      updatedState: updatedState
   }
}

const trackingNotificationsStop = () => {
   return {
      type: actions.TRACKING_NOTIFICATIONS_STOP
   }
}

const trackingNotificationsStart = () => {
   return {
      type: actions.TRACKING_NOTIFICATIONS_START
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