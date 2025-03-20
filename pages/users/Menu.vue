<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <FilterBar />
    
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import Header from '~/components/users/Header.vue';
import Footer from '~/components/users/Footer.vue';
import FilterBar from '~/components/users/FilterBar.vue';
</script>
