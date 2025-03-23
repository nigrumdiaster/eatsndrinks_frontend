<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <UserOrderDetail />
  </div>
</template>

<script lang="ts" setup>
import Header from '~/components/users/Header.vue';
import UserOrderDetail from '~/components/users/order/OrderDetail.vue';

definePageMeta({
  middleware: 'auth',
});

</script>
