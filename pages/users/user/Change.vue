<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <ChangePass />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
});

import Header from '~/components/users/Header.vue';
import ChangePass from '~/components/users/user/Change.vue'; 
</script>
<style>

</style>