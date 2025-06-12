<template>
  <div class="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 bg-white shadow-lg rounded-lg my-6 sm:my-10">
    <h1 class="text-2xl sm:text-3xl font-bold text-grey-800 mb-6">Đặt hàng</h1>

    <p v-if="isLoading" class="text-red-500">Đang tải ...</p>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Giỏ hàng -->
      <div class="w-full lg:w-1/2">
        <div class="overflow-x-auto">
          <table class="w-full border-4 rounded-lg overflow-hidden bg-white">
            <thead>
              <tr class="bg-yellow-200 border-b-4 border-yellow-400">
                <th class="text-left p-2">Ảnh</th>
                <th class="text-left p-2">Sản phẩm</th>
                <th class="text-center p-2">SL</th>
                <th class="text-right p-2">Giá</th>
                <th class="text-right p-2">Tổng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart.items" :key="item.id" class="border-t border-yellow-400">
                <td class="p-2">
                  <img :src="item.product_mainimage" alt="Ảnh sản phẩm" class="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg" />
                </td>
                <td class="p-2 text-sm sm:text-base">{{ item.product_name }}</td>
                <td class="p-2 text-center">{{ item.quantity }}</td>
                <td class="p-2 text-right text-sm sm:text-base">{{ formatPrice(item.product_price) }}</td>
                <td class="p-2 text-right text-sm sm:text-base">{{ formatPrice(item.quantity * item.product_price) }}</td>
              </tr>
              <tr class="border-t-4 border-yellow-400 font-semibold bg-yellow-100">
                <td colspan="4" class="text-right p-2">Tổng tiền:</td>
                <td class="p-2 text-right">{{ formatPrice(totalPrice) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Thông tin khách hàng -->
      <div class="w-full lg:w-1/2 bg-gray-100 p-4 sm:p-6 rounded-lg shadow">
        <h2 class="text-xl sm:text-2xl font-semibold mb-4">Thông tin khách hàng</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-gray-700 font-medium mb-1">Tên khách hàng</label>
            <input v-model="customerName" type="text" class="w-full p-2 border rounded-lg" />
          </div>

          <!-- Địa chỉ từ sổ địa chỉ -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-gray-700 font-medium">Chọn địa chỉ giao hàng</label>
              <button 
                type="button"
                @click="openAddressBook"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                + Thêm địa chỉ mới
              </button>
            </div>

            <!-- Thanh tìm kiếm -->
            <div class="mb-3">
              <input
                v-model="addressSearch"
                type="text"
                placeholder="Tìm kiếm địa chỉ..."
                class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div v-if="savedAddresses.length > 0" class="max-h-60 overflow-y-auto space-y-2">
              <div 
                v-for="addr in filteredAddresses" 
                :key="addr.id"
                @click="selectAddress(addr)"
                class="p-3 border rounded-lg cursor-pointer transition-colors"
                :class="selectedAddressId === addr.id ? 'bg-yellow-50 border-yellow-500' : 'hover:bg-gray-50'"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <p class="font-medium">{{ addr.phone_number }}</p>
                    <p class="text-gray-600 text-sm">{{ addr.address }}</p>
                  </div>
                  <span v-if="addr.is_default" class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Mặc định
                  </span>
                </div>
              </div>

              <!-- Phân trang -->
              <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 pt-3 border-t">
                <button 
                  @click="currentPage--" 
                  :disabled="currentPage === 1"
                  class="px-3 py-1 rounded border"
                  :class="currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-50'"
                >
                  &lt;
                </button>
                <span class="text-sm text-gray-600">
                  Trang {{ currentPage }}/{{ totalPages }}
                </span>
                <button 
                  @click="currentPage++" 
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 rounded border"
                  :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-50'"
                >
                  &gt;
                </button>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              Chưa có địa chỉ nào được lưu
            </div>
          </div>

          <!-- Hoặc nhập địa chỉ mới -->
          <div v-if="!selectedAddressId">
            <div class="border-t my-4 pt-4">
              <p class="text-sm text-gray-500 mb-4">Hoặc nhập địa chỉ mới:</p>
              <div class="space-y-4">
                <div>
                  <label class="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                  <input v-model="phoneNumber" type="tel" class="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-1">Địa chỉ</label>
                  <input v-model="address" type="text" class="w-full p-2 border rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-1">Phương thức thanh toán</label>
            <select v-model="paymentMethod" class="w-full p-2 border rounded-lg">
              <option value="cod">Thanh toán khi nhận hàng</option>
              <option value="ppl">Paypal</option>
            </select>
          </div>

          <!-- Nút COD -->
          <button
            v-if="paymentMethod === 'cod'"
            @click="handlePlaceOrder"
            class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Xác nhận đặt hàng
          </button>

          <!-- Nút PayPal -->
          <div v-if="paymentMethod === 'ppl'" class="mt-4">
            <div id="paypal-button-container"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal chọn địa chỉ -->
    <div v-if="showAddressModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeAddressModal"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl relative">
        <div class="flex justify-between items-center mb-4">
          <button 
            @click="closeAddressModal" 
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <AddressBook 
          @address-selected="onAddressSelected"
          @address-added="refreshAddresses"
          @address-updated="refreshAddresses"
          @address-deleted="refreshAddresses"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "vue-router";
import { useApiFetch } from "@/composables/useApi";
import { useToast } from "vue-toastification";
import AddressBook from '~/components/users/user/AddressBook.vue';

interface User {
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
}

interface Address {
  id: number;
  user: number;
  phone_number: string;
  address: string;
  is_default: boolean;
}

declare global {
  interface Window {
    paypal: any;
  }
}

const cartStore = useCartStore();
const { cart, fetchCart } = cartStore;

const isLoading = ref(true);
const customerName = ref("");
const phoneNumber = ref("");
const address = ref("");
const paymentMethod = ref("cod");
const showAddressModal = ref(false);
const savedAddresses = ref<Address[]>([]);
const selectedAddressId = ref<number | null>(null);

const user = ref<User | null>(null);
const router = useRouter();
const toast = useToast();
const config = useRuntimeConfig();

const totalPrice = computed(() =>
  cart.items.reduce((total, item) => total + item.quantity * item.product_price, 0)
);

// Thêm các biến cho tìm kiếm và phân trang
const addressSearch = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;

// Lọc địa chỉ theo từ khóa tìm kiếm
const filteredAddresses = computed(() => {
  const search = addressSearch.value.toLowerCase().trim();
  let filtered = savedAddresses.value;
  
  if (search) {
    filtered = savedAddresses.value.filter(addr => 
      addr.address.toLowerCase().includes(search) || 
      addr.phone_number.includes(search)
    );
  }

  // Sắp xếp để địa chỉ mặc định lên đầu
  filtered = [...filtered].sort((a, b) => {
    if (a.is_default === b.is_default) return 0;
    return a.is_default ? -1 : 1;
  });

  // Phân trang
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filtered.slice(start, end);
});

// Tính tổng số trang
const totalPages = computed(() => {
  const search = addressSearch.value.toLowerCase().trim();
  let filtered = savedAddresses.value;
  
  if (search) {
    filtered = savedAddresses.value.filter(addr => 
      addr.address.toLowerCase().includes(search) || 
      addr.phone_number.includes(search)
    );
  }

  return Math.ceil(filtered.length / itemsPerPage);
});

// Reset trang về 1 khi tìm kiếm
watch(addressSearch, () => {
  currentPage.value = 1;
});

function formatPrice(price: string | number) {
  return parseFloat(price.toString()).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

const fetchAddresses = async () => {
  try {
    const token = useCookie("access_token");
    const response = await fetch(`${config.public.apiBase}/users/address-book/`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    const data = await response.json();
    savedAddresses.value = data;

    // Tự động chọn địa chỉ mặc định nếu có
    const defaultAddress = data.find((addr: Address) => addr.is_default);
    if (defaultAddress) {
      selectAddress(defaultAddress);
    }
  } catch (error) {
    console.error('Error fetching addresses:', error);
    toast.error('Không thể tải danh sách địa chỉ');
  }
};

const selectAddress = (addr: Address) => {
  selectedAddressId.value = addr.id;
  phoneNumber.value = addr.phone_number;
  address.value = addr.address;
};

const openAddressBook = () => {
  showAddressModal.value = true;
};

const closeAddressModal = () => {
  showAddressModal.value = false;
};

const onAddressSelected = (addr: Address) => {
  selectAddress(addr);
  closeAddressModal();
};

const fetchUser = async () => {
  try {
    const data = await useApiFetch<User>("/users/user/profile/");
    user.value = data;

    if (data) {
      customerName.value = `${data.first_name} ${data.last_name}`;
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    router.push("/404");
  }
};

// Nút thanh toán Paypal
const loadPayPalScript = async () => {
  if (document.getElementById("paypal-sdk")) return;

  const script = document.createElement("script");
  script.id = "paypal-sdk";
  script.src =
    "https://www.paypal.com/sdk/js?client-id=AdoLODJw_mau1WFs7PGB9wwGUYsGBvIDEbcLQTvon_r_3LWwk5kHxRPGEhcdzVxKKDQDmuwCpy8UVag8&currency=USD";
  script.onload = renderPayPalButton;
  document.body.appendChild(script);
};

const renderPayPalButton = () => {
  if (!window.paypal) return;

  window.paypal
    .Buttons({
      createOrder: function (data: any, actions: any) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: (totalPrice.value / 24000).toFixed(2), // Chuyển VND sang USD (giả sử 1 USD = 24,000 VND)
              },
            },
          ],
        });
      },
      onApprove: function (data: any, actions: any) {
        return actions.order.capture().then(function (details: any) {
          console.log("✅ Thanh toán thành công:", details);
          toast.success(`Cảm ơn ${details.payer.name.given_name}, thanh toán thành công!`);
          placeOrder(true); // Đặt hàng, đánh dấu là đã thanh toán
        });
      },
      onError: function (err: any) {
        console.error("❌ Lỗi thanh toán:", err);
        toast.error("Lỗi khi thanh toán với PayPal.");
      },
    })
    .render("#paypal-button-container");
};

