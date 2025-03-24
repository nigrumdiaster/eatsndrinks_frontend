<template>
  <AdminLayout pageTitle="Chỉnh sửa tài khoản">
    <template #breadcrumb>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/user_management">Tài khoản</BreadcrumbItem>
        <BreadcrumbItem>Chỉnh sửa</BreadcrumbItem>
      </Breadcrumb>
    </template>

    <EditTemplate v-if="user" :user="user" @save="updateUser" @cancel="goBack" />
    <p v-else class="text-center text-gray-500">Đang tải dữ liệu...</p>
  </AdminLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AdminLayout } from "#components";
import Breadcrumb from "~/components/admin/molecules/Breadcrumb.vue";
import BreadcrumbItem from "~/components/admin/atoms/Breadcrumb/BreadcrumbItem.vue";
import EditTemplate from "~/components/admin/organisms/usermgmt/Edit.vue";
import { useToast } from "vue-toastification";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  phone_number?: string | null;
  address?: string | null;
  date_of_birth?: string | null;
  is_active: boolean;
}

const route = useRoute();
const router = useRouter();
const user = ref<User | null>(null);
const toast = useToast();

const fetchUser = async () => {
  try {
    const config = useRuntimeConfig();
    const token = useCookie("access_token");

    const response = await $fetch<User>(`${config.public.apiBase}/users/admin/user/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    console.log("User info:", response);
    user.value = response;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin user:", error);
    toast.error("Không tìm thấy thông tin user!");
    router.push("/admin/users");
  }
};

const updateUser = async (updatedUser: User) => {
  try {
    const config = useRuntimeConfig();
    const token = useCookie("access_token");

    await $fetch(`${config.public.apiBase}/users/admin/user/${route.params.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token.value}` },
      body: {
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        phone_number: updatedUser.phone_number,
        address: updatedUser.address,
        date_of_birth: updatedUser.date_of_birth,
        is_active: updatedUser.is_active,
      },
    });

    toast.success("Cập nhật thành công!");
    router.push("/admin/users");
  } catch (error) {
    console.error("Lỗi khi cập nhật user:", error);
    toast.error("Cập nhật thất bại!");
  }
};

const goBack = () => {
  toast.warning(
    h("div", { class: "space-y-2" }, [
      h("p", "Bạn có chắc chắn muốn thoát không? Dữ liệu chưa lưu sẽ bị mất."),
      h("button", {
        onClick: () => {
          toast.clear();
          router.push("/user_management");
        },
        class: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition",
      }, "Thoát"),
    ]),
    { timeout: false, closeOnClick: false }
  );
};

onMounted(fetchUser);
</script>
