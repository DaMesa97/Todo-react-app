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

export const initTodos = (todos, isGroup, groupId) => {
   return (dispatch) => {
      const todosRef = firebase.database().ref(`/todos`)
      if (todos.length === 0 && !isGroup) {
         dispatch(initTodosStart())
         const user = firebase.auth().currentUser
         dispatch(listenForTodosChanges(todosRef.child(user.uid)))
         setTimeout(() => {
            dispatch(initTodosFinished())
         }, 300)
      }
      else if (isGroup) {
         dispatch(clearTodos())
         dispatch(initTodosStart())
         dispatch(listenForTodosChanges(todosRef.child(groupId)))
         setTimeout(() => {
            dispatch(initTodosFinished())
         }, 300)
      }
   }
}

const listenForTodosChanges = (listeningPath) => {
   return (dispatch, getState) => {
      listeningPath.on('child_added', snapshot => {
         dispatch(addTodoToState({ ...snapshot.val(), name: snapshot.key }))
      })

      listeningPath.on('child_removed', snapshot => {
         const todosArr = getState().todoList.todos
         const updatedTodosArr = todosArr.filter(todo => {
            return todo.name !== snapshot.val().name
         })

         console.log(snapshot.val().name)
         dispatch(removeTodoFromState(updatedTodosArr))
      })
   }
}

//Dodac loadery przy pobieraniu todos.

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

const addTodoToState = (todo) => {
   return {
      type: actions.ADD_TODO_TO_STATE,
      todo: todo
   }
}

export const addTodoStart = (todo, filter, todos, isGroup, groupId) => {
   return (dispatch) => {
      if (todo !== "") {
         if (!checkTodoIfExistsHandler(todo, todos)) {
            const user = firebase.auth().currentUser
            const todoRef = firebase.database().ref(`/todos/${isGroup ? groupId : user.uid}`)
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
                  todoRef.child(response.key).set({ ...newTodo })
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
      if (filter.filtering) {
         dispatch(deleteTodoSuccessFiltering(id, filter, todos))
      }
   }
}

const removeTodoFromState = (updatedTodos) => {
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

export const clearTodosListener = (isGroup, groupId) => {
   return dispatch => {
      let todosListeningRef;
      const userId = firebase.auth().currentUser.uid
      if (isGroup) {
         todosListeningRef = firebase.database().ref(`todos/${groupId}`)
      }
      else {
         todosListeningRef = firebase.database().ref(`todos/${userId}`)
      }
      todosListeningRef.off()
   }
}