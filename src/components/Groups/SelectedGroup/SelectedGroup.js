import React, { Component } from 'react';

import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'

import styles from './SelectedGroup.module.css'

import Input from '../../UI/Input/Input'
import { FaPlus as PlusIcon } from "react-icons/fa";
import Alert from '../../UI/Alert/Alert'

class SelectedGroup extends Component {
   state = {
      activeGroup: null,
      inviteInput: {
         elementType: "input",
         elementConfig: {
            type: "input",
            placeholder: "Invite..."
         },
         value: ""
      },
      loading: false,
      alert: {
         shown: false,
         message: null,
         type: null
      }
   }

   componentDidMount() {
      let activeGroup = this.props.groups.filter(group => {
         return group.groupName === this.props.match.params.group
      })
      this.setState({
         activeGroup: { ...activeGroup[0] }
      })
   }

   formChangedHandler = (e) => {
      let updatedInput = { ...this.state.inviteInput }
      let updatedInputValue = e.target.value

      updatedInput.value = updatedInputValue

      this.setState({
         inviteInput: updatedInput
      })
   }

   clearAlert = () => {
      setTimeout(() => {
         this.setState({
            alert: {
               shown: false,
               type: null,
               message: null
            }
         })
      }, 2000)
   }

   handleAlert = (type, message) => {
      this.setState({
         alert: {
            type: type,
            message: message,
            shown: true
         }
      })
      this.clearAlert()
   }

   handleSendInvitation = (userId) => {
      const groupRef = this.props.firebase.database().ref(`/groups/${this.state.activeGroup.groupId}`)
      const usersInvitedToActiveGroup = [];

      groupRef.child(`/invited`).once('value', response => {
         if (response.val() !== null) {
            Object.keys(response.val()).forEach(userId => {
               usersInvitedToActiveGroup.push(response.val()[userId])
            })
         }
         if (usersInvitedToActiveGroup.includes(userId)) {
            this.handleAlert('error', 'User already invited!')
         }
         else {
            const group = {
               groupName: this.state.activeGroup.groupName,
               groupId: this.state.activeGroup.groupId
            }
            const invitationsRef = this.props.firebase.database().ref(`/invitations/${userId}`)
            invitationsRef.push({
               invitedBy: this.props.currentUser.displayName,
               invitedTo: group
            })
               .then(response => {
                  this.handleAlert('success', 'Invitation sent!')
                  groupRef.child(`/invited`).push(userId)
                     .then(response => {
                        // console.log(response)
                     })
               })
               .catch(error => {
                  this.handleAlert('error', 'Something went wrong! Try later!')
               })
         }
      })
   }


   inputSubmitedHandler = () => {
      this.props.usersList.forEach((user, index) => {
         console.log(index)
         if (user.displayName.toLowerCase() === this.state.inviteInput.value.toLowerCase()) {
            this.handleSendInvitation(user.userId)
         }
         else if (this.props.usersList.length === index + 1) {
            this.handleAlert('error', 'User not found!')
         }
      })
      this.setState({
         inviteInput: {
            ...this.state.inviteInput,
            value: ""
         }
      })
   }

   render() {
      console.log(this.state.activeGroup)
      let groupName = this.state.activeGroup ? this.state.activeGroup.groupName : null
      let members = this.state.activeGroup ? this.state.activeGroup.members.map(member => {
         return <li key={member.userId}>{member.userName}</li>
      }) : null

      let alert = null

      if (this.state.alert.shown) {
         alert = < Alert alertType={this.state.alert.type}>{this.state.alert.message}</Alert>
      }

      return (
         <React.Fragment>
            <h2>{groupName}</h2>
            <div className={styles.Wrapper}>
               <div className={styles.adminPanel}>
                  <h4>Admin panel</h4>
               </div>
               <div className={styles.Members}>
                  <ul>
                     <h4>Members:</h4>
                     {members}
                  </ul>
                  <div className={styles.inviteInput}>
                     <Input
                        value={this.state.inviteInput.value}
                        elementConfig={this.state.inviteInput.elementConfig}
                        changed={this.formChangedHandler}
                     />
                     <PlusIcon onClick={this.inputSubmitedHandler} />
                  </div>
                  {alert}
               </div>
            </div>
         </React.Fragment>
      )
   }
}

const mapStateToProps = (state) => ({
   groups: state.groups.groups,
   usersList: state.groups.usersList,
   currentUser: state.firebase.profile
})


export default connect(mapStateToProps)(withFirebase(SelectedGroup))