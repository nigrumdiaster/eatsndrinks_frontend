<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <About />
    <Footer />
  </div>
</template>
<script lang="ts" setup>
import Header from '~/components/users/Header.vue';
import Footer from '~/components/users/Footer.vue';
import About from '~/components/users/About.vue';


</script>