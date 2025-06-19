<template>
    <section class="hidden md:flex justify-center items-start mt-10">
      <div class="flex max-w-6xl w-full">
        <!-- Cột trái: Hình ảnh sản phẩm -->
        <div class="flex flex-col items-center">
          <div class="relative w-[400px] h-[400px] overflow-hidden rounded-lg">
            <div class="relative flex transition-transform duration-500 ease-in-out"
                 :style="{ transform: `translateX(-${activeIndex * 100}%)` }">
              <div v-for="(slide, index) in slides" :key="index" class="w-[400px] h-[400px] flex-shrink-0">
                <img :src="slide" class="w-full h-full object-cover rounded-lg cursor-pointer"
                     :alt="'slider-' + (index + 1)" @click="zoomImage(slide)" />
              </div>
            </div>
            <button @click="prevSlide"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-black bg-opacity-50 text-white p-2 rounded-full">
              ❮
            </button>
            <button @click="nextSlide"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-black bg-opacity-50 text-white p-2 rounded-full">
              ❯
            </button>
          </div>
  
          <!-- Ảnh nhỏ -->
          <div class="flex justify-center mt-4 space-x-2">
            <div v-for="(slide, index) in slides" :key="index"
                 class="w-14 h-14 cursor-pointer border-2 rounded-md overflow-hidden"
                 :class="{ 'border-blue-500': activeIndex === index }" @click="setSlide(index)">
              <img :src="slide" class="w-full h-full object-cover" :alt="'thumbnail-' + (index + 1)" />
            </div>
          </div>
        </div>
  
        <!-- Modal ảnh zoom -->
        <div v-if="zoomedImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
             @click="closeZoom">
          <img :src="zoomedImage" class="max-w-full max-h-full rounded-lg" alt="Zoomed Image" />
        </div>
  
        <!-- Cột phải: Thông tin sản phẩm -->
        <div class="ml-10 w-1/2 flex flex-col min-h-[300px] justify-between">
          <div v-if="product">
            <h1 class="text-2xl font-bold flex items-center gap-2">
              {{ product.name }}
              <span v-if="product.is_flash_sale_active"
                    class="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold uppercase">
                Flash Sale
              </span>
            </h1>
            <h2 class="text-xl text-gray-600">{{ product.category_name }}</h2>
  
            <div class="mt-4">
              <div v-if="product.is_flash_sale_active && product.current_price" class="flex items-center gap-3">
                <span class="text-2xl font-bold text-red-600">{{ formatPrice(product.current_price) }}</span>
                <span class="text-lg line-through text-gray-400">{{ formatPrice(product.price) }}</span>
              </div>
              <div v-else>
                <span class="text-2xl font-bold text-gray-800">{{ formatPrice(product.price) }}</span>
              </div>
  
              <p v-if="countdown" class="text-sm text-red-500 mt-2">⏰ Kết thúc sau: {{ countdown }}</p>
            </div>
  
            <p class="mt-6 text-lg text-gray-600">
              {{ product.description }}
            </p>

            <!-- Related Combos Section -->
            <div v-if="relatedCombos.length > 0" class="mt-8">
              <h3 class="text-xl font-semibold mb-4">Combo Liên Quan</h3>
              <div class="space-y-4">
                <div v-for="combo in relatedCombos" :key="combo.id" class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-semibold text-lg">{{ combo.name }}</h4>
                      <p class="text-gray-600 text-sm">{{ combo.description }}</p>
                      <div class="mt-2">
                        <p class="text-sm">Sản phẩm trong combo:</p>
                        <ul class="list-disc list-inside text-sm text-gray-600">
                          <li v-for="item in combo.items" :key="item.id" class="flex items-center gap-2 mb-1">
                            <img v-if="item.mainimage" :src="getImageUrl(item.mainimage)" alt="Ảnh sản phẩm" class="w-12 h-12 object-cover rounded" />
                            <NuxtLink :to="`/product/${item.product}`" class="hover:text-blue-600 transition-colors">
                              {{ item.product_name }} ({{ item.quantity }}x)
                            </NuxtLink>
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
          <div v-else>Loading...</div>
  
          <!-- Số lượng & nút hành động -->
          <div class="flex mt-6 items-center">
            <div class="flex items-center mr-4">
              <label class="mr-2 font-medium">Chọn số lượng:</label>
              <input type="number" v-model="quantity" min="1" :max="product?.quantity"
                     class="w-16 p-2 border rounded-md" />
            </div>
            <div class="flex space-x-4 flex-1">
              <button @click="product && addToCart(product, quantity)"
                      class="h-[50px] flex-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                Thêm vào giỏ hàng
              </button>
              <button class="h-[50px] flex-1 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <SameType v-if="product && product.category !== undefined" :categoryId="product.category" />
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useToast } from 'vue-toastification'
  import { useCartStore } from '@/stores/cart'
  import SameType from '~/components/users/product/SameType.vue'
  import dayjs from 'dayjs'
  import duration from 'dayjs/plugin/duration'
  import { useRuntimeConfig } from '#app'
  dayjs.extend(duration)
  
  interface ProductImage {
    image: string
  }
  
  interface Product {
    id: number
    name: string
    description: string
    mainimage: string
    is_active: boolean
    quantity: number
    price: string
    category: number
    category_name: string
    created_at: string
    updated_at: string
    images: ProductImage[]
    is_flash_sale_active?: boolean
    current_price?: string
    flash_sale_end?: string
  }
  
  interface ComboItem {
    id: number;
    product: number;
    product_name: string;
    product_price: string;
    quantity: number;
    mainimage?: string;
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
  
  const slides = ref<string[]>([])
  const activeIndex = ref<number>(0)
  const product = ref<Product | null>(null)
  const quantity = ref<number>(1)
  const zoomedImage = ref<string | null>(null)
  const cartStore = useCartStore()
  const toast = useToast()
  const route = useRoute()
  const router = useRouter()
  const productId = route.params.id
  const countdown = ref<string | null>(null)
  const relatedCombos = ref<Combo[]>([])
  let countdownInterval: any = null
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  
  function formatPrice(price: string | number) {
    return parseFloat(price.toString()).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND"
    })
  }
  
  function updateCountdown() {
    if (product.value?.is_flash_sale_active && product.value.flash_sale_end) {
      const end = dayjs(product.value.flash_sale_end)
      const now = dayjs()
      const diff = end.diff(now)
  
      if (diff > 0) {
        const d = dayjs.duration(diff)
        countdown.value = `${String(d.hours()).padStart(2, '0')}:${String(d.minutes()).padStart(2, '0')}:${String(d.seconds()).padStart(2, '0')}`
      } else {
        countdown.value = '00:00:00'
        clearInterval(countdownInterval)
      }
    }
  }
  
  function addToCart(product: Product, quantity: number) {
      cartStore.addToCart(product.id, quantity)

  }
  
  const fetchProductData = async () => {
    try {
      const data = await useApiFetch<Product>(`/catalogue/products/${productId}/`)
      product.value = data
  
      slides.value = []
      if (data.mainimage) slides.value.push(data.mainimage)
      if (data.images?.length) {
        data.images.forEach((imgObj: ProductImage) => {
          if (imgObj.image) slides.value.push(imgObj.image)
        })
      }
  
      if (product.value?.is_flash_sale_active && product.value.flash_sale_end) {
        updateCountdown()
        countdownInterval = setInterval(updateCountdown, 1000)
      }
    } catch (error) {
      console.error("🚨 Lỗi khi lấy dữ liệu sản phẩm:", error)
      router.push('/404e')
    }
  }
  
  const fetchRelatedCombos = async () => {
    try {
      const response = await useApiFetch<Combo[]>(`/catalogue/products/${productId}/related-combos/`);
      if (response) {
        relatedCombos.value = response;
      }
    } catch (error) {
      console.error('Lỗi khi tải combos liên quan:', error);
    }
  };
  
  onMounted(async () => {
    await Promise.all([fetchProductData(), fetchRelatedCombos()]);
  })
  
  onBeforeUnmount(() => {
    clearInterval(countdownInterval)
  })
  
  const zoomImage = (slide: string) => {
    zoomedImage.value = slide
  }
  
  const closeZoom = () => {
    zoomedImage.value = null
  }
  
  const prevSlide = () => {
    if (slides.value.length === 0) return
    activeIndex.value = (activeIndex.value - 1 + slides.value.length) % slides.value.length
  }
  
  const nextSlide = () => {
    if (slides.value.length === 0) return
    activeIndex.value = (activeIndex.value + 1) % slides.value.length
  }
  
  const setSlide = (index: number) => {
    activeIndex.value = index
  }
  
  // Hàm lấy url ảnh đầy đủ
  function getImageUrl(img: string) {
    if (!img) return ''
    if (img.startsWith('http://') || img.startsWith('https://')) return img
    return apiBase + img
  }
  </script>
  