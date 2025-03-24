<template>
  <AdminLayout pageTitle="Danh sách đơn hàng">
    <template #breadcrumb>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Quản lý sản phẩm</BreadcrumbItem>
        <BreadcrumbItem href="/admin/orders">Sản phẩm</BreadcrumbItem>
      </Breadcrumb>
    </template>

    <div class="flex flex-col h-4/5 w-full space-y-2 mt-1">

      <div class="mt-6">

        <PaginatedTable 
        :headers="headers" 
        :items="orders" 
        :totalItems="totalOrders" 
        :limit="limit" 
        :entity="entity"
        @pageChange="updatePage" 
        />
      </div>
    </div>
  </AdminLayout>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AdminLayout } from "#components";
import Breadcrumb from "~/components/admin/molecules/Breadcrumb.vue";
import BreadcrumbItem from "~/components/admin/atoms/Breadcrumb/BreadcrumbItem.vue";
import PaginatedTable from "~/components/admin/organisms/content/PaginatedTable.vue";
import { useToast } from "vue-toastification";

interface Order {
  id: number;
  user: number;
  phone_number: string;
  address: string;
  total_price: string;
  status: string,
  payment_method: string,
  payment_status: string,
  created_at: string;
}

interface ApiResponse {
  count: number;
  results: Order[];
}

const orders = ref<Order[]>([]);
const totalOrders = ref(0);
const route = useRoute();
const router = useRouter();
const limit = ref(10);
const entity = "admin/orders";
const toast = useToast();
const headers = [
  { text: "ID", value: "id" },
  { text: "Mã khách hàng", value: "user" },
  { text: "Tổng tiền", value: "total_price" },
  { text: "Trạng thái", value: "status" },
  { text: "Phương thức thanh toán", value: "payment_method" },
  { text: "Trạng thái thanh toán", value: "payment_status" },
  { text: "Hành động", value: "actions_order" },
  
];

const statusMapping: Record<string, string> = {
  cxl: "Chưa Xử Lý",
  dcbh: "Đang Chuẩn Bị Hàng",
  dgh: "Đang Giao Hàng",
  dghh: "Đã Giao Hàng",
  khh: "Khách Hàng Hủy",
  adh: "Admin Hủy",
};

const paymentMethodMapping: Record<string, string> = {
  cod: "Thanh toán khi giao hàng",
  ppl: "Thanh toán qua PayPal",
};

const paymentStatusMapping: Record<string, string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
};

const fetchOrders = async () => {
  try {
    const config = useRuntimeConfig();
    const token = useCookie("access_token");

    if (!token.value) return;

    const page = Number(route.query.page) || 1;
    const response = await $fetch<ApiResponse>(`${config.public.apiBase}/order/admin/orders/?page=${page}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    orders.value = response.results.map(order => ({
      ...order,
      status: statusMapping[order.status] || order.status,
      payment_method: paymentMethodMapping[order.payment_method] || order.payment_method,
      payment_status: paymentStatusMapping[order.payment_status] || order.payment_status,
    }));
    totalOrders.value = response.count;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

const updatePage = (newPage: number) => {
  router.push({ query: { ...route.query, page: newPage } });
};

watch(() => route.query.page, fetchOrders);

onMounted(fetchOrders);
</script>
