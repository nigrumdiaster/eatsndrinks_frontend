<template>
  <div class="flex flex-col bg-white p-6 w-full h-full">
    <strong class="text-2xl mb-3">Chỉnh sửa sản phẩm</strong>
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
      <LabelInput id="price" v-model="form.price" type="text" placeholder="Giá">
        <template #label>Giá</template>
      </LabelInput>

      <!-- Số lượng -->
      <LabelInput id="quantity" v-model="form.quantity" type="text" placeholder="Số lượng">
        <template #label>Số lượng</template>
      </LabelInput>

      <!-- Trạng thái -->
      <div>
        <label class="block text-lg font-medium">Trạng thái</label>
        <select v-model="form.is_active" class="w-full p-2 border rounded-lg">
          <option :value="true">Hoạt động</option>
          <option :value="false">Không hoạt động</option>
        </select>
      </div>

      <!-- Chọn danh mục -->
      <div>
        <label class="block text-lg font-medium">Danh mục</label>
        <select v-model="form.category" class="w-full p-2 border rounded-lg">
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Hình ảnh chính với Dropzone -->
      <div>
        <label class="block text-lg font-medium">Hình ảnh chính</label>
        <form ref="mainImageDropzoneRef" class="dropzone border-2 border-dashed p-6 rounded-lg"></form>
        <div v-if="mainImagePreview" class="mt-4 relative">
          <img :src="mainImagePreview" class="w-32 h-32 object-cover rounded-lg shadow-md" />
          <button @click="removeMainImage" class="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
            ✕
          </button>
        </div>
      </div>

      <!-- Dropzone cho hình ảnh bổ sung -->
      <div>
        <label class="block text-lg font-medium">Hình ảnh sản phẩm</label>
        <form ref="dropzoneRef" class="dropzone border-2 border-dashed p-6 rounded-lg"></form>
        <div class="preview-container mt-4 flex flex-wrap gap-2">
          <div v-for="(image, index) in previewImages" :key="index" class="relative">
            <img :src="image" class="w-24 h-24 object-cover rounded-lg shadow-md" />
            <button @click="removeImage(index)" class="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- Nút hành động -->
      <div class="flex justify-end space-x-5">
        <button @click="updateProduct"
          class="bg-blue-500 text-white text-lg px-6 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800">
          Cập nhật
        </button>

        <button @click="cancelEdit"
          class="bg-red-500 text-white text-lg px-6 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800">
          Thoát
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
// @ts-ignore
import Dropzone from 'dropzone';
import LabelInput from '~/components/admin/molecules/LabelInputBlack.vue';
import { useToast } from 'vue-toastification';
import { useRouter, useRoute } from '#app';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  mainimage: string;
  is_active: boolean;
  quantity: string;
  price: string;
  category: number;
  category_name: string;
  images: { id: number; image: string; product: number }[];
}

const toast = useToast();
const router = useRouter();
const route = useRoute();
const productId = route.params.id as string;

const form = ref<Partial<Product>>({
  name: '',
  description: '',
  price: '',
  quantity: '',
  category: 0,
  is_active: true,
  mainimage: '',
  images: [],
});

const categories = ref<Category[]>([]);
const mainImagePreview = ref<string | null>(null);
const previewImages = ref<string[]>([]);

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

const fetchProduct = async () => {
  try {
    const data = await useApiFetch<Product>(`/catalogue/products/${productId}`);
    form.value = {
      ...data,
      price: String(data.price),
      quantity: String(data.quantity),
    };
    mainImagePreview.value = data.mainimage || null;
    previewImages.value = data.images ? data.images.map(img => img.image) : [];
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

const removeMainImage = () => {
  mainImagePreview.value = null;
  form.value.mainimage = '';
};

const removeImage = (index: number) => {
  previewImages.value.splice(index, 1);
  form.value.images?.splice(index, 1);
};

const updateProduct = () => {
  const payload = {
    ...form.value,
    quantity: Number(form.value.quantity),
  };
  console.log("Updating product...", payload);
  // Gọi API cập nhật sản phẩm ở đây
};

const cancelEdit = () => {
  router.push('/product_management');
};

const mainImageDropzoneRef = ref<HTMLFormElement | null>(null);
const dropzoneRef = ref<HTMLFormElement | null>(null);
let mainImageDropzone: Dropzone;
let dropzoneInstance: Dropzone;

onMounted(async () => {
  await fetchProduct();
  await fetchCategories();

  mainImageDropzone = new Dropzone(mainImageDropzoneRef.value!, {
    url: "/fake-upload",
    autoProcessQueue: false,
    acceptedFiles: "image/*",
    maxFiles: 1,
    thumbnailWidth: 150,
    thumbnailHeight: 150,
    previewsContainer: false,
    init: function () {
      this.on("addedfile", (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          mainImagePreview.value = event.target?.result as string;
          form.value.mainimage = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    },
  });

  dropzoneInstance = new Dropzone(dropzoneRef.value!, {
    url: "/fake-upload",
    autoProcessQueue: false,
    acceptedFiles: "image/*",
    thumbnailWidth: 120,
    thumbnailHeight: 120,
    previewsContainer: false,
    init: function () {
      this.on("addedfile", (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          previewImages.value.push(event.target?.result as string);
          form.value.images?.push({ id: Date.now(), image: event.target?.result as string, product: Number(productId) });
        };
        reader.readAsDataURL(file);
      });
    },
  });
});
</script>

