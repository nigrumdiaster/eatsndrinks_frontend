<template>
    <input
      :type="type"
      class="w-72 h-8 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-black bg-white shadow-sm"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
    />
</template>
  
<script setup lang="ts">
  const props = defineProps<{
    type: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
  }>();
</script>
  