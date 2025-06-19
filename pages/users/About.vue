<template>
  <div class="min-h-screen" :style="{ backgroundImage: `url('/images/background.jpg')`, backgroundRepeat: 'repeat' }">
    <Header />
    <section class="max-w-3xl mx-auto py-12 px-6 mt-8 bg-white bg-opacity-90 rounded-3xl shadow-2xl border border-yellow-300">
      <div class="flex flex-col items-center mb-8">
        <img src="/images/about-img.png" alt="EatsNDrinks Logo" class="w-28 h-28 rounded-full shadow-lg mb-4 border-4 border-yellow-400 bg-white object-cover" />
        <h1 class="text-5xl font-extrabold mb-2 text-yellow-500 drop-shadow text-center">Về EatsNDrinks</h1>
        <p class="italic text-lg text-gray-600 text-center max-w-xl">
          "Ẩm thực là nghệ thuật kết nối con người. EatsNDrinks giúp bạn khám phá và tận hưởng những trải nghiệm tuyệt vời ấy mỗi ngày."
        </p>
      </div>
      <div class="mb-8 flex flex-col items-center">
        <span class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 mb-2">
          <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V7c0-2.21 3.582-4 8-4s8 1.79 8 4v7c0 2.21-3.582 4-8 4z"/></svg>
        </span>
        <h2 class="text-2xl font-bold mb-2 text-yellow-600">Sứ mệnh</h2>
        <p class="text-center text-gray-700 max-w-lg">
          Kết nối thực khách với những địa điểm ẩm thực chất lượng, mang lại trải nghiệm tiện lợi, nhanh chóng và an toàn.
        </p>
      </div>
      <div class="mb-8 flex flex-col items-center">
        <span class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 mb-2">
          <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m9-4.13a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"/></svg>
        </span>
        <h2 class="text-2xl font-bold mb-2 text-yellow-600">Đội ngũ phát triển</h2>
        <ul class="list-none text-gray-700 text-center">
          <li><span class="font-semibold">Lường Đại Nghĩa</span> - Founder & CEO</li>
          <li><span class="font-semibold">Lường Đại Nghĩa</span> - Lead Developer</li>
          <li><span class="font-semibold">Lường Đại Nghĩa</span> - UI/UX Designer</li>
          <li>Và các thành viên khác...</li>
        </ul>
      </div>
      <div class="mb-4 flex flex-col items-center">
        <span class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 mb-2">
          <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10.5a8.38 8.38 0 0 1-1.9.5 3.48 3.48 0 0 0 1.5-1.9 7.72 7.72 0 0 1-2.2.8A3.48 3.48 0 0 0 12 8a3.48 3.48 0 0 0-3.4 4.3A9.86 9.86 0 0 1 3 9.1a3.48 3.48 0 0 0 1.1 4.6 3.48 3.48 0 0 1-1.6-.4v.04a3.48 3.48 0 0 0 2.8 3.4 3.48 3.48 0 0 1-1.6.06 3.48 3.48 0 0 0 3.2 2.4A7 7 0 0 1 2 19.5a9.86 9.86 0 0 0 5.3 1.5c6.3 0 9.8-5.2 9.8-9.8 0-.15 0-.3-.01-.45A7.72 7.72 0 0 0 22 6.5a7.72 7.72 0 0 1-2.2.8z"/></svg>
        </span>
        <h2 class="text-2xl font-bold mb-2 text-yellow-600">Liên hệ</h2>
        <p class="text-gray-700">Email: <a href="mailto:support@eatsndrinks.com" class="text-blue-600 underline">support@eatsndrinks.com</a></p>
        <p class="text-gray-700">Hotline: <a href="tel:0123456789" class="text-blue-600 underline">0123 456 789</a></p>
      </div>
    </section>
    <Footer />
  </div>
</template>
<script lang="ts" setup>
import Header from '~/components/users/Header.vue';
import Footer from '~/components/users/Footer.vue';
</script>