<template>
  <div class="flex flex-col w-full space-y-2">
    <!-- Bảng hiển thị danh sách -->
    <div class="flex">
      <EasyDataTable class="w-full h-full" :headers="headers" :items="items" hide-footer>
        <template #item-actions="{ id, is_active }">
          <div class="flex space-x-2">
            <NuxtLink :to="`/${entity}/${id}`">
              <button class="h-5 w-5"><img src="/images/edit_icon_table.png" alt="Edit"></button>
            </NuxtLink>
            <button 
              @click="emit(is_active === '✅ Active' ? 'delete' : 'activate', id)" 
              class="h-6 w-6"
            >
              <img 
                :src="is_active === '✅ Active' ? '/images/delete_icon_table.png' : '/images/activate_icon.png'" 
                :alt="is_active === '✅ Active' ? 'Delete' : 'Activate'"
              />
            </button>
          </div>
        </template>
        <template #item-actions_order="{ id }">
          <div class="flex space-x-2">
            <NuxtLink :to="`/${entity}/${id}`">
              <button class="h-5 w-5"><img src="/images/edit_icon_table.png" alt="Edit"></button>
            </NuxtLink>
          </div>
        </template>
        
        <!-- mainimage of product -->>
        <template #item-mainimage="{ mainimage }">
          <img :src="mainimage" alt="Product Image" class="w-20 h-20 object-cover" onerror="this.src='/images/default_product.png'" />
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
        @update:modelValue="updatePage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, required: true },
  totalItems: { type: Number, default: 0 },
  limit: { type: Number, default: 10 },
  entity: { type: String, required: true },
});

const emit = defineEmits(["delete", "activate", "pageChange"]);
const route = useRoute();
const router = useRouter();

const currentPage = ref(Number(route.query.page) || 1);

const updatePage = (newPage: number) => {
  router.push({ query: { ...route.query, page: newPage } });
  emit("pageChange", newPage);
};

watch(() => route.query.page, (newPage) => {
  currentPage.value = Number(newPage) || 1;
});
</script>
