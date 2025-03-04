<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden p-4 transition-transform hover:scale-105">
    <div>
      <div class="w-full h-48 flex justify-center items-center bg-gray-100">
        <img src="/images/preloader.png" :src="product.primary_image" alt="product-image"
          class="w-full h-full object-cover">
      </div>
      <div class="p-4">
        <h5 class="text-lg font-semibold">
          <NuxtLink :to="`/products/${product.slug}`" class="text-yellow-600 hover:underline">
            {{ product.name }}
          </NuxtLink>
        </h5>
        <p class="text-gray-600 text-sm mt-2">
          {{ product.description }}
        </p>
        <div class="flex items-center justify-between mt-4">
          <div>
            <h6 v-if="product.is_sale" class="text-red-500 font-semibold">
              <del class="text-gray-400">{{ formatPrice(product.price) }}</del>
              {{ formatPrice(product.sale_price) }}
            </h6>
            <h6 v-else class="text-gray-700 font-semibold">
              {{ formatPrice(product.price) }}
            </h6>
          </div>
          <button
            class="bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-600 transition"
            @click="addToCart(product)">
            <img src="/icons/cart_fill.svg" alt="cart icon" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps(['product']);

function addToCart(product) {
  console.log(product);
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}
</script>
