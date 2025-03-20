<template>
    <footer class="bg-gray-900 text-white py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Company Information -->
          <div>
            <h3 class="text-2xl font-bold text-yellow-500">EATSNDRINKS</h3>
            <p class="mt-2 text-gray-300">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora mollitia, hic provident, numquam ducimus, in at quo accusamus nihil unde voluptates. Ipsa magnam blanditiis voluptatibus voluptates delectus odio aspernatur vitae.
            </p>
          </div>
  
          <!-- Quick Links -->

            <!-- <div>
                <h3 class="text-xl font-semibold text-yellow-500">Quick Links</h3>
                <ul class="mt-2 space-y-2 text-gray-300">
                    <li>
                        <NuxtLink to="/about-us" class="text-gray-300">About Us</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/menu" class="text-gray-300">Menu</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/locations" class="text-gray-300">Locations</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/reservations" class="text-gray-300">Reservations</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/contact" class="text-gray-300">Contact</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/blog" class="text-gray-300">Blog</NuxtLink>
                    </li>
                </ul>
            </div> -->


        <!-- Contact Information -->
          <div>
            <h3 class="text-xl font-semibold text-yellow-500">Contact Us</h3>
            <ul class="mt-2 space-y-2 text-gray-300">
                <li class="flex items-center space-x-2">
                    <img src="public\icons\marker.svg" alt="Contact Icon" class="w-5 h-5">
                    <i class="bi bi-geo-alt-fill text-yellow-500"></i>
                    <span>Trường Đại học Sư phạm Kỹ thuật Thành phố Hồ Chí Minh</span>
                </li>
                <li class="flex items-center space-x-2">
                    <img src="public\icons\phone.svg" alt="Contact Icon" class="w-5 h-5">
                    <i class="bi bi-telephone-fill text-yellow-500"></i>
                    <span>0123 456 789</span>
                </li>
                <li class="flex items-center space-x-2">
                    <img src="public\icons\gmail-svgrepo-com.svg" alt="Contact Icon" class="w-5 h-5">
                    <i class="bi bi-envelope-fill text-yellow-500"></i>
                    <span>contact@eatsndrinks.com</span>
                </li>
            </ul>

         <!-- Social Media Icons -->
            <div class="flex space-x-4 mt-4">
                <a href="#" class="text-white">
                    <img src="public\icons\twitter-round-svgrepo-com.svg" alt="Contact Icon" class="w-10 h-10" svg-white>
                    <i class="bi bi-twitter text-2xl"></i>
                </a>
                <a href="#" class="text-white">
                    <img src="public\icons\facebook-svgrepo-com.svg" alt="Contact Icon" class="w-10 h-10" svg-white>
                    <i class="bi bi-facebook text-2xl"></i>
                </a>
                <a href="#" class="text-white">
                    <img src="public\icons\linkedin-round-svgrepo-com.svg" alt="Contact Icon" class="w-10 h-10" svg-white>
                    <i class="bi bi-linkedin text-2xl"></i>
                </a>
                <a href="#" class="text-white">
                    <img src="public\icons\youtube-round-svgrepo-com.svg" alt="Contact Icon" class="w-10 h-10" svg-white>
                    <i class="bi bi-youtube text-2xl"></i>
                </a>
            </div>
          </div>  
        </div>
  
        <!-- Copyright -->
        <div class="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
            &copy; {{ currentYear }} <span class="font-semibold text-yellow-500">EATSNDRINKS</span>. All Rights Reserved.
        </div>
      </div>
    </footer>
  </template>
  
    <script lang="ts" setup>
        const  currentYear= new Date().getFullYear()
    </script>


    <style scoped>
        .svg-white {
          filter: brightness(0) invert(1);
    }
    </style>
