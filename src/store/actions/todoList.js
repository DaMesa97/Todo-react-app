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

export const initTodos = () => {
   return (dispatch) => {
      axios.get('https://todo-react-app-53813.firebaseio.com/Todos.json')
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
         })
         .catch(error => {
            console.log(error)
         })
   }
}

const initTodosSuccess = (todos) => {
   return {
      type: actions.INIT_TODOS,
      fetchedTodos: todos
   }
}

export const addTodoStart = (todo, filter, todos) => {
   return (dispatch) => {

      if (todo !== "") {
         if (!checkTodoIfExistsHandler(todo, todos)) {
            let newTodo = {
               value: todo,
               completed: false
            }
            axios.post('https://todo-react-app-53813.firebaseio.com/Todos.json', newTodo)
               .then((response) => {
                  newTodo = {
                     ...newTodo,
                     name: response.data.name
                  }
                  dispatch(addTodoSuccess(newTodo, filter, todos))
               })
               .catch((error) => {
                  console.log(error)
               })
         }
         else {
            const exists = true;
            dispatch(addTodoFail(exists))
            setTimeout(() => {
               dispatch(clearError())
            }, 3000)
         }
      }
      else {
         const empty = true;
         dispatch(addTodoFail(empty))
         setTimeout(() => {
            dispatch(clearError())
         }, 3000)
      }
   }
}

const addTodoSuccess = (newTodo, filter, todos) => {
   if (filter.filtering) {
      const updatedFilteredTodos = [...filter.filteredTodos];
      updatedFilteredTodos.push(newTodo);
      console.log('redux dodaje w filtrze')
      return {
         type: actions.ADD_TODO_FILTERING,
         newTodos: updatedFilteredTodos
      }
   }
   else {
      const updatedTodos = [...todos]
      updatedTodos.push(newTodo)
      console.log('redux dodaje')
      return {
         type: actions.ADD_TODO,
         newTodos: updatedTodos
      }
   }
}

const addTodoFail = (empty, exists) => {
   let message;

   if (exists) message = "Given todo already exists!"

   else if (empty) message = "Can't get empty string as todo!"

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

export const deleteTodo = (id, filter, todos) => {
   return (dispatch) => {
      axios.delete(`https://todo-react-app-53813.firebaseio.com/Todos/${todos[id].name}.json`)
         .then(response => {
            dispatch(deleteTodoSuccess(id, filter, todos))
         })
   }
}

const deleteTodoSuccess = (id, filter, todos) => {
   if (filter.filtering) {
      let updatedFilteredTodos = filter.filteredTodos.filter((todo) => {
         return todo.name !== filter.filteredTodos[id].name
      })
      console.log('deleteTodoFiltering')
      return {
         type: actions.DELETE_TODO_FILTERING,
         newTodos: updatedFilteredTodos
      }
   }
   else {
      let updatedTodos = todos.filter((todo) => {
         return todo.name !== todos[id].name
      })
      console.log('deleteTodo')
      return {
         type: actions.DELETE_TODO,
         newTodos: updatedTodos
      }
   }
}