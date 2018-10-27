import {actionTypes} from '../constants/actionType'
import { ResultifyData } from '../services/utils.services'

export const login = (user) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    firestore.get({collection: 'users', where: ['username', '==', user.username]}).then((data) => {
      // console.log("DATA", data);
      let obj = data.docs[0]
      // console.log("ARR", obj);
      // a = a[0]._document
      // console.log("DOCS", a.data.internalValue.get('email'));
      if(data.docs.length){
        firebase.auth().signInWithEmailAndPassword(
          ResultifyData(obj, 'email').trim(),
          ResultifyData(obj, 'password').trim(),
        ).then(() => {
          dispatch({type: actionTypes.LOGIN_SUCCESS})
        }).catch(err => {
          dispatch({type: actionTypes.LOGIN_FAILED})
        })


        // firebase.auth().signOut().then(() => {
        //   dispatch({type: actionTypes.LOGIN_SUCCESS})
        // }).catch(err => {
        //   console.log(err);
        //   dispatch({type: actionTypes.LOGIN_FAILED, user: user})
        // })
      }
      else{
        dispatch({type: actionTypes.LOGIN_FAILED})
      }
    })
  }
}

export const register = (user) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firestore = getFirestore();
    firestore.collection('user').get().then((data) => {
      console.log("DATA", data);
    })
    dispatch({type: actionTypes.REGISTER, user: user})
  }
}

export const logout = () => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firebase = getFirebase();
    firebase.auth().signOut().then(() => {
      dispatch({type: actionTypes.LOGOUT})
    })
  }
}

export const changStatus = (status) => {
  return{
    type: actionTypes.CHANGE_STATUS,
    status: status
  }
}
