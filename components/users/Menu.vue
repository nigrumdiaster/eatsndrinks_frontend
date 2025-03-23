<template>
  <div class="w-full flex justify-center p-4 mb-4">
    <input 
      v-model="searchQuery"
      @keyup.enter="applyFilters"
      type="text"
      class="w-1/2 px-4 py-2 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
      placeholder="Tìm kiếm sản phẩm..."
    />
  </div>

  <div class="w-full max-w-screen-lg mx-auto py-4 flex">
    <!-- Danh mục -->
    <div class="w-1/4 p-4 bg-transparent min-h-screen">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">📂 Danh mục</h2>
      <button 
        v-for="category in categories" 
        :key="category.id" 
        @click="changeCategory(category.id)"
        class="block w-full text-left px-4 py-2 my-1 font-medium transition-all duration-300 rounded-md"
        :class="selectedCategory === category.id || (category.id === 0 && selectedCategory === null) ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-yellow-400'"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- Danh sách sản phẩm -->
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

      <!-- Phân trang -->
      <div class="flex justify-center items-center mt-6 space-x-2">
        <button 
          @click="changePage(currentPage - 1)" 
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
          :class="currentPage === page ? 'bg-yellow-500 text-white' : 'border border-gray-500 text-black hover:bg-gray-200'">
          {{ page }}
        </button>

        <button 
          @click="changePage(currentPage + 1)" 
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
import { ref, onMounted, watchEffect } from "vue";
import { useApiFetch } from "@/composables/useApi";
import { useCartStore } from "@/stores/cart";
import { useToast } from "vue-toastification";
import { useRoute, useRouter } from "vue-router";

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

const route = useRoute();
const router = useRouter();

// 🟢 Fetch sản phẩm từ API dựa trên URL
const fetchProductsBySearch = async () => {
  try {
    const category = route.query.category ? Number(route.query.category) : null;
    const page = Number(route.query.page) || 1;
    const search = (route.query.search as string) || "";

    const params = new URLSearchParams();
    if (category !== null) params.append("category", category.toString());
    if (page !== 1) params.append("page", page.toString());
    if (search.trim()) params.append("search", search.trim());
    params.append("page_size", "6");

    const data: ApiResponse = await useApiFetch<ApiResponse>(`/catalogue/products/?${params.toString()}`);

    if (data && data.results) {
      tabProduct.value = data.results;
      totalPages.value = data.total_pages || 1;
    } else {
      tabProduct.value = [];
      totalPages.value = 1;
    }

    // Cập nhật state
    selectedCategory.value = category;
    currentPage.value = page;
    searchQuery.value = search;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
  }
};

// 🟢 Cập nhật URL khi lọc sản phẩm
const applyFilters = () => {
  const query: Record<string, string> = {};
  if (selectedCategory.value !== null) query.category = selectedCategory.value.toString();
  if (searchQuery.value.trim()) query.search = searchQuery.value.trim();
  query.page = "1"; // Reset về trang đầu khi lọc

  router.push({ query });
};

// 🟢 Chuyển danh mục
const changeCategory = (categoryId: number) => {
  selectedCategory.value = categoryId === 0 ? null : categoryId;
  applyFilters();
};

// 🟢 Chuyển trang
const changePage = (page: number) => {
  const query: Record<string, string> = {};

  // Chỉ thêm các query hợp lệ từ route.query
  Object.keys(route.query).forEach((key) => {
    const value = route.query[key];
    if (typeof value === "string") {
      query[key] = value;
    }
  });

  if (page !== 1) {
    query.page = page.toString();
  } else {
    delete query.page; // Xóa nếu là trang đầu
  }

  router.push({ query });
};


// 🟢 Theo dõi URL và fetch dữ liệu khi thay đổi
watchEffect(fetchProductsBySearch);

// 🟢 Lấy danh mục
const fetchCategories = async () => {
  const data = await useApiFetch<Category[]>("/catalogue/categories/");
  categories.value = [{ id: 0, name: "Tất cả sản phẩm" }, ...data];
};

// 🟢 Format giá tiền
const formatPrice = (price: number) => price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

// 🟢 Thêm vào giỏ hàng
const addToCart = (productId: number) => {
  cartStore.addToCart(productId, 1);
  toast.success("Đã thêm sản phẩm vào giỏ hàng");
};

onMounted(fetchCategories);
</script>
