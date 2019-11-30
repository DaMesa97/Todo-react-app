import React, { Component } from 'react';

import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'

import { initUsersList } from '../../../store/actions/groups'

import styles from './SelectedGroup.module.css'
import { MdClose } from "react-icons/md"

import Input from '../../UI/Input/Input'
import { FaPlus as PlusIcon } from "react-icons/fa";
import Alert from '../../UI/Alert/Alert'
import Spinner from '../../UI/Spinner/Spinner'

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
      },
      groupMembers: []
   }

   componentDidMount() {
      const groupId = this.props.history.location.state.groupId
      const groupRef = this.props.firebase.database().ref(`groups/${groupId}`)

      this.setState({ loading: true })

      this.props.onInitUsersList()

      groupRef.once('value', snapshot => {
         const activeGroup = {
            groupId: snapshot.key,
            ...snapshot.val()
         }
         this.setState({
            activeGroup: { ...activeGroup }
         })
      })
         .then(() => {
            const groupUsersRef = this.props.firebase.database().ref(`/groups/${groupId}/members`)
            groupUsersRef.on('child_added', snapshot => {
               this.createUserNameList(snapshot.val())
            })
         })
         .then(() => {
            this.setState({ loading: false })
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
      const usersInvitedToActiveGroupArr = [];
      const membersOfActiveGroupArr = []
      let shouldContinueCheck = true;

      this.state.activeGroup.members.forEach(member => {
         membersOfActiveGroupArr.push(member)
      })

      if (this.state.activeGroup.invited) {
         Object.keys(this.state.activeGroup.invited).forEach(userId => {
            usersInvitedToActiveGroupArr.push(this.state.activeGroup.invited[userId])
         })
      }

      if (membersOfActiveGroupArr.includes(userId)) {
         this.handleAlert('error', 'User is already member of this group!')
         shouldContinueCheck = false
      }
      else if (usersInvitedToActiveGroupArr.includes(userId) && shouldContinueCheck) {
         this.handleAlert('error', 'User already invited!')
      }
      else if (shouldContinueCheck) {
         const group = {
            groupName: this.state.activeGroup.groupName,
            groupId: this.state.activeGroup.groupId
         }
         const invitationsRef = this.props.firebase.database().ref(`/invitations/${userId}`)

         groupRef.child(`/invitations`).push(userId)
            .then(response => {
               const invitationId = response.key
               this.setState({
                  activeGroup: {
                     ...this.state.activeGroup,
                     invited: {
                        ...this.state.activeGroup.invited,
                        [userId]: userId
                     }
                  }
               })
               invitationsRef.push({
                  invitedBy: this.props.currentUser.displayName,
                  invitedTo: group,
                  groupInvitationId: invitationId
               })
                  .then(response => {
                     this.handleAlert('success', 'Invitation sent!')
                  })
                  .catch(error => {
                     this.handleAlert('error', 'Something went wrong! Try later!')
                  })
            })
      }
   }


   inputSubmitedHandler = () => {
      let shouldContinueCheck = true
      this.props.usersList.forEach((user, index) => {
         if (user.displayName.toLowerCase() === this.state.inviteInput.value.toLowerCase()) {
            shouldContinueCheck = false
            this.handleSendInvitation(user.userId)
         }
         else if (index + 1 === this.props.usersList.length && shouldContinueCheck) {
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

   createUserNameList = (userId) => {
      const userRef = this.props.firebase.database().ref(`/users/${userId}/displayName`)

      userRef.once(`value`, snapshot => {
         this.setState({
            groupMembers: [...this.state.groupMembers, snapshot.val()]
         })
      })
   }

   render() {
      let groupName = < Spinner />
      if (this.state.activeGroup && this.state.groupMembers) {
         groupName = this.state.activeGroup.groupName
      }

      let groupMembersLiElement = < Spinner />
      if (this.state.activeGroup && this.state.groupMembers) {
         groupMembersLiElement = this.state.groupMembers.map(member => {
            return <li key={member}>{member}< MdClose /></li>
         })
      }

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
                     {groupMembersLiElement}
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

const mapDispatchToProps = (dispatch) => {
   return {
      onInitUsersList: () => { dispatch(initUsersList()) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(SelectedGroup))