import React from 'react'

import styles from './Input.module.css'



const input = (props) => {

   return (
      <div className={styles.Input}>
         <input placeholder={props.placeholder}
            className={styles.InputElement}
            onChange={props.changed}
            value={props.value}
            onKeyDown={props.keyDown} />
      </div>
   );
}

export default input