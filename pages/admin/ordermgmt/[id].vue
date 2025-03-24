<template>
  <AdminLayout pageTitle="Danh sách sản phẩm">
    <template #breadcrumb>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/admin/products">Sản phẩm</BreadcrumbItem>
      </Breadcrumb>
    </template>

    <EditTemplate @cancel="goBack"/>
    
  </AdminLayout>
</template>

<script lang="ts" setup>
import { useToast } from 'vue-toastification';
import { useRouter } from '#app';
import { useRuntimeConfig } from '#imports';
import { AdminLayout } from "#components";
import Breadcrumb from "~/components/admin/molecules/Breadcrumb.vue";
import BreadcrumbItem from "~/components/admin/atoms/Breadcrumb/BreadcrumbItem.vue";
import EditTemplate from "~/components/admin/organisms/ordermgmt/Edit.vue";
const toast = useToast();
const router = useRouter();
const goBack = () => {
  toast.warning(
    h("div", { class: "space-y-2" }, [
      h("p", "Bạn có chắc chắn muốn thoát không? Dữ liệu chưa lưu sẽ bị mất."),
      h("button", {
        onClick: () => {
          toast.clear();
          router.push("/admin/orders");
        },
        class: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition",
      }, "Thoát"),
    ]),
    { timeout: false, closeOnClick: false }
  );
};
</script>