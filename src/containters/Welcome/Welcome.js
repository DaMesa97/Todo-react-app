import React, { Component } from 'react';
import { connect } from 'react-redux'

import { auth } from '../../store/actions/auth'

import Modal from '../../components/UI/Modal/Modal'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import Spinner from '../../components/UI/Spinner/Spinner'
import styles from './Welcome.module.css'

class Welcome extends Component {
   state = {
      modalShown: false,
      registering: false,
      registerForm: {
         email: {
            elementType: "input",
            elementConfig: {
               type: 'email',
               placeholder: 'Enter your email...'
            },
            value: "",
            validation: {
               required: true,
               isEmail: true
            },
            valid: false,
            touched: false
         },
         password: {
            elementType: "input",
            elementConfig: {
               type: 'password',
               placeholder: 'Enter your password...'
            },
            value: "",
            validation: {
               required: true,
               minLength: 6
            },
            valid: false,
            touched: false
         },
         rePassword: {
            elementType: "input",
            elementConfig: {
               type: 'password',
               placeholder: 'Repeat your password...'
            },
            value: "",
            validation: {
               required: true,
               isRePassword: true
            },
            valid: false,
            touched: false
         }
      },
      isSignIn: false
   }

   checkValidity = (value, rules) => {
      let isValid = true;
      if (!rules) {
         return true;
      }
      if (rules.required) {
         isValid = value.trim() !== "" && isValid;
      }
      if (rules.minLength) {
         isValid = value.length >= rules.minLength && isValid;
      }
      if (rules.maxLength) {
         isValid = value.length <= rules.maxLength && isValid;
      }
      if (rules.isEmail) {
         const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         isValid = pattern.test(value.toLowerCase()) && isValid;
      }
      if (rules.isRePassword) {
         isValid = value === this.state.registerForm.password.value && isValid
      }

      return isValid;
   }

   toggleModalHandler = (e) => {
      this.setState({
         modalShown: !this.state.modalShown
      })

      switch (e.target.textContent) {
         case `Let's get started!`:
            this.setState({ registering: true })
            break;
         case 'Already have an account? Log in!':
            this.setState({ registering: false })
            break;
      }
   }

   formChangedHandler = (e, key) => {
      this.setState({
         registerForm: {
            ...this.state.registerForm,
            [key]: {
               ...this.state.registerForm[key],
               value: e.target.value,
               touched: true,
               valid: this.checkValidity(e.target.value, this.state.registerForm[key].validation)
            }
         }
      })
   }

   formSubmitedHandler = () => {
      this.props.onAuthSubmit(this.state.registerForm.email.value, this.state.registerForm.password.value, !this.state.registering)
      this.setState({ modalShown: false })
   }


   render() {
      const formElementsArr = [];

      for (let key in this.state.registerForm) {
         formElementsArr.push({
            id: key,
            config: this.state.registerForm[key]
         })
      }

      let form = (
         <form >
            <div>{this.state.registering ? 'Sign up!' : 'Sign in!'}</div>
            {formElementsArr.map(formElement => {
               return <Input
                  key={formElement.id}
                  value={formElement.config.value}
                  elementType={formElement.config.elementType}
                  elementConfig={formElement.config.elementConfig}
                  valid={formElement.config.valid}
                  touched={formElement.config.touched}
                  changed={(e) => this.formChangedHandler(e, formElement.id)}
               />
            })}
            <Button clicked={this.formSubmitedHandler}>{this.state.registering ? 'Register!' : 'Log in!'}</Button>
         </form>
      )

      let modal = <Modal show={false}
         toggleModal={this.toggleModalHandler}>
      </Modal>
      if (this.state.modalShown) {
         modal = <Modal show={true}
            toggleModal={this.toggleModalHandler}>
            {form}
         </Modal>
      }

      let welcome = (
         <React.Fragment>
            {modal}
            <div className={styles.Welcome}>
               <h1>One tool to manage all your tasks.</h1>
               <Button style={{
                  border: 'none',
                  boxShadow: '1px 1px 3px 0px rgba(0,0,0,0.75)'
               }}
                  clicked={this.toggleModalHandler}
               >Let's get started!</Button>
               <h2 onClick={this.toggleModalHandler}>Already have an account? Log in!</h2>
            </div>
         </React.Fragment>
      )
      if (this.props.loading) {
         welcome = < Spinner />
      }
      return (
         welcome
      )
   }
}

const mapStateToProps = (state) => ({
   authenticated: state.auth.token !== null,
   loading: state.auth.loading
})

const mapDispatchToProps = (dispatch) => {
   return {
      onAuthSubmit: (email, password, isSignUp) => dispatch(auth(email, password, isSignUp))
   }
}


export default connect(mapStateToProps, mapDispatchToProps)(Welcome)