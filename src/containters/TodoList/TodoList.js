import React, { Component } from 'react';
import axios from 'axios'

import styles from './TodoList.module.css'

import Input from '../../components/UI/Input/Input'
import Alert from '../../components/UI/Alert/Alert'
import Todos from '../../components/Todos/Todos'

class TodoList extends Component {
   state = {
      todos: [],
      inputValue: "",
      error: {
         state: false,
         message: ""
      }
   }

   componentDidMount() {
      axios.get('https://todo-react-app-53813.firebaseio.com/Todos.json')
         .then(response => {
            if (response.data) {
               const responseArr = Object.keys(response.data).map(key => {
                  return {
                     ...response.data[key],
                     name: key
                  }
               })
               console.log(responseArr)
               this.setState({
                  todos: responseArr
               })
            }
         })
   }

   changedInputHandler = (e) => {
      this.setState({
         inputValue: e.target.value
      })
   }

   addTodoHandler = () => {
      const todoValue = this.state.inputValue

      if (todoValue !== "") {
         if (!this.checkTodoIfExistsHandler(todoValue)) {
            let newTodo = {
               value: todoValue,
               completed: false
            }
            axios.post('https://todo-react-app-53813.firebaseio.com/Todos.json', newTodo)
               .then((response) => {
                  newTodo = {
                     ...newTodo,
                     name: response.data.name
                  }
                  const updatedTodos = [...this.state.todos]
                  updatedTodos.push(newTodo)
                  this.setState({
                     todos: updatedTodos,
                     inputValue: ""
                  })
               })
         }
         else {
            this.setState({
               inputValue: "",
               error: {
                  state: true,
                  message: "Given todo already exists"
               }
            })
            setTimeout(() => {
               this.setState({
                  error: {
                     state: false,
                     message: ""
                  }
               })
            }, 1500)
         }
      }
      else {
         this.setState({
            inputValue: "",
            error: {
               state: true,
               message: "Can't get empty string as todo!"
            }
         })
         setTimeout(() => {
            this.setState({
               error: {
                  state: false,
                  message: ""
               }
            })
         }, 1500)
      }
   }


   checkTodoIfExistsHandler = (todo) => {
      const todosArr = [...this.state.todos]
      let exists = null

      todosArr.forEach(todoArr => {
         if (todoArr.value === todo) {
            exists = true
         }
      })
      return exists
   }

   completedTodoHandler = (e) => {
      let updatedTodos = [...this.state.todos]
      updatedTodos[e.target.id].completed = !updatedTodos[e.target.id].completed
      this.setState({
         todos: updatedTodos
      })

      axios.put(`https://todo-react-app-53813.firebaseio.com/Todos/${updatedTodos[e.target.id].name}.json`, updatedTodos[e.target.id])
   }

   deleteTodoHandler = (e) => {
      let updatedTodos = this.state.todos.filter((todo) => {
         return todo.name !== this.state.todos[e.target.parentNode.firstChild.id].name
      })
      this.setState({
         todos: updatedTodos
      })

      axios.delete(`https://todo-react-app-53813.firebaseio.com/Todos/${this.state.todos[e.target.parentNode.firstChild.id].name}.json`)
   }

   render() {
      let alert = null

      if (this.state.error.state) {
         alert = <Alert alertType="error">{this.state.error.message}</Alert>
      }

      return (
         <React.Fragment>
            <header>header with logo and login options</header>
            <div>Todo app!</div>
            <div className={styles.TodoList}>
               <input placeholder="Filter"></input>
               <Todos todos={this.state.todos} clickedToggler={this.completedTodoHandler} clickedDelete={this.deleteTodoHandler} />
               <Input placeholder="Add your todo" changed={this.changedInputHandler} value={this.state.inputValue} clicked={this.addTodoHandler} />
               {alert}
            </div>
         </React.Fragment>
      )
   }
}

export default TodoList