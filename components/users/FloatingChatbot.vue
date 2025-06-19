<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Floating Chat Button -->
    <button
      @click="toggleChat"
      class="w-14 h-14 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      :class="{ 'bg-red-500 hover:bg-red-600': isChatOpen }"
    >
      <svg v-if="!isChatOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
      
      <!-- Notification Badge -->
      <div v-if="hasNotifications" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
        <span class="text-xs text-white font-bold">{{ unreadCount }}</span>
      </div>
    </button>

    <!-- Chat Window -->
    <div
      v-if="isChatOpen"
      class="absolute bottom-20 right-0 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
    >
      <ChatbotComponent :fullPage="false" />
    </div>

    <!-- Tooltip -->
    <div
      v-if="!isChatOpen"
      class="absolute bottom-16 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      Chat với trợ lý AI
      <div class="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useChatbotStore } from '~/stores/chatbot'
import ChatbotComponent from '~/components/users/Chatbot.vue'

const chatbotStore = useChatbotStore()

const isChatOpen = computed(() => chatbotStore.isChatbotOpen)
const hasNotifications = computed(() => chatbotStore.hasNotifications)
const unreadCount = computed(() => chatbotStore.unreadCount)

const toggleChat = () => {
  chatbotStore.toggleChatbot()
}

// Listen for storage events (when new messages arrive from other tabs)
const handleStorageChange = (e: StorageEvent) => {
  if (e.key === 'chatbot_unread_messages' || e.key === 'chatbot_last_message_time') {
    chatbotStore.loadFromStorage()
  }
}

onMounted(() => {
  chatbotStore.loadFromStorage()
  window.addEventListener('storage', handleStorageChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
})
</script>

<style scoped>
/* Custom animations */
.group:hover .opacity-0 {
  opacity: 1;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style> 