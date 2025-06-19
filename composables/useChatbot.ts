import { useApiFetch } from './useApi'

export interface ChatMessage {
  id?: number
  message_type: 'user' | 'bot' | 'system'
  content: string
  timestamp?: string
  metadata?: any
  recommendations?: ProductRecommendation[]
}

export interface ProductRecommendation {
  id?: number
  product: {
    id: number
    name: string
    price: string
    description: string
    image?: string
  }
  confidence_score: number
  reason: string
  created_at?: string
}

export interface ChatSession {
  id?: number
  session_id: string
  created_at?: string
  updated_at?: string
  is_active: boolean
}

export interface ChatRequest {
  message: string
  session_id?: string
  user_id?: number
}

export interface ChatResponse {
  message: string
  session_id: string
  recommendations: ProductRecommendation[]
  metadata: any
}

export interface ChatbotConfig {
  id: number
  name: string
  model_name: string
  max_tokens: number
  temperature: number
  system_prompt: string
  is_active: boolean
}

export const useChatbot = () => {
  // Send a message to the chatbot
  const sendMessage = async (request: ChatRequest): Promise<ChatResponse> => {
    return await useApiFetch<ChatResponse>('/chatbot/chat/', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  // Get chat history for a session
  const getChatHistory = async (sessionId: string, limit: number = 20): Promise<ChatMessage[]> => {
    return await useApiFetch<ChatMessage[]>(`/chatbot/history/?session_id=${sessionId}&limit=${limit}`)
  }

  // Create a new chat session
  const createSession = async (): Promise<ChatSession> => {
    return await useApiFetch<ChatSession>('/chatbot/session/create/', {
      method: 'POST'
    })
  }

  // Get chatbot configuration
  const getConfig = async (): Promise<ChatbotConfig> => {
    return await useApiFetch<ChatbotConfig>('/chatbot/config/')
  }

  // Get quick recommendations based on keyword
  const getQuickRecommendations = async (keyword: string, limit: number = 5): Promise<ProductRecommendation[]> => {
    return await useApiFetch<ProductRecommendation[]>(`/chatbot/recommendations/?keyword=${encodeURIComponent(keyword)}&limit=${limit}`)
  }

  return {
    sendMessage,
    getChatHistory,
    createSession,
    getConfig,
    getQuickRecommendations
  }
} 