import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'

import { Route, Link } from 'react-router-dom'

import styles from './YourGroups.module.css'

class YourGroups extends Component {
   componentDidMount() {
      console.log(this.props)
   }

   render() {
      const groups = (
         <ul className={styles.groupsList}>
            {this.props.groups.map(group => {
               return <li key={group.groupName}><Link to={`group/${group.groupName}`}>{group.groupName}</Link></li>
            })}
         </ul>
      )

      return (
         <React.Fragment>
            <h3>Your groups!</h3>
            {groups}
         </React.Fragment>
      )
   }
}

const mapStateToProps = (state) => ({
   groups: state.groups.groups
})

export default connect(mapStateToProps)((withFirebase(YourGroups)))
