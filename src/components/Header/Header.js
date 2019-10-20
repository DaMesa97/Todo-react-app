import React from 'react';

import styles from './Header.module.css'

const header = (props) => {
   return (
      <nav className={styles.Nav}>
         <ul>
            <li>Login</li>
            <li>Create account</li>
         </ul>
      </nav>
   );
}

export default header