import React from 'react'

import styles from './Input.module.css'



const input = (props) => {

   let classes = [styles.InputElement]

   if (!props.valid && props.touched) {
      classes.push(styles.Error)
   }

   return (
      <div className={styles.Input}>
         <input
            style={props.style}
            className={classes.join(' ')}
            onChange={props.changed}
            value={props.value}
            onKeyDown={props.keyDown}
            {...props.elementConfig}
         />
      </div>
   );
}

export default input