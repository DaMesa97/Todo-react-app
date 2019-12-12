import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'

import { authCheckState, logout } from './store/actions/user_auth'
import { toggleModal } from './store/actions/welcome'
import { trackNotifications, stopNotificationsTrack } from './store/actions/user_profile'

import './App.css';
import Welcome from './containters/Welcome/Welcome'
import TodoList from './containters/TodoList/TodoList'
import Profile from './containters/Profile/Profile'
import Groups from './containters/Groups/Groups'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Notifications from './components/Notifications/Notifications'

import PrivateRoute from './hoc/PrivateRoute/PrivateRoute'

class App extends Component {
   state = {
      notifications: [],
      listeningForNotifications: false
   }

   componentDidMount() {
      if (!this.props.authenticated) {
         this.props.onLoginCheck()
      }
   }

   logoutHandler = () => {
      this.props.onLogout(this.props.userId);
      this.props.history.push('/')
   }

   render() {
      return (
         <div className="App">
            <Header authClicked={this.props.onModalToggle}
               authenticated={this.props.authenticated}
               displayName={this.props.displayName}
               logout={this.logoutHandler}
               clicked={this.navigationClickedHandler}
               userImg={this.props.imgUrl} />
            {this.props.authenticated ? <Redirect to='/todos' /> : null}
            <Switch>
               <PrivateRoute path='/profile' component={Profile} authenticated={this.props.authenticated} />
               <PrivateRoute path='/todos' component={TodoList} authenticated={this.props.authenticated} />
               <PrivateRoute path='/groups' component={Groups} authenticated={this.props.authenticated} />
               <Route path='/' component={Welcome} />
            </Switch>
            < Footer />
            < Notifications />
         </div>
      );
   }
}

const mapStateToProps = state => ({
   authenticated: state.auth.userId !== null,
   displayName: state.firebase.auth.displayName,
   imgUrl: state.firebase.auth.photoURL,
   userId: state.firebase.auth.uid,
   shouldStartTrackingNotifications: state.profile.shouldStartTrackingNotifications,
   notifications: state.profile.notifications
})

const mapDispatchToProps = dispatch => {
   return {
      onLoginCheck: () => { dispatch(authCheckState()) },
      onLogout: (userId) => { dispatch(logout(userId)) },
      onModalToggle: (e) => { dispatch(toggleModal(e)) }
   }
}



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withFirebase(App)));
