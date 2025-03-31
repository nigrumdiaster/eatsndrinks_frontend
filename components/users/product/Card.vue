<template>
  <div
    class="bg-transparent shadow-xl rounded-2xl overflow-hidden p-6 transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-200"
  >
    <div>
      <div class="w-full h-56 flex justify-center items-center rounded-t-2xl relative">
        <img
          v-if="product.mainimage"
          :src="product.mainimage"
          alt="product-image"
          class="w-full h-full object-cover rounded-t-2xl"
        />
        <img
          v-else
          src="/images/preloader.png"
          alt="loading"
          class="w-full h-full object-cover rounded-t-2xl opacity-50"
        />
        <span class="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">New</span>
      </div>
      <div class="p-6">
        <h5 class="text-xl font-bold text-gray-900">
          <NuxtLink :to="`/product/${product.id}`" class="text-yellow-600 hover:underline">
            {{ product.name }}
          </NuxtLink>
        </h5>
        <p class="text-gray-500 text-sm mt-3 line-clamp-2">
          {{ product.description }}
        </p>
        <div class="flex items-center justify-between mt-5">
          <div>
            <h6 class="text-lg font-semibold text-gray-800">
              {{ formatPrice(product.price) }}
            </h6>
          </div>
          <button
            class="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            @click="addToCart(product.id)"
          >
            <img src="/icons/cart_fill.svg" alt="cart icon" class="w-6 h-6" />
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

const cartStore = useCartStore();

function addToCart(productId: number) {
  cartStore.addToCart(productId, 1);
}

function formatPrice(price: string | number) {
  return parseFloat(price.toString()).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND"
  });
}
</script>