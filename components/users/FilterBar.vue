<template>
  <div class="w-full max-w-screen-lg mx-auto py-4">
    <!-- Bộ lọc + Tabs cùng 1 hàng bên trái -->
    <div class="flex flex-wrap items-center gap-4 p-4 border-b">
      <span class="px-4 py-2 font-semibold text-gray-700">🛒 Bộ lọc</span>
      <button v-for="(filter, index) in filters" :key="index" class="filter-button">
        {{ filter.label }} ▼
      </button>

      <!-- Tabs nằm bên cạnh bộ lọc -->
      <div class="flex space-x-4 ml-4">
        <button 
          v-for="(tabList, index) in products?.tabList || []" 
          :key="index" 
          @click="activeTab = index"
          class="px-4 py-2 text-lg font-medium transition-all duration-300"
          :class="activeTab === index ? 'border-b-2 border-yellow-600 text-yellow-600' : 'text-gray-500 hover:text-yellow-600'">
          {{ tabList }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import products from '~/data/products.json'
import { ref } from 'vue'

const activeTab = ref(0);
</script>
