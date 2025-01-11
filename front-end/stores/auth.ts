import { defineStore } from "pinia";

interface User {
  id: number;
  name: string;
  email: string;
  reviews: [];
  isAdmin: 0 | 1;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: (useCookie("user")?.value as unknown as User) || null,
    token: useCookie("auth_token").value || null,
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
    },
    setToken(token: string) {
      this.token = token;
    },
    clearAuth() {
      this.user = null;
      this.token = null;
    },
  },
});
