import { defineStore } from 'pinia'

export interface ChatbotState {
  isOpen: boolean
  hasUnreadMessages: boolean
  unreadCount: number
  currentSessionId: string | null
  lastMessageTime: string | null
}

export const useChatbotStore = defineStore('chatbot', {
  state: (): ChatbotState => ({
    isOpen: false,
    hasUnreadMessages: false,
    unreadCount: 0,
    currentSessionId: null,
    lastMessageTime: null
  }),

  getters: {
    isChatbotOpen: (state) => state.isOpen,
    hasNotifications: (state) => state.hasUnreadMessages && state.unreadCount > 0
  },

  actions: {
    openChatbot() {
      this.isOpen = true
      this.clearUnreadMessages()
    },

    closeChatbot() {
      this.isOpen = false
    },

    toggleChatbot() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.clearUnreadMessages()
      }
    },

    setSessionId(sessionId: string) {
      this.currentSessionId = sessionId
    },

    addUnreadMessage() {
      this.hasUnreadMessages = true
      this.unreadCount++
      this.lastMessageTime = new Date().toISOString()
      
      // Store in localStorage for persistence across tabs
      localStorage.setItem('chatbot_unread_messages', this.unreadCount.toString())
      localStorage.setItem('chatbot_last_message_time', this.lastMessageTime)
    },

    clearUnreadMessages() {
      this.hasUnreadMessages = false
      this.unreadCount = 0
      localStorage.removeItem('chatbot_unread_messages')
    },

    loadFromStorage() {
      const unread = localStorage.getItem('chatbot_unread_messages')
      const lastMessageTime = localStorage.getItem('chatbot_last_message_time')
      
      if (unread) {
        this.hasUnreadMessages = true
        this.unreadCount = parseInt(unread) || 0
      }
      
      if (lastMessageTime) {
        this.lastMessageTime = lastMessageTime
      }
    },

    reset() {
      this.isOpen = false
      this.hasUnreadMessages = false
      this.unreadCount = 0
      this.currentSessionId = null
      this.lastMessageTime = null
      localStorage.removeItem('chatbot_unread_messages')
      localStorage.removeItem('chatbot_last_message_time')
    }
  }
}) 