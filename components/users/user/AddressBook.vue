<template>
  <div class="p-4 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Sổ địa chỉ</h2>
      <button @click="openAddModal" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
        <i class="fas fa-plus mr-2"></i>Thêm địa chỉ mới
      </button>
    </div>

    <div v-if="addresses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="address in addresses" :key="address.id" class="transition-transform duration-200 hover:transform hover:-translate-y-1">
        <div class="p-4 bg-white rounded-lg shadow-md border border-gray-200">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">Địa chỉ</h3>
            <span v-if="address.is_default" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Mặc định
            </span>
          </div>
          <div class="space-y-2">
            <p class="text-gray-600">
              <i class="fas fa-map-marker-alt mr-2"></i>
              {{ address.address }}
            </p>
            <p class="text-gray-600">
              <i class="fas fa-phone mr-2"></i>
              {{ address.phone_number }}
            </p>
          </div>
          <div class="mt-4 flex justify-end space-x-2">
            <button class="text-blue-600 hover:text-blue-800">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteAddress(address.id)" class="text-red-600 hover:text-red-800">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-8">
      <div class="text-gray-500 mb-2">
        <i class="fas fa-map-marker-alt text-4xl"></i>
      </div>
      <p class="text-gray-600 text-lg">Bạn chưa có địa chỉ nào</p>
      <button @click="openAddModal" class="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
        <i class="fas fa-plus mr-2"></i>Thêm địa chỉ mới
      </button>
    </div>

    <!-- Add Address Modal -->
    <AddAddressModal v-if="showAddModal" @close="showAddModal = false" @address-added="fetchAddresses" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

interface Address {
  id: number
  user: number
  phone_number: string
  address: string
  is_default: boolean
}

const addresses = ref<Address[]>([])
const token = useCookie("access_token");
const config = useRuntimeConfig();
const showAddModal = ref(false)

const fetchAddresses = async () => {
  try {
    const response = await fetch(`${config.public.apiBase}/users/address-book/`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    addresses.value = await response.json()
  } catch (error) {
    console.error('Error fetching addresses:', error)
  }
}

const deleteAddress = async (id: number) => {
  if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return

  try {
    const response = await fetch(`${config.public.apiBase}/users/address-book/${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    if (response.ok) {
      addresses.value = addresses.value.filter(addr => addr.id !== id)
    }
  } catch (error) {
    console.error('Error deleting address:', error)
  }
}

const openAddModal = () => {
  showAddModal.value = true
}

onMounted(() => {
  fetchAddresses()
})
</script>
