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
import { ref, defineEmits, onMounted, onBeforeUnmount } from 'vue';
// @ts-ignore
import Dropzone from 'dropzone';
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
  mainimage: null as File | null,
  uploaded_images: [] as File[],
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

// Xử lý Dropzone cho hình ảnh chính
const mainImageDropzoneRef = ref(null);
const mainImagePreview = ref<string | null>(null);

onMounted(() => {
  const mainImageDropzone = new Dropzone(mainImageDropzoneRef.value, {
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
          form.value.mainimage = file;
        };
        reader.readAsDataURL(file);
      });
    },
  });
});

// Xóa ảnh chính
const removeMainImage = () => {
  mainImagePreview.value = null;
  form.value.mainimage = null;
};

// Dropzone setup cho hình ảnh bổ sung
const dropzoneRef = ref(null);
const previewImages = ref<string[]>([]);
let dropzoneInstance: Dropzone | null = null;

onMounted(() => {
  dropzoneInstance = new Dropzone(dropzoneRef.value, {
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
          form.value.uploaded_images.push(file);
        };
        reader.readAsDataURL(file);
      });
    },
  });
});

// Xóa ảnh khỏi danh sách preview
const removeImage = (index: number) => {
  previewImages.value.splice(index, 1);
  form.value.uploaded_images.splice(index, 1);
};

onBeforeUnmount(() => {
  if (dropzoneInstance) {
    dropzoneInstance.destroy();
  }
});

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
