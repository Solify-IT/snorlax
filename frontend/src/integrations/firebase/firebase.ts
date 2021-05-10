import app from 'firebase/app';
import firebase from 'firebase';
import { Maybe } from 'src/@types';
import firebaseConfig from './config';

export type LoginReturnType = {
  user: Maybe<app.auth.UserCredential>,
  token: Maybe<string>,
};

export default class Firebase {
  private authApp: app.auth.Auth;

  private firebaseApp: app.app.App;

  constructor(config: object = firebaseConfig) {
    this.firebaseApp = firebase.initializeApp(config);
    this.authApp = this.firebaseApp.auth();
    this.authApp.useDeviceLanguage();
  }

  async doSignInWithEmail(email: string, password: string): Promise<LoginReturnType> {
    const user = await this.authApp.signInWithEmailAndPassword(email, password);
    console.log(user);

    if (user.user) {
      const token = await user.user?.getIdToken();
      return { user, token };
    }

    return { user: null, token: null };
  }
}
