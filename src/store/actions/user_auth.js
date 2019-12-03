import * as actions from './actionTypes'

import { clearTodos } from './todoList'
import { clearUserData, showAlert, clearAlert, initUserData } from './user_profile'
import { clearModal } from './welcome'
import { clearGroupData } from './groups'

import firebase from 'firebase'

export const logout = () => {
   return dispatch => {
      firebase.auth().signOut()
         .catch(error => {
            console.log(error)
         });
      dispatch(clearGroupData())
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

            const userDeletedFrom = firebase.database().ref(`/deleting/${user.uid}`)
            const userGroupsRef = firebase.database().ref(`users/${user.uid}/groups`)
            let userGroups = []

            userGroupsRef.once('value', snapshot => {
               for (let key in snapshot.val()) {
                  userGroups.push({
                     groupKey: key,
                     groupId: snapshot.val()[key]
                  })
               }
            })
               .then(() => {
                  userDeletedFrom.on('child_added', snapshot => {
                     if (snapshot.val()) {
                        const deletingKey = snapshot.key

                        const deletingFrom =
                           userGroups.filter(group => {
                              return group.groupId === snapshot.val().deletedFrom
                           })

                        userDeletedFrom.child(deletingKey).remove()
                        userGroupsRef.child(deletingFrom[0].groupKey).remove()
                     }
                  })
               })
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
               dispatch(clearModal())
               authFinish()
            })
            .catch(error => {
               dispatch(authFinish())
               dispatch(authFailed())
               dispatch(showAlert('error', error.message))
               setTimeout(() => {
                  dispatch(clearAlert())
               }, 3000)
            })
      }
      else {
         firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(response => {
               dispatch(saveUserData(nick, response.user.uid, email));
               dispatch(authSuccess(response.user.uid));
               dispatch(clearModal())
               dispatch(authFinish());
            })
            .catch(error => {
               dispatch(authFinish())
               dispatch(authFailed())
               dispatch(showAlert('error', error.message))
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
   return dispatch => {
      const userData = {
         displayName: nick,
         email: email,
         groups: null
      }
      console.log(userData)
      firebase.database().ref(`/users/${userId}`).set(userData)
      const user = firebase.auth().currentUser
      user.updateProfile({
         displayName: nick,
         photoURL: `https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png`
      })
   }
}

//Saving display name in /displayNames to prevent reusing same nickname.