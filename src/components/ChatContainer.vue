<template>
  <el-card class="chat-card">
    <div class="chat-messages" ref="messagesContainer">
      <ChatMessage
        v-for="(message, index) in messages"
        :key="index"
        :message="message"
        @question-click="$emit('question-click', $event)"
        @suggestion-click="$emit('suggestion-click', $event)"
        @sort-change="(value) => handleSortChange(value, message)"
        @page-change="(page) => handlePageChange(page, message)"
      />
    </div>
    
    <ChatInput
      v-model="inputValue"
      :loading="loading"
      @send="$emit('send')"
    />
  </el-card>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  userInput: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:userInput', 
  'send', 
  'question-click', 
  'suggestion-click', 
  'sort-change', 
  'page-change'
])

const messagesContainer = ref(null)
const inputValue = ref(props.userInput)

// 監聽 userInput 變化
watch(() => props.userInput, (newValue) => {
  inputValue.value = newValue
})

// 監聽 inputValue 變化並發送給父組件
watch(inputValue, (newValue) => {
  emit('update:userInput', newValue)
})

// 監聽消息變化，自動滾動到底部
watch(() => props.messages, async () => {
  await scrollToBottom()
}, { deep: true })

// 處理排序變化
const handleSortChange = (value, message) => {
  emit('sort-change', value, message)
}

// 處理分頁變化
const handlePageChange = (page, message) => {
  emit('page-change', page, message)
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 暴露滾動方法給父組件
defineExpose({
  scrollToBottom
})
</script>

<style scoped>
.chat-card {
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}

.chat-card :deep(.el-card__body) {
  height: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
</style> 