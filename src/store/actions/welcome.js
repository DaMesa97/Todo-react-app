import * as actions from './actionTypes'

export const toggleModal = (e) => {
   let registering = false;

   switch (e.target.textContent) {

      case `Let's get started!`:
         registering = true
         break;
      case 'Create account':
         registering = true
         break;
      case 'Already have an account? Log in!':
         registering = false
         break;
      case 'Login':
         registering = false
         break;
   }

   return {
      type: actions.TOGGLE_MODAL,
      registering: registering
   }
}

export const clearModal = () => {
   return {
      type: actions.CLEAR_MODAL
   }
}