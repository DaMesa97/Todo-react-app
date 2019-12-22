import * as actions from './actionTypes'
import firebase from 'firebase'

export const initUserGroups = (usersGroups) => {
   return (dispatch, getState) => {
      const state = getState().groups;
      dispatch(initUserGroupsStart())
      if (usersGroups) {
         if (state.groups && (state.groups.length === 0 || state.groups.length !== Object.keys(usersGroups).length)) {
            dispatch(clearUserGroups())
            const userGroupsToFetch = []
            const groupsRef = firebase.database().ref(`/groups`)
            for (let key in usersGroups) {
               userGroupsToFetch.push(usersGroups[key])
            }
            const updatedGroups = [...state.groups]

            userGroupsToFetch.map((group, index) => {
               let finishedMapping = false;
               groupsRef.orderByKey().equalTo(group).once('value', response => {
                  if (response.val() !== null) {
                     const fetchedGroup = response.val()[Object.keys(response.val())]
                     console.log(index, userGroupsToFetch)
                     // const fetchedGroupMembers = fetchedGroup.members
                     // console.log(fetchedGroupMembers, `Group members ID's`)
                     updatedGroups.push({ ...fetchedGroup, groupId: Object.keys(response.val())[0] })
                  }
               })
                  .then(response => {
                     if (index === userGroupsToFetch.length - 1) {
                        finishedMapping = true
                     }

                     if (userGroupsToFetch.length === updatedGroups.length) {
                        dispatch(initUserGroupsSuccess(updatedGroups))
                        dispatch(listenForUserGroupsChanges())
                     }
                     else if (finishedMapping && userGroupsToFetch.length !== updatedGroups.length) {
                        const userId = getState().firebase.auth.uid
                        const userGroupsRef = firebase.database().ref(`users/${userId}/groups`)
                        const updatedGroupsKeys = []
                        updatedGroups.forEach(group => {
                           console.log(group)
                           updatedGroupsKeys.push(group.groupId)
                        })
                        const missingGroups = userGroupsToFetch.filter(group => {
                           return !updatedGroupsKeys.includes(group)
                        })
                        userGroupsRef.once('value', snapshot => {
                           Object.keys(snapshot.val()).forEach(key => {
                              missingGroups.forEach(group => {
                                 if (snapshot.val()[key] === group) {
                                    userGroupsRef.child(key).remove()
                                 }
                              })
                           })
                        })
                        dispatch(initUserGroupsSuccess(updatedGroups))
                     }
                  })
            })
         }
         else {
            dispatch(initUserGroupsFinish())
         }
      }
      else {
         dispatch(initUserGroupsFinish())
      }
   }
}

const listenForUserGroupsChanges = () => {
   return (dispatch, getState) => {
      const userGroupsState = getState().groups.groups
      const userId = firebase.auth().currentUser.uid
      const userGroupsRef = firebase.database().ref(`users/${userId}/groups`)

      userGroupsRef.on("child_removed", snapshot => {
         const updatedUserGroups = userGroupsState.filter(group => {
            return group.groupId !== snapshot.val()
         })
         dispatch(initUserGroupsSuccess(updatedUserGroups))
      })
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

export const clearGroupData = () => {
   return {
      type: actions.CLEAR_GROUP_DATA
   }
}