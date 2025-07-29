/**
 * 前端主動式提問功能整合演示
 * 展示如何在Vue.js應用中使用主動式提問功能
 */

import ProactiveService from '../services/proactiveService.js'

// 模擬對話歷史
const mockChatHistory = [
  { role: 'user', content: '你好' },
  { role: 'assistant', content: '您好！我是活動推薦助手，很高興為您服務。請問您想找什麼類型的活動呢？' },
  { role: 'user', content: '我想找一些運動活動' },
  { role: 'assistant', content: '好的！運動活動是很好的選擇。請問您偏好什麼類型的運動呢？比如戶外運動、健身、球類運動等？' }
]

// 模擬用戶畫像
const mockUserProfile = {
  visit_count: 3,
  interests: ['運動', '健身', '戶外活動'],
  activity_preferences: {
    preferred_locations: ['台北', '新北'],
    preferred_times: ['週末', '晚上'],
    group_preference: '小團體'
  },
  personality_traits: {
    social_level: 0.7,
    openness: 0.8,
    adventure_seeking: 0.6
  },
  satisfaction_scores: [4, 5, 4],
  last_activity: '2024-01-15T10:30:00Z'
}

// 模擬主動式提問數據
const mockProactiveData = {
  questions: [
    '您想找室內還是戶外的運動活動？',
    '您比較喜歡個人運動還是團體運動？',
    '您有特定的時間偏好嗎？比如週末或平日晚上？'
  ],
  follow_up_suggestions: [
    '瑜伽課程',
    '籃球場租借',
    '登山健行',
    '游泳池開放時間'
  ],
  confidence: 0.85,
  personalization_level: 'high'
}

/**
 * 演示主動式提問功能
 */
export class ProactiveQuestioningDemo {
  
  constructor() {
    this.sessionId = 'demo-session-' + Date.now()
    this.chatHistory = [...mockChatHistory]
    this.userProfile = { ...mockUserProfile }
    this.currentStage = 'exploring'
  }

  /**
   * 演示發送消息並獲取主動式提問
   */
  async demonstrateSendMessage() {
    console.log('=== 演示發送消息並獲取主動式提問 ===')
    
    try {
      const messageData = {
        message: '我想找台北的運動活動',
        session_id: this.sessionId,
        chat_history: this.chatHistory
      }
      
      console.log('發送消息:', messageData.message)
      
      // 模擬API回應（實際使用時會調用真實API）
      const response = {
        message: '我為您找到了台北的運動活動。以下是一些推薦：\n\n1. 台北市立體育館 - 羽毛球場\n2. 大安森林公園 - 慢跑步道\n3. 信義運動中心 - 游泳池',
        proactive_questions: mockProactiveData,
        user_profile_summary: this.userProfile,
        conversation_stage: 'searching',
        session_id: this.sessionId
      }
      
      console.log('收到回應:', response.message)
      console.log('主動式提問:', response.proactive_questions.questions)
      console.log('後續建議:', response.proactive_questions.follow_up_suggestions)
      console.log('信心度:', response.proactive_questions.confidence)
      console.log('個性化等級:', response.proactive_questions.personalization_level)
      
      return response
      
    } catch (error) {
      console.error('發送消息失敗:', error)
      throw error
    }
  }

  /**
   * 演示處理主動式提問點擊
   */
  async demonstrateProactiveQuestionClick() {
    console.log('\n=== 演示主動式提問點擊 ===')
    
    try {
      const question = '您想找室內還是戶外的運動活動？'
      console.log('用戶點擊問題:', question)
      
      // 模擬API回應
      const response = {
        message: '根據您的選擇，我為您推薦一些戶外運動活動：\n\n1. 陽明山國家公園 - 登山步道\n2. 淡水河岸 - 自行車道\n3. 大佳河濱公園 - 戶外健身器材',
        proactive_questions: {
          questions: [
            '您比較喜歡哪個難度等級的登山步道？',
            '您需要租借自行車嗎？'
          ],
          follow_up_suggestions: [
            '查看登山裝備租借',
            '了解自行車租借點',
            '查詢天氣預報'
          ],
          confidence: 0.9,
          personalization_level: 'high'
        },
        conversation_stage: 'recommending',
        session_id: this.sessionId
      }
      
      console.log('收到回應:', response.message)
      console.log('新的主動式提問:', response.proactive_questions.questions)
      
      return response
      
    } catch (error) {
      console.error('處理主動式提問點擊失敗:', error)
      throw error
    }
  }

  /**
   * 演示處理後續建議點擊
   */
  async demonstrateFollowUpSuggestionClick() {
    console.log('\n=== 演示後續建議點擊 ===')
    
    try {
      const suggestion = '瑜伽課程'
      console.log('用戶點擊建議:', suggestion)
      
      // 模擬API回應
      const response = {
        message: '為您找到台北地區的瑜伽課程：\n\n1. 純瑜伽工作室 - 哈達瑜伽\n2. 運動中心 - 初級瑜伽班\n3. 社區活動中心 - 銀髮瑜伽',
        proactive_questions: {
          questions: [
            '您是瑜伽初學者還是有經驗的練習者？',
            '您偏好什麼時間上課？'
          ],
          follow_up_suggestions: [
            '查看課程時間表',
            '了解費用資訊',
            '預約體驗課程'
          ],
          confidence: 0.88,
          personalization_level: 'medium'
        },
        conversation_stage: 'deciding',
        session_id: this.sessionId
      }
      
      console.log('收到回應:', response.message)
      console.log('新的主動式提問:', response.proactive_questions.questions)
      
      return response
      
    } catch (error) {
      console.error('處理後續建議點擊失敗:', error)
      throw error
    }
  }

