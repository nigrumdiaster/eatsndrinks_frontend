<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center">Danh sách đơn hàng</h1>

    <div class="flex flex-col md:flex-row justify-between mb-4 gap-4">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Tìm theo số điện thoại..." 
        class="p-2 border rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-500"
      />
      <select 
        v-model="selectedStatus" 
        class="p-2 border rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Tất cả trạng thái</option>
        <option v-for="(text, key) in STATUS_CHOICES" :key="key" :value="key">
          {{ text }}
        </option>
      </select>
    </div>

    <div class="bg-gray-200 p-3 rounded-lg font-semibold grid grid-cols-7 text-center">
      <span>Mã</span>
      <span>Số điện thoại</span>
      <span>Tổng tiền</span>
      <span>Trạng thái</span>
      <span>Thanh toán</span>
      <span>Trạng thái TT</span>
      <span>Thời gian</span>
    </div>
    
    <div class="flex flex-col space-y-4 mt-4">
      <RouterLink 
        v-for="order in filteredOrders" 
        :key="order.id" 
        :to="`/user/orders/${order.id}`" 
        class="grid grid-cols-7 border rounded-lg p-4 shadow-md bg-white items-center cursor-pointer hover:bg-gray-100 transition"
      >
        <span class="text-center">{{ order.id }}</span>
        <span class="text-center">{{ order.phone_number }}</span>
        <span class="text-center">{{ formatPrice(order.total_price) }}</span>
        <span class="text-center">
          <span class="px-2 py-1 rounded-full text-white" :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </span>
        </span>
        <span class="text-center">
          <span class="px-2 py-1 rounded-full text-white" :class="getPaymentMethodClass(order.payment_method)">
            {{ getPaymentMethodText(order.payment_method) }}
          </span>
        </span>
        <span class="text-center">
          <span class="px-2 py-1 rounded-full text-white" :class="getPaymentStatusClass(order.payment_status)">
            {{ getPaymentStatusText(order.payment_status) }}
          </span>
        </span>
        <span class="text-center">{{ formatDate(order.created_at) }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useApiFetch } from "@/composables/useApi";
import { RouterLink } from 'vue-router';

interface Order {
  id: number;
  phone_number: string;
  total_price: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
}

const orders = ref<Order[]>([]);
const searchQuery = ref("");
const selectedStatus = ref("");

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

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    return (
      (searchQuery.value === "" || order.phone_number.includes(searchQuery.value)) &&
      (selectedStatus.value === "" || order.status === selectedStatus.value)
    );
  });
});

const fetchOrdersOfUser = async () => {
  try {
    const data = await useApiFetch<Order[]>('/order/');
    if (data) orders.value = data;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

onMounted(fetchOrdersOfUser);
</script>