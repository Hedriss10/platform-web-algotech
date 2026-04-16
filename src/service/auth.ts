import type { LoginRequestBody, LoginResponseBody } from "../types/auth";
import { apiClient } from "./api-base-client";
import { clearStoredTokens, setStoredTokens } from "./token-storage";

export async function loginRequest(
  body: LoginRequestBody
): Promise<LoginResponseBody> {
  const { data } = await apiClient.post<LoginResponseBody>(
    "/api/v2/login",
    body
  );
  setStoredTokens(data.access_token, data.token_type);
  return data;
}

export function logout(): void {
  clearStoredTokens();
}
