import { useAuthStore } from "@/stores/auth";
import { useRuntimeConfig } from "#app";

export const useApiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  const authStore = useAuthStore(); // Lấy trạng thái đăng nhập

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {}),
  };

  try {
    const response = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers: { ...headers, ...(options.headers || {}) }, // Gộp headers
    });

    if (!response.ok) {
      // ✅ Xử lý khi token hết hạn
      if (response.status === 401) {
        if (!authStore.isRefreshing) {
          authStore.isRefreshing = true;
          try {
            await authStore.refreshAccessToken();
            authStore.isRefreshing = false;
            return useApiFetch<T>(endpoint, options); // ✅ Gọi lại API sau khi làm mới token
          } catch (refreshError) {
            authStore.isRefreshing = false;
            throw new Error("Unauthorized: Refresh token failed");
          }
        } else {
          throw new Error("Unauthorized: Token expired");
        }
      }
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    // ✅ Kiểm tra nếu phản hồi rỗng thì trả về object trống
    const text = await response.text();
    return text ? (JSON.parse(text) as T) : ({} as T);
  } catch (error) {
    console.error("❌ API call failed:", error);
    return {} as T; // ✅ Tránh return `undefined`
  }
};
