import React from 'react'

import CreateGroup from '../CreateGroup/CreateGroup'
import YourGroups from '../YourGroups/YourGroups'

const option = (props) => {
   let content = null

   switch (props.match.params.option) {
      case 'create-group':
         content = < CreateGroup {...props} />
         break;
      case 'your-groups':
         content = < YourGroups {...props} />
         break;
      case 'invitiations':
         content = <div>Your invitations</div>
   }
   return (
      content
   )
}

export default option