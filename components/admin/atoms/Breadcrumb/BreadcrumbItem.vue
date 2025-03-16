<!-- BreadcrumbItem.vue -->
<template>
  <a
    v-if="href"
    :href="href"
    class="text-teal-500 hover:underline"
  >
    <slot />
  </a>
  <span v-else class="text-gray-500 cursor-default">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  href: {
    type: String,
    default: ''
  }
})

// Đánh dấu component để nhận diện trong Breadcrumb
defineOptions({
  __name: 'BreadcrumbItem'
})
</script>