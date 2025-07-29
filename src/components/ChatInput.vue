<template>
  <div class="chat-input">
    <el-input
      v-model="inputValue"
      type="textarea"
      :rows="3"
      placeholder="請輸入您的問題，例如：'我想找台北的運動活動'"
      @keyup.enter.ctrl="handleSend"
    />
    <el-button type="primary" @click="handleSend" :loading="loading">
      發送
      <el-icon class="el-icon--right"><Position /></el-icon>
    </el-button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Position } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'send'])

const inputValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue
})

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleSend = () => {
  if (inputValue.value.trim()) {
    emit('send')
  }
}
</script>

<style scoped>
.chat-input {
  padding: 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  gap: 10px;
  background-color: white;
  flex-shrink: 0;
}
</style> 