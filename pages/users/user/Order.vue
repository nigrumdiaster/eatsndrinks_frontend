<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <UserOrder />
  </div>
</template>

<script lang="ts" setup>
import Header from '~/components/users/Header.vue';
import UserOrder from '~/components/users/order/Create.vue'; 
</script>
