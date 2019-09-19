const firebase = require("firebase/app");
require("firebase/database");

module.exports = class FirebaseController {
    constructor(config) {
      this.firebaseConfig = config.firebaseConfig;
      this.listeners = [];
      firebase.initializeApp(this.firebaseConfig);
    }


    subscribeToTopic(topic,callback) {
        const listener = firebase.database().ref(topic);
        this.listeners.push(listener);
        listener.on('value', function(snapshot) {
            callback(snapshot.val());
        });   
    }

    writeToTopic(topic, value) {
        firebase.database().ref(topic).set(value);
    }

    close() {
        this.listeners.forEach((listener) => {
            listener.off();
        });
    }

}