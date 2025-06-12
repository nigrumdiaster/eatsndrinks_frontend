<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">Thêm địa chỉ mới</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input
            v-model="formData.phone_number"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
          <textarea
            v-model="formData.address"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            rows="3"
            required
          ></textarea>
        </div>

        <div class="flex items-center">
          <input
            v-model="formData.is_default"
            type="checkbox"
            class="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
          />
          <label class="ml-2 text-sm text-gray-700">Đặt làm địa chỉ mặc định</label>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Đang lưu...' : 'Lưu' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'address-added'])

const formData = ref({
  phone_number: '',
  address: '',
  is_default: false
})

const isSubmitting = ref(false)

const token = useCookie("access_token")
const config = useRuntimeConfig()

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    const response = await fetch(`${config.public.apiBase}/users/address-book/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(formData.value),
    })

    if (response.ok) {
      emit('address-added')
      emit('close')
    } else {
      console.error('Failed to add address')
    }
  } catch (error) {
    console.error('Error adding address:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script> 