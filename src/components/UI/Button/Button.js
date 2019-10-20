import React from 'react';

import styles from './Button.module.css'

const button = (props) => {
   let classes = [styles.Button]

   if (props.active) {
      classes.push(styles.Active)
   }

   return (
      <div className={classes.join(' ')} onClick={props.clicked}>{props.children}</div>
   )
}

export default button