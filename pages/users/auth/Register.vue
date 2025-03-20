<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <AuthRegister/>
  </div>
</template>

<script setup>
import Header from '~/components/users/Header.vue';
import AuthRegister from '~/components/users/auth/Register.vue';  // ✅ Bổ sung import
</script>