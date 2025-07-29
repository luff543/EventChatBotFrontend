import axios from 'axios'

/**
 * 主動式提問服務
 * 處理與主動式提問相關的API調用
 */
export class ProactiveService {
  
  /**
   * 發送消息並獲取主動式提問回應
   */
  static async sendMessageWithProactiveQuestions(messageData) {
    try {
      const response = await axios.post('/api/chat', messageData)
      return response.data
    } catch (error) {
      console.error('發送消息失敗:', error)
      throw error
    }
  }

  /**
   * 獲取用戶畫像信息
   */
  static async getUserProfile(sessionId) {
    try {
      const response = await axios.get(`/api/user-profile/${sessionId}`)
      return response.data
    } catch (error) {
      console.error('獲取用戶畫像失敗:', error)
      return null
    }
  }

  /**
   * 分析對話階段
   */
  static async analyzeConversationStage(chatHistory) {
    try {
      const response = await axios.post('/api/conversation-stage', {
        chat_history: chatHistory
      })
      return response.data.stage
    } catch (error) {
      console.error('分析對話階段失敗:', error)
      return 'exploring'
    }
  }

  /**
   * 處理主動式提問的點擊回應
   */
  static async handleProactiveQuestionClick(questionText, sessionId, chatHistory) {
    try {
      const response = await axios.post('/api/chat', {
        message: questionText,
        session_id: sessionId,
        chat_history: chatHistory,
        is_proactive_response: true
      })
      return response.data
    } catch (error) {
      console.error('處理主動式提問點擊失敗:', error)
      throw error
    }
  }

  /**
   * 處理後續建議的點擊
   */
  static async handleFollowUpSuggestionClick(suggestion, sessionId, chatHistory) {
    try {
      const response = await axios.post('/api/chat', {
        message: suggestion,
        session_id: sessionId,
        chat_history: chatHistory,
        is_follow_up_suggestion: true
      })
      return response.data
    } catch (error) {
      console.error('處理後續建議點擊失敗:', error)
      throw error
    }
  }
}

export default ProactiveService 