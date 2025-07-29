import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import ProactiveService from '../services/proactiveService.js'

export function useChatLogic() {
  // 狀態管理
  const messages = ref([])
  const userInput = ref('')
  const loading = ref(false)
  const currentSessionId = ref(null)
  const messageCount = ref(0)
  const currentUserProfile = ref({})
  const currentConversationStage = ref('exploring')

  // 載入聊天歷史
  const loadChatHistory = async () => {
    try {
      const response = await axios.get('/api/chat/history/latest')
      
      if (response.data && response.data.session_id) {
        currentSessionId.value = response.data.session_id
        messageCount.value = response.data.message_count || 0
        
        // 載入歷史訊息
        if (response.data.messages && response.data.messages.length > 0) {
          messages.value = response.data.messages.map(msg => ({
            type: msg.role === 'user' ? 'user' : 'bot',
            content: msg.content,
            timestamp: new Date(msg.timestamp)
          }))
        } else {
          // 如果沒有歷史訊息，添加歡迎訊息
          addWelcomeMessage()
        }
        
        console.log(`載入 session ${currentSessionId.value}，包含 ${messageCount.value} 個訊息`)
      } else {
        // 沒有現有 session，添加歡迎訊息
        currentSessionId.value = null
        messageCount.value = 0
        addWelcomeMessage()
      }
    } catch (error) {
      console.error('載入聊天歷史失敗:', error)
      // 載入失敗時也添加歡迎訊息
      currentSessionId.value = null
      messageCount.value = 0
      addWelcomeMessage()
    }
  }

  // 添加歡迎訊息
  const addWelcomeMessage = () => {
    messages.value = [{
      type: 'bot',
      content: '您好！我是活動助手，請問有什麼可以幫您的嗎？',
      timestamp: new Date()
    }]
  }

  // 載入整合的用戶畫像
  const loadIntegratedUserProfile = async () => {
    try {
      const response = await axios.get('/api/user-profile-integrated')
      if (response.data && response.data.is_integrated) {
        currentUserProfile.value = response.data
        console.log('載入整合用戶畫像成功:', response.data)
        return response.data
      }
    } catch (error) {
      console.error('載入整合用戶畫像失敗:', error)
    }
    return null
  }

  // 檢查是否需要創建新 session
  const checkSessionLimit = async () => {
    if (messageCount.value >= 20) {
      console.log('達到訊息上限，將創建新 session')
      
      // 在清空前先載入整合的用戶畫像
      const integratedProfile = await loadIntegratedUserProfile()
      
      currentSessionId.value = null
      messageCount.value = 0
      messages.value = []
      
      // 如果有整合畫像，使用它；否則清空
      if (integratedProfile) {
        currentUserProfile.value = integratedProfile
        ElMessage.info(`已達到對話上限，開始新的對話（保留${integratedProfile.session_count}個會話的學習記錄）`)
      } else {
        currentUserProfile.value = {}
        ElMessage.info('已達到對話上限，開始新的對話')
      }
      
      currentConversationStage.value = 'exploring'
      return true
    }
    return false
  }

  // 更新 session 信息
  const updateSessionInfo = (responseData) => {
    if (responseData.session_id) {
      currentSessionId.value = responseData.session_id
    }
    
    messageCount.value += 2  // 用戶訊息 + 助手回覆
    
    console.log(`更新 session 信息: ${currentSessionId.value}, 訊息數: ${messageCount.value}`)
  }

  // 創建機器人消息對象
  const createBotMessage = (response, originalMessage) => {
    const searchParams = response.search_params || {
      sort: '_score',
      asc: false,
      p: 1,
      timeKey: 'start_time'
    }

    return {
      type: 'bot',
      content: response.message,
      timestamp: new Date(),
      originalMessage: originalMessage,
      proactiveQuestions: response.proactive_questions,
      searchState: {
        params: searchParams,
        pagination: response.pagination || {
          current_page: 1,
          events_per_page: 5,
          total_events: 0
        },
        originalSort: searchParams.sort,
        originalAsc: searchParams.asc,
        originalTimeKey: searchParams.timeKey,
        currentSort: 'default'
      }
    }
  }

  // 更新Session和用戶畫像
  const updateSessionAndProfile = (response) => {
    // 更新session信息
    if (response.session_id) {
      currentSessionId.value = response.session_id
    }
    messageCount.value += 2 // 用戶訊息 + 助手回覆
    
    // 更新用戶畫像
    if (response.user_profile_summary) {
      console.log('收到用戶畫像更新:', response.user_profile_summary)
      currentUserProfile.value = {
        ...currentUserProfile.value,
        ...response.user_profile_summary
      }
    }
    
    // 更新對話階段
    if (response.conversation_stage) {
      currentConversationStage.value = response.conversation_stage
    }
    
    console.log(`更新狀態 - Session: ${currentSessionId.value}, 階段: ${currentConversationStage.value}`)
    console.log('當前用戶畫像:', currentUserProfile.value)
  }

  // 發送消息
  const sendMessage = async () => {
    if (!userInput.value.trim()) return
    
    // 檢查是否需要創建新 session
    const needNewSession = await checkSessionLimit()
    
    const userMessage = {
      type: 'user',
      content: userInput.value,
      timestamp: new Date()
    }
    
    messages.value.push(userMessage)
    loading.value = true
    
    try {
      const formattedHistory = messages.value.slice(0, -1).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

      const response = await axios.post('/api/chat', {
        message: userInput.value,
        session_id: currentSessionId.value,
        chat_history: formattedHistory,
        p: 1,
        search_params: null
      })
      
      if (response.data) {
        // 創建機器人消息
        const botMessage = createBotMessage(response.data, userInput.value)
        messages.value.push(botMessage)
        
        // 更新狀態
        updateSessionAndProfile(response.data)
        
        console.log(`當前 session: ${currentSessionId.value}, 訊息數: ${messageCount.value}`)
      }
    } catch (error) {
      console.error('Chat error:', error)
      ElMessage.error(error.response?.data?.detail || '發送訊息失敗，請稍後再試')
    } finally {
      loading.value = false
      userInput.value = ''
    }
  }

  // 處理主動式提問點擊
  const handleProactiveQuestionClick = async (question) => {
    try {
      loading.value = true
      
      // 添加用戶消息
      const userMessage = {
        type: 'user',
        content: question,
        timestamp: new Date(),
        isProactiveResponse: true
      }
      messages.value.push(userMessage)
      
      // 格式化對話歷史
      const formattedHistory = messages.value.slice(0, -1).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
      
      // 發送到後端
      const response = await ProactiveService.handleProactiveQuestionClick(
        question, 
        currentSessionId.value, 
        formattedHistory
      )
      
      if (response) {
        // 處理回應
        const botMessage = createBotMessage(response, question)
        messages.value.push(botMessage)
        
        // 更新狀態
        updateSessionAndProfile(response)
      }
    } catch (error) {
      console.error('處理主動式提問失敗:', error)
      ElMessage.error('處理問題失敗，請稍後再試')
    } finally {
      loading.value = false
    }
  }

  // 處理後續建議點擊
  const handleFollowUpSuggestionClick = async (suggestion) => {
    try {
      loading.value = true
      
      // 添加用戶消息
      const userMessage = {
        type: 'user',
        content: suggestion,
        timestamp: new Date(),
        isFollowUpSuggestion: true
      }
      messages.value.push(userMessage)
      
      // 格式化對話歷史
      const formattedHistory = messages.value.slice(0, -1).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
      
      // 發送到後端
      const response = await ProactiveService.handleFollowUpSuggestionClick(
        suggestion, 
        currentSessionId.value, 
        formattedHistory
      )
      
      if (response) {
        // 處理回應
        const botMessage = createBotMessage(response, suggestion)
        messages.value.push(botMessage)
        
        // 更新狀態
        updateSessionAndProfile(response)
      }
    } catch (error) {
      console.error('處理後續建議失敗:', error)
      ElMessage.error('處理建議失敗，請稍後再試')
    } finally {
      loading.value = false
    }
  }

  // 處理分頁變化
  const handlePageChange = async (page, message) => {
    try {
      // 如果沒有傳入message，需要從當前消息中找到對應的消息
      if (!message) {
        console.error('handlePageChange: message parameter is missing')
        return
      }
      
      const updatedParams = {
        ...message.searchState.params,
        p: page,
        num: message.searchState.pagination.events_per_page
      }
      
      const formattedHistory = messages.value.slice(0, -1).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
      
      const response = await axios.post('/api/chat', {
        message: message.originalMessage,
        session_id: currentSessionId.value,
        chat_history: formattedHistory,
        p: page,
        search_params: updatedParams
      })
      
      if (response.data) {
        message.content = response.data.message
        message.searchState.params = response.data.search_params
        message.searchState.pagination = response.data.pagination
        
        if (response.data.session_id) {
          currentSessionId.value = response.data.session_id
        }
      }
    } catch (error) {
      console.error('Error updating page:', error)
      ElMessage.error('更新分頁失敗，請稍後再試')
    }
  }

  // 處理排序變化
  const handleSortChange = async (sortValue, message) => {
    try {
      // 如果沒有傳入message，需要從當前消息中找到對應的消息
      if (!message) {
        console.error('handleSortChange: message parameter is missing')
        return
      }
      
      // 使用後端傳回的完整搜索參數
      const updatedParams = {
        ...message.searchState.params,
        p: message.searchState.params.p || 1,
        num: message.searchState.pagination.events_per_page
      }

      switch (sortValue) {
        case 'default':
          updatedParams.sort = message.searchState.originalSort
          updatedParams.asc = message.searchState.originalAsc
          updatedParams.timeKey = message.searchState.originalTimeKey
          break
        case '_score':
          updatedParams.sort = '_score'
          updatedParams.asc = false
          updatedParams.timeKey = 'start_time'
          break
        case 'start_time':
          updatedParams.sort = 'start_time'
          updatedParams.asc = true
          updatedParams.timeKey = 'start_time'
          break
        case 'end_time':
          updatedParams.sort = 'end_time'
          updatedParams.asc = true
          updatedParams.timeKey = 'end_time'
          break
        case 'updated_time':
          updatedParams.sort = 'updated_time'
          updatedParams.asc = false
          updatedParams.timeKey = 'start_time'
          break
        case 'distance':
          updatedParams.sort = 'distance'
          updatedParams.asc = true
          updatedParams.timeKey = 'start_time'
          break
      }
      
      const formattedHistory = messages.value.slice(0, -1).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
      
      const response = await axios.post('/api/chat', {
        message: message.originalMessage,
        session_id: currentSessionId.value,
        chat_history: formattedHistory,
        p: updatedParams.p,
        search_params: updatedParams
      })
      
      if (response.data) {
        message.content = response.data.message
        message.searchState.params = response.data.search_params
        message.searchState.pagination = response.data.pagination
        
        if (response.data.session_id) {
          currentSessionId.value = response.data.session_id
        }
      }
    } catch (error) {
      console.error('Error updating sort:', error)
      ElMessage.error('更新排序失敗，請稍後再試')
    }
  }

  // 使用快速查詢
  const useQuickQuery = (query) => {
    userInput.value = query
    sendMessage()
  }

  // 刷新用戶畫像
  const refreshUserProfile = async () => {
    try {
      if (currentSessionId.value) {
        const profile = await ProactiveService.getUserProfile(currentSessionId.value)
        if (profile) {
          currentUserProfile.value = profile
          ElMessage.success('用戶畫像已更新')
        }
      }
    } catch (error) {
      console.error('刷新用戶畫像失敗:', error)
      ElMessage.error('刷新用戶畫像失敗')
    }
  }

  // 初始化
  onMounted(async () => {
    await loadChatHistory()
  })

  return {
    // 狀態
    messages,
    userInput,
    loading,
    currentSessionId,
    messageCount,
    currentUserProfile,
    currentConversationStage,
    
    // 方法
    sendMessage,
    handleProactiveQuestionClick,
    handleFollowUpSuggestionClick,
    handlePageChange,
    handleSortChange,
    useQuickQuery,
    refreshUserProfile
  }
} 