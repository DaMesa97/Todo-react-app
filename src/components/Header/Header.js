import React, { Component } from 'react';

import { NavLink } from 'react-router-dom'

import styles from './Header.module.css'

import { Redirect } from 'react-router-dom'

class Header extends Component {

   navigationClickedHandler = (e) => {
      console.log(e.target.textContent)
   }

   render() {
      let list = (
         <ul onClick={(e) => this.props.authClicked(e)}>
            <li>Login</li>
            <li>Create account</li>
            {this.props.authenticated ? null : <Redirect to="/" />}
         </ul>
      )

      if (this.props.authenticated) {
         list = (
            <ul>
               <li>Profile</li>
               <NavLink to='/todos' activeClassName={styles.Active}><li>Todos</li></NavLink>
               <li onClick={this.props.logout}>Logout</li>
            </ul>
         )
      }

      return (
         <nav className={styles.Nav}>
            {list}
         </nav>
      );
   }

}

export default Header