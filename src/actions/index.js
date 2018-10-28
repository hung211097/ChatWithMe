import {actionTypes} from '../constants/actionType'
import { ResultifyData } from '../services/utils.services'
import passwordHash from 'password-hash'
import { saveItem } from '../services/localStorage.services'

export const login = (user) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    firestore.get({collection: 'users', where: [['username', '==', user.username]]}).then((data) => {
      let obj = null
      obj = data.docs[0]
      // obj = obj[0]._document
      // console.log("DOCS", obj.data.internalValue.get('email'));
      // console.log(ResultifyData(obj, 'password').trim());
      // console.log(user.password);
      // console.log(passwordHash.verify(user.password, ResultifyData(obj, 'password').trim()));

      if(obj){  //Check password
        if(!passwordHash.verify(user.password, ResultifyData(obj, 'password').trim())){
          dispatch({type: actionTypes.LOGIN_FAILED})
          return
        }
      }
      if(data.docs.length){
        firebase.auth().signInWithEmailAndPassword(
          ResultifyData(obj, 'email').trim(),
          ResultifyData(obj, 'password').trim(),
        ).then(() => {
          saveItem('account_status', 'logged')
          dispatch({type: actionTypes.LOGIN_SUCCESS})
        }).catch(err => {
          dispatch({type: actionTypes.LOGIN_FAILED})
        })
      }
      else{
        dispatch({type: actionTypes.LOGIN_FAILED})
      }
    })
  }
}

export const register = (user, callback) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firestore = getFirestore();
    const firebase = getFirebase();

    let checkUsername = firestore.get({collection: 'users', where: [['username', '==', user.username]]})
    let checkEmail = firestore.get({collection: 'users', where: [['email', '==', user.email]]})
    Promise.all([checkUsername, checkEmail]).then(([resUsername, resEmail]) => {
      if(!resUsername.docs.length && !resEmail.docs.length){
        callback()
        firebase.auth().createUserWithEmailAndPassword(
          user.email,
          user.password
        ).then((res) => {
          firestore.collection('users').add({
            username: user.username.trim(),
            password: user.password.trim(),
            display_name: user.username.trim(),
            email: user.email.trim(),
            uid: res.user.uid
          })
        }).then(() => {
          dispatch({type: actionTypes.REGISTER_SUCCESS})
        })
        .catch(e => {
          dispatch({type: actionTypes.SERVER_ERROR})
        })
      }
      else{
        dispatch({type: actionTypes.REGISTER_FAILED})
      }
    })
  }
}

export const logout = (redirectCallback) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firebase = getFirebase();
    firebase.auth().signOut().then(() => {
      saveItem('account_status', 'unlogged')
      dispatch({type: actionTypes.LOGOUT})
    }).then(() => {
      redirectCallback()
    })
  }
}

export const changStatus = (status) => {
  return{
    type: actionTypes.CHANGE_STATUS,
    status: status
  }
}
