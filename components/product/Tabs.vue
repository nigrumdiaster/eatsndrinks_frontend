<template>
  <section class="py-10 w-4/5 justify-center mx-auto">
    <div class="container mx-auto">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-6">Product Menu</h2>
      </div>

      <div class="w-full">
        <!-- Tabs Navigation -->
        <div class="flex justify-center border-b pb-4 space-x-4">
          <button v-for="(tab, index) in tabName" :key="index" @click="changeTab(index, categories[index].pk)"
            class="px-4 py-2 text-lg font-medium transition-all duration-300"
            :class="activeTab === index ? 'border-b-2 border-yellow-600 text-yellow-600' : 'text-gray-500 hover:text-yellow-600'">
            {{ tab }}
          </button>
        </div>

        <div v-if="product.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            <ProductCard v-for="product in product.slice(0, 3)" :key="product.pk" :product="product" />
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
        <ProductCard v-for="product in product" :key="product.pk" :product="product" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

interface ProductImage {
  id: number;
  image: string;
  product: number;
}

interface Product {
  pk: number;
  name: string;
  description: string;
  mainimage: string;
  is_active: boolean;
  quantity: number;
  price: string;
  category: number;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
}

interface Category {
  pk: number;
  name: string;
}

const activeTab = ref(0);
const tabName = ref<string[]>([]);
const product = ref<Product[]>([]);
const categories = ref<Category[]>([]);

const fetchCategories = async () => {
  try {
    const data = await $fetch<Category[]>("http://127.0.0.1:8000/catalogue/categories/");
    if (Array.isArray(data)) {
      categories.value = data;
      tabName.value = data.map(category => category.name);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const fetchProductsByCategory = async (categoryId: number) => {
  try {
    const data = await $fetch<Product[]>(`http://127.0.0.1:8000/catalogue/categories/${categoryId}/products/`);
    console.log(`Products for category ${categoryId}:`, data);
    product.value = data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    product.value = [];
  }
};

const changeTab = (index: number, categoryId: number) => {
  activeTab.value = index;
  fetchProductsByCategory(categoryId);
};

onMounted(async () => {
  await fetchCategories();
  if (categories.value.length > 0) {
    activeTab.value = 0;
    fetchProductsByCategory(categories.value[0].pk);
  };
});
</script>
