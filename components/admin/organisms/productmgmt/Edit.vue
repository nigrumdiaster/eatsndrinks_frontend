<template>
  <div class="container mx-auto p-4">
    <h1 class="text-xl font-bold mb-4">Chỉnh sửa sản phẩm</h1>
    <div v-if="loading">Đang tải...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <form v-if="product" @submit.prevent="updateProduct" enctype="multipart/form-data" class="space-y-4">
      <div>
        <label class="block">Tên sản phẩm:</label>
        <input v-model="form.name" class="border p-2 w-full" type="text" />
      </div>
      <div>
        <label class="block">Mô tả:</label>
        <textarea v-model="form.description" class="border p-2 w-full"></textarea>
      </div>
      <div>
        <label class="block">Giá:</label>
        <input v-model="form.price" class="border p-2 w-full" type="number" />
      </div>
      <div>
        <label class="block">Số lượng:</label>
        <input v-model="form.quantity" class="border p-2 w-full" type="number" />
      </div>
      <div>
        <label class="block">Danh mục:</label>
        <input v-model="form.category" class="border p-2 w-full" type="text" />
      </div>
      <div>
        <label class="flex items-center">
          <input v-model="form.is_active" type="checkbox" class="mr-2" /> Hoạt động
        </label>
      </div>
      <div>
        <label class="block">Ảnh sản phẩm chính:</label>
        <img v-if="form.mainimagePreview" :src="form.mainimagePreview" class="w-32 h-32 object-cover" />
        <input type="file" @change="handleMainImageUpload" accept="image/*" class="mt-2" />
      </div>
      <div>
        <label class="block">Ảnh phụ:</label>
        <div class="flex space-x-2">
          <img v-for="(image, index) in form.imagePreviews" :key="index" :src="image" class="w-20 h-20 object-cover" />
        </div>
        <input type="file" multiple @change="handleAdditionalImagesUpload" accept="image/*" class="mt-2" />
      </div>
      <button :disabled="loading" class="bg-blue-500 text-white px-4 py-2 rounded">
        Cập nhật
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from '#app';
import { useCookie } from 'nuxt/app';
import { useToast } from 'vue-toastification';
const route = useRoute();
const config = useRuntimeConfig();
const token = useCookie("access_token");
const productId = route.params.id;
const product = ref(null);
const form = ref({
  name: '',
  description: '',
  price: '',
  quantity: 0,
  category: '',
  is_active: false,
  mainimage: null,
  mainimagePreview: '',
  images: [],
  imagePreviews: [],
});
const loading = ref(false);
const error = ref(null);
const toast = useToast();
async function fetchProduct() {
  if (!token.value) return;
  loading.value = true;
  try {
    const response = await fetch(`${config.public.apiBase}/catalogue/products/${productId}/`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu');
    product.value = await response.json();
    form.value = { 
      ...product.value, 
      mainimagePreview: product.value.mainimage, 
      imagePreviews: product.value.images.map(img => img.image) 
    };
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function updateProduct() {
  if (!token.value) return;
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('name', form.value.name);
    formData.append('description', form.value.description);
    formData.append('price', form.value.price);
    formData.append('quantity', form.value.quantity);
    formData.append('category', form.value.category);
    formData.append('is_active', form.value.is_active);
    
    if (form.value.mainimage instanceof File) {
      formData.append('mainimage', form.value.mainimage);
    }
    
    const response = await fetch(`${config.public.apiBase}/catalogue/products/${productId}/`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
      body: formData,
    });
    if (!response.ok) throw new Error('Lỗi khi cập nhật sản phẩm');
    product.value = await response.json();
    toast.success('Cập nhật thành công!');
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

function handleMainImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    form.value.mainimage = file;
    form.value.mainimagePreview = URL.createObjectURL(file);
  }
}

function handleAdditionalImagesUpload(event) {
  const files = Array.from(event.target.files);
  form.value.images = files;
  form.value.imagePreviews = files.map(file => URL.createObjectURL(file));
}

onMounted(fetchProduct);
</script>
