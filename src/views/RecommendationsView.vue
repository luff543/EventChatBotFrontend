<template>
  <div class="recommendations-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="filter-card">
          <template #header>
            <div class="card-header">
              <span>篩選條件</span>
            </div>
          </template>
          
          <el-form :model="filters" label-position="top">
            <el-form-item label="地點">
              <el-select v-model="filters.location" placeholder="選擇地點" clearable>
                <el-option
                  v-for="item in locations"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            
            <el-form-item label="活動類型">
              <el-select v-model="filters.category" placeholder="選擇類型" clearable>
                <el-option
                  v-for="item in categories"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            
            <el-form-item label="日期範圍">
              <el-date-picker
                v-model="filters.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="開始日期"
                end-placeholder="結束日期"
                :shortcuts="dateShortcuts"
              />
            </el-form-item>
            
            <el-form-item label="關鍵字">
              <el-input v-model="filters.keyword" placeholder="輸入關鍵字" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="searchEvents" :loading="loading">
                搜尋活動
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <el-col :span="18">
        <div class="events-grid">
          <el-card v-for="event in events" :key="event.id" class="event-card">
            <div class="event-image">
              <el-image :src="event.image" fit="cover" />
              <div class="event-category">{{ event.category }}</div>
            </div>
            
            <div class="event-content">
              <h3 class="event-title">{{ event.title }}</h3>
              <div class="event-info">
                <el-icon><Location /></el-icon>
                <span>{{ event.location }}</span>
              </div>
              <div class="event-info">
                <el-icon><Calendar /></el-icon>
                <span>{{ formatDate(event.startDate) }}</span>
              </div>
              <div class="event-description">{{ event.description }}</div>
              
              <div class="event-footer">
                <el-button type="primary" @click="viewEventDetails(event)">
                  查看詳情
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
        
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[12, 24, 36, 48]"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const filters = reactive({
  location: '',
  category: '',
  dateRange: [],
  keyword: ''
})

const locations = [
  { value: 'taipei', label: '台北市' },
  { value: 'newtaipei', label: '新北市' },
  { value: 'taichung', label: '台中市' },
  { value: 'kaohsiung', label: '高雄市' }
]

const categories = [
  { value: 'sports', label: '運動活動' },
  { value: 'exhibition', label: '展覽活動' },
  { value: 'music', label: '音樂活動' },
  { value: 'food', label: '美食活動' }
]

const dateShortcuts = [
  {
    text: '最近一週',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一個月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三個月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

const events = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const searchEvents = async () => {
  loading.value = true
  try {
    const response = await axios.post('/api/recommend', {
      ...filters,
      page: currentPage.value,
      pageSize: pageSize.value
    })
    
    events.value = response.data.events
    total.value = response.data.total
  } catch (error) {
    ElMessage.error('搜尋活動失敗，請稍後再試')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  searchEvents()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  searchEvents()
}

const viewEventDetails = (event) => {
  // Implement event details view
  console.log('View event details:', event)
}
</script>

<style scoped>
.recommendations-container {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-card {
  position: sticky;
  top: 20px;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.event-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.event-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.event-image .el-image {
  width: 100%;
  height: 100%;
}

.event-category {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.event-content {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.event-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: bold;
}

.event-info {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  margin-bottom: 5px;
}

.event-description {
  margin: 10px 0;
  color: #666;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-footer {
  margin-top: auto;
  padding-top: 10px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style> 