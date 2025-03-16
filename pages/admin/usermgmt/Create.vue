<template>
  <AdminLayout pageTitle="Danh sách tài khoản">
    <template #breadcrumb>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Quản trị hệ thống</BreadcrumbItem>
        <BreadcrumbItem href="/user_management">Tài khoản</BreadcrumbItem>
      </Breadcrumb>
    </template>

    <CreateTemplate />
    
  </AdminLayout>
</template>
<script lang="ts" setup>
import { AdminLayout } from "#components";
import Breadcrumb from "~/components/admin/molecules/Breadcrumb.vue";
import BreadcrumbItem from "~/components/admin/atoms/Breadcrumb/BreadcrumbItem.vue";
import CreateTemplate from "~/components/admin/organisms/usermgmt/Create.vue";

</script>