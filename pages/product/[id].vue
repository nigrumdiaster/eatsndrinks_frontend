<script setup lang="ts">
import SameType from '~/components/product/SameType.vue';

</script>

<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <ProductDetail />
    <SameType />
    <Footer />
  </div>
</template>

