import React from 'react';

import styles from './Todo.module.css'

import { MdClose } from "react-icons/md"

const todo = (props) => {

   let activeClasses = [styles.TodoElement]

   if (props.completed) {
      activeClasses.push(styles.Completed)
   }

   const todo = (
      < div className={styles.Todo} >
         <li className={activeClasses.join(' ')} onClick={props.clickedToggler} id={props.id}>{props.value}</li>
         <div onClick={props.clickedDelete} className={styles.DeleteIcon} id={props.id}><MdClose id={props.id} /></div>
      </div >)

   return (
      todo
   );
}

export default todo;