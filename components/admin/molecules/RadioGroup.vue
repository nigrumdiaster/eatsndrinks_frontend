<template>
  <div class="flex flex-col space-y-2 p-2 bg-gray-700 bg-opacity-75 rounded-xl shadow-md">
    <label v-for="item in items" :key="item" class="flex items-center space-x-2 cursor-pointer">
      <input type="radio" :value="item" v-model="selectedValue" class="hidden" @change="handleChange" />
      <div class="w-5 h-5 border-2 rounded-full flex items-center justify-center"
        :class="selectedValue === item ? 'bg-blue-500 border-blue-500' : 'border-white'">
        <div v-if="selectedValue === item" class="w-2.5 h-2.5 bg-white rounded-full"></div>
      </div>
      <span class="text-white">{{ item }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Props: List of radio items and the selected value
const props = defineProps<{
  items: string[];
  modelValue: string;
}>();

// Emit event when selection changes
const emit = defineEmits(['update:modelValue']);

const selectedValue = ref(props.modelValue);

const handleChange = () => {
  emit('update:modelValue', selectedValue.value);
};
</script>
