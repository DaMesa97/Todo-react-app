import React, { Component } from 'react';

import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'

import { deleteNotification } from '../../store/actions/user_profile'

import styles from './Notifications.module.css'

import Alert from '../UI/Alert/Alert'

import { FaExclamation as ExclamationIcon } from "react-icons/fa";

class Notifications extends Component {

   mouseEnterNotificationHandler = (e, message) => {
      const span = e.target.querySelector('span')
      const classes = [e.target.className]
      classes.push(styles.Active)

      e.target.className = classes.join(' ')
      span.textContent = message
   }

   mouseLeaveNotificationHandler = (e, notificationId) => {
      console.log(e.target)
      const span = e.target.querySelector('span')
      const classes = e.target.className.split(' ')
      classes.pop()

      e.target.className = classes
      span.textContent = ""
      e.target.style.transform = "scale(0)"

      setTimeout(() => {
         this.props.onDeleteNotification(this.props.userId, notificationId)
      }, 200)
   }

   notificationClickedHandler = () => {
      console.log('click')
   }


   render() {
      let notifications = (
         this.props.notifications.map(notification => {
            const notHoveredText = notification.type
            return < Alert key={notification.notificationId} alertType='notification'
               onMouseEnter={(e) => {
                  let message;
                  switch (notification.type) {
                     case 'invitation':
                        message = `You have been invited to group '${notification.invitedTo.groupName}' by ${notification.invitedBy}`
                  }
                  this.mouseEnterNotificationHandler(e, message)
               }}
               onMouseLeave={(e) => this.mouseLeaveNotificationHandler(e, notification.notificationId)}
               onClick={this.notificationClickedHandler}
            >
               <span>
                  < ExclamationIcon />
               </span>
            </Alert>
         })
      )

      return (
         <div className={styles.Notifications}>
            {notifications}
         </div>
      )
   }
}

const mapStateToProps = (state) => ({
   notifications: state.profile.notifications,
   userId: state.auth.userId
})

const mapDispatchToProps = dispatch => {
   return {
      onDeleteNotification: (userId, notificationId) => { dispatch(deleteNotification(userId, notificationId)) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(Notifications))