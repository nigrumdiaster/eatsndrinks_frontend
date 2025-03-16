<template>
    <label :for="id" class="block text-sm font-medium text-white">
      <slot></slot> <!-- Slot for dynamic label text -->
    </label>
  </template>
    
  <script setup lang="ts">
    const props = defineProps<{
      id: string;  // Ensure 'id' is required here
    }>();
  </script>
  