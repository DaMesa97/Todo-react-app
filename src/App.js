import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { authCheckState, logout } from './store/actions/auth'
import { toggleAuthModal } from './store/actions/welcome'

import './App.css';
import Welcome from './containters/Welcome/Welcome'
import TodoList from './containters/TodoList/TodoList'
import Header from './components/Header/Header'

class App extends Component {

   componentDidMount() {
      this.props.onLoginCheck()

      console.log(this.props)
   }

   render() {
      return (
         <div className="App">
            <Header authClicked={this.props.onModalToggle} authenticated={this.props.authenticated} logout={this.props.onLogout} clicked={this.navigationClickedHandler} />
            {this.props.authenticated ? <Redirect to="/todos" /> : null}
            <Switch>
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
      onModalToggle: (e) => { dispatch(toggleAuthModal(e)) }
   }
}




export default connect(mapStateToProps, mapDispatchToProps)(App);
