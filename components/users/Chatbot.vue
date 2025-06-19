<template>
  <div :class="['flex flex-col bg-white rounded-lg shadow-lg', fullPage ? 'full-chatbot' : 'h-full']">
    <!-- Chat Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Eats & Drinks Assistant</h3>
          <p class="text-sm text-gray-500">Hỏi tôi về món ăn và đồ uống</p>
        </div>
      </div>
      <button 
        @click="clearChat" 
        class="text-gray-400 hover:text-gray-600 transition-colors"
        title="Xóa lịch sử chat"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    </div>

    <!-- Chat Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4" style="max-height: 800px;" ref="messagesContainer">
      <div v-if="messages.length === 0" class="h-full flex items-center justify-center">
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Chào mừng bạn!</h3>
          <p class="text-gray-500 mb-4">Tôi có thể giúp bạn tìm món ăn và đồ uống phù hợp</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <button 
              v-for="suggestion in quickSuggestions" 
              :key="suggestion"
              @click="sendQuickMessage(suggestion)"
              class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200 transition-colors"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="message in messages" 
          :key="message.id || message.timestamp"
          :class="[
            'flex',
            message.message_type === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div :class="[
            'max-w-xs',
            'lg:max-w-md',
            message.message_type === 'user'
              ? 'bg-yellow-500 text-white rounded-lg rounded-br-none px-4 py-2'
              : 'bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2'
          ]">
            <div class="text-sm leading-relaxed" v-html="formatMessage(message.content)"></div>
            
            <!-- Product Recommendations -->
            <div v-if="message.recommendations && message.recommendations.length > 0" class="mt-3 pt-3 border-t border-gray-200">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Đề xuất sản phẩm:</h4>
              <div class="grid grid-cols-1 gap-3">
                <div 
                  v-for="rec in message.recommendations" 
                  :key="rec.id"
                  class="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                      <img 
                        v-if="getProduct(rec).mainimage || getProduct(rec).image" 
                        :src="getImageUrl(getProduct(rec).mainimage || getProduct(rec).image)" 
                        :alt="getProduct(rec).name || 'product'"
                        class="w-full h-full object-cover rounded-lg"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <NuxtLink
                        :to="`/product/${getProduct(rec).id}`"
                        class="text-sm font-medium text-yellow-600 hover:underline truncate block"
                      >
                        {{ getProduct(rec).name || 'Sản phẩm' }}
                      </NuxtLink>
                      <p class="text-xs text-gray-500 truncate">{{ getProduct(rec).description || '' }}</p>
                      <div class="flex items-center justify-between mt-1">
                        <span class="text-sm font-medium text-green-600">{{ formatPrice(getProduct(rec).price) }}</span>
                      </div>
                    </div>
                    <button 
                      @click="addToCart(rec)"
                      class="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-colors"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="max-w-xs lg:max-w-md bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1">
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s;"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></span>
              </div>
              <span class="text-sm text-gray-500">Đang nhập...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center gap-2">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          @keyup.esc="clearInput"
          type="text"
          placeholder="Nhập tin nhắn của bạn..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :disabled="isLoading"
        />
        <button 
          @click="sendMessage"
          :disabled="!inputMessage.trim() || isLoading"
          class="w-10 h-10 bg-yellow-500 text-white rounded-lg flex items-center justify-center hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
          <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useChatbot, type ChatMessage, type ChatRequest } from '~/composables/useChatbot'
import { useCartStore } from '~/stores/cart'
import { useChatbotStore } from '~/stores/chatbot'
import { useRuntimeConfig } from '#app'
import { defineProps } from 'vue'

const props = defineProps({
  fullPage: {
    type: Boolean,
    default: false
  }
})

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const { sendMessage: sendChatMessage, createSession, getChatHistory } = useChatbot()
const cartStore = useCartStore()
const chatbotStore = useChatbotStore()

// Reactive data
const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')
const isLoading = ref(false)
const sessionId = ref('')
const messagesContainer = ref<HTMLElement>()

// Quick suggestions
const quickSuggestions = [
  'Tôi muốn tìm đồ uống',
  'Có món ăn nào ngon không?',
  'Sản phẩm đang flash sale',
  'Tìm đồ uống giải khát',
  'Món ăn phù hợp cho bữa tối'
]

// Initialize chat session
onMounted(async () => {
  try {
    let storedSessionId = localStorage.getItem('chatbot_session_id')
    if (storedSessionId) {
      sessionId.value = storedSessionId
      chatbotStore.setSessionId(storedSessionId)
      // Load chat history
      const history = await getChatHistory(sessionId.value)
      messages.value = history.reverse()
      nextTick(() => {
        scrollToBottom()
      })
    } else {
      const session = await createSession()
      sessionId.value = session.session_id
      chatbotStore.setSessionId(session.session_id)
      localStorage.setItem('chatbot_session_id', session.session_id)
      // Load chat history
      const history = await getChatHistory(sessionId.value)
      messages.value = history.reverse()
      nextTick(() => {
        scrollToBottom()
      })
    }
  } catch (error) {
    console.error('Failed to initialize chat:', error)
  }
})

// Methods
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage = inputMessage.value.trim()
  inputMessage.value = ''
  
  // Add user message to chat
  const userMsg: ChatMessage = {
    message_type: 'user',
    content: userMessage,
    timestamp: new Date().toISOString()
  }
  messages.value.push(userMsg)
  nextTick(() => {
    scrollToBottom()
  })
  
  isLoading.value = true
  
  try {
    const request: ChatRequest = {
      message: userMessage,
      session_id: sessionId.value
    }
    
    const response = await sendChatMessage(request)
    
    // Add bot response to chat
    const botMsg: ChatMessage = {
      message_type: 'bot',
      content: response.message,
      timestamp: new Date().toISOString(),
      recommendations: response.recommendations
    }
    messages.value.push(botMsg)
    nextTick(() => {
      scrollToBottom()
    })
    
    // Add notification if chatbot is not open
    try {
      if (!chatbotStore.isChatbotOpen) {
        chatbotStore.addUnreadMessage()
      }
    } catch (storeError) {
      console.error('Store error:', storeError)
    }
    
  } catch (error) {
    console.error('Failed to send message:', error)
    
    // Add error message
    const errorMsg: ChatMessage = {
      message_type: 'bot',
      content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
      timestamp: new Date().toISOString()
    }
    messages.value.push(errorMsg)
    nextTick(() => {
      scrollToBottom()
    })
  } finally {
    isLoading.value = false
  }
}

const sendQuickMessage = (suggestion: string) => {
  inputMessage.value = suggestion
  sendMessage()
}

const clearChat = () => {
  messages.value = []
  nextTick(() => {
    scrollToBottom()
  })
  createSession().then(session => {
    sessionId.value = session.session_id
    chatbotStore.setSessionId(session.session_id)
    localStorage.setItem('chatbot_session_id', session.session_id)
  })
}

const clearInput = () => {
  inputMessage.value = ''
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatMessage = (content: string) => {
  // Convert line breaks to <br> tags
  return content.replace(/\n/g, '<br>')
}

const formatPrice = (price: string) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(parseFloat(price))
}

const getProduct = (rec: any) => rec.product || rec

const addToCart = (product: any) => {
  // Truyền cả id và quantity (nếu store hỗ trợ)
  cartStore.addToCart(getProduct(product).id, 1)
}

// Hàm lấy URL ảnh đầy đủ
const getImageUrl = (img: string) => {
  if (!img) return ''
  if (img.startsWith('http')) return img
  return apiBase + img
}
</script>

<style scoped>
.full-chatbot {
  height: 70vh;
  max-height: none;
}
</style> 