<template>
  <div class="quick-queries-content">
    <!-- 智能推薦區域 -->
    <div v-if="recommendedQueries.length > 0" class="recommended-section">
      <div class="section-title">
        <span class="title-icon">⭐</span>
        <span>為您推薦</span>
      </div>
      <div class="query-list">
        <el-button 
          v-for="query in recommendedQueries" 
          :key="query" 
          @click="$emit('query-click', query)"
          class="quick-query-btn recommended"
          type="primary"
          plain
        >
          {{ query }}
        </el-button>
      </div>
    </div>

    <!-- 常用查詢區域 -->
    <div class="popular-section">
      <div class="section-title">
        <span class="title-icon">🔥</span>
        <span>熱門查詢</span>
      </div>
      <div class="query-list">
        <el-button 
          v-for="query in popularQueries" 
          :key="query" 
          @click="$emit('query-click', query)"
          class="quick-query-btn popular"
        >
          {{ query }}
        </el-button>
      </div>
    </div>

    <!-- 分類查詢區域 -->
    <div class="category-section">
      <div class="section-title">
        <span class="title-icon">📂</span>
        <span>分類查詢</span>
      </div>
      <el-collapse v-model="activeCategories" class="category-collapse">
        <el-collapse-item 
          v-for="category in categories" 
          :key="category.name"
          :name="category.name"
          class="category-item"
        >
          <template #title>
            <div class="category-title">
              <span class="category-icon">{{ category.icon }}</span>
              <span>{{ category.label }}</span>
              <el-tag size="small" type="info">{{ category.queries.length }}</el-tag>
            </div>
          </template>
          <div class="query-list">
            <el-button 
              v-for="query in category.queries" 
              :key="query" 
              @click="$emit('query-click', query)"
              class="quick-query-btn category"
              size="small"
            >
              {{ query }}
            </el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
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

const emit = defineEmits(['query-click'])

const activeCategories = ref(['location'])

// 熱門查詢
const popularQueries = [
  '台北市最熱門的活動',
  '推薦週末的戶外活動',
  '查詢下個月的展覽',
  '適合親子的展覽',
  '推薦相關活動'
]

// 分類查詢
const categories = [
  {
    name: 'location',
    label: '地點',
    icon: '📍',
    queries: [
      '台北南港區展覽',
      '新竹親子活動',
      '台中音樂活動',
      '高雄藝文活動'
    ]
  },
  {
    name: 'time',
    label: '時間',
    icon: '📅',
    queries: [
      '搜尋明天的活動',
      '搜尋端午節活動',
      '母親節活動',
      '中秋節活動'
    ]
  },
  {
    name: 'audience',
    label: '對象',
    icon: '👥',
    queries: [
      '搜尋親子活動',
      '大學生音樂活動',
      '老年人休閒活動',
      '情侶約會活動'
    ]
  },
  {
    name: 'type',
    label: '類型',
    icon: '🎭',
    queries: [
      '音樂演出',
      '藝術展覽',
      '運動賽事',
      '文化講座'
    ]
  },
  {
    name: 'intent',
    label: '意圖',
    icon: '🎯',
    queries: [
      '請分析藝術活動的月度趨勢',
      '請分析各城市的活動分布情況',
      '請推薦一些適合我的活動',
      '分析音樂活動的地理分布'
    ]
  }
]

// 智能推薦查詢
const recommendedQueries = computed(() => {
  const recommendations = []
  const interests = props.userProfile?.interests || []
  
  // 根據用戶興趣推薦
  interests.forEach(interest => {
    const interestName = typeof interest === 'string' ? interest : interest.interest
    if (interestName === '戶外') {
      recommendations.push('推薦戶外運動活動')
    } else if (interestName === '藝文') {
      recommendations.push('推薦藝術文化展覽')
    } else if (interestName === '音樂') {
      recommendations.push('推薦音樂演出活動')
    }
  })
  
  // 根據對話階段推薦
  if (props.conversationStage === 'exploring') {
    recommendations.push('探索新的活動類型')
  } else if (props.conversationStage === 'deciding') {
    recommendations.push('比較類似活動')
  }
  
  return [...new Set(recommendations)].slice(0, 3)
})
</script>

<style scoped>
.quick-queries-content {
  height: 100%;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
  font-size: 13px;
}

.title-icon {
  font-size: 14px;
}

.query-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quick-query-btn {
  text-align: left;
  justify-content: flex-start;
  font-size: 12px;
  padding: 8px 12px;
  height: auto;
  white-space: normal;
  line-height: 1.3;
  border-radius: 6px;
}

.quick-query-btn.recommended {
  border-color: #409eff;
  color: #409eff;
  background: linear-gradient(135deg, #ecf5ff 0%, #f0f9ff 100%);
}

.quick-query-btn.recommended:hover {
  background: linear-gradient(135deg, #d9ecff 0%, #e6f7ff 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.quick-query-btn.popular {
  border-color: #67c23a;
  color: #67c23a;
}

.quick-query-btn.popular:hover {
  background-color: #f0f9ff;
  border-color: #85ce61;
}

.quick-query-btn.category {
  border-color: #909399;
  color: #606266;
}

.quick-query-btn.category:hover {
  background-color: #f5f7fa;
  border-color: #c0c4cc;
}

.recommended-section {
  background: linear-gradient(135deg, #f8fbff 0%, #f0f9ff 100%);
  border: 1px solid #d9ecff;
  border-radius: 8px;
  padding: 12px;
}

.popular-section {
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px;
}

.category-section {
  flex: 1;
}

.category-collapse {
  border: none;
}

.category-collapse :deep(.el-collapse-item__header) {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 4px;
  font-size: 12px;
}

.category-collapse :deep(.el-collapse-item__content) {
  padding: 8px 0;
  border: none;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.category-icon {
  font-size: 14px;
}

.category-title span:nth-child(2) {
  flex: 1;
  font-size: 12px;
  font-weight: 500;
}

/* 自定義滾動條 */
.quick-queries-content::-webkit-scrollbar {
  width: 4px;
}

.quick-queries-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.quick-queries-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.quick-queries-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 