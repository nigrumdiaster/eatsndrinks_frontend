<template>
  <section class="flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">Đăng ký</h2>

      <form @submit.prevent="handleRegister">
        <!-- First Name -->
        <div class="mb-4">
          <label for="first_name" class="block text-gray-700 font-medium mb-2">Họ</label>
          <input v-model="firstName" type="text" id="first_name"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
        </div>

        <!-- Last Name -->
        <div class="mb-4">
          <label for="last_name" class="block text-gray-700 font-medium mb-2">Tên</label>
          <input v-model="lastName" type="text" id="last_name"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
        </div>

        <!-- Username -->
        <div class="mb-4">
          <label for="username" class="block text-gray-700 font-medium mb-2">Tên đăng nhập</label>
          <input v-model="username" type="text" id="username"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label for="password" class="block text-gray-700 font-medium mb-2">Mật khẩu</label>
          <input v-model="password" type="password" id="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
        </div>

        <!-- Confirm Password -->
        <div class="mb-4">
          <label for="confirm_password" class="block text-gray-700 font-medium mb-2">Xác nhận mật khẩu</label>
          <input v-model="confirmPassword" type="password" id="confirm_password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
        </div>

        <!-- Submit Button -->
        <button type="submit" class="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition">
          Đăng ký
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-4">
        Đã có tài khoản?
        <NuxtLink to="/login" class="text-yellow-500 hover:underline">Đăng nhập</NuxtLink>
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";
const firstName = ref("");
const lastName = ref("");
const username = ref("");
const password = ref("");
const confirmPassword = ref("");


const toast = useToast();

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    toast.error("Mật khẩu xác nhận không khớp!");
    return;
  }

  try {
    const response = await useApiFetch("/users/register/", {
      method: "POST",
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        first_name: firstName.value,
        last_name: lastName.value,
      }),
    });

    console.log("Đăng ký thành công:", response);
    // TODO: Chuyển hướng người dùng sau khi đăng ký thành công
    toast.success("Đăng ký thành công! 🎉");
    navigateTo("/login");

  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    toast.error("Đăng ký thất bại! Hãy thử lại.");
  }
};
</script>
