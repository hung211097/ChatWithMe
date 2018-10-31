import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

var config = {
    apiKey: "AIzaSyDiPKFGBG3FyrSgECVun-LuNaqz2x7AtS4",
    authDomain: "chatwithme-e0fd3.firebaseapp.com",
    databaseURL: "https://chatwithme-e0fd3.firebaseio.com",
    projectId: "chatwithme-e0fd3",
    storageBucket: "chatwithme-e0fd3.appspot.com",
    messagingSenderId: "1037191381041"
  };
firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true })

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export default firebase;
