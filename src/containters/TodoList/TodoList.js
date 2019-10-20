import React, { Component } from 'react';
import axios from 'axios'

import styles from './TodoList.module.css'

import Input from '../../components/UI/Input/Input'
import Alert from '../../components/UI/Alert/Alert'
import Todos from '../../components/Todos/Todos'

import { FaPlus } from "react-icons/fa";

class TodoList extends Component {
   state = {
      todos: [],
      inputValue: "",
      error: {
         state: false,
         message: ""
      },
      filtering: false,
      filteredTodos: [],
      activeFilter: 'All'
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

                  if (this.state.filtering) {
                     const updatedFilteredTodos = [...this.state.filteredTodos];
                     updatedFilteredTodos.push(newTodo);
                     this.setState({
                        filteredTodos: updatedFilteredTodos
                     })
                  }
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
      if (this.state.filtering) {
         let updatedFilteredTodos = [...this.state.filteredTodos]
         updatedFilteredTodos[e.target.id].completed = !updatedFilteredTodos[e.target.id].completed
         this.setState({
            filteredTodos: updatedFilteredTodos
         })

         axios.put(`https://todo-react-app-53813.firebaseio.com/Todos/${updatedFilteredTodos[e.target.id].name}.json`, updatedFilteredTodos[e.target.id])
      }

      else {
         let updatedTodos = [...this.state.todos]
         updatedTodos[e.target.id].completed = !updatedTodos[e.target.id].completed
         this.setState({
            todos: updatedTodos
         })

         axios.put(`https://todo-react-app-53813.firebaseio.com/Todos/${updatedTodos[e.target.id].name}.json`, updatedTodos[e.target.id])
      }
   }

   deleteTodoHandler = (e) => {
      console.log(e.target.id)

      let updatedTodos = this.state.todos.filter((todo) => {
         return todo.name !== this.state.todos[e.target.id].name
      })

      if (this.state.filtering) {
         let updatedFilteredTodos = this.state.filteredTodos.filter((todo) => {
            return todo.name !== this.state.filteredTodos[e.target.id].name
         })
         this.setState({
            filteredTodos: updatedFilteredTodos
         })
      }

      this.setState({
         todos: updatedTodos
      })
      axios.delete(`https://todo-react-app-53813.firebaseio.com/Todos/${this.state.todos[e.target.id].name}.json`)
   }

   filterClickedHandler = (e) => {
      let filteredTodos;
      switch (e.target.textContent) {
         case "Active":
            filteredTodos = this.state.todos.filter((todo) => {
               return todo.completed === false
            })
            this.setState({
               filteredTodos: filteredTodos,
               filtering: true,
               activeFilter: e.target.textContent
            })
            break;
         case "Completed":
            filteredTodos = this.state.todos.filter((todo) => {
               return todo.completed === true
            })
            this.setState({
               filteredTodos: filteredTodos,
               filtering: true,
               activeFilter: e.target.textContent
            })
            break;
         case "All":
            filteredTodos = this.state.todos
            this.setState({
               filteredTodos: filteredTodos,
               filtering: true,
               activeFilter: e.target.textContent
            })
            break;
         default:
            this.setState({
               filteredTodos: [],
               filtering: false,
               activeFilter: "Active"
            })
      }
   }

   enterSubmited = (e) => {
      if (e.keyCode === 13) {
         this.addTodoHandler();
      }
   }


   render() {
      let alert = null
      if (this.state.error.state) {
         alert = <Alert alertType="error">{this.state.error.message}</Alert>
      }

      let todos = <Todos activeFilter={this.state.activeFilter} todos={this.state.todos} clickedToggler={this.completedTodoHandler} clickedDelete={this.deleteTodoHandler} clickedFilter={this.filterClickedHandler} />
      if (this.state.filtering) {
         todos = <Todos activeFilter={this.state.activeFilter} todos={this.state.filteredTodos} clickedToggler={this.completedTodoHandler} clickedDelete={this.deleteTodoHandler} clickedFilter={this.filterClickedHandler} />
      }

      return (
         <React.Fragment>
            <div className={styles.TodoList}>
               {todos}
               <div className={styles.AddInput}>
                  <Input icon={true} placeholder="Add your todo" changed={this.changedInputHandler} value={this.state.inputValue} keyDown={this.enterSubmited} />
                  <FaPlus onClick={this.addTodoHandler} />
               </div>
               {alert}
            </div>
         </React.Fragment>
      )
   }
}

export default TodoList