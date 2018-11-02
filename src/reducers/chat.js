import {actionTypes} from '../constants/actionType'

const initialState = {
  nameUser: null
}

export default (state = initialState, action) => {
  switch(action.type){
    case actionTypes.NAME_CHAT_USER:
      return{
        ...state,
        nameUser: action.name
      }
    default:
      return state
  }
}
