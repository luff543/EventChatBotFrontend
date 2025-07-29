<template>
  <div class="session-info-content">
    <div class="session-info">
      <div class="session-info-item">
        <span class="session-label">Session ID:</span>
        <span class="session-value">{{ sessionId || '等待建立' }}</span>
      </div>
      <div class="session-info-item">
        <span class="session-label">訊息數量:</span>
        <span class="session-value">{{ messageCount }}/20</span>
      </div>
      <div class="session-info-item">
        <span class="session-label">狀態:</span>
        <span class="session-value" :class="messageCount >= 18 ? 'warning' : 'normal'">
          {{ messageCount >= 20 ? '已滿' : messageCount >= 18 ? '即將滿' : '正常' }}
        </span>
      </div>
      <div v-if="userProfile?.visit_count" class="session-info-item">
        <span class="session-label">訪問次數:</span>
        <span class="session-value">
          {{ userProfile.visit_count }} 次
          <el-tag v-if="userProfile.visit_count === 1" type="info" size="small">新用戶</el-tag>
          <el-tag v-else type="success" size="small">回訪用戶</el-tag>
        </span>
      </div>
      <div v-if="userProfile?.session_count && userProfile.is_integrated" class="session-info-item">
        <span class="session-label">歷史會話:</span>
        <span class="session-value">{{ userProfile.session_count }} 個</span>
      </div>
      <div v-if="userProfile?.total_interactions" class="session-info-item">
        <span class="session-label">總互動數:</span>
        <span class="session-value">{{ userProfile.total_interactions }}</span>
      </div>
      <div v-if="userProfile?.is_integrated" class="session-info-item">
        <span class="session-label">畫像類型:</span>
        <span class="session-value integrated">
          🔗 整合畫像
        </span>
      </div>
      <div v-if="conversationStage" class="session-info-item">
        <span class="session-label">對話階段:</span>
        <el-tag 
          :type="getStageTagType(conversationStage)" 
          size="small"
        >
          {{ getStageDisplayName(conversationStage) }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  sessionId: {
    type: String,
    default: null
  },
  messageCount: {
    type: Number,
    default: 0
  },
  conversationStage: {
    type: String,
    default: null
  },
  userProfile: {
    type: Object,
    default: () => ({})
  }
})

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
</script>

<style scoped>
.session-info-content {
  height: 100%;
  padding: 12px;
  overflow-y: auto;
}

.session-info {
  padding: 0;
}

.session-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}

.session-label {
  color: #606266;
  font-size: 12px;
  font-weight: 500;
}

.session-value {
  color: #303133;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.session-value.warning {
  color: #e6a23c;
}

.session-value.normal {
  color: #67c23a;
}

.warning {
  color: #e6a23c;
  font-weight: bold;
}

.integrated {
  color: #67c23a;
  font-weight: bold;
}

.session-value .el-tag {
  font-size: 10px;
  padding: 1px 4px;
  height: auto;
}
</style> 