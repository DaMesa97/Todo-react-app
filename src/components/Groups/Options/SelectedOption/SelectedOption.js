import React from 'react'

import CreateGroup from '../CreateGroup/CreateGroup'
import YourGroups from '../YourGroups/YourGroups'
import Invitations from '../Invitations/Invitations'

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
         content = <Invitations {...props} />
   }
   return (
      content
   )
}

export default option