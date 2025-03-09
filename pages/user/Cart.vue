<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <UserCart />
  </div>
</template>


<script setup>
import { UserCart } from '#components';

definePageMeta({
  middleware: 'auth',
});
</script>