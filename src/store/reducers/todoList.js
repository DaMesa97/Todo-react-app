import * as actions from '../actions/actionTypes'

const initialState = {
   todos: [],
   error: {
      state: false,
      message: ""
   },
   filter: {
      filtering: false,
      filteredTodos: [],
      activeFilter: 'All'
   }
}

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actions.INIT_TODOS:
         return {
            ...state,
            todos: action.fetchedTodos
         }
      case actions.ADD_TODO:
         return {
            ...state,
            todos: action.newTodos
         }
      case actions.ADD_TODO_FILTERING:
         return {
            ...state,
            filter: {
               ...state.filter,
               filteredTodos: action.newTodos
            }
         }
      case actions.ADD_TODO_FAILED:
         return {
            ...state,
            error: {
               ...state.error,
               state: true,
               message: action.message
            }
         }
      case actions.CLEAR_ERROR:
         return {
            ...state,
            error: {
               ...state.error,
               state: false,
               message: ""
            }
         }
      case actions.DELETE_TODO:
         return {
            ...state,
            todos: action.newTodos
         }
      case actions.DELETE_TODO_FILTERING:
         return {
            ...state,
            filter: {
               ...state.filter,
               filteredTodos: action.newTodos
            }
         }
      default: return state;
   }
}

export default reducer