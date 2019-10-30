import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { authCheckState, logout } from './store/actions/auth'
import { toggleModal } from './store/actions/welcome'

import './App.css';
import Welcome from './containters/Welcome/Welcome'
import TodoList from './containters/TodoList/TodoList'
import Profile from './containters/Profile/Profile'
import Header from './components/Header/Header'

class App extends Component {

   componentDidMount() {
      this.props.onLoginCheck()
   }

   render() {
      return (
         <div className="App">
            <Header authClicked={this.props.onModalToggle} authenticated={this.props.authenticated} logout={this.props.onLogout} clicked={this.navigationClickedHandler} />
            {this.props.authenticated ? <Redirect to='/todos' /> : null}
            <Switch>
               <Route path='/profile' component={Profile} />
               <Route path='/todos' component={TodoList} />
               <Route path='/' component={Welcome} />
            </Switch>
         </div>
      );
   }
}

const mapStateToProps = state => ({
   authenticated: state.auth.token !== null,
   registering: state.welcome.registering,
   loginIn: state.welcome.loginIn,
   modalShown: state.welcome.modalShown
})

const mapDispatchToProps = dispatch => {
   return {
      onLoginCheck: () => { dispatch(authCheckState()) },
      onLogout: () => { dispatch(logout()) },
      onModalToggle: (e) => { dispatch(toggleModal(e)) }
   }
}




export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
