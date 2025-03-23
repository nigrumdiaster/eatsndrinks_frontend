<template>
  <AdminLayout pageTitle="Danh sách sản phẩm">
    <template #breadcrumb>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Quản lý sản phẩm</BreadcrumbItem>
        <BreadcrumbItem href="/admin/products">Sản phẩm</BreadcrumbItem>
      </Breadcrumb>
    </template>

    <div class="flex flex-col h-4/5 w-full space-y-2 mt-1">
      <div class="ml-auto">
        <NuxtLink to="/admin/products/create">
          <RectButton><span>Thêm sản phẩm</span></RectButton>
        </NuxtLink>
      </div>

      <PaginatedTable 
        :headers="headers" 
        :items="products" 
        :totalItems="totalProducts" 
        :limit="limit" 
        :entity="entity"
        @pageChange="updatePage" 
        @delete="deleteProduct" 
        @activate="activateProduct" />
    </div>
  </AdminLayout>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AdminLayout } from "#components";
import Breadcrumb from "~/components/admin/molecules/Breadcrumb.vue";
import BreadcrumbItem from "~/components/admin/atoms/Breadcrumb/BreadcrumbItem.vue";
import RectButton from "~/components/admin/atoms/Button/RectButton.vue";
import PaginatedTable from "~/components/admin/organisms/content/PaginatedTable.vue";
import { useToast } from "vue-toastification";

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
  results: Product[];
}

const products = ref<Product[]>([]);
const totalProducts = ref(0);
const route = useRoute();
const router = useRouter();
const limit = ref(10);
const entity = "admin/products";
const toast = useToast();
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

const fetchProducts = async () => {
  try {
    const config = useRuntimeConfig();
    const token = useCookie("access_token");

    if (!token.value) return;

    const page = Number(route.query.page) || 1;
    const response = await $fetch<ApiResponse>(`${config.public.apiBase}/catalogue/products/?page=${page}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    products.value = response.results.map(product => ({
      ...product,
      mainimage: product.mainimage || '/images/default_product.png',
      is_active: product.is_active ? "✅ Active" : "❌ Inactive",
    }));
    totalProducts.value = response.count;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const updatePage = (newPage: number) => {
  router.push({ query: { ...route.query, page: newPage } });
};

const confirmAction = (message: string, action: Function) => {
  toast.warning(h("div", [
    message,
    h("div", { class: "flex space-x-2 mt-2" }, [
      h("button", {
        onClick: () => {
          action();
          toast.clear();
        },
        class: "px-4 py-1 bg-red-500 text-white rounded"
      }, "Xác nhận"),
      h("button", {
        onClick: () => toast.clear(),
        class: "px-4 py-1 bg-gray-500 text-white rounded"
      }, "Hủy")
    ])
  ]), {
    timeout: 10000,
    closeOnClick: false,
  });
};

const deleteProduct = (id: number) => {
  confirmAction("Bạn có chắc chắn muốn xóa sản phẩm này?", async () => {
    try {
      const config = useRuntimeConfig();
      const token = useCookie("access_token");

      if (!token.value) return;

      await $fetch(`${config.public.apiBase}/catalogue/products/${id}/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token.value}` },
        body: { is_active: false },
      });

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  });
};

const activateProduct = (id: number) => {
  confirmAction("Bạn có chắc chắn muốn kích hoạt sản phẩm này?", async () => {
    try {
      const config = useRuntimeConfig();
      const token = useCookie("access_token");

      if (!token.value) return;

      await $fetch(`${config.public.apiBase}/catalogue/products/${id}/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token.value}` },
        body: { is_active: true },
      });

      fetchProducts();
    } catch (error) {
      console.error("Error activating product:", error);
    }
  });
};

watch(() => route.query.page, fetchProducts);

onMounted(fetchProducts);
</script>
