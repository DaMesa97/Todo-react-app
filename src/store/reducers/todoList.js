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
   },
   loading: false
}

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actions.INIT_TODOS:
         return {
            ...state,
            todos: action.fetchedTodos,
            loading: false
         }
      case actions.INIT_TODOS_START:
         return {
            ...state,
            loading: true
         }
      case actions.INIT_TODOS_FINISHED:
         return {
            ...state,
            loading: false,
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
               filteredTodos: action.newTodos,
            }
         }
      case actions.CLEAR_TODOS:
         return {
            ...state,
            todos: [],
            filter: {
               ...state.filter,
               filtering: false,
               filteredTodos: [],
               activeFilter: 'All'
            }
         }
      case actions.FILTER_ACTIVE:
         return {
            ...state,
            filter: {
               ...state.filter,
               filtering: true,
               filteredTodos: action.newTodos,
               activeFilter: action.filter
            }
         }
      case actions.FILTER_ALL:
         return {
            ...state,
            filter: {
               ...state.filter,
               filtering: true,
               filteredTodos: action.newTodos,
               activeFilter: action.filter
            }
         }
      case actions.FILTER_COMPLETED:
         return {
            ...state,
            filter: {
               ...state.filter,
               filtering: true,
               filteredTodos: action.newTodos,
               activeFilter: action.filter
            }
         }
      case actions.TOGGLE_TODO:
         return {
            ...state,
            todos: action.newTodos
         }
      case actions.TOGGLE_TODO_FILTERING:
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