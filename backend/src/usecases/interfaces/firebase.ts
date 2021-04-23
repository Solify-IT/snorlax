interface UserMetadata {
  /**
   * The date the user last signed in, formatted as a UTC string.
   */
  lastSignInTime: string;
  /**
   * The date the user was created, formatted as a UTC string.
   */
  creationTime: string;
  /**
   * The time at which the user was last active (ID token refreshed),
   * formatted as a UTC Date string (eg 'Sat, 03 Feb 2001 04:05:06 GMT').
   * Returns null if the user was never active.
   */
  lastRefreshTime?: string | null;
  /**
   * @return A JSON-serializable representation of this object.
   */
  toJSON(): object;
}

interface UserRecord {
  /**
   * The user's `uid`.
   */
  uid: string;
  /**
   * The user's primary email, if set.
   */
  email?: string;
  /**
   * Whether or not the user's primary email is verified.
   */
  emailVerified: boolean;
  /**
   * The user's display name.
   */
  displayName?: string;
  /**
   * The user's primary phone number, if set.
   */
  phoneNumber?: string;
  /**
   * The user's photo URL.
   */
  photoURL?: string;
  /**
   * Whether or not the user is disabled: `true` for disabled; `false` for
   * enabled.
   */
  disabled: boolean;
  /**
   * Additional metadata about the user.
   */
  metadata: UserMetadata;
  /**
   * The user's hashed password (base64-encoded), only if Firebase Auth hashing
   * algorithm (SCRYPT) is used. If a different hashing algorithm had been used
   * when uploading this user, as is typical when migrating from another Auth
   * system, this will be an empty string. If no password is set, this is
   * null. This is only available when the user is obtained from
   * {@link auth.Auth.listUsers `listUsers()`}.
   *
   */
  passwordHash?: string;
  /**
   * The user's password salt (base64-encoded), only if Firebase Auth hashing
   * algorithm (SCRYPT) is used. If a different hashing algorithm had been used to
   * upload this user, typical when migrating from another Auth system, this will
   * be an empty string. If no password is set, this is null. This is only
   * available when the user is obtained from
   * {@link auth.Auth.listUsers `listUsers()`}.
   *
   */
  passwordSalt?: string;
  /**
   * The user's custom claims object if available, typically used to define
   * user roles and propagated to an authenticated user's ID token.
   * This is set via
   * {@link auth.Auth.setCustomUserClaims `setCustomUserClaims()`}
   */
  customClaims?: {
    [key: string]: any;
  };
  /**
   * The date the user's tokens are valid after, formatted as a UTC string.
   * This is updated every time the user's refresh token are revoked either
   * from the {@link auth.Auth.revokeRefreshTokens `revokeRefreshTokens()`}
   * API or from the Firebase Auth backend on big account changes (password
   * resets, password or email updates, etc).
   */
  tokensValidAfterTime?: string;
  /**
   * The ID of the tenant the user belongs to, if available.
   */
  tenantId?: string | null;
  /**
   * @return A JSON-serializable representation of this object.
   */
  toJSON(): object;
}

interface UpdateRequest {
  /**
   * Whether or not the user is disabled: `true` for disabled;
   * `false` for enabled.
   */
  disabled?: boolean;
  /**
   * The user's display name.
   */
  displayName?: string | null;
  /**
   * The user's primary email.
   */
  email?: string;
  /**
   * Whether or not the user's primary email is verified.
   */
  emailVerified?: boolean;
  /**
   * The user's unhashed password.
   */
  password?: string;
  /**
   * The user's primary phone number.
   */
  phoneNumber?: string | null;
  /**
   * The user's photo URL.
   */
  photoURL?: string | null;
}

interface CreateRequest extends UpdateRequest {
  /**
   * The user's `uid`.
   */
  uid?: string;
}

export default interface IFirebaseApp {
  auth(): {
    createUser(properties: CreateRequest): Promise<UserRecord>;
  }
}
