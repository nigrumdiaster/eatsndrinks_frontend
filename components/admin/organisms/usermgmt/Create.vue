<template>
  <div class="flex flex-col bg-white p-6 w-full h-full">
    <strong class="text-2xl mb-3">Thêm người dùng</strong>
    <div class="space-y-6">
      <LabelInput id="username" v-model="form.username" type="text" placeholder="Tên đăng nhập">
        <template #label>Tên đăng nhập</template>
      </LabelInput>

      <LabelInput id="password" v-model="form.password" type="password" placeholder="Mật khẩu">
        <template #label>Mật khẩu</template>
      </LabelInput>

      <LabelInput id="last_name" v-model="form.last_name" type="text" placeholder="Họ">
        <template #label>Họ</template>
      </LabelInput>


      <LabelInput id="firt_name" v-model="form.first_name" type="text" placeholder="Tên">
        <template #label>Tên</template>
      </LabelInput>

      <!-- Nút hành động -->
      <div class="flex justify-end space-x-5">
        <button @click="createUser"
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
import { ref } from 'vue';
import LabelInput from '~/components/admin/molecules/LabelInputBlack.vue';
import { useToast } from 'vue-toastification';
import { useRouter } from '#app';

const toast = useToast();
const router = useRouter();

// Define form data
const form = ref({
  username: '',
  password: '',
  first_name: '',
  last_name: ''
});

const emit = defineEmits(['createUser']);

const createUser = () => {
  console.log("Button clicked! Submitting form...");
  console.log("Form Data:", form.value);
  emit('createUser', form.value);
};


const cancelCreate = () => {
  console.log("Thoát");

  toast.warning(h("div", [
    "Bạn có chắc chắn muốn thoát không? Dữ liệu chưa lưu sẽ bị mất.",
    h("button", {
      onClick: () => {
        toast.clear(); // Xóa thông báo
        router.push('/user_management'); // Điều hướng sau khi xác nhận
      },
      class: "ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
    }, "Thoát")
  ]), {
    timeout: 10000,
    closeOnClick: false,
  });
}
</script>
