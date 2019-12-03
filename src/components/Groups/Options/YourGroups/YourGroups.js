import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'
import { initUserGroups } from '../../../../store/actions/groups'

import { Route, Link } from 'react-router-dom'

import styles from './YourGroups.module.css'

import Spinner from '../../../UI/Spinner/Spinner'

class YourGroups extends Component {

   componentDidMount() {
      this.props.onInitUsersGroups(this.props.userGroups)
   }

   // componentWillUnmount() {
   //    this.props.clearGroups()
   // }

   render() {
      let groups;

      groups = (
         <ul className={styles.groupsList}>
            {this.props.groups.map(group => {
               return <li key={group.groupId}><Link to={{
                  pathname: `group/${group.groupName}`,
                  state: {
                     groupId: group.groupId
                  }
               }}>{group.groupName}</Link></li>
            })}
         </ul>
      )

      if (this.props.loading) {
         groups = <Spinner />
      }

      return (
         <React.Fragment>
            <h3>Your groups!</h3>
            {groups}
         </React.Fragment >
      )
   }
}

const mapStateToProps = (state) => ({
   groups: state.groups.groups,
   userGroups: state.firebase.profile.groups,
   loading: state.groups.loading
})

const mapDispatchToProps = (dispatch) => {
   return {
      onInitUsersGroups: (usersGroups) => { dispatch(initUserGroups(usersGroups)) },
   }
}

export default connect(mapStateToProps, mapDispatchToProps)((withFirebase(YourGroups)))
