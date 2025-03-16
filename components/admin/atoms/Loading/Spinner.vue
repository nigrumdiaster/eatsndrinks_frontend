<template>
    <div class="flex items-center justify-center">
      <div class="w-16 h-16 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin"></div>
    </div>
</template>
   
<style scoped>
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
</style>
  