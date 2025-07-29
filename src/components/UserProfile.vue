<template>
  <div class="user-profile-content">
    <!-- 基本信息 -->
    <div class="profile-section">
      <div class="section-title">
        <span class="title-icon">ℹ️</span>
        基本信息
      </div>
      <div class="basic-info">
        <div class="info-item">
          <span class="info-label">用戶類型:</span>
          <span class="info-value">
            {{ userProfile?.visit_count <= 1 ? '新用戶' : '回訪用戶' }}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">訪問次數:</span>
          <span class="info-value">{{ userProfile?.visit_count || 1 }}</span>
        </div>
        <div v-if="userProfile?.last_activity" class="info-item">
          <span class="info-label">最後活動:</span>
          <span class="info-value">{{ formatTime(userProfile.last_activity) }}</span>
        </div>
      </div>
    </div>

    <!-- 興趣偏好 -->
    <div v-if="userProfile?.interests && userProfile.interests.length > 0" class="profile-section">
      <div class="section-title">
        <span class="title-icon">⭐</span>
        興趣偏好
      </div>
      <div class="interests-list">
        <el-tag 
          v-for="(interest, index) in userProfile.interests" 
          :key="index"
          type="success"
          size="small"
          class="interest-tag"
          :title="`信心度: ${getInterestConfidence(interest)} | 來源: ${getInterestSource(interest)}`"
        >
          {{ getInterestName(interest) }}
        </el-tag>
      </div>
    </div>

    <!-- 活動偏好 -->
    <div v-if="userProfile?.activity_preferences" class="profile-section">
      <div class="section-title">
        <span class="title-icon">⚙️</span>
        活動偏好
      </div>
      <div class="preferences-list">
        <div v-if="userProfile.activity_preferences.preferred_locations?.length > 0" class="preference-item">
          <span class="preference-label">偏好地點:</span>
          <div class="preference-tags">
            <el-tag 
              v-for="location in formatPreferenceData(userProfile.activity_preferences.preferred_locations).slice(0, 3)" 
              :key="location"
              size="small"
              class="preference-tag"
            >
              {{ location }}
            </el-tag>
          </div>
        </div>
        
        <div v-if="userProfile.activity_preferences.preferred_times?.length > 0" class="preference-item">
          <span class="preference-label">偏好時間:</span>
          <div class="preference-tags">
            <el-tag 
              v-for="time in formatPreferenceData(userProfile.activity_preferences.preferred_times).slice(0, 3)" 
              :key="time"
              size="small"
              class="preference-tag"
            >
              {{ time }}
            </el-tag>
          </div>
        </div>

        <div v-if="userProfile.activity_preferences.group_preference" class="preference-item">
          <span class="preference-label">社交偏好:</span>
          <span class="preference-value">{{ formatGroupPreference(userProfile.activity_preferences.group_preference) }}</span>
        </div>
      </div>
    </div>

    <!-- 個性特徵 -->
    <div v-if="userProfile?.personality_traits" class="profile-section">
      <div class="section-title">
        <span class="title-icon">☀️</span>
        個性特徵
      </div>
      <div class="traits-list">
        <div v-if="userProfile.personality_traits.social_level !== undefined" class="trait-item">
          <span class="trait-name">社交程度:</span>
          <el-progress 
            :percentage="Math.round(userProfile.personality_traits.social_level * 100)"
            :stroke-width="6"
            :show-text="false"
            class="trait-progress"
          />
          <span class="trait-value">{{ getTraitLevel(userProfile.personality_traits.social_level) }}</span>
        </div>
        
        <div v-if="userProfile.personality_traits.openness !== undefined" class="trait-item">
          <span class="trait-name">開放程度:</span>
          <el-progress 
            :percentage="Math.round(userProfile.personality_traits.openness * 100)"
            :stroke-width="6"
            :show-text="false"
            class="trait-progress"
          />
          <span class="trait-value">{{ getTraitLevel(userProfile.personality_traits.openness) }}</span>
        </div>

        <div v-if="userProfile.personality_traits.adventure_seeking !== undefined" class="trait-item">
          <span class="trait-name">冒險精神:</span>
          <el-progress 
            :percentage="Math.round(userProfile.personality_traits.adventure_seeking * 100)"
            :stroke-width="6"
            :show-text="false"
            class="trait-progress"
          />
          <span class="trait-value">{{ getTraitLevel(userProfile.personality_traits.adventure_seeking) }}</span>
        </div>
      </div>
    </div>

    <!-- 滿意度 -->
    <div v-if="userProfile?.satisfaction_scores && userProfile.satisfaction_scores.length > 0" class="profile-section">
      <div class="section-title">
        <span class="title-icon">🏆</span>
        滿意度
      </div>
      <div class="satisfaction-info">
        <div class="satisfaction-score">
          <span class="score-label">平均評分:</span>
          <el-rate 
            :model-value="getAverageSatisfaction()" 
            disabled 
            show-score 
            text-color="#ff9900"
            score-template="{value}"
          />
        </div>
        <div class="satisfaction-trend">
          <span class="trend-label">最近評分:</span>
          <div class="recent-scores">
            <el-tag 
              v-for="(score, index) in userProfile.satisfaction_scores.slice(-3)" 
              :key="index"
              :type="getScoreTagType(score)"
              size="small"
            >
              {{ score }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 刷新按鈕 -->
    <div class="profile-actions">
      <el-button 
        size="small" 
        @click="refreshProfile"
        :loading="refreshing"
      >
        🔄 刷新畫像
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  userProfile: {
    type: Object,
    default: () => ({})
  },
  conversationStage: {
    type: String,
    default: 'exploring'
  }
})

