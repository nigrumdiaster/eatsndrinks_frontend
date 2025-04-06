import tailwindcss from "@tailwindcss/vite";
import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  devServer: {
    port: 8090
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://127.0.0.1:8000', // Mặc định nếu chưa có ENV
    },
  },
  modules: ["@pinia/nuxt"],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});