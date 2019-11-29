import * as actions from '../actions/actionTypes'

const initialState = {
   userId: null,
   loading: false
}

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actions.AUTH_SUCCESS:
         return {
            ...state,
            userId: action.userId,
            loading: false
         }
      case actions.AUTH_FAILED:
         return {
            ...state,
            userId: null,
            loading: false
         }
      case actions.AUTH_LOGOUT:
         return {
            ...state,
            userId: null,
            loading: false
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