<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden p-4 transition-transform hover:scale-105">
    <div>
      <div class="w-full h-48 flex justify-center items-center bg-gray-100">
        <img v-if="product.mainimage" :src="product.mainimage" alt="product-image" class="w-full h-full object-contain" />
        <img v-else src="/images/preloader.png" alt="loading" class="w-full h-full object-cover" />
      </div>
      <div class="p-4">
        <h5 class="text-lg font-semibold">
          <NuxtLink :to="`/product/${product.id}`" class="text-yellow-600 hover:underline">
            {{ product.name }}
          </NuxtLink>
        </h5>
        <p class="text-gray-600 text-sm mt-2">
          {{ product.description }}
        </p>
        <div class="flex items-center justify-between mt-4">
          <div>
            <h6 class="text-gray-700 font-semibold">
              {{ formatPrice(product.price) }}
            </h6>
          </div>
          <button
            class="bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-600 transition"
            @click="addToCart(product.id)">
            <img src="/icons/cart_fill.svg" alt="cart icon" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { useCartStore } from "@/stores/cart";
import { useToast } from "vue-toastification";

const props = defineProps(['product']);
const toast = useToast();
interface ProductImage {
  id: number;
  image: string;
  product: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  mainimage: string;
  is_active: boolean;
  quantity: number;
  price: string;
  category: number;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
}

const cartStore = useCartStore(); // Sử dụng store giỏ hàng

// Hàm thêm vào giỏ hàng
function addToCart(productId: number) {
  cartStore.addToCart(productId, 1);
}
// Định dạng giá tiền VNĐ
function formatPrice(price: string | number) {
  return parseFloat(price.toString()).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND"
  });
}
</script>
