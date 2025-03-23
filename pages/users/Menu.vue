<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <Menu />
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import Header from '~/components/users/Header.vue';
import Footer from '~/components/users/Footer.vue';
import Menu from '~/components/users/Menu.vue';
</script>
