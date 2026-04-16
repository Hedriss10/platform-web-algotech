const ACCESS_TOKEN_KEY = "platform_access_token";
const TOKEN_TYPE_KEY = "platform_token_type";

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredTokenType(): string | null {
  return localStorage.getItem(TOKEN_TYPE_KEY);
}

export function setStoredTokens(accessToken: string, tokenType: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
}

export function clearStoredTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
}
