<template>
  <button @click.prevent="$emit('click')" class="p-2 w-full bg-white hover:bg-teal-200 transition-colors duration-300">
    <div v-if="sidebaropen" class="flex">
        <span class="text-black inline-block text-xs overflow-hidden whitespace-nowrap">
          <slot></slot>
        </span>
        <img src="/images/doublearrowleft.svg" alt="doublearrowleft" class="w-4 h-4 ml-auto" />
      </div>
      <div v-if="!sidebaropen" class="">
        <img src="/images/doublearrowright.svg" alt="doublearrowright" class="w-4 h-4 ml-auto mr-2" />
      </div>
  </button>
</template>

<script setup>
defineProps({ sidebaropen: Boolean });
defineEmits(['click']);
</script>