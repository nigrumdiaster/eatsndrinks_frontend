<!-- Breadcrumb.vue -->
<template>
  <nav class="text-sm">
    <ol class="flex items-center">
      <li 
        v-for="(item, index) in items" 
        :key="index"
        class="flex items-center"
      >
        <!-- Render BreadcrumbItem -->
        <component :is="item" />
        
        <!-- Render Separator nếu không phải item cuối -->
        <BreadcrumbSeparator 
          v-if="index < items.length - 1"
          class="ml-2" 
        />
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import BreadcrumbSeparator from '~/components/admin/atoms/Breadcrumb/BreadcrumbSeperator.vue'
import BreadcrumbItem from '~/components/admin/atoms/Breadcrumb/BreadcrumbItem.vue'

const slots = useSlots()

// Lọc các component BreadcrumbItem từ slot
const items = computed(() => {
  return slots.default().filter(node => 
    node.type.__name === 'BreadcrumbItem' // Vue 3 component name check
  )
})
</script>