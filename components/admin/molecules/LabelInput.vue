<template>
    <div>
      <div class="pb-2">
        <Label :id="id">
            <slot name="label"></slot> <!-- Allows passing dynamic label text -->
        </Label>
      </div>
        <Input
            :id="id"
            :type="type"
            :placeholder="placeholder"
            :disabled="disabled"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            :required="required"
      />
    
    </div>
  </template>
  
  <script setup lang="ts">
  import Label from '~/components/admin/atoms/Label/Label.vue';
  import Input from '~/components/admin/atoms/Input/Input.vue';

  const props = defineProps({
    id: {
      type: String,
      required: true,  // Add this if the prop is required
    },
    type: {
      type: String,
      default: 'text',  // Or any other default type
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    modelValue: { // This is needed for v-model support
        type: String,
        default: '',
    },
    required: {
      type: Boolean,
      default: false,
    }
  });
  defineEmits(['update:modelValue']);
</script>

  