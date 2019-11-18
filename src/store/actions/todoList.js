import * as actions from './actionTypes'

import firebase from 'firebase'

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

export const initTodos = (todos) => {
   return (dispatch) => {
      if (todos.length === 0) {
         dispatch(initTodosStart())
         const user = firebase.auth().currentUser
         firebase.database().ref(`/todos/${user.uid}`).once('value', response => {
            if (response.val()) {
               const todosArr = Object.keys(response.val()).map(key => {
                  return {
                     ...response.val()[key],
                     name: key
                  }
               })
               dispatch(initTodosSuccess(todosArr))
            }
            else {
               dispatch(initTodosFinished())
            }
         })
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

export const addTodoStart = (todo, filter, todos) => {
   return (dispatch) => {
      if (todo !== "") {
         if (!checkTodoIfExistsHandler(todo, todos)) {
            const user = firebase.auth().currentUser
            const todoRef = firebase.database().ref(`/todos/${user.uid}`)
            let newTodo = {
               value: todo,
               completed: false,
            }
            todoRef.push(newTodo)
               .then((response) => {
                  newTodo = {
                     ...newTodo,
                     name: response.key
                  }
                  dispatch(addTodoSuccess(newTodo, filter, todos))
                  if (filter.filtering) {
                     dispatch(addTodoSuccessFiltering(newTodo, filter, todos))
                  }
               })
               .catch((error) => {
                  console.log(error)
                  // Dodac jakis dispatch errora bazujacy na error message
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
   return {
      type: actions.ADD_TODO,
      newTodos: updatedTodos
   }
}

const addTodoSuccessFiltering = (newTodo, filter, todos) => {
   const updatedFilteredTodos = [...filter.filteredTodos];
   updatedFilteredTodos.push(newTodo);
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

export const deleteTodo = (id, filter, todos) => {
   return (dispatch) => {
      const user = firebase.auth().currentUser
      const todoRef = firebase.database().ref(`/todos/${user.uid}/${todos[id].name}`)
      todoRef.remove()
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

export const toggleTodo = (id, filter, todos) => {
   return (dispatch) => {
      const user = firebase.auth().currentUser
      if (filter.filtering) {
         let updatedFilteredTodos = [...filter.filteredTodos]
         updatedFilteredTodos[id].completed = !updatedFilteredTodos[id].completed
         dispatch(toggleTodoSuccessFiltering(updatedFilteredTodos))
         const todoRef = firebase.database().ref(`/todos/${user.uid}/${updatedFilteredTodos[id].name}`)
         todoRef.set({ ...updatedFilteredTodos[id] })
            .catch(error => {
               console.log(error)
            })
      }
      else {
         let updatedTodos = [...todos]
         updatedTodos[id].completed = !updatedTodos[id].completed
         dispatch(toggleTodoSuccess(updatedTodos))
         const todoRef = firebase.database().ref(`/todos/${user.uid}/${updatedTodos[id].name}`)
         todoRef.set({ ...updatedTodos[id] })
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