import React, { Component } from 'react';
import { withRouter, Route, Switch, BrowserRouter, Link } from 'react-router-dom'

import GroupInstruction from '../../components/Groups/GroupInstruction/GroupsInstruction'

import styles from './Groups.module.css'

class Groups extends Component {

   componentDidMount() {
      console.log(this.props.match)
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
                           Your Groups
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
                  <Route path={`${this.props.match.path}/:option`} component={Option} />
               </div>
            </div>
         </BrowserRouter>
      )
   }
}

export default withRouter(Groups)