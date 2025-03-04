<template>
    <section class="h-[500px] hidden md:flex justify-center items-center mt-10">
        <div class="relative w-full max-w-6xl overflow-hidden rounded-lg">
            <!-- Carousel Wrapper -->
            <div class="relative flex transition-transform duration-500 ease-in-out"
                :style="{ transform: `translateX(-${activeIndex * 100}%)` }">
                <div v-for="(slide, index) in slides" :key="index" class="w-full flex-shrink-0">
                    <img :src="slide" class="w-full h-[500px] object-cover" :alt="'slider-' + (index + 1)">
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

            <!-- Indicators -->
            <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button v-for="(slide, index) in slides" :key="index" @click="setSlide(index)"
                    :class="['h-3 w-3 rounded-full', index === activeIndex ? 'bg-white' : 'bg-gray-400']">
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
    '/images/slider1.jfif',
    '/images/slider2.jfif',
    '/images/slider3.jfif'
]
const activeIndex = ref(0)
let interval = null

const prevSlide = () => {
    activeIndex.value = (activeIndex.value - 1 + slides.length) % slides.length
}

const nextSlide = () => {
    activeIndex.value = (activeIndex.value + 1) % slides.length
}

const setSlide = (index) => {
    activeIndex.value = index
}

// Auto-slide every 5 seconds
const startAutoSlide = () => {
    interval = setInterval(() => {
        nextSlide()
    }, 5000)
}

// Cleanup interval when component is unmounted
onMounted(startAutoSlide)
onUnmounted(() => clearInterval(interval))
</script>
