<template>
  <div class="analysis-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <div class="title">每月活動趨勢</div>
              <div class="date-controls">
                <el-date-picker
                  v-model="monthlyStartDate"
                  type="date"
                  placeholder="開始日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="fetchMonthlyData"
                />
                <span class="date-separator">至</span>
                <el-date-picker
                  v-model="monthlyEndDate"
                  type="date"
                  placeholder="結束日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="fetchMonthlyData"
                />
              </div>
              <div class="header-controls">
                <el-select v-model="selectedCategory" placeholder="選擇活動類別" @change="fetchMonthlyData">
                  <el-option
                    v-for="option in categoryOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
                <el-select v-model="selectedInterval" placeholder="選擇時間間隔" @change="fetchMonthlyData">
                  <el-option label="每日" value="1d" />
                  <el-option label="每週" value="1w" />
                  <el-option label="每月" value="1M" />
                </el-select>
              </div>
            </div>
          </template>
          <div ref="monthlyChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <div class="title">活動地點分布</div>
              <div class="type-control">
                <span class="type-label">資料來源：</span>
                <el-select v-model="locationType" placeholder="選擇類型" @change="fetchLocationData">
                  <el-option label="Web Post" value="Web Post" />
                  <el-option label="FB Post" value="FB Post" />
                  <el-option label="FB Event Post" value="FB Event Post" />
                </el-select>
              </div>
              <div class="date-controls">
                <el-date-picker
                  v-model="locationStartDate"
                  type="date"
                  placeholder="開始日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="fetchLocationData"
                />
                <span class="date-separator">至</span>
                <el-date-picker
                  v-model="locationEndDate"
                  type="date"
                  placeholder="結束日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="fetchLocationData"
                />
              </div>
            </div>
          </template>
          <div ref="locationChart" class="chart"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <div class="title">活動類型分布</div>
              <div class="type-control">
                <span class="type-label">資料來源：</span>
                <el-select v-model="categoryType" placeholder="選擇類型" @change="fetchCategoryData">
                  <el-option label="Web Post" value="Web Post" />
                  <el-option label="FB Post" value="FB Post" />
                  <el-option label="FB Event Post" value="FB Event Post" />
                </el-select>
              </div>
              <div class="date-controls">
                <el-date-picker
                  v-model="categoryStartDate"
                  type="date"
                  placeholder="開始日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="fetchCategoryData"
                />
                <span class="date-separator">至</span>
                <el-date-picker
                  v-model="categoryEndDate"
                  type="date"
                  placeholder="結束日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="fetchCategoryData"
                />
              </div>
            </div>
          </template>
          <div ref="categoryChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

const monthlyChart = ref(null)
const locationChart = ref(null)
const categoryChart = ref(null)
const selectedCategory = ref('')
const selectedInterval = ref('1M')
const categoryOptions = ref([])
const locationType = ref('Web Post')
const categoryType = ref('Web Post')

// 設置默認日期
const today = new Date()
const sixMonthsAgo = new Date()
sixMonthsAgo.setMonth(today.getMonth() - 6)

const monthlyStartDate = ref(sixMonthsAgo.toISOString().split('T')[0])
const monthlyEndDate = ref(today.toISOString().split('T')[0])
const locationStartDate = ref(today.toISOString().split('T')[0])
const locationEndDate = ref(null)
const categoryStartDate = ref(today.toISOString().split('T')[0])
const categoryEndDate = ref(null)

let monthlyChartInstance = null
let locationChartInstance = null
let categoryChartInstance = null

const initCharts = () => {
  monthlyChartInstance = echarts.init(monthlyChart.value)
  locationChartInstance = echarts.init(locationChart.value)
  categoryChartInstance = echarts.init(categoryChart.value)
  
  window.addEventListener('resize', () => {
    monthlyChartInstance?.resize()
    locationChartInstance?.resize()
    categoryChartInstance?.resize()
  })
}

const fetchCategoryOptions = async () => {
  try {
    const params = {
      group: 'category',
      sort: 'value',
      asc: false,
      num: 700
    }

    // 添加時間過濾
    if (monthlyStartDate.value) {
      const startDate = new Date(monthlyStartDate.value)
      params.from = startDate.getTime()
    }
    if (monthlyEndDate.value) {
      const endDate = new Date(monthlyEndDate.value)
      params.to = endDate.getTime()
    }

    const response = await axios.get('/api/activity/histogram', { params })
    categoryOptions.value = [
      { label: '全部類別', value: '' },
      ...response.data.map(item => ({
        label: item.key,
        value: item.key
      }))
    ]
  } catch (error) {
    console.error('Failed to fetch category options:', error)
  }
}

