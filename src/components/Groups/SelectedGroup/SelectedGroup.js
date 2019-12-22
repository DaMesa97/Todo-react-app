import React, { Component } from 'react';

import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'

import { initUsersList } from '../../../store/actions/groups'
import { toggleModal } from '../../../store/actions/welcome'

import styles from './SelectedGroup.module.css'
import { MdClose } from "react-icons/md"

import Input from '../../UI/Input/Input'
import { FaPlus as PlusIcon } from "react-icons/fa";
import Alert from '../../UI/Alert/Alert'
import Spinner from '../../UI/Spinner/Spinner'
import Modal from '../../UI/Modal/Modal'
import Button from '../../UI/Button/Button'

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
         type: null,
         id: null
      },
      groupMembers: [],
      invitedUsers: [],
      chosenAction: null,
      actionPayload: null
   }

   componentDidMount() {
      const groupId = this.props.history.location.state.groupId
      const groupRef = this.props.firebase.database().ref(`groups/${groupId}`)

      this.setState({ loading: true })

      this.props.onInitUsersList()

      groupRef.once('value', snapshot => {
         const members = []
         Object.keys(snapshot.val().members).forEach(key => {
            members.push(snapshot.val().members[key])
         })

         const activeGroup = {
            groupId: snapshot.key,
            createdBy: snapshot.val().createdBy,
            groupName: snapshot.val().groupName,
            invitations: { ...snapshot.val().invitations },
            membersId: members
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
            this.createInvitedUsersList()
            this.setState({ loading: false })
         })
   }

   componentWillUnmount() {
      const groupId = this.state.activeGroup.groupId
      const groupUsersRef = this.props.firebase.database().ref(`/groups/${groupId}/members`)
      const groupInvitationsRef = this.props.firebase.database().ref(`/groups/${groupId}/invitations`)
      groupUsersRef.off()
      groupInvitationsRef.off()
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
      const membersIdOfActiveGroupArr = []
      let shouldContinueCheck = true;

      this.state.activeGroup.membersId.forEach(memberId => {
         membersIdOfActiveGroupArr.push(memberId)
      })

      if (this.state.invitedUsers) {
         this.state.invitedUsers.forEach(user => {
            usersInvitedToActiveGroupArr.push(user.userId)
         })
      }

      if (membersIdOfActiveGroupArr.includes(userId)) {
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
         const notificationsRef = this.props.firebase.database().ref(`/notifications/${userId}`)

         groupRef.child(`/invitations`).push(userId)
            .then(response => {
               const invitationId = response.key
               invitationsRef.child(invitationId).set({
                  invitedBy: this.props.currentUser.displayName,
                  invitedTo: group,
                  groupInvitationId: invitationId
               })
               notificationsRef.push({
                  invitedBy: this.props.currentUser.displayName,
                  invitedTo: group,
                  notificationId: invitationId
               })
                  .then(response => {
                     this.handleAlert('success', 'Invitation sent!')
                     console.log(this.state.invitedUsers)
                  })
                  .catch(error => {
                     this.handleAlert('error', 'Something went wrong! Try later!')
                  })
            })
      }
   }


   inputSubmitedHandler = () => {
      let shouldContinueCheck = true
      if (this.props.userId === this.state.activeGroup.createdBy) {
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
      else {
         this.handleAlert('error', `Only group admin can invite other users!`)
      }
   }

   createUserNameList = (userId) => {
      this.setState({ loading: true })
      const userRef = this.props.firebase.database().ref(`/users/${userId}/displayName`)

      userRef.once(`value`, snapshot => {
         this.setState({
            groupMembers: [...this.state.groupMembers, snapshot.val()]
         })
      })
         .then(() => {
            this.setState({ loading: false })
         })
   }

   createInvitedUsersList = () => {
      const groupInvitationsRef = this.props.firebase.database().ref(`/groups/${this.state.activeGroup.groupId}/invitations`)
      const usersRef = this.props.firebase.database().ref(`/users`)
      let invitedUsersArr = []

      groupInvitationsRef.on('child_added', snapshot => {
         const invitationKey = snapshot.key
         usersRef.child(snapshot.val()).once('value', snapshot => {
            invitedUsersArr.push({
               displayName: snapshot.val().displayName,
               invitationKey: invitationKey,
               userId: snapshot.key
            })
         })
            .then(() => {
               this.setState({ invitedUsers: invitedUsersArr })
            })
      })
      groupInvitationsRef.on('child_removed', snapshot => {
         invitedUsersArr = invitedUsersArr.filter(user => {
            return user.userId !== snapshot.val()
         })
         this.setState({ invitedUsers: invitedUsersArr })
      })
   }

   leaveGroupHandler = () => {
      if (this.state.groupMembers.length <= 1 && this.props.userId !== this.state.activeGroup.createdBy) {
         this.handleAlert('error', `Can't leave group empty! Delete group instead!`)
      }
      else if (this.props.userId === this.state.activeGroup.createdBy) {
         this.handleAlert('error', `Admin can't leave group. Delete group instead!`)
      }
      else {
         const activeGroupId = this.state.activeGroup.groupId
         const userGroupsRef = this.props.firebase.database().ref(`users/${this.props.userId}/groups`)
         const groupMembersRef = this.props.firebase.database().ref(`/groups/${activeGroupId}/members`)

         groupMembersRef.once('value', snapshot => {
            const membersArr = []
            Object.keys(snapshot.val()).forEach(key => {
               membersArr.push({
                  memberId: snapshot.val()[key],
                  memberKey: key
               })
            })
            const leavingMember = membersArr.filter(member => {
               return member.memberId === this.props.userId
            })

            groupMembersRef.child(leavingMember[0].memberKey).remove()
         })
            .then(() => {
               userGroupsRef.once('value', snapshot => {
                  const groupsArr = []
                  Object.keys(snapshot.val()).forEach(key => {
                     groupsArr.push({
                        groupId: snapshot.val()[key],
                        groupKey: key
                     })
                  })
                  const leavingFromGroup = groupsArr.filter(group => {
                     return group.groupId === activeGroupId
                  })

                  userGroupsRef.child(leavingFromGroup[0].groupKey).remove()
               })
            })
            .then(() => {
               this.props.history.push('/groups')
            })
      }
   }

   deleteUserHandler = (userName) => {
      console.log(userName)
      const usersArr = []

      if (userName !== this.props.currentUser.displayName) {
         if (this.state.activeGroup.createdBy === this.props.userId) {
            for (let key in this.props.usersList) {
               usersArr.push(this.props.usersList[key])
            }
            let deletingUser = usersArr.filter(user => {
               return user.displayName === userName
            })
            deletingUser = { ...deletingUser[0] }

            const groupMembersRef = this.props.firebase.database().ref(`/groups/${this.state.activeGroup.groupId}/members`)
            groupMembersRef.once('value', snapshot => {
               for (let key in snapshot.val()) {
                  if (snapshot.val()[key] === deletingUser.userId) {
                     groupMembersRef.child(key).remove()
                  }
               }
            })
               .then(() => {
                  const deletingRef = this.props.firebase.database().ref(`/deleting/${deletingUser.userId}`)
                  deletingRef.push({
                     deletedFrom: this.state.activeGroup.groupId,
                     deletedBy: this.props.currentUser.displayName
                  })
                     .then(() => {
                        let updatedGroupMembers = this.state.groupMembers.filter(member => {
                           return member !== deletingUser.displayName
                        })
                        let updatedMemebrsId = this.state.activeGroup.membersId.filter(memberId => {
                           return memberId !== deletingUser.userId
                        })
                        this.setState({
                           groupMembers: updatedGroupMembers,
                           activeGroup: {
                              ...this.state.activeGroup,
                              membersId: updatedMemebrsId
                           }
                        })
                        this.handleAlert('success', `Succesfully kicked ${deletingUser.displayName} out of group!`)
                     })
               })
         }
         else {
            this.handleAlert('error', `Only group admin can kick other members!`)
         }
      }
      else if (userName === this.props.currentUser.displayName) {
         this.leaveGroupHandler()
      }
   }

   deleteInvitationHandler = (deletingInvitationKey) => {
      if (this.state.activeGroup.createdBy === this.props.userId) {
         const groupInvitationRef = this.props.firebase.database().ref(`/groups/${this.state.activeGroup.groupId}/invitations`)
         const invitationsRef = this.props.firebase.database().ref(`/invitations`)
         const notificationsRef = this.props.firebase.database().ref('/notifications')

         const deletingInvitation =
            this.state.invitedUsers.filter(invitation => {
               return invitation.invitationKey === deletingInvitationKey
            })

         const deletingUserId = deletingInvitation[0].userId
         const deletingUserNotifications = notificationsRef.child(deletingUserId)

         let deletingNotification;
         const notificationsArr = []
         deletingUserNotifications.once('value', snapshot => {
            if (snapshot.val()) {
               Object.keys(snapshot.val()).forEach(key => {
                  notificationsArr.push({
                     notificationKey: key,
                     ...snapshot.val()[key]
                  })
               })
               deletingNotification = notificationsArr.filter(notification => {
                  return notification.notificationId === deletingInvitation[0].invitationKey
               })
            }
         })
            .then(() => {
               const notificationKey = deletingNotification[0].notificationKey
               deletingUserNotifications.child(notificationKey).remove()
            })

         groupInvitationRef.child(deletingInvitation[0].invitationKey).remove()
         invitationsRef.child(deletingInvitation[0].userId).child(deletingInvitation[0].invitationKey).remove()
            .then(() => {
               this.handleAlert('success', `Succesfully removed invitation of ${deletingInvitation[0].displayName}`)
            })
      }
      else {
         this.handleAlert('error', `Only group admin can delete invitations!`)
      }
   }

   deleteGroupHandler = () => {
      const groupId = this.state.activeGroup.groupId
      const groupRef = this.props.firebase.database().ref(`groups/${groupId}`)
      groupRef.remove()
   }

   render() {
      let groupName = < Spinner />
      if (this.state.activeGroup && this.state.groupMembers && !this.state.loading) {
         groupName = this.state.activeGroup.groupName
      }

      let groupMembersLiElements = < Spinner />
      if (this.state.activeGroup && this.state.groupMembers && !this.state.loading) {
         groupMembersLiElements = this.state.groupMembers.map(member => {
            return <li key={member}>{member}< MdClose id={member} onClick={(e) => {
               console.log(e.target.id, this.props.currentUser.displayName)
               if (e.target.id === this.props.currentUser.displayName) {
                  this.setState({ chosenAction: 'leaving group' })
                  this.props.onModalToggle(e)
               }
               else {
                  this.setState({ chosenAction: 'delete user', actionPayload: e.target.id })
                  this.props.onModalToggle(e)
               }
            }} /></li>
         })
      }

      let alert = null
      if (this.state.alert.shown) {
         alert = < Alert alertType={this.state.alert.type}>{this.state.alert.message}</Alert>
      }

      let invitedLiElements = null
      if (this.state.invitedUsers) {
         invitedLiElements = this.state.invitedUsers.map(invitedUser => {
            return <li key={invitedUser.displayName}>{invitedUser.displayName}< MdClose id={invitedUser.invitationKey} onClick={
               (e) => {
                  this.setState({ chosenAction: 'delete invitation', actionPayload: e.target.id })
                  this.props.onModalToggle(e)
               }} /></li>
         })
      }

      let modalContent = null
      const modalButtonStyles = {
         display: 'inline-block',
         margin: '15px 2.5px 0 2.5px'
      }

      switch (this.state.chosenAction) {
         case 'delete group':
            modalContent = (
               <React.Fragment>
                  <h3>Are you sure you want to delete group?</h3>
                  <Button style={modalButtonStyles} clicked={(e) => {
                     this.deleteGroupHandler();
                     this.props.onModalToggle(e);
                     this.props.history.replace('/groups')
                  }}>Yes</Button>
                  <Button style={modalButtonStyles} clicked={this.props.onModalToggle}>No</Button>
               </React.Fragment>
            )
            break;
         case 'delete user':
            modalContent = (
               <React.Fragment>
                  <h3>Are you sure you want to delete this user?</h3>
                  <Button style={modalButtonStyles} clicked={(e) => {
                     this.deleteUserHandler(this.state.actionPayload);
                     this.props.onModalToggle(e);
                  }}>Yes</Button>
                  <Button style={modalButtonStyles} clicked={this.props.onModalToggle}>No</Button>
               </React.Fragment>
            )
            break;
         case 'leaving group':
            modalContent = (
               <React.Fragment>
                  <h3>Are you sure you want to leave this group?</h3>
                  <Button style={modalButtonStyles}
                     clicked={(e) => {
                        this.leaveGroupHandler();
                        this.props.onModalToggle(e);
                        this.props.history.replace('/groups')
                     }}>Yes</Button>
                  <Button style={modalButtonStyles} clicked={this.props.onModalToggle}>No</Button>
               </React.Fragment>
            )
            break;
         case 'delete invitation':
            modalContent = (
               <React.Fragment>
                  <h3>Are you sure you want to delete this invitation?</h3>
                  <Button style={modalButtonStyles}
                     clicked={(e) => {
                        this.deleteInvitationHandler(this.state.actionPayload);
                        this.props.onModalToggle(e);
                     }}>Yes</Button>
                  <Button style={modalButtonStyles} clicked={this.props.onModalToggle}>No</Button>
               </React.Fragment>
            )
            break;
         default:
            modalContent = null
      }

      const modal = < Modal show={this.props.modalShown}
         toggleModal={this.props.onModalToggle}>{modalContent}</Modal>

      return (
         <React.Fragment>
            <h2>{groupName}</h2>
            <div className={styles.Wrapper}>
               <div className={styles.adminPanel}>
                  <h4>Admin panel</h4>
                  <ul>
                     <li onClick={(e) => {
                        this.setState({ chosenAction: 'delete group' })
                        this.props.onModalToggle(e)
                     }}>Delete group</li>
                  </ul>
               </div>
               <div className={styles.Members}>
                  <ul>
                     <h4>Members:</h4>
                     {groupMembersLiElements}
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
               <div className={styles.Invited}>
                  <ul>
                     <h4>Invited:</h4>
                     {invitedLiElements}
                  </ul>
               </div>
            </div>
            {modal}
         </React.Fragment >
      )
   }
}

const mapStateToProps = (state) => ({
   groups: state.groups.groups,
   usersList: state.groups.usersList,
   currentUser: state.firebase.profile,
   userId: state.firebase.auth.uid,
   modalShown: state.welcome.modalShown
})

const mapDispatchToProps = (dispatch) => {
   return {
      onInitUsersList: () => { dispatch(initUsersList()) },
      onModalToggle: (e) => { dispatch(toggleModal(e)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(SelectedGroup))