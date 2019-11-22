import * as actions from './actionTypes'
import firebase from 'firebase'

export const initUserGroups = (usersGroups) => {
   return (dispatch, getState) => {
      const state = getState().groups;
      if (state.groups.length === 0) {
         const userGroupsToFetch = []
         const groupsRef = firebase.database().ref(`/groups`)
         for (let key in usersGroups) {
            userGroupsToFetch.push(usersGroups[key])
         }
         const updatedGroups = [...state.groups]
         userGroupsToFetch.map(group => {
            groupsRef.orderByKey().equalTo(group).on('child_added', response => {
               if (response.val() !== null) {
                  updatedGroups.push({ ...response.val(), groupId: response.key })
                  dispatch(initUserGroupsSuccess(updatedGroups))
               }
            })
         })
      }
   }
}

const initUserGroupsSuccess = (updatedGroups) => {
   return {
      type: actions.INIT_USER_GROUPS_SUCCESS,
      updatedGroups: updatedGroups
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
         console.log(usersList)
      })
   }
}

const initUsersSuccess = (usersList) => {
   return {
      type: actions.INIT_USERS_LIST_SUCCESS,
      usersList: usersList
   }
}