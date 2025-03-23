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
                            <img :src="slide" class="w-full h-full object-cover rounded-lg cursor-pointer"
                                :alt="'slider-' + (index + 1)" @click="zoomImage(slide)">
                        </div>
                    </div>

                    <!-- Previous Button -->
                    <button @click="prevSlide"
                        class=" absolute left-3 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-black bg-opacity-50 text-white p-2 rounded-full">
                        ❮
                    </button>

                    <!-- Next Button -->
                    <button @click="nextSlide"
                        class=" absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-black bg-opacity-50 text-white p-2 rounded-full">
                        ❯
                    </button>
                </div>

                <!-- Dòng hình ảnh nhỏ -->
                <div class="flex justify-center mt-4 space-x-2">
                    <div v-for="(slide, index) in slides" :key="index"
                        class="w-14 h-14 cursor-pointer border-2 rounded-md overflow-hidden"
                        :class="{ 'border-blue-500': activeIndex === index }" @click="setSlide(index)">
                        <img :src="slide" class="w-full h-full object-cover" :alt="'thumbnail-' + (index + 1)">
                    </div>
                </div>
            </div>

            <!-- Modal hiển thị ảnh zoom to -->
            <div v-if="zoomedImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                @click="closeZoom">
                <img :src="zoomedImage" class="max-w-full max-h-full rounded-lg" alt="Zoomed Image">
            </div>

            <!-- Cột bên phải: Nội dung sản phẩm -->
            <div class="ml-10 w-1/2 flex flex-col min-h-[300px] justify-between">
                <div v-if="product">
                    <h1 class="text-2xl font-bold">{{ product.name }}</h1>
                    <h2 class="text-xl">{{ product.category_name }}</h2>
                    <p class="mt-6 text-lg text-gray-600">
                        {{ product.description }}
                    </p>
                </div>
                <div v-else>
                    Loading...
                </div>

                <!-- Container cho phần chọn số lượng và các nút -->
                <div class="flex mt-6 items-center">
                    <!-- Phần "Chọn số lượng" bên trái -->
                    <div class="flex items-center mr-4">
                        <label class="mr-2 font-medium">Chọn số lượng:</label>
                        <input type="number" v-model="quantity" min="1" :max="product?.quantity" class="w-16 p-2 border rounded-md" />
                    </div>
                    <!-- Container cho 2 button bên phải -->
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
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import SameType from '~/components/users/product/SameType.vue';

interface ProductImage {
    image: string;
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
    category_name: string;
    created_at: string;
    updated_at: string;
    images: ProductImage[];
}

const props = defineProps(['product']);
const slides = ref<string[]>([]);
const activeIndex = ref<number>(0);
const product = ref<Product | null>(null);
const quantity = ref<number>(1); // Track the quantity of the product
const zoomedImage = ref<string | null>(null);
const cartStore = useCartStore();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const productId = route.params.id;

// Hàm thêm vào giỏ hàng
function addToCart(product: Product, quantity: number) {
    if (product.quantity >= quantity) {
        cartStore.addToCart(product.id, quantity);
    } else {
        toast.error("Số lượng sản phẩm không đủ");
    }
}

const fetchProductData = async () => {
    try {
        const data = await useApiFetch<Product>(`/catalogue/products/${productId}/`)
        product.value = data;

        // Xây dựng mảng slides
        slides.value = []
        if (data.mainimage) {
            slides.value.push(data.mainimage)
        }
        if (data.images && Array.isArray(data.images)) {
            data.images.forEach((imgObj: ProductImage) => {
                if (imgObj.image) {
                    slides.value.push(imgObj.image)
                }
            })
        }
    } catch (error) {
        console.error("🚨 Lỗi khi lấy dữ liệu sản phẩm:", error);
        router.push('/404e')
    }
}


onMounted(fetchProductData);

// Các hàm xử lý ảnh zoom
const zoomImage = (slide: string) => {
    zoomedImage.value = slide;  // Store a single image URL
}

const closeZoom = () => {
    zoomedImage.value = null;
}

// Các hàm chuyển slide
const prevSlide = () => {
    if (slides.value.length === 0) return;
    activeIndex.value = (activeIndex.value - 1 + slides.value.length) % slides.value.length;
}

const nextSlide = () => {
    if (slides.value.length === 0) return;
    activeIndex.value = (activeIndex.value + 1) % slides.value.length;
}

const setSlide = (index: number) => {
    activeIndex.value = index
}

</script>
