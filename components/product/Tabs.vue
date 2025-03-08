<template>
  <section class="py-10 w-4/5 justify-center mx-auto">
    <div class="container mx-auto">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-6">Product Menu</h2>
      </div>

      <div class="w-full">
        <!-- Tabs Navigation -->
        <div class="flex justify-center border-b pb-4 space-x-4">
          <button 
            v-for="(tab, index) in tabName" 
            :key="index" 
            @click="activeTab = index"
            class="px-4 py-2 text-lg font-medium transition-all duration-300"
            :class="activeTab === index ? 'border-b-2 border-yellow-600 text-yellow-600' : 'text-gray-500 hover:text-yellow-600'"
          >
            {{ tab }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          <ProductCard 
            v-for="product in (products.tabPanel?.[activeTab] || []).slice(0, 3)" 
            :key="product?.id"
            :product="product" 
          />
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
        <ProductCard 
          v-for="product in products.recommendedProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import products from "~/data/products.json";

const activeTab = ref(0);
const tabName = ref<string[]>([]); // Store category names

const fetchCategories = async () => {
  try {
    // Fetch categories from API
    const data = await $fetch<{ pk: number; name: string }[]>("http://127.0.0.1:8000/catalogue/categories/");

    if (Array.isArray(data)) {
      tabName.value = data.map(category => category.name); // Extract category names
    } else {
      console.error("Invalid API response:", data);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

onMounted(fetchCategories);
</script>
