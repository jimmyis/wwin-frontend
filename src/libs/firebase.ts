import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

export const firebaseConfigs: { [key: string]: any } = {
  "production": {
    apiKey: "AIzaSyDl7u-Fx-PFiysr8SEVVIxAkSkM2hyFbQw",
    authDomain: "wwin-mainnet.firebaseapp.com",
    projectId: "wwin-mainnet",
    storageBucket: "wwin-mainnet.appspot.com",
    messagingSenderId: "767713616013",
    appId: "1:767713616013:web:4ff215118b66dc1692c2c4",
    measurementId: "G-07E3T94YPM"
  },
  "development": {
    apiKey: "AIzaSyDdW6HZ_ieI8Tc_y-vMgc-zVtsW0oLM3jo",
    authDomain: "tokenine-wwin-dev.firebaseapp.com",
    projectId: "tokenine-wwin-dev",
    storageBucket: "tokenine-wwin-dev.appspot.com",
    messagingSenderId: "238781180999",
    appId: "1:238781180999:web:a83324430b1d96ad28d562"
  }
};

export const firebaseApps: { [key: string]: any } = {}

// Initialize Firebase
// export const Afirebasepp = initializeApp(firebaseConfig)
// export const db = getFirestore()
let defaultInstance = {
  db: null
}

export { defaultInstance as default }

export const getFirebaseApp = (environment: string) => {
  const _env = firebaseConfigs[environment] ? environment : "development"
  
  if (Object.prototype.hasOwnProperty.call(firebaseApps, _env) === false) {
    const _config = firebaseConfigs[_env]
    if (Object.keys(firebaseApps).length === 0) {
      // console.log("Initialize default app")
      const _firebaseApp = initializeApp(_config)
      firebaseApps[_env] = {
        app: _firebaseApp,
        db: getFirestore(_firebaseApp)
      }
      firebaseApps[_env].db.name = _env

    } else {
      // console.log("Initialize alternative app")
      const _firebaseApp = initializeApp(_config, _env)
      firebaseApps[_env] = {
        app: _firebaseApp,
        db: getFirestore(_firebaseApp)
      }
      firebaseApps[_env].db.name = _env
    }
  } else {
    // console.log("Use already exists app", _env)
  }

  defaultInstance = firebaseApps[_env]
  // console.log("Using default instance as ", defaultInstance)

  return defaultInstance
}
