import * as actions from './actionTypes'
import axios from 'axios'

const checkTodoIfExistsHandler = (todo, todos) => {
   const todosArr = [...todos]
   let exists = null

   todosArr.forEach(todoArr => {
      if (todoArr.value === todo) {
         exists = true
      }
   })
   return exists
}

export const initTodos = (userId, token, todos) => {
   return (dispatch) => {
      if (todos.length === 0) {
         dispatch(initTodosStart())
         if (userId) {
            axios.get(`https://todo-react-app-53813.firebaseio.com/users/${userId}.json?auth=${token}`)
               .then(response => {
                  if (response.data) {
                     const responseArr = Object.keys(response.data).map(key => {
                        return {
                           ...response.data[key],
                           name: key
                        }
                     })
                     dispatch(initTodosSuccess(responseArr))
                  }
                  else {
                     dispatch(initTodosFinished())
                  }
               })
               .catch(error => {
                  console.log(error)
               })
         }
      }
   }

}

const initTodosStart = () => {
   return {
      type: actions.INIT_TODOS_START
   }
}

const initTodosFinished = () => {
   return {
      type: actions.INIT_TODOS_FINISHED
   }
}
const initTodosSuccess = (todos) => {
   return {
      type: actions.INIT_TODOS,
      fetchedTodos: todos
   }
}

export const addTodoStart = (todo, filter, todos, userId, token) => {
   return (dispatch) => {

      if (todo !== "") {
         if (!checkTodoIfExistsHandler(todo, todos)) {
            let newTodo = {
               value: todo,
               completed: false
            }
            axios.post(`https://todo-react-app-53813.firebaseio.com/users/${userId}.json?auth=${token}`, newTodo)
               .then((response) => {
                  newTodo = {
                     ...newTodo,
                     name: response.data.name
                  }
                  dispatch(addTodoSuccess(newTodo, filter, todos))
                  if (filter.filtering) {
                     dispatch(addTodoSuccessFiltering(newTodo, filter, todos))
                  }
               })
               .catch((error) => {
                  dispatch(addTodoFail(false, false, error.response.data.error.message))
               })
         }
         else {
            const exists = true;
            dispatch(addTodoFail(false, exists, null))
            setTimeout(() => {
               dispatch(clearError())
            }, 3000)
         }
      }
      else {
         const empty = true;
         dispatch(addTodoFail(empty, false, null))
         setTimeout(() => {
            dispatch(clearError())
         }, 3000)
      }
   }
}

const addTodoSuccess = (newTodo, filter, todos) => {
   const updatedTodos = [...todos]
   updatedTodos.push(newTodo)
   console.log('redux dodaje')
   return {
      type: actions.ADD_TODO,
      newTodos: updatedTodos
   }
}

const addTodoSuccessFiltering = (newTodo, filter, todos) => {
   const updatedFilteredTodos = [...filter.filteredTodos];
   updatedFilteredTodos.push(newTodo);
   console.log('redux dodaje w filtrze')
   return {
      type: actions.ADD_TODO_FILTERING,
      newTodos: updatedFilteredTodos
   }
}

const addTodoFail = (empty, exists, errorValue) => {
   let message;
   if (exists) message = "Given todo already exists!"
   else if (empty) message = "Can't get empty string as todo!"
   else message = errorValue

   return {
      type: actions.ADD_TODO_FAILED,
      message: message
   }
}

const clearError = () => {
   return {
      type: actions.CLEAR_ERROR
   }
}

export const deleteTodo = (id, filter, todos, userId, token) => {
   return (dispatch) => {
      axios.delete(`https://todo-react-app-53813.firebaseio.com/users/${userId}/${todos[id].name}.json?auth=${token}`)
         .then(response => {
            if (filter.filtering) {
               dispatch(dispatch(deleteTodoSuccessFiltering(id, filter, todos)))
            }
            dispatch(deleteTodoSuccess(id, filter, todos))
         })
   }
}

const deleteTodoSuccess = (id, filter, todos) => {
   let updatedTodos = todos.filter((todo) => {
      return todo.name !== todos[id].name
   })

   return {
      type: actions.DELETE_TODO,
      newTodos: updatedTodos
   }
}

const deleteTodoSuccessFiltering = (id, filter, todos) => {
   let updatedFilteredTodos = filter.filteredTodos.filter((todo) => {
      return todo.name !== filter.filteredTodos[id].name
   })
   return {
      type: actions.DELETE_TODO_FILTERING,
      newTodos: updatedFilteredTodos
   }
}

export const filteringStart = (filterValue, todos) => {
   let filteredTodos;

   switch (filterValue) {
      case "All":
         filteredTodos = todos
         return {
            type: actions.FILTER_ALL,
            newTodos: filteredTodos,
            filter: filterValue
         }
      case "Active":
         filteredTodos = todos.filter((todo) => {
            return todo.completed === false
         })
         return {
            type: actions.FILTER_ACTIVE,
            newTodos: filteredTodos,
            filter: filterValue
         }
      case "Completed":
         filteredTodos = todos.filter((todo) => {
            return todo.completed === true
         })
         return {
            type: actions.FILTER_COMPLETED,
            newTodos: filteredTodos,
            filter: filterValue
         }
   }
}

export const toggleTodo = (id, filter, todos, userId, token) => {
   return (dispatch) => {
      if (filter.filtering) {
         let updatedFilteredTodos = [...filter.filteredTodos]
         updatedFilteredTodos[id].completed = !updatedFilteredTodos[id].completed
         axios.put(`https://todo-react-app-53813.firebaseio.com/users/${userId}/${updatedFilteredTodos[id].name}.json?auth=${token}`, updatedFilteredTodos[id])
            .then(response => {
               dispatch(toggleTodoSuccessFiltering(updatedFilteredTodos))
            })
            .catch(error => {
               console.log(error)
            })
      }

      else {
         let updatedTodos = [...todos]
         updatedTodos[id].completed = !updatedTodos[id].completed
         axios.put(`https://todo-react-app-53813.firebaseio.com/users/${userId}/${updatedTodos[id].name}.json?auth=${token}`, updatedTodos[id])
            .then(response => {
               dispatch(toggleTodoSuccess(updatedTodos))
            })
            .catch(error => {
               console.log(error)
            })
      }
   }
}

const toggleTodoSuccessFiltering = (newTodos) => {
   return {
      type: actions.TOGGLE_TODO_FILTERING,
      newTodos: newTodos
   }
}

const toggleTodoSuccess = (newTodos) => {
   return {
      type: actions.TOGGLE_TODO,
      newTodos: newTodos
   }
}

export const clearTodos = () => {
   return {
      type: actions.CLEAR_TODOS
   }
}