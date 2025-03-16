<template>
  <component 
    :is="link ? 'router-link' : 'li'" 
    v-bind="link ? { to: link } : {}"
    class="pl-2 rounded-lg py-1 flex items-center mt-1"
    :class="{
      'bg-teal-200 font-bold': isActive,
      'hover:bg-teal-300 hover:font-bold': !isActive
    }"
  >
    <span class="text-black text-sm">{{ labelDD }}</span>
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  link: String,
  labelDD: String
});

const route = useRoute();
const isActive = computed(() => route.path === props.link);
</script>