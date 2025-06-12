<template>
  <div class="p-4 max-w-7xl mx-auto"> 
    <div class="flex justify-between mb-4">
      <h2 class="text-2xl font-bold">Sổ địa chỉ</h2>
      <button @click="openAddModal" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
        <i class="fas fa-plus mr-2"></i>Thêm địa chỉ mới
      </button>
    </div>
    <div v-if="addresses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="address in addresses" :key="address.id" class="transition-transform duration-200 hover:transform hover:-translate-y-1">
        <div class="p-4 bg-white rounded-lg shadow-md border border-gray-200">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">Địa chỉ #{{ address.id }}</h3>
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
            <button @click="openEditModal(address)" class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              Sửa
            </button>
            <button @click="handleDeleteAddress(address.id)" class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
              Xóa
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
    </div>

    <!-- Edit Address Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Chỉnh sửa địa chỉ</h3>
          <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="handleEditSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input
              v-model="editForm.address"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              v-model="editForm.phone_number"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div class="flex items-center">
            <input
              v-model="editForm.is_default"
              type="checkbox"
              class="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label class="ml-2 text-sm text-gray-700">Đặt làm địa chỉ mặc định</label>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Address Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Thêm địa chỉ mới</h3>
          <button @click="closeAddModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="handleAddSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input
              v-model="addForm.address"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              v-model="addForm.phone_number"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div class="flex items-center">
            <input
              v-model="addForm.is_default"
              type="checkbox"
              class="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label class="ml-2 text-sm text-gray-700">Đặt làm địa chỉ mặc định</label>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeAddModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Thêm địa chỉ
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

interface Address {
  id: number
  user: number
  phone_number: string
  address: string
  is_default: boolean
}

const addresses = ref<Address[]>([])
const showEditModal = ref(false)
const showAddModal = ref(false)

const editForm = ref<Partial<Address>>({
  address: '',
  phone_number: '',
  is_default: false,
})

const addForm = ref<Partial<Address>>({
  address: '',
  phone_number: '',
  is_default: false,
})

const editingAddressId = ref<number | null>(null)
const token = useCookie("access_token");
const config = useRuntimeConfig();

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
    toast.error('Không thể tải danh sách địa chỉ')
  }
}

const openEditModal = (address: Address) => {
  editForm.value = {
    address: address.address,
    phone_number: address.phone_number,
    is_default: address.is_default,
  }
  editingAddressId.value = address.id
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {
    address: '',
    phone_number: '',
    is_default: false,
  }
  editingAddressId.value = null
}

const handleEditSubmit = async () => {
  if (!editingAddressId.value) return

  try {
    const response = await fetch(`${config.public.apiBase}/users/address-book/${editingAddressId.value}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(editForm.value),
    })

    if (response.ok) {
      const updatedAddress = await response.json()
      addresses.value = addresses.value.map(addr => 
        addr.id === editingAddressId.value ? updatedAddress : addr
      )
      toast.success('Cập nhật địa chỉ thành công')
      closeEditModal()
    } else {
      throw new Error('Failed to update address')
    }
  } catch (error) {
    console.error('Error updating address:', error)
    toast.error('Không thể cập nhật địa chỉ')
  }
}

const handleDeleteAddress = async (id: number) => {
  const toastId = toast.warning(
    {
      component: h('div', { class: 'flex flex-col gap-2' }, [
        h('p', { class: 'text-sm' }, 'Bạn có chắc chắn muốn xóa địa chỉ này?'),
        h('div', { class: 'flex justify-end gap-2 mt-2' }, [
          h('button', {
            class: 'px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600',
            onClick: () => toast.dismiss(toastId)
          }, 'Hủy'),
          h('button', {
            class: 'px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700',
            onClick: async () => {
              toast.dismiss(toastId)
              try {
                const response = await fetch(`${config.public.apiBase}/users/address-book/${id}/`, {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${token.value}`,
                  },
                })

                if (response.ok) {
                  addresses.value = addresses.value.filter(address => address.id !== id)
                  toast.success('Xóa địa chỉ thành công')
                } else {
                  throw new Error('Failed to delete address')
                }
              } catch (error) {
                console.error('Error deleting address:', error)
                toast.error('Không thể xóa địa chỉ')
              }
            }
          }, 'Xóa')
        ])
      ])
    },
    {
      timeout: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false
    }
  )
}

const openAddModal = () => {
  addForm.value = {
    address: '',
    phone_number: '',
    is_default: false,
  }
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
  addForm.value = {
    address: '',
    phone_number: '',
    is_default: false,
  }
}

const handleAddSubmit = async () => {
  try {
    const response = await fetch(`${config.public.apiBase}/users/address-book/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(addForm.value),
    })

    if (response.ok) {
      const newAddress = await response.json()
      addresses.value.push(newAddress)
      toast.success('Thêm địa chỉ thành công')
      closeAddModal()
    } else {
      throw new Error('Failed to add address')
    }
  } catch (error) {
    console.error('Error adding address:', error)
    toast.error('Không thể thêm địa chỉ')
  }
}

const handleAddAddress = () => {
  openAddModal()
}

onMounted(() => {
  fetchAddresses()
})
</script>

<style scoped>
.address-book {
  padding: 1rem;
  max-width: 80rem;
  margin: 0 auto;
}

.address-card {
  transition: transform 0.2s;
}

.address-card:hover {
  transform: translateY(-0.25rem);
}
</style>
