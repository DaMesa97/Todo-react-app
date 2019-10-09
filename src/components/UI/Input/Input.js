import React from 'react'

import styles from './Input.module.css'
import { FaPlus } from "react-icons/fa";

const input = (props) => {

   return (
      <div className={styles.Input}>
         <input placeholder={props.placeholder} className={styles.InputElement} onChange=
            {props.changed}
            value={props.value} />
         <FaPlus onClick={props.clicked} />
      </div>
   );
}

export default input