<template>
  <SidebarItem @click="$emit('toggleDropdown')" :icon="icon" :labelSidebarItem="labelSidebarItem" :isLink="false"
    :sidebaropen="sidebaropen">
    <div class="ml-auto flex items-center">
      <span v-show="sidebaropen && dropdownOpen" class="ml-2">
        <img src="/images/uparrow.svg" alt="up arrow" class="w-2 h-2 mr-2" />
      </span>
      <span v-show="sidebaropen && !dropdownOpen" class="ml-2">
        <img src="/images/downarrow.svg" alt="down arrow" class="w-2 h-2 mr-2" />
      </span>
    </div>
  </SidebarItem>
  <div class="pl-4">
    <transition v-if="isMounted" name="dropdown" enter-active-class="transition-all duration-500 ease-in-out"
      leave-active-class="transition-all duration-500 ease-in-out">
      <ul v-show="dropdownOpen && sidebaropen"
        class="pl-0 mt-1 flex flex-col border-l-2 border-l-teal-300 border-gray-300">
        <div class="px-2">
          <DDSibebarItem v-for="item in items" :key="item.link" :link="item.link" :labelDD="item.labelDD" />
        </div>
      </ul>
    </transition>
  </div>
</template>

<script setup>

import SidebarItem from '~/components/admin/atoms/Button/SidebarItem.vue';
import DDSibebarItem from '~/components/admin/atoms/Button/DDSibebarItem.vue';
defineProps({
  icon: String,
  labelSidebarItem: String,
  labelDD: String,
  items: Array,
  sidebaropen: Boolean,
  dropdownOpen: Boolean,
});
defineEmits(['toggleDropdown']);

import { ref, onMounted } from 'vue';

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});


</script>

<style scoped>
/* Dropdown enter and leave animations */
.dropdown-enter-from {
  opacity: 0;
  transform: scaleY(0.9);
  max-height: 0;
}

.dropdown-enter-to {
  opacity: 1;
  transform: scaleY(1);
  max-height: 100rem;
}

.dropdown-leave-from {
  opacity: 1;
  transform: scaleY(1);
  max-height: 100rem;
}

.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.9);
  max-height: 0;
}
</style>