<template>
  <AdminLayout pageTitle="Danh sách sản phẩm">
    <template #breadcrumb>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/admin/products">Sản phẩm</BreadcrumbItem>
      </Breadcrumb>
    </template>

    <CreateTemplate @createProduct="handleCreateProduct" />
    
  </AdminLayout>
</template>

<script lang="ts" setup>
import { useToast } from 'vue-toastification';
import { useRouter } from '#app';
import { useRuntimeConfig } from '#imports';
import { AdminLayout } from "#components";
import Breadcrumb from "~/components/admin/molecules/Breadcrumb.vue";
import BreadcrumbItem from "~/components/admin/atoms/Breadcrumb/BreadcrumbItem.vue";
import CreateTemplate from "~/components/admin/organisms/productmgmt/Create.vue";

const toast = useToast();
const router = useRouter();
const config = useRuntimeConfig();

const handleCreateProduct = async (form: { 
  name: string; 
  description: string; 
  price: number; 
  quantity: number; 
  category: string;
  mainimage: File | null;
  uploaded_images: File[];
}) => {
  try {
    const config = useRuntimeConfig();
    const token = useCookie("access_token");

    if (!token.value) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price.toString());
    formData.append("quantity", form.quantity.toString());
    formData.append("category", form.category);

    if (form.mainimage) {
      formData.append("mainimage", form.mainimage);
    }

    form.uploaded_images.forEach((file) => {
      formData.append("uploaded_images", file);
    });

    // ✅ Gọi API với $fetch
    const response = await $fetch(`${config.public.apiBase}/catalogue/products/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: formData, // Gửi FormData
    });

    console.log("🎉 Sản phẩm đã tạo:", response);
    toast.success("Sản phẩm đã được tạo thành công!");
    router.push("/admin/products");
  } catch (error) {
    console.error("❌ Lỗi khi tạo sản phẩm:", error);
    toast.error("Không thể tạo sản phẩm. Vui lòng kiểm tra lại thông tin.");
  }
};


</script>
