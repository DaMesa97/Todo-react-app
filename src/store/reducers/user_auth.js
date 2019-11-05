import * as actions from '../actions/actionTypes'

const initialState = {
   token: null,
   userId: null,
   loading: false
}

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actions.AUTH_SUCCESS:
         return {
            ...state,
            token: action.token,
            userId: action.userId,
            loading: false
         }
      case actions.AUTH_FAILED:
         return {
            ...state,
            token: null,
            userId: null,
            loading: false
         }
      case actions.AUTH_LOGOUT:
         return {
            ...state,
            token: null,
            userId: null,
         }
      case actions.AUTH_START:
         return {
            ...state,
            loading: true
         }
      case actions.AUTH_FINISH:
         return {
            ...state,
            loading: false
         }
   }
   return state;
}

export default reducer