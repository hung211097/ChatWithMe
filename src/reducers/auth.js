import {actionTypes} from '../constants/actionType'

const initialState = {
  auth_status: null
}

export default (state = initialState, action) => {
  switch(action.type){
    case actionTypes.LOGIN_FAILED:
      return{
        ...state,
        auth_status: 'failed'
      }
    case actionTypes.LOGIN_SUCCESS:
      return{
        ...state,
        auth_status: 'success'
      }
    case actionTypes.LOGOUT:
      return{
        ...state,
        auth_status: 'out'
      }
    case actionTypes.CHANGE_STATUS:
      return{
        ...state,
        auth_status: action.status
      }
    case actionTypes.REGISTER_FAILED:
      return{
        ...state,
        auth_status: 'failed'
      }
    case actionTypes.REGISTER_SUCCESS:
      return{
        ...state,
        auth_status: 'success'
      }
    case actionTypes.SERVER_ERROR:
      return{
        ...state,
        server_status: 'error'
      }
    default:
      return state
  }
}
