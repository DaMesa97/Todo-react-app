import React, { PureComponent } from 'react';
import { connect } from 'react-redux'

import styles from './TodoList.module.css'

import Input from '../../components/UI/Input/Input'
import Alert from '../../components/UI/Alert/Alert'
import Todos from '../../components/Todos/Todos'
import Spinner from '../../components/UI/Spinner/Spinner'

import { FaPlus } from "react-icons/fa";

import { addTodoStart, initTodos, deleteTodo, filteringStart, toggleTodo } from '../../store/actions/todoList'

class TodoList extends PureComponent {
   state = {
      inputValue: "",
      initializing: false
   }

   componentDidMount() {
      this.props.onInitTodos(this.props.todos)
   }

   componentDidUpdate(prevProps) {
      if (this.props.token !== null && !this.state.initializing) {
         this.setState({ initializing: true })
         this.props.onInitTodos(this.props.todos)
      }

      if (prevProps.todos !== this.props.todos) {
         this.setState({ initializing: false })
      }
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
      this.props.onToggleTodo(e.target.id, this.props.filter, this.props.todos)
   }

   deleteTodoHandler = (e) => {
      this.props.onDeleteTodo(e.target.id, this.props.filter, this.props.todos)
   }

   filterClickedHandler = (e) => {
      this.props.onFilterTodos(e.target.textContent, this.props.todos)
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

      if (this.props.loading) {
         todos = < Spinner />
      }

      return (
         <React.Fragment>
            <div className={styles.TodoList}>
               <div className={styles.Todos}>{todos}</div>
               <div className={styles.AddInput}>
                  <Input
                     elementConfig={{ type: 'input', placeholder: 'Add todo...' }}
                     changed={this.changedInputHandler}
                     value={this.state.inputValue}
                     keyDown={this.enterSubmited} />
                  <FaPlus onClick={this.addTodoHandler} />
               </div>
               {alert}
            </div>
         </React.Fragment>
      )
   }
}

const mapStateToProps = (state) => ({
   todos: state.todoList.todos,
   filter: state.todoList.filter,
   error: state.todoList.error,
   loading: state.todoList.loading,
})

const mapDispatchToProps = dispatch => {
   return {
      onTodoAdded: (todo, filter, todos) => { dispatch(addTodoStart(todo, filter, todos)) },
      onInitTodos: (todos) => { dispatch(initTodos(todos)) },
      onDeleteTodo: (e, filter, todos) => { dispatch(deleteTodo(e, filter, todos)) },
      onFilterTodos: (filterValue, todos) => { dispatch(filteringStart(filterValue, todos)) },
      onToggleTodo: (id, filter, todos) => { dispatch(toggleTodo(id, filter, todos)) }
   }
}


export default connect(mapStateToProps, mapDispatchToProps)(TodoList)