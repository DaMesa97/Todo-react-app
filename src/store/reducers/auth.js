import * as actions from '../actions/actionTypes'

const initialState = {
   token: null,
   userId: null,
   userName: null,
   userImg: null,
   loading: false
}

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actions.AUTH_START:
         return {
            ...state,
            loading: true
         }
      case actions.AUTH_SUCCESS:
         return {
            ...state,
            token: action.token,
            userId: action.userId,
            loading: false
         }
      case actions.AUTH_LOGOUT:
         return {
            ...state,
            token: null,
            userId: null,
         }
   }
   return state;
}

export default reducer