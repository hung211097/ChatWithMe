import {actionTypes} from '../constants/actionType'

export const login = (user) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firestore = getFirestore();
    console.log(firestore);
    firestore.collection('user').get().then((data) => {
      console.log("DATA", data);
    })
    dispatch({type: actionTypes.LOGIN, user: user})
  }
}
