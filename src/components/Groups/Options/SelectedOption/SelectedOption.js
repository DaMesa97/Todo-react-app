import React from 'react'

import CreateGroup from '../CreateGroup/CreateGroup'
import YourGroups from '../YourGroup/YourGroup'

const option = (props) => {
   // console.log(props)
   let content = null

   switch (props.match.params.option) {
      case 'create-group':
         content = < CreateGroup />
         break;
      case 'your-groups':
         content = < YourGroups />
         break;
      case 'invitiations':
         content = <div>Your invitations</div>
   }
   return (
      content
   )
}

export default option