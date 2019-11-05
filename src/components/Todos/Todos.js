import React, { PureComponent } from 'react';

import Todo from './Todo/Todo'
import styles from './Todos.module.css'
import Button from '../UI/Button/Button'
import Input from '../UI/Input/Input'

class Todos extends PureComponent {
   state = {
      filters: [
         'Active',
         'Completed',
         'All'
      ],
      searching: false,
      searchedTodos: []
   }

   searchingHandler = (e) => {
      if (this.props.todos.length > 0 && e.target.value.length > 0) {
         this.setState({ searching: true });
         let searchedTodos = this.props.todos.filter(todo => {
            return todo.value.toLowerCase().includes(e.target.value.toLowerCase())
         })
         this.setState({ searchedTodos: searchedTodos })
      }
      else {
         this.setState({
            searching: false,
            searchedTodos: []
         })
      }
   }

   render() {
      let todosList = this.props.todos.map((todo, index) => {
         return <Todo completed={todo.completed} value={todo.value} key={index} id={index} clickedToggler={this.props.clickedToggler} clickedDelete={this.props.clickedDelete} />
      })

      if (this.state.searching) {
         todosList = this.state.searchedTodos.map((todo, index) => {
            return <Todo completed={todo.completed} value={todo.value} key={index} id={index} clickedToggler={this.props.clickedToggler} clickedDelete={this.props.clickedDelete} />
         })
      }

      let buttons = this.state.filters.map(button => {
         return button === this.props.activeFilter ? <Button key={button} active clicked={this.props.clickedFilter}>{button}</Button> : <Button key={button} clicked={this.props.clickedFilter}>{button}</Button>
      })

      return (
         <React.Fragment>
            <Input elementConfig={{ type: 'input', placeholder: 'Search...' }} changed={this.searchingHandler} placeholder="Filter" />
            <div className={styles.Buttons}>{buttons}</div>
            {todosList}
         </React.Fragment>
      )
   }
}

export default Todos