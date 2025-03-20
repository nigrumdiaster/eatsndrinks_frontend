<template>
  <div class="max-w-3xl mx-auto py-10 px-6 bg-white shadow-lg rounded-lg my-36">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Thông Tin Cá Nhân</h1>

    <div v-if="user" class="space-y-4">
      <div class="flex items-center space-x-4">
        <div>
          <h2 class="text-xl font-semibold">
            Xin chào {{ user.first_name ?? "Người dùng" }} {{ user.last_name ?? "" }}
          </h2>
        </div>
      </div>

      <div>
        <label class="font-semibold text-gray-700">Họ và Tên</label>
        <p class="border rounded-lg px-4 py-2">
          {{ (user.first_name ?? "Chưa cập nhật") + " " + (user.last_name ?? "") }}
        </p>
      </div>

      <div>
        <label class="font-semibold text-gray-700">Tên đăng nhập</label>
        <p class="border rounded-lg px-4 py-2">{{ user.username ?? "Chưa cập nhật" }}</p>
      </div>

      <div>
        <label class="font-semibold text-gray-700">Số điện thoại</label>
        <p class="border rounded-lg px-4 py-2">{{ user.phone_number ?? "Chưa cập nhật" }}</p>
      </div>

      <div>
        <label class="font-semibold text-gray-700">Địa chỉ</label>
        <p class="border rounded-lg px-4 py-2">{{ user.address ?? "Chưa cập nhật" }}</p>
      </div>

      <div>
        <label class="font-semibold text-gray-700">Ngày sinh</label>
        <p class="border rounded-lg px-4 py-2">{{ user.date_of_birth ?? "Chưa cập nhật" }}</p>
      </div>

      <button @click="logout"
        class="mt-4 bg-red-500 text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-800">
        Đăng Xuất
      </button>
    </div>

    <p v-else class="text-gray-500">Vui lòng đăng nhập để xem thông tin cá nhân.</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

// Lấy store từ Pinia
const authStore = useAuthStore();
const router = useRouter();

// Lấy thông tin user từ store
const user = computed(() => authStore.user);

// Hàm đăng xuất
const logout = () => {
  authStore.logout();
  router.push('/login'); // Chuyển hướng về trang đăng nhập
};
</script>

<style scoped>
.shadow-lg {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
