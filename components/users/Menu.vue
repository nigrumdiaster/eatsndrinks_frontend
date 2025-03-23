<template>
  <div class="w-full flex justify-center p-4 mb-4">
    <input 
      v-model="searchQuery" 
      @keyup.enter="fetchProductsBySearch(selectedCategory ?? 0, 1, 6, searchQuery.trim())" 
      type="text"
      class="w-1/2 px-4 py-2 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
      placeholder=" Tìm kiếm sản phẩm..."
    />
  </div>

  <div class="w-full max-w-screen-lg mx-auto py-4 flex">
    <div class="w-1/4 p-4 bg-transparent min-h-screen">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">📂 Danh mục</h2>
      <button 
        v-for="category in categories" 
        :key="category.id" 
        @click="changeCategory(category.id)"
        class="block w-full text-left px-4 py-2 my-1 font-medium transition-all duration-300 rounded-md"
        :class="selectedCategory === category.id ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-yellow-400'"
      >
        {{ category.name }}
      </button>
    </div>

    <div class="w-3/4 p-6">
      <div class="grid grid-cols-3 gap-6">
        <div v-for="product in tabProduct" :key="product.id" class="bg-white p-4 rounded-lg shadow">
          <div class="w-full h-48 flex justify-center items-center bg-gray-100">
            <img v-if="product.mainimage" :src="product.mainimage" alt="product-image"
              class="w-full h-full object-contain" />
            <img v-else src="/images/preloader.png" alt="loading" class="w-full h-full object-cover" />
          </div>
          <div class="p-4">
            <h5 class="text-lg font-semibold">
              <NuxtLink :to="`/product/${product.id}`" class="text-yellow-600 hover:underline">
                {{ product.name }}
              </NuxtLink>
            </h5>
            <p class="text-gray-600 text-sm mt-2">
              {{ product.description }}
            </p>
            <div class="flex items-center justify-between mt-4">
              <h6 class="text-gray-700 font-semibold">
                {{ formatPrice(product.price) }}
              </h6>
              <button
                class="bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-600 transition"
                @click="addToCart(product.id)">
                <img src="/icons/cart_fill.svg" alt="cart icon" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center items-center mt-6 space-x-2">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="w-10 h-10 flex items-center justify-center rounded-full border"
          :class="currentPage === 1 ? 'text-gray-400 border-gray-300' : 'text-black border-gray-500 hover:bg-gray-200'"
        >
          &lt;
        </button>

        <button 
          v-for="page in totalPages" 
          :key="page" 
          @click="changePage(page)"
          class="w-10 h-10 flex items-center justify-center rounded-full"
          :class="currentPage === page ? 'bg-teal-500 text-white' : 'border border-gray-500 text-black hover:bg-gray-200'"
        >
          {{ page }}
        </button>

        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="w-10 h-10 flex items-center justify-center rounded-full border"
          :class="currentPage === totalPages ? 'text-gray-400 border-gray-300' : 'text-black border-gray-500 hover:bg-gray-200'"
        >
          &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useApiFetch } from "@/composables/useApi";
import { useCartStore } from "@/stores/cart";
import { useToast } from "vue-toastification";

interface ApiResponse {
  results: Product[];
  total_pages: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  mainimage?: string;
}

interface Category {
  id: number;
  name: string;
}

const cartStore = useCartStore();
const selectedCategory = ref<number | null>(null);
const categories = ref<Category[]>([]);
const tabProduct = ref<Product[]>([]);
const toast = useToast();
const searchQuery = ref("");
const totalPages = ref(1);
const currentPage = ref(1);
const tabName = ref<string[]>([]);

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchProductsBySearch(selectedCategory.value || 0, currentPage.value, 6, searchQuery.value);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchProductsBySearch(selectedCategory.value || 0, currentPage.value, 6, searchQuery.value);
  }
};

const changePage = (page: number) => {
  if (page !== currentPage.value) {
    currentPage.value = page;
    fetchProductsBySearch(selectedCategory.value || 0, currentPage.value, 6, searchQuery.value);
  }
};

const changeCategory = (categoryId: number) => {
  selectedCategory.value = categoryId;
  currentPage.value = 1; // Reset về trang đầu
  fetchProductsBySearch(categoryId, 1, 6, searchQuery.value);
};

const fetchProductsBySearch = async (
  category: number,
  page: number,
  pageSize: number,
  search: string
) => {
  try {
    const params = new URLSearchParams({
      category: category.toString(),
      page: page.toString(),
      page_size: pageSize.toString(),
      search: search.trim(),
    });

    console.log("Fetching products with params:", params.toString());

    const data: ApiResponse = await useApiFetch<ApiResponse>(`/catalogue/products/?${params.toString()}`);

    console.log("API response:", data);

    if (data && data.results) {
      tabProduct.value = data.results;
      totalPages.value = data.total_pages || 1;
    } else {
      tabProduct.value = [];
      totalPages.value = 1;
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
  }
};

const fetchCategories = async () => {
  try {
    const data = await useApiFetch<Category[]>("/catalogue/categories/");
    if (Array.isArray(data) && data.length > 0) {
      categories.value = data;
      tabName.value = data.map(category => category.name);
      selectedCategory.value = data[0].id; // Chọn danh mục đầu tiên
      fetchProductsBySearch(selectedCategory.value, 1, 6, ""); // Fetch sản phẩm theo danh mục đầu tiên
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};


const formatPrice = (price: number) => {
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND"
  });
};

function addToCart(productId: number) {
  cartStore.addToCart(productId, 1);
  toast.success("Đã thêm sản phẩm vào giỏ hàng");
}

onMounted(async () => {
  await fetchCategories();
  fetchProductsBySearch(0, 1, 6, ""); // Gọi dữ liệu mặc định
});
</script>
