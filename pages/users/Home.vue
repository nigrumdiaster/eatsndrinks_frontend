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
import Header from '~/components/users/Header.vue';
import Slider from '~/components/users/Slider.vue';
import Feature from '~/components/users/Feature.vue';
import ProductTabs from '~/components/users/product/Tabs.vue';  // ✅ Import đúng từ users/product
import About from '~/components/users/About.vue';
import Contact from '~/components/users/Contact.vue';
import Footer from '~/components/users/Footer.vue';
</script>
