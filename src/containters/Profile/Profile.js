import React, { Component } from 'react';

import styles from './Profile.module.css'

class Profile extends Component {
   render() {
      return (
         <div className={styles.Profile}>
            <ul>
               <li>Set your nickname</li>
               <li>Change your profile img</li>
               <li>Change password</li>
            </ul>
         </div>
      )
   }
}

export default Profile