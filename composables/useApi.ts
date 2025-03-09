export const useApiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  try {
    const response = await fetch(`${apiBase}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
    }

    return (await response.json()) as T; // Ép kiểu về T
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    throw error;
  }
};
