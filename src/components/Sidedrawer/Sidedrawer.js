import React from 'react';

import { NavLink, Redirect } from 'react-router-dom'

import Backdrop from '../UI/Backdrop/Backdrop'
import styles from './Sidedrawer.module.css'

const sidedrawer = (props) => {

   let activeClasses = [styles.Sidedrawer]

   if (props.active) {
      activeClasses.push(styles.Active)
   }

   let list = (
      <ul onClick={(e) => {
         props.authClicked(e)
         props.clickedToggler()
      }}>
         <li>Login</li>
         <li>Create account</li>
         {props.authenticated ? null : <Redirect to="/" />}
      </ul>
   )

   if (props.authenticated) {
      list = (
         <ul >
            <NavLink to='profile' activeClassName={styles.Active} onClick={props.clickedToggler}><li>Profile</li></NavLink>
            <NavLink to='/todos' activeClassName={styles.Active} onClick={props.clickedToggler}><li>Todos</li></NavLink>
            <li onClick={() => {
               props.clickedToggler()
               props.logout()
            }}>Logout</li>
         </ul>
      )
   }

   return (
      <React.Fragment>
         <Backdrop show={props.active} clicked={props.clickedToggler} />
         <div className={activeClasses.join(' ')}>
            <div className={styles.Logo}>LOGO</div>
            {list}
         </div>
      </React.Fragment>
   )
}
export default sidedrawer