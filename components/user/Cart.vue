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
            <th class="text-left p-2 pl-4">Ảnh Sản phẩm</th>
            <th class="text-left p-2">Sản phẩm</th>
            <th class="text-center p-2">Số lượng</th>
            <th class="text-left p-2">Giá tiền</th>
            <th class="text-left p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart.items" :key="item.id" class="border-t">

            <td class="p-2">
              <img :src="item.product_mainimage" alt="Ảnh sản phẩm" class="w-32 h-32 object-cover rounded-lg">
            </td>

            <td class="p-2">{{ item.product_name }}</td>

            <td class="p-2 text-center">
              <div class="flex items-center justify-center space-x-2">
                <!-- ✅ Input cho phép nhập số -->
                <input type="number" class="w-12 text-center border rounded" :value="item.quantity" min="1"
                  @change="(event) => updateQuantity(item.id, Number((event.target as HTMLInputElement).value))" />
              </div>
            </td>

            <td class="p-2">{{ formatPrice(item.product_price) }}</td>

            <td class="text-center p-2">
              <button @click="openConfirmDelete(item.id)"
                class="p-2 rounded-md transition flex items-center justify-center hover:bg-gray-200">
                <img src="public\icons\x_symbol.svg" alt="Xóa" class="w-5 h-5">
              </button>
            </td>
          </tr>

          <tr class="border-t font-semibold">
            <td colspan="3" class="text-center p-2">Tổng tiền:</td>
            <td class="p-2">{{ formatPrice(totalPrice) }}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Nếu giỏ hàng trống -->
    <p v-else class="text-gray-500">Giỏ hàng của bạn trống.</p>

    <div class="mt-4 flex justify-between">
  <button v-if="cart && cart.items.length > 0" @click="clearAllItems"
    class="bg-gray-800 text-white px-4 py-2 rounded-md">
    Xóa tất cả
  </button>

  <button v-if="cart && cart.items.length > 0"
    class="bg-red-800 text-white px-4 py-2 rounded-md">
    Đặt hàng
  </button>
</div>


  </div>


  <div v-if="showConfirmDelete" class="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-80">
      <h2 class="text-lg font-semibold mb-4">Xác nhận xóa</h2>
      <p class="text-gray-600">Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</p>
      <div class="flex justify-end mt-4 space-x-2">
        <button @click="showConfirmDelete = false" class="px-4 py-2 bg-gray-300 rounded-md">Hủy</button>
        <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-md">Xóa</button>
      </div>
    </div>
  </div>


</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useCartStore } from "@/stores/cart";
import { useToast } from "vue-toastification"; // Import the toast function


const cartStore = useCartStore();
const isLoading = ref(true);
const toast = useToast(); // Initialize the toast function
const showConfirmDelete = ref(false);
const itemToDelete = ref<number | null>(null);

const totalPrice = computed(() => {
  return cart.items.reduce((total, item) => total + item.quantity * item.product_price, 0);
});
// ✅ Đảm bảo Vue theo dõi `cart`
const { cart, fetchCart, removeItem, clearCart, loading } = cartStore;


// Mở hộp thoại xác nhận xóa
const openConfirmDelete = (itemId: number) => {
  itemToDelete.value = itemId;
  showConfirmDelete.value = true;
};

// Xác nhận xóa sản phẩm
const confirmDelete = () => {
  if (itemToDelete.value !== null) {
    removeItem(itemToDelete.value);
  }
  showConfirmDelete.value = false;
  itemToDelete.value = null;
};

onMounted(async () => {
  await cartStore.fetchCart();
  console.log("Cart in Vue:", cartStore.cart); // Không cần `.value`
  isLoading.value = false;
});

let updateTimeout: NodeJS.Timeout | null = null;

const updateQuantity = (itemId: number, newQuantity: number) => {
  if (newQuantity < 1) return; // Không cho phép số lượng nhỏ hơn 1

  if (updateTimeout) clearTimeout(updateTimeout); // Xóa timeout trước đó nếu có

  updateTimeout = setTimeout(async () => {
    try {
      const response = await useApiFetch<{ id: number; product: number; product_name: string; product_mainimage: string; quantity: number }>(
        `/cart/update/${itemId}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (response) {
        console.log("Cập nhật số lượng thành công:", response);

        // ✅ Cập nhật giỏ hàng
        const existingItem = cart.items.find((item) => item.id === response.id);
        if (existingItem) {
          existingItem.quantity = response.quantity;
        }

        await cartStore.fetchCart();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      toast.error("Không thể cập nhật số lượng. Vui lòng thử lại!");
    }
  }, 200); // ⏳ Delay 200ms trước khi gọi API
};

const clearAllItems = async () => {
  await clearCart(); 
  await fetchCart(); 
};

// Định dạng giá tiền VNĐ
function formatPrice(price: string | number) {
  return parseFloat(price.toString()).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND"
  });
}

</script>
