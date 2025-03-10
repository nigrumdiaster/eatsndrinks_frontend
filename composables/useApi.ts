import { useAuthStore } from "@/stores/auth";
import { useRuntimeConfig } from "#app";

export const useApiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  const authStore = useAuthStore(); // Get auth store instance

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {}),
  };

  try {
    const response = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers: { ...headers, ...(options.headers || {}) }, // Merge headers
    });

    if (!response.ok) {
      // ✅ Handle expired token: Refresh & Retry
      if (response.status === 401) {
        await authStore.refreshAccessToken(); // Refresh the token
        return useApiFetch<T>(endpoint, options); // Retry request
      }
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