const emit = defineEmits(['refresh-profile'])

const refreshing = ref(false)

// 刷新用戶畫像
const refreshProfile = async () => {
  refreshing.value = true
  try {
    emit('refresh-profile')
  } finally {
    refreshing.value = false
  }
}

// 格式化時間
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

// 獲取對話階段標籤類型
const getStageTagType = (stage) => {
  const stageTypes = {
    'opening': 'info',
    'exploring': 'primary',
    'clarifying': 'warning',
    'searching': 'success',
    'recommending': 'success',
    'deciding': 'warning',
    'closing': 'info'
  }
  return stageTypes[stage] || 'info'
}

// 獲取對話階段顯示名稱
const getStageDisplayName = (stage) => {
  const stageNames = {
    'opening': '開場',
    'exploring': '探索',
    'clarifying': '澄清',
    'searching': '搜尋',
    'recommending': '推薦',
    'deciding': '決策',
    'closing': '結束'
  }
  return stageNames[stage] || stage
}

// 獲取特徵等級文字
const getTraitLevel = (value) => {
  if (value >= 0.8) return '很高'
  if (value >= 0.6) return '高'
  if (value >= 0.4) return '中等'
  if (value >= 0.2) return '低'
  return '很低'
}

// 計算平均滿意度
const getAverageSatisfaction = () => {
  const scores = props.userProfile?.satisfaction_scores || []
  if (scores.length === 0) return 0
  const sum = scores.reduce((acc, score) => acc + score, 0)
  return Math.round((sum / scores.length) * 10) / 10
}

// 獲取評分標籤類型
const getScoreTagType = (score) => {
  if (score >= 4) return 'success'
  if (score >= 3) return 'warning'
  return 'danger'
}

// 獲取興趣名稱 - 優化JSON處理
const getInterestName = (interest) => {
  // 如果是字符串，直接返回
  if (typeof interest === 'string') {
    return interest
  }
  
  // 如果是對象，嘗試提取有意義的文字
  if (typeof interest === 'object' && interest !== null) {
    if (interest.interest) return interest.interest
    if (interest.name) return interest.name
    if (interest.text) return interest.text
    if (interest.content) return interest.content
    
    // 如果有多個屬性，嘗試組合顯示
    const meaningfulValues = []
    if (interest.interest) meaningfulValues.push(interest.interest)
    if (interest.category) meaningfulValues.push(`(${interest.category})`)
    
    if (meaningfulValues.length > 0) {
      return meaningfulValues.join(' ')
    }
    
    // 最後嘗試提取第一個字符串值
    const values = Object.values(interest).filter(v => 
      typeof v === 'string' && v.length > 0 && v.length < 30
    )
    if (values.length > 0) {
      return values[0]
    }
  }
  
  return '未命名興趣'
}

