/**
 * Module centralisé pour la gestion des tokens d'authentification.
 *
 * Stocke les tokens dans localStorage (lecture côté client) ET dans un cookie
 * (lecture côté serveur pour le middleware Next.js).
 *
 * Pour migrer vers des cookies HttpOnly à l'avenir, il suffira de modifier
 * ce seul fichier — le reste de l'application reste inchangé.
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Durée du cookie (7 jours — doit correspondre à la durée du refresh token côté backend)
const COOKIE_MAX_AGE_DAYS = 7;

// ─── Helpers cookies ────────────────────────────────────────────────────────

function setCookie(name: string, value: string, days: number): void {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

// ─── API publique ───────────────────────────────────────────────────────────

function isClient(): boolean {
  return typeof window !== "undefined";
}

export const tokenStorage = {
  getAccessToken(): string | null {
    if (!isClient()) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (!isClient()) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens(accessToken: string, refreshToken: string): void {
    if (!isClient()) return;

    // localStorage pour le client
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    // Cookie pour le middleware Next.js (côté serveur)
    setCookie(ACCESS_TOKEN_KEY, accessToken, COOKIE_MAX_AGE_DAYS);
  },

  setAccessToken(accessToken: string): void {
    if (!isClient()) return;

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    setCookie(ACCESS_TOKEN_KEY, accessToken, COOKIE_MAX_AGE_DAYS);
  },

  clearTokens(): void {
    if (!isClient()) return;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    deleteCookie(ACCESS_TOKEN_KEY);
  },

  hasToken(): boolean {
    return !!this.getAccessToken();
  },
};

export default tokenStorage;
