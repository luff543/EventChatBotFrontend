<template>
  <div class="chat-container">
    <el-row :gutter="20" class="main-layout">
      <!-- 聊天區域 - 動態調整寬度 -->
      <el-col :span="sidebarCollapsed ? 23 : 18" class="chat-section">
        <ChatContainer
          :messages="messages"
          :user-input="userInput"
          :loading="loading"
          @update:user-input="userInput = $event"
          @send="sendMessage"
          @question-click="handleProactiveQuestionClick"
          @suggestion-click="handleFollowUpSuggestionClick"
          @sort-change="handleSortChange"
          @page-change="handlePageChange"
          ref="chatContainer"
        />
      </el-col>
      
      <!-- 側邊欄 - 標籤頁設計 -->
      <el-col :span="sidebarCollapsed ? 1 : 6" class="sidebar-section">
        <div class="sidebar-content" :class="{ collapsed: sidebarCollapsed }">
          <!-- 側邊欄工具欄 -->
          <div class="sidebar-toolbar">
            <div class="toolbar-left">
              <span v-if="!sidebarCollapsed" class="sidebar-title">控制面板</span>
            </div>
            <div class="toolbar-right">
              <el-button 
                @click="toggleSidebar"
                size="small"
                circle
                class="toggle-btn"
                :title="sidebarCollapsed ? '展開側邊欄' : '收起側邊欄'"
              >
                {{ sidebarCollapsed ? '→' : '←' }}
              </el-button>
            </div>
          </div>

          <!-- 標籤頁內容 -->
          <div v-if="!sidebarCollapsed" class="tabs-container">
            <el-tabs v-model="activeTab" class="sidebar-tabs" tab-position="top">
              <!-- 用戶畫像標籤 -->
              <el-tab-pane name="profile" class="tab-pane">
                <template #label>
                  <div class="tab-label">
                    <span>畫像</span>
                    <el-badge 
                      v-if="currentUserProfile?.interests?.length > 0" 
                      :value="currentUserProfile.interests.length" 
                      class="tab-badge"
                    />
                  </div>
                </template>
                <UserProfile 
                  :user-profile="currentUserProfile"
                  :conversation-stage="currentConversationStage"
                  @refresh-profile="refreshUserProfile"
                />
              </el-tab-pane>
              
              <!-- 對話狀態標籤 -->
              <el-tab-pane name="session" class="tab-pane">
                <template #label>
                  <div class="tab-label">
                    <span>狀態</span>
                    <el-badge 
                      v-if="messageCount >= 18" 
                      :value="messageCount" 
                      :type="messageCount >= 20 ? 'danger' : 'warning'"
                      class="tab-badge"
                    />
                  </div>
                </template>
                <SessionInfo
                  :session-id="currentSessionId"
                  :message-count="messageCount"
                  :conversation-stage="currentConversationStage"
                  :user-profile="currentUserProfile"
                />
              </el-tab-pane>
              
              <!-- 快速查詢標籤 -->
              <el-tab-pane name="queries" class="tab-pane">
                <template #label>
                  <div class="tab-label">
                    <span>查詢</span>
                  </div>
                </template>
                <QuickQueries 
                  :user-profile="currentUserProfile"
                  :conversation-stage="currentConversationStage"
                  @query-click="useQuickQuery" 
                />
              </el-tab-pane>
            </el-tabs>
          </div>

          <!-- 收起狀態的快速操作 -->
          <div v-else class="collapsed-actions">
            <el-tooltip content="用戶畫像" placement="right">
              <el-button 
                @click="expandAndSwitchTab('profile')"
                circle
                size="small"
                class="collapsed-btn"
              >
                畫
              </el-button>
            </el-tooltip>
            <el-tooltip content="對話狀態" placement="right">
              <el-button 
                @click="expandAndSwitchTab('session')"
                circle
                size="small"
                class="collapsed-btn"
              >
                狀
              </el-button>
            </el-tooltip>
            <el-tooltip content="快速查詢" placement="right">
              <el-button 
                @click="expandAndSwitchTab('queries')"
                circle
                size="small"
                class="collapsed-btn"
              >
                查
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 導入組件
import ChatContainer from '../components/ChatContainer.vue'
import UserProfile from '../components/UserProfile.vue'
import QuickQueries from '../components/QuickQueries.vue'
import SessionInfo from '../components/SessionInfo.vue'

// 導入組合式函數
import { useChatLogic } from '../composables/useChatLogic.js'

// 使用聊天邏輯
const {
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
} = useChatLogic()

// 聊天容器引用
const chatContainer = ref(null)

// 標籤頁狀態
const activeTab = ref('profile')

// 側邊欄狀態
const sidebarCollapsed = ref(false)

// 方法
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const expandAndSwitchTab = (tab) => {
  activeTab.value = tab
  sidebarCollapsed.value = false
}
</script>

<style scoped>
.chat-container {
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 40px);
  padding: 20px;
  box-sizing: border-box;
}

.main-layout {
  height: 100%;
}

.chat-section {
  height: 100%;
}

.sidebar-section {
  height: 100%;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.sidebar-content.collapsed {
  background: #f8f9fa;
}

.sidebar-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-tabs :deep(.el-tabs__header) {
  margin: 0;
  border-bottom: 1px solid #e4e7ed;
}

.sidebar-tabs :deep(.el-tabs__nav-wrap) {
  padding: 0 8px;
}

.sidebar-tabs :deep(.el-tabs__item) {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #606266;
  border: none;
}

.sidebar-tabs :deep(.el-tabs__item.is-active) {
  color: #409eff;
  background-color: #ecf5ff;
  border-radius: 4px 4px 0 0;
}

.sidebar-tabs :deep(.el-tabs__item:hover) {
  color: #409eff;
}

.sidebar-tabs :deep(.el-tabs__active-bar) {
  background-color: #409eff;
  height: 2px;
}

.sidebar-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
  padding: 0;
}

.tab-pane {
  height: 100%;
  overflow: hidden;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
}

.tab-label .el-icon {
  font-size: 14px;
}

.tab-label span {
  font-size: 12px;
}

.tab-badge {
  position: absolute;
  top: -8px;
  right: -12px;
  transform: scale(0.8);
}

.sidebar-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e4e7ed;
  border-radius: 8px 8px 0 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-title {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.toggle-btn {
  background: white;
  border-color: #dcdfe6;
  color: #606266;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: #409eff;
  border-color: #409eff;
  color: white;
  transform: scale(1.05);
}

.collapsed-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px 8px;
}

.collapsed-btn {
  background: white;
  border-color: #dcdfe6;
  color: #606266;
  transition: all 0.2s ease;
}

.collapsed-btn:hover {
  background: #409eff;
  border-color: #409eff;
  color: white;
  transform: scale(1.1);
}

.tabs-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style> 