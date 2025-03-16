<template>
  <div class="bg-gray-300 flex flex-col h-full w-full">
    <Subheader :pageTitle="pageTitle">
      <template #breadcrumb>
        <slot name="breadcrumb"></slot>
      </template>
    </Subheader>
    <Core class="flex-1">
      <slot></slot>
    </Core>
  </div>
</template>

<script lang="ts" setup>
import Subheader from '~/components/admin/organisms/content/Subheader.vue';
import Core from '~/components/admin/organisms/content/Core.vue';
defineProps({
  pageTitle: String,
});
</script>
