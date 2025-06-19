<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <Chatbot class="w-full h-full"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/users/Header.vue'
import Footer from '~/components/users/Footer.vue'
import Chatbot from '~/components/users/Chatbot.vue'
</script> 