// Tự động tải PayPal SDK khi chọn phương thức
watch(paymentMethod, (newMethod) => {
  if (newMethod === "ppl") {
    loadPayPalScript();
  }
});

// Nút bấm xác nhận
const handlePlaceOrder = () => {
  placeOrder(); // Với COD
};

// Đặt hàng
const placeOrder = async (isPaid = false) => {
  if (!phoneNumber.value || !address.value) {
    toast.error("⚠️ Vui lòng nhập đầy đủ số điện thoại và địa chỉ trước khi đặt hàng.");
    return;
  }

  try {
    const orderData: Record<string, any> = {
      phone_number: phoneNumber.value,
      address: address.value,
      payment_method: paymentMethod.value,
    };

    if (isPaid) {
      orderData.payment_status = "paid";
    }

    const response = await useApiFetch("/order/create", {
      method: "POST",
      body: JSON.stringify(orderData),
      headers: { "Content-Type": "application/json" },
    });

    toast.success("🎉 Đơn hàng đã được tạo thành công!");
    setTimeout(() => router.push("/user/orders"), 1000);
  } catch (error: any) {
    console.error("❌ Lỗi khi đặt hàng:", error);
    let errorMessage = "Đã xảy ra lỗi, vui lòng thử lại!";

    if (error.response) {
      try {
        const errorData = await error.response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error("❌ Lỗi khi đọc phản hồi API:", parseError);
      }
    }

    toast.error(`⚠️ ${errorMessage}`);
  }
};

