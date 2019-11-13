import React from 'react'

const option = (props) => {
   console.log(props)
   let content = null

   switch (props.match.params.option) {
      case 'create-group':
         content = <div>Create your group and add members!</div>
         break;
      case 'your-groups':
         content = <div>Your groups!</div>
         break;
      case 'invitiations':
         content = <div>Your invitations</div>
   }
   return (
      content
   )
}

export default option