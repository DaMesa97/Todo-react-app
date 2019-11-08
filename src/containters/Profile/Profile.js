import React, { Component } from 'react';
import { connect } from 'react-redux'

import { toggleModal } from '../../store/actions/welcome'
import { updateUserData } from '../../store/actions/user_profile'

import Modal from '../../components/UI/Modal/Modal'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import Alert from '../../components/UI/Alert/Alert'
import Spinner from '../../components/UI/Spinner/Spinner'

import styles from './Profile.module.css'

class Profile extends Component {
   state = {
      changeNickForm: {
         nick: {
            elementType: "input",
            elementConfig: {
               type: 'input',
               placeholder: "Enter your nickname..."
            },
            value: "",
            validation: {
               required: true
            }
         },
         reNick: {
            elementType: "input",
            elementConfig: {
               type: 'input',
               placeholder: "Repeat your nickname..."
            },
            value: "",
            validation: {
               required: true,
               isReNick: true
            },
            valid: false,
            touched: false
         }
      },
      changePasswordForm: {
         password: {
            elementType: "input",
            elementConfig: {
               type: 'password',
               placeholder: 'Enter your new password...'
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
               placeholder: 'Repeat your new password...'
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
      changeImgForm: {
         urlAdress: {
            elementType: 'input',
            elementConfig: {
               type: "url",
               placeholder: "Enter URL adress of your image..."
            },
            value: "",
            validation: {
               required: true,
               isUrl: true
            },
            valid: false,
            touched: false
         }
      },
      selectedOption: null,
      formIsValid: false
   }

   componentDidUpdate(prevProps, prevState) {
      console.log(`UPDATE [PROFILE CONTAINER]`)
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
      if (rules.isRePassword) {
         isValid = value === this.state.changePasswordForm.password.value && isValid
      }
      if (rules.isReNick) {
         isValid = value === this.state.changeNickForm.nick.value && isValid
      }
      if (rules.isUrl) {
         isValid = (value.match(/\.(jpeg|jpg|gif|png)$/) !== null) && isValid
      }

      return isValid;
   }

   optionClickedHandler = (e) => {
      this.setState({ selectedOption: e.target.textContent })
      this.props.onModalToggle(e)
   }

   formChangedHandler = (e, key) => {
      let formIsValid = true;
      let updatedFormElement;

      switch (this.state.selectedOption) {
         case ('Change your nickname'):
            const updatedNickForm = { ...this.state.changeNickForm }
            updatedFormElement = updatedNickForm[key]

            updatedFormElement.value = e.target.value
            updatedFormElement.touched = true
            updatedFormElement.valid = this.checkValidity(e.target.value, updatedNickForm[key].validation)

            for (let key in updatedNickForm) {
               formIsValid = updatedNickForm[key].valid && formIsValid
            }

            updatedNickForm[key] = updatedFormElement

            this.setState({
               changeNickForm: updatedNickForm,
               formIsValid: formIsValid
            })
            break;
         case ('Change your password'):
            const updatedPasswordForm = { ...this.state.changePasswordForm }
            updatedFormElement = updatedPasswordForm[key]

            updatedFormElement.value = e.target.value
            updatedFormElement.touched = true
            updatedFormElement.valid = this.checkValidity(e.target.value, updatedPasswordForm[key].validation)

            for (let key in updatedPasswordForm) {
               formIsValid = updatedPasswordForm[key].valid && formIsValid
            }

            updatedPasswordForm[key] = updatedFormElement
            this.setState({
               changePasswordForm: updatedPasswordForm,
               formIsValid: formIsValid
            })
            break;
         case ('Change your profile image'):
            const updatedImgForm = { ...this.state.changeImgForm }
            updatedFormElement = updatedImgForm[key]

            updatedFormElement.value = e.target.value
            updatedFormElement.touched = true
            updatedFormElement.valid = this.checkValidity(e.target.value, updatedImgForm[key].validation)

            for (let key in updatedImgForm) {
               formIsValid = updatedImgForm[key].valid && formIsValid
            }

            updatedImgForm[key] = updatedFormElement
            this.setState({
               changeImgForm: updatedImgForm,
               formIsValid: formIsValid
            })
            break;
      }
   }

   formSubmitedHandler = (e) => {
      let url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDiJ1HOTYokShLVrCFV4veIHOYWhPszNa0`;
      let data = {
         idToken: this.props.token,
         displayName: this.state.changeNickForm.reNick.value !== "" ? this.state.changeNickForm.reNick.value : this.props.displayName,
         photoUrl: this.state.changeImgForm.urlAdress.value !== "" ? this.state.changeImgForm.urlAdress.value : this.props.imgUrl,
         returnSecureToken: true
      }
      if (this.state.selectedOption === 'Change your password') {
         url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDiJ1HOTYokShLVrCFV4veIHOYWhPszNa0`

         data = {
            idToken: this.props.token,
            password: this.state.changePasswordForm.rePassword.value,
            returnSecureToken: false
         }
      }

      this.props.onFormSubmited(url, data)
      this.props.onModalToggle(e)
      this.setState({
         changeNickForm: {
            ...this.state.changeNickForm,
            nick: {
               ...this.state.changeNickForm.nick,
               value: ""
            },
            reNick: {
               ...this.state.changeNickForm.reNick,
               value: ""
            }
         },
         changePasswordForm: {
            ...this.state.changePasswordForm,
            password: {
               ...this.state.changePasswordForm.password,
               value: ""
            },
            rePassword: {
               ...this.state.changePasswordForm.rePassword,
               value: ""
            }
         },
         changeImgForm: {
            ...this.state.changeImgForm,
            urlAdress: {
               ...this.state.changeImgForm.urlAdress,
               value: ""
            }
         }
      })
   }

   render() {
      let form = null
      let formElementsArr = [];

      switch (this.state.selectedOption) {
         case ('Change your nickname'):
            for (let key in this.state.changeNickForm) {
               formElementsArr.push({
                  id: key,
                  config: this.state.changeNickForm[key]
               })
            }
            form =
               <form>
                  <div className={styles.SelectedOption}>{this.state.selectedOption}</div>
                  {
                     formElementsArr.map(element => {
                        return <Input value={element.config.value}
                           elementConfig={element.config.elementConfig}
                           key={element.id}
                           elementType={element.config.elementType}
                           valid={element.config.valid}
                           touched={element.config.touched}
                           changed={(e) => this.formChangedHandler(e, element.id)}
                        />
                     })
                  }
                  <Button disabled={!this.state.formIsValid} clicked={this.formSubmitedHandler}>Save</Button>
               </form >
            break;
         case ('Change your password'):
            for (let key in this.state.changePasswordForm) {
               formElementsArr.push({
                  id: key,
                  config: this.state.changePasswordForm[key]
               })
            }
            form =
               <form>
                  <div className={styles.SelectedOption}>{this.state.selectedOption}</div>
                  {
                     formElementsArr.map(element => {
                        return <Input value={element.config.value}
                           elementConfig={element.config.elementConfig}
                           key={element.id}
                           elementType={element.config.elementType}
                           valid={element.config.valid}
                           touched={element.config.touched}
                           changed={(e) => this.formChangedHandler(e, element.id)}
                        />
                     })
                  }
                  <Button disabled={!this.state.formIsValid} clicked={this.formSubmitedHandler}>Save</Button>
               </form>
            break;
         case ('Change your profile image'):
            for (let key in this.state.changeImgForm) {
               formElementsArr.push({
                  id: key,
                  config: this.state.changeImgForm[key]
               })
            }
            form =
               <form>
                  <div className={styles.SelectedOption}>{this.state.selectedOption}</div>
                  {
                     formElementsArr.map(element => {
                        return <Input value={element.config.value}
                           elementConfig={element.config.elementConfig}
                           key={element.id}
                           elementType={element.config.elementType}
                           valid={element.config.valid}
                           touched={element.config.touched}
                           changed={(e) => this.formChangedHandler(e, element.id)}
                        />
                     })
                  }
                  <Button disabled={!this.state.formIsValid} clicked={this.formSubmitedHandler}>Save</Button>
               </form>
            break;
      }

      let modal = <Modal show={this.props.modalShown} toggleModal={this.props.onModalToggle}>
         {form}
      </Modal>

      let alert = null

      if (this.props.alert.shown) {
         alert = <Alert alertType={this.props.alert.type}>{this.props.alert.message}</Alert>
      }

      if (this.props.loading) {
         alert = < Spinner />
      }

      const imgPlaceholder = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'

      return (
         <React.Fragment>
            {modal}
            < div className={styles.Profile} >
               <div className={styles.Stats}>
                  <img src={this.props.imgUrl} alt="profile-image" />
                  <p><strong>{this.props.displayName}</strong></p>
                  <p>Joined: {this.props.createdAt}</p>
                  <p>completed todos</p>
               </div>
               <div className={styles.Settings}>
                  <p onClick={this.optionClickedHandler}>Change your nickname</p>
                  <p onClick={this.optionClickedHandler}>Change your password</p>
                  <p onClick={this.optionClickedHandler}>Change your profile image</p>
                  {alert}
               </div>
            </div >
         </React.Fragment>
      )
   }
}

const mapStateToProps = (state) => ({
   modalShown: state.welcome.modalShown,
   token: state.auth.token,
   displayName: state.profile.displayName,
   alert: state.profile.alert,
   createdAt: state.profile.registerDate,
   imgUrl: state.profile.imgUrl,
   loading: state.profile.loading
})

const mapDispatchToProps = (dispatch) => {
   return {
      onModalToggle: (e) => { dispatch(toggleModal(e)) },
      onFormSubmited: (url, data) => { dispatch(updateUserData(url, data)) }
   }
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile)