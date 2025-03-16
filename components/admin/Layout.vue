<template>
  <div class="bg-black h-screen flex flex-col">
      <!-- Header -->
      <Header class="w-full flex-none" />

      <!-- <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white">
          <Spinner />
      </div> -->

      <!-- Main Content -->
      <div class="flex flex-1">
          <!-- Sidebar -->
          <Sidebar class="w-1/4 h-full flex-none" />

          <!-- Content and Footer -->
          <div class="flex flex-col flex-1 h-full">
              <!-- Content -->
              <Content class="flex-1" :pageTitle="pageTitle">
                  <template #breadcrumb>
                      <slot name="breadcrumb"></slot>
                  </template>
                  <slot></slot>
              </Content>
              <!-- Footer -->
              
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/admin/organisms/layout/Header.vue';
import Sidebar from '~/components/admin/organisms/layout/Sidebar.vue';
import Content from '~/components/admin/organisms/content/Content.vue';
defineProps({
  pageTitle: String,
});

</script>
