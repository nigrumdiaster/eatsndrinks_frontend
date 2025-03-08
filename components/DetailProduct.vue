<template>
  <section class="hidden md:flex justify-center items-start mt-10">
      <div class="flex max-w-6xl w-full">
          <!-- Cột bên trái: Ảnh sản phẩm -->
          <div class="flex flex-col items-center">
              <div class="relative w-[400px] h-[400px] overflow-hidden rounded-lg">
                  <!-- Ảnh lớn -->
                  <div class="relative flex transition-transform duration-500 ease-in-out"
                      :style="{ transform: `translateX(-${activeIndex * 100}%)` }">
                      <div v-for="(slide, index) in slides" :key="index" class="w-[400px] h-[400px] flex-shrink-0">
                          <img :src="slide" class="w-full h-full object-cover rounded-lg" :alt="'slider-' + (index + 1)">
                      </div>
                  </div>

                  <!-- Previous Button -->
                  <button @click="prevSlide"
                      class="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full">
                      ❮
                  </button>

                  <!-- Next Button -->
                  <button @click="nextSlide"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full">
                      ❯
                  </button>
              </div>

              <!-- Dòng hình ảnh nhỏ -->
              <div class="flex justify-center mt-4 space-x-2">
                  <div v-for="(slide, index) in slides" :key="index" 
                      class="w-14 h-14 cursor-pointer border-2 rounded-md overflow-hidden"
                      :class="{ 'border-blue-500': activeIndex === index }"
                      @click="setSlide(index)">
                      <img :src="slide" class="w-full h-full object-cover" :alt="'thumbnail-' + (index + 1)">
                  </div>
              </div>
          </div>

          <!-- Cột bên phải: Nội dung sản phẩm -->
          <div class="ml-10 w-1/2">
              <h1 class="text-2xl font-bold">Tên sản phẩm</h1>
              <p class="mt-2 text-gray-600">Mô tả ngắn về sản phẩm, các tính năng chính, chất liệu...</p>
              <div>
              </div>
              <button class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Thêm vào giỏ hàng</button>
          </div>
      </div>
  </section>
  <!--Lấy 8 sản phẩm recommendations-->
  <section class="py-10 w-4/5 justify-center mx-auto">
    <div class="container mx-auto">
        <div class="text-center">
            <h2 class="text-2xl font-bold mb-6">Our Recommendations</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard 
                v-for="product in products.recommendedProducts.slice(0, 8)" 
                :key="product.id" 
                :product="product" 
            />
        </div>
    </div>
  </section>
  
</template>

<script setup>
import { ref } from 'vue'
import products from '~/data/products.json' 

const props = defineProps(['product']);


const slides = [
  '/images/slider1.jfif',
  '/images/slider2.jfif',
  '/images/slider3.jfif'
]
const activeIndex = ref(0)

const prevSlide = () => {
  activeIndex.value = (activeIndex.value - 1 + slides.length) % slides.length
}

const nextSlide = () => {
  activeIndex.value = (activeIndex.value + 1) % slides.length
}

const setSlide = (index) => {
  activeIndex.value = index
}
</script>
