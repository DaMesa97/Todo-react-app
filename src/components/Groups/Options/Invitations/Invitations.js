import React, { Component } from 'react';

import { withFirebase } from 'react-redux-firebase'
import { connect } from 'react-redux'

import styles from './Invitations.module.css'

import { FaPlus as PlusIcon } from "react-icons/fa";
import { FaMinus as MinusIcon } from "react-icons/fa";
import Alert from '../../../UI/Alert/Alert'

import { decrementInvitationCounter } from '../../../../store/actions/groups'


class Invitations extends Component {
   state = {
      invitations: [],
      alert: {
         type: null,
         message: null,
         shown: false
      }
   }

   componentDidMount() {
      const user = this.props.firebase.auth().currentUser
      const invitationsRef = this.props.firebase.database().ref(`/invitations/${user.uid}`)

      invitationsRef.on('child_added', snapshot => {
         const invitation = {
            userInvitationId: snapshot.key,
            ...snapshot.val()
         }

         this.setState({
            invitations: [...this.state.invitations, invitation]
         })
      })
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

   invitationAcceptedHandler = (e) => {
      const userInvitationId = e.target.id
      const user = this.props.firebase.auth().currentUser
      const invitationRef = this.props.firebase.database().ref(`/invitations/${user.uid}/${userInvitationId}`)
      let invitation = {};

      invitationRef.once('value', snapshot => {
         invitation = { ...snapshot.val() }
         console.log(invitation)
      })
         .then(response => {
            invitationRef.remove()
            const userGroupsRef = this.props.firebase.database().ref(`/users/${user.uid}/groups`)
            const groupMembersRef = this.props.firebase.database().ref(`/groups/${invitation.invitedTo.groupId}/members`)
            const groupInvitationsRef = this.props.firebase.database().ref(`/groups/${invitation.invitedTo.groupId}/invitations/${invitation.groupInvitationId}`)

            const updatedInvitationsState = this.state.invitations.filter(invitationFromState => {
               return invitationFromState.userInvitationId !== userInvitationId
            })

            console.log(updatedInvitationsState)

            this.setState({ invitations: updatedInvitationsState })
            this.props.onInvitationsCounterDecrement()

            groupInvitationsRef.remove()
            userGroupsRef.push(invitation.invitedTo.groupId)
            groupMembersRef.push(user.uid)

            this.handleAlert('success', 'You have successfully joined a group!')
         })
         .catch(error => {
            this.handleAlert('error', 'Something went wrong! Try again later!')
         })
   }

   invitationRejectedHandler = (e) => {
      console.log(`invitation rejected`, e.target.id)
   }

   render() {
      let invitationsList = null
      if (this.state.invitations) {
         invitationsList = <ul className={styles.InvitationsList}>
            {this.state.invitations.map(invitation => {
               return <li key={invitation.invitedTo.groupId}>{invitation.invitedTo.groupName}
                  < PlusIcon id={invitation.userInvitationId} className={styles.Join} onClick={this.invitationAcceptedHandler} />
                  < MinusIcon id={invitation.userInvitationId} className={styles.Reject} onClick={this.invitationRejectedHandler} /></li>
            })}
         </ul>
      }

      return (
         <React.Fragment>
            <h3>Your invitations</h3>
            {invitationsList}
            {this.state.alert.shown ? < Alert alertType={this.state.alert.type}>{this.state.alert.message}</Alert> : null}
         </React.Fragment>
      )
   }
}

const mapDispatchToProps = dispatch => {
   return {
      onInvitationsCounterDecrement: () => { dispatch(decrementInvitationCounter()) }
   }
}


export default connect(null, mapDispatchToProps)(withFirebase(Invitations))