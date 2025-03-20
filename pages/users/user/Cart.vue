<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <UserCart />
  </div>
</template>


<script setup>
import Header from '~/components/users/Header.vue';
import  UserCart  from '~/components/users/user/Cart.vue';

definePageMeta({
  middleware: 'auth',
});
</script>