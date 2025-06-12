<template>
  <div class="max-w-4xl mx-auto py-10 px-4 sm:px-6 bg-white shadow-lg rounded-lg my-10">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Đặt hàng</h1>

    <p v-if="isLoading" class="text-red-500">Đang tải ...</p>

    <!-- Flex container for cart and form -->
    <div class="flex flex-col md:flex-row gap-6">
      <!-- 🛒 Cart Table (Left Column) -->
      <div class="w-full md:w-1/2">
        <div class="overflow-x-auto">
          <table class="w-full border-4 rounded-lg overflow-hidden bg-white">
            <thead>
              <tr class="bg-yellow-200 border-b-4 border-yellow-400">
                <th class="text-left p-2 pl-4">Ảnh Sản phẩm</th>
                <th class="text-left p-2">Sản phẩm</th>
                <th class="text-center p-2">Số lượng</th>
                <th class="text-left p-2">Giá tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart.items" :key="item.id" class="border-t border-yellow-400">
                <td class="p-2">
                  <img :src="item.product_mainimage" alt="Ảnh sản phẩm" class="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg">
                </td>
                <td class="p-2">{{ item.product_name }}</td>
                <td class="p-2 text-center">{{ item.quantity }}</td>
                <td class="p-2">{{ formatPrice(item.product_price) }}</td>
              </tr>
              <tr class="border-t-4 border-yellow-400 font-semibold bg-yellow-100">
                <td colspan="3" class="text-center p-2">Tổng tiền:</td>
                <td class="p-2">{{ formatPrice(totalPrice) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 📝 Customer Information Form (Right Column) -->
      <div class="w-full md:w-1/2 bg-gray-100 p-4 sm:p-6 rounded-lg shadow">
        <h2 class="text-xl sm:text-2xl font-semibold mb-4">Thông tin khách hàng</h2>

        <div class="mb-4">
          <label class="block text-gray-700 font-medium">Tên khách hàng</label>
          <input v-model="customerName" type="text" class="w-full p-2 border rounded-lg" />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-medium">Số điện thoại</label>
          <input v-model="phoneNumber" type="tel" class="w-full p-2 border rounded-lg" />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-medium">Địa chỉ</label>
          <input v-model="address" type="text" class="w-full p-2 border rounded-lg" />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-medium">Phương thức thanh toán</label>
          <select v-model="paymentMethod" class="w-full p-2 border rounded-lg">
            <option value="cash">Cod</option>
            <option value="paypal">Paypal</option>
          </select>
        </div>

        <button class="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-red-600">
          Xác nhận đặt hàng
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const isLoading = ref(true);

const customerName = ref(""); // Giá trị mặc định
const phoneNumber = ref("");
const address = ref("");
const paymentMethod = ref("cash"); // Mặc định là tiền mặt

interface User {
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
}

const totalPrice = computed(() => {
  return cart.items.reduce((total, item) => total + item.quantity * item.product_price, 0);
});

const { cart, fetchCart } = cartStore;

onMounted(async () => {
  isLoading.value = true;
  await fetchCart();
  await fetchUser();
  isLoading.value = false;
});

// 🔄 Định dạng giá tiền VNĐ
function formatPrice(price: string | number) {
  return parseFloat(price.toString()).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND"
  });
}

// Khai báo biến lưu thông tin người dùng
const user = ref<User | null>(null);
const router = useRouter();

const fetchUser = async () => {
  try {
    const data = await useApiFetch<User>("/users/user/profile/");
    user.value = data;

    // Gán dữ liệu vào các biến riêng lẻ nếu cần
    if (data) {
      customerName.value = `${data.first_name} ${data.last_name}`;
      phoneNumber.value = data.phone_number;
      address.value = data.address;
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    router.push("/404");
  }
};
</script>

<style scoped>
/* Ensure table is scrollable on small screens */
@media (max-width: 640px) {
  .overflow-x-auto {
    overflow-x: auto;
  }
  table {
    min-width: 100%;
  }
}
</style>