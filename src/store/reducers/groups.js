import * as actions from '../actions/actionTypes'

const initialState = {
   groups: [],
   usersList: [],
   invitationsCount: 0,
   loading: false
}

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actions.INIT_USER_GROUPS_SUCCESS:
         return {
            ...state,
            groups: action.updatedGroups,
            loading: false
         }
      case actions.INIT_USERS_LIST_SUCCESS:
         return {
            ...state,
            usersList: action.usersList
         }
      case actions.CLEAR_USER_GROUPS:
         return {
            ...state,
            groups: []
         }
      case actions.INIT_USER_GROUPS_START:
         return {
            ...state,
            loading: true
         }
      case actions.INIT_USER_GROUPS_FINISH:
         return {
            ...state,
            loading: false
         }
      case actions.CHECK_USERS_INVITATIONS_COUNT_SUCCESS:
         return {
            ...state,
            invitationsCount: action.counter
         }
      case actions.DECREMENT_INVITATIONS_COUNTER:
         return {
            ...state,
            invitationsCount: state.invitationsCount - 1
         }
   }
   return state
}

export default reducer