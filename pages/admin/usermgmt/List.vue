<template>
  <AdminLayout pageTitle="Danh sách tài khoản">
    <template #breadcrumb>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Quản trị hệ thống</BreadcrumbItem>
        <BreadcrumbItem href="/user_management">Tài khoản</BreadcrumbItem>
      </Breadcrumb>
    </template>

    <div class="flex flex-col h-4/5 w-full space-y-2 mt-1">
      <div class="ml-auto">
        <NuxtLink to="/admin/users/create">
          <RectButton><span>Thêm tài khoản</span></RectButton>
        </NuxtLink>
      </div>

      <!-- Sử dụng PaginatedTable -->
      <PaginatedTable 
        :headers="headers" 
        :items="users" 
        :totalItems="totalUsers" 
        :limit="limit" 
        :entity="entity"
        @pageChange="fetchUsers" 
        @delete="deleteUser" 
      />
    </div>
  </AdminLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { AdminLayout } from "#components";
import Breadcrumb from "~/components/admin/molecules/Breadcrumb.vue";
import BreadcrumbItem from "~/components/admin/atoms/Breadcrumb/BreadcrumbItem.vue";
import RectButton from "~/components/admin/atoms/Button/RectButton.vue";
import PaginatedTable from "~/components/admin/organisms/content/PaginatedTable.vue";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  fullname: string;
  is_active: boolean | string;
}


const users = ref<User[]>([]);
const totalUsers = ref(0);
const router = useRouter();
const limit = ref(10);
const entity = "user_management";

const headers = [
  { text: "ID", value: "id" },
  { text: "Username", value: "username" },
  { text: "Full Name", value: "fullname" },
  { text: "Active", value: "is_active" },
  { text: "Actions", value: "actions", sortable: false },
];


const fetchUsers = async () => {
  try {
    const config = useRuntimeConfig();
    const token = useCookie("access_token");

    if (!token.value) return;

    const response = await $fetch<User[]>(`${config.public.apiBase}/users/admin/users`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    users.value = response.map((user) => ({
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      fullname: `${user.first_name} ${user.last_name}`.trim(),
      is_active: user.is_active ? "✅ Active" : "❌ Inactive",
    }));

    totalUsers.value = users.value.length;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const deleteUser = async (id: number) => {
  if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;

  try {
    const config = useRuntimeConfig();
    const token = useCookie("access_token");

    if (!token.value) return;

    await $fetch(`${config.public.apiBase}/users/admin/user/${id}/`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token.value}` },
      body: { is_active: false },
    });

    fetchUsers();
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
