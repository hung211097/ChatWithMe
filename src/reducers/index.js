import {combineReducers} from 'redux'
import authReducer from './auth'
import chatReducer from './chat'
import {firestoreReducer} from 'redux-firestore'
import {firebaseReducer} from 'react-redux-firebase'

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
})

export default rootReducer;
