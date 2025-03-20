<template>
  <div>
    <section class="py-10 w-4/5 justify-center mx-auto">
        <div class="container mx-auto">
            <div class="text-center">
                <h2 class="text-2xl font-bold mb-6">Sản phẩm cùng danh mục</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ProductCard v-for="product in tabProduct.slice(0, 8)" :key="product.id"
                    :product="product" />
            </div>
        </div>
    </section>

  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import ProductCard from '~/components/users/product/Card.vue';
interface Product {
    id: number;
    name?: string;
    description?: string;
    category?: number;
    mainimage?: string;
}

const props = defineProps<{ categoryId?: number }>(); // Cho phép `categoryId` là `undefined`

const tabProduct = ref<Product[]>([]);

const fetchProductsByCategory = async (categoryId?: number) => {
    if (!categoryId) return; // Nếu categoryId chưa có, không gọi API
    try {
        const data = await useApiFetch<Product[]>(`/catalogue/categories/${categoryId}/products/?limit=3`);
        tabProduct.value = data || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        tabProduct.value = [];
    }
};

// Gọi API khi categoryId thay đổi
watch(() => props.categoryId, (newCategoryId) => {
    if (newCategoryId) fetchProductsByCategory(newCategoryId);
}, { immediate: true });

</script>
