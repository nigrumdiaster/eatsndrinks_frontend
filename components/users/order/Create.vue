<template>
  <div class="max-w-4xl mx-auto py-10 px-6 bg-white shadow-lg rounded-lg my-10">
    <h1 class="text-3xl font-bold text-grey-800 mb-6">Đặt hàng</h1>

    <p v-if="isLoading" class="text-red-500">Đang tải ...</p>

    <div class="flex">
      <!-- Giỏ hàng -->
      <div class="w-1/2 mr-auto">
        <table class="w-full border-4 rounded-lg overflow-hidden bg-white">
          <thead>
            <tr class="bg-yellow-200 border-b-4 border-yellow-400">
              <th class="text-left p-2 pl-4">Ảnh Sản phẩm</th>
              <th class="text-left p-2">Sản phẩm</th>
              <th class="text-center p-2">Số lượng</th>
              <th class="text-left p-2">Giá tiền</th>
              <th class="text-left p-2">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart.items" :key="item.id" class="border-t border-yellow-400">
              <td class="p-2">
                <img :src="item.product_mainimage" alt="Ảnh sản phẩm" class="w-32 h-32 object-cover rounded-lg" />
              </td>
              <td class="p-2">{{ item.product_name }}</td>
              <td class="p-2 text-center">{{ item.quantity }}</td>
              <td class="p-2">{{ formatPrice(item.product_price) }}</td>
              <td class="p-2">{{ formatPrice(item.quantity * item.product_price) }}</td>
            </tr>
            <tr class="border-t-4 border-yellow-400 font-semibold bg-yellow-100">
              <td colspan="4" class="text-center p-2">Tổng tiền:</td>
              <td class="p-2">{{ formatPrice(totalPrice) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Thông tin khách hàng -->
      <div class="w-1/2 ml-6 bg-gray-100 p-6 rounded-lg shadow">
        <h2 class="text-2xl font-semibold mb-4">Thông tin khách hàng</h2>
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
            <option value="cod">Thanh toán khi nhận hàng</option>
            <option value="ppl">Paypal</option>
          </select>
        </div>

        <!-- Nút COD -->
        <button
          v-if="paymentMethod === 'cod'"
          @click="handlePlaceOrder"
          class="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-red-600"
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
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "vue-router";
import { useApiFetch } from "@/composables/useApi";
import { useToast } from "vue-toastification";

interface User {
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
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

const user = ref<User | null>(null);
const router = useRouter();
const toast = useToast();

const totalPrice = computed(() =>
  cart.items.reduce((total, item) => total + item.quantity * item.product_price, 0)
);

function formatPrice(price: string | number) {
  return parseFloat(price.toString()).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

const fetchUser = async () => {
  try {
    const data = await useApiFetch<User>("/users/user/profile/");
    user.value = data;

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


onMounted(async () => {
  isLoading.value = true;
  await fetchCart();
  await fetchUser();
  isLoading.value = false;
});
</script>
