import * as actions from './actionTypes'
import firebase from 'firebase'

export const initUserGroups = (usersGroups) => {
   return (dispatch, getState) => {
      const state = getState().groups;
      dispatch(initUserGroupsStart())
      if (state.groups && (state.groups.length === 0 || state.groups.length !== Object.keys(usersGroups).length)) {
         if (!usersGroups) {
            dispatch(initUserGroupsFinish())
         }
         else {
            dispatch(clearUserGroups())
            const userGroupsToFetch = []
            const groupsRef = firebase.database().ref(`/groups`)
            for (let key in usersGroups) {
               userGroupsToFetch.push(usersGroups[key])
            }
            const updatedGroups = [...state.groups]
            userGroupsToFetch.map(group => {
               groupsRef.orderByKey().equalTo(group).once('value', response => {
                  if (response.val() !== null) {
                     updatedGroups.push({ ...response.val()[Object.keys(response.val())], groupId: Object.keys(response.val())[0] })
                  }
               })
                  .then(response => {
                     if (userGroupsToFetch.length === updatedGroups.length) {
                        dispatch(initUserGroupsSuccess(updatedGroups))
                     }
                  })
            })
         }
      }
      else {
         dispatch(initUserGroupsFinish())
      }
   }
}

const initUserGroupsSuccess = (updatedGroups) => {
   return {
      type: actions.INIT_USER_GROUPS_SUCCESS,
      updatedGroups: updatedGroups
   }
}

const initUserGroupsStart = () => {
   return {
      type: actions.INIT_USER_GROUPS_START
   }
}
const clearUserGroups = () => {
   return {
      type: actions.CLEAR_USER_GROUPS
   }
}
export const initUsersList = () => {
   return dispatch => {
      const usersList = []
      const usersRef = firebase.database().ref('/users')
      usersRef.once('value', response => {
         Object.keys(response.val()).map(key => {
            const user = {
               userId: key,
               ...response.val()[key]
            }
            usersList.push(user)
         })
      }).then(response => {
         dispatch(initUsersSuccess(usersList))
      })
   }
}

const initUsersSuccess = (usersList) => {
   return {
      type: actions.INIT_USERS_LIST_SUCCESS,
      usersList: usersList
   }
}

const initUserGroupsFinish = () => {
   return {
      type: actions.INIT_USER_GROUPS_FINISH
   }
}

export const checkUserInvitationsCount = () => {
   return dispatch => {
      const user = firebase.auth().currentUser
      const invitationsRef = firebase.database().ref(`/invitations/${user.uid}`)

      invitationsRef.once('value', snapshot => {
         if (snapshot.val()) {
            dispatch(checkUserInvitationsCountSuccess(Object.keys(snapshot.val()).length))
         }
      })
   }
}

const checkUserInvitationsCountSuccess = (counter) => {
   return {
      type: actions.CHECK_USERS_INVITATIONS_COUNT_SUCCESS,
      counter: counter
   }
}

export const decrementInvitationCounter = () => {
   return {
      type: actions.DECREMENT_INVITATIONS_COUNTER
   }
}