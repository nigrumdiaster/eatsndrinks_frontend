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
        <!-- Easy Ordering -->
        <div class="bg-white shadow-md rounded-lg p-6 text-center">
          <div class="flex justify-center items-center w-16 h-16 bg-yellow-500 text-white rounded-full mx-auto mb-4">
            <img src="/icons/phone.svg" alt="phone icon" class="w-10 h-10" />
          </div>
          <h3 class="text-lg font-semibold">Easy Ordering</h3>
          <p class="text-gray-600">Even without website access, you can place your order with a simple phone call.</p>
        </div>

        <!-- Fast Preparation -->
        <div class="bg-white shadow-md rounded-lg p-6 text-center">
          <div class="flex justify-center items-center w-16 h-16 bg-yellow-500 text-white rounded-full mx-auto mb-4">
            <img src="/icons/time.svg" alt="phone icon" class="w-10 h-10" />
          </div>
          <h3 class="text-lg font-semibold">Quick Preparation</h3>
          <p class="text-gray-600">All orders are prepared in less than 30 minutes.</p>
        </div>

        <!-- Free Delivery -->
        <div class="bg-white shadow-md rounded-lg p-6 text-center">
          <div class="flex justify-center items-center w-16 h-16 bg-yellow-500 text-white rounded-full mx-auto mb-4">
            <img src="/icons/marker.svg" alt="phone icon" class="w-10 h-10" />
          </div>
          <h3 class="text-lg font-semibold">Delivery to Your Address</h3>
          <p class="text-gray-600">Delivery is completely free! :)</p>
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
