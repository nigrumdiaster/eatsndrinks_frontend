<template>
  <div class="h-14 bg-white flex items-center justify-center border-b-1 border-b-black">
    <div class="pl-2 flex items-center space-x-2">
      <nuxt-link to="/" class="text-3xl font-bold text-yellow-500">EATSNDRINKS</nuxt-link>
    </div>
    <div class="ml-auto pr-2 flex space-x-4">
      <div class="relative">

        <div @click="toggleDropdown" class="h-10 rounded-2xl p-2 cursor-pointer py-2 hover:bg-teal-200 flex items-center space-x-1">
          <CircleButton  class="hover:bg-gray-200 transition">
            <img src="/images/vietnamicon.png" alt="Profile Icon" class="w-full h-full" />
          </CircleButton>
          <div>
            <span class="text-black">{{ user?.fullname }}</span>
          </div>
        </div>

        <!-- Profile Dropdown -->
        <div v-if="showDropdown"
          class="absolute right-0 mt-4 w-40 bg-white shadow-md rounded-lg border p-2 transition-all duration-200">
          <router-link to="/profile" class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
            <img src="/icons/profile.svg" alt="Profile Icon" class="w-5 h-5" />
            <span>Profile</span>
          </router-link>
          <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-red-100 flex items-center space-x-2">
            <img src="/icons/exit.svg" alt="Logout Icon" class="w-5 h-5" />
            <span class="text-red-500">Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CircleButton from '~/components/admin/atoms/Button/CircleButton.vue';
import { ref } from 'vue';
const showDropdown = ref(false);
interface User {
  fullname: string;
}

const user = useState<User>('user');
// Toggle profile dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};
const logout = () => {
  console.log("Logging out...");

  const token = useCookie("auth_token");
  token.value = null; // Clear the token
  console.log("Token cleared:", token.value);

  navigateTo("/login");
};
</script>
