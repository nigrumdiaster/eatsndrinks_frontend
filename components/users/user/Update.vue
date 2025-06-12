<template>
  <div class="max-w-3xl mx-auto py-10 px-6 bg-white shadow-lg rounded-lg my-36">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Cập Nhật Thông Tin Cá Nhân</h1>

    <form @submit.prevent="submitForm" class="space-y-4" v-if="form">
      <div class="flex items-center space-x-4">
        <h2 class="text-xl font-semibold text-gray-800">
          Chỉnh sửa thông tin cho {{ form.first_name || 'Người dùng' }}
        </h2>
      </div>

      <div>
        <label class="font-semibold text-gray-700">Họ</label>
        <input type="text" v-model="form.first_name"
          class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>

      <div>
        <label class="font-semibold text-gray-700">Tên</label>
        <input type="text" v-model="form.last_name"
          class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>

      <div>
        <label class="font-semibold text-gray-700">Tên đăng nhập</label>
        <input type="text" v-model="form.username" disabled
          class="w-full bg-gray-100 border rounded-lg px-4 py-2 cursor-not-allowed" />
      </div>

      <div>
        <label class="font-semibold text-gray-700">Số điện thoại</label>
        <input type="text" v-model="form.phone_number"
          class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>

      <div>
        <label class="font-semibold text-gray-700">Địa chỉ</label>
        <textarea v-model="form.address"
          class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"></textarea>
      </div>

      <div class="mt-4 flex justify-between">
        <button type="submit"
          class="bg-yellow-500 text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-800">
          Lưu Thay Đổi
        </button>

        <button type="button" @click="cancel"
          class="bg-red-500 text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-800">
          Hủy
        </button>
      </div>
    </form>

    <p v-else class="text-gray-500">Vui lòng đăng nhập để chỉnh sửa thông tin.</p>
  </div>
</template>


<script setup lang="ts">
import { useApiFetch } from "@/composables/useApi";
import { reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from "vue-toastification";
import { navigateTo } from '#app';

// Kiểu dữ liệu người dùng (tùy chỉnh theo thực tế)
interface User {
  first_name: string
  last_name: string
  username: string
  phone_number: string
  address: string
}

const authStore = useAuthStore();
const router = useRouter();
const token = useCookie("access_token");
const user = computed(() => authStore.user);
const toast = useToast();
const config = useRuntimeConfig();

// Reactive form với kiểu rõ ràng
const form = reactive<User>({
  first_name: '',
  last_name: '',
  username: '',
  phone_number: '',
  address: ''
})

// Khi component được mounted, lấy dữ liệu người dùng gán vào form
onMounted(() => {
  if (user.value) {
    form.first_name = user.value.first_name || ''
    form.last_name = user.value.last_name || ''
    form.username = user.value.username || ''
    form.phone_number = user.value.phone_number || ''
    form.address = user.value.address || ''
  }
})

// Hàm submit: cập nhật thông tin
const submitForm = async () => {
  try {
    await $fetch(`${config.public.apiBase}/users/user/profile/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: {
        first_name: form.first_name,
        last_name: form.last_name,
        phone_number: form.phone_number,
        address: form.address,
      },
    });

    toast.success('Cập nhật thông tin thành công!');
    setTimeout(async () => {
      await navigateTo('/profile');
      window.location.reload();
    }, 300);
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin:', error);
    toast.error('Cập nhật thất bại!');
  }
};



// Hủy và quay về trang trước
const cancel = () => {
  router.push('/profile')
}
</script>
