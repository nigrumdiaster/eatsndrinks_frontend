<template>
  <div class="max-w-xl mx-auto py-10 px-6 bg-white shadow-lg rounded-lg my-36">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Đổi Mật Khẩu</h1>

    <form @submit.prevent="changePassword" class="space-y-4">
      <div>
        <label class="font-semibold text-gray-700">Mật khẩu hiện tại</label>
        <input type="password" v-model="form.old_password"
          class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
      </div>

      <div>
        <label class="font-semibold text-gray-700">Mật khẩu mới</label>
        <input type="password" v-model="form.new_password"
          class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
      </div>

      <div>
        <label class="font-semibold text-gray-700">Xác nhận mật khẩu mới</label>
        <input type="password" v-model="form.confirm_password"
          class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
      </div>

      <div class="mt-4 flex justify-between">
        <button type="submit"
          class="bg-green-500 text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-800">
          Đổi Mật Khẩu
        </button>

        <button type="button" @click="cancel"
          class="bg-red-500 text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-800">
          Hủy
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from "vue-toastification";
import { useRouter } from 'vue-router';
import { useRuntimeConfig } from '#imports';

const toast = useToast();
const router = useRouter();
const config = useRuntimeConfig();
const token = useCookie("access_token");

const form = ref({
  old_password: '',
  new_password: '',
  confirm_password: '',
});

const changePassword = async () => {
  if (form.value.new_password !== form.value.confirm_password) {
    toast.error("Mật khẩu xác nhận không khớp!");
    return;
  }

  try {
    await $fetch(`${config.public.apiBase}/users/user/profile/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: {
        old_password: form.value.old_password,
        new_password: form.value.new_password,
      },
    });

    toast.success("Đổi mật khẩu thành công!");
    router.push('/profile');
  } catch (error: any) {
    console.error('Lỗi khi đổi mật khẩu:', error);
    toast.error(error?.data?.detail || 'Đổi mật khẩu thất bại!');
  }
};

const cancel = () => {
  router.push('/profile');
};
</script>
