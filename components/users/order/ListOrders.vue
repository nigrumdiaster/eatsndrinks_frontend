<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Danh sách đơn hàng</h1>
    
    <div class="bg-gray-200 p-3 rounded-lg font-semibold flex justify-between">
      <span class="w-1/5 text-center">Mã đơn hàng</span>
      <span class="w-1/5 text-center">Số điện thoại</span>
      <span class="w-1/5 text-center">Tổng tiền</span>
      <span class="w-1/5 text-center">Trạng thái</span>
      <span class="w-1/5 text-center">Thanh toán</span>
      <span class="w-1/5 text-center">Trạng thái TT</span>
      <span class="w-1/5 text-center">Thời gian</span>
    </div>
    
    <div class="flex flex-col space-y-4 mt-4">
      <RouterLink 
        v-for="order in orders" 
        :key="order.id" 
        :to="`/user/orders/${order.id}`" 
        class="flex border rounded-lg p-4 shadow-md bg-white items-center cursor-pointer hover:bg-gray-100 transition"
      >
        <span class="w-1/5 text-center">{{ order.id }}</span>
        <span class="w-1/5 text-center">{{ order.phone_number }}</span>
        <span class="w-1/5 text-center">{{ formatPrice(order.total_price) }}</span>
        <span class="w-1/5 text-center">
          <span class="px-2 py-1 rounded-full text-white" :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </span>
        </span>
        <span class="w-1/5 text-center">
          <span class="px-2 py-1 rounded-full text-white" :class="getPaymentMethodClass(order.payment_method)">
            {{ getPaymentMethodText(order.payment_method) }}
          </span>
        </span>
        <span class="w-1/5 text-center">
          <span class="px-2 py-1 rounded-full text-white" :class="getPaymentStatusClass(order.payment_status)">
            {{ getPaymentStatusText(order.payment_status) }}
          </span>
        </span>
        <span class="w-1/5 text-center">{{ formatDate(order.created_at) }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useApiFetch } from "@/composables/useApi";
import { RouterLink } from 'vue-router';

interface OrderItem {
  product: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

interface Order {
  id: number;
  phone_number: string;
  total_price: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  items: OrderItem[];
}

const orders = ref<Order[]>([]);
const loading = ref<boolean>(false);

const STATUS_CHOICES: Record<string, string> = {
  "cxl": "Chưa Xử Lý",
  "dcbh": "Đang Chuẩn Bị Hàng",
  "dgh": "Đang Giao Hàng",
  "dghh": "Đã Giao Hàng",
  "khh": "Khách Hàng Hủy",
  "adh": "Admin Hủy",
};

const PAYMENT_METHOD_CHOICES: Record<string, string> = {
  "cod": "Thanh toán khi giao hàng",
  "ppl": "Thanh toán qua PayPal",
};

const PAYMENT_STATUS_CHOICES: Record<string, string> = {
  "pending": "Chờ thanh toán",
  "paid": "Đã thanh toán",
};

const getStatusText = (status: string): string => STATUS_CHOICES[status] || "Không xác định";
const getPaymentMethodText = (method: string): string => PAYMENT_METHOD_CHOICES[method] || "Không xác định";
const getPaymentStatusText = (status: string): string => PAYMENT_STATUS_CHOICES[status] || "Không xác định";

const getStatusClass = (status: string) => {
  return {
    "cxl": "bg-gray-500",
    "dcbh": "bg-blue-500",
    "dgh": "bg-yellow-500",
    "dghh": "bg-green-500",
    "khh": "bg-red-500",
    "adh": "bg-red-700",
  }[status] || "bg-gray-400";
};

const getPaymentMethodClass = (method: string) => {
  return {
    "cod": "bg-purple-500",
    "ppl": "bg-indigo-500",
  }[method] || "bg-gray-400";
};

const getPaymentStatusClass = (status: string) => {
  return {
    "pending": "bg-orange-500",
    "paid": "bg-green-600",
  }[status] || "bg-gray-400";
};

const formatPrice = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
const formatDate = (datetime: string): string => new Date(datetime).toLocaleDateString("vi-VN");

const fetchOrdersOfUser = async () => {
  try {
    loading.value = true;
    const data = await useApiFetch<Order[]>('/order/');
    if (data) orders.value = data;
  } catch (error) {
    console.error("Error fetching orders:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrdersOfUser);
</script>