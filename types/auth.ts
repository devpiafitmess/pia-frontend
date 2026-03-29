export type AppUserRole = "subscriber" | "admin";

export type AuthUser = {
  id: string;
  email: string | null;
  phone: string | null;
  role: AppUserRole;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number | null;
};

export type AuthResult = {
  user: AuthUser;
  session: AuthSession;
};

export type AuthErrorCode =
  | "invalid_credentials"
  | "invalid_session"
  | "invalid_payload"
  | "invalid_json"
  | "email_already_registered"
  | "registration_failed"
  | "internal_error";

export type AuthErrorResponse = {
  error: string;
  code: AuthErrorCode;
};
