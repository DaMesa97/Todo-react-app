import React, { Component } from 'react';
import { withRouter, Route, Switch, BrowserRouter, Link } from 'react-router-dom'

import GroupInstruction from '../../components/Groups/GroupInstruction/GroupsInstruction'
import SelectedOption from '../../components/Groups/Options/SelectedOption/SelectedOption'

import styles from './Groups.module.css'

class Groups extends Component {

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
                  <Route exact path={this.props.match.path} component={GroupInstruction} />
                  <Route path={`${this.props.match.path}/:option`} component={SelectedOption} />
               </div>
            </div>
         </BrowserRouter>
      )
   }
}

export default withRouter(Groups)