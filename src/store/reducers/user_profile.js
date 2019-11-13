import * as actions from '../actions/actionTypes'

const initialState = {
   alert: {
      shown: false,
      type: null,
      message: null
   },
   registerDate: null,
   displayName: null,
   imgUrl: null,
   loading: false
}

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actions.UPDATE_DATA_START:
         return {
            ...state,
            loading: true
         }
      case actions.UPDATE_DATA_SUCCESS:
         return {
            ...state,
            displayName: action.displayName,
            imgUrl: action.userImg ? action.userImg : state.imgUrl,
            loading: false
         }
      case actions.INIT_USER_DATA_SUCCESS:
         return {
            ...state,
            displayName: action.displayName,
            imgUrl: action.userImg,
            registerDate: action.createdAt
         }
      case actions.CLEAR_USER_DATA:
         return {
            ...state,
            displayName: null,
            imgUrl: null,
            registerDate: null,
            completedTodos: null
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