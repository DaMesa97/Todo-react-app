import React, { Component } from 'react';
import { connect } from 'react-redux'

import { auth } from '../../store/actions/user_auth'
import { toggleModal } from '../../store/actions/welcome'

import Modal from '../../components/UI/Modal/Modal'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import Spinner from '../../components/UI/Spinner/Spinner'
import Alert from '../../components/UI/Alert/Alert'
import styles from './Welcome.module.css'

class Welcome extends Component {
   state = {
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
      loginForm: {
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
         }
      },
      loading: false,
      formIsValid: false
   }

   componentDidUpdate(prevProps, prevState) {
      console.log(`UPDATE [WELCOME CONTAINER]`)
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
      this.props.onModalToggle(e)
   }

   // FORM IS VALID WHEN ALL REQUIRED INPUTS ARE VALID

   formChangedHandler = (e, key) => {
      let formIsValid = true

      if (this.props.registering) {
         const updatedRegisterForm = { ...this.state.registerForm }
         const updatedFormElement = { ...updatedRegisterForm[key] }

         updatedFormElement.value = e.target.value
         updatedFormElement.touched = true
         updatedFormElement.valid = this.checkValidity(e.target.value, this.state.registerForm[key].validation)

         updatedRegisterForm[key] = updatedFormElement

         for (let key in this.state.registerForm) {
            formIsValid = updatedRegisterForm[key].valid && formIsValid
         }

         this.setState({
            registerForm: updatedRegisterForm,
            formIsValid: formIsValid
         })
      }

      else {
         const updatedLoginForm = { ...this.state.loginForm }
         const updatedFormElement = { ...updatedLoginForm[key] }

         updatedFormElement.value = e.target.value
         updatedFormElement.touched = true
         updatedFormElement.valid = this.checkValidity(e.target.value, this.state.loginForm[key].validation)

         updatedLoginForm[key] = updatedFormElement

         for (let key in updatedLoginForm) {
            formIsValid = updatedLoginForm[key].valid && formIsValid
         }

         this.setState({
            loginForm: updatedLoginForm,
            formIsValid: formIsValid
         })
      }
   }

   formSubmitedHandler = () => {
      if (this.props.registering) { this.props.onAuthSubmit(this.state.registerForm.email.value, this.state.registerForm.password.value, !this.props.registering) }
      else {
         this.props.onAuthSubmit(this.state.loginForm.email.value, this.state.loginForm.password.value, !this.props.registering)
      }
      this.clearForm()
   }

   clearForm = () => {
      this.setState({
         registerForm: {
            ...this.state.registerForm,
            email: {
               ...this.state.registerForm.email,
               value: "",
               touched: false
            },
            password: {
               ...this.state.registerForm.password,
               value: "",
               touched: false
            }, rePassword: {
               ...this.state.registerForm.rePassword,
               value: "",
               touched: false
            }
         },
         loginForm: {
            ...this.state.loginForm,
            email: {
               ...this.state.loginForm.email,
               value: "",
               touched: false
            },
            password: {
               ...this.state.loginForm.password,
               value: "",
               touched: false
            }
         }
      })
   }


   render() {
      let formElementsArr = [];
      let form = null;

      if (this.props.registering) {
         for (let key in this.state.registerForm) {
            formElementsArr.push({
               id: key,
               config: this.state.registerForm[key]
            })
         }

         form = (
            <form >
               <div>{this.props.registering ? 'Sign up!' : 'Sign in!'}</div>
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
               {this.props.alert.shown ? <Alert alertType={this.props.alert.type}>{this.props.alert.message}</Alert> : null}
               <Button disabled={!this.state.formIsValid} clicked={this.formSubmitedHandler}>{this.props.registering ? 'Register!' : 'Log in!'}</Button>
            </form>
         )
      }
      else {
         formElementsArr = [];

         for (let key in this.state.loginForm) {
            formElementsArr.push({
               id: key,
               config: this.state.loginForm[key]
            })
         }

         form = (
            <form >
               <div>{this.props.registering ? 'Sign up!' : 'Sign in!'}</div>
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
               {this.props.alert.shown ? <Alert alertType={this.props.alert.type}>{this.props.alert.message}</Alert> : null}
               <Button disabled={!this.state.formIsValid} clicked={this.formSubmitedHandler}>{this.props.registering ? 'Register!' : 'Log in!'}</Button>
            </form>
         )
      }

      let modal = <Modal show={this.props.modalShown}
         toggleModal={this.toggleModalHandler}>
         {form}
      </Modal>

      if (this.props.loading && !this.props.alert.shown) {
         modal = null
      }

      let welcome = (
         <React.Fragment>
            {modal}
            <div className={styles.Welcome}>
               <h1>One tool to manage all your tasks.</h1>
               <Button style={{
                  border: 'none',
                  boxShadow: '1px 1px 3px 0px rgba(0,0,0,0.75)',
                  padding: '15px',
                  fontSize: '20px',
                  width: '100%',
                  color: 'rgb(51, 51, 51)'
               }}
                  clicked={this.toggleModalHandler}
               >Let's get started!</Button>
               <h2 onClick={this.toggleModalHandler}>Already have an account? Log in!</h2>
            </div>
         </React.Fragment>
      )

      if (this.props.loading && !this.props.alert.shown) {
         welcome = < Spinner />
      }

      return (
         welcome
      )
   }
}

const mapStateToProps = (state) => ({
   registering: state.welcome.registering,
   modalShown: state.welcome.modalShown,
   loading: state.auth.loading,
   alert: state.profile.alert
})

const mapDispatchToProps = (dispatch) => {
   return {
      onAuthSubmit: (email, password, isSignUp) => dispatch(auth(email, password, isSignUp)),
      onModalToggle: (e) => dispatch(toggleModal(e))
   }
}


export default connect(mapStateToProps, mapDispatchToProps)(Welcome)