const refreshAddresses = async () => {
  try {
    const token = useCookie("access_token");
    const response = await fetch(`${config.public.apiBase}/users/address-book/`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    const data = await response.json();
    savedAddresses.value = data;

    // Nếu địa chỉ đang chọn bị xóa, reset form
    if (selectedAddressId.value && !data.find((addr: Address) => addr.id === selectedAddressId.value)) {
      selectedAddressId.value = null;
      phoneNumber.value = "";
      address.value = "";
    }

    // Tự động chọn địa chỉ mặc định nếu chưa có địa chỉ nào được chọn
    if (!selectedAddressId.value) {
      const defaultAddress = data.find((addr: Address) => addr.is_default);
      if (defaultAddress) {
        selectAddress(defaultAddress);
      }
    }
  } catch (error) {
    console.error('Error refreshing addresses:', error);
    toast.error('Không thể cập nhật danh sách địa chỉ');
  }
};

onMounted(async () => {
  isLoading.value = true;
  await Promise.all([fetchCart(), fetchUser(), fetchAddresses()]);
  isLoading.value = false;

  // Thêm event listener cho phím Escape
  document.addEventListener('keydown', handleEscapeKey);
});

// Cleanup event listener khi component bị hủy
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey);
});

// Xử lý phím Escape
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showAddressModal.value) {
    closeAddressModal();
  }
};
</script>
