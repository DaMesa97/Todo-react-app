import React, { Component } from 'react';
import { connect } from 'react-redux'

import { withFirebase } from 'react-redux-firebase'


class YourGroups extends Component {

   // componentDidMount() {
   //    console.log(this.props)
   // }

   // initUserGroups = (token, userId) => {

   // }

   render() {
      return (
         <h4>Your groups</h4>
      )
   }
}



export default (withFirebase(YourGroups))