const fetchMonthlyData = async () => {
  try {
    const params = {
      group: 'start_time',
      interval: selectedInterval.value,
      timezone: 'Asia/Taipei',
      extra_data: 'bug_fix'
    }
    
    if (monthlyStartDate.value) {
      const startDate = new Date(monthlyStartDate.value)
      params.from = startDate.getTime()
    }
    if (monthlyEndDate.value) {
      const endDate = new Date(monthlyEndDate.value)
      params.to = endDate.getTime()
    }
    
    if (selectedCategory.value) {
      params.category = selectedCategory.value
    }
    
    console.log('Monthly data request params:', params)
    const response = await axios.get('/api/activity/date-histogram', { params })
    console.log('Monthly data response:', response.data)
    
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          const data = params[0]
          const date = new Date(parseInt(data.name))
          return `${date.toLocaleDateString()}<br/>活動數量：${data.value}`
        }
      },
      xAxis: {
        type: 'category',
        data: response.data.map(item => item.key),
        axisLabel: {
          formatter: function(value) {
            const date = new Date(parseInt(value))
            return date.toLocaleDateString()
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '活動數量'
      },
      series: [{
        data: response.data.map(item => item.value),
        type: 'line',
        smooth: true,
        areaStyle: {},
        name: '活動數量'
      }]
    }
    
    monthlyChartInstance.setOption(option)
  } catch (error) {
    console.error('Failed to fetch monthly data:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    })
  }
}

const fetchLocationData = async () => {
  try {
    const params = {
      group: 'city',
      sort: 'value',
      asc: false,
      num: 700,
      type: locationType.value,
      extra_data: 'bug_fix'
    }

    // 添加時間過濾
    if (locationStartDate.value) {
      const startDate = new Date(locationStartDate.value)
      params.from = startDate.getTime()
    }
    if (locationEndDate.value) {
      const endDate = new Date(locationEndDate.value)
      params.to = endDate.getTime()
    }

    console.log('Location data request params:', params)
    const response = await axios.get('/api/activity/histogram', { params })
    console.log('Location data response:', response.data)
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      series: [{
        type: 'pie',
        radius: '50%',
        data: response.data.map(item => ({
          name: item.key,
          value: item.value
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
    
    locationChartInstance.setOption(option)
  } catch (error) {
    console.error('Failed to fetch location data:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    })
  }
}

const fetchCategoryData = async () => {
  try {
    const params = {
      group: 'category',
      sort: 'value',
      asc: false,
      num: 30,
      type: categoryType.value,
      extra_data: 'bug_fix'
    }

    // 添加時間過濾
    if (categoryStartDate.value) {
      const startDate = new Date(categoryStartDate.value)
      params.from = startDate.getTime()
    }
    if (categoryEndDate.value) {
      const endDate = new Date(categoryEndDate.value)
      params.to = endDate.getTime()
    }

    console.log('Category data request params:', params)
    const response = await axios.get('/api/activity/histogram', { params })
    console.log('Category data response:', response.data)
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{c}'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10
        },
        data: response.data
          .filter(item => item.key && item.key.trim() !== '')
          .map(item => ({
            name: item.key,
            value: item.value
          }))
      }]
    }
    
    categoryChartInstance.setOption(option)
  } catch (error) {
    console.error('Failed to fetch category data:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    })
  }
}

// 監聽日期變化
watch([monthlyStartDate, monthlyEndDate], () => {
  fetchCategoryOptions()
  fetchMonthlyData()
})

onMounted(() => {
  initCharts()
  fetchCategoryOptions()
  fetchMonthlyData()
  // 確保在組件掛載後立即獲取數據
  nextTick(() => {
    fetchLocationData()
    fetchCategoryData()
  })
})
</script>

<style scoped>
.analysis-container {
  max-width: 1200px;
  margin: 0 auto;
}

.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0;
}

.card-header .title {
  font-size: 16px;
  font-weight: 500;
}

.type-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-label {
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
}

.type-control .el-select {
  width: 150px;
}

.date-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.date-controls .el-select {
  width: 120px;
}

.header-controls {
  display: flex;
  gap: 10px;
}

.date-separator {
  color: #606266;
}

.chart {
  height: 400px;
}

.mt-20 {
  margin-top: 20px;
}
</style> 