<template>
    <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <ClientOnly >
      <Restaurant />
    </ClientOnly>
    
    </div>
</template>

<script lang="ts" setup>
import Header from '~/components/users/Header.vue';
import Restaurant from '~/components/users/map/Restaurant.vue';

</script>
