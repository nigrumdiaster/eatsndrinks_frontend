<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <UserListOrders />
  </div>
</template>

<script lang="ts" setup>
import Header from '~/components/users/Header.vue';
import UserListOrders from '~/components/users/order/ListOrders.vue'; 
</script>

<style>

</style>