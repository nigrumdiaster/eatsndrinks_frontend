<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Chi tiết đơn hàng #{{ order?.id }}</h1>

    <div v-if="order" class="bg-white shadow-md p-6 rounded-lg space-y-2">
      <p><strong>Số điện thoại:</strong> {{ order.phone_number }}</p>
      <p><strong>Địa chỉ:</strong> {{ order.address }}</p>
      <p><strong>Tổng tiền:</strong> {{ formatPrice(order.total_price) }}</p>
      <p><strong>Trạng thái: </strong>
        <span class="px-2 py-1 rounded-full text-white" :class="getStatusClass(order.status)">
          {{ getStatusText(order.status) }}
        </span>
      </p>
      <p><strong>Phương thức thanh toán: </strong>
        <span class="px-2 py-1 rounded-full text-white" :class="getPaymentMethodClass(order.payment_method)">
          {{ getPaymentMethodText(order.payment_method) }}
        </span>
      </p>
      <p><strong>Trạng thái thanh toán: </strong>
        <span class="px-2 py-1 rounded-full text-white" :class="getPaymentStatusClass(order.payment_status)">
          {{ getPaymentStatusText(order.payment_status) }}
        </span>
      </p>
      <p><strong>Thời gian đặt hàng:</strong> {{ formatDate(order.created_at) }}</p>
    </div>

    <h2 class="text-xl font-semibold mt-6">Sản phẩm trong đơn hàng</h2>
    <div class="mt-4 space-y-4">
      <div v-for="item in order?.items" :key="item.product" class="flex border p-4 rounded-lg shadow-md items-center">
        <img :src="item.product_image" alt="Product Image" class="w-24 h-24 object-cover rounded-md">
        <div class="ml-4">
          <router-link :to="`/product/${item.product}`" class="text-lg font-semibold text-yellow-600 hover:underline">
            {{ item.product_name }}
          </router-link>

          <p><strong>Đơn giá:</strong> {{ formatPrice(item.unit_price) }}</p>
          <p><strong>Số lượng:</strong> {{ item.quantity }}</p>
        </div>
        <div class="ml-auto text-right">
          <p><strong>Thành tiền:</strong> {{ formatPrice(item.total_price) }}</p>
        </div>
      </div>
    </div>

    <div class="mt-6 p-4 bg-gray-100 rounded-lg text-lg font-semibold text-right">
      Tổng cộng: {{ formatPrice(totalPrice) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useApiFetch } from "@/composables/useApi";

interface OrderItem {
  product: number;
  product_name: string;
  product_image: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

interface Order {
  id: number;
  user: number;
  phone_number: string;
  address: string;
  total_price: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  items: OrderItem[];
}

const route = useRoute();
const order = ref<Order | null>(null);
const STATUS_CHOICES: Record<string, string> = {
  "cxl": "Chưa Xử Lý",
  "dcbh": "Đang Chuẩn Bị Hàng",
  "dgh": "Đang Giao Hàng",
  "dghh": "Đã Giao Hàng",
  "khh": "Khách Hàng Hủy",
  "adh": "Admin Hủy",
  "dtt": "Đã Thanh Toán",
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
    "dtt": "bg-green-600",
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

const totalPrice = computed(() => {
  return order.value?.items.reduce((sum, item) => sum + item.total_price, 0) || 0;
});

const fetchOrderDetail = async () => {
  try {
    const orderId = route.params.id;
    const data = await useApiFetch<Order>(`/order/${orderId}/`);
    if (data) order.value = data;
  } catch (error) {
    console.error("Error fetching order detail:", error);
  }
};

onMounted(fetchOrderDetail);
</script>