// 獲取興趣信心度 - 優化JSON處理
const getInterestConfidence = (interest) => {
  if (typeof interest === 'string') {
    return '未知'
  }
  
  if (typeof interest === 'object' && interest !== null) {
    if (interest.confidence !== undefined) {
      if (typeof interest.confidence === 'number') {
        return Math.round(interest.confidence * 100) + '%'
      }
      return String(interest.confidence)
    }
  }
  
  return '未知'
}

// 獲取興趣來源 - 優化JSON處理
const getInterestSource = (interest) => {
  if (typeof interest === 'string') {
    return '未知'
  }
  
  if (typeof interest === 'object' && interest !== null) {
    const sourceMap = {
      'conversation': '對話',
      'explicit': '明確表達',
      'inferred': '推斷',
      'manual': '手動添加',
      'system': '系統推薦'
    }
    
    if (interest.source) {
      return sourceMap[interest.source] || interest.source
    }
  }
  
  return '未知'
}

// 格式化偏好數據
const formatPreferenceData = (data) => {
  if (!data) return []
  
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'string') return item
      if (typeof item === 'object' && item !== null) {
        return item.name || item.text || item.value || String(item)
      }
      return String(item)
    })
  }
  
  if (typeof data === 'string') {
    return [data]
  }
  
  if (typeof data === 'object' && data !== null) {
    // 嘗試提取有意義的值
    const values = Object.values(data).filter(v => 
      typeof v === 'string' && v.length > 0 && v.length < 50
    )
    return values.length > 0 ? values : ['數據格式錯誤']
  }
  
  return []
}

// 格式化社交偏好
const formatGroupPreference = (preference) => {
  if (!preference) return '未設定'
  
  if (typeof preference === 'string') {
    const preferenceMap = {
      'individual': '個人活動',
      'small_group': '小團體',
      'large_group': '大團體',
      'any': '不限',
      'solo': '獨自參與',
      'couple': '雙人活動',
      'family': '家庭活動'
    }
    return preferenceMap[preference] || preference
  }
  
  if (typeof preference === 'object' && preference !== null) {
    if (preference.type) return formatGroupPreference(preference.type)
    if (preference.preference) return formatGroupPreference(preference.preference)
    
    // 嘗試提取第一個有意義的值
    const values = Object.values(preference).filter(v => 
      typeof v === 'string' && v.length > 0
    )
    if (values.length > 0) {
      return formatGroupPreference(values[0])
    }
  }
  
  return '未設定'
}
</script>

<style scoped>
.user-profile-content {
  height: 100%;
  padding: 12px;
  overflow-y: auto;
}

.profile-section {
  margin-bottom: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 6px;
  font-size: 13px;
}

.title-icon {
  font-size: 14px;
}

.basic-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.info-label {
  color: #909399;
  font-size: 12px;
}

.info-value {
  color: #303133;
  font-weight: 500;
  font-size: 12px;
}

.interests-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.interest-tag {
  font-size: 11px;
  padding: 2px 6px;
}

.preferences-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preference-item {
  font-size: 12px;
  color: #606266;
}

.traits-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.trait-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.trait-name {
  color: #606266;
}

.trait-value {
  color: #303133;
  font-weight: 500;
}

.satisfaction-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.satisfaction-score {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-label {
  font-size: 12px;
  color: #606266;
}

.satisfaction-trend {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trend-label {
  font-size: 12px;
  color: #606266;
}

.recent-scores {
  display: flex;
  gap: 4px;
}

.profile-actions {
  margin-top: 8px;
  text-align: center;
}

.profile-actions .el-button {
  font-size: 12px;
  padding: 6px 12px;
}

/* 自定義滾動條 */
.user-profile-content::-webkit-scrollbar {
  width: 4px;
}

.user-profile-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.user-profile-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.user-profile-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 