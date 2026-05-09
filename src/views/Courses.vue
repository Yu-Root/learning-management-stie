<template>
  <div class="space-y-8" role="region" aria-label="课程列表页面">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">我的课程</h2>
      <p class="text-gray-500">选择课程开始你的学习之旅</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="course in courseStore.courses" 
        :key="course.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        role="article"
        aria-label="课程卡片"
        @click="goToCourse(course.id)"
      >
        <div class="aspect-video bg-gray-200 overflow-hidden">
          <img 
            :src="course.thumbnailUrl" 
            :alt="course.title + '封面'"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div class="p-5">
          <div class="flex items-center justify-between mb-2">
            <span 
              class="px-2 py-1 rounded text-xs font-medium"
              :class="difficultyClass(course.difficultyTag)"
            >
              {{ course.difficultyTag }}
            </span>
            <span class="text-sm text-gray-500">
              ⏱ {{ Math.round(course.duration / 60) }} 分钟
            </span>
          </div>
          <h3 class="font-semibold text-lg text-gray-900 mb-2">{{ course.title }}</h3>
          <p class="text-gray-500 text-sm line-clamp-2">{{ course.description }}</p>
          <div class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-sm text-gray-500 mb-2">章节数: {{ course.chapters.length }}</p>
            <button 
              class="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              aria-label="立即学习"
            >
              立即学习 →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/courseStore'

const router = useRouter()
const courseStore = useCourseStore()

const goToCourse = (courseId: string) => {
  router.push(`/course/${courseId}`)
}

const difficultyClass = (tag: string) => {
  if (tag === '基础巩固') return 'bg-green-100 text-green-700'
  if (tag === '进阶') return 'bg-blue-100 text-blue-700'
  return 'bg-amber-100 text-amber-700'
}
</script>
