<template>
  <AdminLayout pageTitle="Danh sách sản phẩm">
    <template #breadcrumb>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Quản lý sản phẩm</BreadcrumbItem>
        <BreadcrumbItem href="/product_management">Sản phẩm</BreadcrumbItem>
      </Breadcrumb>
    </template>

    <div class="flex flex-col h-4/5 w-full space-y-2 mt-1">
      <div class="ml-auto">
        <NuxtLink to="/product_management/create">
          <RectButton><span>Thêm sản phẩm</span></RectButton>
        </NuxtLink>
      </div>

      <!-- Bảng danh sách sản phẩm -->
      <div class="flex">
        <EasyDataTable class="w-full h-full" :headers="headers" :items="products" hide-footer>
          <template #item-mainimage="{ mainimage }">
            <div v-if="mainimage">
              <img
                :src="mainimage"
                alt="Product Image"
                class="w-20 h-20 object-cover"
                @error="handleImageError"
              />
            </div>
            <div v-else>
              <span class="text-gray-400 text-xs">Không có ảnh</span>
            </div>
          </template>

          <template #item-actions="{ id }">
            <div class="flex space-x-2">
              <NuxtLink :to="`/${entity}/${id}`">
                <button class="h-5 w-5">
                  <img src="/images/edit_icon_table.png" alt="Edit" />
                </button>
              </NuxtLink>
              <button @click="deleteProduct(id)" class="h-6 w-6">
                <img src="/images/delete_icon_table.png" alt="Delete" />
              </button>
            </div>
          </template>
        </EasyDataTable>
      </div>

      <!-- Phân trang -->
      <div class="pagination-container flex justify-between">
        <div class="flex flex-col">
          <div class="flex items-center gap-6 p-4 rounded-lg font-sans text-gray-700 text-base">
            <span class="font-bold text-teal-800">Số lượng mỗi trang: {{ limit }}</span>
            <span class="italic text-gray-500">
              Đang hiển thị: {{ (currentPage - 1) * limit + 1 }} - {{ Math.min(currentPage * limit, totalProducts) }} / {{ totalProducts }} tổng số
            </span>
          </div>
        </div>
        <vue-awesome-paginate
          v-model="currentPage"
          :total-items="totalProducts"
          :items-per-page="limit"
          :max-pages-shown="5"
          @update:modelValue="fetchProducts(currentPage)"
        />
      </div>
    </div>
  </AdminLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AdminLayout } from "#components";
import Breadcrumb from "~/components/admin/molecules/Breadcrumb.vue";
import BreadcrumbItem from "~/components/admin/atoms/Breadcrumb/BreadcrumbItem.vue";
import RectButton from "~/components/admin/atoms/Button/RectButton.vue";

interface Product {
  id: number;
  name: string;
  description: string;
  mainimage: string;
  is_active: boolean | string;
  quantity: number;
  price: string;
  category: number;
  created_at: string;
}

interface ApiResponse {
  count: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

const products = ref<Product[]>([]);
const totalProducts = ref(0);
const route = useRoute();
const router = useRouter();
const limit = ref(10);
const currentPage = ref(1);
const entity = "product_management";

const headers = [
  { text: "ID", value: "id" },
  { text: "Tên sản phẩm", value: "name" },
  { text: "Mô tả", value: "description" },
  { text: "Hình ảnh", value: "mainimage", sortable: false },
  { text: "Số lượng", value: "quantity" },
  { text: "Giá", value: "price" },
  { text: "Trạng thái", value: "is_active" },
  { text: "Actions", value: "actions", sortable: false },
];

const fetchProducts = async (page = 1) => {
  try {
    const config = useRuntimeConfig();
    const token = useCookie("access_token");

    if (!token.value) return;

    const response = await $fetch<ApiResponse>(`${config.public.apiBase}/catalogue/products/?page=${page}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    console.log("Raw API Response:", response); // Debugging

    if (!response.results || response.results.length === 0) {
      console.warn("No products found.");
      products.value = [];
      return;
    }

    products.value = response.results.map(product => ({
      ...product,
      id: product.id ?? null,  // Ensure `id` exists
      is_active: product.is_active ? "✅ Active" : "❌ Inactive",
    }));

    console.log("Processed Products:", products.value);

    totalProducts.value = response.count;
    currentPage.value = page;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const deleteProduct = async (id: number) => {
  if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;

  try {
    const config = useRuntimeConfig();
    const token = useCookie("access_token");

    if (!token.value) return;

    await $fetch(`${config.public.apiBase}/catalogue/products/${id}/`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token.value}` },
      body: { is_active: false },
    });

    fetchProducts(currentPage.value);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

// Xử lý lỗi ảnh (nếu ảnh không tải được)
const handleImageError = (event: any) => {
  event.target.src = "/images/default_product.png"; // Ảnh mặc định
};

onMounted(() => {
  if (import.meta.client) {
    const storedPage = localStorage.getItem(`${entity}_currentPage`);
    currentPage.value = storedPage ? Number(storedPage) : 1;
  }
  fetchProducts(currentPage.value);
});

watch(currentPage, (newPage) => {
  if (import.meta.client) {
    localStorage.setItem(`${entity}_currentPage`, newPage.toString());
  }
  router.replace({ query: { page: newPage } });
});
</script>
