<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header 
      class="bg-white shadow-sm border-b border-gray-200"
      role="banner"
      aria-label="主导航栏"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-blue-600" aria-label="学习管理系统logo">
                📚 智学云
              </h1>
            </div>
          </div>
          <nav class="hidden md:flex space-x-1" role="navigation" aria-label="主导航菜单">
            <router-link 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path"
              class="px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
              :aria-current="$route.path === item.path ? 'page' : undefined"
            >
              {{ item.icon }} {{ item.name }}
            </router-link>
          </nav>
          <div class="flex items-center space-x-4">
            <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold" aria-label="用户头像">
              用
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 py-8" role="main">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <router-view />
      </div>
    </main>

    <footer 
      class="bg-white border-t border-gray-200 py-6"
      role="contentinfo"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
        <p>© 2024 智学云 - 个性化自适应学习平台</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const navItems = ref([
  { path: '/dashboard', name: '数据仪表盘', icon: '📊' },
  { path: '/assessment', name: '智能测评', icon: '📝' },
  { path: '/courses', name: '课程列表', icon: '📖' }
])
</script>
