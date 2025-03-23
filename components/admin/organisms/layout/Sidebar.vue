<template>
  <div class="relative transition-all duration-800 bg-white h-full border-0 border-black"
    :class="{ 'w-64': sidebaropen, 'w-12': !sidebaropen }">

    <!-- Sidebar Toggle Button -->
    <SidebarButton @click="toggleSidebar" :sidebaropen="sidebaropen">
      DANH MỤC
    </SidebarButton>

    <!-- Sidebar Items -->
    <div class="mt-2 overflow-hidden whitespace-nowrap">
      <ul class="list-none px-1">
        <SidebarItem @click="sidebaropen = true" icon="/images/home.svg" labelSidebarItem="Dashboard" linkSidebarItem="/"
          :sidebaropen="sidebaropen" />

        <SidebarDropdown icon="/images/manage.svg" labelSidebarItem="Quản trị hệ thống"
          @toggleDropdown="toggleDropdown('qtht')" :sidebaropen="sidebaropen" :dropdownOpen="dropdownStates.qtht"
          :items="itemsQTHT" />

        <SidebarItem @click="sidebaropen = true" icon="/icons/food.svg" labelSidebarItem="Quản lý sản phẩm" linkSidebarItem="/admin/products"
          :sidebaropen="sidebaropen" />

        <SidebarItem @click="sidebaropen = true" icon="/icons/food.svg" labelSidebarItem="Quản lý đơn hàng" linkSidebarItem="/admin/orders"
          :sidebaropen="sidebaropen" />
      </ul>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import SidebarButton from '~/components/admin/atoms/Button/SidebarButton.vue';
import SidebarItem from '~/components/admin/atoms/Button/SidebarItem.vue';
import SidebarDropdown from '~/components/admin/molecules/SidebarDropdown.vue';

const route = useRoute();

// Sidebar state
const sidebaropen = ref(false);

// Dropdown states stored as an object
const dropdownStates = ref({
  qtht: false,  // Quản trị hệ thống
  tqdl: false,  // Trực quan dữ liệu
});

// Load sidebar & dropdown states from localStorage
onMounted(() => {
  if (typeof window !== 'undefined') {
    sidebaropen.value = localStorage.getItem('sidebarOpen') === 'true';

    // Retrieve dropdown states, ensuring it's a valid object
    const savedDropdownStates = JSON.parse(localStorage.getItem('dropdownStates'));
    if (savedDropdownStates) {
      dropdownStates.value = savedDropdownStates;
    }
  }
});

// Watch sidebar state and update localStorage
watch(sidebaropen, (newVal) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sidebarOpen', newVal);
  }
});

// Watch dropdownStates and update localStorage (DEEP WATCH to detect changes in the object)
watch(dropdownStates, (newVal) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dropdownStates', JSON.stringify(newVal));
  }
}, { deep: true });

// Toggle sidebar
const toggleSidebar = () => {
  sidebaropen.value = !sidebaropen.value;
};

// Toggle specific dropdown
const toggleDropdown = (menu) => {
  if (sidebaropen.value === true) {
    dropdownStates.value[menu] = !dropdownStates.value[menu];
  }
  else if (sidebaropen.value === false) {
    sidebaropen.value = true;
    dropdownStates.value[menu] = true;
  }
};

// Sidebar Dropdown Items
const itemsQTHT = [
  { link: '/admin/users', labelDD: 'Tài khoản' },
];


</script>
