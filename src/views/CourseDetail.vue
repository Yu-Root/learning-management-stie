<template>
  <div class="space-y-6" role="region" aria-label="课程详情页面" v-if="courseStore.currentCourse">
    <div class="flex items-center gap-4">
      <button
        @click="$router.back()"
        class="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="返回课程列表"
      >
        ← 返回
      </button>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">{{ courseStore.currentCourse.title }}</h2>
        <p class="text-gray-500">{{ courseStore.currentCourse.description }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-black rounded-xl overflow-hidden shadow-lg relative">
          <video
            ref="videoRef"
            class="w-full aspect-video"
            controls
            preload="metadata"
            aria-label="课程视频播放器"
          >
            <source :src="courseStore.currentCourse.videoUrl" type="video/mp4" />
            您的浏览器不支持视频播放
          </video>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 class="text-lg font-semibold mb-4">📊 学习进度</h3>
          <div class="mb-3">
            <div class="flex justify-between text-sm text-gray-500 mb-1">
              <span>已观看</span>
              <span>{{ formatTime(courseStore.currentTime) }} / {{ formatTime(courseStore.totalDuration) }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-blue-600 h-2.5 rounded-full transition-all" :style="{ width: `${courseStore.currentProgress * 100}%` }"></div>
            </div>
          </div>
          <p class="text-sm text-gray-500">💾 播放进度已自动保存在本地，下次打开将从断点处继续播放</p>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 class="text-lg font-semibold mb-4">📖 课程章节</h3>
          <div class="space-y-3">
            <div v-for="(chapter, index) in courseStore.currentCourse.chapters" :key="chapter.id" class="p-3 rounded-lg bg-gray-50">
              <div class="flex items-center gap-3">
                <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold flex-shrink-0">
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 truncate">{{ chapter.title }}</p>
                  <p class="text-sm text-gray-500">{{ Math.round(chapter.duration / 60) }} 分钟</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 class="text-lg font-semibold mb-4">📈 当前状态</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-gray-500">连续答对次数</span>
              <span class="font-semibold text-green-600">{{ courseStore.consecutiveCorrectCount }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-500">连续答错次数</span>
              <span class="font-semibold text-red-600">{{ courseStore.consecutiveWrongCount }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-500">当前难度标签</span>
              <span 
                class="px-2 py-1 rounded text-xs font-medium"
                :class="difficultyClass(courseStore.currentCourse.difficultyTag)"
              >
                {{ courseStore.currentCourse.difficultyTag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showQuiz" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
      <div class="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
        <h3 id="quiz-title" class="text-xl font-bold text-gray-900 mb-2">🎯 章节小测验</h3>
        <p class="text-gray-500 mb-6">为了检验你的学习效果，请回答以下问题</p>
        
        <div v-if="quizQuestion" class="space-y-4">
          <p class="text-lg font-medium text-gray-900">{{ quizQuestion.text }}</p>
          <div class="space-y-3">
            <button
              v-for="option in quizQuestion.options"
              :key="option.id"
              type="button"
              class="w-full text-left p-4 rounded-lg border-2 transition-all hover:border-blue-300 hover:bg-blue-50"
              :class="selectedQuizOption === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
              :aria-pressed="selectedQuizOption === option.id"
              @click="selectedQuizOption = option.id"
            >
              {{ option.text }}
            </button>
          </div>
          
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              class="px-6 py-3 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="跳过"
              @click="skipQuiz"
            >
              跳过
            </button>
            <button
              type="button"
              class="px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              aria-label="提交答案"
              @click="submitQuiz"
              :disabled="!selectedQuizOption"
            >
              提交答案
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/courseStore'
import type { Question } from '@/mock/data'

const route = useRoute()
const courseStore = useCourseStore()
const videoRef = ref<HTMLVideoElement | null>(null)
const showQuiz = ref(false)
const quizQuestion = ref<Question | null>(null)
const selectedQuizOption = ref<string>('')

let timeUpdateTimer: number | null = null

onMounted(() => {
  const courseId = route.params.id as string
  courseStore.setCurrentCourse(courseId)
  
  timeUpdateTimer = window.setInterval(() => {
    if (videoRef.value && !videoRef.value.paused) {
      const currentTime = videoRef.value.currentTime
      courseStore.updatePlayTime(currentTime)
      
      const quiz = courseStore.checkShouldShowQuiz()
      if (quiz && !showQuiz.value) {
        quizQuestion.value = quiz
        showQuiz.value = true
        videoRef.value.pause()
      }
    }
  }, 500)

  setTimeout(() => {
    if (videoRef.value) {
      videoRef.value.currentTime = courseStore.currentTime
    }
  }, 500)
})

onUnmounted(() => {
  if (timeUpdateTimer) {
    clearInterval(timeUpdateTimer)
  }
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const skipQuiz = () => {
  showQuiz.value = false
  selectedQuizOption.value = ''
  quizQuestion.value = null
  if (videoRef.value) {
    videoRef.value.play()
  }
}

const submitQuiz = () => {
  if (!quizQuestion.value) return
  
  const isCorrect = quizQuestion.value.correctAnswers.includes(selectedQuizOption.value)
  courseStore.submitQuizResult(isCorrect)
  
  showQuiz.value = false
  selectedQuizOption.value = ''
  quizQuestion.value = null
  
  if (videoRef.value) {
    videoRef.value.play()
  }
}

const difficultyClass = (tag: string) => {
  if (tag === '基础巩固') return 'bg-green-100 text-green-700'
  if (tag === '进阶') return 'bg-blue-100 text-blue-700'
  return 'bg-amber-100 text-amber-700'
}
</script>
