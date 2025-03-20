<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <AuthLogin />
  </div>
</template>

<script setup>
import Header from '~/components/users/Header.vue';
import AuthLogin from '~/components/users/auth/Login.vue';  // ✅ Bổ sung import
</script>
