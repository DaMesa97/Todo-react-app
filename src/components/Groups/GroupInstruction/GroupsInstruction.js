import React from 'react'

import styles from './GroupInstruction.module.css'

const setup = (props) => {
   return (
      <React.Fragment>
         <h3>Share your todos with other people to manage your projects!</h3>
         <p>Simply press 'Create group' to get started!</p>
         <div className={styles.Steps}>
            <div>1. Name your group</div>
            <div>2. Invite other users to join your project</div>
            <div>3. Set up todos</div>
            <div>4. Work!</div>
         </div>
      </React.Fragment>
   )
}

export default setup