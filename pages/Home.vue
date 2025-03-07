<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <Slider />
    <Feature />
    <ProductTabs />
    <About />
    <Contact />
    <Footer />
  </div>
</template>


<script setup>
import Footer from './components/Footer.vue';



</script>