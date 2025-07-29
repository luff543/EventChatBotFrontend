<template>
  <div v-if="proactiveData && proactiveData.questions && proactiveData.questions.length > 0" 
       class="proactive-questions-container">
    
    <!-- 主動式提問標題 -->
    <div class="proactive-header">
      <span class="proactive-icon">💬</span>
      <span class="proactive-title">我還可以幫您：</span>
      <el-tag 
        :type="getConfidenceTagType(proactiveData.confidence)" 
        size="small" 
        class="confidence-tag"
      >
        {{ getConfidenceText(proactiveData.confidence) }}
      </el-tag>
    </div>

    <!-- 主動式問題列表 -->
    <div class="questions-list">
      <div 
        v-for="(question, index) in proactiveData.questions" 
        :key="index"
        class="question-item"
        @click="handleQuestionClick(question)"
      >
        <el-button 
          type="primary" 
          plain 
          size="small"
          class="question-button"
          :loading="loadingQuestion === question"
        >
          <span class="question-icon">❓</span>
          {{ formatQuestionText(question) }}
        </el-button>
      </div>
    </div>

    <!-- 後續建議 -->
    <div v-if="proactiveData.follow_up_suggestions && proactiveData.follow_up_suggestions.length > 0" 
         class="follow-up-suggestions">
      <div class="suggestions-header">
        <span class="suggestions-icon">💡</span>
        <span class="suggestions-title">您可能感興趣：</span>
      </div>
      <div class="suggestions-list">
        <el-tag 
          v-for="(suggestion, index) in proactiveData.follow_up_suggestions" 
          :key="index"
          class="suggestion-tag"
          @click="handleSuggestionClick(suggestion)"
          :loading="loadingSuggestion === suggestion"
        >
          {{ formatSuggestionText(suggestion) }}
        </el-tag>
      </div>
    </div>

    <!-- 個性化信息 -->
    <div v-if="proactiveData.personalization_level" class="personalization-info">
      <el-tooltip 
        :content="getPersonalizationTooltip(proactiveData.personalization_level)"
        placement="top"
      >
        <span 
          :class="['personalization-icon', getPersonalizationIconClass(proactiveData.personalization_level)]"
        >
          {{ getPersonalizationEmoji(proactiveData.personalization_level) }}
        </span>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  proactiveData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['question-click', 'suggestion-click'])

const loadingQuestion = ref(null)
const loadingSuggestion = ref(null)

