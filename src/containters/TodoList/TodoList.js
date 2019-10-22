import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'

import styles from './TodoList.module.css'

import Input from '../../components/UI/Input/Input'
import Alert from '../../components/UI/Alert/Alert'
import Todos from '../../components/Todos/Todos'

import { FaPlus } from "react-icons/fa";

import { addTodoStart, initTodos, deleteTodo, filteringStart } from '../../store/actions/todoList'

class TodoList extends Component {
   state = {
      inputValue: ""
   }

   componentDidMount() {
      this.props.onInitTodos()
   }

   changedInputHandler = (e) => {
      this.setState({
         inputValue: e.target.value
      })
   }

   addTodoHandler = () => {
      this.props.onTodoAdded(this.state.inputValue, this.props.filter, this.props.todos)
      this.setState({
         inputValue: ""
      })
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
      this.props.onDeleteTodo(e.target.id, this.props.filter, this.props.todos)
   }

   filterClickedHandler = (e) => {
      this.props.onFilterTodos(e.target.textContent, this.props.todos)
   }
   componentDidUpdate() {
      console.log(this.props.filter.filteredTodos)
   }

   enterSubmited = (e) => {
      if (e.keyCode === 13) {
         this.addTodoHandler();
      }
   }


   render() {
      let alert = null

      if (this.props.error.state) {
         alert = <Alert alertType="error">{this.props.error.message}</Alert>
      }

      let todos = <Todos activeFilter={this.props.filter.activeFilter} todos={this.props.todos} clickedToggler={this.completedTodoHandler} clickedDelete={this.deleteTodoHandler} clickedFilter={this.filterClickedHandler} />
      if (this.props.filter.filtering) {
         todos = <Todos activeFilter={this.props.filter.activeFilter} todos={this.props.filter.filteredTodos} clickedToggler={this.completedTodoHandler} clickedDelete={this.deleteTodoHandler} clickedFilter={this.filterClickedHandler} />
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

const mapStateToProps = (state) => ({
   todos: state.todos,
   filter: state.filter,
   error: state.error
})

const mapDispatchToProps = dispatch => {
   return {
      onTodoAdded: (todo, filter, todos) => { dispatch(addTodoStart(todo, filter, todos)) },
      onInitTodos: () => { dispatch(initTodos()) },
      onDeleteTodo: (e, filter, todos) => { dispatch(deleteTodo(e, filter, todos)) },
      onFilterTodos: (filterValue, todos) => { dispatch(filteringStart(filterValue, todos)) }
   }
}


export default connect(mapStateToProps, mapDispatchToProps)(TodoList)