import React from 'react'

import styles from './Backdrop.module.css'


const backdrop = (props) => {
   let backdrop = null

   if (props.show) {
      backdrop = <div className={styles.Backdrop} onClick={props.clicked}></div>
   }

   return (
      backdrop
   )
}

export default backdrop