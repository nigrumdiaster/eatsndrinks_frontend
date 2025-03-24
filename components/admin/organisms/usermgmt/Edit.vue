<template>
  <div class="flex flex-col bg-white p-6 w-full h-full">
    <strong class="text-2xl mb-3">Chỉnh sửa người dùng</strong>
    <div class="space-y-6">
      <LabelInput id="username" v-model="user.username" type="text" disabled>
        <template #label>Tên đăng nhập</template>
      </LabelInput>
      <span class="text-red-500">(*) Chỉ có thể chỉnh sửa các mục bên dưới</span>

      <LabelInput id="first_name" v-model="user.first_name" type="text" placeholder="Họ">
        <template #label>
          <span class="text-teal-600">Họ</span>
        </template>
      </LabelInput>

      <LabelInput id="last_name" v-model="user.last_name" type="text" placeholder="Tên">
        <template #label>
          <span class="text-teal-600">Tên</span>
        </template>
      </LabelInput>

      <LabelInput id="phone_number" v-model="user.phone_number" type="text" placeholder="Số điện thoại">
        <template #label>
          <span class="text-teal-600">Số điện thoại</span>
        </template>
      </LabelInput>

      <LabelInput id="address" v-model="user.address" type="text" placeholder="Địa chỉ">
        <template #label>
          <span class="text-teal-600">Địa chỉ</span>
        </template>
      </LabelInput>

      <LabelInput id="date_of_birth" v-model="user.date_of_birth" type="date">
        <template #label>
          <span class="text-teal-600">Ngày sinh</span>
        </template>
      </LabelInput>

      <div class="flex items-center space-x-2">
        <input id="is_active" v-model="user.is_active" type="checkbox" class="w-5 h-5">
        <label for="is_active" class="text-teal-600">Kích hoạt tài khoản</label>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex justify-end mt-auto space-x-3">
      <button @click="saveChanges"
        class="bg-blue-500 text-white text-lg px-6 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800">
        Lưu thay đổi
      </button>

      <button @click="cancelChanges"
        class="bg-red-500 text-white text-lg px-6 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800">
        Thoát
      </button>
    </div>
  </div>
</template>

<script setup>
import LabelInput from "~/components/admin/molecules/LabelInputBlack.vue";
import { useToast } from "vue-toastification";

const toast = useToast();
const emit = defineEmits(["save", "cancel"]);

const props = defineProps({
  user: Object, // Receive user object from parent
});

const saveChanges = () => {
  emit("save", props.user);
};

const cancelChanges = () => {
  emit("cancel");
};
</script>
