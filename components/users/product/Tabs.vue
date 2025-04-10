<template>
  <section class="py-10 w-4/5 justify-center mx-auto border-t">
    <div class="container mx-auto">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-6">Danh mục món ăn</h2>
      </div>

      <div class="w-full">
        <!-- Tabs Navigation -->
        <div class="flex justify-center pb-4 space-x-4">
          <button v-for="(tab, index) in tabName" :key="index" @click="changeTab(index, categories[index].id)"
            class="px-4 py-2 text-lg font-medium transition-all duration-300"
            :class="activeTab === index ? 'border-b-2 border-yellow-600 text-yellow-600' : 'text-gray-500 hover:text-yellow-600'">
            {{ tab }}
          </button>
        </div>

        <div v-if="tabProduct.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          <ProductCard v-for="product in tabProduct" :key="product.id" :product="product" />
        </div>
      </div>

      <div class="flex justify-center mt-8">
        <NuxtLink to="/" class="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition">
          View Menu
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- Recommended Products -->
  <section class="py-10 w-4/5 justify-center mx-auto">
    <div class="container mx-auto">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-6">Món ngon không thể bỏ lỡ</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard v-for="product in randProduct" :key="product.id" :product="product" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import ProductCard from '~/components/users/product/Card.vue';
interface ProductImage {
  id: number;
  image: string;
  product: number;
}

interface Product {
  id: number;
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
  id: number;
  name: string;
}

const activeTab = ref(0);
const tabName = ref<string[]>([]);
const tabProduct = ref<Product[]>([]);
const randProduct = ref<Product[]>([]);
const categories = ref<Category[]>([]);

const fetchCategories = async () => {
  try {
    const data = await useApiFetch<Category[]>("/catalogue/categories/");
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
    const data = await useApiFetch<Product[]>(`/catalogue/categories/${categoryId}/products/?limit=3`);
    console.log(`Products for category ${categoryId}:`, data);
    tabProduct.value = data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    tabProduct.value = [];
  }
};

const fetchRandomProducts = async () => {
  try {
    // Định nghĩa kiểu dữ liệu khớp với API
    const data = await useApiFetch<{ results: Product[] }>(
      "/catalogue/products/random/"
    );

    if (Array.isArray(data)) {
      randProduct.value = data;
    } else {
      console.error("Unexpected response format:", data);
      randProduct.value = [];
    }

    console.log("Random Products:", randProduct.value);
  } catch (error) {
    console.error("Error fetching products:", error);
    randProduct.value = [];
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
    fetchProductsByCategory(categories.value[0].id);
  };
  await fetchRandomProducts();
});
</script>
