<template>
  <AdminLayout pageTitle="Danh sách tài khoản">
    <template #breadcrumb>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Quản trị hệ thống</BreadcrumbItem>
        <BreadcrumbItem href="/user_management">Tài khoản</BreadcrumbItem>
      </Breadcrumb>
    </template>

    <CreateTemplate @createUser="handleCreateUser" />
    
  </AdminLayout>
</template>

<script lang="ts" setup>
import { useToast } from 'vue-toastification';
import { useRouter } from '#app';
import { useRuntimeConfig } from '#imports';
import { AdminLayout } from "#components";
import Breadcrumb from "~/components/admin/molecules/Breadcrumb.vue";
import BreadcrumbItem from "~/components/admin/atoms/Breadcrumb/BreadcrumbItem.vue";
import CreateTemplate from "~/components/admin/organisms/usermgmt/Create.vue";

const toast = useToast();
const router = useRouter();
const config = useRuntimeConfig();

const handleCreateUser = async (form: { username: string; password: string; first_name: string; last_name: string }) => {
  console.log("Nhận dữ liệu từ form:", form);

  try {
    const response = await $fetch(`${config.public.apiBase}/users/register/`, {
      method: "POST",
      body: form,
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("Kết quả đăng ký:", response);
    toast.success("Người dùng đã được tạo thành công!");
    router.push("/admin/users");
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    toast.error("Không thể đăng ký. Vui lòng kiểm tra lại thông tin.");
  }
};
</script>
