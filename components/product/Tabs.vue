<template>
  <section class="py-10 w-4/5 justify-center mx-auto">
    <div class="container mx-auto">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-6">Product Menu</h2>
      </div>

      <div class="w-full">
        <!-- Tabs Navigation -->
        <div class="flex justify-center border-b pb-4 space-x-4">
          <button v-for="(tabList, index) in products?.tabList || []" :key="index" @click="activeTab = index"
            class="px-4 py-2 text-lg font-medium transition-all duration-300"
            :class="activeTab === index ? 'border-b-2 border-yellow-600 text-yellow-600' : 'text-gray-500 hover:text-yellow-600'">
            {{ tabList }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          <ProductCard v-for="product in (products.tabPanel?.[activeTab] || []).slice(0, 3)" :key="product?.id"
            :product="product" />
        </div>
      </div>



      <div class="flex justify-center mt-8">
        <NuxtLink to="/Menu" class="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition">
          View Menu
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- Recommended Products -->
  <section class="py-10 w-4/5 justify-center mx-auto">
    <div class="container mx-auto">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-6">Our Recommendations</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard v-for="product in products.recommendedProducts" :key="product.id" :product="product" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { Tabs, Tab } from 'vue3-tabs-component'
import products from '~/data/products.json'
const activeTab = ref(0);
</script>
