<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <UserUpdate />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
});

import Header from '~/components/users/Header.vue';
import UserUpdate from '~/components/users/user/Update.vue'; // ✅ Nếu file là Update.vue
</script>

<style>

</style>