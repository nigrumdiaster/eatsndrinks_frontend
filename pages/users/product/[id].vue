<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <ProductDetail />
    <Footer />
  </div>
</template>


<script setup>
import Header from '~/components/users/Header.vue';
import ProductDetail from '~/components/users/product/Detail.vue'; // ✅ Import thủ công
import Footer from '~/components/users/Footer.vue';
</script>