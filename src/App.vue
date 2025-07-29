<template>
  <el-container class="app-container">
    <el-header>
      <div class="header-content">
        <router-link to="/" class="logo">活動聊天機器人</router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">首頁</router-link>
          <router-link to="/analysis" class="nav-link">活動分析</router-link>
          <router-link to="/recommendations" class="nav-link">活動推薦</router-link>
        </div>
      </div>
    </el-header>
    
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
// Component logic here
</script>

<style scoped>
.app-container {
  min-height: 100vh;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #409EFF;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: #606266;
  text-decoration: none;
  font-size: 1rem;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-link:hover {
  color: #409EFF;
  background-color: #ecf5ff;
}

.router-link-active {
  color: #409EFF;
  background-color: #ecf5ff;
}

.el-main {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #f5f7fa;
}
</style> 