<template>
  <div class="max-w-3xl mx-auto space-y-8" role="region" aria-label="智能测评页面">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">智能入学测评</h2>
      <p class="text-gray-500">完成测评，生成专属你的个性化学习计划</p>
    </div>

    <div v-if="!assessmentStore.completed" class="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <div class="mb-8" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100" aria-label="测评进度">
        <div class="flex justify-between text-sm text-gray-500 mb-2">
          <span>第 {{ currentStepDisplay }} / {{ assessmentStore.totalSteps }} 题</span>
          <span>{{ progressPercent }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div class="bg-blue-600 h-3 rounded-full transition-all duration-300" :style="{ width: `${progressPercent}%` }"></div>
        </div>
      </div>

      <div v-if="currentQuestion" class="space-y-6">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full text-sm font-medium" :class="currentQuestion.type === 'single' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'">
            {{ currentQuestion.type === 'single' ? '单选题' : '多选题' }}
          </span>
          <span class="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
            难度: {{ difficultyText[currentQuestion.difficulty] }}
          </span>
        </div>

        <h3 class="text-xl font-semibold text-gray-900" :id="`question-${currentQuestion.id}`">
          {{ currentQuestion.text }}
        </h3>

        <div class="space-y-3" role="radiogroup" :aria-labelledby="`question-${currentQuestion.id}`">
          <button
            v-for="option in currentQuestion.options"
            :key="option.id"
            type="button"
            class="w-full text-left p-4 rounded-lg border-2 transition-all"
            :class="isOptionSelected(option.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'"
            :aria-pressed="isOptionSelected(option.id)"
            aria-label="选项"
            @click="toggleOption(option.id)"
          >
            <span class="font-medium">{{ option.text }}</span>
          </button>
        </div>

        <div class="flex justify-between pt-4">
          <button
            type="button"
            class="px-6 py-3 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="上一题"
            :disabled="assessmentStore.currentStep === 0"
            @click="goPrev"
          >
            ← 上一题
          </button>
          <button
            v-if="!isLastStep"
            type="button"
            class="px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            aria-label="下一题"
            @click="goNext"
          >
            下一题 →
          </button>
          <button
            v-else
            type="button"
            class="px-6 py-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            aria-label="提交测评"
            @click="submitAssessment"
          >
            提交测评 ✓
          </button>
        </div>
      </div>
    </div>

    <div v-else class="space-y-8">
      <div class="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
        <div class="text-5xl mb-4">🎉</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">测评完成！</h3>
        <div class="grid grid-cols-2 gap-6 mt-6">
          <div>
            <p class="text-gray-500">答对题数</p>
            <p class="text-4xl font-bold text-blue-600">{{ assessmentStore.correctCount }}/{{ assessmentStore.totalSteps }}</p>
          </div>
          <div>
            <p class="text-gray-500">正确率</p>
            <p class="text-4xl font-bold text-green-600">{{ assessmentStore.accuracy }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h3 class="text-xl font-bold text-gray-900 mb-4">📋 知识盲点分析</h3>
        <div v-if="assessmentStore.knowledgeBlindSpots.length > 0" class="flex flex-wrap gap-3">
          <span v-for="spot in assessmentStore.knowledgeBlindSpots" :key="spot" class="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium">
            ⚠️ {{ spot }}
          </span>
        </div>
        <p v-else class="text-green-600 font-medium">太棒了！没有检测到明显的知识盲点！</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h3 class="text-xl font-bold text-gray-900 mb-6">⏰ 专属学习计划时间轴</h3>
        <div class="relative">
          <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200"></div>
          <div class="space-y-6">
            <div v-for="(plan, index) in learningPlan" :key="plan.chapter.id" class="flex gap-6 items-start pl-4">
              <div class="z-10 h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {{ index + 1 }}
              </div>
              <div class="flex-1 pt-1">
                <h4 class="font-semibold text-lg text-gray-900">{{ plan.chapter.title }}</h4>
                <p class="text-gray-500 mt-1">{{ plan.chapter.description }}</p>
                <p class="text-blue-600 text-sm mt-2">{{ plan.reason }}</p>
                <p class="text-gray-400 text-sm mt-1">预计耗时：{{ Math.round(plan.chapter.duration / 60) }} 分钟</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-4">
        <button
          type="button"
          class="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="重新测评"
          @click="resetAssessment"
        >
          🔄 重新测评
        </button>
        <router-link
          to="/courses"
          class="px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors inline-block"
          role="button"
          aria-label="开始学习"
        >
          🚀 开始学习
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAssessmentStore } from '@/stores/assessmentStore'
import { mockCourses } from '@/mock/data'

const assessmentStore = useAssessmentStore()

const difficultyText: Record<string, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难'
}

const currentStepDisplay = computed(() => assessmentStore.currentStep + 1)
const progressPercent = computed(() => Math.round(((assessmentStore.currentStep + 1) / assessmentStore.totalSteps) * 100))
const currentQuestion = computed(() => assessmentStore.currentQuestion)
const isLastStep = computed(() => assessmentStore.currentStep === assessmentStore.totalSteps - 1)

const learningPlan = computed(() => {
  const allChapters = mockCourses.flatMap(c => c.chapters)
  return assessmentStore.generateLearningPlan(allChapters)
})

const selectedAnswers = computed(() => assessmentStore.answers[currentQuestion.value?.id || ''] || [])

const isOptionSelected = (id: string) => {
  return selectedAnswers.value.includes(id)
}

const toggleOption = (optionId: string) => {
  if (!currentQuestion.value) return
  
  const q = currentQuestion.value
  let newSelected = [...selectedAnswers.value]
  
  if (q.type === 'single') {
    newSelected = [optionId]
  } else {
    if (newSelected.includes(optionId)) {
      newSelected = newSelected.filter(id => id !== optionId)
    } else {
      newSelected.push(optionId)
    }
  }
  
  assessmentStore.submitAnswer(q.id, newSelected)
}

const goNext = () => {
  assessmentStore.nextStep()
}

const goPrev = () => {
  assessmentStore.prevStep()
}

const submitAssessment = () => {
  assessmentStore.calculateBlindSpots()
}

const resetAssessment = () => {
  assessmentStore.resetAssessment()
}
</script>
