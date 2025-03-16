<template>
  <div class="flex flex-col w-full space-y-2">
    <!-- Bảng hiển thị danh sách -->
    <div class="flex">
      <EasyDataTable class="w-full h-full" :headers="headers" :items="items" hide-footer>
        <template #item-actions="{ id }">
          <div class="flex space-x-2">
            <NuxtLink :to="`/${entity}/${id}`">
              <button class="h-5 w-5"><img src="/images/edit_icon_table.png" alt="Edit"></button>
            </NuxtLink>
            <button @click="emit('delete', id)" class="h-6 w-6"><img src="/images/delete_icon_table.png" alt="Delete"></button>
          </div>
        </template>
      </EasyDataTable>
    </div>

    <!-- Phân trang -->
    <div class="pagination-container flex justify-between">
      <div class="flex flex-col">
        <div class="flex items-center gap-6 p-4 rounded-lg font-sans text-gray-700 text-base">
          <span class="font-bold text-teal-800">Số lượng mỗi trang: {{ limit }}</span>
          <span class="italic text-gray-500">
            Đang hiển thị: {{ (currentPage - 1) * limit + 1 }} - {{ Math.min(currentPage * limit, totalItems) }} / {{ totalItems }} tổng số
          </span>
        </div>
      </div>
      <vue-awesome-paginate v-model="currentPage" :total-items="totalItems" :items-per-page="limit" :max-pages-shown="5"
        @update:modelValue="emit('pageChange', currentPage)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, required: true },
  totalItems: { type: Number, default: 0 },
  limit: { type: Number, default: 10 },
  entity: { type: String, required: true },
});

const emit = defineEmits(["delete", "pageChange"]);

const currentPage = ref(1);

onMounted(() => {
  if (import.meta.client) {
    const storedPage = localStorage.getItem(`${props.entity}_currentPage`);
    currentPage.value = storedPage ? Number(storedPage) : 1;
  }
});

// Lưu trạng thái trang riêng cho từng bảng
watch(currentPage, (newPage) => {
  if (import.meta.client) {
    localStorage.setItem(`${props.entity}_currentPage`, newPage.toString());
  }
});

</script>
