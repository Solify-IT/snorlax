import firebase from 'firebase/app';
import 'firebase/auth';
import { Maybe } from 'src/@types';
import firebaseConfig from './config';

export type LoginReturnType = {
  user: Maybe<firebase.User>,
  token: Maybe<string>,
};

export const EMAIL_ALREADY_EXISTS_ERROR = 'auth/email-already-exists';
export const USER_NOT_FOUND_ERROR = 'auth/user-not-found';
export const INTERNAL_ERROR = 'auth/internal-error';
export const INVALID_EMAIL_ERROR = 'auth/invalid-email';
export const WRONG_PASSWORD_ERROR = 'auth/wrong-password';

export default class Firebase {
  private authApp: firebase.auth.Auth;

  private firebaseApp: firebase.app.App;

  constructor(config: object = firebaseConfig) {
    this.firebaseApp = !firebase.apps.length
      ? firebase.initializeApp(config)
      : firebase.app();
    this.authApp = this.firebaseApp.auth();
    this.authApp.useDeviceLanguage();
  }

  async doSignInWithEmail(email: string, password: string): Promise<LoginReturnType> {
    const user = await this.authApp.signInWithEmailAndPassword(email, password);

    if (user.user) {
      const token = await user.user?.getIdToken();
      return { user: user.user, token };
    }

    return { user: null, token: null };
  }

  async diSignInWithToken(customToken: string): Promise<LoginReturnType> {
    const user = await this.authApp.signInWithCustomToken(customToken);

    if (user.user) {
      const token = await user.user?.getIdToken();
      return { user: user.user, token };
    }

    return { user: null, token: null };
  }

  static getSpanishErrorMessage(error: { code: string, message: string }): string {
    let message: string;
    switch (error.code) {
      case EMAIL_ALREADY_EXISTS_ERROR:
        message = 'Otro usuario ya está utilizando el correo electrónico proporcionado. Cada usuario debe tener un correo electrónico único.';
        break;
      case USER_NOT_FOUND_ERROR:
        message = 'No existe ningún registro de usuario que corresponda al email proporcionado.';
        break;
      case INTERNAL_ERROR:
        message = 'Ocurrió un error del lado del proveedor de identidad. Inténtalo mas tarde.';
        break;
      case INVALID_EMAIL_ERROR:
        message = 'El valor que se proporcionó para la propiedad del usuario email no es válido.';
        break;
      case WRONG_PASSWORD_ERROR:
        message = 'La contraseña ingresada es incorrecta.';
        break;
      default:
        message = '¡Error! Revisa los datos enviados.';
        break;
    }

    return message;
  }
}
