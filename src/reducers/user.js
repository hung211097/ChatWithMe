import {actionTypes} from '../constants/actionType'

export default (state = {}, action) => {
  switch(action.type){
    case actionTypes.LOGIN:
      return{
        ...state,
        status: 'logged'
      }
    default:
      return state
  }
}
