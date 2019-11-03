import React, { Component } from 'react';
import { connect } from 'react-redux'

import { toggleModal } from '../../store/actions/welcome'
import { updateUserData } from '../../store/actions/user_profile'

import Modal from '../../components/UI/Modal/Modal'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import Alert from '../../components/UI/Alert/Alert'

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
               required: true
            },
            valid: false,
            touched: false
         }
      },
      selectedOption: null
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

      return isValid;
   }

   optionClickedHandler = (e) => {
      this.setState({ selectedOption: e.target.textContent })
      this.props.onModalToggle(e)
   }

   formChangedHandler = (e, key) => {
      switch (this.state.selectedOption) {
         case ('Change your nickname'):
            this.setState({
               changeNickForm: {
                  ...this.state.changeNickForm,
                  [key]: {
                     ...this.state.changeNickForm[key],
                     value: e.target.value,
                     touched: true,
                     valid: this.checkValidity(e.target.value, this.state.changeNickForm[key].validation)
                  }
               }
            })
            break;
         case ('Change your password'):
            this.setState({
               changePasswordForm: {
                  ...this.state.changePasswordForm,
                  [key]: {
                     ...this.state.changePasswordForm[key],
                     value: e.target.value,
                     touched: true,
                     valid: this.checkValidity(e.target.value, this.state.changePasswordForm[key].validation)
                  }
               }
            })
            break;
         case ('Change your profile image'):
            this.setState({
               changeImgForm: {
                  ...this.state.changeImgForm,
                  [key]: {
                     ...this.state.changeImgForm[key],
                     value: e.target.value,
                     touched: true,
                     valid: this.checkValidity(e.target.value, this.state.changeImgForm[key].validation)
                  }
               }
            })
            break;
      }
      console.log(key)
   }

   formSubmitedHandler = (e) => {
      let url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDiJ1HOTYokShLVrCFV4veIHOYWhPszNa0`;
      let data = {
         idToken: this.props.token,
         displayName: this.state.changeNickForm.reNick.value,
         photoUrl: this.state.changeImgForm.urlAdress.value,
         returnSecureToken: false
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
                  <Button clicked={this.formSubmitedHandler}>Save</Button>
               </form>
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
                  <Button clicked={this.formSubmitedHandler}>Save</Button>
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
                  <Button clicked={this.formSubmitedHandler}>Save</Button>
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

      return (
         <React.Fragment>
            {modal}
            < div className={styles.Profile} >
               <div className={styles.Stats}>
                  <img src="https://image.shutterstock.com/image-illustration/male-default-placeholder-avatar-profile-260nw-582509551.jpg" alt="profile-image" />
                  <p><strong>{this.props.displayName}</strong></p>
                  <p>registered on</p>
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
   alert: state.profile.alert
})

const mapDispatchToProps = (dispatch) => {
   return {
      onModalToggle: (e) => { dispatch(toggleModal(e)) },
      onFormSubmited: (url, data) => { dispatch(updateUserData(url, data)) }
   }
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile)