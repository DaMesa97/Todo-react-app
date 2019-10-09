import React from 'react'

import styles from './Alert.module.css'

const alert = (props) => {
   let classes = null

   switch (props.alertType) {
      case "success": classes = styles.Success
         break;
      case "error": classes = styles.Error
   }

   let alert = <div className={classes}>{props.children}</div>

   return (
      alert
   )
}

export default alert