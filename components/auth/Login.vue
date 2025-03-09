<template>
  <section class="flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">Đăng nhập</h2>
      
      <form @submit.prevent="handleLogin">
        <!-- Username -->
        <div class="mb-4">
          <label for="username" class="block text-gray-700 font-medium mb-2">Tên đăng nhập</label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label for="password" class="block text-gray-700 font-medium mb-2">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
        >
          Đăng nhập
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-4">
        Chưa có tài khoản?
        <NuxtLink to="/register" class="text-yellow-500 hover:underline">Đăng ký</NuxtLink>
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCookie } from "#app";
import { useToast } from "vue-toastification";

const username = ref("");
const password = ref("");
const router = useRouter();

const toast = useToast();

const accessToken = useCookie("access_token");
const refreshToken = useCookie("refresh_token");

const handleLogin = async () => {
  try {
    const response = await useApiFetch<{ detail: string; refresh: string; access: string }>("/users/login/", {
      method: "POST",
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    accessToken.value = response.access;
    refreshToken.value = response.refresh;

    toast.success("Đăng nhập thành công!");
    router.push("/");
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    toast.error("Đăng nhập thất bại! Hãy kiểm tra lại tài khoản và mật khẩu.");
  }
};
</script>