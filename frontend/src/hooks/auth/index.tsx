import React, { useState } from 'react';
import User from 'src/@types/user';
import HOME, { ADMIN, INVENTORY } from 'src/Components/Router/routes';

export type AuthUserType = {
  name: User['displayName'],
  libraryId: User['libraryId'],
  roleId: User['roleId'],
  id: User['id'],
  library: User['library'],
  role: User['role'],
  email: User['email'],
};

export const ADMIN_ROLE_NAME = 'Admin';
export const LIBRERO_ROLE_NAME = 'Librero';

export const roleToHomePath = {
};

export type AuthStateType = {
  user: AuthUserType | undefined;
  idToken: string | undefined;
  expiresAt: Date | undefined;
};

export type AuthType = AuthStateType & {
  setAuthToken(idToken: AuthType['idToken']): AuthUserType | undefined;
  getHomeForRole: (roleName: string) => string;
};

export const AuthContext = React.createContext<AuthType>(undefined!);

export const INITIAL_STATE: AuthStateType = {
  user: undefined,
  idToken: undefined,
  expiresAt: undefined,
};

export const AuthContextProvider: React.FC = ({ children }) => {
  const [auth, setAuth] = useState<AuthStateType>(INITIAL_STATE);

  const parseJwt = (token: string): AuthUserType & { exp: number } => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

    return JSON.parse(jsonPayload);
  };

  const timestampToDate = (timestamp: number): Date => new Date(timestamp * 1000);

  const setAuthToken: AuthType['setAuthToken'] = (idToken) => {
    if (!idToken) return undefined;

    const tokenData = parseJwt(idToken);

    const user: AuthUserType = {
      email: tokenData.email,
      id: tokenData.id,
      library: tokenData.library,
      libraryId: tokenData.libraryId,
      name: tokenData.name,
      role: tokenData.role,
      roleId: tokenData.roleId,
    };

    setAuth({
      idToken,
      user,
      expiresAt: timestampToDate(tokenData.exp),
    });

    return user;
  };

  const getHomeForRole = (roleName: string): string => {
    switch (roleName) {
      case ADMIN_ROLE_NAME:
        return ADMIN;
      case LIBRERO_ROLE_NAME:
        return INVENTORY;
      default:
        return HOME;
    }
  };

  return (
    <AuthContext.Provider value={{ ...auth, setAuthToken, getHomeForRole }}>
      { children }
    </AuthContext.Provider>
  );
};

const useAuth = () => React.useContext(AuthContext);

export default useAuth;
