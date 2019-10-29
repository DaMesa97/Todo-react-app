import * as actions from '../actions/actionTypes'

const initialState = {
   registering: false,
   loginIn: false,
   modalShown: false
}

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actions.TOGGLE_MODAL:
         return {
            ...state,
            registering: action.registering,
            loginIn: !action.registering,
            modalShown: !state.modalShown
         }
   }
   return state
}

export default reducer