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
              <!-- 🗑 Xóa ngay sản phẩm mà không cần xác nhận -->
              <button @click="removeItem(item.id)"
                class="p-2 rounded-md transition flex items-center justify-center hover:bg-gray-200">
                <img src="/icons/x_symbol.svg" alt="Xóa" class="w-5 h-5">
              </button>
            </td>
          </tr>

          <tr class="border-t font-semibold">
            <td colspan="3" class="text-center p-2">Tổng tiền:</td>
            <td class="p-2">{{ formatPrice(totalPrice) }}</td>
            <td></td>
          </tr>
          <tr v-if="applicableCombos.length > 0" class="border-t">
            <td colspan="3" class="text-center p-2">Tổng giảm giá từ combo:</td>
            <td class="p-2 text-green-600">{{ formatPrice(totalDiscount) }}</td>
            <td></td>
          </tr>

          <!-- Combo Section -->
          <tr class="border-t font-semibold">
            <td colspan="3" class="text-center p-2">Combo Giảm Giá</td>
            <td class="p-2">{{ formatPrice(totalPrice - totalDiscount) }} </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <!-- Combo Section -->
      <div v-if="applicableCombos.length > 0" class="mt-6 border-t pt-4">
        <h2 class="text-xl font-semibold mb-4">Combo Giảm Giá</h2>
        <div class="space-y-4">
          <div v-for="combo in applicableCombos" :key="combo.id" class="bg-gray-50 p-4 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-lg">{{ combo.name }}</h3>
                <p class="text-gray-600 text-sm">{{ combo.description }}</p>
                <div class="mt-2">
                  <p class="text-sm">Sản phẩm trong combo:</p>
                  <ul class="list-disc list-inside text-sm text-gray-600">
                    <li v-for="item in combo.items" :key="item.id">
                      {{ item.product_name }} ({{ item.quantity }}x)
                    </li>
                  </ul>
                </div>
              </div>
              <div class="text-right">
                <p class="text-gray-500 line-through">{{ formatPrice(combo.total_original_price) }}</p>
                <p class="text-green-600 font-semibold">{{ formatPrice(combo.total_discounted_price) }}</p>
                <p class="text-sm text-green-600">Tiết kiệm: {{ formatPrice(combo.discount_amount) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Nếu giỏ hàng trống -->
    <p v-else class="text-gray-500">Giỏ hàng của bạn trống.</p>

    <div class="mt-4 flex justify-between">
      <!-- 🗑 Xác nhận khi xóa tất cả sản phẩm -->
      <button v-if="cart && cart.items.length > 0" @click="showConfirmDelete = true"
        class="bg-red-600 hover:bg-gray-800 text-white px-4 py-2 rounded-md">
        Xóa tất cả
      </button>
        <NuxtLink to="/order" v-if="cart && cart.items.length > 0"
          class="bg-yellow-500 hover:bg-gray-800 text-white px-4 py-2 rounded-md">
          Đặt hàng
        </NuxtLink>

    </div>

  </div>

  <!-- Hộp thoại xác nhận xóa tất cả -->
  <div v-if="showConfirmDelete" class="fixed inset-0 flex items-center justify-center">
    <!-- Hộp thoại thực tế -->
    <div class="bg-white p-6 rounded-lg shadow-lg w-80 relative">
      <h2 class="text-lg font-semibold mb-4">Xác nhận xóa tất cả</h2>
      <p class="text-gray-600">Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?</p>
      <div class="flex justify-end mt-4 space-x-2">
        <button @click="showConfirmDelete = false" class="px-4 py-2 bg-gray-300 rounded-md">Hủy</button>
        <button @click="confirmDeleteAll" class="px-4 py-2 bg-red-600 text-white rounded-md">Xóa</button>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useCartStore } from "@/stores/cart";
import { useToast } from "vue-toastification";

interface ComboItem {
  id: number;
  product: number;
  product_name: string;
  product_price: string;
  quantity: number;
}

interface Combo {
  id: number;
  name: string;
  description: string;
  discount_amount: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  items: ComboItem[];
  total_original_price: number;
  total_discounted_price: number;
}

const cartStore = useCartStore();
const isLoading = ref(true);
const toast = useToast();
const showConfirmDelete = ref(false);
const applicableCombos = ref<Combo[]>([]);

const totalPrice = computed(() => {
  return cart.items.reduce((total, item) => total + item.quantity * item.product_price, 0);
});

const totalDiscount = computed(() => {
  return applicableCombos.value.reduce((total, combo) => {
    return total + parseFloat(combo.discount_amount);
  }, 0);
});

const { cart, fetchCart, removeItem, clearCart } = cartStore;

// 🛑 Xác nhận xóa tất cả sản phẩm
const confirmDeleteAll = async () => {
  await clearCart();
  await fetchCart();
  showConfirmDelete.value = false;
};

onMounted(async () => {
  await cartStore.fetchCart();
  await fetchApplicableCombos();
  isLoading.value = false;
});

const fetchApplicableCombos = async () => {
  try {
    const response = await useApiFetch<Combo[]>('/cart/applicable-combos/');
    if (response) {
      applicableCombos.value = response;
    }
  } catch (error) {
    console.error('Lỗi khi tải combos:', error);
    toast.error('Không thể tải danh sách combo giảm giá');
  }
};

let updateTimeout: NodeJS.Timeout | null = null;

// ✅ Cập nhật số lượng sản phẩm
const updateQuantity = (itemId: number, newQuantity: number) => {
  if (newQuantity < 1) return;

  if (updateTimeout) clearTimeout(updateTimeout);

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
        const existingItem = cart.items.find((item) => item.id === response.id);
        if (existingItem) {
          existingItem.quantity = response.quantity;
        }

        await cartStore.fetchCart();
        toast.success("Cập nhật số lượng thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      toast.error("Không thể cập nhật số lượng. Vui lòng thử lại!");
    }
  }, 200);
};

// 🔄 Định dạng giá tiền VNĐ
function formatPrice(price: string | number) {
  return parseFloat(price.toString()).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND"
  });
}

</script>
