import * as actions from '../actions/actionTypes'

const initialState = {
   displayName: null,
   userImg: null,
   alert: {
      shown: false,
      type: null,
      message: null
   }
}

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actions.UPDATE_DATA_SUCCESS:
         return {
            ...state,
            displayName: action.displayName,
            userImg: action.userImg
         }
      case actions.INIT_USER_DATA_SUCCESS:
         return {
            ...state,
            displayName: action.displayName,
            userImg: action.userImg
         }
      case actions.CLEAR_USER_DATA:
         return {
            ...state,
            displayName: null,
            userImg: null
         }
      case actions.SHOW_ALERT:
         return {
            ...state,
            alert: {
               ...state.alert,
               shown: true,
               type: action.alertType,
               message: action.message
            }
         }
      case actions.CLEAR_ALERT:
         return {
            ...state,
            alert: {
               ...state.alert,
               shown: false,
               type: null,
               message: null
            }
         }
   }
   return state;
}

export default reducer