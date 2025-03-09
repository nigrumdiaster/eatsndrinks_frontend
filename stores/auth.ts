import { defineStore } from "pinia";
import { useCookie, useRuntimeConfig } from "#app";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export const useAuthStore = defineStore("auth", () => {
  const accessToken = useCookie<string | null>("access_token");
  const refreshToken = useCookie<string | null>("refresh_token");
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value);

  const config = useRuntimeConfig();

  const login = async (username: string, password: string) => {
    try {
      const data = await $fetch<{ access: string; refresh: string }>(
        `${config.public.apiBase}/users/login/`,
        {
          method: "POST",
          body: { username, password },
        }
      );

      if (!data || !data.access || !data.refresh) {
        throw new Error("Invalid response from server");
      }

      // ✅ Save tokens in cookies
      accessToken.value = data.access;
      refreshToken.value = data.refresh;

      // ✅ Fetch user info
      await fetchUser();
    } catch (err) {
      console.error("Login failed:", err);
      throw new Error("Đăng nhập thất bại");
    }
  };

  const fetchUser = async () => {
    if (!accessToken.value) return;

    try {
      const data = await $fetch<User>(`${config.public.apiBase}/users/user/profile/`, {
        headers: { Authorization: `Bearer ${accessToken.value}` },
      });

      if (!data) throw new Error("User data not found");

      user.value = data;
      console.log("user value", user.value);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      logout();
    }
  };

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken.value) throw new Error("No refresh token available");

      const data = await $fetch<{ access: string }>(
        `${config.public.apiBase}/users/api/token/refresh/`,
        {
          method: "POST",
          body: { refresh: refreshToken.value },
        }
      );

      if (!data || !data.access) throw new Error("Invalid response from server");

      accessToken.value = data.access;
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
    }
  };

  const logout = () => {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
  };

  return { login, logout, fetchUser, refreshAccessToken, accessToken, user, isAuthenticated };
});
