import {actionTypes} from '../constants/actionType'

const initialState = {
  infoUser: null
}

export default (state = initialState, action) => {
  switch(action.type){
    case actionTypes.INFO_CHAT_USER:
      return{
        ...state,
        infoUser: action.info
      }
    default:
      return state
  }
}
