<template>
  <section class="py-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Alert Section -->
      <!-- <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded-lg relative">
        <p>This website also has an admin panel.</p>
        <hr class="my-2" />
        <p>You can view admin panel images <a href="#" class="text-blue-600 font-semibold">here</a>.</p>
        <p>
          Also, the admin panel source code is available on 
          <a href="#" class="text-blue-600 font-semibold">GitHub repository</a>.
        </p>
        <button @click="closeAlert" class="absolute top-2 right-2 text-gray-700 hover:text-gray-900">
          &times;
        </button>
      </div> -->

      <!-- Card Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <!-- Đặt hàng dễ dàng -->
        <div class="bg-white shadow-md rounded-lg p-6 text-center">
          <div class="flex justify-center items-center w-16 h-16 bg-yellow-500 text-white rounded-full mx-auto mb-4">
            <img src="/icons/phone.svg" alt="biểu tượng điện thoại" class="w-10 h-10" />
          </div>
          <h3 class="text-lg font-semibold">Đặt hàng dễ dàng</h3>
          <p class="text-gray-600">Ngay cả khi không truy cập được website, bạn vẫn có thể đặt hàng qua một cuộc gọi đơn
            giản.</p>
        </div>

        <!-- Chuẩn bị nhanh chóng -->
        <div class="bg-white shadow-md rounded-lg p-6 text-center">
          <div class="flex justify-center items-center w-16 h-16 bg-yellow-500 text-white rounded-full mx-auto mb-4">
            <img src="/icons/time.svg" alt="biểu tượng đồng hồ" class="w-10 h-10" />
          </div>
          <h3 class="text-lg font-semibold">Chuẩn bị nhanh chóng</h3>
          <p class="text-gray-600">Tất cả đơn hàng được chuẩn bị trong vòng chưa đến 30 phút.</p>
        </div>

        <!-- Giao hàng miễn phí -->
        <div class="bg-white shadow-md rounded-lg p-6 text-center">
          <div class="flex justify-center items-center w-16 h-16 bg-yellow-500 text-white rounded-full mx-auto mb-4">
            <img src="/icons/marker.svg" alt="biểu tượng vị trí" class="w-10 h-10" />
          </div>
          <h3 class="text-lg font-semibold">Giao hàng tận nơi</h3>
          <p class="text-gray-600">Giao hàng hoàn toàn miễn phí! :)</p>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const showAlert = ref(true);
const closeAlert = () => {
  showAlert.value = false;
};
</script>
