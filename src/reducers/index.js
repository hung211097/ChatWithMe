import {combineReducers} from 'redux'
import userReducer from './user'
import {firestoreReducer} from 'redux-firestore'

const rootReducer = combineReducers({
  user: userReducer,
  firestore: firestoreReducer
})

export default rootReducer;
