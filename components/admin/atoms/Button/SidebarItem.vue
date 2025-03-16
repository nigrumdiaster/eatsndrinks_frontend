<template>
  <component 
    :is="linkSidebarItem ? 'router-link' : 'li'" 
    v-bind="linkSidebarItem ? { to: linkSidebarItem } : {}"
    class="mt-1 cursor-pointer p-2 rounded-lg flex items-center transition-all duration-200"
    :class="{
      'bg-teal-200 text-black font-bold': isActive, // ✅ Active item
      'hover:bg-teal-300 text-black': !isActive // Inactive item
    }"
    @click="$emit('click')"
  >
    <img :src="icon" alt="icon" class="w-5 h-5 mr-2" />

    <span v-show="sidebaropen" class="text-sm font-bold">
      {{ labelSidebarItem }}
    </span>

    <slot></slot>
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Define props
const props = defineProps({
  icon: String,
  labelSidebarItem: String,
  linkSidebarItem: String,
  sidebaropen: Boolean,
});

defineEmits(['click']);

const route = useRoute();

// Compute `isActive` before rendering
const isActive = computed(() => route.path === props.linkSidebarItem);
</script>
