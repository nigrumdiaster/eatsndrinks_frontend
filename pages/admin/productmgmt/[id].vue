<template>
  <AdminLayout pageTitle="Danh sách sản phẩm">
    <template #breadcrumb>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/admin/products">Sản phẩm</BreadcrumbItem>
      </Breadcrumb>
    </template>

    <EditTemplate/>
    
  </AdminLayout>
</template>

<script lang="ts" setup>
import { useToast } from 'vue-toastification';
import { useRouter } from '#app';
import { useRuntimeConfig } from '#imports';
import { AdminLayout } from "#components";
import Breadcrumb from "~/components/admin/molecules/Breadcrumb.vue";
import BreadcrumbItem from "~/components/admin/atoms/Breadcrumb/BreadcrumbItem.vue";
import EditTemplate from "~/components/admin/organisms/productmgmt/Edit.vue";
</script>