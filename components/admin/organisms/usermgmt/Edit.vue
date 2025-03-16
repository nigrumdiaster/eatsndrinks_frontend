<template>
  <div class="flex flex-col bg-white p-6 w-full h-full">
    <strong class="text-2xl mb-3">Chỉnh sửa người dùng</strong>
    <div class="space-y-6">
      <LabelInput id="username" v-model="user.username" type="text" disabled>
        <template #label>Tên đăng nhập</template>
      </LabelInput>
      <span class="text-red-500">(*) Chỉ có thể chỉnh sửa các mục bên dưới</span>
      <LabelInput id="fullname" v-model="user.fullname" type="text" placeholder="Họ và tên">
        <template #label>
          <span class="text-teal-600">Họ và tên</span>
        </template>
      </LabelInput>

      <LabelInput id="email" v-model="user.email" type="email" placeholder="Email">
        <template #label>
          <span class="text-teal-600">Email</span>
        </template>
      </LabelInput>
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
