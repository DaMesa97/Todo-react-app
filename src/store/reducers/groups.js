import * as actions from '../actions/actionTypes'

const initialState = {
   groups: [],
   usersList: []
}

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actions.INIT_USER_GROUPS_SUCCESS:
         return {
            ...state,
            groups: action.updatedGroups
         }
      case actions.INIT_USERS_LIST_SUCCESS:
         return {
            ...state,
            usersList: action.usersList
         }
   }
   return state
}

export default reducer