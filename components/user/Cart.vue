<template>
  <div class="max-w-4xl mx-auto py-10 px-6 bg-white shadow-lg rounded-lg my-10">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Giỏ Hàng</h1>

    <!-- Hiển thị loader khi đang tải -->
    <p v-if="isLoading" class="text-gray-500">Đang tải giỏ hàng...</p>

    <!-- Kiểm tra dữ liệu giỏ hàng -->
    <div v-else-if="cart && cart.items && cart.items.length > 0">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="text-left p-2">Sản phẩm</th>
            <th class="text-center p-2">Số lượng</th>
            <th class="text-center p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart.items" :key="item.id" class="border-t">
            <td class="p-2">{{ item.product_name }}</td>
            <td class="text-center p-2">{{ item.quantity }}</td>
            <td class="text-center p-2">
              <button @click="handleRemoveItem(item.id)" class="bg-red-500 text-white px-3 py-1 rounded-md">
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Nếu giỏ hàng trống -->
    <p v-else class="text-gray-500">Giỏ hàng của bạn trống.</p>

    <button v-if="cart && cart.items.length > 0" @click="clearCart"
      class="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md">
      Xóa tất cả
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useCartStore } from "@/stores/cart";
import { useToast } from "vue-toastification"; // Import the toast function

const cartStore = useCartStore();
const isLoading = ref(true);
const toast = useToast(); // Initialize the toast function

// ✅ Đảm bảo Vue theo dõi `cart`
const { cart, fetchCart, removeItem, clearCart, loading } = cartStore;

onMounted(async () => {
  await cartStore.fetchCart();
  console.log("Cart in Vue:", cart.value); // Kiểm tra dữ liệu có cập nhật không
  isLoading.value = false;
});

// Handle removing an item from the cart
const handleRemoveItem = (itemId) => {
  removeItem(itemId); // Call removeItem from the store
  toast.success("Sản phẩm đã được xóa khỏi giỏ hàng!"); // Show success toast
};
</script>


