<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <UserProfile />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
});

import Header from '~/components/users/Header.vue';
import UserProfile from '~/components/users/user/Profile.vue'; // ✅ Nếu file là Profile.vue
</script>
