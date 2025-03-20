<template>
  <div>
    <Header />
    <div class="flex flex-col items-center justify-center h-screen text-center">
      <h1 class="text-6xl font-bold text-red-500">404 Error</h1>
      <p class="text-xl text-gray-600 mt-4">Oops! Trang bạn tìm kiếm không tồn tại.</p>
      <router-link to="/" class="mt-6 px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition">
        Quay về trang chủ
      </router-link>
    </div>
    <Footer />
  </div>
</template>
<script lang="ts" setup>
import Header from '~/components/users/Header.vue';
import Footer from '~/components/users/Footer.vue';


</script>
