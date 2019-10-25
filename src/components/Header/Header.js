import React from 'react';

import styles from './Header.module.css'

import { Redirect } from 'react-router-dom'

const header = (props) => {
   let list = (
      <ul>
         <li>Login</li>
         <li>Create account</li>
         {props.authenticated ? null : <Redirect to="/" />}
      </ul>
   )

   if (props.authenticated) {
      list = (
         <ul>
            <li>Profile</li>
            <li>Todos</li>
            <li onClick={props.logout}>Logout</li>
         </ul>
      )
   }

   return (
      <nav className={styles.Nav}>
         {list}
      </nav>
   );
}

export default header