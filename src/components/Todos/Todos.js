import React, { Component } from 'react';

import Todo from './Todo/Todo'
import styles from './Todos.module.css'
import Button from '../UI/Button/Button'

class Todos extends Component {
   state = {
      filteredTodos: [],
      filtering: false
   }

   filterClickedHandler = (e) => {
   }

   render() {
      let todosList = this.props.todos.map((todo, index) => {
         return <Todo completed={todo.completed} value={todo.value} key={index} id={index} clickedToggler={this.props.clickedToggler} clickedDelete={this.props.clickedDelete} />
      })

      return (
         <React.Fragment>
            <div className={styles.Buttons}>
               <Button clicked={this.filterClickedHandler}>Active</Button>
               <Button clicked={this.filterClickedHandler}>Completed</Button>
               <Button clicked={this.filterClickedHandler}>All</Button>
            </div>
            {todosList}
         </React.Fragment>
      )
   }
}

export default Todos