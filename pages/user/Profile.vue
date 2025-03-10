<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <UserProfile />
  </div>
</template>


<script setup>
definePageMeta({
  middleware: 'auth',
});
</script>