// 格式化問題文字，處理JSON格式
const formatQuestionText = (question) => {
  if (typeof question === 'string') {
    return question
  }
  
  // 如果是對象，嘗試提取有意義的文字
  if (typeof question === 'object' && question !== null) {
    if (question.text) return question.text
    if (question.question) return question.question
    if (question.content) return question.content
    if (question.interest) return `了解更多關於 ${question.interest} 的活動`
    
    // 如果是興趣對象，格式化顯示
    if (question.interest && question.confidence) {
      return `探索 ${question.interest} 相關活動 (推薦度: ${Math.round(question.confidence * 100)}%)`
    }
    
    // 最後嘗試JSON.stringify，但要美化
    try {
      return JSON.stringify(question, null, 2).replace(/[{}"\[\]]/g, '').trim()
    } catch (e) {
      return '查看更多選項'
    }
  }
  
  return String(question)
}

// 格式化建議文字，處理JSON格式
const formatSuggestionText = (suggestion) => {
  if (typeof suggestion === 'string') {
    return suggestion
  }
  
  // 如果是對象，嘗試提取有意義的文字
  if (typeof suggestion === 'object' && suggestion !== null) {
    if (suggestion.text) return suggestion.text
    if (suggestion.suggestion) return suggestion.suggestion
    if (suggestion.content) return suggestion.content
    if (suggestion.interest) return suggestion.interest
    if (suggestion.name) return suggestion.name
    
    // 如果是興趣對象，只顯示興趣名稱
    if (suggestion.interest && suggestion.confidence) {
      return suggestion.interest
    }
    
    // 最後嘗試提取第一個有意義的值
    const values = Object.values(suggestion).filter(v => 
      typeof v === 'string' && v.length > 0 && v.length < 50
    )
    if (values.length > 0) {
      return values[0]
    }
    
    return '相關建議'
  }
  
  return String(suggestion)
}

// 處理問題點擊
const handleQuestionClick = async (question) => {
  try {
    loadingQuestion.value = question
    
    // 確保傳遞的是字符串格式
    const questionText = formatQuestionText(question)
    emit('question-click', questionText)
  } catch (error) {
    ElMessage.error('處理問題失敗')
  } finally {
    loadingQuestion.value = null
  }
}

// 處理建議點擊
const handleSuggestionClick = async (suggestion) => {
  try {
    loadingSuggestion.value = suggestion
    
    // 確保傳遞的是字符串格式
    const suggestionText = formatSuggestionText(suggestion)
    emit('suggestion-click', suggestionText)
  } catch (error) {
    ElMessage.error('處理建議失敗')
  } finally {
    loadingSuggestion.value = null
  }
}

// 獲取信心度標籤類型
const getConfidenceTagType = (confidence) => {
  if (confidence >= 0.8) return 'success'
  if (confidence >= 0.6) return 'warning'
  return 'info'
}

// 獲取信心度文字
const getConfidenceText = (confidence) => {
  if (confidence >= 0.8) return '高相關'
  if (confidence >= 0.6) return '中相關'
  return '低相關'
}

// 獲取個性化等級圖標類別
const getPersonalizationIconClass = (level) => {
  switch (level) {
    case 'high': return 'high-personalization'
    case 'medium': return 'medium-personalization'
    case 'low': return 'low-personalization'
    default: return 'default-personalization'
  }
}

// 獲取個性化Emoji
const getPersonalizationEmoji = (level) => {
  switch (level) {
    case 'high': return '⭐'
    case 'medium': return '🔸'
    case 'low': return '🔹'
    default: return '❓'
  }
}

// 獲取個性化提示文字
const getPersonalizationTooltip = (level) => {
  switch (level) {
    case 'high': return '基於您的偏好高度個性化'
    case 'medium': return '基於部分偏好個性化'
    case 'low': return '通用建議'
    default: return '個性化程度未知'
  }
}
</script>

<style scoped>
.proactive-questions-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 16px;
  margin: 12px 0;
  border-left: 4px solid #409eff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.proactive-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
}

.proactive-icon {
  font-size: 18px;
}

.proactive-title {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.confidence-tag {
  margin-left: auto;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.question-item {
  cursor: pointer;
}

.question-button {
  width: 100%;
  text-align: left;
  justify-content: flex-start;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #dcdfe6;
  background: white;
  word-wrap: break-word;
  white-space: normal;
  height: auto;
  min-height: 32px;
  padding: 8px 12px;
}

.question-button:hover {
  background: #ecf5ff;
  border-color: #409eff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.question-icon {
  margin-right: 6px;
  font-size: 14px;
}

.follow-up-suggestions {
  border-top: 1px solid #e4e7ed;
  padding-top: 12px;
}

.suggestions-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 6px;
}

.suggestions-icon {
  font-size: 16px;
}

.suggestions-title {
  font-weight: 500;
  color: #606266;
  font-size: 13px;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-tag {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 16px;
  font-size: 12px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suggestion-tag:hover {
  background: #409eff;
  color: white;
  transform: scale(1.05);
}

.personalization-info {
  position: absolute;
  top: 12px;
  right: 12px;
}

.personalization-icon {
  font-size: 16px;
  cursor: help;
}

.high-personalization {
  color: #67c23a;
}

.medium-personalization {
  color: #e6a23c;
}

.low-personalization {
  color: #909399;
}

.default-personalization {
  color: #c0c4cc;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .proactive-questions-container {
    padding: 12px;
    margin: 8px 0;
  }
  
  .question-button {
    font-size: 13px;
    padding: 8px 12px;
  }
  
  .suggestions-list {
    gap: 4px;
  }
  
  .suggestion-tag {
    font-size: 11px;
    max-width: 120px;
  }
}
</style> 