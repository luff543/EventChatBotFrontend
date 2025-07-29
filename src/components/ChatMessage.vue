<template>
  <div :class="['message', message.type]">
    <el-avatar 
      :icon="message.type === 'user' ? 'User' : 'Service'" 
      :size="40" 
      :class="message.type" 
    />
    <div class="message-content">
      <div class="message-text" v-html="formatMessage(message.content)"></div>
      
      <!-- 主動式提問組件 -->
      <ProactiveQuestions 
        v-if="message.proactiveQuestions"
        :proactive-data="message.proactiveQuestions"
        @question-click="$emit('question-click', $event)"
        @suggestion-click="$emit('suggestion-click', $event)"
      />
      
      <!-- 搜索結果控制 -->
      <SearchResultsControls
        v-if="message.searchState?.pagination.total_events > 0"
        :search-state="message.searchState"
        @sort-change="(value) => $emit('sort-change', value)"
        @page-change="(page) => $emit('page-change', page)"
      />
      
      <div class="message-time">{{ formatTime(message.timestamp) }}</div>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'
import ProactiveQuestions from './ProactiveQuestions.vue'
import SearchResultsControls from './SearchResultsControls.vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['question-click', 'suggestion-click', 'sort-change', 'page-change'])

const formatMessage = (content) => {
  if (!content) return ''
  
  // 檢查是否為 Markdown 格式
  const isMarkdown = content.includes('```') || 
                    content.includes('#') || 
                    content.includes('*') || 
                    content.includes('>') ||
                    content.includes('[') && content.includes('](')
  
  if (isMarkdown) {
    // 使用 marked 解析 Markdown
    return marked.parse(content)
  } else {
    // 一般文字訊息，只轉換 URL 為可點擊連結
    return content.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank">$1</a>'
    )
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}
</script>

<style scoped>
.message {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
  flex-shrink: 0;
}

.message.user {
  flex-direction: row-reverse;
}

.message-content {
  margin: 0 12px;
  max-width: 70%;
}

.message-text {
  padding: 12px;
  border-radius: 8px;
  background-color: #f4f4f5;
  word-break: break-word;
}

/* Markdown 樣式 */
.message-text :deep(pre) {
  background-color: #282c34;
  color: #abb2bf;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
}

.message-text :deep(code) {
  font-family: 'Courier New', Courier, monospace;
  background-color: #f0f0f0;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

.message-text :deep(p) {
  margin: 0.5em 0;
}

.message-text :deep(ul), .message-text :deep(ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.message-text :deep(blockquote) {
  border-left: 4px solid #ddd;
  margin: 0.5em 0;
  padding-left: 1em;
  color: #666;
}

.message-text :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5em 0;
}

.message-text :deep(th), .message-text :deep(td) {
  border: 1px solid #ddd;
  padding: 0.5em;
}

.message-text :deep(th) {
  background-color: #f5f5f5;
}

.message-text :deep(img) {
  max-width: 100%;
  height: auto;
}

.message-text :deep(a) {
  color: #409EFF;
  text-decoration: none;
}

.message-text :deep(a:hover) {
  text-decoration: underline;
}

.message.user .message-text {
  background-color: #409EFF;
  color: white;
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style> 