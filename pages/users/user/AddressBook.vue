<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <AddressBook />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
});

import Header from '~/components/users/Header.vue';
import AddressBook from '~/components/users/user/AddressBook.vue'; // ✅ Nếu file là Profile.vue
</script>
