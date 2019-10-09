import React from 'react';

const button = (props) => {
   return (
      <div onClick={props.clicked}>{props.children}</div>
   )
}

export default button