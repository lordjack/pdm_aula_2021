import firebase from "firebase";

// Your web app's Firebase configuration
const firebaseConfig = {
    /*   apiKey: "AIzaSyAAPjTWrGjwv8hCYC3XE4tU6NwwlGVNuyQ",
      authDomain: "pdm-aula-2021-e8589.firebaseapp.com",
      projectId: "pdm-aula-2021-e8589",
      storageBucket: "pdm-aula-2021-e8589.appspot.com",
      messagingSenderId: "129683323901",
      appId: "1:129683323901:web:618cd8b28c96f9cf9c7794", */

    apiKey: "AIzaSyApmI9dEQ0ZhXYdO0ofl3F7LuwfuuZ4Q-U",
    authDomain: "aulapdm2020-c43f0.firebaseapp.com",
    databaseURL: "https://aulapdm2020-c43f0.firebaseio.com",
    projectId: "aulapdm2020-c43f0",
    storageBucket: "aulapdm2020-c43f0.appspot.com",
    messagingSenderId: "660803083439",
    appId: "1:660803083439:web:2dde11a2a9086c372ec85a"

};

if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

export default firebase;
