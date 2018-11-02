import {actionTypes} from '../constants/actionType'
import { saveItem } from '../services/localStorage.services'
import { googleAuthProvider } from '../config/fbConfig'

export const loginWithUsername = (user) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    firestore.get({collection: 'users', where: [['username', '==', user.username]]}).then((data) => {
      let obj = !!data.docs.length ? data.docs[0].data() : null

      if(data.docs.length){
        firebase.auth().signInWithEmailAndPassword(
          obj.email,
          user.password
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

export const loginWithGoogle = () => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    firebase.auth().signInWithPopup(googleAuthProvider).then(res => {
      dispatch({type: actionTypes.LOGIN_SUCCESS})
      saveItem('account_status', 'logged')
      const user = res.user;
      firestore.get({collection: 'users', where: [['email', '==', user.email]]}).then((data) => {
        if(!data.docs.length){
          firestore.collection('users').add({
            display_name: user.displayName,
            username: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
            phoneNumber: user.phoneNumber,
            status: 'offline',
            UID: user.W.O
          })
        }
      })
    }).catch(e => {
      dispatch({type: actionTypes.LOGIN_FAILED})
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
        firebase.auth().createUserWithEmailAndPassword(
          user.email,
          user.password
        ).then((res) => {
          return firestore.collection('users').doc(res.user.uid).set({
            username: user.username.trim(),
            display_name: user.username.trim(),
            email: user.email.trim(),
            status: 'offline',
            UID: res.user.uid
          })
        }).then(() => {
          callback()
          saveItem('account_status', 'logged')
          dispatch({type: actionTypes.REGISTER_SUCCESS})
        })
        .catch(e => {
          dispatch({type: actionTypes.REGISTER_FAILED})
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
    let uid = firebase.auth().O
    firebase.auth().signOut().then(() => {
      saveItem('account_status', 'unlogged')
      dispatch({type: actionTypes.LOGOUT})

      var userLastConnectedRef = firebase.database().ref("lastOnline/" + uid)
      userLastConnectedRef.set({endAt: firebase.database.ServerValue.TIMESTAMP})
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

export const updateStatus = () => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    let uid = firebase.auth().O

    var userLastConnectedRef = firebase.database().ref("lastOnline/" + uid)
    var connectedRef = firebase.database().ref("presence");
    connectedRef.on("value", function(snap) {
      let value = snap.val()
      if (value) {
        value = Object.entries(value)
        value.forEach((item) => {
          firestore.get({collection: 'users', where: [['UID', '==', item[0]]]}).then((data) => {
            let id = data.docs[0].id
            firestore.update({collection: 'users', doc: id}, {status: "online"})
          })
        })
        userLastConnectedRef.remove()
        userLastConnectedRef.onDisconnect().set({endAt: firebase.database.ServerValue.TIMESTAMP})
      }
    });
    var lastOnlineRef = firebase.database().ref('lastOnline')
    lastOnlineRef.on("value", function(snap){
      let value = snap.val()
      if (value) {
        value = Object.entries(value)
        value.forEach((item) => {
          firestore.get({collection: 'users', where: [['UID', '==', item[0]]]}).then((data) => {
            let id = data.docs[0].id
            firestore.update({collection: 'users', doc: id}, {status: "offline", endAt: item[1].endAt})
          })
        })
      }
    })
  }
}

export const updateUserChatName = (name) => {
  return{
    type: actionTypes.NAME_CHAT_USER,
    name: name
  }
}
