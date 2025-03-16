<template>
    <button :class="[
      'w-10 h-10 rounded-full flex items-center justify-center',
      variantClasses[props.variant || 'primary']
    ]" @click="props.handleClick">
      <slot></slot>
    </button>
</template>

<script setup lang="ts">

// Define props with default values
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'danger' | 'success' | 'transparent';
    handleClick?: () => void;
  }>(),
  {
    variant: 'primary',
  }
);

const variantClasses = {
  primary: 'bg-teal-500 hover:bg-teal-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  transparent: 'bg-transparent hover:bg-gray-300',
};
</script>

