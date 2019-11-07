import React, { Component } from 'react';

import { NavLink } from 'react-router-dom'

import styles from './Header.module.css'
import { IoMdMenu as Hamburger } from "react-icons/io"

import Sidedrawer from '../Sidedrawer/Sidedrawer'

import { Redirect } from 'react-router-dom'



class Header extends Component {

   state = {
      sideDrawerOpen: false
   }

   shouldComponentUpdate(nextProps, nextState) {
      return nextProps.displayName !== this.props.displayName || nextProps.authenticated !== this.props.authenticated || nextProps.userImg !== this.props.userImg || nextState.sideDrawerOpen !== this.state.sideDrawerOpen
   }

   toggleSideDrawer = () => {
      this.setState({ sideDrawerOpen: !this.state.sideDrawerOpen })
      console.log(`click`)
   }

   render() {
      let welcome = null

      if (this.props.displayName && this.props.authenticated) {
         welcome = (
            <React.Fragment>
               <div className={styles.Welcome}>
                  <img src={this.props.userImg} alt="user-img" />
                  <p>Welcome, {this.props.displayName}</p>
               </div>
            </React.Fragment>
         )
      }

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
               <NavLink to='profile' activeClassName={styles.Active}><li>Profile</li></NavLink>
               <NavLink to='/todos' activeClassName={styles.Active}><li>Todos</li></NavLink>
               <li onClick={this.props.logout}>Logout</li>
            </ul>
         )
      }

      const hamburger = (
         <div className={styles.Hamburger}>
            < Hamburger onClick={this.toggleSideDrawer} />
         </div>
      )

      return (
         <React.Fragment>
            <nav className={styles.Nav}>
               {welcome}
               {hamburger}
               {list}
            </nav>
            <Sidedrawer
               active={this.state.sideDrawerOpen}
               authenticated={this.props.authenticated}
               clickedToggler={this.toggleSideDrawer}
               authClicked={this.props.authClicked}
               logout={this.props.logout} />
         </React.Fragment>
      );
   }

}

export default Header