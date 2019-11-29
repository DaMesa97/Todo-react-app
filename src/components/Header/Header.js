import React, { Component } from 'react';

import { NavLink, withRouter } from 'react-router-dom'

import styles from './Header.module.css'
import { IoMdMenu as Hamburger } from "react-icons/io"

import Backdrop from '../UI/Backdrop/Backdrop'

class Header extends Component {
   state = {
      sidedrawerActive: false
   }

   // shouldComponentUpdate(nextProps, nextState) {
   //    return nextProps.displayName !== this.props.displayName || nextProps.authenticated !== this.props.authenticated || nextState.sidedrawerActive !== this.state.sidedrawerActive
   // }

   toggleSidedrawerHandler = () => {
      this.setState({ sidedrawerActive: !this.state.sidedrawerActive })
   }

   optionClickedHandler = (e) => {
      this.props.authClicked(e)
      if (window.innerWidth < 500) {
         this.toggleSidedrawerHandler()
      }
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
         <ul onClick={(e) => this.optionClickedHandler(e)}>
            <li>Login</li>
            <li>Create account</li>
         </ul>
      )

      if (this.props.authenticated) {
         list = (
            <ul onClick={window.innerWidth < 500 ? this.toggleSidedrawerHandler : null}>
               <NavLink to='/profile' activeClassName={styles.Active}><li>Profile</li></NavLink>
               <NavLink to='/todos' activeClassName={styles.Active}><li>Todos</li></NavLink>
               <NavLink to='/groups' activeClassName={styles.Active}><li>Groups</li></NavLink>
               <li onClick={this.props.logout}>Logout</li>
            </ul>
         )
      }

      const hamburger = (
         <div className={styles.Hamburger}>
            < Hamburger onClick={this.toggleSidedrawerHandler} />
         </div>
      )

      const logo = (
         <div className={styles.Logo}>LOGO</div>
      )

      const activeSidedrawerClasses = [styles.Sidedrawer]
      if (this.state.sidedrawerActive) {
         activeSidedrawerClasses.push(styles.Active)
      }
      const sidedrawer = (
         <React.Fragment>
            <div className={activeSidedrawerClasses.join(' ')}>
               {logo}
               {list}
            </div>
            < Backdrop show={this.state.sidedrawerActive} clicked={this.toggleSidedrawerHandler} />
         </React.Fragment>
      )

      return (
         <React.Fragment>
            <nav className={styles.Nav}>
               {welcome}
               {hamburger}
               {list}
               {sidedrawer}
            </nav>
         </React.Fragment>
      );
   }

}

export default withRouter(Header)