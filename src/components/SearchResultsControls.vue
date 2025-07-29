<template>
  <div class="search-results-controls">
    <div class="results-header">
      <div class="results-count">
        共找到 {{ searchState.pagination.total_events }} 個活動
      </div>
      <div class="sort-control">
        <span class="sort-label">排序方式：</span>
        <el-select 
          v-model="searchState.currentSort" 
          placeholder="排序方式" 
          @change="handleSortChange"
        >
          <el-option label="預設排序" value="default" />
          <el-option label="相關度" value="_score" />
          <el-option label="開始時間" value="start_time" />
          <el-option label="結束時間" value="end_time" />
          <el-option label="更新時間" value="updated_time" />
          <el-option label="距離" value="distance" />
        </el-select>
      </div>
    </div>
    <div class="pagination-container">
      <el-pagination
        v-model="searchState.pagination.current_page"
        :page-size="searchState.pagination.events_per_page"
        :total="searchState.pagination.total_events"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  searchState: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['sort-change', 'page-change'])

const handleSortChange = (value) => {
  emit('sort-change', value)
}

const handlePageChange = (page) => {
  emit('page-change', page)
}
</script>

<style scoped>
.search-results-controls {
  margin-top: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e9ecef;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e9ecef;
}

.results-count {
  color: #606266;
  font-size: 14px;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  color: #606266;
  font-size: 14px;
}

.sort-control .el-select {
  width: 120px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.pagination-container :deep(.el-pagination) {
  justify-content: center;
  margin: 0;
  padding: 0;
}

.pagination-container :deep(.el-pagination .el-pager li) {
  background-color: white;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.pagination-container :deep(.el-pagination .el-pager li.active) {
  background-color: #409EFF;
  color: white;
  border-color: #409EFF;
}

.pagination-container :deep(.el-pagination .btn-prev),
.pagination-container :deep(.el-pagination .btn-next) {
  background-color: white;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.pagination-container :deep(.el-pagination .btn-prev:hover),
.pagination-container :deep(.el-pagination .btn-next:hover) {
  color: #409EFF;
}
</style> 