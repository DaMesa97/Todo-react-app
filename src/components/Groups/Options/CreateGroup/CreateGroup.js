import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'

import Input from '../../../UI/Input/Input'
import Button from '../../../UI/Button/Button'

import styles from './CreateGroup.module.css'

class CreateGroup extends Component {
   state = {
      createGroupForm: {
         groupName: {
            elementType: "input",
            elementConfig: {
               type: 'input',
               placeholder: 'Enter your group name...'
            },
            value: "",
            validation: {
               required: true,
               minLength: 4
            },
            valid: false,
            touched: false
         }
      },
      formIsValid: false
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

   formElementChangedHandler = (e, key) => {
      let formIsValid = true;
      let updatedForm = { ...this.state.createGroupForm }
      let updatedFormElement = updatedForm[key]

      updatedFormElement.value = e.target.value
      updatedFormElement.touched = true
      updatedFormElement.valid = this.checkValidity(e.target.value, updatedForm[key].validation)

      updatedForm[key] = updatedFormElement

      for (key in updatedForm) {
         formIsValid = updatedForm[key].valid && formIsValid
      }

      this.setState({
         createGroupForm: updatedForm,
         formIsValid: formIsValid
      })
   }

   formSubmitedHandler = (userId, userName, groupName) => {
      const groupData = {
         groupName: groupName,
         createdBy: userId,
         members: [{ userId: userId, userName: userName }]
      }
      const user = this.props.firebase.auth().currentUser
      const groupsRef = this.props.firebase.ref('/groups')
      const userRef = this.props.firebase.ref(`/users/${user.uid}/groups`)
      groupsRef.push(groupData)
         .then(response => {
            userRef.push(response.key)
         })
   }

   render() {
      const formElementsArr = []
      for (let key in this.state.createGroupForm) {
         formElementsArr.push({
            id: key,
            config: this.state.createGroupForm[key]
         })
      }

      const form =
         <form>
            {formElementsArr.map(element => {
               return <Input
                  value={element.value}
                  key={element.id}
                  elementConfig={element.config.elementConfig}
                  valid={element.config.valid}
                  touched={element.config.touched}
                  changed={(e, key) => this.formElementChangedHandler(e, element.id)}
                  style={{ width: '30%' }}
               />
            })}
            <Button disabled={!this.state.formIsValid} clicked={() => this.formSubmitedHandler(this.props.userId, this.props.userName, this.state.createGroupForm.groupName.value)}>Create!</Button>
         </form>

      return (
         <React.Fragment>
            <h3>Create group</h3>
            {form}
         </React.Fragment>
      )
   }
}

const mapStateToProps = (state) => ({
   userId: state.auth.userId,
   userName: state.profile.displayName
})


export default connect(mapStateToProps)(withFirebase(CreateGroup))