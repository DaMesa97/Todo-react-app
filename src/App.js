import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { authCheckState, logout } from './store/actions/user_auth'
import { toggleModal } from './store/actions/welcome'

import './App.css';
import Welcome from './containters/Welcome/Welcome'
import TodoList from './containters/TodoList/TodoList'
import Profile from './containters/Profile/Profile'
import Groups from './containters/Groups/Groups'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

import PrivateRoute from './hoc/PrivateRoute/PrivateRoute'

class App extends Component {

   componentDidMount() {
      if (!this.props.authenticated) {
         this.props.onLoginCheck()
      }
   }

   logoutHandler = () => {
      this.props.onLogout();
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
            {this.props.authenticated ? <Redirect to='todos' /> : null}
            <Switch>
               <PrivateRoute path='/profile' component={Profile} authenticated={this.props.authenticated} />
               <PrivateRoute path='/todos' component={TodoList} authenticated={this.props.authenticated} />
               <PrivateRoute path='/groups' component={Groups} authenticated={this.props.authenticated} />
               <Route path='/' component={Welcome} />
            </Switch>
            < Footer />
         </div>
      );
   }
}

const mapStateToProps = state => ({
   authenticated: state.auth.token !== null,
   displayName: state.profile.displayName,
   imgUrl: state.profile.imgUrl
})

const mapDispatchToProps = dispatch => {
   return {
      onLoginCheck: () => { dispatch(authCheckState()) },
      onLogout: () => { dispatch(logout()) },
      onModalToggle: (e) => { dispatch(toggleModal(e)) }
   }
}



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
