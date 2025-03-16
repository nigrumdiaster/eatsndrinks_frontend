<template>
  <span class="text-teal-500 text-3xl">{{ pageTitle }}</span>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{ pageTitle?: string }>(), 
  { pageTitle: 'Default Title' }
);
</script>

<style></style>