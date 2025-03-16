<template>
    <button
      :class="[
        'h-10 px-4 rounded flex items-center justify-center',
        variantClasses[props.variant || 'primary']
      ]"
    >
      <slot></slot>
    </button>
</template>
  
<script setup lang="ts">
  const props = defineProps<{
    variant?: 'primary' | 'danger' | 'success' | 'transparent'; 
  }>();
  
  const variantClasses = {
    primary: 'bg-teal-500 hover:bg-teal-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    transparent: 'bg-transparent hover:bg-gray-300',
  };
</script>
  