  /**
   * 演示獲取用戶畫像
   */
  async demonstrateGetUserProfile() {
    console.log('\n=== 演示獲取用戶畫像 ===')
    
    try {
      console.log('獲取用戶畫像 for session:', this.sessionId)
      
      // 模擬API回應
      const profile = {
        ...this.userProfile,
        last_activity: new Date().toISOString()
      }
      
      console.log('用戶畫像:')
      console.log('- 訪問次數:', profile.visit_count)
      console.log('- 興趣:', profile.interests.join(', '))
      console.log('- 偏好地點:', profile.activity_preferences.preferred_locations.join(', '))
      console.log('- 偏好時間:', profile.activity_preferences.preferred_times.join(', '))
      console.log('- 社交偏好:', profile.activity_preferences.group_preference)
      console.log('- 社交程度:', profile.personality_traits.social_level)
      console.log('- 開放程度:', profile.personality_traits.openness)
      console.log('- 冒險精神:', profile.personality_traits.adventure_seeking)
      console.log('- 平均滿意度:', profile.satisfaction_scores.reduce((a, b) => a + b, 0) / profile.satisfaction_scores.length)
      
      return profile
      
    } catch (error) {
      console.error('獲取用戶畫像失敗:', error)
      throw error
    }
  }

  /**
   * 演示分析對話階段
   */
  async demonstrateAnalyzeConversationStage() {
    console.log('\n=== 演示分析對話階段 ===')
    
    try {
      console.log('分析對話歷史...')
      
      // 模擬API回應
      const stageAnalysis = {
        stage: 'searching',
        timestamp: new Date().toISOString()
      }
      
      console.log('當前對話階段:', stageAnalysis.stage)
      console.log('分析時間:', stageAnalysis.timestamp)
      
      const stageDescriptions = {
        'opening': '開場階段 - 初次接觸，建立關係',
        'exploring': '探索階段 - 了解用戶需求和偏好',
        'clarifying': '澄清階段 - 確認具體需求細節',
        'searching': '搜尋階段 - 根據需求搜尋相關活動',
        'recommending': '推薦階段 - 提供個性化推薦',
        'deciding': '決策階段 - 協助用戶做出選擇',
        'closing': '結束階段 - 總結和後續跟進'
      }
      
      console.log('階段說明:', stageDescriptions[stageAnalysis.stage])
      
      return stageAnalysis
      
    } catch (error) {
      console.error('分析對話階段失敗:', error)
      throw error
    }
  }

  /**
   * 運行完整演示
   */
  async runFullDemo() {
    console.log('🚀 開始前端主動式提問功能整合演示\n')
    
    try {
      // 1. 發送消息並獲取主動式提問
      await this.demonstrateSendMessage()
      
      // 2. 處理主動式提問點擊
      await this.demonstrateProactiveQuestionClick()
      
      // 3. 處理後續建議點擊
      await this.demonstrateFollowUpSuggestionClick()
      
      // 4. 獲取用戶畫像
      await this.demonstrateGetUserProfile()
      
      // 5. 分析對話階段
      await this.demonstrateAnalyzeConversationStage()
      
      console.log('\n✅ 演示完成！主動式提問功能已成功整合到前端界面。')
      
    } catch (error) {
      console.error('❌ 演示過程中發生錯誤:', error)
    }
  }
}

/**
 * Vue組件使用示例
 */
export const VueComponentExample = {
  template: `
    <div class="proactive-demo">
      <h3>主動式提問演示</h3>
      
      <!-- 主動式提問組件 -->
      <ProactiveQuestions 
        :proactive-data="proactiveData"
        @question-click="handleQuestionClick"
        @suggestion-click="handleSuggestionClick"
      />
      
      <!-- 用戶畫像組件 -->
      <UserProfile 
        :user-profile="userProfile"
        :conversation-stage="conversationStage"
        @refresh-profile="refreshProfile"
      />
      
      <!-- 演示按鈕 -->
      <div class="demo-controls">
        <el-button @click="runDemo" type="primary">運行演示</el-button>
        <el-button @click="clearDemo" type="default">清除演示</el-button>
      </div>
    </div>
  `,
  
  data() {
    return {
      proactiveData: mockProactiveData,
      userProfile: mockUserProfile,
      conversationStage: 'exploring',
      demo: null
    }
  },
  
  methods: {
    async handleQuestionClick(question) {
      console.log('處理問題點擊:', question)
      // 實際實現中會調用ProactiveService
    },
    
    async handleSuggestionClick(suggestion) {
      console.log('處理建議點擊:', suggestion)
      // 實際實現中會調用ProactiveService
    },
    
    async refreshProfile() {
      console.log('刷新用戶畫像')
      // 實際實現中會調用ProactiveService.getUserProfile
    },
    
    async runDemo() {
      this.demo = new ProactiveQuestioningDemo()
      await this.demo.runFullDemo()
    },
    
    clearDemo() {
      this.proactiveData = { questions: [], follow_up_suggestions: [], confidence: 0 }
      this.userProfile = {}
      this.conversationStage = 'exploring'
    }
  }
}

// 導出演示類
export default ProactiveQuestioningDemo

// 使用示例
if (typeof window !== 'undefined') {
  // 瀏覽器環境下的使用示例
  window.ProactiveQuestioningDemo = ProactiveQuestioningDemo
  
  // 自動運行演示（可選）
  // const demo = new ProactiveQuestioningDemo()
  // demo.runFullDemo()
} 