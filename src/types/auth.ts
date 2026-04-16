export type LoginRequestBody = {
  email: string;
  password: string;
};

export type LoginResponseBody = {
  access_token: string;
  token_type: string;
};

/** Claims típicos do JWT (a API pode incluir outros campos ou nomes diferentes). */
export type JwtPayload = {
  id?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
};
