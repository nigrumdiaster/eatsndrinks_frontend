<template>
  <div class="flex flex-col bg-white p-6 w-full h-full">
    <strong class="text-2xl mb-3">Thêm sản phẩm</strong>
    <div class="space-y-6">
      <!-- Tên sản phẩm -->
      <LabelInput id="name" v-model="form.name" type="text" placeholder="Tên sản phẩm">
        <template #label>Tên sản phẩm</template>
      </LabelInput>

      <!-- Mô tả sản phẩm -->
      <LabelInput id="description" v-model="form.description" type="text" placeholder="Mô tả">
        <template #label>Mô tả sản phẩm</template>
      </LabelInput>

      <!-- Giá -->
      <LabelInput id="price" v-model="form.price" type="number" placeholder="Giá">
        <template #label>Giá</template>
      </LabelInput>

      <!-- Số lượng -->
      <LabelInput id="quantity" v-model="form.quantity" type="number" placeholder="Số lượng">
        <template #label>Số lượng</template>
      </LabelInput>

      <!-- Chọn danh mục -->
      <div>
        <label class="block text-lg font-medium">Danh mục</label>
        <select v-model="form.category" class="w-full p-2 border rounded-lg">
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Hình ảnh chính -->
      <div>
        <label class="block text-lg font-medium">Hình ảnh chính</label>
        <input type="file" @change="handleMainImageUpload" class="w-full p-2 border rounded-lg" />
      </div>

      <!-- Hình ảnh bổ sung -->
      <div>
        <label class="block text-lg font-medium">Hình ảnh sản phẩm</label>
        <input type="file" multiple @change="handleImagesUpload" class="w-full p-2 border rounded-lg" />
      </div>

      <!-- Nút hành động -->
      <div class="flex justify-end space-x-5">
        <button @click="createProduct"
          class="bg-blue-500 text-white text-lg px-6 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800">
          Lưu
        </button>

        <button @click="cancelCreate"
          class="bg-red-500 text-white text-lg px-6 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800">
          Thoát
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue';
import LabelInput from '~/components/admin/molecules/LabelInputBlack.vue';
import { useToast } from 'vue-toastification';
import { useRouter } from '#app';

interface Category {
  id: number;
  name: string;
}


const toast = useToast();
const router = useRouter();

// Form data
const form = ref({
  name: '',
  description: '',
  price: '',
  quantity: '',
  category: '',
  mainimage: null as File | null,  // Cho phép File hoặc null
  uploaded_images: [] as File[],   // Mảng chứa nhiều File
});

// Danh sách danh mục
const categories = ref<Category[]>([]);

const fetchCategories = async () => {
  try {
    const data = await useApiFetch<Category[]>("/catalogue/categories/");
    if (Array.isArray(data)) {
      categories.value = data;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};


// Xử lý tải lên hình ảnh chính
const handleMainImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    form.value.mainimage = file;
  }
};

// Xử lý tải lên nhiều ảnh
const handleImagesUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    form.value.uploaded_images = Array.from(files);
  }
};

const emit = defineEmits(['createProduct']);

const createProduct = () => {
  console.log("Submitting product form...", form.value);
  emit("createProduct", form.value);
};

const cancelCreate = () => {
  toast.warning("Bạn có chắc chắn muốn thoát không? Dữ liệu chưa lưu sẽ bị mất.", {
    timeout: 5000,
    closeOnClick: true,
    onClose: () => router.push('/product_management')
  });
};

onMounted(async () => {
  await fetchCategories();
});
</script>
