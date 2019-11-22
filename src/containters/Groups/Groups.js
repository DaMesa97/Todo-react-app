import React, { Component } from 'react';
import { withRouter, Route, BrowserRouter, Link, Switch } from 'react-router-dom'
import { withFirebase } from 'react-redux-firebase'

import { connect } from 'react-redux'
import { initUserGroups, initUsersList } from '../../store/actions/groups'

import GroupInstruction from '../../components/Groups/GroupInstruction/GroupsInstruction'
import SelectedOption from '../../components/Groups/Options/SelectedOption/SelectedOption'
import SelectedGroup from '../../components/Groups/SelectedGroup/SelectedGroup'

import styles from './Groups.module.css'

class Groups extends Component {
   state = {
      users: []
   }

   componentDidMount() {
      this.props.onInitUsersGroups(this.props.usersGroups)
      this.props.onInitUsersList()
   }

   render() {
      return (
         <BrowserRouter>
            <div className={styles.Groups}>
               <div className={styles.Settings}>
                  <ul>
                     <li>
                        <Link to={`${this.props.match.path}/create-group`}>
                           Create group
                     </Link>
                     </li>
                     <li>
                        <Link to={`${this.props.match.path}/your-groups`}>
                           Your groups
                     </Link>
                     </li>
                     <li>
                        <Link to={`${this.props.match.path}/invitiations`}>
                           Invitations
                     </Link>
                     </li>
                  </ul>
               </div>
               <div className={styles.Active}>
                  <Switch>
                     <Route exact path={this.props.match.path} component={GroupInstruction} />
                     <Route exact path={`${this.props.match.path}/:option`} component={SelectedOption} />
                     <Route path={`${this.props.match.path}/group/:group`} component={SelectedGroup} />
                  </Switch>
               </div>
            </div>
         </BrowserRouter>
      )
   }
}

const mapStateToProps = (state) => ({
   usersGroups: state.firebase.profile.groups
})

const mapDispatchToProps = dispatch => {
   return {
      onInitUsersGroups: (usersGroups) => { dispatch(initUserGroups(usersGroups)) },
      onInitUsersList: () => { dispatch(initUsersList()) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withFirebase(Groups)))